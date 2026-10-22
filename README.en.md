# MathCups Mathematical Archipelago · 2D Navigation Atlas v1

[中文](README.zh-CN.md) · **English** · [Repository overview](README.md)

The mathematical atlas dataset remains **v1**; this bilingual publication is **version 1.0.0**. The bilingual release preserves the original source snapshots and data hashes.

This release contains **21,741 source-backed mathematical knowledge entries**, organized into 12 domains, with 46,812 typed relationships and 21 cross-domain routes whose key literature passages have been reviewed.

The Chinese and English editions use the same frozen data, identifiers, coordinates, and mathematical bridge records. Map annotations and documentation are localized; mathematical entry titles retain their source names. The English navigation index adds an English `domain_display` field while preserving the original `domain` field.

An “island” is an entry for a concept, definition, method, problem, or mathematical statement with a stable source identifier. The entries have different levels of granularity. They are not 21,741 independent theories, nor a library of individually proof-certified theorems. Identified aliases, duplicates, empty entries, and test material have been addressed; semantic equivalence across all mathematical entries has not been resolved.

## Open the maps

- [Scalable overview](maps/en/mathematical-archipelago-overview.svg): every point has a title and a source link.
- Overview [PDF](maps/en/mathematical-archipelago-overview.pdf) / [PNG](maps/en/mathematical-archipelago-overview.png): for printing or sharing.
- [Domain atlas](maps/en/mathematical-archipelago-domain-atlas.pdf): detailed maps of all 12 domains.
- Literature routes [PDF](maps/en/mathematical-archipelago-bridges.pdf) / [SVG](maps/en/mathematical-archipelago-bridges.svg): 21 routes, numbered to match the [mathematical bridge report](reports/math-bridges.en.md).
- [Navigation index](maps/en/navigation-index.csv): the full set of island names, A1–F6 grid locations, domain maps, source links, and source-quality records. A spreadsheet application can search every entry.
- Full data: [nodes.csv](data/nodes.csv), [nodes.jsonl](data/nodes.jsonl), and [edges.csv](data/edges.csv), including coordinates, rich metadata, and relationships.

Every node is actually drawn; only selected nodes display labels. The overview shows 16,000 selected relationships, while the complete relationship set remains in the data tables. Point size reflects recorded degree, not mathematical value. Actual nodes placed on the outer rings have no recorded links within their own domain, although they may have cross-domain links. This deterministic cartographic arrangement does not mean they are mathematically isolated. Two-dimensional distance, direction, color, and domain boundaries are not mathematical metrics or proof relations.

## Sources and counts

| Source | Main-dataset entries | Counting unit |
| --- | ---: | --- |
| Official PlanetMath subject repositories | 6,841 | Source-declared definitions, theorems, results, corollaries, conjectures, axioms, and algorithms |
| Stacks Project | 14,852 | Stable tags for 1,721 definitions, 12,587 lemmas, 330 propositions, and 214 theorems |
| Wikipedia supplement | 48 | 50 modern concepts or actual named article sections, with 2 entries merged into PlanetMath entries for the same subject |
| Total | **21,741** | Source-backed knowledge entries |

PlanetMath selection began with 9,477 records from 63 official repositories. Proof attachments, biographies, bibliographies, indexes, and similar material were not used to inflate the count. The strict source inventory contained 6,936 entries. Merging 11 manually confirmed duplicate records, separating 77 person/institution/publication/resource context entries, and excluding 7 other entries produced the final 6,841. The context layer is stored separately in [context-not-counted.jsonl](data/context-not-counted.jsonl); it is neither plotted nor counted as islands. Historical source entries on the Millennium Prize Problems, Hilbert’s sixteenth problem, Landau’s problems, straightedge-and-compass constructions, and algorithms remain included. Stacks contributes actual mathematical statement environments, not every paragraph, equation, or proof step.

This release has substantial **coverage bias toward algebra, algebraic geometry, and homological mathematics**: Stacks accounts for approximately 68% of entries. It covers number theory, analysis, geometry, probability, discrete mathematics, logic, and applications, but is neither a balanced sample of mathematics nor a claim to have traversed all mathematics. The granularity of entries also differs across domains.

Main sources: [PlanetMath](https://github.com/planetmath), the [Stacks Project](https://stacks.math.columbia.edu/), and the Wikipedia pages and revisions recorded per node. Stacks is pinned to commit `a04446e57ec1fbc252a871afcec7752fb2807b14`. Source manifests record source files, authors, versions, and SHA-256 hashes.

MathWorld and Wikipedia’s large alphabetical index were investigated as possible sources. Because alias resolution, inclusion of people, or redistribution boundaries remained unresolved, **neither contributed to the main count or the release package**.

## What a route means

| Relationship type | Count | Meaning |
| --- | ---: | --- |
| `encyclopedic_link` | 7,951 | A related entry or body-text link explicitly present in the source |
| `proof_reference` | 35,334 | A reference actually appearing in the specified proof text; reference resolution is checked, but proof dependency is not thereby verified |
| `statement_reference` | 2,836 | An actual reference within a mathematical statement |
| `title_matched_link` | 670 | An unambiguous normalized-name match between a Wikipedia link target and an entry from another source; identity of the underlying subject may still need review |
| `literature_bridge` | 21 | A route with a separately documented mathematical mechanism, assumptions, conclusion, and review of key literature passages |

Examples include elliptic curves–modular forms, modular forms–sphere packing in dimension eight, Hodge theory–matroid log-concavity, model-theoretic stability–graph regularity, concentration of measure–Euclidean dimension reduction, and polynomial root bounds–sum-check.

These are established mathematical connections, not new theorems discovered by this project. The [bridge report](reports/math-bridges.en.md) states the necessary conditions, including semistable elliptic curves, matching logical fragments, restricted isometry conditions, and algebraically closed base fields.

## Offline navigation

Run these commands from the repository directory. Navigation requires only the Python standard library:

```bash
python scripts/navigate.py search "rough"
python scripts/navigate.py search "sieve" --limit 30
python scripts/navigate.py show pm:SieveOfEratosthenes
python scripts/navigate.py neighbors pm:EllipticCurve
python scripts/navigate.py route pm:ModularForm wikipedia:Sphere_packing --directed
python scripts/navigate.py candidates --limit 50
```

Routes are reading paths through the recorded data graph. Each step retains its relationship type, original direction, source, and locator. Reading an edge backwards does not imply a reverse mathematical implication. The one-step route from modular forms to sphere packing has been executed and checked.

## From connection candidates to mathematical insight

This release actually generated **641 cross-domain navigation candidate pairs**, exporting the top 50 to [research-candidates.json](data/research-candidates.json). These candidates have not undergone pair-by-pair mathematical or novelty review. A pair must have at least two shared reference neighbors, no currently recorded direct edge, and endpoints in different domains. Ranking uses the Adamic–Adar score and excludes overly common high-degree nodes.

The score is not a probability of mathematical correctness, a measure of importance, or a novelty assessment. Shared neighbors may reflect editorial conventions; many candidate connections may already be known. Each candidate is explicitly marked `mathematical_connection=not_established`, `novelty=not_searched`, and `proposition=null`. Candidates are kept separate from established literature routes.

Turning a candidate into mathematical research requires concrete work: read both endpoints and their shared sources, identify a transferable structure, state the objects and assumptions, search prior work, formulate a precise proposition, and then produce a derivation, counterexample, or revision of the scope. The atlas supplies entry points and traceable records for those actions; it does not claim that the actions have already been completed.

## Actual quality checks

Full-dataset checks covered all 21,741 nodes, unique identifiers, finite and pairwise distinct coordinates, every relationship endpoint, hashes of the 6,999 source files actually used, all 21 literature-bridge bindings, and executable searches and routes. Actual SVG node-element counts were checked separately. The recorded graph has 4,020 connected components and 3,680 nodes with no recorded edges. These figures describe the selected sources, not the connectivity of mathematics itself.

The independent review fixed a random seed before drawing a stratified sample of 36 source passages from the 12 domains. It found **13 entries requiring quality treatment**. The initial sample record was retained; only the 3 excluded entries received fixed replacements, and 2 additional scope/context notes were recorded. Review covered the main subject passages and the full text of short entries, not every complete proof. Absence of a reported issue is not mathematical certification.

Empty entries and clearly unsuitable material were excluded. Where an entry represents a real concept but its source contains an error, a missing assumption, or unsettled notation, the concept is retained with a specific issue record. When a better source was merged, the criticized original file and its hash were also retained. In the final atlas, **16 islands carry explicit source-quality findings**, indicated by red circles. Full details are available in the navigation index, [audit-content-findings.json](reports/audit-content-findings.json), and [planetmath-source-quality-findings.json](reports/planetmath-source-quality-findings.json). Seven groups of concrete counterexamples from the independent audit were replayed using exact calculations. There is also an exact counterexample to the omission of nonnegative edge weights from Dijkstra’s algorithm, and records correcting two titles that disagreed with their source bodies: the Leslie model and Dijkstra’s algorithm. Original titles and source texts remain preserved. These checks are not proof-kernel certification.

## Integration with MathCups

Each node retains two type-annotation fields, represented by progressively refined intervals: “what mathematical tool was produced” and “through what discovery action it was produced.” The old MathCups registry was unavailable in this workspace, so its version is null and the default is `must=[] / may=[] / open=true`. No K/M/D identifiers have been invented, and source labels are not presented as completed formal typing.

The full semantic contract is in [atlas-schema.en.md](spec/atlas-schema.en.md). Historical transmission, mathematical applicability, source-reported claims, and modern reconstruction are distinguished. A mathematical relationship does not establish an author’s mental process or the causal history of discovery.

## Rebuilding

Tested environment: Python 3.12.14, NumPy 2.3.5, SciPy 1.17.0, Matplotlib 3.10.8, lxml 6.1.1, and Graphviz `sfdp` 2.43.0. lxml is required for the full source audit. The figures use Noto Sans CJK; Chinese rendering may differ if the font is unavailable.

Install the [Python dependencies](requirements.txt) from the repository root. On Debian/Ubuntu, the system packages are `graphviz` (which provides `sfdp`) and `fonts-noto-cjk`:

```bash
sudo apt-get update
sudo apt-get install graphviz fonts-noto-cjk
pip install -r requirements.txt
```

Initial installation normally requires network access. Once dependencies and source snapshots are available, the rebuilding and verification steps below can run offline. The navigation CLI alone does not require these third-party Python packages.

The release includes the selected open-source materials and parsed metadata. These steps can run offline:

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

The default rendering command writes the Chinese maps under `maps/`; the command with `--language en` writes the English edition under `maps/en/`. The first rebuild uses the included manually reviewed binding file. If the endpoint set changes, first bind the unpositioned nodes with `python scripts/bind_math_bridges.py --nodes data/nodes-unpositioned.jsonl`, then rebuild the graph. A script that replays a manual review record does not perform that review again.

After completing the checks above, package the bilingual release from the repository root:

```bash
python scripts/package_release.py --version 1.0.0
```

The default output is `Mafh-Island-v1.0.0.zip` in the repository's parent directory. The publication version does not change the atlas dataset's v1 version or its frozen source snapshots.

The `acquire_*` scripts fetch sources again and require network access. The full original PlanetMath repository archives total approximately 1.7 GB and are not included. The smaller open TeX source collection needed for the final dataset is included. External paper PDF caches are not redistributed; links, locators, and hashes are retained. Changed source versions require renewed review.

The published frozen snapshot is checked against the exact hashes in the [build report](reports/build-report.en.md). Reproduction should use the same source snapshots and software versions; even in the same software environment, rebuilding the layout may produce small numerical coordinate differences. The [independent publication audit](reports/github-publication-audit.md) records an offline rebuild that observed these differences while preserving all other node fields and a byte-identical edge file. After rebuilding the layout, always rerender the maps before running audits that check the rendering manifests. Old maps and their manifests cannot verify new coordinates.

## Source licenses and attribution

[LICENSE.md](LICENSE.md) distinguishes the license scopes: original code in `scripts/` is MIT licensed; original editorial prose and cartographic design are CC BY-SA 4.0, excluding third-party quotations and source-derived content. [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) records source-specific attribution, versions, and project modifications. These original-material licenses do not replace the source licenses below or apply MIT to the entire dataset.

PlanetMath-derived entries retain CC BY-SA 3.0; authors and source links are in the node metadata. The full license is in [LICENSE-CC-BY-SA-3.0.txt](source/planetmath/LICENSE-CC-BY-SA-3.0.txt). Stacks sources retain their GFDL license, README, and CONTRIBUTORS; see [COPYING](sources/stacks/tex/COPYING). Wikipedia sources retain page revisions, history/author entry points, and CC BY-SA license information. Each source keeps its own license; this collection does not replace them with a single unified license.

Source acquisition, semantics, cartography, and independent audit were handled by separate agents. The coordinating agent performed Stacks acquisition and parsing, data integration, layout, navigation, counterexample replay, and final release verification. Reports identify the reviewers and the scope of their actions. See the [build report](reports/build-report.en.md) for the recorded division of work.
