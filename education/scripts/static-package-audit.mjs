/** Independently download and audit the public versioned static ZIP.
 * No local dist files are read. ZIP validation precedes serving extracted files.
 * Prepare only: node scripts/static-package-audit.mjs --prepare
 * Run: STATIC_TAG=education-static-v0.2.0 EXPECTED_SOURCE_COMMIT=<40-hex>
 *      EVIDENCE_FILE=evidence/static-package-0.2.json node scripts/static-package-audit.mjs
 * Optional: STATIC_BASE_PATH, SCREENSHOT_DIRECTORY, CHECK_CONNECTIONS, CHROMIUM_PATH.
 * The original evidence/static-package.json is protected from overwrites.
 */
import fs from 'node:fs';
import path from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {createServer} from 'node:http';
import {chromium,expect} from '@playwright/test';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const tag=process.env.STATIC_TAG||'education-static-v0.2.0';
if(!/^education-static-v\d+\.\d+\.\d+$/.test(tag))throw new Error('STATIC_TAG must identify a versioned education-static-vX.Y.Z tag');
const version=tag.slice('education-static-v'.length),edition=version.split('.').slice(0,2).join('.');
const url=`https://github.com/Lightmaze/Math-Island/archive/refs/tags/${tag}.zip`;
const expectedCommit=process.env.EXPECTED_SOURCE_COMMIT||(tag==='education-static-v0.1.0'?'b2d74628aedc78124752b1f22db93aa198631e94':'');
if(expectedCommit&&!/^[a-f0-9]{40}$/.test(expectedCommit))throw new Error('EXPECTED_SOURCE_COMMIT must be a complete 40-character lowercase Git commit');
const prefix=process.env.STATIC_BASE_PATH||'/Math-Island/';
if(!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(prefix))throw new Error('STATIC_BASE_PATH must be an absolute directory path ending in /');
if(process.env.CHECK_CONNECTIONS&&!['0','1'].includes(process.env.CHECK_CONNECTIONS))throw new Error('CHECK_CONNECTIONS must be 0 or 1');
const checkConnections=process.env.CHECK_CONNECTIONS?process.env.CHECK_CONNECTIONS==='1':tag!=='education-static-v0.1.0';
const evidence=path.resolve(root,process.env.EVIDENCE_FILE||`evidence/static-package-${edition}.json`);
const historicalEvidence=path.join(root,'evidence/static-package.json');
if(evidence===historicalEvidence||(fs.existsSync(evidence)&&fs.realpathSync(evidence)===fs.realpathSync(historicalEvidence)))throw new Error('Historical v0.1 evidence is immutable; use a different EVIDENCE_FILE');
const historicalSha256=createHash('sha256').update(fs.readFileSync(historicalEvidence)).digest('hex');
const screenshotDirectory=path.resolve(root,process.env.SCREENSHOT_DIRECTORY||`test-results/static-package-${version}`);
const hash=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const report={schemaVersion:2,reviewer:'/root/education_advanced',started:new Date().toISOString(),request:{tag,url,expectedSourceCommit:expectedCommit||null,basePath:prefix,checkConnections},localDistUsed:false,browserAvailability:'Browser skill was read, but its required js runtime tool is not exposed after tool discovery. The requested reproducible audit uses isolated local Chromium/Playwright; no personal browser profile is accessed.',historicalEvidence:{path:'evidence/static-package.json',sha256Before:historicalSha256},cases:[],pageErrors:[],consoleErrors:[],badResponses:[],failedRequests:[],outsideSubpath:[],externalRequests:[],serverRequests:[]};
if(process.argv.includes('--prepare')){
 if(fs.existsSync(evidence)&&JSON.parse(fs.readFileSync(evidence,'utf8')).executed===true)throw new Error('Preparation cannot replace an executed audit; use a new EVIDENCE_FILE');
 report.status='awaiting-public-tag';report.passed=null;report.executed=false;report.prepared=new Date().toISOString();report.scriptSha256=hash(fileURLToPath(import.meta.url));
 report.pending=['Public tag publication by the release owner','Explicit EXPECTED_SOURCE_COMMIT from that build','Fresh public ZIP download, manifest validation and subpath browser smoke'];
 fs.mkdirSync(path.dirname(evidence),{recursive:true});fs.writeFileSync(evidence,JSON.stringify(report,null,2));console.log(JSON.stringify({status:report.status,tag,evidence,requiresExpectedSourceCommit:!expectedCommit}));process.exit(0);
}
if(!expectedCommit)throw new Error('Set EXPECTED_SOURCE_COMMIT from the release build; the downloaded manifest cannot supply its own expected identity');
const work=fs.mkdtempSync(path.join(tmpdir(),'math-islands-public-package-'));
const archive=path.join(work,'download.zip'),content=path.join(work,'extracted');
fs.mkdirSync(screenshotDirectory,{recursive:true});report.executed=true;
let server,browser;
const validatePython=String.raw`
import sys,json,hashlib,urllib.request,zipfile,stat,re
from pathlib import Path,PurePosixPath
url,archive,destination,expected_commit,expected_prefix=sys.argv[1:]
def valid_path(name,directory=False):
 if not isinstance(name,str) or not name or '\\' in name or '\x00' in name or name.startswith('/') or re.match(r'^[A-Za-z]:',name):raise ValueError('unsafe ZIP path')
 raw=name[:-1] if directory and name.endswith('/') else name
 if not raw or any(part in ('','.','..') for part in raw.split('/')):raise ValueError('unsafe ZIP path segments')
 return raw
negative=['../escape','/absolute','C:/absolute','a\\b','a//b','a/../../escape']
for bad in negative:
 try:valid_path(bad)
 except ValueError:pass
 else:raise AssertionError('path counterexample accepted')
request=urllib.request.Request(url,headers={'User-Agent':'Math-Islands-static-package-audit/1.0'})
with urllib.request.urlopen(request,timeout=40) as response:
 assert response.status==200
 resolved=response.url;assert resolved.startswith('https://codeload.github.com/') or resolved.startswith('https://github.com/')
 headers={key:response.headers.get(key) for key in ['Content-Type','ETag','Last-Modified']}
 total=0
 with open(archive,'wb') as output:
  while True:
   chunk=response.read(1024*1024)
   if not chunk:break
   total+=len(chunk)
   if total>100*1024*1024:raise ValueError('archive exceeds 100 MiB')
   output.write(chunk)
def unique_object(pairs):
 result={}
 for key,value in pairs:
  if key in result:raise ValueError('duplicate JSON key')
  result[key]=value
 return result
with zipfile.ZipFile(archive) as bundle:
 entries=bundle.infolist();assert 0<len(entries)<=1024
 assert sum(entry.file_size for entry in entries)<=128*1024*1024
 seen=set();top=None;files={};directories=set()
 for entry in entries:
  name=valid_path(entry.orig_filename,entry.is_dir())
  assert name not in seen,'duplicate ZIP entry';seen.add(name)
  assert not entry.flag_bits&1,'encrypted ZIP entry'
  mode=stat.S_IFMT(entry.external_attr>>16)
  assert mode in (0,stat.S_IFREG,stat.S_IFDIR),'non-regular ZIP entry (e.g. symlink)'
  assert entry.file_size<=64*1024*1024,'oversized entry'
  first,*rest=name.split('/')
  if top is None:top=first
  assert first==top,'multiple archive roots'
  relative='/'.join(rest)
  if entry.is_dir():directories.add(relative)
  else:
   assert relative,'file outside the archive root';valid_path(relative)
   files[relative]=entry
 assert 'deployment.json' in files
 raw_manifest=bundle.read(files['deployment.json'])
 manifest=json.loads(raw_manifest,object_pairs_hook=unique_object)
 assert manifest['sourceCommit']==expected_commit
 assert manifest['basePath']==expected_prefix
 assert manifest['sourceRepository']=='https://github.com/Lightmaze/Math-Island'
 declared=manifest['files'];assert isinstance(declared,dict) and 0<len(declared)<=1023
 assert {'index.html','data/atlas-index.json','data/atlas-edges.json','data/atlas-bridges.json'}<=set(declared),'required payload missing'
 for name,record in declared.items():
  valid_path(name);assert name!='deployment.json'
  assert isinstance(record,dict) and type(record['bytes']) is int and record['bytes']>=0
  assert isinstance(record['sha256'],str) and re.fullmatch(r'[a-f0-9]{64}',record['sha256'])
 assert set(files)==set(declared)|{'deployment.json'},'unexpected or missing files'
 allowed_directories={''}
 for name in files:
  parent=PurePosixPath(name).parent
  while str(parent)!='.':allowed_directories.add(str(parent));parent=parent.parent
 assert directories<=allowed_directories,'unexpected directory'
 checked=[];destination=Path(destination);destination.mkdir()
 for name,entry in files.items():
  digest=hashlib.sha256();size=0;target=destination.joinpath(*name.split('/'));target.parent.mkdir(parents=True,exist_ok=True)
  with bundle.open(entry) as source,target.open('wb') as output:
   while True:
    chunk=source.read(1024*1024)
    if not chunk:break
    size+=len(chunk);digest.update(chunk);output.write(chunk)
  assert size==entry.file_size
  actual={'path':name,'sha256':digest.hexdigest(),'bytes':size}
  if name!='deployment.json':assert actual['sha256']==declared[name]['sha256'] and size==declared[name]['bytes'],name
  checked.append(actual)
 print(json.dumps({'httpStatus':200,'resolvedUrl':resolved,'responseHeaders':headers,'archiveBytes':Path(archive).stat().st_size,'archiveSha256':hashlib.sha256(Path(archive).read_bytes()).hexdigest(),'archiveRoot':top,'zipEntries':len(entries),'regularFiles':len(files),'declaredPayloadFiles':len(declared),'safePaths':True,'symlinksRejected':True,'duplicatePathsRejected':True,'pathCounterexamplesRejected':len(negative),'exactFileSet':True,'sourceCommit':manifest['sourceCommit'],'basePath':manifest['basePath'],'files':sorted(checked,key=lambda item:item['path'])},ensure_ascii=False))
`;
try{
 report.package=JSON.parse(execFileSync('python',['-c',validatePython,url,archive,content,expectedCommit,prefix],{encoding:'utf8',timeout:60000,maxBuffer:2*1024*1024}));
 const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain'};
 server=createServer((req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;const item={path:pathname,method:req.method,status:200};report.serverRequests.push(item);
  if(!pathname.startsWith(prefix)){item.status=404;res.writeHead(404);res.end();return;}
  let relative;try{relative=decodeURIComponent(pathname.slice(prefix.length))||'index.html'}catch{item.status=400;res.writeHead(400);res.end();return;}
  const file=path.resolve(content,relative);
  if(!file.startsWith(content+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){item.status=404;res.writeHead(404);res.end();return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});const origin=`http://127.0.0.1:${server.address().port}`,base=origin+prefix;
 const executablePath=process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined);
 browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox']});report.browser=await browser.version();
 for(const width of [1440,390])for(const lang of ['zh','en']){
  const item={width,height:width===390?844:1000,language:lang,checks:[]};report.cases.push(item);
  const context=await browser.newContext({viewport:{width,height:item.height},isMobile:width===390,hasTouch:width===390});const page=await context.newPage();page.setDefaultTimeout(12000);
  const localPath=value=>{try{const u=new URL(value);return u.origin===origin?u.pathname+u.search:value;}catch{return value;}};
  page.on('pageerror',error=>report.pageErrors.push({width,lang,message:error.message}));page.on('console',message=>{if(message.type()==='error')report.consoleErrors.push({width,lang,message:message.text()});});
  page.on('request',request=>{const u=new URL(request.url());if(u.protocol==='http:'||u.protocol==='https:'){if(u.origin!==origin)report.externalRequests.push({url:request.url(),type:request.resourceType()});else if(!u.pathname.startsWith(prefix))report.outsideSubpath.push({path:u.pathname,type:request.resourceType()});}});
  page.on('response',response=>{if(response.status()>=400)report.badResponses.push({path:localPath(response.url()),status:response.status()});});
  page.on('requestfailed',request=>report.failedRequests.push({path:localPath(request.url()),error:request.failure()?.errorText}));
  const frameHealthy=async()=>{expect(await page.locator('vite-error-overlay').count()).toBe(0);const d=await page.evaluate(()=>({document:document.documentElement.scrollWidth,viewport:innerWidth}));expect(d.document).toBeLessThanOrEqual(d.viewport+1);};
  try{
   await page.goto(base+`#view=islands&lang=${lang}`);await expect(page.locator('.island-dock')).toBeVisible();await expect(page).toHaveTitle(lang==='zh'?'数学群岛':'Math Islands');await frameHealthy();item.checks.push('home identity, meaningful content, no overlay or overflow');
   await page.screenshot({path:path.join(screenshotDirectory,`${width}-${lang}-home.png`)});
   const search=page.locator('.island-search input');await search.fill(lang==='zh'?'对称林':'Symmetry Grove');await page.locator('.search-results button').filter({hasText:lang==='zh'?'对称林':'Symmetry Grove'}).click();await page.locator('.enter-island').click();await expect(page.locator('.detail-heading h1')).toHaveText(lang==='zh'?'对称林':'Symmetry Grove');
   const outputs=page.locator('.lab-metrics output');await expect(outputs).toHaveCount(3);const before=await outputs.allTextContents();await page.getByRole('button',{name:lang==='zh'?'交换顺序':'Swap the order',exact:true}).click();const after=await outputs.allTextContents();expect(after[0]).toBe(before[1]);expect(after[1]).toBe(before[0]);expect(before[0]).not.toBe(before[1]);await frameHealthy();item.checks.push('D4 noncommuting compositions swap actual outputs');
   await page.locator('.main-nav').getByRole('button',{name:lang==='zh'?'探索群岛':'Explore',exact:true}).click();await page.locator('.island-search input').fill(lang==='zh'?'热流海岸':'Heat Shore');await page.locator('.search-results button').filter({hasText:lang==='zh'?'热流海岸':'Heat Shore'}).click();await page.locator('.enter-island').click();await expect(page.locator('.advanced-lab')).toBeVisible();
   const time=page.locator('.advanced-lab input[type=range]').first(),energy=page.locator('.advanced-metrics > div').last().locator('dd');await time.focus();await time.press('Home');const initialEnergy=Number(await energy.innerText());await time.press('End');const finalEnergy=Number(await energy.innerText());expect(finalEnergy).toBeLessThan(initialEnergy);const data=page.locator('.advanced-data');await data.locator('summary').click();await expect(data.locator('tbody tr')).toHaveCount(9);await frameHealthy();item.checks.push('advanced heat model updates energy and nine-row readout');
   const note=`Public package ${lang} ${width}: D4 order matters; heat energy decreases.`;await page.locator('#island-note').fill(note);
   await page.locator('.main-nav').getByRole('button',{name:lang==='zh'?'全部图谱':'Full atlas',exact:true}).click();await expect(page.locator('.core-atlas__counts small')).toContainText('46,812',{timeout:20000});const route=page.locator('.core-atlas__route-toolbar select');await expect(route).toBeEnabled();await route.selectOption('bridge:003');await expect(page.locator('.core-atlas__bridge-endpoints small')).toHaveText(['pm:HodgeTheory','pm:Matroid']);await expect(page.locator('.core-atlas__bridge-reading dd')).toHaveCount(4);await expect(page.locator('.core-atlas__bridge-source')).toHaveAttribute('href','https://arxiv.org/abs/1511.02888');await frameHealthy();item.checks.push('full atlas and existing bridge003 load from packaged JSON');
   await page.locator('.main-nav').getByRole('button',{name:lang==='zh'?'我的航记':'Field notes',exact:true}).click();await expect(page.locator('.entry-note').filter({hasText:note})).toHaveText(note);const[download]=await Promise.all([page.waitForEvent('download'),page.locator('.journal-export button').filter({hasText:'JSON'}).click()]);const bytes=fs.readFileSync(await download.path()),journal=JSON.parse(bytes.toString());expect(journal.entries['heat-shore'].note).toBe(note);await page.reload();await expect(page.locator('.entry-note').filter({hasText:note})).toHaveText(note);await frameHealthy();item.checks.push('journal survives reload and exports exact note JSON');
   item.exportBytes=bytes.length;item.heatEnergy={initial:initialEnergy,final:finalEnergy};
   if(checkConnections){
    const ids=['fourier-heat','graph-homology','complex-covering','transport-cdf','ideal-zeros','symmetry-representation'];
    for(const id of ids){
     await page.goto(base+`#view=connections&lang=${lang}&connection=${id}`);
     await expect(page.locator(`.connection-experiment[data-connection="${id}"] > section`)).toBeVisible();
     await expect(page.locator('.connection-save')).toBeEnabled();await frameHealthy();
     expect(new URLSearchParams(new URL(page.url()).hash.slice(1)).get('connection')).toBe(id);
    }
    item.loadedConnections=ids;item.checks.push('all six connection deep links load inside the packaged subpath');
    await page.goto(base+`#view=connections&lang=${lang}&connection=fourier-heat`);
    const laboratory=page.locator('.connection-experiment[data-connection="fourier-heat"]');await expect(laboratory).toBeVisible();
    const diffusion=laboratory.locator('input[type=range]').first(),currentEnergy=laboratory.locator('.ac-metrics dd').first();
    await diffusion.focus();await diffusion.press('Home');const initial=Number((await currentEnergy.innerText()).replaceAll(',',''));
    await diffusion.press('End');const final=Number((await currentEnergy.innerText()).replaceAll(',',''));expect(final).toBeLessThan(initial);
    const connectionNote=`Public ${tag} ${lang} ${width}: Fourier coefficients determine heat and energy.`;
    await page.locator('#connection-note').fill(connectionNote);await page.locator('.connection-save').click();
    const readExperiments=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('mathcups.education.experiments.v1')));
    await expect.poll(async()=>(await readExperiments())?.records.length).toBe(1);
    const saved=await readExperiments(),record=saved.records[0];expect(record.connectionId).toBe('fourier-heat');expect(record.note).toBe(connectionNote);
    const p=record.snapshot.parameters;expect(p.time).toBe(Number(await diffusion.getAttribute('max')));
    const expectedEnergy=2*Math.PI*p.mean**2+Math.PI*p.coefficients.reduce((sum,a,index)=>sum+a*a*Math.exp(-2*(index+1)**2*p.time),0);
    expect(record.snapshot.observations.energy).toBeCloseTo(expectedEnergy,12);
    await page.reload();await expect(page.locator('.experiment-record-note')).toHaveText(connectionNote);expect(await readExperiments()).toEqual(saved);
    const [experimentDownload]=await Promise.all([page.waitForEvent('download'),page.locator('.experiment-archive').getByRole('button',{name:lang==='zh'?'导出实验 JSON':'Export experiment JSON',exact:true}).click()]);
    const experimentBytes=fs.readFileSync(await experimentDownload.path());expect(JSON.parse(experimentBytes.toString())).toEqual(saved);await frameHealthy();
    item.connection={energy:{initial,final},savedSnapshot:record.snapshot,exportBytes:experimentBytes.length,persistedAfterReload:true};
    item.checks.push('Fourier/heat control changes computed energy; saved snapshot survives reload and matches exported JSON');
    await page.locator('.connection-experiment').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(screenshotDirectory,`${width}-${lang}-connection.png`)});
   }
   item.finalPath=localPath(page.url());item.passed=true;
  }catch(error){item.passed=false;item.error=String(error);}finally{await context.close();}
  console.log(JSON.stringify(item));
 }
 report.passed=report.cases.length===4&&report.cases.every(item=>item.passed)&&['pageErrors','consoleErrors','badResponses','failedRequests','outsideSubpath','externalRequests'].every(key=>!report[key].length)&&report.serverRequests.every(item=>item.status===200&&item.method==='GET');
 report.resourcePaths=[...new Set(report.serverRequests.map(item=>item.path))].sort();report.scope=`Fresh public ZIP integrity and local ${prefix} subpath smoke, including connection loading/save/export when enabled; not a live GitHub Pages or login-gated Sites interaction test.`;
}catch(error){report.passed=false;report.error=String(error);}
finally{
 if(browser)await browser.close();if(server)await new Promise(resolve=>server.close(resolve));fs.rmSync(work,{recursive:true,force:true});report.temporaryServerClosed=true;report.temporaryArchiveAndExtractionRemoved=true;report.finished=new Date().toISOString();report.scriptSha256=hash(fileURLToPath(import.meta.url));report.historicalEvidence.sha256After=hash(historicalEvidence);report.historicalEvidence.unchanged=report.historicalEvidence.sha256After===historicalSha256;if(!report.historicalEvidence.unchanged)report.passed=false;report.status=report.passed?'passed':'failed';
 fs.mkdirSync(path.dirname(evidence),{recursive:true});fs.writeFileSync(evidence,JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,cases:report.cases.length,verifiedFiles:report.package?.declaredPayloadFiles,archiveSha256:report.package?.archiveSha256,errors:report.error||report.cases.filter(item=>!item.passed),badResponses:report.badResponses,outsideSubpath:report.outsideSubpath,pageErrors:report.pageErrors},null,2));if(!report.passed)process.exitCode=1;
}
