#!/usr/bin/env python3
"""Manual subject-kind review of all 96 strict PlanetMath history-repository entries.
Replays explicit reviewed decisions, not a generic person/title classifier.
"""
import json,re,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
entries=[json.loads(l) for l in (ROOT/'sources/planetmath/entries.jsonl').read_text().splitlines()]
byid={r['id']:r for r in entries}; paths=json.loads((ROOT/'sources/planetmath/tex-manifest.json').read_text())['representative_source_files']
history={r['canonical_name'] for r in entries if '/01_History_and_biography/' in r['source_file']}
if len(history)!=96:raise ValueError('Manual review requires original 96-entry snapshot')
retained_reasons={
'AcanoALunarCalendarMethod':'明确提出日历周期的矩阵和算术计算方法；保留方法主题，历史传播和正确性未另行验证。',
'AhmesBirdfeedingRateMethod':'主语是鸟饲率的量纲、比例与算术计算方法；并非人物Ahmes本身。',
'ArabicNumerals':'数字记号与数的表示系统；历史叙述不等于来源所有史学断言获证。',
'ArchimedesCalculus':'讨论阿基米德求积和穷竭相关数学方法；不是阿基米德人物节点。',
'BaconNumber':'定义合作图上的距离量，数学对象是图距离而非演员本人。',
'BombellisMethodOfComputingSquareRoots':'给出正实数开平方的逐位计算方法。',
'CompassAndStraightedgeConstruction':'形式化几何作图的允许操作与可作图问题。',
'EgyptianAndGreekSquareRoot':'研究平方根近似/计算的具体数学方法。',
'EgyptianFraction':'有理数的单位分数表示这一真实数学对象；源史学附加叙述未验证。',
'EgyptianGeometryAreasCalculatedInCubitsKhetsAndSetats':'长度、面积和体积单位换算及相应算术计算方法。',
'EgyptianMultiplicationAndDivision':'乘除法的算法性主题，而非某篇纸草文献作为物件。',
'EgyptianWeightsAndMeasuresHekatDivisions':'商余分解与hekat分割的比例计算方法；历史来源断言未另行证实。',
'ErdHosBaconNumber':'两个合作图距离量之和的组合数学对象。',
'ErdHosNumber':'以合著关系图定义的最短路距离，不是人物传记。',
'HilbertsSixteenthProblem':'希尔伯特第十六问题的数学问题陈述。',
'LandausProblems':'四个素数相关未解决数学问题的集合。',
'MayanMath':'正文定义以18与20为基数的混合进位表示和模算术系统；保留数学表示主题。',
'MayanSuperNumberArithmetic':'正文讨论周期公倍数与长纪历数字的算术结构；保留计算主题，不认证史学解释。',
'MillenniumProblems':'千禧年七个数学问题的集合；奖项背景不改变主语为数学问题。',
'Pi':'圆周率这一数学常数，不因历史分类或人物介绍而删除。',
'RedAuxiliaryNumbersTheFirstLCMMethod':'使用公倍数缩放有理数并分解为单位分数的计算方法。',
'RMP69AndTheBerlinPaprusProportionMethod':'明示反比例方法并给出平方方程计算步骤；以方法为主语保留，区别于以纸草物件为主语的史料节点。',
'RomanNumerals':'罗马数字表示系统与数值编码规则。',
'TrisectionOfAngle':'角三等分的作图数学问题与带标尺构造。'
}
classes={
'person':('AdaLovelace CherylPraeger EdouardZeckendorf ElenaCornaroPiscopia ElieCartan ElizavetaLitvinova ErichKahler JudyHoldener MikeByster NeilJASloane OttoHolder OysteinOre PaulAndreMeyer TerenceTao VladimirDrinfeld vStefanZnam','正文主语为人物生平；作为历史上下文保留，不计数学概念岛屿。'),
'award':('AbelPrize AdamsPrize ChauvenetPrize CrafoordPrize FieldsMedal SchockPrize WhiteheadPrize WolfPrize','数学奖项及评奖制度，属于社会史上下文，不是数学对象或定理。'),
'organization':('AmericanMathematicalSociety FibonacciAssociation LondonMathematicalSociety MathematicalAssociationOfAmerica NationalScienceFoundation TexasInstruments','机构、学会或公司，而非其研究的数学概念。'),
'publication':('ActaMathematica BookOfNumbers LiberAbaci SmarandacheNotionsJournal TheFibonacciQuarterly','期刊、书籍或出版物本身；文献作为来源上下文保留。'),
'historical_artifact':('AkhmimWoodenTablet AkhmimWoodenTablet1 EgyptianMathematicalLeatherRoll HibehPapyrus IshangoBone MoscowMathematicalPapyrus ReisnerPapyrus RhindMathematicalPapyrus','正文主语为历史手稿或考古物件；其数学内容可链接到对应数学方法，文献本身不重复计数学岛屿。'),
'event':('InternationalCongressOfMathematicians PutnamCompetition UnitedStatesOfAmericaMathematicalOlympiad','会议或竞赛事件制度；并非具体数学问题陈述。'),
'digital_resource':('GoogleCalculator HypertextMarkupLanguage Internet MathML MathWorld MultiplyPerfectNumbersPage PiSearchPage PrimePages SeventeenOrBust Wikipedia','软件、网站、数据库、技术格式或计算协作项目；作为资源上下文，不计本版抽象数学知识岛屿。'),
'computing_device':('Abacus ScientificCalculator','通用计算器具类别；与Calculator使用一致计数口径，器具上下文保留，具体算法另计。'),
'historical_commentary':('AnOverViewOfAhmesPapyrus EconomicContextOfEgyptianFractions MathematicsInEgyptMathematicalLeatherRoll2014Update MayanSeasonalAlmanac Numerology PlatosMathematics RemainderArithmeticVsEgyptianFractions WhyStudyEgyptianFractionMathematics','主语为历史解读、文化背景、学习议论或占数术；作为历史上下文，不另计独立数学对象。'),
'historical_worked_example':('BerlinPapyrusAndSecondDegreeEquations KahunPapyrusAndArithmeticProgressions RMP35To38PlusRMP66 RMP36AndThe2nTable RMP47AndTheHekat RMP535455','围绕特定手稿或编号问题的解读/实例；按本版Example不独立计数规则移上下文，可链接已有方程、数列或比例方法。')
}
exclusions=[];classified=set(retained_reasons)
def evidence(c):
    rid='pm:'+c;r=byid[rid];p=ROOT/paths[rid];data=p.read_bytes()
    if hashlib.sha256(data).hexdigest()!=r['source_sha256']:raise ValueError('Source snapshot changed')
    body=data.decode('utf-8',errors='replace').split('\\begin{document}',1)[-1].split('\\end{document}',1)[0]
    body=re.sub(r'\\PMlinkescapeword\{[^}]*\}','',body);excerpt=re.sub(r'\s+',' ',body).strip()[:650]
    return {'source_file':paths[rid],'source_sha256':r['source_sha256'],'source_title':r['label'],'evidence_excerpt':excerpt}
for kind,(names,reason) in classes.items():
    for c in names.split():
        if c in classified:raise ValueError('Duplicate manual decision '+c)
        classified.add(c);exclusions.append({'id':'pm:'+c,'kind':kind,'reason':reason,**evidence(c)})
if classified!=history:raise ValueError('Unreviewed or extra history entries: '+str(history-classified)+' / '+str(classified-history))
extra={'SharamKohan':('person','正文是个人履历、获奖与教育经历；虽存于非历史仓且标为Definition，主体仍是人物。'),'Calculator':('computing_device','通用计算器具或程序类别，不是具体数学对象/算法。'),'MacOSCalculator':('software_resource','操作系统附带的计算器软件产品。'),'WindowsCalculator':('software_resource','操作系统附带的计算器软件产品。'),'OnLineEncyclopediaOfIntegerSequences':('database_resource','整数序列数据库资源；序列及生成函数为数学对象，数据库本身作上下文。')}
for c,(kind,reason) in extra.items():exclusions.append({'id':'pm:'+c,'kind':kind,'reason':reason,**evidence(c)})
retained=[{'id':'pm:'+c,'reason':reason,**evidence(c)} for c,reason in retained_reasons.items()]
for c,reason in {'AssociationScheme':'组合数学的association scheme真概念，不因association字样误当学会。','CalculatorTrigonometricFunctions':'三角函数的具体数学功能，不是计算器品牌或软件资源。','MethodForComputingSimpleContinuedFractionsWithTheAidOfCalculatorAndPencilAndPaper':'明确的连分数计算方法，工具名称不改变算法主体。','TheHistoryToGettingSettledToCompleteReviews':'原文主语为Leslie模型/矩阵；源标题异常，保留数学主体并建议校勘显示名。','TheRealHistoryOfGettingSettledToAccomplishStudies':'原文主语为Dijkstra最短路算法；源标题异常，保留数学主体并建议校勘显示名。'}.items():retained.append({'id':'pm:'+c,'reason':reason,**evidence(c)})
report={'reviewer':'/root/atlas_sources','review_scope':'All 96 strict entries in 01_History_and_biography: titles plus original source subject/intro inspected individually; mathematical method candidates inspected by mathematical content. Additional whole-corpus title scan for obvious people, organizations, publication and resources. Not a proof or full historical accuracy review.','reviewed_history_count':96,'history_excluded_count':len(history)-len(retained_reasons),'history_retained_count':len(retained_reasons),'extra_excluded_count':len(extra),'exclusions':exclusions,'reviewed_ids':sorted({'pm:'+c for c in history}|{r['id'] for r in retained}|{r['id'] for r in exclusions}),'retained':retained,'classification_policy':'Metadata Definition does not establish a mathematical subject. Do not exclude an entire MSC repository. Count mathematical problems, constants, representations and methods; preserve people, publications and institutions as non-counted context. Physical calculating devices and software resources are context. Historical worked examples do not become extra mathematical concepts.'}
(ROOT/'reports/planetmath-context-exclusions.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps({k:v for k,v in report.items() if k.endswith('_count')},ensure_ascii=False))
