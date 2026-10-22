#!/usr/bin/env python3
"""Acquire official PlanetMath TeX archives and extract auditable metadata and explicit links.
Does not execute TeX. Preserves received archive bytes; dedup is done downstream.
"""
import concurrent.futures, datetime, hashlib, io, json, re, tarfile, time, urllib.request
from pathlib import Path
BASE=Path(__file__).resolve().parents[1]; OUT=BASE/'source'/'planetmath'; OUT.mkdir(parents=True,exist_ok=True)
UA='MathCups Mathematical Atlas research dataset / source metadata only'
def fetch(url):
    req=urllib.request.Request(url,headers={'User-Agent':UA})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req,timeout=90) as r: return r.read()
        except Exception:
            if attempt==2: raise
            time.sleep(1+attempt)
def digest(b): return hashlib.sha256(b).hexdigest()
def args(text,cmd):
    # balanced TeX braces, not a full TeX interpreter
    out=[]
    for m in re.finditer(r'\\'+re.escape(cmd)+r'\s*\{',text):
        pos=m.end(); start=pos; depth=1
        while pos<len(text) and depth:
            if text[pos]=='{' and (pos==0 or text[pos-1]!='\\'): depth+=1
            elif text[pos]=='}' and (pos==0 or text[pos-1]!='\\'): depth-=1
            pos+=1
        if depth==0: out.append(text[start:pos-1])
    return out
def groups(text,cmd,n):
    out=[]
    for m in re.finditer(r'\\'+re.escape(cmd)+r'\s*(?=\{)',text):
        pos=m.end();vals=[]
        for _ in range(n):
            while pos<len(text) and text[pos].isspace():pos+=1
            if pos>=len(text) or text[pos]!='{': break
            pos+=1;start=pos;depth=1
            while pos<len(text) and depth:
                if text[pos]=='{' and text[pos-1]!='\\':depth+=1
                elif text[pos]=='}' and text[pos-1]!='\\':depth-=1
                pos+=1
            if depth:break
            vals.append(text[start:pos-1])
        if len(vals)==n:out.append(vals)
    return out

def one(repo):
    name=repo['name']; branch=repo['default_branch'];url=f'https://codeload.github.com/planetmath/{name}/tar.gz/refs/heads/{branch}'
    path=OUT/(name+'.tar.gz')
    if not path.exists(): path.write_bytes(fetch(url))
    b=path.read_bytes(); archive_hash=digest(b); records=[];licenses=[]
    with tarfile.open(fileobj=io.BytesIO(b),mode='r:gz') as t:
        for member in t.getmembers():
            if not member.isfile():continue
            if member.name.endswith('/LICENSE'):
                txt=t.extractfile(member).read().decode('utf-8',errors='replace')
                licenses.append({'path':member.name,'sha256':digest(txt.encode()),'cc_by_sa_3_0':'Attribution-ShareAlike 3.0 Unported' in txt})
                lic=OUT/'LICENSE-CC-BY-SA-3.0.txt'
                if not lic.exists():lic.write_text(txt)
            if not member.name.endswith('.tex'): continue
            raw=t.extractfile(member).read();txt=raw.decode('utf-8',errors='replace');meta=txt.split('\\endmetadata',1)[0]
            cn=args(meta,'pmcanonicalname'); title=args(meta,'pmtitle');typ=args(meta,'pmtype')
            if not cn or not title:continue
            rel=[]
            for v in args(meta,'pmrelated'):rel.append({'relation':'pmrelated','target_name':v,'evidence':f'\\pmrelated{{{v}}}'})
            for cmd in ('PMlinkname','PMlinkid','PMlinkexternal','PMlinkescapetext'):
                if cmd=='PMlinkescapetext':continue
                for label,target in groups(txt,cmd,2):rel.append({'relation':cmd,'target_name':target,'label':label,'evidence':f'\\{cmd}{{{label}}}{{{target}}}'})
            for v in args(txt,'PMlinktofile'):rel.append({'relation':'PMlinktofile','target_name':v})
            record=groups(meta,'pmrecord',2)
            authors=groups(meta,'pmauthor',2); owner=groups(meta,'pmowner',2)
            pathin=member.name.split('/',1)[1]
            records.append({'canonical_name':cn[0], 'title_tex':title[0], 'pm_type':typ[0] if typ else 'unknown', 'planetmath_record_id':record[0][1] if record else None,'record_revision':record[0][0] if record else None,'msc':[v[1] for v in groups(meta,'pmclassification',2) if v[0]=='msc'],'authors':[{'name':a,'id':i} for a,i in authors or owner],'aliases':args(meta,'pmsynonym'),'defined_terms':args(meta,'pmdefines'),'related_links':rel,'repository':'planetmath/'+name,'repository_msc':name[:2],'source_path':pathin,'source_url':f'https://github.com/planetmath/{name}/blob/{branch}/{pathin}','planetmath_url':'https://planetmath.org/'+cn[0].lower(),'archive_sha256':archive_hash,'tex_sha256':digest(raw),'created':(args(meta,'pmcreated') or [None])[0],'modified':(args(meta,'pmmodified') or [None])[0],'body_character_count':len(txt.split('\\begin{document}',1)[-1].split('\\end{document}',1)[0]),'license':'CC-BY-SA-3.0'})
    print(name,len(records),len(b),flush=True)
    return {'repository':'planetmath/'+name,'archive_url':url,'archive_file':path.name,'archive_sha256':archive_hash,'archive_bytes':len(b),'repository_pushed_at':repo.get('pushed_at'),'retrieved_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'licenses':licenses,'records_count':len(records)},records

def main():
    repospath=OUT/'repos.json'
    if not repospath.exists():repospath.write_bytes(fetch('https://api.github.com/orgs/planetmath/repos?per_page=100'))
    repos=[x for x in json.loads(repospath.read_text()) if re.match(r'^\d\d_',x['name'])]
    manifests=[];records=[];failures=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        jobs={pool.submit(one,r):r for r in repos}
        for f in concurrent.futures.as_completed(jobs):
            try:m,rs=f.result();manifests.append(m);records.extend(rs)
            except Exception as e: failures.append({'repo':jobs[f]['name'],'error':str(e)});print('FAIL',jobs[f]['name'],repr(e),flush=True)
    manifests.sort(key=lambda x:x['repository']);records.sort(key=lambda x:(x['canonical_name'],x['repository']))
    with (OUT/'records.jsonl').open('w') as f:
        for r in records:f.write(json.dumps(r,ensure_ascii=False)+'\n')
    (OUT/'manifest.json').write_text(json.dumps({'source':'official PlanetMath GitHub MSC repositories','acquisition_method':'GitHub connector discovered repositories; official bulk archives downloaded through inherited HTTPS proxy because connector cannot bulk-download 63 archives.','repository_count':len(repos),'archives':manifests,'failures':failures,'raw_record_count':len(records),'records_sha256':digest((OUT/'records.jsonl').read_bytes())},indent=2,ensure_ascii=False))
    from collections import Counter
    report={'repositories_succeeded':len(manifests),'failed':failures,'raw_records':len(records),'unique_canonical_names':len({r['canonical_name'].casefold() for r in records}),'unique_record_ids':len({r['planetmath_record_id'] for r in records if r['planetmath_record_id']}),'types':dict(Counter(r['pm_type'] for r in records)),'all_archives_cc_by_sa_3_0':all(m['licenses'] and all(x['cc_by_sa_3_0'] for x in m['licenses']) for m in manifests),'raw_explicit_links':sum(len(r['related_links']) for r in records)}
    (BASE/'reports'/'planetmath-source.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report),flush=True)

def normalize_entries():
    import collections, html, unicodedata
    records=[json.loads(l) for l in (OUT/'records.jsonl').read_text().splitlines()]
    by_canon=collections.defaultdict(list)
    for r in records: by_canon[r['canonical_name'].casefold()].append(r)
    mapping={'Definition':'concept','Theorem':'theorem','Result':'result','Corollary':'corollary','Conjecture':'conjecture','Axiom':'axiom','Algorithm':'method','Topic':'topic','Proof':'proof','Example':'example','Derivation':'derivation','Application':'application','Data Structure':'table','Biography':'person','Bibliography':'bibliography','Feature':'feature','unknown':'unclassified'}
    allowed={'Definition','Theorem','Result','Corollary','Conjecture','Axiom','Algorithm'}
    editorial=re.compile(r'(^|\b)(sandbox|bibliograph|biograph|preface|contents|holding bay|spam|index of|temporary index|list of|table of|topics in|world records|genealogy|limerick|request for|mathematics subject classification|planetmath)(\b|$)',re.I)
    def label(s):
        s=html.unescape(s)
        for a,b in [(r'\"o','ö'),(r'\"u','ü'),(r'\"a','ä'),(r'\"O','Ö'),(r'\"U','Ü'),(r'\"A','Ä'),(r"\'e",'é'),(r"\'E",'É'),(r'\v{C}','Č'),(r'\v{c}','č'),(r'\v{S}','Š'),(r'\v{s}','š'),(r'\ss','ß'),(r'\i','i')]:s=s.replace(a,b)
        s=re.sub(r'\\(?:emph|textit|textbf|mathrm|operatorname)\{([^{}]*)\}',r'\1',s)
        s=s.replace('~',' ').replace('---','—').replace('--','–')
        return re.sub(r'\s+',' ',s).strip()
    def domain(msc):
        n=int(msc) if msc.isdigit() else -1
        if n in (0,1,3,97):return 'logic-foundations'
        if n in (5,6,68,94):return 'discrete-computation'
        if n==11:return 'number-theory'
        if n in (8,12,13,15,16,17,18,19,20,22):return 'algebra'
        if n in (14,51,52,53,54,55,57):return 'geometry-topology'
        if n in (60,62):return 'probability-statistics'
        if n in (65,49,90):return 'numerics-optimization'
        if n>=70:return 'mathematical-physics-applications'
        return 'analysis'
    entries=[];rejected=[]; aux=[]
    for canon,rs in sorted(by_canon.items()):
        r=max(rs,key=lambda x:(int(x['record_revision']) if str(x['record_revision']).isdigit() else 0,x['body_character_count'],x['source_url']))
        title=label(r['title_tex']);reason=None
        if r['pm_type'] not in allowed:reason='source_type_not_counted_as_concept_island:'+r['pm_type']
        elif editorial.search(title):reason='editorial_index_or_bibliographic_title'
        elif re.search(r'^(?:an? |alternative |another |elementary |direct )?proof(?:s)? (?:of|that)\b',title,re.I):reason='proof_title_not_independent_concept'
        elif r['body_character_count']<50:reason='empty_or_near_empty_source_body'
        rid='pm:'+r['canonical_name']
        entry={'id':rid,'label':title,'label_tex':r['title_tex'],'canonical_name':r['canonical_name'],'aliases':sorted(set(a for q in rs for a in q['aliases'])),'source_url':r['source_url'],'source_file':r['repository']+'/'+r['source_path'],'source_sha256':r['tex_sha256'],'archive_sha256':r['archive_sha256'],'kind':mapping[r['pm_type']],'kind_source':'PlanetMath pmtype metadata','source_type':r['pm_type'],'msc':sorted(set(a for q in rs for a in q['msc'])),'domain':domain(r['repository_msc']),'domain_source':'repository MSC prefix; provisional grouping','related':[dict(a,source_tex_sha256=q['tex_sha256'],source_url=q['source_url']) for q in rs for a in q['related_links']],'source_id':'planetmath','author':r['authors'],'defined_terms':sorted(set(a for q in rs for a in q['defined_terms'])),'record_ids':sorted(set(q['planetmath_record_id'] for q in rs if q['planetmath_record_id'])),'source_urls':sorted(set(q['source_url'] for q in rs)),'license':'CC-BY-SA-3.0','body_character_count':r['body_character_count'],'count_as_island':reason is None,'include_recommended':reason is None,'inclusion_method':'source metadata allowlist, canonical-name merge and explicit editorial/empty filters; no manual verification of every mathematical statement','verification_status':'source_metadata_extracted_not_math_proof_verified'}
        if reason:entry['exclusion_reason']=reason;rejected.append(entry)
        else:entries.append(entry)
    for fn,rows in [('entries.jsonl',entries),('excluded-entries.jsonl',rejected)]:
        with (OUT/fn).open('w') as f:
            for row in rows:f.write(json.dumps(row,ensure_ascii=False)+'\n')
    report=json.loads((BASE/'reports'/'planetmath-source.json').read_text())
    report.update({'accepted_islands':len(entries),'rejected_or_auxiliary':len(rejected),'canonically_merged_raw_duplicates':len(records)-len(by_canon),'accepted_kind_counts':dict(collections.Counter(r['kind'] for r in entries)),'exclusion_counts':dict(collections.Counter(r['exclusion_reason'] for r in rejected)),'entry_sha256':digest((OUT/'entries.jsonl').read_bytes()),'identity_rule':'canonical name casefold; empty pmrecord IDs never merge unrelated records','type_truth_limit':'Source pmtype and content are editorial source claims; not independently re-proved. Topic metadata may include broader expositions.'})
    (BASE/'reports'/'planetmath-source.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    (BASE/'reports'/'planetmath-source.txt').write_text('PlanetMath 官方来源采集与纳入说明\n\n已获取官方组织的 63 个 MSC 分域仓库，无下载失败。每个归档都核验包含 CC BY-SA 3.0 许可。原始归档按 SHA-256 固定。连接器用于发现源，批量归档因连接器无批量下载能力由 HTTPS 下载。\n\n'+json.dumps(report,ensure_ascii=False,indent=2)+'\n\n纳入真实数学定义、定理、结果、推论、猜想、公理、算法。Topic、Feature、Data Structure（该来源主要是表格和名单）、Proof、Example、Derivation、Application 和来源类型不明项保留在 excluded-entries.jsonl 作为辅助材料，不计独立概念岛屿；人物、书目、编辑目录、空记录不计数。相关航线仅来自原文明确 pmrelated / PMlinkname / PMlinkid 命令。PMlinkexternal 是否命中另一岛屿须下游核对；自动词语提及若使用，必须另标候选。\n\n本源独立严格纳入不足 10000，不得称其单独达到用户数量要求。本文没有验证全部数学陈述的正确性，也没有把正文更新时间视作数学发现时间。\n')
    print(json.dumps(report,ensure_ascii=False),flush=True)

if __name__=="__main__":
    import argparse
    parser=argparse.ArgumentParser();parser.add_argument("--normalize-only",action="store_true");options=parser.parse_args()
    if not options.normalize_only:main()
    normalize_entries()
