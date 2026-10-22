/**
 * Independent production-browser audit. Run `npm run build` first.
 * By default this script serves dist/ on a loopback ephemeral port and closes it.
 * Set BROWSER_AUDIT_URL to audit an already-running deployment instead.
 * Optional CHROMIUM_PATH selects a system browser; Playwright's installed browser
 * is used otherwise. Detailed cases/screenshots are written to test-results/.
 * Every browser context is isolated; no personal browser profile is read.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { chromium, expect } from '@playwright/test';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.resolve(root,'test-results/browser-audit');
fs.mkdirSync(output,{recursive:true});
const source=fs.readFileSync(path.join(root,'src/data/islands.ts'),'utf8');
const lessons=JSON.parse(source.slice(source.indexOf('= [',source.indexOf('export const islands'))+2).trim().replace(/;\s*$/,''));
let localServer, buildSnapshot, buildIndexSha256;
async function serveBuild(){
 const sourceDist=path.join(root,'dist');
 if(!fs.existsSync(path.join(sourceDist,'index.html')))throw new Error('Build missing: run npm run build first, or set BROWSER_AUDIT_URL.');
 buildSnapshot=fs.mkdtempSync(path.join(tmpdir(),'math-islands-browser-audit-'));
 fs.cpSync(sourceDist,buildSnapshot,{recursive:true});
 const dist=buildSnapshot;
 buildIndexSha256=createHash('sha256').update(fs.readFileSync(path.join(dist,'index.html'))).digest('hex');
 const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2'};
 localServer=createServer((request,response)=>{
  try{
   const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
   const relative=pathname==='/'?'index.html':pathname.replace(/^\/+/,'');
   const file=path.resolve(dist,relative);
   if(!file.startsWith(dist+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){response.writeHead(404);response.end('Not found');return;}
   response.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
   fs.createReadStream(file).pipe(response);
  }catch{response.writeHead(400);response.end('Bad request');}
 });
 await new Promise((resolve,reject)=>{localServer.once('error',reject);localServer.listen(0,'127.0.0.1',resolve);});
 return `http://127.0.0.1:${localServer.address().port}/`;
}

async function auditLessons(browser,base){
 const report={started:new Date().toISOString(),cases:[],errors:[]};
for(const width of [1440,390])for(const lang of ['zh','en']){
 const context=await browser.newContext({viewport:{width,height:width===390?844:1000},deviceScaleFactor:1,isMobile:width===390,hasTouch:width===390});
 const page=await context.newPage();
 const exceptions=[];page.on('pageerror',e=>exceptions.push({url:page.url(),message:e.message}));
 for(const [i,lesson] of lessons.entries()){
  const item={id:lesson.id,key:lesson.labKey,width,lang,controls:[],errors:[]};
  try{
   await page.goto(`${base}#view=islands&lang=${lang}&island=${lesson.id}&lab=1`,{waitUntil:'domcontentloaded'});
   const lab=page.locator('.object-lab, .advanced-lab');await lab.waitFor({state:'visible',timeout:15000});
   await expect(page.locator('.detail-heading h1')).toHaveText(lesson.title[lang]);
   const ranges=await lab.locator('input[type=range]').all();
   for(const input of ranges){
    await input.focus();await input.press('Home');const lo=await input.inputValue();await input.press('End');const hi=await input.inputValue();
    item.controls.push({type:'range',id:await input.getAttribute('id'),minimumReached:lo,maximumReached:hi});
    if(Number(lo)!==Number(await input.getAttribute('min'))||Number(hi)!==Number(await input.getAttribute('max')))throw Error(`range endpoints failed ${lo}/${hi}`);
   }
   const selectIds=await lab.locator('select').evaluateAll(xs=>xs.map(x=>x.id));
   for(const id of selectIds){
    const select=page.locator(`[id=${JSON.stringify(id)}]`);if(!await select.count())continue;
    const options=await select.locator('option').evaluateAll(xs=>xs.filter(x=>!x.disabled).map(x=>x.value));
    for(const value of options){if(await select.count())await select.selectOption(value);}
    item.controls.push({type:'select',id,options});
   }
   for(const checkbox of await lab.locator('input[type=checkbox]').all()){
    await checkbox.check();await expect(checkbox).toBeChecked();await checkbox.uncheck();item.controls.push({type:'checkbox'});
   }
   const buttons=lab.getByRole('button');const n=await buttons.count();
   for(let j=0;j<n;j++){const button=buttons.nth(j);if(await button.isEnabled()){const text=await button.innerText();await button.click();item.controls.push({type:'button',text});}}
   for(const figureButton of await lab.locator('.lab-figure-tools button,.advanced-plot-controls button').all()) {
    if(await figureButton.getAttribute('aria-pressed')==='true') {
     await figureButton.click();await expect(figureButton).toHaveAttribute('aria-pressed','false');
     item.controls.push({type:'figure-fit'});
    }
   }
   for(const details of await lab.locator('details').all()) {
    await details.locator('summary').click();await expect(details).toHaveAttribute('open','');
    if(await details.locator('table').count())expect(await details.locator('tbody tr').count()).toBeGreaterThan(0);
    item.controls.push({type:'data-readout'});
   }
   const tabs=page.getByRole('tab');
   if(!await tabs.first().isVisible()) {
    const disclosure=page.locator('details').filter({has:tabs.first()});
    if(await disclosure.count())await disclosure.locator('summary').click();
   }
   await tabs.first().focus();await tabs.first().press('ArrowRight');await expect(tabs.nth(1)).toHaveAttribute('aria-selected','true');
   await page.locator('.reflection > button').click();await expect(page.locator('.reflection-answer')).toBeVisible();
   const body=await lab.locator('.lab-metrics,.advanced-metrics').innerText();if(/\bNaN\b|\bInfinity\b|undefined/.test(body))throw Error('Invalid numerical text in laboratory');
   const dimensions=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));
   if(dimensions.document>dimensions.viewport+1)throw Error(`Horizontal overflow ${JSON.stringify(dimensions)}`);
   const missingLabels=await lab.locator('input,select,button').evaluateAll(xs=>xs.filter(x=>!x.getAttribute('aria-label')&&!x.getAttribute('aria-labelledby')&&!(x.labels?.length)&&!x.textContent?.trim()).map(x=>x.outerHTML));
   if(missingLabels.length)throw Error(`Unlabelled controls ${missingLabels.join(',')}`);
   item.sources=await page.locator('.lesson-sources a').count();
   if(i===1||lesson.labKey==='algebraiccurve'||lesson.labKey==='complex'){
    await page.locator('.laboratory').scrollIntoViewIfNeeded();await page.screenshot({path:`${output}/${width}-${lang}-${lesson.labKey}.png`,fullPage:false});
   }
   item.passed=true;
  }catch(error){item.errors.push(String(error));item.passed=false;report.errors.push({id:lesson.id,width,lang,error:String(error)});}
  report.cases.push(item);
  if((i+1)%6===0)console.log(JSON.stringify({width,lang,completed:i+1,failed:report.errors.length}));
 }
 report.errors.push(...exceptions);await context.close();fs.writeFileSync(`${output}/lesson-cases.json`,JSON.stringify(report,null,2));
}

 report.finished=new Date().toISOString();report.total=report.cases.length;report.passed=report.cases.filter(c=>c.passed).length;
 fs.writeFileSync(`${output}/lesson-cases.json`,JSON.stringify(report,null,2));return report;
}

async function auditNavigation(browser,base){
 const out=output,report={started:new Date().toISOString(),checks:[],pageErrors:[]};
const context=await browser.newContext({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write']});
context.setDefaultTimeout(10000);const page=await context.newPage();page.on('pageerror',e=>report.pageErrors.push(e.message));
async function check(name,fn){try{const detail=await fn();report.checks.push({name,passed:true,...detail});}catch(e){report.checks.push({name,passed:false,error:String(e)});}console.log(JSON.stringify(report.checks.at(-1)));fs.writeFileSync(`${out}/navigation-cases.json`,JSON.stringify(report,null,2));}
const lesson=base+'#view=islands&lang=en&island=elliptic-garden&lab=1';
await check('skip-link preserves hash route and moves focus',async()=>{await page.goto(lesson);await page.locator('.object-lab').waitFor();const before=page.url();await page.locator('.skip-link').focus();await page.keyboard.press('Enter');expect(page.url()).toBe(before);expect(await page.evaluate(()=>document.activeElement.id)).toBe('main-content');return{url:page.url()};});
const note='Independent review note: P + (−P) = O.\n<script>window.fakeExecution = true</script>\n这是本地测试记录。';
await check('notes survive reload and language changes; text stays inert',async()=>{await page.goto(lesson);await page.locator('#island-note').fill(note);await page.locator('.observed').click();await expect(page.locator('.observed')).toHaveAttribute('aria-pressed','true');await page.reload();await expect(page.locator('#island-note')).toHaveValue(note);await page.getByRole('button',{name:'中文',exact:true}).click();await expect(page.locator('.detail-heading h1')).toHaveText('椭圆曲线园');await expect(page.locator('#island-note')).toHaveValue(note);expect(await page.evaluate(()=>window.fakeExecution)).toBeUndefined();return{entry:await page.evaluate(()=>JSON.parse(localStorage.getItem('mathcups.education.journal.v1')).entries['elliptic-garden'])};});
await check('journal exports exact JSON and Markdown contents',async()=>{await page.getByRole('button',{name:'我的航记',exact:true}).click();await expect(page.locator('.entry-note')).toHaveText(note);const [md]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'导出 Markdown',exact:true}).click()]);const mdPath=await md.path();const mdText=fs.readFileSync(mdPath,'utf8');expect(mdText).toContain(note);expect(mdText).toContain('pm:EllipticCurve');const[js]=await Promise.all([page.waitForEvent('download'),page.locator('.journal-export button').filter({hasText:'JSON'}).click()]);const jsText=fs.readFileSync(await js.path(),'utf8'),j=JSON.parse(jsText);expect(j.entries['elliptic-garden'].note).toBe(note);expect(j.entries['elliptic-garden'].observed).toBe(true);return{files:[md.suggestedFilename(),js.suggestedFilename()],jsonVersion:j.version,bytes:[Buffer.byteLength(mdText),Buffer.byteLength(jsText)]};});
await check('cross-tab notes synchronize without navigation',async()=>{const other=await context.newPage();await other.goto(lesson);await other.locator('#island-note').fill('Cross-tab synchronization checked.');await expect(page.locator('.entry-note')).toHaveText('Cross-tab synchronization checked.');await other.close();return{};});
await check('cancel preserves note; confirmed deletion removes only local entry',async()=>{page.once('dialog',d=>d.dismiss());await page.locator('.entry-delete').click();await expect(page.locator('.journal-entries li')).toHaveCount(1);page.once('dialog',d=>d.accept());await page.locator('.entry-delete').click();await expect(page.locator('.empty-journal')).toBeVisible();return{};});
await check('browser Back and Forward restore lesson route',async()=>{await page.goto(base+'#view=islands&lang=en&island=elliptic-garden');await page.getByRole('button',{name:'Explore this island',exact:true}).click();await expect(page.locator('.detail-heading h1')).toHaveText('Elliptic Garden');await page.getByRole('button',{name:'Back to the islands',exact:true}).click();await expect(page.locator('.island-dock')).toBeVisible();await page.goBack();await expect(page.locator('.detail-heading h1')).toHaveText('Elliptic Garden');await page.goForward();await expect(page.locator('.island-dock')).toBeVisible();return{};});
let sharedUrl='',zoom='';
await check('full atlas deep link, quality note, keyboard and share',async()=>{await page.goto(base+'#view=atlas&lang=en&core=pm%3ASieveOfEratosthenes');await expect(page.locator('.core-atlas__counts small')).toContainText('46,812',{timeout:20000});await expect(page.locator('.core-atlas__selection h3')).toContainText('sieve of Eratosthenes');await page.locator('.core-atlas__quality summary').click();await expect(page.locator('.core-atlas__quality')).toHaveAttribute('open','');await page.locator('.core-atlas__search input').fill('sieve');await page.locator('.core-atlas canvas').focus();const before=await page.locator('.core-atlas__map-scale').innerText();await page.keyboard.press('+');await expect(page.locator('.core-atlas__map-scale')).not.toHaveText(before);await page.keyboard.press('ArrowRight');zoom=await page.locator('.core-atlas__map-scale').innerText();await page.locator('.core-atlas__map-actions button').nth(1).click();sharedUrl=await page.evaluate(()=>navigator.clipboard.readText());expect(new URL(sharedUrl).searchParams.get('atlasSearch')).toBe('sieve');expect(new URL(sharedUrl).searchParams.get('atlasNode')).toBe('pm:SieveOfEratosthenes');return{sharedUrl,zoom,selectedId:await page.locator('.core-atlas__selection > code').innerText()};});
await check('shared atlas URL restores root route, selection, search and zoom',async()=>{expect(sharedUrl).not.toBe('');const other=await context.newPage();await other.goto(sharedUrl);await expect(other.locator('.core-atlas__counts small')).toContainText('46,812',{timeout:20000});await expect(other.locator('.core-atlas__search input')).toHaveValue('sieve');await expect(other.locator('.core-atlas__selection > code')).toHaveText('pm:SieveOfEratosthenes');await expect(other.locator('.core-atlas__map-scale')).toHaveText(zoom);await other.close();return{};});
await check('atlas PNG download contains a real PNG payload',async()=>{const[d]=await Promise.all([page.waitForEvent('download'),page.locator('.core-atlas__map-actions button').first().click()]);const bytes=fs.readFileSync(await d.path());expect(bytes.subarray(1,4).toString()).toBe('PNG');return{filename:d.suggestedFilename(),bytes:bytes.length};});
await check('atlas selection opens matching authored lesson',async()=>{await page.locator('.core-atlas__lesson').click();await expect(page.locator('.detail-heading h1')).toHaveText('Prime Reef');await expect(page.locator('.object-lab')).toBeVisible();return{url:page.url()};});
await check('blocked browser storage reports failure while keeping exportable in-memory notes',async()=>{const isolated=await browser.newContext();await isolated.addInitScript(()=>{Storage.prototype.getItem=function(){throw new DOMException('Blocked','SecurityError')};Storage.prototype.setItem=function(){throw new DOMException('Quota','QuotaExceededError')};});const p=await isolated.newPage();await p.goto(lesson);await p.locator('#island-note').fill('Memory-only note');await expect(p.locator('.note-status')).toContainText('storage is unavailable');await p.getByRole('button',{name:'Field notes',exact:true}).click();await expect(p.locator('.entry-note')).toHaveText('Memory-only note');const[d]=await Promise.all([p.waitForEvent('download'),p.locator('.journal-export button').filter({hasText:'JSON'}).click()]);expect(JSON.parse(fs.readFileSync(await d.path(),'utf8')).entries['elliptic-garden'].note).toBe('Memory-only note');await isolated.close();return{};});
await check('malformed saved journal is recovered as an empty journal',async()=>{const isolated=await browser.newContext();await isolated.addInitScript(()=>localStorage.setItem('mathcups.education.journal.v1','{broken json'));const p=await isolated.newPage();await p.goto(base+'#view=journal&lang=en');await expect(p.locator('.empty-journal')).toBeVisible();await isolated.close();return{};});
await check('mobile full-atlas controls, selected source, and no horizontal overflow',async()=>{const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const p=await mobile.newPage();await p.goto(base+'#view=atlas&lang=zh&core=pm%3AEllipticCurve');await expect(p.locator('.core-atlas__counts small')).toContainText('46,812',{timeout:20000});await expect(p.locator('.core-atlas__selection > code')).toHaveText('pm:EllipticCurve');await p.locator('.core-atlas__domain-select select').selectOption({index:1});await p.locator('.core-atlas__search input').fill('no-entry-987654321');await expect(p.locator('.core-atlas__results')).toContainText('0');await p.screenshot({path:out+'/mobile-full-atlas.png',fullPage:true});const d=await p.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));expect(d.document).toBeLessThanOrEqual(d.viewport);await mobile.close();return d;});

await check('import keeps newer local data, unknown lessons, and inherited-property names',async()=>{
 const isolated=await browser.newContext();const p=await isolated.newPage();
 const entry=(islandId,note,updatedAt='2026-10-22T10:00:00.000Z')=>({islandId,coreId:'test:'+islandId,note,observed:false,updatedAt});
 const initial={version:1,entries:{'elliptic-garden':entry('elliptic-garden','Local elliptic note'),'prime-reef':entry('prime-reef','Unrelated local note')}};
 await isolated.addInitScript(initial=>{if(!localStorage.getItem('mathcups.education.journal.v1'))localStorage.setItem('mathcups.education.journal.v1',JSON.stringify(initial));},initial);
 await p.goto(base+'#view=journal&lang=en');
 const incoming={version:1,entries:{'elliptic-garden':entry('elliptic-garden','Older imported note','2026-10-22T09:00:00.000Z'),'mean-tide':entry('mean-tide','A new imported note'),'archived-lesson':entry('archived-lesson','Unknown lesson must survive'),'toString':entry('toString','Prototype-name lesson must survive')}};
 const upload=async value=>p.locator('input[type=file]').setInputFiles({name:'review-backup.json',mimeType:'application/json',buffer:Buffer.from(typeof value==='string'?value:JSON.stringify(value))});
 const state=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('mathcups.education.journal.v1')));
 await upload(incoming);await expect(p.locator('.journal-import-status')).toContainText('Read 4 records');await expect(p.locator('.journal-entries li')).toHaveCount(5);
 let merged=await state();expect(merged.entries['elliptic-garden'].note).toBe('Local elliptic note');expect(merged.entries['prime-reef'].note).toBe('Unrelated local note');expect(merged.entries.toString.note).toBe('Prototype-name lesson must survive');await expect(p.locator('.archived-note')).toHaveCount(2);
 await upload({version:1,entries:{'elliptic-garden':entry('elliptic-garden','Newer imported note','2026-10-22T12:00:00.000Z')}});await expect(p.locator('.journal-import-status')).toContainText('Read 1 records');
 await upload({version:1,entries:{'elliptic-garden':entry('elliptic-garden','Equal-timestamp conflicting note','2026-10-22T12:00:00.000Z')}});merged=await state();expect(merged.entries['elliptic-garden'].note).toBe('Newer imported note');expect(Object.keys(merged.entries)).toHaveLength(5);
 const before=JSON.stringify(merged);
 await upload({version:1,entries:{'valid-new':entry('valid-new','Must not partly import'),'invalid-date':entry('invalid-date','Bad date','not-a-date')}});await expect(p.locator('.journal-import-status.is-error')).toContainText('existing notes have not changed');expect(JSON.stringify(await state())).toBe(before);
 await upload('x'.repeat(5*1024*1024+1));await expect(p.locator('.journal-import-status.is-error')).toContainText('existing notes have not changed');expect(JSON.stringify(await state())).toBe(before);
 const[d]=await Promise.all([p.waitForEvent('download'),p.locator('.journal-export button').filter({hasText:'JSON'}).click()]);const exported=fs.readFileSync(await d.path());expect(JSON.parse(exported.toString())).toEqual(merged);
 const round=await browser.newContext();const q=await round.newPage();await q.goto(base+'#view=journal&lang=en');await q.locator('input[type=file]').setInputFiles({name:'roundtrip.json',mimeType:'application/json',buffer:exported});await expect(q.locator('.journal-entries li')).toHaveCount(5);expect(await q.evaluate(()=>JSON.parse(localStorage.getItem('mathcups.education.journal.v1')))).toEqual(merged);
 await isolated.close();await round.close();return{importedUnique:5,unknownLessons:2,partialImportRejected:true,oversizeRejected:true,roundTripIdentical:true};
});



await check('mathematical conditions change visible conclusions',async()=>{
 const visit=async id=>{await page.goto(base+`#view=islands&lang=en&island=${id}&lab=1`);await page.locator('.object-lab,.advanced-lab').waitFor();};
 const metric=label=>page.locator('.lab-metrics > div').filter({hasText:label}).locator('output');
 await visit('covering-terraces');await expect(metric('Lift returns to 1?')).toHaveText('Not yet');
 await page.getByRole('button',{name:'One more loop',exact:true}).click();await expect(metric('Lift returns to 1?')).toHaveText('Not yet');
 await page.getByRole('button',{name:'One more loop',exact:true}).click();await expect(metric('Lift returns to 1?')).toHaveText('Yes');
 await visit('matroid-forest');await page.getByRole('button',{name:'AD',exact:true}).click();await page.getByRole('button',{name:'BC',exact:true}).click();
 await expect(metric('r(A)')).toHaveText('2');await expect(metric('Status')).toHaveText('Dependent: cycle');
 await visit('prime-reef');await page.getByLabel('Integer limit').selectOption('120');const passes=page.getByLabel(/Completed passes/);await passes.focus();await passes.press('End');await expect(metric('Primes remaining')).toHaveText('30');
 await visit('elliptic-garden');await page.getByRole('combobox',{name:/^Construction/}).selectOption('inverse');await expect(metric('Sum')).toHaveText('𝒪');await page.getByRole('combobox',{name:/^Construction/}).selectOption('singular');await expect(metric('Sum')).toHaveText('Smoothness fails');
 await visit('type-observatory');await page.getByLabel('Argument assumption').selectOption('B');await expect(metric('Conclusion type')).toHaveText('?');
 await visit('sheaf-canopy');await expect(page.locator('.advanced-metrics > div').filter({hasText:'Gluing'}).locator('dd')).toHaveText('incompatible');await page.getByRole('button',{name:'Make the sections agree',exact:true}).click();await expect(page.locator('.advanced-metrics > div').filter({hasText:'Gluing'}).locator('dd')).toHaveText('compatible');
 return{coveringLoops:[1,2,3],triangleRank:2,sieve120PrimeCount:30,inverseAtInfinity:true,singularLawRefused:true,typeMismatchRefused:true,gluingNeedsCompatibility:true};
});
await check('clipboard denial provides a manually copyable lesson URL',async()=>{
 const isolated=await browser.newContext();const p=await isolated.newPage();
 try{await p.goto(lesson);await p.evaluate(()=>{navigator.clipboard.writeText=async()=>{throw new DOMException('Denied','NotAllowedError')};});
 await p.locator('.share-control button').click();await expect(p.locator('.share-fallback input')).toHaveValue(p.url());return{};
 }finally{await isolated.close();}
});

await check('all 21 literature guides preserve bilingual mathematical statements and source attribution',async()=>{
 const bridges=JSON.parse(fs.readFileSync(path.join(root,'public/data/atlas-bridges.json'),'utf8')).records;
 let visited=0;
 for(const language of ['zh','en']){
  await page.goto(base+`#view=atlas&lang=${language}`);
  const selector=page.locator('.core-atlas__route-toolbar select');await expect(selector).toBeEnabled({timeout:20000});
  for(const bridge of bridges){
   await selector.selectOption(bridge.id);const article=page.locator('.core-atlas__bridge'),text=bridge.text[language];
   await expect(article.locator('h3')).toHaveText(text.title);
   await expect(article.locator('.core-atlas__bridge-reading dd')).toHaveText([text.mechanism,text.conditions,text.conclusion,text.limitations]);
   await expect(article.locator('.core-atlas__bridge-source')).toHaveAttribute('href',text.sourceUrl);
   await expect(article.locator('.core-atlas__bridge-endpoints small')).toHaveText([bridge.sourceId,bridge.targetId]);
   const audit=article.locator('.core-atlas__bridge-audit');if(!await audit.evaluate(x=>x.open))await audit.locator('summary').click();
   await expect(audit).toContainText(bridge.sourceAudit.passage_read_scope);await expect(audit).toContainText(bridge.sourceAudit.sha256);
   if(text.reportCommit)await expect(audit.locator('a')).toHaveAttribute('href',`https://github.com/Lightmaze/Math-Island/blob/${text.reportCommit}/${text.reportPath}#L${text.reportLine}`);
   visited++;
  }
 }
 return{guides:bridges.length,bilingualPanels:visited};
});

await check('a selected literature guide survives sharing and keeps its two recorded endpoints',async()=>{
 await page.goto(base+'#view=atlas&lang=en');const selector=page.locator('.core-atlas__route-toolbar select');await expect(selector).toBeEnabled({timeout:20000});await selector.selectOption('bridge:003');
 await page.locator('.core-atlas__map-actions button').nth(1).click();const url=await page.evaluate(()=>navigator.clipboard.readText());expect(new URL(url).searchParams.get('atlasBridge')).toBe('bridge:003');
 const other=await context.newPage();await other.goto(url);await expect(other.locator('.core-atlas__route-toolbar select')).toHaveValue('bridge:003',{timeout:20000});
 const expected=JSON.parse(fs.readFileSync(path.join(root,'public/data/atlas-bridges.json'),'utf8')).records.find(x=>x.id==='bridge:003');
 await expect(other.locator('.core-atlas__bridge-endpoints small')).toHaveText([expected.sourceId,expected.targetId]);
 await other.locator('.core-atlas__bridge-endpoints > div > button').first().click();await expect(other.locator('.core-atlas__selection > code')).toHaveText(expected.sourceId);
 await other.close();return{bridge:'bridge:003',endpoints:[expected.sourceId,expected.targetId]};
});

await check('failed lesson chunks preserve saved notes and recover after reload in both languages',async()=>{
 const outcomes=[];
 for(const language of ['en','zh']){
  const isolated=await browser.newContext();const p=await isolated.newPage();const deliberateErrors=[],aborted=[];
  p.on('pageerror',error=>deliberateErrors.push(error.message));
  const entry={version:1,entries:{'elliptic-garden':{islandId:'elliptic-garden',coreId:'pm:EllipticCurve',note:'Saved before a failed chunk.',observed:true,updatedAt:'2026-10-22T10:00:00.000Z'}}};
  await isolated.addInitScript(value=>localStorage.setItem('mathcups.education.journal.v1',JSON.stringify(value)),entry);
  const pattern=/\/(?:assets\/ObjectLab-[^/?]+\.js|src\/labs\/ObjectLab\.tsx)(?:\?.*)?$/;
  await p.route(pattern,route=>{aborted.push(route.request().url());return route.abort('failed');});
  try{
   await p.goto(base+`#view=islands&lang=${language}&island=elliptic-garden&lab=1`);
   await expect(p.locator('.error-page h1')).toHaveText(language==='en'?'This view could not be loaded.':'这片海域暂时没有展开。');expect(aborted.length).toBeGreaterThan(0);
   const [download]=await Promise.all([p.waitForEvent('download'),p.locator('.error-actions button').nth(1).click()]);
   expect(JSON.parse(fs.readFileSync(await download.path(),'utf8'))).toEqual(entry);
   await p.unroute(pattern);await p.locator('.error-actions button').first().click();await expect(p.locator('.object-lab')).toBeVisible({timeout:20000});await expect(p.locator('#island-note')).toHaveValue(entry.entries['elliptic-garden'].note);
   // Only deliberately aborted dynamic-import errors are expected in this case.
   for(const error of deliberateErrors)expect(error).toMatch(/dynamically imported module|Failed to fetch|Importing a module script failed|Loading chunk/);
   outcomes.push({language,failedRequests:aborted.length,expectedPageErrors:deliberateErrors.length,recovered:true,savedNotesPreserved:true});
  }finally{await isolated.close();}
 }
 return{outcomes};
});

await check('educational map keyboard controls, bilingual search, index, filters and journeys select real lessons',async()=>{
 await page.goto(base+'#view=islands&lang=en');await page.locator('.island-dock').waitFor();
 const map=page.locator('.education-map'),world=page.locator('.island-world');await map.focus();
 const initial=await world.getAttribute('style');await page.keyboard.press('+');await expect(world).not.toHaveAttribute('style',initial);
 await page.keyboard.press('Home');const fitted=await world.getAttribute('style');await page.keyboard.press('ArrowRight');await expect(world).not.toHaveAttribute('style',fitted);
 await page.locator('.map-list-toggle').click();await expect(page.locator('.island-directory li')).toHaveCount(lessons.length);
 const first=page.locator('.island-directory li button').first();await first.focus();await first.press('Enter');await expect(page.locator('.dock-heading h2')).toHaveText(lessons[0].title.en);
 await page.locator('.island-search input').fill('椭圆');await page.locator('.search-results button').filter({hasText:'Elliptic Garden'}).click();await expect(page.locator('.dock-heading h2')).toHaveText('Elliptic Garden');
 await page.locator('.domain-nav').getByRole('button',{name:'Number theory',exact:true}).click();await expect(page.locator('.island-hit-target:not([disabled])')).toHaveCount(2);
 await page.locator('.domain-nav').getByRole('button',{name:'All regions',exact:true}).click();
 const journeys=page.locator('.journey-select select'),values=await journeys.locator('option').evaluateAll(options=>options.map(option=>option.value).filter(Boolean));
 for(const value of values){await journeys.selectOption(value);await expect(page.locator('.journey-caption')).toContainText('editorial learning sequence');expect(await page.locator('.learning-route-lines > path').count()).toBeGreaterThan(0);}
 await page.locator('.island-search input').fill('unknown-island-987654321');await expect(page.locator('.search-results')).toContainText('No matching lesson');
 return{lessonsInIndex:lessons.length,bilingualSearch:true,journeys:values.length,keyboardPanZoom:true};
});

 report.finished=new Date().toISOString();report.passed=report.checks.filter(c=>c.passed).length;report.failed=report.checks.filter(c=>!c.passed).length;
 fs.writeFileSync(`${out}/navigation-cases.json`,JSON.stringify(report,null,2));await context.close();return report;
}

let browser;
try{
 const base=process.env.BROWSER_AUDIT_URL||await serveBuild();
 const executablePath=process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined);
 browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox']});
 const started=new Date().toISOString();
 const lessonReport=await auditLessons(browser,base);
 const navigationReport=await auditNavigation(browser,base);
 const summary={schemaVersion:1,started,finished:new Date().toISOString(),browser:await browser.version(),buildIndexSha256,
  lessonCount:lessons.length,configurations:lessonReport.total,passedConfigurations:lessonReport.passed,
  navigationChecks:navigationReport.checks.length,passedNavigationChecks:navigationReport.passed,
  lessonErrors:lessonReport.errors,navigationErrors:navigationReport.checks.filter(c=>!c.passed),pageErrors:navigationReport.pageErrors,
  scope:'24 lessons × two languages × desktop/mobile; route, focus, storage, import/export, and atlas integration.'};
 summary.passed=summary.configurations===lessons.length*4&&summary.passedConfigurations===summary.configurations
  &&summary.passedNavigationChecks===summary.navigationChecks&&!summary.lessonErrors.length&&!summary.pageErrors.length;
 fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify(summary,null,2));
 console.log(JSON.stringify(summary,null,2));if(!summary.passed)process.exitCode=1;
}finally{
 if(browser)await browser.close();
 if(localServer)await new Promise(resolve=>localServer.close(resolve));
 if(buildSnapshot)fs.rmSync(buildSnapshot,{recursive:true,force:true});
}
