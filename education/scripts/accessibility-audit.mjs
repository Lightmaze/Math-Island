/** Automated accessibility checks; these do not establish full WCAG conformance.
 * npm run build first, or set BROWSER_AUDIT_URL to an existing deployment.
 * Isolated Chromium contexts; full report in test-results/accessibility-audit/.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'node:http';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {chromium, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.join(root,'test-results/accessibility-audit');fs.mkdirSync(output,{recursive:true});
const source=fs.readFileSync(path.join(root,'src/data/islands.ts'),'utf8');
const islands=JSON.parse(source.slice(source.indexOf('= [',source.indexOf('export const islands'))+2).trim().replace(/;\s*$/,''));
const report={schemaVersion:1,started:new Date().toISOString(),scope:'Automated axe checks of rendered states; manual keyboard, mathematical graphics, and full conformance require separate review.',tags:['wcag2a','wcag2aa','wcag21a','wcag21aa'],cases:[],pageErrors:[]};
let server,browser,buildSnapshot;
async function baseUrl(){
 if(process.env.BROWSER_AUDIT_URL)return process.env.BROWSER_AUDIT_URL;
 const sourceDist=path.join(root,'dist');if(!fs.existsSync(path.join(sourceDist,'index.html')))throw Error('Run npm run build first, or set BROWSER_AUDIT_URL.');
 buildSnapshot=fs.mkdtempSync(path.join(tmpdir(),'math-islands-accessibility-audit-'));fs.cpSync(sourceDist,buildSnapshot,{recursive:true});const dist=buildSnapshot;
 report.buildIndexSha256=createHash('sha256').update(fs.readFileSync(path.join(dist,'index.html'))).digest('hex');
 const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'};
 server=createServer((req,res)=>{try{const url=new URL(req.url,'http://localhost');const relative=url.pathname==='/'?'index.html':decodeURIComponent(url.pathname).replace(/^\/+/,''),file=path.resolve(dist,relative);if(!file.startsWith(dist+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);}catch{res.writeHead(400);res.end();}});
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});return `http://127.0.0.1:${server.address().port}/`;
}
try{
 const base=await baseUrl(),executablePath=process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined);
 browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox']});report.browser=await browser.version();
 for(const width of [1440,390])for(const lang of ['zh','en']){
  const context=await browser.newContext({viewport:{width,height:width===390?844:1000},isMobile:width===390,hasTouch:width===390});const page=await context.newPage();
  page.on('pageerror',error=>report.pageErrors.push({width,lang,message:error.message}));
  const routes=[{id:'explorer',hash:`view=islands&lang=${lang}`,ready:'.island-dock'},...islands.map(island=>({id:island.id,hash:`view=islands&lang=${lang}&island=${island.id}&lab=1`,ready:'.object-lab,.advanced-lab',title:island.title[lang]})),{id:'full-atlas',hash:`view=atlas&lang=${lang}&core=pm%3AEllipticCurve`,ready:'.core-atlas__selection'},{id:'literature-guide',hash:`view=atlas&lang=${lang}`,ready:'.core-atlas__route-toolbar',bridge:'bridge:003'},{id:'empty-journal',hash:`view=journal&lang=${lang}`,ready:'.journal-page'}];
  for(const route of routes){
   const item={id:route.id,width,lang};
   try{
    await page.goto(base+'#'+route.hash,{waitUntil:'domcontentloaded'});await page.locator(route.ready).waitFor({timeout:20000});if(route.title)await expect(page.locator('.detail-heading h1')).toHaveText(route.title);
    if(route.id==='full-atlas')await expect(page.locator('.core-atlas__counts small')).toContainText('46,812',{timeout:20000});
    if(route.bridge){const select=page.locator('.core-atlas__route-toolbar select');await expect(select).toBeEnabled({timeout:20000});await select.selectOption(route.bridge);await page.locator('.core-atlas__bridge-audit summary').click();}
    const result=await new AxeBuilder({page}).withTags(report.tags).analyze();
    item.violations=result.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,help:v.help,helpUrl:v.helpUrl,nodes:v.nodes.map(n=>({target:n.target,html:n.html,failureSummary:n.failureSummary}))}));
    item.incomplete=result.incomplete.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length}));item.rulePasses=result.passes.length;item.passed=item.violations.length===0;
   }catch(error){item.passed=false;item.error=String(error);}
   report.cases.push(item);console.log(JSON.stringify({id:item.id,width,lang,passed:item.passed,violations:item.violations?.map(v=>`${v.id}:${v.nodes.length}`),error:item.error}));
   fs.writeFileSync(path.join(output,'cases.json'),JSON.stringify(report,null,2));
  }
  await context.close();
 }
 report.finished=new Date().toISOString();report.caseCount=report.cases.length;report.passedCases=report.cases.filter(c=>c.passed).length;report.passed=report.passedCases===report.caseCount&&!report.pageErrors.length;
 report.violationRules=[...new Set(report.cases.flatMap(c=>(c.violations||[]).map(v=>v.id)))];
 report.incompleteRules=[...new Set(report.cases.flatMap(c=>(c.incomplete||[]).map(v=>v.id)))];
 fs.writeFileSync(path.join(output,'cases.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({cases:report.caseCount,passed:report.passedCases,violationRules:report.violationRules,incompleteRules:report.incompleteRules,pageErrors:report.pageErrors},null,2));if(!report.passed)process.exitCode=1;
}finally{if(browser)await browser.close();if(server)await new Promise(resolve=>server.close(resolve));if(buildSnapshot)fs.rmSync(buildSnapshot,{recursive:true,force:true});}
