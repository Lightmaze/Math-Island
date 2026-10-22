#!/usr/bin/env python3
"""Re-open fixed-seed final-map samples in raw sources; no proof certification."""
import hashlib,json,re,tarfile
from pathlib import Path
import audit_atlas
ROOT=Path(__file__).resolve().parents[1]
def sha(b):return hashlib.sha256(b).hexdigest()
def main():
 rows=audit_atlas.records(ROOT/'data/nodes.jsonl');samples,replacements=audit_atlas.final_sample_records(rows,ROOT,36)
 stacks={r['id']:r for r in audit_atlas.records(ROOT/'sources/stacks/entries.jsonl')}
 pm={r['id']:r for r in audit_atlas.records(ROOT/'source/planetmath/entries.jsonl')}
 wiki={r['id']:r for r in json.loads((ROOT/'sources/wikipedia/wikipedia-bridge-nodes.json').read_text())}
 manifest=json.loads((ROOT/'sources/wikipedia/wikipedia-bridge-manifest.json').read_text()); wm={m['canonical_url']:m for m in manifest}
 report=[]
 for n in samples:
  rid=n['id'];r={'id':rid,'label':n['label'],'domain':n['domain'],'kind':n['kind'],'source_url':n['source_url']}
  if rid in stacks:
   s=stacks[rid];p=ROOT/s['source_file'];b=p.read_bytes();t=b.decode();stem=p.stem
   uncomment=re.sub(r'(?<!\\)%[^\n]*','',t)
   label=s['full_label'].removeprefix(stem+'-')
   matches=[]
   for m in re.finditer(r'\\begin\{(lemma|theorem|proposition|corollary|definition)\}(.*?)\\end\{\1\}',uncomment,re.S):
    if '\\label{'+label+'}' in m.group(2):matches.append((m.group(1),m.group(2)))
   tags=dict(line.split(',',1) for line in (ROOT/'sources/stacks/tex/tags/tags').read_text().splitlines() if line and not line.startswith('#'))
   body=matches[0][1].strip() if len(matches)==1 else ''
   r.update(source_file=s['source_file'],source_file_sha256=sha(b),source_hash_matches=sha(b)==s['source_sha256'],tag_label_matches=tags[s['tag']]==s['full_label'],source_environment=matches[0][0] if matches else None,source_unique_statement=len(matches)==1,statement_matches_extraction=body==s['statement_tex'],original_statement_excerpt=body[:4500],excerpt_is_full_statement=len(body)<=4500)
  elif rid in pm:
   s=pm[rid];parts=s['source_file'].split('/');archive=ROOT/'source/planetmath'/(parts[1]+'.tar.gz');filename='/'.join(parts[2:])
   extracted=ROOT/'sources/planetmath/tex'/('/'.join(parts[1:]))
   if extracted.exists():
    b=extracted.read_bytes();member=filename;method='packaged_original_tex_file'
   else:
    with tarfile.open(archive) as tar:
     ms=[m for m in tar.getmembers() if m.isfile() and m.name.endswith('/'+filename)]
     assert len(ms)==1
     b=tar.extractfile(ms[0]).read();member=ms[0].name
    method='original_archive_member'
   t=b.decode(errors='replace');body=t.split('\\begin{document}',1)[-1].split('\\end{document}',1)[0]
   r.update(source_file=str(extracted.relative_to(ROOT)),source_archive_provenance=str(archive.relative_to(ROOT)),source_member=member,source_read_method=method,source_file_sha256=sha(b),source_hash_matches=sha(b)==s['source_sha256'],canonical_name_present='\\pmcanonicalname{'+s['canonical_name']+'}' in t,source_type_present='\\pmtype{'+s['source_type']+'}' in t,original_statement_excerpt=body[:4500],excerpt_is_full_statement=len(body)<=4500)
  elif rid in wiki:
   s=wiki[rid];m=wm[s['url']];b=(ROOT/m['content_cache']).read_bytes()
   r.update(source_file=m['content_cache'],source_file_sha256=sha(b),source_hash_matches=sha(b)==s['source_sha256'],original_statement_excerpt=s['summary'],excerpt_is_full_statement=False,independent_article_review='reports/wikipedia-bridge-independent-audit.json')
  else:r['error']='No source-level entry found'
  report.append(r)
 out={'auditor':'/root/atlas_audit','seed':audit_atlas.SEED,'algorithm':'audit_atlas.sample_records final-node stratified deterministic sample','sample_size':len(report),'replacements':replacements,'samples':report,'scope':'Original-source identity and statement extraction; requires separate manual reading notes, is not full theorem-proof verification.'}
 (ROOT/'reports/atlas-original-source-samples.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({'sample_size':len(report),'sources':dict(__import__('collections').Counter(r['id'].split(':',1)[0] for r in report))}))
if __name__=='__main__':main()
