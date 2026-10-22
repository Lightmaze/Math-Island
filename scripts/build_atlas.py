#!/usr/bin/env python3
"""Build source-indexed islands, explicit reference graph and navigation database."""
import collections,csv,hashlib,json,pathlib,re,sqlite3,unicodedata
ROOT=pathlib.Path(__file__).resolve().parents[1]
DATA=ROOT/'data'; DATA.mkdir(exist_ok=True)
DOMAIN_ZH={'algebra':'代数与结构','commutative-algebra':'交换代数','homological-category':'范畴与同调',
 'algebraic-geometry':'代数几何','geometry-topology':'几何与拓扑','analysis':'分析与微分方程',
 'number-theory':'数论与算术','logic-foundations':'逻辑与基础','discrete-computation':'离散与计算',
 'probability-statistics':'概率与统计','mathematical-physics-applications':'数学物理与应用','numerics-optimization':'数值与优化'}
def readjl(p):return [json.loads(l) for l in p.read_text().splitlines() if l.strip()]
def dump(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def norm(s):return re.sub(r'[^a-z0-9]','',unicodedata.normalize('NFKD',s).casefold())
def typed():return {'registry_version':None,'artifact_type':{'must':[],'may':[],'open':True},'discovery_action_type':{'must':[],'may':[],'open':True}}
def stacks_domain(ch):
 if ch=='sets':return 'logic-foundations'
 if ch in ['topology','topologies']:return 'geometry-topology'
 if ch in ['algebra','more-algebra','brauer','smoothing','dpa','adequate','injectives','fields']:return 'commutative-algebra'
 if ch in ['categories','homology','derived','simplicial','sheaves','sites','stacks','modules','sites-modules','cohomology','sites-cohomology','dga','sdga','hypercovering']:return 'homological-category'
 return 'algebraic-geometry'
def main():
 pm=readjl(ROOT/'source/planetmath/entries.jsonl');sp=readjl(ROOT/'sources/stacks/entries.jsonl')
 wiki=json.loads((ROOT/'sources/wikipedia/wikipedia-bridge-nodes.json').read_text())
 wm={u:x for x in json.loads((ROOT/'sources/wikipedia/wikipedia-bridge-manifest.json').read_text()) for u in {x['url'],x.get('final_url'),x.get('canonical_url')} if u}
 quarantine={x['canonical_name'] for x in json.loads((ROOT/'reports/planetmath-quarantine-evidence.json').read_text())}
 quarantine|={'TestCollaboration12341','TestNewcommandAndNestedLists','DifferenceEquations1','GeneralisationOfEulerFermatTheorem','QHoldingBay47','InteriorPointOfSetInTopologicalSpace'}
 context_path=ROOT/'reports/planetmath-context-exclusions.json'
 context_data=json.loads(context_path.read_text()) if context_path.exists() else {}
 context_exclusions={x['id']:x for x in context_data.get('exclusions',[])}
 af=ROOT/'reports/audit-content-findings.json'
 if af.exists():
  for finding in json.loads(af.read_text()).get('findings',[]):
   if finding.get('action') in ['quarantine','exclude_resource']:
    quarantine.add(finding['node_id'].removeprefix('pm:'))
 # Explicit audit findings only; no rule excludes legitimate mathematical tests.
 redirects={};merge_report=[]
 dedup=ROOT/'reports/planetmath-dedup-verified.json'
 if dedup.exists():
  d=json.loads(dedup.read_text())
  assert d['entry_input_sha256']==hashlib.sha256((ROOT/'source/planetmath/entries.jsonl').read_bytes()).hexdigest()
  redirects.update(d.get('merge_map',{}));merge_report=d.get('verified_groups',[])
 def canonical(i):
  visited=set()
  while i in redirects:
   if i in visited:raise ValueError('redirect cycle')
   visited.add(i);i=redirects[i]
  return i
 nodes={};excluded=[];context=[]
 corrections={x['id']:x for x in json.loads((ROOT/'reports/title-corrections.json').read_text()).get('corrections',[])} if (ROOT/'reports/title-corrections.json').exists() else {}
 for r in pm:
  if r['id'] in context_exclusions:
   cx=context_exclusions[r['id']]
   context.append(dict(r,count_as_island=False,kind=cx['kind'],source_declared_kind=r['kind'],
      original_source_path=r['source_file'],source_file='sources/planetmath/tex/'+r['source_file'].removeprefix('planetmath/'),context_classification=cx))
   excluded.append({'id':r['id'],'reason':'background_person_institution_publication_or_resource'});continue
  if r['canonical_name'] in quarantine:excluded.append({'id':r['id'],'reason':'independent_content_quarantine'});continue
  if canonical(r['id'])!=r['id']:continue
  p='sources/planetmath/tex/'+r['source_file'].removeprefix('planetmath/')
  n=dict(r);n.update(source_file=p,domain_code=r['domain'],domain=DOMAIN_ZH[r['domain']],
    subdomain=(r['msc'][0][:2] if r['msc'] else r['source_file'].split('/')[1][:2]),
    typed_annotations=typed(),review_status='source_declared_mathematical_entry_not_individually_proof_checked',source_ids=[r['id']])
  if r['id'] in corrections:
   correction=corrections[r['id']];assert correction['source_sha256']==n['source_sha256']
   n.update(source_title=n['label'],label=correction['label'],label_zh=correction['label_zh'],kind=correction['kind'],label_origin='reviewed_source_body_display_correction')
  nodes[r['id']]=n
 for r in pm:
  target=canonical(r['id'])
  if target!=r['id'] and target in nodes:
   n=nodes[target];n['source_ids'].append(r['id']);n.setdefault('alternate_sources',[]).append({'url':r['source_url'],'sha256':r['source_sha256'],'source_id':r['id']})
 for r in sp:
  code=stacks_domain(r['chapter']);n=dict(r)
  n.pop('references');n.pop('statement_tex');n.update(domain_code=code,domain=DOMAIN_ZH[code],subdomain=r['chapter'],
   typed_annotations=typed(),review_status='source_statement_extracted_not_kernel_verified',source_ids=[r['id']],aliases=[])
  nodes[r['id']]=n
 # The only automatic Wikipedia merge is an explicit reviewed name mapping.
 wiki_equivalences={'wikipedia:Modular_form':'pm:ModularForm','wikipedia:Motivic_cohomology':'pm:MotivicCohomology'}
 # Optional independently reviewed equivalences provided by source reviewer.
 eqp=ROOT/'reports/wikipedia-pm-equivalences.json'
 if eqp.exists():wiki_equivalences.update(json.loads(eqp.read_text()).get('equivalences',{}))
 wdomains={'number_theory':'number-theory','algebraic_geometry':'algebraic-geometry','geometry':'geometry-topology',
  'topology':'geometry-topology','logic':'logic-foundations','foundations':'logic-foundations','mathematical_physics':'mathematical-physics-applications',
  'algebra':'algebra','combinatorics':'discrete-computation','discrete':'discrete-computation','probability':'probability-statistics',
  'analysis':'analysis','optimization':'numerics-optimization','geometry_topology':'geometry-topology','logic_foundations':'logic-foundations',
  'discrete_computation':'discrete-computation','probability_statistics':'probability-statistics','mathematical_physics_applications':'mathematical-physics-applications'}
 for r in wiki:
  m=wm[r['url']];target=canonical(wiki_equivalences.get(r['id'],r['id']))
  if target in nodes:
   redirects[r['id']]=target;n=nodes[target];n['source_ids'].append(r['id']);n.setdefault('alternate_sources',[]).append(m)
   n['label_zh']=r.get('title_zh');continue
  code=wdomains.get(r['domain'])
  if code is None:raise ValueError('Unmapped wiki domain: '+r['domain'])
  nodes[r['id']]=dict(id=r['id'],label=r['title'],label_zh=r['title_zh'],kind=r['kind'],source_id='wikipedia',
   source_url=r.get('canonical_url',r['url']),source_file=m['content_cache'],source_sha256=m['sha256'],source_revision=m['revision_id'],
   source_history_url=m['history_url'],source_license=m['license'],domain_code=code,domain=DOMAIN_ZH[code],subdomain=r['title'],
   aliases=[],typed_annotations=typed(),source_ids=[r['id']],review_status='encyclopedia_entry_title_level_classification')
 # Exact name resolution is only used for references. Ambiguous aliases are not linked.
 names=collections.defaultdict(set)
 for r in nodes.values():
  if r['source_id']=='stacks':continue  # Editorial labels must not impersonate canonical concept names.
  for title in [r['label'],*r.get('aliases',[])]:names[norm(title)].add(r['id'])
 edges={};unresolved=[]
 def add(a,b,rel,evidence,locator=''):
  a,b=canonical(a),canonical(b)
  if a==b:return
  if a not in nodes or b not in nodes:return
  k=(a,b,rel)
  if k not in edges:
   edges[k]=dict(id='edge:'+hashlib.sha256('|'.join(k).encode()).hexdigest()[:18],source=a,target=b,relation=rel,
     evidence_url=evidence,locator=locator,status='source_recorded',mathematical_validity='not_checked')
 for r in pm:
  if canonical(r['id']) not in nodes:continue
  for link in r['related']:
   target='pm:'+link.get('target_name','')
   if canonical(target) in nodes:add(r['id'],target,'encyclopedic_link',r['source_url'],link.get('evidence',''))
   else:unresolved.append(dict(source=r['id'],target=link.get('target_name'),reason='target_absent_or_excluded',relation=link['relation']))
 for r in sp:
  for ref in r['references']:
   t='stacks:'+str(ref['target_tag'])
   if t in nodes:add(r['id'],t,'proof_reference' if ref['location']=='proof' else 'statement_reference',r['source_url'],ref['target_label'])
   else:unresolved.append(dict(source=r['id'],target=ref['target_label'],relation=ref['location']+'_reference',reason='not_a_selected_statement_tag'))
 for r in wiki:
  for title in r.get('source_links',[]):
   ids=names[norm(title)]
   if len(ids)==1:
    target=next(iter(ids))
    rel='encyclopedic_link' if nodes[target]['source_id']=='wikipedia' else 'title_matched_link'
    add(r['id'],target,rel,r['url'],title)
   elif len(ids)>1:unresolved.append(dict(source=r['id'],target=title,reason='ambiguous_title',relation='encyclopedic_link'))
 # Reviewed mathematical bridges keep full conditions in a separate evidence record.
 bp=ROOT/'reports/math-bridge-bindings.json'
 if bp.exists():
  bb=json.loads(bp.read_text());bindings=bb if isinstance(bb,list) else bb.get('bindings',[])
  with (DATA/'bridges.csv').open('w',newline='') as f:
   out=csv.DictWriter(f,fieldnames=['source','target','bridge_id','label','status']);out.writeheader()
   brs={b['id']:b for b in json.loads((ROOT/'reports/math-bridges.json').read_text())['bridges']}
   for b in bindings:
    a=canonical(b.get('source_id',b.get('source_node_id','')));t=canonical(b.get('target_id',b.get('target_node_id','')))
    bid=b.get('bridge_id',b.get('id'))
    if a not in nodes or t not in nodes:continue
    br=brs[bid];out.writerow(dict(source=a,target=t,bridge_id=bid,label=br['title_zh'],status=br['status']))
    add(a,t,'literature_bridge',br['sources'][0]['url'],bid)
 degree=collections.Counter()
 for e in edges.values():degree[e['source']]+=1;degree[e['target']]+=1
 for r in nodes.values():r['degree']=degree[r['id']]
 for quality in [ROOT/'reports/planetmath-source-quality-findings.json',ROOT/'reports/audit-content-findings.json',ROOT/'reports/root-title-and-scope-findings.json']:
  if quality.exists():
   qd=json.loads(quality.read_text());issues=qd if isinstance(qd,list) else qd.get('issues',qd.get('findings',[]))
   for issue in issues:
    target=canonical(issue.get('id',issue.get('node_id','')))
    if target in nodes:nodes[target].setdefault('source_quality_findings',[]).append(issue)
 for n in nodes.values():n['source_quality_issue_count']=len(n.get('source_quality_findings',[]))
 with (DATA/'context-not-counted.jsonl').open('w') as f:
  for n in context:f.write(json.dumps(n,ensure_ascii=False)+'\n')
 with (DATA/'nodes-unpositioned.jsonl').open('w') as f:
  for n in sorted(nodes.values(),key=lambda x:x['id']):f.write(json.dumps(n,ensure_ascii=False)+'\n')
 with (DATA/'edges.csv').open('w',newline='') as f:
  out=csv.DictWriter(f,fieldnames=['id','source','target','relation','evidence_url','locator','status','mathematical_validity']);out.writeheader();out.writerows(sorted(edges.values(),key=lambda e:e['id']))
 dump(DATA/'id-redirects.json',redirects);dump(DATA/'unresolved-references.json',unresolved)
 dump(ROOT/'reports/build-summary.json',dict(nodes=len(nodes),source_counts=dict(collections.Counter(n['source_id'] for n in nodes.values())),
  kind_counts=dict(collections.Counter(n['kind'] for n in nodes.values())),domains=dict(collections.Counter(n['domain'] for n in nodes.values())),
  edges=len(edges),edge_relations=dict(collections.Counter(e['relation'] for e in edges.values())),zero_recorded_degree=sum(degree[i]==0 for i in nodes),
  quarantined=excluded,context_not_counted=len(context),explicit_merges=merge_report,wikipedia_merges=wiki_equivalences,unresolved_references=len(unresolved),
  count_unit='Source-indexed mathematical knowledge entries, including context-dependent definitions and statements, not independent theories.',
  scope_bias='Stacks Project contributes a large algebra/geometry statement layer. This is not a balanced census of all mathematics.',
  source_overlap='Only explicit reviewed identity merges; mathematical equivalence across different formulations has not been exhaustively decided.'))
 print(len(nodes),'nodes',len(edges),'edges')
if __name__=='__main__':main()
