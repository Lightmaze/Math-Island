#!/usr/bin/env python3
import hashlib,json
from pathlib import Path
from urllib.parse import urljoin,urlparse,unquote
from lxml import html
ROOT=Path(__file__).resolve().parents[1]
def main():
 base=ROOT/'sources/wikipedia'
 nodes=json.loads((base/'wikipedia-bridge-nodes.json').read_text());edges=json.loads((base/'wikipedia-bridge-edges.json').read_text());manifest=json.loads((base/'wikipedia-bridge-manifest.json').read_text())
 byid={n['id']:n for n in nodes}; byurl={m['canonical_url']:m for m in manifest};results=[];docs={}
 for n in nodes:
  m=byurl[n['url']];p=ROOT/m['content_cache'];b=p.read_bytes();doc=html.fromstring(b)
  digest=hashlib.sha256(b).hexdigest();titles=[' '.join(''.join(x.itertext()).split()) for x in doc.xpath('//h1')]
  if n.get('source_scope')=='named_article_section':
   titles=[' '.join(''.join(x.itertext()).split()) for x in doc.xpath('//*[@id=$sid]',sid=n['source_section_id'])]
  docs[n['id']]=doc
  results.append({'id':n['id'],'source_file':m['content_cache'],'source_sha256':digest,'hash_matches_node_and_manifest':digest==n['source_sha256']==m['sha256'],'h1_matches_title':n['title'] in titles,'revision_id':m['revision_id']})
 er=[]
 excluded={'navbox','sidebar','reflist','hatnote'}
 for e in edges:
  dest=byid[e['target']]['url'];found=[]
  target_paths={unquote(urlparse(dest).path),'/wiki/'+e['target'].split(':',1)[1],'/wiki/'+byid[e['target']]['title'].replace(' ','_')}
  for a in docs[e['source']].xpath('//a[@href]'):
   u=urlparse(urljoin(byid[e['source']]['url'],a.attrib['href']))
   if unquote(u.path) not in target_paths or u.netloc!='en.wikipedia.org':continue
   chain=list(a.iterancestors());classes=[set(x.attrib.get('class','').split()) for x in chain]
   if not any('mw-parser-output' in c for c in classes):continue
   if any(excluded & c for c in classes):continue
   sn=byid[e['source']]
   if sn.get('source_scope')=='named_article_section' and not any(x.tag=='section' and x.attrib.get('aria-labelledby')==sn['source_section_id'] for x in chain):continue
   found.append(' '.join(''.join(a.itertext()).split()))
  er.append({'source':e['source'],'target':e['target'],'content_link_found':bool(found),'matched_anchor_labels':found,'relation':e['relation'],'evidence_hash_matches_source':e['evidence_sha256']==byid[e['source']]['source_sha256']})
 out={'auditor':'/root/atlas_audit','node_count':len(nodes),'edge_count':len(edges),'node_checks':results,'edge_checks':er,'pass':all(x['hash_matches_node_and_manifest'] and x['h1_matches_title'] for x in results) and all(x['content_link_found'] and x['evidence_hash_matches_source'] for x in er),'scope':'All cached article/section title/hash pairs and all selected article-body hyperlinks; does not establish mathematical truth or proof dependency.'}
 (ROOT/'reports/wikipedia-bridge-independent-audit.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({k:out[k] for k in ['node_count','edge_count','pass','scope']}))
if __name__=='__main__':main()
