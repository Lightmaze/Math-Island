/** Production-browser regression: fresh HTTP cache entries must be revalidated.
 * Uses a temporary copy of dist and an isolated browser, never a user's profile.
 * Requires npm run build. Detailed results: test-results/cache-audit/cases.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { chromium, expect } from '@playwright/test';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.join(root,'test-results/cache-audit');fs.mkdirSync(output,{recursive:true});
const snapshot=fs.mkdtempSync(path.join(tmpdir(),'math-islands-cache-audit-'));
fs.cpSync(path.join(root,'dist'),snapshot,{recursive:true});
const digest=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const report={schemaVersion:1,started:new Date().toISOString(),buildIndexSha256:digest(path.join(snapshot,'index.html')),requests:[],pageErrors:[]};
const expected=['/data/atlas-index.json','/data/atlas-edges.json','/data/atlas-bridges.json'];
let failEdges=false,browser,server;
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
try{
 server=createServer((req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname,file=path.resolve(snapshot,pathname==='/'?'index.html':pathname.slice(1));
  if(!file.startsWith(snapshot+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
  if(expected.includes(pathname)){
   const etag='"'+digest(file)+'"';
   const item={path:pathname,method:req.method,ifNoneMatch:req.headers['if-none-match']||null,cacheControl:req.headers['cache-control']||null};
   if(failEdges&&pathname==='/data/atlas-edges.json'){item.status=503;report.requests.push(item);res.writeHead(503,{'Cache-Control':'no-store'});res.end('Deliberate audit failure');return;}
   const headers={'Content-Type':'application/json','Cache-Control':'public, max-age=3600','ETag':etag};
   if(req.headers['if-none-match']===etag){item.status=304;report.requests.push(item);res.writeHead(304,headers);res.end();return;}
   item.status=200;report.requests.push(item);res.writeHead(200,headers);
  }else res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 const base=`http://127.0.0.1:${server.address().port}/`;
 const executablePath=process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined);
 browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox']});report.browser=await browser.version();
 const context=await browser.newContext();await context.addInitScript(()=>{window.__auditFetches=[];const original=window.fetch;window.fetch=(...args)=>{window.__auditFetches.push({url:String(args[0]),cache:args[1]?.cache});return original(...args);};});
 const page=await context.newPage();page.on('pageerror',error=>report.pageErrors.push(error.message));
 const atlas=async()=>{await page.goto(base+'#view=atlas&lang=en&core=pm%3AEllipticCurve');await expect(page.locator('.core-atlas__counts small')).toContainText('46,812',{timeout:20000});await expect(page.locator('.core-atlas__route-toolbar select')).toBeEnabled();};
 const away=async()=>{await page.goto(base+'#view=islands&lang=en');await page.locator('.island-dock').waitFor();};
 await atlas();for(const target of expected)expect(report.requests.some(r=>r.path===target&&r.status===200)).toBe(true);
 await away();await atlas();for(const target of expected)expect(report.requests.some(r=>r.path===target&&r.status===304)).toBe(true);
 report.allThreeFreshResponsesRevalidated=true;
 failEdges=true;await away();await page.goto(base+'#view=atlas&lang=en&core=pm%3AEllipticCurve');await expect(page.locator('.core-atlas__edge-retry')).toBeVisible({timeout:20000});
 await expect(page.locator('.core-atlas__selection > code')).toHaveText('pm:EllipticCurve');await page.locator('.core-atlas__search input').fill('sieve');await expect(page.locator('.core-atlas__results')).toContainText('sieve');report.nodesRemainUsableDuringEdgeFailure=true;
 failEdges=false;await page.locator('.core-atlas__edge-retry').click();await expect(page.locator('.core-atlas__edge-retry')).toHaveCount(0,{timeout:20000});await expect(page.locator('.core-atlas__counts small')).toContainText('46,812');
 const fetches=await page.evaluate(()=>window.__auditFetches.filter(r=>r.url.includes('data/atlas-')));expect(fetches.length).toBeGreaterThanOrEqual(12);expect(fetches.every(r=>r.cache==='no-cache')).toBe(true);
 report.fetches=fetches;report.retryRestoredEdges=true;report.httpMethods=[...new Set(report.requests.map(r=>r.method))];expect(report.httpMethods).toEqual(['GET']);expect(report.pageErrors).toEqual([]);report.passed=true;await context.close();
}catch(error){report.passed=false;report.error=String(error);process.exitCode=1;}
finally{if(browser)await browser.close();if(server)await new Promise(resolve=>server.close(resolve));fs.rmSync(snapshot,{recursive:true,force:true});report.finished=new Date().toISOString();fs.writeFileSync(path.join(output,'cases.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));}
