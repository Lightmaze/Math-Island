#!/usr/bin/env python3
"""Fetch bibliographic bridge sources; no theorem verification implied."""
import concurrent.futures, datetime, hashlib, json, subprocess, sys
from pathlib import Path
import urllib.request
ROOT=Path(__file__).resolve().parents[1]
CACHE=ROOT/'sources/bridge-literature'
CACHE.mkdir(parents=True,exist_ok=True)
bridges=json.loads((ROOT/'reports/math-bridges.json').read_text())['bridges']
if len(sys.argv)>1: bridges=[b for b in bridges if b['id'] in sys.argv[1:]]
def get(b):
    s=b['sources'][0]; record={'bridge_id':b['id'],'url':s['fetch_url'],
        'retrieved_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'verification':'fetch_only_not_proof_validation','passage_reviewed':False}
    try:
        req=urllib.request.Request(s['fetch_url'],headers={'User-Agent':'MathAtlasResearch/1.0 (source bibliography verification)'})
        with urllib.request.urlopen(req,timeout=35) as r:
            content=r.read()
            record.update(status=r.status,final_url=r.url,content_type=r.headers.get('Content-Type'),bytes=len(content))
        if record['status']==200:
            ext='.pdf' if content.startswith(b'%PDF') else '.html'
            p=CACHE/(b['id'].replace(':','-')+ext);p.write_bytes(content)
            record.update(sha256=hashlib.sha256(content).hexdigest(),local_path=str(p.relative_to(ROOT)))
            if ext=='.pdf':
                subprocess.run(['pdftotext','-layout',str(p),str(p.with_suffix('.txt'))],check=True,capture_output=True)
                record['text_path']=str(p.with_suffix('.txt').relative_to(ROOT))
    except Exception as e: record['error']=str(e)
    return record
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex: records=list(ex.map(get,bridges))
if len(sys.argv)>1 and (ROOT/'reports/bridge-source-audit.json').exists():
    old=json.loads((ROOT/'reports/bridge-source-audit.json').read_text())['sources']
    updated={r['bridge_id']:r for r in old}
    updated.update({r['bridge_id']:r for r in records})
    records=sorted(updated.values(),key=lambda r:r['bridge_id'])
out={'scope':'Transport and byte integrity only; manual passage reviews will be recorded separately.',
     'sources':records}
(ROOT/'reports/bridge-source-audit.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
for r in records: print(r['bridge_id'],r.get('status',r.get('error')),r.get('bytes'),r.get('content_type'))
