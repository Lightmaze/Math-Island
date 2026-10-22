#!/usr/bin/env python3
import hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=ROOT/'reports/atlas-original-source-samples-initial.json'
if not p.exists():p=ROOT/'reports/atlas-original-source-samples.json'
original=json.loads(p.read_text());samples={r['id']:r for r in original['samples']}
cohort=ROOT/'reports/audit-initial-sample-cohort.json'
if not cohort.exists():cohort.write_text(json.dumps({'seed':20261022,'initial_nodes_sha256':hashlib.sha256((ROOT/'data/nodes.jsonl').read_bytes()).hexdigest(),'initial_sample_ids':[r['id'] for r in original['samples']],'original_samples_sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'sampling':'Independent domain-stratified random sample. Preserve this initial cohort even if exclusions or merges change the final data.'},ensure_ascii=False,indent=2)+'\n')
copy=ROOT/'reports/atlas-original-source-samples-initial.json'
if not copy.exists():copy.write_bytes(p.read_bytes())
items=[
 ('A-C01','pm:InteriorPointOfSetInTopologicalSpace','quarantine','empty_placeholder','正文只有“include definition of interior point of set in topological space.”，未包含定义。','从主岛计数剔除，保留审计记录。'),
 ('A-C02','pm:RareNumbers','annotate','source_claim_refuted','源称稀有数末位只能为0,2,3,7,8，却给出65；65+56=121、65−56=9，65符合本条定义而末位5。','保留稀有数概念；源中末位限制错误，不作为已验证数学性质。'),
 ('A-C03','pm:SimplicialCategory','annotate','source_claim_refuted','源称标准几何实现Δ→Top fully faithful。HomΔ([0],[1])只有2个顶点选择，Top中的点到区间还有映到1/2的连续映射，故不full。','保留Δ的定义；把该附加断言标为错误，标准几何实现不能在Top中称fully faithful。'),
 ('A-C04','pm:LatticeOfIdeals','annotate','source_claim_refuted','源称任意环的有限生成理想构成理想格的子格，交不保有限生成。','完整理想集仍是代数完全格；有限生成理想闭于有限和，但一般不闭于交。反例环和一般分次论证见source-counterexample-execution.json。'),
 ('A-C05','pm:NoncentralChisquaredRandomVariable','annotate','source_claim_refuted_and_missing_condition','λ定义成||μ||，后续MGF/均值使用的是||μ||²；μ=2,n=1时真实均值5，源参数给出3。加法性质还未要求变量独立。','采用λ=Σμ_i²；可加性需独立；n=0的分布含原子、密度公式也需区分范围。'),
 ('A-C06','pm:PollardsrhoAlgorithm','annotate','source_example_refuted_and_success_guard_missing','n=42, f(x)=x²+12 mod42时f(12)=30而非源写的0；f(37)=37，第一轮gcd=7。源成功条件g>1还包含无用的g=n。','保留算法概念；更正示例算术，成功的非平凡因子条件为1<g<n，g=n应作为本次失败/重启。'),
 ('A-C07','pm:NewtonAndCotesFormulas','annotate','source_formula_refuted','Simpson 3/8行将3f(x2)误写成3f(x3)。f(x)=x在[0,3]时源式45/8而积分9/2。','该行应为(3h/8)[f(x0)+3f(x1)+3f(x2)+f(x3)]；其他公式不因这一检查而被认证。'),
 ('A-C08','pm:CanonicalCorrelation','annotate','missing_applicability_condition','源在只要求零均值时使用Σ11和Σ22的逆平方根；零信号允许但两协方差皆零，无法取逆。','常规推导须限定两协方差正定并在非零方差方向优化；奇异情形需另行约化或明确广义逆版本。'),
 ('A-C09','pm:CWcomplexApproximationOfQuantumStateSpacesInQAT','quarantine','unsupported_assertions_and_inference_gap','源使用未清楚定义的quantum spin foams/model category结构，无证明；从i>n同伦群同构与i=n单射直接推出weak equivalence，缺少低阶同伦群条件。','从主岛计数隔离为待专业核验来源；不将此断言作为已有数学定理。高阶信息不足的逻辑反例：点与S1在i>=2同伦群相同，但π1不同。'),
 ('A-C10','pm:OnLineEncyclopediaOfIntegerSequences','exclude_resource','counting_unit_mismatch','该记录是整数序列数据库的介绍，而不是一项数学对象、定义或命题。','保留在参考资源层，不计主图数学条目岛屿。'),
 ('A-C11','pm:HomomorphismOfLanguages','annotate','source_claim_refuted_by_standard_construction','源称上下文有关语言不闭于逆同态。标准线性空间定义下，h(w)长度至多c|w|，可在O(|w|)空间生成/模拟其LBA，因而逆同态闭包成立。','正向任意擦除同态的闭包与逆同态闭包应区分；还应明确空字约定。此处给的是纸面空间模拟论证，不是执行完备判定。'),
 ('A-C12','pm:Eigenvector','annotate','source_quantifier_refuted','定义要求特征向量非零，但后文“any multiple ... is also an eigenvector”包含零倍。','应限定非零标量倍；核心特征向量定义保留。'),
 ('A-C13','pm:CompletenessTheoremForPropositionalLogic','annotate','incomplete_proof_in_source','源的soundness证明在“then we have”处中断，completeness段仅列出定理而无证明。','命题逻辑完备性本身是标准定理；本篇不能作为完整证明的已验证证据。')
]
findings=[]
for fid,nid,action,severity,finding,requirement in items:
 s=samples[nid]
 findings.append(dict(finding_id=fid,node_id=nid,action=action,severity=severity,finding=finding,correction_or_requirement=requirement,source_url=s['source_url'],source_sha256=s['source_file_sha256'],evidence_file='reports/atlas-original-source-samples-initial.json',evidence_locator=nid,execution_evidence='reports/source-counterexample-execution.json' if fid in ['A-C02','A-C03','A-C04','A-C05','A-C06','A-C07','A-C08'] else None,discovered_in_fixed_random_sample=True,original_source_unchanged=True))
# Supplemental manual review is kept separate from the initial random cohort.
existing_path=ROOT/'reports/audit-content-findings.json'
if existing_path.exists():
 existing=json.loads(existing_path.read_text())
 current_ids={x['finding_id'] for x in findings}
 findings.extend(x for x in existing['findings'] if x['finding_id'] not in current_ids)
out={'auditor':'/root/atlas_audit','sample_size':36,'source_distribution':{'planetmath':26,'stacks':10},'findings_count':len(findings),'affected_sample_entries':len({x['node_id'] for x in findings}),'findings':findings,'initial_cohort_findings_count':13,'replacement_findings_count':sum(x.get('discovered_in_fixed_replacement_sample',False) for x in findings),'scope':'Actual content reading of fixed-seed samples, distinguished from source-identity checks. Unflagged entries are not thereby proof-certified. General arguments and finite arithmetic checks are distinguished.'}
(ROOT/'reports/audit-content-findings.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'findings':len(findings),'actions':{a:sum(x['action']==a for x in findings) for a in ['quarantine','annotate','exclude_resource']}}))
