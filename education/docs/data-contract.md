# Education atlas data contract / 教育图谱数据契约

This module is a read-only educational view of a pinned mathematical atlas. Its interface, learning activities, drawings, and learner notes do not write to the core graph. Updating the core does not require updating the educational snapshot immediately.

本模块是本体图谱某个固定快照的只读教育视图。界面、实验、对象图形及学习记录均不写回本体图谱。本体继续增长时，教育快照可以独立选择更新时间。

## Snapshot / 当前快照

| Item / 项目 | Value / 值 |
| --- | --- |
| Core commit / 本体提交 | `66751e9d9b0e661ec06c4b60c61c9204972917b6` |
| Source entries / 来源条目 | 21,741 |
| Recorded relations / 记录关系 | 46,812 |
| Source domains / 来源领域 | 12 |
| Entries carrying source-quality findings / 带源文质量注记的条目 | 16 |
| Bilingual literature-route guides / 双语文献航线 | 21 |
| Source families / 来源 | PlanetMath, Stacks Project, Wikipedia |
| Schema / 模式版本 | `1` |

The machine-readable manifest is [`public/data/atlas-manifest.json`](../public/data/atlas-manifest.json). It contains exact source hashes and the byte length and SHA-256 digest of each generated payload. Counts in this document describe the current snapshot; the manifest is authoritative after regeneration.

机器可读清单位于 [`public/data/atlas-manifest.json`](../public/data/atlas-manifest.json)，记录输入文件哈希、输出字节数及 SHA-256。本文计数描述当前快照；重新导出后以清单为准。

### Relation semantics / 关系语义

| Stored value / 原始类型 | Count / 数量 | Meaning / 含义 |
| --- | ---: | --- |
| `proof_reference` | 35,334 | Reference occurring in proof text / 证明文本中的引用 |
| `encyclopedic_link` | 7,951 | Source-body link / 来源正文链接 |
| `statement_reference` | 2,836 | Reference occurring in a statement / 陈述文本中的引用 |
| `title_matched_link` | 670 | Link resolved by title matching / 名称匹配得到的链接 |
| `literature_bridge` | 21 | Documented mathematical bridge / 有文献支持的数学桥梁 |

A recorded reference is navigation evidence, not automatically a certified proof dependency. The original `status` and `mathematical_validity` values remain available on every edge; the interface exposes them in each relation's details. No relation is inferred from visual proximity or from sharing an educational theme.

记录中的引用用于阅读导航，不自动等于经过认证的证明依赖。每条边保留原始 `status` 与 `mathematical_validity`，界面可在关系记录细节中展开查看。二维接近、共同的教育主题均不生成新关系。

## Reproducible adapter / 可重复的只读适配器

From `education/` / 在 `education/` 中运行：

```sh
npm run data:build
npm test -- --run tests/education-contract.test.ts
npm run verify:core
```

[`scripts/build_atlas_index.py`](../scripts/build_atlas_index.py) reads only these core inputs:

| Input / 输入 | Use / 用途 |
| --- | --- |
| `data/nodes.jsonl` | IDs, original titles, coordinates, degree, aliases, content types, source links and quality findings / 身份、原名、坐标、连接度、别名、内容类型、来源链接与质量注记 |
| `data/edges.csv` | All eight recorded edge fields / 全部八个关系字段 |
| `reports/layout.json` | Existing domain centers and radii / 已有领域分区的中心和半径 |
| `data/bridges.csv` | Existing literature-route IDs, endpoints, labels and status / 已有文献航线 ID、端点、标签和状态 |
| `reports/math-bridges.md`, `reports/math-bridges.en.md` | Original bilingual route mechanisms, conditions, conclusions, limits and citations / 双语机制、条件、结论、边界和引文原文 |
| `reports/bridge-source-audit.json` | Complete historical source-reading records / 完整的既有源文审读记录 |

The script writes only four JSON files in `education/public/data/`: the index, edges, literature-route guides and manifest. It verifies that every input hash is unchanged before and after export. It copies node coordinates exactly, sorts nodes by stable ID, builds dictionary indices, and adds bilingual display labels, colors and representative mathematical emblems to domain metadata. It does not translate original source titles, merge nodes, create edges, change quality findings, or upgrade a content category into a formal mathematical-tool type.

脚本仅写入 `education/public/data/` 下四个 JSON 文件：索引、边、文献航线及清单；导出前后核对全部输入的哈希。节点坐标原样复制，按稳定 ID 排序并构建字典索引；领域元数据增加双语显示名称、颜色和代表性数学图案。不翻译来源标题、不合并节点、不增生边、不改写质量注记，也不把来源内容分类提升为已验证的数学工具形式类型。

The full-module baseline verifier checks all previously tracked core files independently. Source fidelity tests run when the corresponding pinned core files remain available; payload consistency tests always run. This allows a newer core and an older valid educational snapshot to coexist.

模块的基线验证器另行核对此前已跟踪的本体文件。与源文件逐字段核对的测试仅在对应固定快照仍可获得时执行；教育载荷自身的一致性检查始终执行。因此，新本体与较旧而有效的教育快照可以并存。

## Wire schema / 传输模式

Types and runtime validators live in [`src/data/atlas-types.ts`](../src/data/atlas-types.ts). Tuple position is part of schema version 1. Dictionary indices are nonnegative integers.

类型与运行时校验位于 [`src/data/atlas-types.ts`](../src/data/atlas-types.ts)。元组位置属于版本 1 的模式约定，字典索引必须是非负整数。

### `atlas-index.json`

```ts
{
  schemaVersion: 1,
  coreCommit: string | null,
  nodeOrderSha256: string,
  nodeColumns: string[],
  domains: {
    id: string, zh: string, en: string, color: string, motif: string,
    center: [number, number], radius: number, count: number
  }[],
  kinds: string[], sources: string[],
  nodes: [
    id: string, label: string, domainIndex: number,
    x: number, y: number, degree: number,
    kindIndex: number, sourceIndex: number,
    sourceUrl: string, aliases: string[]
  ][],
  qualityFindings: Record<string, OriginalSourceQualityFinding[]>,
  provenance: Record<string, string>,
  coordinateSemantics: string,
  motifSemantics: string
}
```

`qualityFindings` preserves each complete original finding object, including source/evidence locators and hashes when present. Missing entries mean that this snapshot records no finding for that node; they do not certify the source as error-free. `kinds` is the source's content classification, including such categories as object, theorem, conjecture, method and tool.

`qualityFindings` 保留每条原始注记的全部字段，包括已有的源文/证据定位及哈希。某节点没有注记，只表示快照未记录相关发现，并不认证源文无误。`kinds` 是来源内容类别，包含对象、定理、猜想、方法、工具等。

### `atlas-edges.json`

```ts
{
  schemaVersion: 1,
  nodeOrderSha256: string,
  edgeColumns: string[],
  relations: string[], evidenceUrls: string[], locators: string[],
  statuses: string[], validities: string[],
  edges: [
    id: string, sourceIndex: number, targetIndex: number,
    relationIndex: number, evidenceUrlIndex: number,
    locatorIndex: number, statusIndex: number, validityIndex: number
  ][],
  provenance: Record<string, string>
}
```

Source and target indices address the exact ordered `nodes` array. Both files carry `SHA256(UTF8(nodeIDs.join('\n')))`, with no final newline in the hashed string. Runtime validation requires identical source digests and ordered-ID digests, canonical strictly increasing node IDs, unique node/edge IDs, finite coordinates, valid domain data, nonnegative integer degrees, string aliases, valid dictionary indices, resolved endpoints and no self-links. The build tests recompute the digests, compare all original node fields and all eight edge fields, and test malformed inputs.

端点索引指向同一有序 `nodes` 数组。两份文件均记录 `SHA256(UTF8(nodeIDs.join('\n')))`；用于哈希的字符串末尾不追加换行。运行时校验快照哈希及有序 ID 哈希一致、节点 ID 严格递增、节点与边 ID 唯一、有限坐标、有效领域元数据、非负整数连接度、字符串别名、有效字典索引、存在的端点和无自环。构建测试重新计算哈希，逐一核对节点原始字段、边的八个字段，并验证错误输入会被拒绝。

These are data-consistency checks, not a cryptographic authenticity or mathematical-proof service.

上述机制检验数据一致性，不构成密码学真实性认证或数学证明服务。

### `atlas-bridges.json`

```ts
{
  schemaVersion: 1, coreCommit: string | null, nodeOrderSha256: string,
  records: {
    id: string, sourceId: string, targetId: string,
    sourceIndex: number, targetIndex: number, edgeId: string, status: string,
    text: Record<'zh' | 'en', {
      title: string, endpoints: string, mechanism: string, conditions: string,
      conclusion: string, limitations: string, sourceTitle: string,
      sourceUrl: string, locator: string, reportPath: string, reportLine: number,
      reportCommit: string | null, reportSectionSha256: string
    }>,
    sourceAudit: OriginalBridgeSourceAuditRecord
  }[],
  sourceAuditScope: string,
  provenance: Record<string, string>
}
```

Each guide is an exact projection of an existing CSV bridge, its existing `literature_bridge` edge, both report sections and the historical source-audit record. The adapter removes only structural paragraph prefixes such as `Conditions:`; it preserves the mathematical text and punctuation. It fails if identifiers, endpoints, Chinese titles, or citation URLs disagree across the existing sources. The report-section digest hashes the original Markdown section, including its heading and whitespace. A report commit is linked only after `git show` returns byte-identical report content; otherwise `reportCommit` is `null`.

每条指南对应既有 CSV 航线、既有 `literature_bridge` 边、两份报告中的对应章节和历史审读记录。适配器仅移除“条件：”等结构前缀，数学文字与标点原样保留。已有来源中的 ID、端点、中文标题或引文 URL 不一致时，导出失败。章节哈希针对包含标题及空白的原始 Markdown；只有 `git show` 返回字节一致的报告时才链接其提交，否则 `reportCommit` 为 `null`。

Citation landing pages and audit-download URLs are allowed to differ: for example, a report may cite a journal page while its audit records a retrieved PDF mirror. Those original differences remain visible in the payload. Runtime validation checks report-language ownership, source-snapshot identity, endpoint indexing, audit `bridge_id`, HTTP(S) URLs and, when edges are available, the exact cited edge and complete literature-route coverage. Offline tests compare every audit field to the pinned original record.

引文落地页与审读下载地址允许不同，例如报告引用期刊页面，而审读记录使用 PDF 镜像；载荷保留原有差异。运行时检查报告语言归属、来源快照、端点索引、审读 `bridge_id`、HTTP(S) 地址，并在关系数据可用时检查对应边及文献航线覆盖完整性。离线测试逐字段比较固定快照中的完整审读记录。

## Rendering and navigation / 渲染与导航

[`CoreAtlas`](../src/components/CoreAtlas.tsx) accepts `language`, `onSelect(id)`, optional `selectedId`, `curatedCoreIds`, `onOpenLesson(coreId)`, and `educationalSearch`. It fetches the node payload first, then loads edges and literature guides independently. Failure of one auxiliary request leaves the other view and node search available, with a retry.

组件先载入节点，再独立载入边与文献指南。某个辅助请求失败时，其他视图及节点检索仍可用，并提供重新载入。教育入口由 `curatedCoreIds` 指定；点击后通过 `onOpenLesson` 回到教育层，不修改本体节点。

All three JSON requests use `cache: 'no-cache'` on initial load and retry. This requests HTTP revalidation of cached responses, allowing ETags to avoid unnecessary transfers while refreshing stable filenames after a deployment. Source-snapshot and node-order checks still reject incompatible payloads; loading never writes to the core graph.

三份 JSON 在首次载入及重试时都使用 `cache: 'no-cache'`，对缓存响应执行 HTTP 重验证，允许利用 ETag 避免不必要的传输，并在部署更新后刷新稳定文件名对应的内容。来源快照及节点顺序校验继续拒绝不兼容的载荷；载入过程不写入本体图谱。

`educationalSearch` has shape `{ islandCount: number, entries: Record<coreId, string[]> }`. The app supplies existing bilingual titles, object descriptions, subtitles and continuation text from 24 authored lessons, associated with 51 source entries. Route titles and endpoint descriptions add their existing bilingual words for 41 route endpoints. These are explicitly labeled educational/route-text matches; they are not replacement source titles or a claim that all 21,741 entries have been translated. The overlap between these groups is not counted as new nodes.

`educationalSearch` 形状为 `{ islandCount: number, entries: Record<coreId, string[]> }`。应用传入 24 座已有课堂的双语标题、对象说明、副标题和后续方向，关联 51 个来源条目；航线标题及端点说明另为 41 个航线端点补充已有双语文字。结果明确标记教育解释或航线说明匹配，不替换来源标题，也不声称已翻译全部 21,741 个条目。两组之间的重叠不增加节点。

Selecting one of the 21 literature routes frames its two real endpoints and highlights its existing edge. The adjacent reading panel retains mechanism, conditions, conclusion, limitations, citation and locator together. Either endpoint can be selected, and curated endpoints can open their education lesson. Source-reading scope and the original report are available in a native disclosure. The route selector, search and domain controls remain ordinary HTML controls.

选择一条文献航线后，视图框定两个真实端点并突出显示原有边。旁边的阅读面板同时保留机制、条件、结论、边界、引文及定位。可选择任意端点，也可从有课堂的端点进入教育模块。原始审读范围及报告链接放在可展开的原生说明中；航线、检索和领域选择均使用普通 HTML 控件。

- **All entries remain searchable.** Search uses original labels, stable IDs, aliases and bilingual domain labels. Results are paged in accessible HTML, 24 at a time. Keyboard focus and native controls offer a route independent of Canvas hit testing.
- **One visible Canvas, bounded rendering.** DPR is capped at 2. Marks use cached world-coordinate paths, offscreen batch culling and a bounded transparent point-layer cache with a small pan buffer. Pointer movement does not create thousands of HTML elements. There is no idle animation loop.
- **Recorded coordinates remain unchanged.** Region envelopes come from the core layout. Their centers, spacing and sizes describe that layout; they do not measure mathematical difficulty, logical distance, or the size of a mathematical field.
- **Point size follows recorded degree.** Degree is copied rather than recomputed as a new mathematical invariant. Gold rings mark education links; source-quality findings have distinct outlines and accessible text.
- **Edge visibility is explicit.** Default rendering shows documented bridges. Selecting a node draws all recorded incident edges. Optional background references are deterministically sampled to at most 6,000 lines; the payload still includes all 46,812 edges.
- **Mathematical emblems are labels.** Curves, ideal-like nested structures, diagrams, symmetry, torus sections, waves, prime grids, logic, networks, distributions, fields and contours identify domains. They do not invent extra mathematical nodes or assert a formal tool taxonomy.

- **全部条目可检索。** 支持来源标题、稳定 ID、别名及双语领域名。HTML 结果列表每页 24 条，原生控件和键盘焦点提供独立于 Canvas 点选的访问方式。
- **一个可见 Canvas，渲染有界。** DPR 上限为 2；缓存世界坐标路径、剔除视野外批次，并使用带少量平移缓冲的透明点层缓存。交互不创建上万 DOM 节点，空闲时不循环动画。
- **已有坐标不变。** 区域轮廓来自本体布局；位置、间距和大小描述布局，不衡量数学难度、逻辑距离或学科规模。
- **点大小对应记录连接度。** 直接复制原值，不把它重新解释为数学不变量。金环表示教育入口，源文质量问题有独立轮廓和可访问的文字说明。
- **关系显示规则明确。** 默认显示文献桥梁；选中节点显示其全部关联边。可选背景引用采用确定性抽样，至多绘制 6,000 条；载荷仍保存全部 46,812 条边。
- **数学图案是分区标识。** 曲线、理想的嵌套示意、交换图、对称、环面截面、波形、素数格、逻辑、网络、分布、场及等高线标识领域，不增加数学节点，也不声称完成形式工具分型。

### Location links and export / 位置链接与导出

The full-atlas view owns the namespaced query parameters `atlasSearch`, `atlasDomain`, `atlasNode`, `atlasBridge`, `atlasZoom`, `atlasX`, and `atlasY`. Coordinates in the link are the viewport's center in the original layout. Other application parameters and history state are preserved. Clipboard failure still updates the address bar and tells the reader how to copy the location. Unknown domains fall back to all regions; unknown route IDs are cleared. A saved PNG includes snapshot information and a reminder of layout semantics.

完整图谱视图独立使用上述七个 `atlas*` 查询参数；坐标记录视窗中心对应的原布局位置。其他应用参数和历史状态保留。剪贴板不可用时仍更新地址栏，并提示直接复制。未知领域回退到全部领域，未知航线 ID 会被清除。导出的 PNG 带快照信息及布局语义说明。

## Attribution / 来源署名

The educational snapshot is derived metadata. Source content retains its original licenses: PlanetMath CC BY-SA 3.0, Stacks Project GFDL 1.2 or later, and Wikipedia CC BY-SA 4.0. Per-entry source links and the repository's [third-party notices](../../THIRD_PARTY_NOTICES.md) remain authoritative. This module does not relicense source mathematics under the interface's software license.

教育快照是派生元数据，来源内容继续使用原许可证：PlanetMath 为 CC BY-SA 3.0，Stacks Project 为 GFDL 1.2 或更高版本，Wikipedia 为 CC BY-SA 4.0。以各条目来源链接及仓库[第三方声明](../../THIRD_PARTY_NOTICES.md)为准；界面软件许可证不覆盖来源数学内容的原许可证。
