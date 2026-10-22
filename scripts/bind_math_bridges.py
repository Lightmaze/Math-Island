#!/usr/bin/env python3
"""Explicitly bind reviewed bridge endpoints to actual sourced atlas records.

No fuzzy matches and no placeholder island creation. Run after source imports.
"""
import argparse,hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
bridges=json.loads((ROOT/'reports/math-bridges.json').read_text())['bridges']
parser=argparse.ArgumentParser()
parser.add_argument('--nodes',type=Path,default=ROOT/'data/nodes.jsonl',help='Actual sourced node JSONL; positioning is optional')
args=parser.parse_args()
nodes_path=args.nodes
nodes={n['id']:n for n in (json.loads(l) for l in nodes_path.read_text().splitlines())}
# These decisions bind to concepts, not to every specialized lemma mentioning them.
choices={
'Elliptic curve':('pm:EllipticCurve','exact concept title'),
'Modular form':('pm:ModularForm','exact concept title; Wikipedia duplicate uses canonical PlanetMath ID'),
'Sphere packing':('wikipedia:Sphere_packing','fetched mathematical concept page'),
'Hodge theory':('pm:HodgeTheory','exact concept title'),
'Matroid':('pm:Matroid','exact concept title'),
'Lovász local lemma':('wikipedia:Lovász_local_lemma','fetched theorem page'),
'Randomized algorithm':('wikipedia:Randomized_algorithm','fetched method concept; bridge specifies the Moser–Tardos subclass'),
'Szemerédi’s theorem':('pm:SzemeredisTheorem','exact named theorem; accent/apostrophe spelling normalized'),
'Prime number':('pm:Prime','source explicitly lists prime number as synonym and defines prime integers; original TeX read'),
'Optimal transport':('wikipedia:Optimal_transport','requested-title ID redirects to Transportation theory (mathematics); mathematics page, not shipping logistics'),
'Ricci curvature':('wikipedia:Ricci_curvature','fetched mathematical curvature concept page'),
'Expander graph':('wikipedia:Expander_graph','fetched graph concept page'),
'Error-correcting code':('wikipedia:Error_correction_code','fetched coding-theory concept page; explicit terminology alias'),
'Stability theory (model theory)':('wikipedia:Stable_theory','model-theoretic stability; explicitly corrected initial Wikipedia Stability_theory request, which concerns dynamics'),
'Szemerédi regularity lemma':('wikipedia:Szemerédi_regularity_lemma','fetched named regularity theorem page'),
'Intuitionistic logic':('wikipedia:Intuitionistic_logic','fetched logical-system page; bridge restricts to matching propositional calculus'),
'Lambda calculus':('pm:LambdaCalculus','exact concept title; bridge restricts to typed subsystem'),
'Type theory':('wikipedia:Type_theory','general type-theory page; not identified with Russell’s simple type theory'),
'Homotopy theory':('wikipedia:Homotopy_theory','fetched topology theory page'),
'Von Neumann algebra':('pm:VonNeumannAlgebra','exact concept title'),
'Jones polynomial':('wikipedia:Jones_polynomial','fetched named invariant page'),
'Covering space':('pm:CoveringSpace','exact concept title'),
'Fundamental group':('pm:FundamentalGroup','exact concept title; not etale fundamental group'),
'Radical ideal':('pm:RadicalOfAnIdeal','source pmdefines radical ideal and explicitly defines I=sqrt(I); original TeX read'),
'Algebraic set':('pm:AlgebraicSetsAndPolynomialIdeals','source pmdefines algebraic set and explicitly gives V(S); original TeX read'),
'Gaussian curvature':('pm:GaussianCurvature','exact concept title'),
'Euler characteristic':('pm:EulerCharacteristic','exact concept title'),
'Brownian motion':('pm:BrownianMotion','exact concept title'),
'Heat equation':('pm:HeatEquation','exact PDE concept title; bridge adds potential term explicitly'),
'Restricted isometry property':('wikipedia:Restricted_isometry_property','fetched named matrix property page'),
'Compressed sensing':('wikipedia:Compressed_sensing','fetched recovery-method page'),
'Concentration of measure':('wikipedia:Concentration_of_measure','fetched probability concept page'),
'Johnson–Lindenstrauss lemma':('wikipedia:Johnson–Lindenstrauss_lemma','fetched named embedding theorem page'),
'Borsuk–Ulam theorem':('pm:BorsukUlamTheorem','exact named theorem; dash spelling normalized; source bridge uses an adapted topological zero principle'),
'Polynomial partitioning':('wikipedia:Polynomial_partitioning','fetched mathematical method page'),
'Semidefinite programming':('wikipedia:Semidefinite_programming','fetched optimization method page'),
'Shannon capacity':('wikipedia:Shannon_capacity_of_a_graph','fetched zero-error graph capacity page; not ordinary noisy channel capacity'),
'Polynomial interpolation':('wikipedia:Polynomial_interpolation','fetched polynomial reconstruction method page'),
'Reed–Solomon code':('wikipedia:Reed–Solomon_error_correction','fetched named code-family page'),
'Polynomial identity testing':('wikipedia:Polynomial_identity_testing','fetched algebraic randomized testing method page'),
'Sum-check protocol':('wikipedia:Sum-check_protocol','fetched named interactive proof protocol page'),
}
bindings=[];missing=[]
for b in bridges:
    row={'bridge_id':b['id'],'status':'bound','binding_reason':[]}
    for side in ['source','target']:
        title=b[f'{side}_title'];nid,reason=choices[title]
        if nid not in nodes:
            row['status']='unbound_missing_source_record';missing.append({'bridge_id':b['id'],'endpoint':side,'title':title,'requested_id':nid})
            row[f'{side}_id']=None
        else:
            n=nodes[nid];row[f'{side}_id']=nid
            row[f'{side}_source_url']=n.get('source_url',n.get('url'))
            row[f'{side}_node_label']=n.get('label',n.get('title'))
        row['binding_reason'].append(f'{side}: {reason}')
    row['binding_reason']='; '.join(row['binding_reason'])
    bindings.append(row)
out={'schema_version':'math-atlas-bridge-bindings-1',
     'nodes_path':str(nodes_path),
     'nodes_sha256':hashlib.sha256(nodes_path.read_bytes()).hexdigest(),
     'method':'Explicit manually reviewed endpoint concept selection; no fuzzy matching; absent source records remain unbound.',
     'bound_count':sum(b['status']=='bound' for b in bindings),'missing_endpoints':missing,'bindings':bindings}
(ROOT/'reports/math-bridge-bindings.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'bound_count':out['bound_count'],'missing':missing},ensure_ascii=False))
