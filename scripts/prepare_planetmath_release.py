#!/usr/bin/env python3
"""Build compact, offline-auditable PlanetMath TeX source package without executing TeX."""
import concurrent.futures,hashlib,json,re,tarfile,unicodedata
from collections import defaultdict,Counter
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
RAW=ROOT/'source/planetmath'; OUT=ROOT/'sources/planetmath'; OUT.mkdir(parents=True,exist_ok=True)
def sha(data):return hashlib.sha256(data).hexdigest()
def loadlines(p):return [json.loads(l) for l in p.read_text().splitlines()]
def normal_label(text):return re.sub(r'\s+',' ',unicodedata.normalize('NFKC',text).casefold()).strip()
def main():
    entries=loadlines(RAW/'entries.jsonl'); wanted={r['canonical_name'].casefold():r for r in entries}; records=[r for r in loadlines(RAW/'records.jsonl') if r['canonical_name'].casefold() in wanted]
    groups=defaultdict(dict)
    for r in records:
        repo=r['repository'].split('/',1)[1];rel=Path(r['source_path'])
        if rel.is_absolute() or '..' in rel.parts:raise ValueError('Unsafe source path')
        if len(rel.parts)!=1:raise ValueError('Non-flat path requires explicit collision review')
        groups[repo][r['source_path']]=r
    def extract(repo,expected):
        rows=[];found=set(); archive=RAW/(repo+'.tar.gz')
        with tarfile.open(archive,mode='r|gz') as tar:
            for m in tar:
                name=m.name.split('/',1)[-1]
                if name not in expected:continue
                if not m.isfile():raise ValueError('Source member is not regular file')
                record=expected[name];content=tar.extractfile(m).read()
                if sha(content)!=record['tex_sha256']:raise ValueError('Source hash mismatch '+name)
                path=OUT/'tex'/repo/name;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(content)
                entry=wanted[record['canonical_name'].casefold()]
                rows.append({'island_id':entry['id'],'canonical_name':record['canonical_name'],'source_file':str(path.relative_to(ROOT)),'source_url':record['source_url'],'source_sha256':record['tex_sha256'],'archive_sha256':record['archive_sha256'],'bytes':len(content),'authors':record['authors'],'license':'CC-BY-SA-3.0','selected_representative':record['tex_sha256']==entry['source_sha256'] and record['source_url']==entry['source_url']});found.add(name)
        if found!=set(expected):raise ValueError('Missing source members '+str(set(expected)-found))
        return rows
    rows=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
        jobs=[pool.submit(extract,repo,expected) for repo,expected in groups.items()]
        for job in concurrent.futures.as_completed(jobs):rows.extend(job.result())
    rows.sort(key=lambda x:x['source_file']); representative={r['island_id']:r['source_file'] for r in rows if r['selected_representative']}
    if set(representative)!={r['id'] for r in entries}:raise ValueError('Missing representative mapping')
    manifest={'purpose':'Offline source audit and graph reconstruction; raw TeX is data and is never executed.','entry_input_sha256':sha((RAW/'entries.jsonl').read_bytes()),'island_records':len(entries),'source_files':len(rows),'total_source_bytes':sum(x['bytes'] for x in rows),'all_sha256_verified':True,'representative_source_files':representative,'files':rows}
    (OUT/'tex-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
    for filename in ['entries.jsonl','excluded-entries.jsonl','records.jsonl','manifest.json','LICENSE-CC-BY-SA-3.0.txt']:
        (OUT/filename).write_bytes((RAW/filename).read_bytes())
    report={'entry_input_sha256':manifest['entry_input_sha256'],'island_records':len(entries),'source_files':len(rows),'total_source_bytes':manifest['total_source_bytes'],'all_sha256_verified':True,'path_rule':'sources/planetmath/tex/<repository-name>/<source-basename>.tex; representative mapping in sources/planetmath/tex-manifest.json','source_preparation_does_not_apply_final_quarantine_or_concept_merges':True}
    (ROOT/'reports/planetmath-offline-source.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    # Only produce candidates: same title plus a numeric canonical suffix is not semantic equality.
    bylabel=defaultdict(list);byrecord=defaultdict(list)
    for e in entries:
        bylabel[normal_label(e['label'])].append(e)
        for rid in e['record_ids']:byrecord[rid].append(e)
    duplicate_records=[{'record_id':k,'ids':[x['id'] for x in v]} for k,v in byrecord.items() if len(v)>1]
    candidates=[]
    for title,es in bylabel.items():
        if len(es)>1:candidates.append({'label':title,'ids':[e['id'] for e in es],'canonical_names':[e['canonical_name'] for e in es],'msc':[e['msc'] for e in es],'source_files':[representative[e['id']] for e in es]})
    (ROOT/'reports/planetmath-dedup-candidates.json').write_text(json.dumps({'same_record_id_groups':duplicate_records,'same_label_groups':candidates,'warning':'Do not auto-merge same-label canonical numeric suffixes; they frequently encode distinct mathematical meanings.'},ensure_ascii=False,indent=2))
    print(json.dumps(report),flush=True)

def verified_dedup_report():
    if sha((OUT/'entries.jsonl').read_bytes())!='7763910fb70f234802f2fe4d1cf71cf1edf9cc00515731d34283ae8d027ddb66':
        raise ValueError('Manual identity review is bound to the original reviewed entry snapshot')
    entries=loadlines(OUT/'entries.jsonl');byid={e['id']:e for e in entries};manifest=json.loads((OUT/'tex-manifest.json').read_text());paths=manifest['representative_source_files']
    def body(rid):
        data=(ROOT/paths[rid]).read_bytes()
        if sha(data)!=byid[rid]['source_sha256']:raise ValueError('Source changed during identity review')
        return data.decode('utf-8',errors='replace').split('\\begin{document}',1)[-1].split('\\end{document}',1)[0]
    # Manually reviewed concept identity, not whole-article theorem verification.
    decisions=[
      ('Bounded',['Bounded1'],'Both entries explicitly finish with bounded subsets of an arbitrary metric space; strict versus non-strict finite bound gives the same property. Range-bounded functions are additional exposition.'),
      ('ConjugacyClass',['ConjugacyClass1'],'Both define equivalence classes of group elements under x -> g x g^{-1}. The first additionally discusses conjugate subsets.'),
      ('Eigenvalue',['Eigenvalue1'],'Both define a scalar lambda over a field k for which the same-field vector-space endomorphism has a nonzero eigenvector T(v)=lambda v.'),
      ('FunctorCategory',['FunctorCategory1'],'Both identify the category whose objects are covariant functors and arrows are natural transformations, explicitly discussing the small-domain condition. Size caveats remain attached to each source.'),
      ('MotivicCohomology',['MotivicCohomology1'],'Both entries present the same higher-Chow-group and Suslin–Voevodsky motivic-complex constructions, with substantially overlapping exposition. Historical framing and correctness of all formulas are not certified.'),
      ('SymmetricGroup1',['SymmetricGroup'],'Both define the group of all bijections X -> X under composition. The shorter representative avoids known incorrect ancillary claims in the other source; all source warnings must remain.'),
      ('ZeroIdeal',['ZeroIdeal1'],'Both identify the singleton {0} ideal in a ring. Additional source remarks retain their original scope and are not automatically verified.'),
      ('CarmichalNumber561',['CarmichalNumber5611'],'Both explicitly identify the same integer 561 as their subject; differing Gaussian pseudoprime example bases remain unverified source claims, not separate mathematical objects.'),
      ('GrothendieckCategoryTheorems',['GrothendieckCategoryTheorems1','GrothendieckCategoryTheorems12','GrothendieckCategoryTheorems123'],'The complete extracted document body is byte-for-byte identical after UTF-8 decoding; only source metadata differs. Mathematical validity is not certified.')
    ]
    groups=[];mapping={}
    for keep,aliases,reason in decisions:
        ids=['pm:'+keep]+['pm:'+a for a in aliases]; texts={rid:body(rid) for rid in ids}
        if len({normal_label(byid[rid]['label']) for rid in ids})!=1:raise ValueError('Unexpected subject title mismatch')
        if keep=='GrothendieckCategoryTheorems' and len({sha(t.encode()) for t in texts.values()})!=1:raise ValueError('Bodies no longer equal')
        groups.append({'keep_id':ids[0],'merge_ids':ids[1:],'decision':'same_concept_subject','reviewer':'/root/atlas_sources','verification_scope':'subject_identity_only_not_whole_source_correctness','reason':reason,'evidence':[{'id':rid,'source_file':paths[rid],'source_sha256':byid[rid]['source_sha256'],'body_sha256':sha(texts[rid].encode()),'source_url':byid[rid]['source_url']} for rid in ids]})
        mapping.update({rid:ids[0] for rid in ids[1:]})
    retained=[
      (['AdditiveFunction','AdditiveFunction1'],'additivity on vector-space addition versus number-theoretic additivity on coprime products'),
      (['CharacteristicFunction','CharacteristicFunction1'],'indicator of a set versus Fourier transform of a probability law'),
      (['BaireSpace','BaireSpace1'],'a topological property versus the particular product space N^N'),
      (['AnalyticSet','AnalyticSet1'],'holomorphic zero sets versus descriptive/measure-theoretic analytic sets'),
      (['Square','Square1'],'regular quadrilateral versus squaring operation'),
      (['Adjacent','Adjacent1'],'right-triangle non-hypotenuse side versus either triangle side incident to an angle; source explicitly distinguishes them'),
      (['Midpoint','Midpoint1'],'midpoint of a segment versus centre of symmetry of a curve or figure'),
      (['PracticalNumber','PracticalNumber1'],'different allowed-divisor conventions; the second excludes 1 and excludes powers of 2'),
      (['FreeModule','FreeModule1'],'source hypotheses differ (commutative ring with unity versus general ring); no automatic scope-collapse'),
      (['Module','Module1'],'different ring/unital-module conventions remain explicit; no automatic scope-collapse'),
      (['SieveOfEratosthenes','SieveOfEratosthenes1'],'prime-enumeration algorithm versus inclusion-exclusion counting-sieve presentation, with a known source-quality error in the former')
    ]
    kept=[]
    for names,reason in retained:
        kept.append({'ids':['pm:'+n for n in names],'decision':'retain_separate','reason':reason,'verification_scope':'subject_or_scope_difference_review','source_files':[paths['pm:'+n] for n in names]})
    candidates=json.loads((ROOT/'reports/planetmath-dedup-candidates.json').read_text())['same_label_groups'];merged_ids=set(mapping)|set(mapping.values());reviewed_keep_ids={rid for row in kept for rid in row['ids']}
    unresolved=[dict(row,decision='retain_pending_identity_review',reason='Same label/numeric suffix alone does not establish identical meaning.') for row in candidates if not set(row['ids']).issubset(merged_ids|reviewed_keep_ids)]
    report={'entry_input_sha256':sha((OUT/'entries.jsonl').read_bytes()),'same_nonempty_record_id_groups':0,'same_label_candidate_groups':len(candidates),'verified_merge_groups':len(groups),'removed_duplicate_count':len(mapping),'merge_map':mapping,'verified_groups':groups,'reviewed_distinctions':kept,'unresolved_same_label_groups':unresolved,'rules':'No auto-merge on title, numeric suffix, MSC overlap or lexical similarity alone. Exact-body identity or direct review of matching mathematical subject is required. All original files and attribution remain in the compact source package.'}
    (ROOT/'reports/planetmath-dedup-verified.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    # Concrete checks for two source-quality problems observed during identity review.
    def compose(p,q):return tuple(p[q[i]] for i in range(4))
    transposition=(2,1,0,3);cycle=(1,2,3,0);seen={(0,1,2,3)};queue=list(seen)
    while queue:
        a=queue.pop()
        for generator in (transposition,cycle):
            c=compose(generator,a)
            if c not in seen:seen.add(c);queue.append(c)
    N=10;marked=set();prime=2
    while prime*prime<=N:
        marked.update(range(prime,N+1,prime))
        prime=next(i for i in range(2,N+1) if i not in marked)
    output=[i for i in range(2,N+1) if i not in marked]
    quality={'scope':'Observed source problems encountered during identity audit; not a complete mathematical review of all entries.','issues':[
      {'id':'pm:SymmetricGroup','source_file':paths['pm:SymmetricGroup'],'source_sha256':byid['pm:SymmetricGroup']['source_sha256'],'issue':'Source says any 2-cycle and n-cycle generate S_n; false in general. Source also associates A_{n-1} with SL_{n-1}, whereas the usual correspondence is SL_n.','exact_counterexample':{'n':4,'generators_0_based':[transposition,cycle],'generated_group_order':len(seen),'S4_order':24},'concept_identity_valid':True,'whole_source_math_verified':False},
      {'id':'pm:SieveOfEratosthenes','source_file':paths['pm:SieveOfEratosthenes'],'source_sha256':byid['pm:SieveOfEratosthenes']['source_sha256'],'issue':'Literal source procedure marks p itself composite, removing the small primes. The source also calls quadratic sieve a faster prime-listing method; quadratic sieve is an integer factorization method.','exact_counterexample':{'N':N,'literal_source_output_starting_domain_at_2':output,'true_primes':[2,3,5,7]},'concept_identity_valid':True,'whole_source_math_verified':False}
    ],'recommended_action':'Keep real mathematical subjects if desired, but attach source-quality warnings; do not promote source assertions to verified facts.'}
    (ROOT/'reports/planetmath-source-quality-findings.json').write_text(json.dumps(quality,ensure_ascii=False,indent=2))
    print(json.dumps({'verified_merge_groups':len(groups),'duplicate_records_removed':len(mapping),'retained_unresolved_groups':len(unresolved),'source_quality_issues':len(quality['issues'])}))

def verify_existing():
    manifest=json.loads((OUT/'tex-manifest.json').read_text())
    for row in manifest['files']:
        p=ROOT/row['source_file']
        if not p.is_file() or sha(p.read_bytes())!=row['source_sha256']:raise ValueError('Offline source verification failed: '+str(p))
    if sha((OUT/'entries.jsonl').read_bytes())!=manifest['entry_input_sha256']:raise ValueError('Entry list changed')
    print(json.dumps({'offline_source_verification':'passed','source_files':len(manifest['files'])}))

if __name__=="__main__":
    import argparse
    parser=argparse.ArgumentParser();parser.add_argument("--verify-only",action="store_true");parser.add_argument("--review-only",action="store_true");args=parser.parse_args()
    if args.verify_only:verify_existing()
    elif args.review_only:verified_dedup_report()
    else:main();verified_dedup_report()
