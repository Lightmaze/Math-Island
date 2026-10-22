#!/usr/bin/env python3
"""Extract labelled mathematical statement units from a pinned Stacks source.

No TeX is executed. References are syntactic references, not checked dependencies.
"""
import argparse, collections, datetime, hashlib, json, pathlib, re, tarfile, urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
BASE = ROOT / 'sources/stacks'
COMMIT = 'a04446e57ec1fbc252a871afcec7752fb2807b14'
ENV = re.compile(r'\\begin\{(lemma|theorem|proposition|corollary|definition)\}(.*?)\\end\{\1\}', re.S)

def sha(b): return hashlib.sha256(b).hexdigest()
def uncomment(s): return re.sub(r'(?<!\\)%[^\n]*', '', s)
def dump(path, data): path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
def main():
    BASE.mkdir(parents=True,exist_ok=True)
    archive=BASE/'source.tar.gz'
    if not archive.exists():
        url=f'https://codeload.github.com/stacks/stacks-project/tar.gz/{COMMIT}'
        b=urllib.request.urlopen(url,timeout=120).read();archive.write_bytes(b)
        dump(BASE/'manifest.json',dict(commit=COMMIT,url=url,sha256=sha(b),bytes=len(b)))
    manifest=json.loads((BASE/'manifest.json').read_text())
    assert manifest['commit']==COMMIT and sha(archive.read_bytes())==manifest['sha256']
    tex=BASE/'tex';tex.mkdir(exist_ok=True)
    with tarfile.open(archive) as t:
        for m in t.getmembers():
            rel='/'.join(m.name.split('/')[1:])
            if m.isfile() and (rel.endswith('.tex') or rel in ['tags/tags','COPYING','README','CONTRIBUTORS']):
                assert '..' not in pathlib.PurePosixPath(rel).parts
                dest=tex/rel;dest.parent.mkdir(parents=True,exist_ok=True)
                dest.write_bytes(t.extractfile(m).read())
    tags={label:tag for tag,label in (x.split(',',1) for x in (tex/'tags/tags').read_text().splitlines() if x and not x.startswith('#'))}
    chapters=dict(re.findall(r'\\hyperref\[([^\]]+)-section-phantom\]\{([^}]+)\}',(tex/'chapters.tex').read_text()))
    rows=[];reject=[]
    for p in sorted(tex.glob('*.tex')):
        raw=p.read_bytes();s=uncomment(raw.decode());stem=p.stem
        for m in ENV.finditer(s):
            env,body=m.groups(); labels=re.findall(r'\\label\{([^}]+)\}',body)
            if not labels: continue
            label=labels[0];full=stem+'-'+label;tag=tags.get(full)
            if not tag:
                reject.append(dict(chapter=stem,label=label,reason='no_stable_tag'));continue
            # Statement key removes bookkeeping, but preserves symbols and names.
            normalized=re.sub(r'\\label\{[^}]+\}|\\slogan\{[^}]*\}', '',body)
            normalized=re.sub(r'\s+',' ',normalized).strip()
            if len(normalized)<15:
                reject.append(dict(tag=tag,reason='empty_or_too_short_statement'));continue
            proof='';tail=s[m.end():];pr=re.match(r'\s*\\begin\{proof\}(.*?)\\end\{proof\}',tail,re.S)
            if pr: proof=pr.group(1)
            # A \\ref can address an item inside a statement; leave unresolved refs explicit.
            refs=[]
            for where,text in [('statement',body),('proof',proof)]:
                for ref in sorted(set(re.findall(r'\\(?:ref|eqref)\{([^}]+)\}',text))):
                    f=ref if ref in tags else stem+'-'+ref
                    refs.append(dict(target_label=f,target_tag=tags.get(f),location=where))
            readable=re.sub(r'^(lemma|theorem|proposition|corollary|definition)-','',label).replace('-',' ')
            slogan=re.search(r'\\slogan\{([^}]+)\}',body,re.S)
            display=re.sub(r'\s+',' ',slogan.group(1)).strip() if slogan else readable
            rows.append(dict(id='stacks:'+tag,label=f'{display} [{tag}]',kind='concept' if env=='definition' else 'theorem',source_kind=env,
                chapter=stem,chapter_title=chapters.get(stem,stem),tag=tag,full_label=full,source_url='https://stacks.math.columbia.edu/tag/'+tag,
                source_id='stacks',source_file=str(p.relative_to(ROOT)),source_sha256=sha(raw),source_commit=COMMIT,
                statement_tex=body.strip(),statement_normalized_sha256=sha(normalized.encode()),proof_present=bool(proof),
                references=refs,source_license='GFDL-1.2-or-later',label_origin='source_slogan_or_editorial_expansion_of_TeX_label'))
    # Context is chapter+label: repeated bodies referring to local notation are NOT
    # collapsed on text alone. Stable source tags identify statement units.
    with (BASE/'entries.jsonl').open('w') as f:
        for row in rows:f.write(json.dumps(row,ensure_ascii=False)+'\n')
    report=dict(source='The Stacks Project',commit=COMMIT,archive_sha256=manifest['sha256'],
        generated_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),entries=len(rows),
        kinds=dict(collections.Counter(x['source_kind'] for x in rows)),chapters=len(set(x['chapter'] for x in rows)),
        raw_references=sum(len(x['references']) for x in rows),rejected=reject,
        scope='Every labelled definition/theorem/lemma/proposition/corollary with a stable tag; proof/example/section/item tags excluded.',
        limitations=['A tag is a sourced statement unit, not a separate mathematical theory.',
          'Theorem environments report source classification; this extraction is not formal verification.',
          'Syntactic proof references may cite definitions, equations, or explanatory material and are not certified proof dependencies.',
          'Local context remains in the linked source chapter; statement snippets alone need not be self-contained.'])
    dump(ROOT/'reports/stacks-source.json',report)
    print(json.dumps({k:v for k,v in report.items() if k!='rejected'},ensure_ascii=False))
if __name__=='__main__':main()
