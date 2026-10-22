# Connections workbench visual contract / 联岛实验视觉契约

This view extends the existing educational application without changing the scenic island map. It is a working surface for six explicit relationships between mathematical objects. The content and computations are educational models; they do not add unreviewed theorem edges to the core graph.

Accepted direction: one calm paper workbench, a compact experiment directory, native mathematical figures and controls, explicit relations and conditions, and a readable data table. No marketing hero, scenery backdrop, decorative badges, invented metric tiles or card grid.

## References

- `connections-concept-desktop.png`: **1506×1045**, complete desktop workbench.
- `connections-concept-mobile.png`: **874×1800**, stacked mobile composition.

Both were generated specifically for this surface and inspected with `view_image`. They are interface design references, not production raster UI or mathematical evidence. The existing brand SVG remains authoritative. The tiny landscape emblems must reuse `IslandGlyph` and the existing 24 habitats; no new terrain is required.

## Color and type lock

| Token | Production value | Use |
| --- | --- | --- |
| Paper | `#fbfaf4` | Full view background; not pure white or grey |
| Plot field | `#eef3ef` | Quiet coordinate/figure field |
| Ink | `#193a39` | Headings, main action, mathematics |
| Teal | `#2d6d64` | Initial object, active controls |
| Copper text | `#a95430` | Selected directory item and evolved/comparison object |
| Muted | `#5d6f69` | Explanatory copy and captions |
| Rule | `#c7d3cb` | Thin structure and table separators |

Retain existing `--serif` and `--sans` families. Desktop relationship title: **32 px / 1.25**, weight 600–650. Mobile: **24–26 px / 1.35**. Figure titles: **18–20 px**; body **14–15 px / 1.6**; native controls **13–14 px**; tables **13 px** desktop, **12–13 px** mobile; plot tick labels **12 px or larger at rendered scale**. Mathematical formulas may use Georgia/serif with actual Unicode or code-native markup. Do not rasterize text.

Radius: **3–4 px** for the shared figure region, parameter strip and action buttons; do not turn the page into large rounded cards. Border: **1 px**. No prominent shadow. Spacing scale: **8, 12, 16, 24, 32 px**. Controls and buttons have **44 px minimum effective touch height**.

## App shell and navigation

Reuse the existing header and brand. Add one new navigation entry without changing the other views:

| Order | Chinese | English |
| --- | --- | --- |
| 1 | 探索群岛 | Explore |
| 2 | 全部图谱 | Full atlas |
| 3 | 联岛实验 | Connections |
| 4 | 我的航记 | Field notes |

Desktop header remains **78 px** high. The selected navigation entry receives the existing copper underline. At narrow mobile widths, retain the two-row header; the four navigation items must fit or scroll intentionally without changing the document width. Preserve 44 px touch regions and the language switch. The generated concept's alternate mountain mark is not a new asset specification.

## Directory and allowed copy

Desktop directory is a quiet **190–205 px** rail with a fine right rule and plain text rows. The selected row has copper text and a **3 px** left rule, not a large filled card. Show all six items. At **≤760 px**, replace the vertical rail with a labelled native select or another compact single-choice control. Use the same six options and preserve the selection in navigation/share state.

| ID | Short directory label | English | Full relationship title |
| --- | --- | --- | --- |
| fourier-heat | 傅里叶与热流 | Fourier & heat | 同一频谱，热怎样演化 / One spectrum, evolving heat |
| graph-homology | 图与同调 | Graphs & homology | 从图的循环到同调类 / From graph cycles to homology |
| complex-covering | 复数与覆盖 | Complex covers | 复幂映射与路径提升 / Complex powers and lifted paths |
| transport-cdf | 分布与输运 | Distributions & transport | 运输成本就是累计差面积 / Transport cost as CDF area |
| ideal-zeros | 理想与零点 | Ideals & zeros | Bézout 系数与共同零点 / Bézout coefficients and common zeros |
| symmetry-representation | 对称与表示 | Symmetry & representations | 一个对称，三种表示 / One symmetry, three representations |

Exact full copy and mathematical content come from the curriculum module. Short labels remain the navigation vocabulary. Functional controls required for the real models may extend the image's example copy; they must serve a concrete experiment action.

## Desktop architecture

At the desktop reference width, the main content has **32 px outer padding**, a **198 px directory**, a **32 px gutter**, and a fluid workbench. At intermediate widths, shrink the gutter before shrinking chart text. Keep mathematical notation readable; do not preserve two columns if that makes each chart too small.

The default Fourier–heat experiment follows this order:

1. A compact full relationship title and one sentence: “调节时间，比较每个模态的衰减。” / “Adjust time and compare the decay of each mode.”
2. Two equal figure areas in one comparison region. Each has an **approximately 58–64 px** existing island emblem, object title, native formula/caption and computed chart. A single vertical rule separates the two areas; each chart has its own labelled axes and enough room for tick labels.
3. A shared parameter strip, wrapping controls as necessary. The concept uses 时间 t / Time t and 三倍频振幅 a / Third-harmonic amplitude a, with 重置 / Reset. Real models may expose additional meaningful controls.
4. A horizontal relation/conditions band, with **数学关系 / Mathematical relation** and **适用条件 / Conditions**. Conditions must remain plain readable text, not a tooltip or a status badge.
5. A native table, **模态数据 / Mode data** in the Fourier–heat case. Use real column headings and model results, right-align numerical entries where appropriate, and retain row/column semantics.
6. Footer actions: **保存实验记录 / Save experiment record**, **分享实验入口 / Share experiment entry**, and secondary related-classroom links or buttons. Saved state and errors are native text; the app must not imply an unsaved snapshot is persistent. The share link identifies the experiment and language. Parameter/result snapshots belong to saved records and their JSON/Markdown exports; the share action must not claim to encode current parameter values.

The concept's Fourier example is `u₀(x)=sin x+0.5 sin 3x`, `t=0.35`, with `u(x,t)=e^(−t) sin x+0.5e^(−9t) sin 3x`. Two example rows give decay factors approximately 0.7047 and 0.0429, current coefficients approximately 0.7047 and 0.0214. These numbers explain the concept; **production numbers must be computed from the current model parameters**.

## Mobile architecture

Use **16–20 px outer gutters**. Place the experiment chooser before the title. Stack the source and target figures vertically, preserving their labels and plot size. A figure should occupy the available width rather than showing a miniaturized desktop chart. Keep parameter labels and values adjacent; stack long controls and let equations wrap or use a clearly bounded horizontal mathematics region without causing page overflow.

The mathematical relation, conditions and table follow the figures and shared controls in the same reading order as desktop. The save/share actions may be two buttons on one row when they fit, otherwise stack them at full width. Related-classroom links follow them. The surface is a regular scrollable page; no floating action must cover a curve, axis label or table row.

The generated mobile concept adds previous/next arrows and a “1 / 6” counter. These were **not requested as separate behavior**: they may be omitted while the native six-option selector retains full functionality. Do not create redundant navigation solely to reproduce a generated detail.

## Scientific and implementation corrections

- Generated line profiles do not precisely satisfy their displayed equations; they are placement guides. All production curves, matrices, graphs, cumulative distributions, zero sets and tables come from native SVG/Canvas and deterministic model calculations.
- Different relationships may need different figure anatomy: a graph and a chain complex, a CDF pair and transported masses, a permutation/matrix/character triple. Keep their shared workbench typography, spacing and controls, while preserving the actual mathematical structure. Do not force every relationship into two identical sine plots.
- If one model needs more conditions, a larger data table or a longer equation, extend the same reading surface. Do not suppress mathematical scope to fit the concept's two-row example.
- The small decorative island emblems are outside controls' accessible naming. The associated native text names the objects. They must never replace the actual data figure.
- The original map remains a separate view with its existing typography, terrain, source identity and navigation behavior.

## Required final comparison

After root integration, inspect the latest browser captures alongside both concepts with `view_image`. Record at least five concrete findings covering layout, object-figure hierarchy, text/control readability, palette, native data/condition presentation, action placement and responsive behavior. Test one parameter change, a relationship switch, save, and share-state behavior where the integrated shell provides them. Record actual differences and repairs rather than inventing a fidelity score. Keep screenshot evidence and the ledger in this directory; no temporary preview page should remain.
