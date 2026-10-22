#!/usr/bin/env python3
"""Offline graph navigation; paths mean reading itineraries, not proofs."""
import argparse,collections,csv,difflib,heapq,json,math,pathlib,re,sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
def load():
 ns={r['id']:r for r in map(json.loads,(ROOT/'data/nodes.jsonl').read_text().splitlines())}
 es=list(csv.DictReader((ROOT/'data/edges.csv').open()));adj=collections.defaultdict(list)
 for e in es:adj[e['source']].append((e['target'],e,True));adj[e['target']].append((e['source'],e,False))
 return ns,es,adj
def resolve(s,ns):
 if s in ns:return s
 exact=[i for i,n in ns.items() if s.casefold() in [n['label'].casefold(),n.get('label_zh','').casefold()]]
 if len(exact)==1:return exact[0]
 raise SystemExit('Use an exact unique ID. Search first; matches: '+str(exact[:15]))
def basic(n):return {k:n.get(k) for k in ['id','label','label_zh','domain','kind','x','y','degree','source_url','source_quality_issue_count']}
def main():
 p=argparse.ArgumentParser(description=__doc__);sub=p.add_subparsers(dest='command',required=True)
 s=sub.add_parser('search');s.add_argument('query');s.add_argument('--limit',type=int,default=20)
 s=sub.add_parser('show');s.add_argument('node')
 s=sub.add_parser('neighbors');s.add_argument('node');s.add_argument('--limit',type=int,default=30)
 s=sub.add_parser('route');s.add_argument('source');s.add_argument('target');s.add_argument('--directed',action='store_true');s.add_argument('--max-depth',type=int,default=15)
 s=sub.add_parser('candidates');s.add_argument('--limit',type=int,default=30);s.add_argument('--save',action='store_true')
 args=p.parse_args();ns,es,adj=load()
 if args.command=='search':
  q=args.query.casefold();found=[]
  for n in ns.values():
   keys=[n['id'],n['label'],n.get('label_zh',''),*n.get('aliases',[])]
   if any(q in k.casefold() for k in keys):found.append(n)
  found.sort(key=lambda n:(q!=n['label'].casefold(),-n['degree'],n['id']))
  result=dict(total_matches=len(found),results=[basic(n) for n in found[:args.limit]])
 elif args.command=='show':result=ns[resolve(args.node,ns)]
 elif args.command=='neighbors':
  i=resolve(args.node,ns);items=sorted(adj[i],key=lambda z:(-ns[z[0]]['degree'],z[0]))
  result=dict(node=basic(ns[i]),total=len(items),neighbors=[dict(node=basic(ns[t]),relation=e['relation'],traversed_in_recorded_direction=direct,evidence_url=e['evidence_url'],locator=e['locator']) for t,e,direct in items[:args.limit]])
 elif args.command=='route':
  a,b=resolve(args.source,ns),resolve(args.target,ns);queue=collections.deque([(a,0)]);prev={a:None}
  while queue:
   u,d=queue.popleft()
   if u==b:break
   if d>=args.max_depth:continue
   for v,e,direct in adj[u]:
    if v in prev or (args.directed and not direct):continue
    prev[v]=(u,e,direct);queue.append((v,d+1))
  if b not in prev:result=dict(found=False,meaning='No recorded reading route within the requested depth; not mathematical disconnectedness.')
  else:
   route=[];v=b
   while prev[v] is not None:
    u,e,direct=prev[v];route.append(dict(source=basic(ns[u]),target=basic(ns[v]),relation=e['relation'],in_recorded_direction=direct,evidence_url=e['evidence_url'],locator=e['locator']));v=u
   result=dict(found=True,hops=len(route),meaning='Shortest unweighted reading itinerary in the selected source graph, not a chain of implications. Reverse traversal explicitly marked.',steps=list(reversed(route)))
 else:
  # Candidate pairs are generated only from short reference wedges between non-Stacks
  # concept entries. No pair is assigned a theorem, truth probability, or novelty claim.
  neighbors={i:{t for t,e,d in adj[i] if e['relation']!='literature_bridge'} for i in ns if not i.startswith('stacks:')}
  existing_pairs={frozenset((e['source'],e['target'])) for e in es}
  support=collections.defaultdict(set)
  for hub in sorted(neighbors):
   vals=sorted(t for t in neighbors[hub] if t in neighbors)
   if len(vals)>150:continue # declared cost/ubiquity filter, not a math criterion
   for j,a in enumerate(vals):
    for b in vals[j+1:]:
     if ns[a]['domain']==ns[b]['domain'] or frozenset((a,b)) in existing_pairs:continue
     support[(a,b)].add(hub)
  ranked=[]
  for (a,b),hubs in support.items():
   if len(hubs)<2:continue
   score=sum(1/math.log(1+len(neighbors[h])) for h in hubs)
   ranked.append(dict(source=a,target=b,source_label=ns[a]['label'],target_label=ns[b]['label'],source_domain=ns[a]['domain'],target_domain=ns[b]['domain'],
    common_reference_neighbors=sorted(hubs),adamic_adar_score=round(score,6),status='unreviewed_navigation_candidate',
    proposition=None,novelty='not_searched',mathematical_connection='not_established',
    required_actions=['read_shared_sources','identify_transferable_structure','state_domain_and_assumptions','search_prior_literature','formulate_and_test_a_precise_claim']))
  ranked.sort(key=lambda x:(-x['adamic_adar_score'],x['source'],x['target']))
  result=dict(method='Cross-domain missing recorded links with at least 2 common undirected reference neighbors; hub degree capped at 150; excludes Stacks statement units.',
   not_a_truth_or_novelty_score=True,total_candidates=len(ranked),candidates=ranked[:args.limit])
  if args.save:(ROOT/'data/research-candidates.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(result,ensure_ascii=False,indent=2))
if __name__=='__main__':main()
