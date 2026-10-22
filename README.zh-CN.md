# MathCups 数学群岛 · 二维航海图 v1

**中文** · [English](README.en.md) · [仓库入口](README.md)

数学图谱数据版本为 **v1**；本次中英文发布版本为 **1.0.0**。双语发布保留原有来源快照和数据哈希。

本版收录 **21,741 个有出处的数学知识条目**，组织为 12 个海域，记录 46,812 条不同类型的关系，并附 21 条经过文献关键段落核查的跨领域主航线。

中英文版本共用冻结数据、标识、坐标和数学桥记录；翻译地图注记与说明文档，数学条目保留来源名称。中文地图位于 `maps/`，英文地图位于 `maps/en/`；英文导航索引另加 `domain_display` 英文显示字段，并保留原 `domain` 字段。

“岛屿”在这里是一个概念、定义、方法、问题或具有稳定来源标识的数学命题条目。它们的粒度不同；这不是 21,741 套独立理论，也不是逐条证明认证过的定理库。已经识别的别名、重复条目、空壳和测试材料已处理，全部数学等价关系尚未消歧。

## 打开地图

- [maps/mathematical-archipelago-overview.svg](maps/mathematical-archipelago-overview.svg)：可缩放总图；每个点都有标题和来源链接。
- [总览 PDF](maps/mathematical-archipelago-overview.pdf) / [PNG](maps/mathematical-archipelago-overview.png)：打印或分享总览。
- [maps/mathematical-archipelago-domain-atlas.pdf](maps/mathematical-archipelago-domain-atlas.pdf)：12 个领域的详图合订本。
- [主航线 PDF](maps/mathematical-archipelago-bridges.pdf) / [SVG](maps/mathematical-archipelago-bridges.svg)：21 条文献主航线；编号对应 [reports/math-bridges.md](reports/math-bridges.md)。
- [maps/navigation-index.csv](maps/navigation-index.csv)：完整岛屿名称、A1–F6 定位格、领域图、来源链接和源文问题记录。电子表格中可检索全部条目。
- [data/nodes.csv](data/nodes.csv)、[data/nodes.jsonl](data/nodes.jsonl)、[data/edges.csv](data/edges.csv)：完整坐标、丰富元数据与关系数据。

图中所有节点均实际绘出，只对部分节点显示名称。总图显示 16,000 条选定关系，完整关系仍在数据表中。点大小使用记录到的连接度，不表示数学价值。外缘环上的真实节点在本领域内没有记录到链接，可能仍有跨领域链接；这是一种确定性制图安排，不意味着数学上孤立。二维距离、方向、颜色和分区边界不是数学度量或证明关系。

## 来源与计数

| 来源 | 主库条目 | 计数单位 |
| --- | ---: | --- |
| PlanetMath 官方分域文库 | 6,841 | 来源声明的定义、定理、结果、推论、猜想、公理和算法 |
| Stacks Project | 14,852 | 1,721 个定义、12,587 个引理、330 个命题、214 个定理的稳定标签 |
| Wikipedia 补充 | 48 | 50 个现代概念或真实命名节，2 个与 PlanetMath 同主体条目合并 |
| 合计 | **21,741** | 有来源的知识条目 |

PlanetMath 从 63 个官方仓库的 9,477 份记录开始筛选；证明附件、人物、书目、目录等未用来凑数。严格来源清单 6,936 条经人工确认的 11 条重复合并、77 条人物/机构/文献/资源背景条目分离、7 条其余内容排除，得到 6,841。背景层另存 [data/context-not-counted.jsonl](data/context-not-counted.jsonl)，不绘制、不计入岛屿。历史文库中的千禧年问题、Hilbert 第十六问题、Landau 问题、尺规作图和算法仍保留。Stacks 只纳入实际数学陈述环境，不把每个段落、公式或证明步骤当岛屿。

本版有显著的**代数、代数几何和同调方向覆盖偏重**：Stacks 占条目总数约 68%。它覆盖数论、分析、几何、概率、离散、逻辑及应用，但不是数学全景的均衡抽样，也不代表已遍历所有数学。不同领域的细分粒度不一致。

主数据出处：[PlanetMath](https://github.com/planetmath)、[Stacks Project](https://stacks.math.columbia.edu/)、逐节点记录的 Wikipedia 原页面/版本。Stacks 固定于提交 `a04446e57ec1fbc252a871afcec7752fb2807b14`。完整源文件、作者、版本及 SHA-256 见各来源 manifest。

MathWorld 和 Wikipedia 大字母索引曾用于来源调查，但因尚未解决别名、人物混入或再分发边界，**均未进入主库计数或发布包**。

## 航线到底表示什么

| 数据关系 | 数量 | 含义 |
| --- | ---: | --- |
| `encyclopedic_link` | 7,951 | 来源明确列出的相关条目或正文链接 |
| `proof_reference` | 35,334 | 指定证明文本中实际出现的引用；只保证引用解析，不保证证明依赖已验证 |
| `statement_reference` | 2,836 | 数学陈述中的实际引用 |
| `title_matched_link` | 670 | Wikipedia 链接目标与另一来源条目的无歧义规范化名称匹配；主体同一性仍可能需要审查 |
| `literature_bridge` | 21 | 另附数学机制、条件、结论和文献关键段落审读记录的主航线 |

例如：椭圆曲线—模形式，模形式—八维球堆积，霍奇理论—拟阵对数凹性，模型论稳定性—图正则性，概率集中—欧氏降维，多项式根数界—sum-check。

这些是已有数学联系，不能称为本项目发现的新定理。文献桥的必要条件见 [reports/math-bridges.md](reports/math-bridges.md)，其中也明确了半稳定椭圆曲线、相匹配的逻辑片段、RIP 条件、代数闭底域等适用范围。

## 离线航行

在本目录运行（导航只需 Python 标准库）：

```bash
python scripts/navigate.py search "rough"
python scripts/navigate.py search "sieve" --limit 30
python scripts/navigate.py show pm:SieveOfEratosthenes
python scripts/navigate.py neighbors pm:EllipticCurve
python scripts/navigate.py route pm:ModularForm wikipedia:Sphere_packing --directed
python scripts/navigate.py candidates --limit 50
```

路线是数据图上的阅读路线。每一步保留关系类型、原始方向、来源和定位；反向阅读不表示反向蕴含。模形式到球堆积的一跳航线已实际执行验证。

## 从连接候选到数学洞察

本版实际生成了 **641 对跨领域导航候选**，发布前 50 对到 [data/research-candidates.json](data/research-candidates.json)。这些候选尚未经逐对的数学联系和新颖性核验。条件是：至少两个共同引用邻居、当前没有已记录的直接边、来自不同分区。排序采用 Adamic–Adar 指标，排除过于普遍的高连接节点。

这个分数不是数学正确率、重要性或新颖性。共同邻居可能只是编辑习惯，许多候选联系早已为人所知。每条候选显式标记 `mathematical_connection=not_established`、`novelty=not_searched`、`proposition=null`；它们不混入已知航线。

要把候选变成数学研究，需要逐项执行：阅读两端和共同来源，找出可迁移的结构，写清对象与条件，检索已有工作，形成精确命题，再给出推导、反例或适用范围修订。地图提供了执行这些动作所需的入口和可追踪记录，没有冒充已经完成这些动作。

## 实际质量核验结果

全量检查已核对 21,741 个节点、唯一 ID 与有限且互异的坐标、全部关系端点、6,999 个实际使用源文件的哈希、21 条文献桥的绑定和可执行检索/路线。全部图中节点的实际 SVG 元素数另经检查。图中有 4,020 个记录连通分量、3,680 个未记录到任何边的节点；这些数值反映所选来源，不能推断真实数学的连通性。

独立审查先固定随机种子，从 12 个领域分层抽取 36 条源文片段，其中发现 **13 个条目需要质量处理**；保留原抽样记录，仅对被排除的 3 条作固定替换，又补充 2 条范围/上下文注记。审读范围是主体片段，短条目全文；没有逐一检查完整证明。未发现问题不等于数学认证通过。

已剔除空壳和明显不合格材料；对于真实概念但原文含错误、缺条件或记号待定的条目，保留概念并附具体问题。合并另一份较好来源时也保留被指摘的原文件及哈希。最终 **16 个岛屿附有明确的源文质量记录**，图上用红圈提示，完整内容见索引和 [reports/audit-content-findings.json](reports/audit-content-findings.json)、[reports/planetmath-source-quality-findings.json](reports/planetmath-source-quality-findings.json)。独立审计的 7 组具体反例已作精确重放；另有 Dijkstra 漏非负权重条件的精确反例，以及按正文校勘 Leslie 模型/Dijkstra 算法两处错误题名的记录。原题名和源文本均保留，未宣称是形式证明内核认证。

## 与 MathCups 对接

每个节点保留“产生了什么数学工具”和“通过什么发现动作产生”的两个渐近类型字段。旧 MathCups 注册表在本次工作区不可用，因此注册表版本为空，默认 `must=[] / may=[] / open=true`，没有伪造 K/M/D 编号，也没有把来源标签当成完成了形式类型化。

完整语义约定见 [spec/atlas-schema.md](spec/atlas-schema.md)。历史传承、数学适用性、源文报道与现代重构分别记录；本图不从一条数学关系反推作者的心理过程或发现因果。

## 重建

实测环境：Python 3.12.14、NumPy 2.3.5、SciPy 1.17.0、Matplotlib 3.10.8、lxml 6.1.1、Graphviz `sfdp` 2.43.0。lxml 用于完整源文审计。图形使用 Noto Sans CJK；缺少此字体时中文显示可能不同。

在仓库根目录安装 [Python 依赖](requirements.txt)。Debian/Ubuntu 的系统依赖包为 `graphviz`（提供 `sfdp`）和 `fonts-noto-cjk`：

```bash
sudo apt-get update
sudo apt-get install graphviz fonts-noto-cjk
pip install -r requirements.txt
```

首次安装通常需要联网；依赖和来源快照已经就绪后，下面的重建与核验步骤可离线执行。只使用导航 CLI 时不需要这些第三方 Python 包。

发布包包含已选开放来源与解析元数据，以下步骤可离线运行：

```bash
python scripts/build_atlas.py
python scripts/layout_atlas.py
python scripts/bind_math_bridges.py
python scripts/navigate.py candidates --limit 50 --save
python scripts/render_atlas.py
python scripts/render_atlas.py --language en --out maps/en
python scripts/verify_release.py
python scripts/audit_atlas.py
```

默认渲染命令生成 `maps/` 下的中文地图；带 `--language en` 的命令生成 `maps/en/` 下的英文地图。首次重建使用已附的人工绑定文件；修改端点集合时先对未定位节点执行 `python scripts/bind_math_bridges.py --nodes data/nodes-unpositioned.jsonl`，再重建图。人工审阅记录的重放脚本不等于重新执行人工审阅。

完成上述核验后，在仓库根目录打包双语发布版：

```bash
python scripts/package_release.py --version 1.0.0
```

默认输出到仓库父目录的 `Mafh-Island-v1.0.0.zip`。发布版本号不改变数学图谱数据的 v1 版本或冻结来源快照。

`acquire_*` 脚本用于重新获取来源，需要联网；PlanetMath 的全部原始仓库归档约 1.7GB，未放入发布包。最终所需的小型开放 TeX 源包已经包含。外部论文 PDF 缓存不再分发，保留链接、定位和哈希；源版本变化需重新审阅。

发布的冻结快照按[构建报告](reports/构建报告.txt)中的精确哈希核对。复现时应保持同一来源快照与软件版本；即使软件环境相同，重新布局也可能出现细微数值坐标差异。[独立发布审计](reports/github-publication-audit.md)记录了离线重建中实际观测到的差异，其余节点字段一致、关系文件逐字节一致。重新布局后必须先重新渲染地图，再执行依赖渲染清单的审计核验；不能用旧地图及其清单验证新坐标。

## 来源许可与归属

[LICENSE.md](LICENSE.md) 明确区分许可范围：`scripts/` 中原创代码采用 MIT；原创说明文字与制图设计采用 CC BY-SA 4.0，第三方引文及来源派生内容除外。[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) 记录各来源的归属、版本和本项目的修改。原创许可不替代下述各来源许可，也不把整个数据集改为 MIT。

PlanetMath 衍生条目沿用 CC BY-SA 3.0，作者及源链接在节点元数据中；完整许可见 [source/planetmath/LICENSE-CC-BY-SA-3.0.txt](source/planetmath/LICENSE-CC-BY-SA-3.0.txt)。Stacks 来源保留 GFDL 许可、README 与 CONTRIBUTORS；见 [sources/stacks/tex/COPYING](sources/stacks/tex/COPYING)。Wikipedia 来源保留各页面的版本、历史/作者入口及 CC BY-SA 许可信息。各源分别保留其许可，本集合未把它们改为一种统一许可。

来源、语义、制图和独立审计由多个代理分别执行；主代理完成 Stacks 获取解析、数据整合、布局、导航、反例重放及最终发布核验。审读者和动作范围在各报告中标明。
