# Bilingual publication audit / 双语发布审计

**Result: local prepublication checks passed; no unresolved critical blocker in the inspected repository.** This report precedes final ZIP creation and remote publication. It does not certify either upload or the final archive hash.

Executor: `agent:/root/atlas_audit`, a separately assigned agent sharing the same model and filesystem. This is a reproducible technical and attribution review, not external certification or legal advice.

## Inventory and frozen data

The packager selects **7,311 files / 402,131,116 bytes**, before adding this report pair and the new release manifest. The largest file is `data/nodes.jsonl` (36,893,029 bytes). No selected file exceeds 50 MiB, and all are below GitHub's 100 MiB file limit. There are no selected symlinks.

The only PDFs are the six Chinese/English figures produced by this project. The only archive is the open Stacks source snapshot. No external literature PDFs, unfiltered MathWorld/Wikipedia exploration, old sealed evaluation data, `.git` directory, or credential files are selected. A scan of all selected bytes found no matches for the six credential/private-key pattern families listed in the JSON; this does not guarantee detection of every possible secret format.

The frozen dataset remains **21,741 nodes / 46,812 edges / 21 documented bridges**:

- Nodes SHA-256: `4f146b824e4cce0f3b8e47e1c756557124c5075288fdf8cd7db0145a879abce1`
- Edges SHA-256: `ffc436ae4c1c8f35caf8127e347cd4547b1c24178389904fb0e40efc922a4fe4`

All 7,262 files in the preserved original manifest remain available. Changes are confined to the publication README, dependencies, renderer, and packager; the source and data payloads match the original snapshot. The old manifest is historical evidence, while the bilingual publication receives a new manifest.

## License and attribution review

| Material | Preserved license and scope |
| --- | --- |
| Original `scripts/` code | MIT, without extending it to the dataset |
| Original editorial prose and cartographic design | CC BY-SA 4.0, excluding third-party quotations and source-derived material |
| PlanetMath texts and derived records | CC BY-SA 3.0; authors, titles, original TeX, source URLs and hashes retained |
| Stacks texts and extracted statements | GFDL 1.2 or later; original Johan de Jong copyright, transparent TeX, license, contributors and modification history retained |
| Wikipedia text and cached HTML | CC BY-SA 4.0; source pages, revisions and history attribution preserved |

[LICENSE.md](../LICENSE.md) and [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) explicitly avoid a blanket license. The Stacks notice records a distinct collection title, publisher, original copyright, modification history, and no new invariant sections or cover texts. External papers are cited; their full-text PDF caches are absent. No separate Wikipedia media collection is redistributed. The actual installed Noto CJK font copyright/license has also been included for the rendered figure outputs.

## Portability and executed reproduction

All 115 checked local links in project Markdown resolve. Scripts do not require `/workspace`, `/mnt/data`, `/tmp`, or a user's home directory. The old `nodes_path` in the bridge-binding report is a historical locator, not a runtime dependency. Agent identities beginning `/root/` are labels, not filesystem requirements. The missing `lxml` audit dependency was identified and added as `lxml==6.1.1`.

The full tree was copied into a fresh temporary directory. Python socket connections were blocked, and the following operations completed using only the included sources:

1. Build the graph; compute the layout; bind the literature bridges; export candidates.
2. Render the maps; verify the release; run the structural audit.
3. Replay the fixed 36-source sample identity checks, all 50 Wikipedia source/52-link checks, and navigation checks.

An intentionally incomplete first sequence omitted rendering after recomputing coordinates; the structural audit correctly rejected its stale render manifest. After rendering, it passed.

**Rebuilding is not bit-for-bit coordinate reproducible, even in the same tested environment.** Every non-coordinate node field and every edge byte reproduced exactly. The largest observed x/y absolute difference was **0.000110096**. Accordingly, rebuilt node and figure hashes can change; a complete rebuild must regenerate maps and manifests. The frozen published files are identified by their supplied SHA-256 hashes.

Both delivered language editions were checked directly as XML: **28 SVG files** in total. Each overview contains 21,741 anchored nodes; each set of 12 domain maps sums to 21,741 nodes; each bridge map contains 21,741 background nodes and 21 documented routes. All counts and file hashes match their respective render manifests.

## Publication boundary

The new packager was inspected: it accepts an explicit output/version, rejects the old Chinese archive filename and outputs inside the repository, checks both SVG sets, writes to a temporary ZIP, then checks CRC and every member hash. The final package is created only after this report is included; its manifest and remote upload checks belong to the coordinating agent.

A legacy packager invocation accidentally overwrote the old Chinese v1 ZIP. The coordinator reconstructed it from the untouched original workspace. I independently read the restored archive: **78,400,149 bytes**, SHA-256 **`b12c27898fc2ca7560bf266497d9d3e864f90494901fc4f6cfcc41c226bbc9c0`**, exactly matching the original. The new packager rejects that old filename.

本次复核确认发布目录的结构、来源许可、相对路径与离线重建可用；最终打包与远端上传由主代理另行核验。坐标最大重建差异为 0.000110096，不应宣称逐字节完全复现。原始数学质量问题、来源标记与语义去重局限继续保留；本次发布审计没有把所有数学陈述改称已认证。
