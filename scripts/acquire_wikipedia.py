#!/usr/bin/env python3
"""Acquire factual index metadata, not encyclopedia article text."""
import concurrent.futures, datetime, hashlib, html, json, re, string, time, urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'sources'/'wikipedia'; OUT.mkdir(parents=True,exist_ok=True)
HEADERS={'User-Agent':'MathAtlasResearch/0.1 (index metadata research)'}
def get(url):
 for k in range(3):
  try:
   with urllib.request.urlopen(urllib.request.Request(url,headers=HEADERS),timeout=40) as r:return r.read(),r.geturl()
  except Exception:
   if k==2:raise
   time.sleep(k+1)
def acquire_mathworld():
 def one(letter):
  url=f'https://mathworld.wolfram.com/letters/{letter}.html'; b,final=get(url); s=b.decode()
  entries=[]
  for href,label in re.findall(r'<a\b[^>]*href="(/[^/\"?#]+\.html)"[^>]*>(.*?)</a>',s,re.S|re.I):
   title=html.unescape(re.sub('<[^>]+>','',label)).strip()
   if title:entries.append({'title':title,'url':'https://mathworld.wolfram.com'+href,'index_url':url})
  return entries,{'url':url,'final_url':final,'sha256':hashlib.sha256(b).hexdigest(),'bytes':len(b),'entry_count':len(entries),'fetched_at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 rows=[];manifest=[]
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as ex:
  for entries,source in ex.map(one,'0'+string.ascii_uppercase):rows.extend(entries);manifest.append(source)
 byurl={}
 for r in rows:
  if r['url'] not in byurl:byurl[r['url']]=r|{'index_urls':[r['index_url']]}
  elif r['index_url'] not in byurl[r['url']]['index_urls']:byurl[r['url']]['index_urls'].append(r['index_url'])
 nodes=sorted(byurl.values(),key=lambda x:x['url'])
 (OUT/'mathworld-index.json').write_text(json.dumps(nodes,ensure_ascii=False,indent=2))
 (OUT/'mathworld-index-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
 print(json.dumps({'mathworld_distinct_urls':len(nodes),'raw_links':len(rows),'first':nodes[:3]},ensure_ascii=False),flush=True)

def acquire_wikipedia_indexes():
 def one(letter):
  url=f'https://en.wikipedia.org/wiki/List_of_mathematics_articles_({letter})'
  b,final=get(url);(OUT/f'wikipedia-index-{letter}.html').write_bytes(b)
  s=b.decode(); s=s[s.find('mw-parser-output'):]
  entries=[]
  for attrs,body in re.findall(r'<a\b([^>]+)>(.*?)</a>',s,re.S|re.I):
   h=re.search(r'href="([^"]+)"',attrs);t=re.search(r'title="([^"]+)"',attrs)
   if not h or not t:continue
   href=html.unescape(h[1]);title=html.unescape(t[1]);label=html.unescape(re.sub('<[^>]+>','',body)).strip()
   if not href.startswith('https://en.wikipedia.org/wiki/') or not label or ':' in href.split('/wiki/')[-1]:continue
   if 'mw-redirect' in attrs or 'mw-disambig' in attrs or 'class="new"' in attrs:continue
   entries.append({'title':title,'url':href,'index_url':url})
  return entries,{'url':url,'final_url':final,'sha256':hashlib.sha256(b).hexdigest(),'bytes':len(b),'entry_count':len(entries),'fetched_at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 rows=[];manifest=[]
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as ex:
  for entries,source in ex.map(one,string.ascii_uppercase):rows.extend(entries);manifest.append(source)
 nodes=sorted({r['url']:r for r in rows}.values(),key=lambda x:x['url'])
 (OUT/'wikipedia-index.json').write_text(json.dumps(nodes,ensure_ascii=False,indent=2));(OUT/'wikipedia-index-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
 print(json.dumps({'wikipedia_nonredirect_distinct_urls':len(nodes),'raw_links':len(rows),'first':nodes[:3]},ensure_ascii=False),flush=True)

BRIDGES=[
('Langlands_program','朗兰兹纲领','number_theory','research_program'),
('Modularity_theorem','模性定理','number_theory','theorem'),
('Perfectoid_space','完美胚空间','geometry','object'),
('Prismatic_cohomology','棱柱上同调','geometry','tool'),
('Étale_cohomology','平展上同调','geometry','tool'),
('Motivic_cohomology','动机上同调','geometry','tool'),
('Geometric_Langlands_correspondence','几何朗兰兹对应','geometry','research_program'),
('Homotopy_type_theory','同伦类型论','logic','theory'),
('Univalent_foundations','单价基础','logic','framework'),
('Topological_quantum_field_theory','拓扑量子场论','geometry','theory'),
('Mirror_symmetry_(string_theory)','镜像对称','geometry','correspondence'),
('Floer_homology','弗洛尔同调','geometry','tool'),
('Monstrous_moonshine','魔群月光','algebra','correspondence'),
('Vertex_operator_algebra','顶点算子代数','algebra','object'),
('Modular_form','模形式','number_theory','object'),
('Ramanujan_graph','拉马努金图','discrete','object'),
('Expander_graph','扩展图','discrete','object'),
('Spectral_graph_theory','谱图论','discrete','theory'),
('Compressed_sensing','压缩感知','analysis','method'),
('Restricted_isometry_property','限制等距性质','analysis','property'),
('Random_matrix_theory','随机矩阵理论','probability','theory'),
('Free_probability','自由概率','probability','theory'),
('Optimal_transport','最优传输','analysis','theory'),
('Ricci_flow','里奇流','geometry','method'),
('Geometric_measure_theory','几何测度论','analysis','theory'),
('Regularity_structure','正则结构','analysis','tool'),
('Rough_path','粗糙路径','probability','object'),
('Large_sieve','大筛法','number_theory','method'),
('Arithmetic_combinatorics','算术组合学','number_theory','field'),
('Green–Tao_theorem','格林–陶定理','number_theory','theorem'),
]

def acquire_bridges(seeds=None, append=False):
 from lxml import html as LH
 from urllib.parse import quote,unquote,urljoin,urlparse
 output=OUT/'bridges';output.mkdir(exist_ok=True)
 def one(seed):
  slug,zh,domain,kind=seed
  source_slug=SOURCE_OVERRIDES.get(slug,slug)
  page_slug,_,section_id=source_slug.partition('#')
  url='https://en.wikipedia.org/wiki/'+quote(page_slug,safe="_()'–")
  try:b,final=get(url)
  except Exception as e:return None,{'url':url,'error':str(e)}
  doc=LH.fromstring(b)
  root=doc.xpath('//*[@class and contains(concat(" ",normalize-space(@class)," ")," mw-parser-output ")]')
  if not root:return None,{'url':url,'error':'article content not found'}
  root=max(root,key=lambda el:len(el.text_content()))
  if section_id:
   heads=root.xpath('.//*[@id=$sid]',sid=section_id)
   if not heads:return None,{'url':url,'error':'requested source section not found'}
   head=heads[0];container=head.getparent() if head.getparent().tag=='div' else head
   block=LH.Element('div'); block.append(LH.fromstring(LH.tostring(head)))
   el=container.getnext()
   while el is not None:
    if el.tag in ['h1','h2','h3'] or el.xpath('./h1|./h2|./h3'):break
    block.append(LH.fromstring(LH.tostring(el)));el=el.getnext()
   root=block
  for el in root.xpath('.//*[contains(concat(" ",normalize-space(@class)," ")," navbox ") or contains(concat(" ",normalize-space(@class)," ")," sidebar ") or contains(concat(" ",normalize-space(@class)," ")," reflist ") or contains(concat(" ",normalize-space(@class)," ")," hatnote ")]'):
   parent=el.getparent()
   if parent is not None:parent.remove(el)
  main_title=doc.xpath('//h1//text()');title=(section_id.replace('_',' ') if section_id else ''.join(main_title).strip()) or slug.replace('_',' ')
  links=set()
  for href in root.xpath('.//a/@href'):
   u=urljoin(final,href);p=urlparse(u)
   if p.netloc=='en.wikipedia.org' and p.path.startswith('/wiki/'):
    t=unquote(p.path[len('/wiki/'):]).replace('_',' ')
    if ':' not in t:links.add(t)
  lead=[]
  for el in root.xpath('.//p'):
   text=' '.join(el.text_content().split())
   if text:lead.append(text)
   if sum(map(len,lead))>500:break
  canonical=doc.xpath('//link[@rel="canonical"]/@href');rev=re.findall(r'"wgRevisionId":(\d+)',b.decode())
  source={'url':url,'final_url':final,'canonical_url':canonical[0] if canonical else final,'sha256':hashlib.sha256(b).hexdigest(),'bytes':len(b),'revision_id':rev[0] if rev else None,'fetched_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'license':'CC BY-SA 4.0; see Wikipedia page footer and history','content_cache':f'sources/wikipedia/bridges/{slug}.html'}
  if section_id:
   source['canonical_url']+='#'+section_id; source['source_scope']='named_article_section';source['section_id']=section_id
  (output/f'{slug}.html').write_bytes(b)
  node={'id':'wikipedia:'+slug,'title':title,'title_zh':zh,'url':source['canonical_url'],'source':'Wikipedia','source_sha256':source['sha256'],'domain':domain,'kind':kind,'kind_status':'manual_title_level_classification','summary':' '.join(lead)[:700],'source_links':sorted(links),'mathcups_type_status':'unassigned','semantic_proof_status':'not_checked'}
  node['source_scope']=source.get('source_scope','article')
  if source.get('section_id'):node['source_section_id']=source['section_id']
  return node,source
 nodes=json.loads((OUT/'wikipedia-bridge-nodes.json').read_text()) if append else [];manifest=json.loads((OUT/'wikipedia-bridge-manifest.json').read_text()) if append else []
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as ex:
  for node,m in ex.map(one,seeds if seeds is not None else BRIDGES):
   if node:nodes.append(node)
   manifest.append(m)
 nodes=list({n['id']:n for n in nodes}.values());manifest=list({m.get('content_cache',m['url']):m for m in manifest}.values())
 for m in manifest:
  if m.get('revision_id'):
   m['revision_url']='https://en.wikipedia.org/w/index.php?oldid='+m['revision_id'];m['history_url']=m['canonical_url'].split('#')[0]+'?action=history'
 bytitle={n['title']:n['id'] for n in nodes}
 for n in nodes:bytitle[n['id'].split(':',1)[1].replace('_',' ')]=n['id']
 edges=[]
 for n in nodes:
  for label in n['source_links']:
   target=bytitle.get(label)
   if target and target!=n['id']:edges.append({'source':n['id'],'target':target,'relation':'source_hyperlink','evidence_url':n['url'],'evidence_sha256':n['source_sha256'],'evidence_locator':f'article-content link to {label}; navigation/references lists excluded','semantic_status':'hyperlink_observed_not_proof_dependency'})
 (OUT/'wikipedia-bridge-nodes.json').write_text(json.dumps(nodes,ensure_ascii=False,indent=2));(OUT/'wikipedia-bridge-edges.json').write_text(json.dumps(edges,ensure_ascii=False,indent=2));(OUT/'wikipedia-bridge-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
 print(json.dumps({'bridge_nodes':len(nodes),'bridge_edges':len(edges),'errors':[m for m in manifest if 'error' in m]},ensure_ascii=False),flush=True)

SOURCE_OVERRIDES={
 'Stable_theory':'Stability_(model_theory)',
 'Polynomial_partitioning':'Polynomial_method_in_combinatorics#Polynomial_partitioning',
}
EXTRA_BRIDGES=[
 ('Sphere_packing','球堆积','geometry','problem'),
 ('Lovász_local_lemma','洛瓦兹局部引理','probability','theorem'),
 ('Randomized_algorithm','随机化算法','discrete','method'),
 ('Ricci_curvature','里奇曲率','geometry','object'),
 ('Error_correction_code','纠错码','discrete','object'),
 ('Stable_theory','稳定理论（模型论）','logic','theory'),
 ('Szemerédi_regularity_lemma','塞迈雷迪正则性引理','discrete','theorem'),
 ('Intuitionistic_logic','直觉主义逻辑','logic','theory'),
 ('Type_theory','类型论','logic','theory'),
 ('Homotopy_theory','同伦论','geometry','theory'),
 ('Jones_polynomial','琼斯多项式','geometry','invariant'),
 ('Concentration_of_measure','测度集中','probability','phenomenon'),
 ('Johnson–Lindenstrauss_lemma','约翰逊–林登施特劳斯引理','analysis','theorem'),
 ('Polynomial_partitioning','多项式分割','discrete','method'),
 ('Semidefinite_programming','半定规划','analysis','method'),
 ('Shannon_capacity_of_a_graph','图的香农容量','discrete','invariant'),
 ('Polynomial_interpolation','多项式插值','analysis','method'),
 ('Reed–Solomon_error_correction','里德–所罗门码','discrete','object'),
 ('Polynomial_identity_testing','多项式恒等式检验','discrete','problem'),
 ('Sum-check_protocol','和检验协议','logic','method'),
]
if __name__ == "__main__":
 import argparse
 parser=argparse.ArgumentParser();parser.add_argument("--source",choices=["bridges","extra-bridges","all-bridges","wikipedia-index","mathworld-index"],default="all-bridges");args=parser.parse_args()
 {"bridges":acquire_bridges,"extra-bridges":lambda:acquire_bridges(EXTRA_BRIDGES,append=True),"all-bridges":lambda:acquire_bridges(BRIDGES+EXTRA_BRIDGES),"wikipedia-index":acquire_wikipedia_indexes,"mathworld-index":acquire_mathworld}[args.source]()
