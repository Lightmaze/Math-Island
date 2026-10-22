# Sources, attribution, and modifications / 来源、归属与修改

## PlanetMath

- Source: [official PlanetMath repositories](https://github.com/planetmath).
- License: **CC BY-SA 3.0**, [full license](source/planetmath/LICENSE-CC-BY-SA-3.0.txt).
- Authors, original titles, source paths and URLs, revisions, and hashes: [records](source/planetmath/records.jsonl), [repository manifest](source/planetmath/manifest.json), and [selected TeX manifest](sources/planetmath/tex-manifest.json).
- Selected original TeX is preserved in `sources/planetmath/tex/`. The project extracts structured entries and explicit links, merges documented duplicates, excludes non-mathematical context from island counts, adds coordinates and quality annotations, and corrects two display titles with the original titles and bytes retained. These changes are recorded in `reports/` and do not alter the archived source text.

PlanetMath 作者、题名、版本、源链接与哈希均在上述记录中。原 TeX 保留；结构抽取、去重、分域、坐标、题名校勘与质量注记是本项目的增补。相关报告明确区分原文与本项目修订。

## The Stacks Project

- Source: [The Stacks Project](https://stacks.math.columbia.edu/) and [source repository](https://github.com/stacks/stacks-project).
- Fixed source commit: `a04446e57ec1fbc252a871afcec7752fb2807b14`.
- License: **GNU Free Documentation License, version 1.2 or later**. Upstream [COPYING](sources/stacks/tex/COPYING), [README](sources/stacks/tex/README), and [CONTRIBUTORS](sources/stacks/tex/CONTRIBUTORS) are included.
- Source archive, its checksum, and extraction metadata: [manifest](sources/stacks/manifest.json). Transparent TeX sources, tags, license, and attribution are preserved in `sources/stacks/tex/`.
- The project extracts tagged definitions, lemmas, propositions, and theorems, resolves syntactic references, and adds classification and layout metadata. It does not claim to have reverified every proof. Extracted statements and source-derived text retain the Stacks license.

Stacks 的源版本、完整选定 TeX、标签、许可与贡献者名单随库保存。抽取的陈述及源文派生部分保留 GFDL；引用解析与坐标增补不等于证明认证。

### Modification record for extracted Stacks text / Stacks 抽取版本的修改记录

- Distinct collection title: **Mafh-Island: MathCups Mathematical Archipelago, bilingual edition 1.0.0**.
- Publisher of this collection: **Lightmaze**, 2026, at <https://github.com/Lightmaze/Mafh-Island>.
- Original document: **The Stacks Project**. Its [introduction](sources/stacks/tex/introduction.tex) retains the notice **Copyright (C) 2005 -- 2025 Johan de Jong**, the original license notice, and source project information. Authors are credited by the upstream [complete contributor list](sources/stacks/tex/CONTRIBUTORS), retained unmodified; the atlas does not claim authorship of their mathematics.
- History, 2026-10-22: the source snapshot above was parsed into tagged statement records and syntactic citation edges; source identity, byte hashes, and transparent TeX were retained. Editorial domain assignments, display coordinates, and navigation metadata were added. The Chinese and English documentation describes these transformations; the English map edition changes display text only. No theorem statement in the archived TeX was rewritten. The source-derived text remains under GFDL 1.2 or later, without new invariant sections or cover texts added by this collection.

本集合的新标题、发布者与修改日期如上。原文版权声明、作者名单及许可完整保留；英文化只增补项目说明与图面文字，不重写归档定理原文，也不改变其许可。

## Wikipedia

- Source: the fifty selected pages or named sections recorded in the [bridge manifest](sources/wikipedia/wikipedia-bridge-manifest.json); two overlapping entities are merged with PlanetMath in the final node set.
- License: **CC BY-SA 4.0**; [license text](LICENSES/CC-BY-SA-4.0.txt). Individual source pages may identify further terms for embedded non-text media. This repository does not download a separate media collection.
- Attribution: each original Wikipedia article's contributors, accessible through the page's revision history. Canonical URLs, revision identifiers, HTML hashes, and retrieval metadata are preserved; final nodes also carry history links.
- Cached original HTML is in `sources/wikipedia/bridges/`. The atlas extracts names, identifiers, and links, adds editorial groupings and selected literature bindings, and preserves the source provenance.

Wikipedia 内容归属各原页面贡献者；页面、版本及历史入口见 manifest 与节点记录。HTML 原文保留，未另行抓取图片媒体库。本项目抽取名称与链接，增加分域及文献桥绑定。

## Literature and mixed-source outputs / 文献与混合来源输出

The [bridge catalogue](reports/math-bridges.en.md) cites 21 established connections, with conditions, mechanisms, source URLs, and reading records. External paper PDFs and full-text caches are **not distributed**. Short source passages in audit records retain their original attribution and are provided to locate and explain the review; they are not covered by the MIT script license or a replacement blanket license.

Tables and maps aggregate source-derived entries with project metadata. Keep this notice, the source-specific license files, and the per-entry attribution and provenance when redistributing the collection. Do not treat all contents as MIT licensed. Chinese and English editions use the same mathematical dataset; translations of project explanations do not replace the original source texts.

21 条桥梁引用已有数学成果，并保留适用条件、文献地址与审读记录。外部论文 PDF 和全文缓存不随库分发。审读记录中的短引文保留原归属，用于定位审查依据。中英文版本共用数学数据；翻译不替代来源原文。

## Map typography / 地图字体

The maps use Noto Sans CJK. The installed font package's [copyright and SIL Open Font License notice](LICENSES/Noto-CJK-COPYRIGHT.txt) is retained for attribution. Font files are provided by the system package, not bundled as standalone fonts in this repository.

地图使用 Noto Sans CJK，随库保留其字体版权与 SIL Open Font License 说明；字体通过系统软件包安装，本仓库不单独打包字体文件。
