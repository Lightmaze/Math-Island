#!/usr/bin/env python3
"""Replay a concrete failure of the literal Dijkstra procedure in the source."""
import json,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
g={'s':{'a':2,'b':5},'a':{'t':2},'b':{'a':-10,'s':100},'t':{'b':100}}
d={v:float('inf') for v in g};d.update({'s':0,**g['s']});seen={'s'};order=[]
while len(seen)<len(g):
    v=min(set(g)-seen,key=lambda x:d[x]);seen.add(v);order.append(v)
    for u,w in g[v].items():d[u]=min(d[u],d[v]+w)
f={(i,j):(0 if i==j else g[i].get(j,float('inf'))) for i in g for j in g}
for k in g:
    for i in g:
        for j in g:f[i,j]=min(f[i,j],f[i,k]+f[k,j])
assert all(f[i,i]>=0 for i in g)
assert all(f[i,j]<float('inf') for i in g for j in g)
assert d['t']==4 and f['s','t']==-3
p=ROOT/'reports/root-title-and-scope-findings.json';record=json.loads(p.read_text())
record['issues'][-1]['exact_witness']={'edges':g,'settlement_order':order,'returned_distances':d,
    'true_distance_to_t':f['s','t'],'path':['s','b','a','t'],
    'no_negative_cycle':'All Floyd-Warshall diagonal entries are nonnegative.',
    'strongly_connected':'All exact all-pairs distances are finite.'}
p.write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
(ROOT/'reports/title-scope-counterexample-execution.json').write_text(json.dumps({'passed':True,
    'literal_source_algorithm_target_distance':4,'true_target_distance':-3,'no_negative_cycle':True,
    'strongly_connected':True,'scope':'One exact counterexample to omitted applicability conditions; not kernel certification.'},indent=2)+'\n')
print('Exact Dijkstra scope counterexample passed: 4 != -3; strongly connected, no negative cycle.')
