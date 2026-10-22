#!/usr/bin/env python3
"""Executable user-facing navigation checks against the actual release graph."""
import csv,hashlib,json,subprocess,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def call(*args,success=True):
 p=subprocess.run([sys.executable,str(ROOT/'scripts/navigate.py'),*args],capture_output=True,text=True)
 if success:
  assert p.returncode==0,p.stderr
  return json.loads(p.stdout)
 return p
nodes={n['id']:n for n in map(json.loads,(ROOT/'data/nodes.jsonl').read_text().splitlines())}
edges=list(csv.DictReader((ROOT/'data/edges.csv').open()));pairs={frozenset((e['source'],e['target'])) for e in edges}
checks=[]
s=call('search','Fourier','--limit','3');checks.append({'check':'search_real_math_term','pass':s['total_matches']>=3 and len(s['results'])==3 and all(n['id'] in nodes for n in s['results'])})
s=call('show','pm:ModularForm');checks.append({'check':'show_source_and_scope','pass':s['id']=='pm:ModularForm' and bool(s['source_url']) and 'typed_annotations' in s})
s=call('neighbors','pm:ModularForm','--limit','10000');checks.append({'check':'neighbors_keep_relation_direction_evidence','pass':all(r['relation'] and isinstance(r['traversed_in_recorded_direction'],bool) and r['evidence_url'] for r in s['neighbors'])})
s=call('route','pm:EllipticCurve','wikipedia:Sphere_packing','--directed');checks.append({'check':'documented_cross_field_reading_route','pass':s['found'] and s['hops']>0 and all(x['in_recorded_direction'] for x in s['steps']) and all(frozenset((x['source']['id'],x['target']['id'])) in pairs for x in s['steps']),'hops':s.get('hops'),'meaning':s.get('meaning')})
s=call('route','pm:ModularForm','pm:ModularForm');checks.append({'check':'zero_hop_route','pass':s['found'] and s['hops']==0 and s['steps']==[]})
s=call('show','not:a:real:island',success=False);checks.append({'check':'unknown_id_is_explicit_error','pass':s.returncode!=0 and 'Use an exact unique ID' in s.stderr})
s=call('candidates','--limit','100000');bad=[x for x in s['candidates'] if frozenset((x['source'],x['target'])) in pairs or x['mathematical_connection']!='not_established' or x['novelty']!='not_searched' or x['source_domain']==x['target_domain']]
checks.append({'check':'candidate_layer_has_no_existing_edge_and_no_truth_or_novelty_claim','pass':not bad and s['not_a_truth_or_novelty_score'],'candidate_count':len(s['candidates'])})
out={'auditor':'/root/atlas_audit','nodes_sha256':hashlib.sha256((ROOT/'data/nodes.jsonl').read_bytes()).hexdigest(),'edges_sha256':hashlib.sha256((ROOT/'data/edges.csv').read_bytes()).hexdigest(),'navigation_script_sha256':hashlib.sha256((ROOT/'scripts/navigate.py').read_bytes()).hexdigest(),'checks':checks,'pass':all(c['pass'] for c in checks),'scope':'Source-graph navigation semantics and concrete commands, not mathematical implication or novelty validation.'}
(ROOT/'reports/navigation-independent-audit.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'checks':len(checks),'pass':out['pass'],'candidate_count':len(s['candidates'])}))
