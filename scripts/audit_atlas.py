#!/usr/bin/env python3
"""Independent structural audit; sampling is descriptive, not semantic certification."""
import argparse, collections, csv, hashlib, json, math, random, re, unicodedata
from pathlib import Path
import xml.etree.ElementTree as ET

SEED=20261022

def sha256(p):
    h=hashlib.sha256()
    with open(p,'rb') as f:
        for b in iter(lambda:f.read(1<<20),b''): h.update(b)
    return h.hexdigest()

def norm(s):
    return re.sub(r'\s+',' ',unicodedata.normalize('NFKC',str(s)).casefold()).strip()

def records(path):
    if path.suffix=='.jsonl': return [json.loads(s) for s in path.read_text().splitlines() if s.strip()]
    if path.suffix=='.csv':
        with path.open(newline='') as f: return list(csv.DictReader(f))
    obj=json.loads(path.read_text())
    if isinstance(obj,list): return obj
    for key in ['nodes','edges','records','items']:
        if isinstance(obj.get(key),list): return obj[key]
    raise ValueError('No record list in '+str(path))

def field(row,*keys,default=None):
    for k in keys:
        if k in row and row[k] is not None: return row[k]
    return default

def groupname(row):
    d=field(row,'domain','primary_domain','field',default='unclassified')
    return str(d[0] if isinstance(d,list) and d else d)

def sample_records(rows,n=36):
    rng=random.Random(SEED)
    groups=collections.defaultdict(list)
    for r in rows: groups[groupname(r)].append(r)
    # Round robin over shuffled domain-specific strata, sorted stable IDs first.
    for g in groups:
        groups[g].sort(key=lambda r:str(r['id']));rng.shuffle(groups[g])
    order=sorted(groups);rng.shuffle(order)
    chosen=[]
    while len(chosen)<min(n,len(rows)):
        for g in order:
            if groups[g]: chosen.append(groups[g].pop())
            if len(chosen)>=min(n,len(rows)): break
    return chosen

def final_sample_records(rows,base,n=36):
    cohort=base/'reports/audit-initial-sample-cohort.json'
    old=base/'reports/atlas-original-source-samples-initial.json'
    if not cohort.exists() or not old.exists(): return sample_records(rows,n),[]
    initial=json.loads(cohort.read_text())['initial_sample_ids']
    original={r['id']:r for r in json.loads(old.read_text())['samples']}
    byid={r['id']:r for r in rows}
    chosen=[byid[i] for i in initial if i in byid][:n]
    used={r['id'] for r in chosen};replacements=[]
    rng=random.Random(str(SEED)+':replacement')
    frozen_path=base/'reports/audit-replacement-cohort.json'
    frozen={r['initial_id']:r['replacement_id'] for r in json.loads(frozen_path.read_text())['replacements']} if frozen_path.exists() else {}
    for missing in [i for i in initial if i not in byid]:
        if len(chosen)>=n:break
        domain=original[missing]['domain']
        options=sorted([r for r in rows if r['id'] not in used and groupname(r)==domain],key=lambda r:r['id'])
        if not options:options=sorted([r for r in rows if r['id'] not in used],key=lambda r:r['id'])
        if missing in frozen:
            if frozen[missing] not in byid:raise ValueError('Previously read replacement was removed; explicit new audit decision required: '+frozen[missing])
            replacement=byid[frozen[missing]]
        else:replacement=options[rng.randrange(len(options))]
        chosen.append(replacement);used.add(replacement['id'])
        replacements.append({'initial_id':missing,'replacement_id':replacement['id'],'domain':groupname(replacement)})
    return chosen,replacements

def duplicate_groups(rows, key):
    groups=collections.defaultdict(list)
    for r in rows:
        val=key(r)
        if val: groups[val].append(str(r.get('id','?')))
    return [{'value':k,'ids':v} for k,v in sorted(groups.items()) if len(v)>1]

def svg_counts(p):
    root=ET.parse(p).getroot()
    counts={}
    for e in root.iter():
        gid=e.attrib.get('id','')
        if gid.startswith('islands-'):
            anchors=sum(1 for z in e.iter() if z.tag.rsplit('}',1)[-1]=='a')
            uses=sum(1 for z in e.iter() if z.tag.rsplit('}',1)[-1]=='use')
            # URL-bearing scatter emits one <a><path/></a> per node.
            counts[gid]=anchors if anchors else uses
    return counts

def audit(base,nodes_path,edges_path,sample_n):
    rows=records(nodes_path); edges=records(edges_path)
    errors=[];warnings=[]
    ids=[str(r.get('id','')) for r in rows]; idset=set(ids)
    labels=[field(r,'label','title','name',default='') for r in rows]
    duplicate_ids=[k for k,v in collections.Counter(ids).items() if v>1]
    if len(idset)<=10000: errors.append('unique_node_count_must_exceed_10000')
    if duplicate_ids: errors.append('duplicate_node_ids')
    if not all(ids): errors.append('empty_node_id')
    if not all(str(x).strip() for x in labels): errors.append('empty_label')
    domains=collections.Counter(groupname(r) for r in rows)
    kinds=collections.Counter(str(field(r,'kind','type',default='unspecified')) for r in rows)
    prohibited={'person','biography','organization','organisation','journal','redirect','alias','category','index'}
    forbidden=[r['id'] for r in rows if str(field(r,'kind','type',default='')).lower() in prohibited]
    known_ineligible={'pm:TerenceTao','pm:AdaLovelace','pm:AmericanMathematicalSociety','pm:MacOSCalculator','pm:WindowsCalculator','pm:FieldsMedal','pm:ActaMathematica','pm:Wikipedia','pm:MathWorld','pm:NationalScienceFoundation'}
    forbidden.extend(sorted(idset & known_ineligible))
    if forbidden: errors.append('non_mathematical_or_alias_kinds_or_identified_resources_in_island_count')
    missing_sources=[];bad_coordinates=[];coords=[];source_file_hashes={};source_hash_failures=[];source_files_missing=[]
    for r in rows:
        if not field(r,'source_url','url','sources'):missing_sources.append(r['id'])
        rawfile=r.get('source_file');expected=r.get('source_sha256')
        if not rawfile or not expected:
            source_files_missing.append(r['id'])
        else:
            path=(base/rawfile).resolve()
            if not path.is_relative_to(base.resolve()) or not path.is_file():source_files_missing.append(r['id'])
            else:
                if rawfile not in source_file_hashes:source_file_hashes[rawfile]=sha256(path)
                if source_file_hashes[rawfile]!=expected:source_hash_failures.append(r['id'])
        try:
            x,y=float(r['x']),float(r['y'])
            if not(math.isfinite(x) and math.isfinite(y)):raise ValueError('nonfinite')
            coords.append((x,y))
        except (KeyError,TypeError,ValueError):bad_coordinates.append(r['id'])
    if missing_sources: errors.append('missing_source')
    if source_files_missing: errors.append('source_files_missing')
    if source_hash_failures: errors.append('source_file_hash_mismatch')
    if bad_coordinates: errors.append('missing_or_nonfinite_coordinates')
    duplicate_coords=sum(v-1 for v in collections.Counter(coords).values() if v>1)
    if duplicate_coords: warnings.append('exact_duplicate_coordinates')
    duplicate_labels=duplicate_groups(rows,lambda r:norm(field(r,'label','title','name',default='')))
    duplicate_urls=duplicate_groups(rows,lambda r:field(r,'source_url','url',default='') if isinstance(field(r,'source_url','url',default=''),str) else '')
    if duplicate_labels:warnings.append('normalized_label_duplicates_need_review')
    if duplicate_urls:warnings.append('shared_source_urls_need_review')
    relation_counts=collections.Counter();dangling=[];self_edges=[];blank_relation=[];edge_tuples=[]
    for i,e in enumerate(edges):
        s=str(field(e,'source','source_id','from',default=''));t=str(field(e,'target','target_id','to',default=''))
        rel=str(field(e,'relation','type',default=''))
        relation_counts[rel]+=1
        if s not in idset or t not in idset:dangling.append(i)
        if s==t:self_edges.append(i)
        if not rel:blank_relation.append(i)
        edge_tuples.append((s,t,rel))
    if dangling: errors.append('dangling_edge_endpoints')
    if blank_relation: errors.append('edges_missing_relation_type')
    duplicate_edges=sum(v-1 for v in collections.Counter(edge_tuples).values() if v>1)
    if duplicate_edges:warnings.append('duplicate_edges')
    maps=[]
    for p in sorted((base/'maps').glob('*.svg')):
        counts=svg_counts(p)
        maps.append({'path':str(p.relative_to(base)),'sha256':sha256(p),'island_groups':counts,'rendered_node_count':sum(counts.values())})
    totalmaps=[m for m in maps if m['rendered_node_count']==len(rows)]
    if not totalmaps:errors.append('no_svg_with_all_nodes_in_auditable_islands_groups')
    render_manifest_path=base/'maps/render-manifest.json'
    render_binding={}
    if render_manifest_path.exists():
        rm=json.loads(render_manifest_path.read_text())
        render_binding={'nodes_hash_matches':rm.get('nodes_sha256')==sha256(nodes_path),'edges_hash_matches':rm.get('edges_sha256')==sha256(edges_path),'node_count_matches':rm.get('source_node_count')==len(rows),'edge_count_matches':rm.get('source_edge_count')==len(edges),'domain_counts_match':rm.get('domains')==dict(domains),'flagged_count_matches':rm.get('source_quality_flagged_node_count')==sum(bool(r.get('source_quality_findings')) for r in rows)}
        if not all(render_binding.values()):errors.append('render_manifest_does_not_bind_final_data')
    else:errors.append('render_manifest_missing')
    selected,replacements=final_sample_records(rows,base,sample_n)
    samples=[{'id':r['id'],'label':field(r,'label','title','name'), 'domain':groupname(r),'kind':field(r,'kind','type'),'source_url':field(r,'source_url','url'),'source_file':field(r,'source_file','raw_file'),'source_record_id':field(r,'source_record_id','source_id'),'verification':'awaiting_original_source_review'} for r in selected]
    output={
      'audit_version':'1.0','auditor':'/root/atlas_audit','independence':'separate_agent_shared_model_and_filesystem_not_external_certification',
      'scope':'dataset structural invariants and fixed-seed original-source sample, not full semantic equivalence or proof validation',
      'nodes_file':str(nodes_path.relative_to(base)),'nodes_sha256':sha256(nodes_path),
      'edges_file':str(edges_path.relative_to(base)),'edges_sha256':sha256(edges_path),
      'node_count':len(rows),'unique_id_count':len(idset),'domain_counts':dict(domains),'kind_counts':dict(kinds),
      'edge_count':len(edges),'edge_relation_counts':dict(relation_counts),
      'errors':errors,'warnings':warnings,'duplicate_ids':duplicate_ids,'duplicate_normalized_labels':duplicate_labels,'shared_source_urls':duplicate_urls,
      'forbidden_kinds':forbidden,'source_files_checked':len(source_file_hashes),'source_files_missing':source_files_missing,'source_hash_failures':source_hash_failures,'missing_sources':missing_sources,'bad_coordinates':bad_coordinates,'exact_duplicate_coordinate_count':duplicate_coords,
      'dangling_edge_indices':dangling,'self_edge_count':len(self_edges),'duplicate_edge_count':duplicate_edges,
      'maps':maps,'complete_map_count':len(totalmaps),'render_binding_checks':render_binding,
      'sampling':{'seed':SEED,'algorithm':'sorted IDs within domain; independent seeded shuffling; round-robin over shuffled domains','requested':sample_n,'actual':len(samples),'initial_cohort_preserved_if_available':True,'replacement_seed':str(SEED)+':replacement','replacements':replacements,'samples':samples},
      'known_source_quality_flagged_nodes':sum(bool(r.get('source_quality_findings')) for r in rows),
      'content_quality_findings_file':'reports/audit-content-findings.json','source_identity_does_not_certify_math':True,
      'structural_pass':not errors,'semantic_uniqueness_certified':False,'mathematical_correctness_certified':False,
      'replay_command':f'python scripts/audit_atlas.py --nodes {nodes_path.relative_to(base)} --edges {edges_path.relative_to(base)} --sample {sample_n}',
    }
    return output

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--base',type=Path,default=Path(__file__).resolve().parents[1]);ap.add_argument('--nodes',default='data/nodes.jsonl');ap.add_argument('--edges',default='data/edges.csv');ap.add_argument('--sample',type=int,default=36)
    a=ap.parse_args();out=audit(a.base,a.base/a.nodes,a.base/a.edges,a.sample)
    dest=a.base/'reports'/'atlas-independent-audit.json';dest.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:out[k] for k in ['node_count','unique_id_count','edge_count','errors','warnings','complete_map_count','structural_pass']},ensure_ascii=False))
    return 0 if out['structural_pass'] else 1
if __name__=='__main__':raise SystemExit(main())
