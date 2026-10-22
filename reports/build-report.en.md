# MathCups Mathematical Archipelago v1 — Build and verification record

[中文原文](构建报告.txt) · [English project documentation](../README.en.md)

The final main dataset contains **21,741 source-backed mathematical knowledge entries**, 12 domains, 46,812 typed relationships, and 21 literature routes.

- PlanetMath: 6,841 entries.
- Stacks Project: 14,852 entries.
- Wikipedia supplement: 48 entries.

An additional 77 person, institution, publication, and resource entries are stored in a context layer and are not counted in the main atlas. Confirmed duplicate entries for the same subject were merged according to reviewed mappings.

Counting units include definitions and individual lemma/theorem statements. The total does not represent 21,741 independent theories or the result of complete semantic-equivalence resolution across mathematics. Coverage is biased toward algebraic geometry and homological mathematics. Fine-grained Stacks statements alone account for approximately 68% of the dataset, and granularity differs across domains.

## Implemented and checked

1. Sources were acquired with per-file hash records; all 6,999 source files actually used matched their recorded hashes.
2. Explicit source links, proof references, statement references, cross-source title matches, and literature-backed mathematical bridges have distinct relationship types.
3. Every node has an actual two-dimensional position. The release includes an overview, literature-route maps, 12 domain maps, and a navigation index for all nodes.
4. CLI name searches, original-entry inspection, neighbor queries, and shortest reading routes with direction and evidence were actually executed.
5. Shared reference neighbors produced 641 candidate pairs, of which 50 were exported. No mathematical validity or research novelty is claimed for them.
6. The independent review froze an initial sample of 36 entries and retained that original record: 33 were retained and 3 received fixed replacements. The initial review found 13 issues; replacement review added 2 scope/context notes.
7. A further review of displayed map labels identified people and institutions that had entered the dataset, and two titles inconsistent with their source bodies. These received explicit corrections or were moved to the context layer.
8. The final main atlas has 16 entries with source-quality notes. An unmarked entry is not thereby certified in all its contents.

## Recorded graph and coordinates

The source graph has 4,020 connected components. The largest contains 13,601 nodes; 3,680 nodes have no recorded edge. These counts describe the structure recorded by the selected sources and do not establish actual mathematical isolation.

Layout uses `sfdp` driven by the existence of cross-domain references, followed by nonoverlapping cartographic packing. Within a domain, nodes with recorded intra-domain edges use `sfdp`; nodes without such edges occupy a deterministic outer ring. No semantic connections were invented for the layout.

| File | SHA-256 |
| --- | --- |
| `data/nodes.jsonl` | `4f146b824e4cce0f3b8e47e1c756557124c5075288fdf8cd7db0145a879abce1` |
| `data/edges.csv` | `ffc436ae4c1c8f35caf8127e347cd4547b1c24178389904fb0e40efc922a4fe4` |

## Recorded division of work

| Executor | Work performed |
| --- | --- |
| Coordinating agent `/root` | Stacks download and parsing; data integration and filtering; layout; CLI navigation; candidate generation; source-title corrections and the Dijkstra counterexample; final review and packaging |
| Subagent `atlas_sources` | Official PlanetMath acquisition, source collection, deduplication, and subject review of 96 historical entries across domains |
| Subagent `atlas_wikipedia` | Modern mathematics supplement from the open encyclopedia; revision and body-link extraction |
| Subagent `atlas_semantics` | Interface for the two typing layers; assumptions, literature review, and binding of 21 mathematical bridges |
| Subagent `atlas_cartography` | Overview, domain-atlas, and literature-route rendering; inspection of actual images and displayed titles |
| Subagent `atlas_audit` | Independent full-dataset structural checks, fixed-sample source review, and records of counterexamples or missing conditions |

All agents shared a workspace. This does not constitute a strongly isolated blind test or a new evaluation on the final MathCups test set.

See [README.en.md](../README.en.md) for usage and limitations. Full source and operational evidence is retained in the explicitly selected material under [reports](.), [sources](../sources), and [source](../source).
