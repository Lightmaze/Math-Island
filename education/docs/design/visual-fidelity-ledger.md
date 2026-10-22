# Final visual fidelity ledger / 最终视觉核对记录

This is an observed comparison, not a numerical design score. The accepted references are `desktop-concept.png` (1505×1045) and `mobile-concept.png` (853×1844, a portrait composition approximately equivalent to 390×844). The final screenshots show the real application served from its Vite production `dist/`, not a screenshot reconstruction.

本记录比较真实生产页面与原始概念图，不给出没有测量依据的“完成度满分”。最终页面保留了浅海、纸面航记、数学对象生态与原生交互；下表列出具体保留项、修正项与不同之处。

## Environment and flow

- Refreshed at 2026-10-22 14:48 UTC from the frozen production build whose index was written at 14:44:32 UTC, Chromium, isolated browser contexts, device scale factor 1.
- Desktop: **1505×1045** (Chinese). Mobile: **390×844** (Chinese and English) plus **320×844** (English), mobile/touch emulation enabled.
- The production build was served by a temporary loopback HTTP server. Its address appears in `final-visual-check.json`; the server was closed after capture. No preview page or temporary test source was added to the project.
- Browser routing: the Browser skill was available and read, but discovery returned no Browser `js` or browser runtime tool. The established local Playwright workflow was used. No personal browser session was accessed.
- **Flow under test:** explore screen → select **对称林 / Symmetry Grove** → selected journal and pressed state update → **进入岛屿 / Enter island** opens the corresponding D₄ laboratory. This flow passed at both sizes.

## Reference-to-production comparison

| Criterion | Reference evidence | Actual observation | Decision / remaining difference |
| --- | --- | --- | --- |
| Desktop frame and proportions | Warm-white header, open sea on the left, a narrow right journal; reference divider is approximately x=1138. | Header is 78 px; sea is **1155 px** wide; journal is **350 px** wide. The first screen has the same sea-to-journal reading order and a fine vertical separator. | Structure retained. The journal is approximately 17 px narrower and the header approximately 4 px taller than the rendered concept; these are responsive layout dimensions, not embedded image coordinates. |
| Palette and surface separation | Pale green-grey ocean, warm paper, dark teal type, copper selection. | Ocean `#eef3ef` and paper `#fbfaf4` visibly separate the map and journal. Selected UI text uses **`#a95430`**; illustrated copper remains **`#c9774c`**. | Intentional correction: darker copper improves text contrast while preserving the illustration palette. The ornamental contour field is quieter and less dense than the concept's sea engraving. |
| Typography and native copy | Strong Chinese serif title, compact navigation and map labels, editorial journal headings. | The map title, island titles and section headings retain the serif hierarchy; interface text is native HTML. At 390 px, the main title stays on one line and the language/navigation labels fit. | Hierarchy retained. Compact mobile filters/search use 13 px text and navigation uses 15 px; the 44 px touch regions provide the larger interaction area. Actual explanatory copy is longer and mathematically more specific than the short concept copy, so the journal has denser body text. |
| Object-specific habitats | The concept suggests roughly ten heterogeneous mathematical landforms. | The inventory contains **24 different habitats**: square symmetry terraces, integer sediment bands, two-root spectrum wetland, overlapping sheaf canopy, ordered transport bars, heat smoothing coast, standing-wave light columns and others. No course shares its terrain sprite. | Coverage deliberately expanded. This is not achieved through recoloring a few generic islands. Full inventory evidence is `island-ecology-inventory.png`. |
| Artwork finish | Soft painted/engraved coastlines, translucent water, small surrounding rocks. | Production islands have crisp transparent silhouettes and a more tactile miniature-stone finish, with moss, channels and shallow shadows. The final captures show no white image rectangles or neighboring-sprite fragments. | A visible stylistic adaptation remains: the production terrain is more sculptural and less watercolor-like. It preserves the field-guide material palette and rich ecological relief; it is not a pixel-identical repaint of the reference. |
| Mathematical shape fidelity | The reference elliptic schematic and some ecological forms are only illustrative and include incorrect geometry. | Elliptic scenery is a non-self-intersecting cubic habitat, with the code overlay for **y²=x³−x+1**. D₄ uses a square; covering uses **z↦z²**; integer ideals use one-dimensional multiples; Spec(Z/12Z) has two points. | Repaired rather than copied. Native SVG carries a specified mathematical construction; the terrain does not establish numerical values or prove a claim. Independent mathematical review confirmed the corrected overlays, including transport marginals, heat frequencies and discrete spectral denominator. |
| Island selection and hit targets | A copper boundary singles out an island; labels appear beside the terrain. | The selected island has a copper contour/name and its matching terrain in the desktop journal. All **24 `.island-stop` elements** have a decorative `aria-hidden` SVG plus a **sibling overlaid `.island-hit-target` button**. The named buttons contain **zero SVGs**. | Interaction structure corrected for accessible naming while preserving the rendered appearance. Selection does not enlarge the chosen terrain into the oversized central hero seen in the concept; consistent map scale is retained. |
| Map extent and information density | The concept presents a mostly complete decorative composition in one frame. | The real surface pans over a larger 24-island map. Peripheral islands are partially clipped at the viewport edges, while the chosen island and its name are visible. Directory and fit-all controls expose the rest. | Intentional navigation tradeoff. These edge cuts indicate an explorable viewport, not broken sprite crops. The static reference's all-in-one framing is not reproduced at the cost of illegible labels. |
| Routes and orientation ornaments | The reference has dotted routes and a decorative compass in its idle state. | The idle production map has no decorative dependency lines or compass; route selection is an explicit control. The base sea has subtle native contour curves. | Intentional semantic correction: a scenic position or a decorative connection must not imply mathematical distance or a source-backed relationship. |
| Desktop journal | Selected title, object picture, object definition, discovery text, primary entry and continuation/source areas. | The final desktop journal follows this order, with native object text, the high-quality selected habitat, one dark main action, and source/license links at the bottom. | Reading order retained. The large generated equation diagram is replaced with the habitat plus exact text; the full parameterized chart belongs in the laboratory. |
| Mobile layout and first viewport | Two-row header, horizontal domain choices, a sea viewport and a rounded journal sheet. | Production has a **112 px** two-row header, horizontal filters, a **450 px** interactive map, then a full-width rounded journal. The journal begins at **y≈840 px**; its primary button is available by page scroll. A separate selected-island entry is already visible on the map. | Deliberate spacing difference: the concept compresses more of the journal into its first frame. Production gives navigation/search/touch controls more vertical room and duplicates the selected-island entry in the map. The page has **no horizontal overflow** at 390 px. |
| Mobile interaction and readable objects | The concept shows controls but cannot demonstrate their states. | Tapping Symmetry Grove updates the selected journal; entering it displays the three colored D₄ squares and operation selectors. The laboratory screenshot contains readable native mathematics and controls. | Functional evidence added. The reference alone could not establish this behavior. The previously short compact controls are corrected: domain filters, directory button, associated journey label and language buttons measure **44 px** high; primary entry is 49 px and map tools 44 px. Search clear, directory close and journal delete were additionally rendered and measured at **44×44 px**; the observed-state button is 94×44 px. The native select is 42 px inside its 44 px associated clickable label; these are recorded separately in the JSON. |

## Checks and evidence

| Check | Observed result |
| --- | --- |
| Page identity | Document title is 数学群岛; heading is 数学，在岛屿间生长; the initial URL selects `elliptic-garden`. |
| Meaningful rendered content | 24 island stops, selected journal, navigation, search and map controls are present. |
| Framework error overlay | None visible in desktop, mobile or entered-laboratory captures. |
| Runtime exceptions | Zero `pageerror` events across all four viewport/language contexts. |
| Console and resource health | The former `/favicon.ico` 404 is resolved by an explicit `favicon.svg` link. The current build loads it with **HTTP 200**. All four contexts have zero console warnings/errors and the static server logged zero missing requests. |
| Native accessibility structure | 24 outer stops; all have sibling decorative SVG and named button; zero decorative SVG descendants inside the named buttons. This is structural evidence, not a replacement for the separate axe audit. |
| Horizontal page overflow | None at 1505 px, 390 px or 320 px. At 320 px English, brand text ends at x=191.23 and language controls begin at x=204.89, leaving 13.66 px between them. |
| Interaction proof | The selected map button becomes pressed and the journal title becomes 对称林; entry displays the matching D₄ laboratory. A temporary note in an isolated mobile context also exposed the real 44×44 px journal-delete target for measurement. |
| Production artifact basis | Captures were taken from the built application, with real assets and real course data. |

The earlier favicon, compact-target and mobile English word-spacing findings are resolved in the refreshed build. The narrow English brand was checked directly and fits without overlapping the language controls. Both English headings were asserted to read exactly “Mathematics grows between islands.” Browser coverage here is Chromium only; full-atlas density, every laboratory parameter and complete keyboard traversal are outside this visual comparison, and their separate module tests should not be inferred from these screenshots. The final root review should inspect the actual images, not rely on this ledger alone.

## Screenshot inventory

- `final-desktop-viewport.png`: exact desktop first viewport, **1505×1045**.
- `final-desktop-fullpage.png`: desktop page extent at the same viewport.
- `final-mobile-viewport.png`: exact mobile first viewport, **390×844**.
- `final-mobile-fullpage.png`: mobile page including the journal below the fold.
- `final-desktop-interaction.png`: entered D₄ laboratory after the tested selection/entry flow.
- `final-mobile-interaction.png`: the same successful flow at mobile width.
- `final-mobile-en-viewport.png` and `final-mobile-en-fullpage.png`: English at 390 px.
- `final-mobile-320-en-viewport.png` and `final-mobile-320-en-fullpage.png`: English at 320 px, including the compact brand/navigation.
- `final-visual-check.json`: measured layout, structure, target sizes, favicon responses and interaction observations.

The initial concepts and earlier art review captures remain separate files so the reference, intermediate implementation and final production evidence cannot be confused.

## Resolved findings from this pass

| Finding in the earlier capture | Final verification |
| --- | --- |
| Automatic `/favicon.ico` request returned 404. | Explicit `favicon.svg` loads with HTTP 200. No missing requests or console warnings remain in any of the four final contexts. |
| Some compact mobile controls were 40–42 px tall. | Domain filters, language buttons, directory button and associated journey label are 44 px tall. Search clear, directory close and journal delete are 44×44 px. The selected-island entry and map controls also meet the 44 px height goal. |
| Hiding the English desktop line break concatenated “growsbetween”. | An explicit source space is present in the final build. The 390 px and 320 px screenshots now read “grows between”; assertions check the complete heading text. |

No unresolved finding from this targeted visual pass remains. This statement does not extend the browser/flow coverage beyond the checks listed above.
