#!/usr/bin/env python3
"""Deterministic cartography: source-domain packing + reference-graph sfdp.
Domain membership and packing are navigation aids, never theorem distances.
"""
import collections,concurrent.futures,csv,hashlib,json,math,pathlib,shlex,subprocess
import numpy as np
ROOT=pathlib.Path(__file__).resolve().parents[1]
DATA=ROOT/'data'; CACHE=ROOT/'layout';CACHE.mkdir(exist_ok=True)
def run_dot(dot,path):
 path.with_suffix('.dot').write_text(dot)
 p=subprocess.run(['sfdp','-Gstart=20261022','-Goverlap=prism','-Gpack=true','-Gpackmode=graph','-Tplain',str(path.with_suffix('.dot'))],capture_output=True,text=True,timeout=180)
 if p.returncode:raise RuntimeError(p.stderr)
 path.with_suffix('.plain').write_text(p.stdout)
 result={}
 for line in p.stdout.splitlines():
  t=shlex.split(line)
  if t and t[0]=='node':result[t[1]]=(float(t[2]),float(t[3]))
 return result
def main():
 nodes=[json.loads(s) for s in (DATA/'nodes-unpositioned.jsonl').read_text().splitlines()]
 byid={n['id']:i for i,n in enumerate(nodes)}
 groups=collections.defaultdict(list)
 for i,n in enumerate(nodes):groups[n['domain']].append(i)
 domains=sorted(groups);didx={d:i for i,d in enumerate(domains)}
 es=list(csv.DictReader((DATA/'edges.csv').open()));internal=collections.defaultdict(set);macro=collections.Counter()
 for e in es:
  a,b=byid[e['source']],byid[e['target']];da,db=nodes[a]['domain'],nodes[b]['domain']
  if da==db:internal[da].add(tuple(sorted((a,b))))
  else:macro[tuple(sorted((didx[da],didx[db])))]+=1
 radii={d:max(.40,math.sqrt(len(groups[d])/1800)) for d in domains}
 # Macro layout uses observed cross-domain adjacency, with area for every node.
 # sfdp is not assumed to interpret edge weight as a weighted spring.
 lines=['graph atlas { graph [K=2,repulsiveforce=2]; node [label="",shape=circle,fixedsize=true];']
 for j,d in enumerate(domains):lines.append(f'd{j} [width={2*radii[d]+.45},height={2*radii[d]+.45}];')
 for (a,b),weight in sorted(macro.items()):lines.append(f'd{a} -- d{b};')
 lines.append('}')
 m=run_dot('\n'.join(lines),CACHE/'macro')
 centers=np.array([m['d'+str(j)] for j in range(len(domains))]);centers-=centers.mean(0);centers*=.52
 # Explicit overlap removal, without adding semantic graph edges.
 for _ in range(300):
  changed=False
  for i in range(len(domains)):
   for j in range(i):
    v=centers[i]-centers[j];dist=np.linalg.norm(v);need=radii[domains[i]]+radii[domains[j]]+.28
    if dist<need:
     if dist<1e-10:v=np.array([math.cos(i+j),math.sin(i+j)]);dist=1
     shift=v/dist*(need-dist)/2;centers[i]+=shift;centers[j]-=shift;changed=True
  if not changed:break
 def local(d):
  ids=groups[d];linked=set(x for pair in internal[d] for x in pair)
  lines=['graph region { graph [K=.35]; node [label="",shape=point,width=.025,height=.025];']
  for i in sorted(linked):lines.append(f'n{i};')
  for i,j in sorted(internal[d]):lines.append(f'n{i} -- n{j};')
  lines.append('}');coords=run_dot('\n'.join(lines),CACHE/('domain-'+str(didx[d]))) if linked else {}
  if linked:
   li=sorted(linked);q=np.array([coords['n'+str(i)] for i in li]);q-=q.mean(0)
   q=q/max(np.linalg.norm(q,axis=1).max(),1e-9)*.77
   coords={i:xy for i,xy in zip(li,q)}
  # Actual nodes without any within-domain edge have no graph-determined local
  # location. Place them on a deterministic outer shelf, never inventing links.
  unlinked=[i for i in ids if i not in linked]
  golden=math.pi*(3-math.sqrt(5))
  for j,i in enumerate(unlinked):
   angle=j*golden;radius=math.sqrt(.81**2+(1-.81**2)*(j+.5)/len(unlinked))
   coords[i]=np.array([radius*math.cos(angle),radius*math.sin(angle)])
  a=np.array([coords[i] for i in ids])*radii[d]
  a+=centers[didx[d]]
  return d,ids,a
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
  for d,ids,a in pool.map(local,domains):
   for idx,xy in zip(ids,a):nodes[idx].update(x=round(float(xy[0]),9),y=round(float(xy[1]),9),layout_version='atlas-v1-sfdp-domain',layout_seed=20261022)
   print(d,len(ids),'placed',flush=True)
 assert len({(n['x'],n['y']) for n in nodes})==len(nodes),'Coordinate collision: do not silently lose islands'
 with (DATA/'nodes.jsonl').open('w') as f:
  for n in nodes:f.write(json.dumps(n,ensure_ascii=False)+'\n')
 with (DATA/'nodes.csv').open('w',newline='') as f:
  keys=['id','label','domain','kind','source_id','source_url','source_file','source_sha256','x','y','degree','source_quality_issue_count']
  w=csv.DictWriter(f,fieldnames=keys,extrasaction='ignore');w.writeheader();w.writerows(nodes)
 report=dict(method='12 source-domain regions; unweighted macro sfdp on cross-domain adjacency; per-region sfdp for nodes with within-domain references; nodes without within-domain links on a deterministic phyllotactic outer shelf; uniform scaling and non-overlap packing.',
  seed=20261022,graphviz=subprocess.check_output(['sfdp','-V'],stderr=subprocess.STDOUT,text=True).strip(),
  semantic_limit='2D proximity, area, edge length and compass direction do not measure mathematical importance, difficulty, implication or proof distance.',
  regions=[dict(domain=d,count=len(groups[d]),center=centers[i].tolist(),radius=radii[d]) for i,d in enumerate(domains)],
  all_nodes=len(nodes),all_coordinates_distinct=True,node_input_sha256=hashlib.sha256((DATA/'nodes-unpositioned.jsonl').read_bytes()).hexdigest(),
  edges_input_sha256=hashlib.sha256((DATA/'edges.csv').read_bytes()).hexdigest(),all_semantic_edges_preserved_in_csv=True)
 (ROOT/'reports/layout.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
if __name__=='__main__':main()
