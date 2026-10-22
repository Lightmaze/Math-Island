# Mathematical Archipelago — education visual contract

## Scope and references

This is an independent educational explorer. It reads stable core IDs, but its scenic geography, curated destinations and learning journeys belong to `education/`. Neither the scenic positions nor an illustrated coastline asserts a mathematical distance or historical dependency.

Primary references, generated for this module and visually inspected:

- `desktop-concept.png` — 1505 × 1045, full desktop exploration surface.
- `mobile-concept.png` — 853 × 1844, a 390 × 844-equivalent portrait composition.

The images are design references, not application screenshots or a mathematical authority. Native HTML carries every control, label and explanation. Source-linked records carry knowledge identity. Programmatic SVG/Canvas carries the exact mathematical constructions in the laboratories. Generated island relief is explicitly illustrative scenery.

## Visual direction

A natural-history field guide becomes a maritime atlas of mathematical objects. The ecological identity of an island comes from the object: covering terraces repeat a circular coastline; discrete-curvature ridges have triangular faces; sieve reefs are integer grids; Fourier shores form layered oscillations; graph habitats have vertices and edges; homology reefs contain holes and chains. No decorative formula cloud, generic game reward badges, or fake discovery counts.

| Token | Value | Role |
| --- | --- | --- |
| ocean | `#eef3ef` | quiet map substrate |
| ocean-deep | `#dce9e3` | shallow contour bands, low contrast |
| paper | `#fbfaf4` | header, journal, reading surface |
| ink | `#193a39` | primary text and mathematical linework |
| secondary | `#60716c` | supporting text |
| rule | `#bcc9c1` | fine separators |
| teal | `#2d6d64` | main action, active structure |
| copper-text | `#a95430` | selected labels, navigation and textual accents; darkened for contrast |
| copper-art | `#c9774c` | decorative terrain accents and mathematical illustration strokes |
| sand | `#dfd1ab` | illustrated ground, not a metric |

Use a Chinese Song/Ming-style serif for editorial titles, with system serif fallback; use a legible system sans stack for compact interface controls and longer explanations. Desktop title 34–40 px, island title 30–36 px, section label 14–16 px, body 15–17 px, map direct labels 12–14 px. Mobile title 26–30 px; production compact controls use 13–15 px text with separately verified 44 px touch regions. Focus indicators must be stronger than the low-contrast map rules.

## Primary desktop composition

- A warm-paper header approximately 72–76 px tall, brand at left, three navigation entries, language at right. The header is not a filled dark bar.
- An open sea canvas occupying the main area. A reading journal on the right is approximately 340–370 px wide and separated by a single fine vertical rule. It is not a stack of dashboard cards.
- The map title and search occupy the upper-left. Domain selection uses quiet text navigation and may be a list or compact rail. It should not obscure the plotted islands.
- Mathematical islands are scattered in an intentional scenic layout with enough water to distinguish outlines. Island images have no white rectangle. Selection receives a copper contour or pointer, not a glowing fantasy aura.
- Zoom/reset controls stay together near a map corner. Direct labels remain code-native and readable. Long labels can wrap to two lines; do not rasterize or shrink them to fit.
- The right journal places object identity before operations: selected title, short insight, an object illustration, the exact mathematical object, a learning question, one main entry action, and source/continuation links.

## Mobile composition

- Brand/language share the first row; the three main navigation choices share a second row.
- Intro, search and a horizontal domain filter precede the map. The sea retains its own pan/zoom surface; the page can still scroll around it.
- The desktop journal becomes a full-width reading region below the map. Its primary entry button must be reachable without horizontal scrolling.
- Primary mobile entry and map-control touch targets are at least 44 px. The revised mobile domain filters, directory button, associated journey label and language buttons were also measured at 44 px; the rendered search-clear, directory-close and journal-delete targets measure 44×44 px; compact controls are verified explicitly in the fidelity ledger rather than inferred from appearance. No reliance on hover. Keyboard controls and a textual destination list provide alternatives to pointing at the map.
- The selected destination survives resizing, navigation back, and language switching. Reduce movement when `prefers-reduced-motion` is set.

## Allowed primary-screen copy

The concept supplies the following visible copy. Additional functional labels may be necessary for real search, accessibility, content status, atlas filters and object controls; record them as functional additions rather than decorative branding.

| Region | Chinese | English |
| --- | --- | --- |
| Brand | 数学群岛 | Mathematical Archipelago |
| Navigation | 探索群岛 | Explore |
| Navigation | 全部图谱 | Full atlas |
| Navigation | 我的航记 | Field notes |
| Main title | 数学，在岛屿间生长 | Mathematics grows between islands |
| Subtitle | 从一个对象出发，看见结构之间的联系 | Begin with an object. See how structures connect. |
| Search | 搜索岛屿、对象与方法 | Search islands, objects and methods |
| Region selection | 全部海域 | All regions |
| Selected item label | 当前岛屿 | Selected island |
| Object label | 岛上对象 | The objects here |
| Learning label | 你将发现 | What to explore |
| Primary action | 进入岛屿 | Explore this island |
| Continuations | 继续航行 | Continue exploring |
| Source | 查看数学出处 | Read the mathematical source |
| Map caption | 教育航线 · 布局用于探索 | Educational map · A layout for exploration |

## Island and laboratory asset contract

Twenty-four object-specific ecological habitats are supplied in six transparent WebP atlases (`c`–`h`). Every laboratory key maps to its own habitat; no two courses share a landscape. The atlases reuse network requests and decoding, not subject identity. `IslandGlyph` overlays a code-generated mathematical motif. The ground and relief remain illustrative; the actual laboratory displays parameters, computed data, controls and mathematical scope.

`IslandGlyph({ kind, seed, size, className, selected })` accepts all 24 laboratory keys. It renders a decorative, non-interactive SVG with `aria-hidden=true`; the sibling overlaid `.island-hit-target` button owns the accessible title and input behavior. The `.island-stop` outer div contains the decorative SVG and this button as siblings; the named button contains only the native island title, so decorative formula text cannot alter its visible-label comparison. Every viewport uses unique SVG definition IDs. It does not fetch graph data. Landscape images are requested when the glyph approaches the visible viewport or is selected; once loaded, their scene remains available for panning.

Original generated PNGs are retained in `source-art/`. Production WebP uses lossless encoding with exact transparent-pixel preservation. All six decoded RGBA arrays were checked byte-for-byte against their originals: **14,304,845 bytes → 9,328,912 bytes**, a **34.8% reduction**, with no pixel resampling or retouching. The original two exploratory atlases (`a`, `b`) remain archived and are not shipped. Their repeated scenery and some misleading shapes were superseded.

An alpha-derived convex enclosing polygon and fitted SVG view box isolate each sprite, including disconnected Cantor coastline components, without changing source pixels. The polygon is a rendering boundary, not a mathematical coastline. `art-assets.json` records source/production hashes, dimensions, exact encoding and pixel-equality results. `art-clips.json` records rendering bounds; the production copy is `src/components/island-art-clips.json`.

| Course key | Ecological habitat / 对象生态 | Exact SVG motif | Atlas cell |
| --- | --- | --- | --- |
| sieve | Prime sieve reef / 素数筛礁 | Integers 1–35, primes computed by divisibility | h00 |
| elliptic | Smooth cubic garden / 光滑三次曲线园 | y²=x³−x+1, P=(0,1), Q=(1,1), secant and reflection | g00 |
| group | Square symmetric grove / 正方形对称林 | Square vertices, four reflection axes, quarter-turn | c00 |
| finitefield | Discrete evaluation garden / 有限域采样园 | Seven points of y=x²+1 over F₇ on a 7×7 grid | g11 |
| ideal | Integer sediment layers / 整数理想沉积 | 2Z, 3Z, 6Z in the integer window [−6,6] | c10 |
| spectrum | Two-root wetland / 两根素谱湿地 | Spec(Z/12Z)={(2),(3)}; D(2)={(3)} | c11 |
| algebraiccurve | Circle and cusp ridges / 圆与尖点群峰 | Circle and semicubical cusp parameterizations | f10 |
| sheaf | Compatible overlapping canopies / 相容层云冠 | Overlapping patches and agreeing local functions | d00 |
| homology | Triangulated cave reef / 三角同调洞礁 | Triangulated annulus and an inner cycle | h11 |
| category | Corresponding harbors / 函子双港 | A commuting square with directed arrows | e10 |
| topology | Repeated circular terraces / 圆周覆盖梯田 | Circle map z↦z², a two-point fiber, path and lift | c01 |
| geometry | Angular triangular ridge / 三角曲率山脊 | Octahedron with its six vertices and twelve edges | g01 |
| fourier | Oscillatory rock strata / 谐波潮汐岩层 | First, third and fifth harmonics, amplitudes 1/n | h01 |
| complex | Rotated grid strait / 复乘旋转海峡 | z↦(0.7+0.7i)z applied to an orthogonal grid | g10 |
| probability | Irregular river delta / 布朗三角洲 | Seeded Gaussian increments N(0,1/48); ±2√t guide | e00 |
| lln | Stabilizing tide reef / 均值潮线 | Seeded Bernoulli(1/2) running mean and expectation | e01 |
| graph | Six bridge habitats / 有限图桥群 | Finite graph with positive edge weights and a highlighted path | h10 |
| matroid | Four-pillar root forest / K₄拟阵根林 | K₄ and a selected spanning tree | f11 |
| logic | Compatible observatory interfaces / 类型观测台 | Application rule f:A→B, x:A ⊢ f x:B | e11 |
| fractal | Repeatedly divided coast / Cantor海岸 | First five finite Cantor construction stages | f00 |
| optimization | Contoured descent basin / 梯度盆地 | Positive quadratic contours and gradient iterates | f01 |
| transport | Ordered sandbar channels / 单调运输沙洲 | Conserved marginals and a noncrossing coupling | d01 |
| heat | Smoothing thermal shoreline / 热流海岸 | exp(−t)sin x + .35 exp(−9t)sin 3x | d10 |
| spectral | Standing-wave lighthouse line / 本征灯列 | N=9 Dirichlet discrete sine eigenvectors | d11 |

## Intentional corrections and adaptations

1. The generated desktop reference draws an incorrect schematic elliptic curve/addition diagram. It is replaced by sampled points of an actual nonsingular cubic and the laboratory's mathematically checked construction. The original figure-eight ecological shape was also replaced by a noncrossing smooth cubic habitat. No generated chart is shipped as proof or numerical evidence.
2. Coastlines, hills, plants and terrain relief are illustrative teaching metaphors. Exact mathematical objects and parameters are calculated in code. The production visuals retain high-quality ecological relief; this distinction does not justify replacing the visual design with rough placeholder icons.
3. The references show approximately ten islands for legibility. The application provides the actual curated set, while the separate full-atlas view exposes every indexed core entry. No scenic island count is presented as the full knowledge count.
4. A programmatic responsive composition preserves the reading order. It need not replicate the reference's impossible fixed-pixel arrangement on every screen.
5. The image's decorative route strokes do not supply relations. Production routes must come from explicit educational itinerary data or identified source relations and be labeled accordingly.

## Acceptance evidence

Compare the actual desktop and mobile screens with the references for: layout ratio and reading order; warm-paper/pale-sea palette; serif/sans hierarchy and readable controls; ecological object silhouettes; native direct labels and coherent selected state; mobile navigation and journal arrangement; and working map-to-laboratory-to-source navigation. Record concrete differences and repairs in the module's QA ledger. Build success alone is insufficient.

## Production visual inspection

`island-ecology-inventory.png` shows all 24 habitats at one scale. `actual-desktop-art-review.png` and `actual-mobile-art-review.png` capture the earlier integrated application at 1440×1000 and 390×844. The final production-build comparison uses `final-desktop-viewport.png` at 1505×1045 and `final-mobile-viewport.png` at 390×844, together with the corresponding `-fullpage` and `-interaction` captures. The explicit comparison is recorded in `visual-fidelity-ledger.md`. These are actual browser captures, distinct from the ImageGen references. Inspection checked complete silhouettes, separated crops, native overlays, no foreign sprite fragments, visible distinct habitats, consistent paper/sea palette, selected ecological object in the desktop journal, and the mobile reading panel. The final Chromium pass reports no page errors, console warnings or missing requests. The favicon resolves successfully. Mobile English brand and heading checks additionally cover 390 px and 320 px. TypeScript passed for the integrated module during implementation; the final visual pass used the frozen production build without rebuilding it.

数学精确性说明：地貌用于建立对象直觉，不能代替定义、数值计算或证明。课程对象、实验计算与图面叠层逐一对应；图集中的柱数、岩脊角度、树枝连接等生成细节不作为数学断言。特别是椭圆曲线不使用自交∞形，圆周覆盖不使用环面代替，有限商环素谱不添加(0)泛点，整数主理想不画成单项式理想。
