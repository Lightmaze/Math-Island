#!/usr/bin/env python3
"""Verify the final navigable data and executable reading itineraries."""
import collections,csv,hashlib,json,math,pathlib,subprocess,sys
import numpy as np
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import connected_components
ROOT=pathlib.Path(__file__).resolve().parents[1]
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 nodes=[json.loads(s) for s in (ROOT/'data/nodes.jsonl').read_text().splitlines()];ns={n['id']:n for n in nodes}
 edges=list(csv.DictReader((ROOT/'data/edges.csv').open()));checks={}
 def check(k,v):checks[k]=bool(v);assert v,k
 check('over_10000_source_entries',len(nodes)>10000)
 check('unique_node_ids',len(ns)==len(nodes))
 check('finite_unique_coordinates',all(math.isfinite(n['x']) and math.isfinite(n['y']) for n in nodes) and len({(n['x'],n['y']) for n in nodes})==len(nodes))
 hs={}
 for n in nodes:
  p=ROOT/n['source_file']
  if p not in hs:hs[p]=digest(p)
  if hs[p]!=n['source_sha256']:raise AssertionError(('source_hash',n['id']))
 check('all_source_file_hashes_match',True)
 check('all_edge_endpoints_real',all(e['source'] in ns and e['target'] in ns and e['source']!=e['target'] for e in edges))
 check('edge_ids_unique',len({e['id'] for e in edges})==len(edges))
 check('no_synthetic_proof_certification',all(n['typed_annotations']['artifact_type']['must']==[] and n['typed_annotations']['discovery_action_type']['must']==[] for n in nodes))
 bindings=json.loads((ROOT/'reports/math-bridge-bindings.json').read_text())
 check('21_bridges_bound_to_final_node_snapshot',bindings['bound_count']==21 and bindings['nodes_sha256']==digest(ROOT/'data/nodes.jsonl'))
 bs=list(csv.DictReader((ROOT/'data/bridges.csv').open()))
 check('21_distinct_documented_bridge_records',len(bs)==21 and len({b['bridge_id'] for b in bs})==21 and all(b['source'] in ns and b['target'] in ns for b in bs))
 adj=collections.defaultdict(set)
 for e in edges:adj[e['source']].add(e['target']);adj[e['target']].add(e['source'])
 candidates=json.loads((ROOT/'data/research-candidates.json').read_text())
 for c in candidates['candidates']:
  a,b=c['source'],c['target'];check('candidate_missing_recorded_edges',b not in adj[a]);check('candidate_cross_domain',ns[a]['domain']!=ns[b]['domain'])
  check('candidate_shared_neighbors_real',set(c['common_reference_neighbors']).issubset(adj[a]&adj[b]) and len(c['common_reference_neighbors'])>=2)
  check('candidate_no_truth_or_novelty_claim',c['mathematical_connection']=='not_established' and c['novelty']=='not_searched' and c['proposition'] is None)
 def nav(*args):return json.loads(subprocess.check_output([sys.executable,str(ROOT/'scripts/navigate.py'),*args],text=True))
 check('search_modern_tool',any(n['id']=='wikipedia:Rough_path' for n in nav('search','rough','--limit','30')['results']))
 route=nav('route','pm:ModularForm','wikipedia:Sphere_packing','--directed')
 check('documented_cross_field_route',route['found'] and route['hops']==1 and route['steps'][0]['relation']=='literature_bridge')
 check('navigation_preserves_source_quality_flag',nav('show','pm:SieveOfEratosthenes')['source_quality_issue_count']>=1)
 bad=subprocess.run([sys.executable,str(ROOT/'scripts/navigate.py'),'show','not-a-real-island'],capture_output=True,text=True)
 check('unknown_island_rejected',bad.returncode!=0)
 idx={n['id']:i for i,n in enumerate(nodes)};ii=[idx[e['source']] for e in edges];jj=[idx[e['target']] for e in edges]
 mat=coo_matrix((np.ones(len(ii)),(ii,jj)),shape=(len(nodes),len(nodes))).tocsr();cnt,labels=connected_components(mat,directed=False)
 sizes=collections.Counter(labels.tolist())
 summary=json.loads((ROOT/'reports/build-summary.json').read_text())
 output=dict(status='passed',checks=checks,node_count=len(nodes),edge_count=len(edges),unique_source_files=len(hs),
  source_counts=summary['source_counts'],edge_relations=summary['edge_relations'],
  graph_components=cnt,largest_component_nodes=max(sizes.values()),zero_recorded_degree=sum(not adj[i] for i in ns),
  nodes_with_recorded_source_quality_issues=sum(n['source_quality_issue_count']>0 for n in nodes),
  navigation_candidates_total=candidates['total_candidates'],navigation_candidates_exported=len(candidates['candidates']),
  hashes={str(p.relative_to(ROOT)):digest(p) for p in [ROOT/'data/nodes.jsonl',ROOT/'data/edges.csv',ROOT/'data/bridges.csv',ROOT/'data/research-candidates.json']},
  limit='These checks establish data identity, provenance, graph integrity and executable navigation. They do not verify every mathematical statement, complete entity equivalence or scientific novelty.')
 (ROOT/'reports/release-verification.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(output,ensure_ascii=False,indent=2))
if __name__=='__main__':main()
