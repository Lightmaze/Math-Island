# 0.2 一小时联岛冲刺 / One-hour connection sprint

日期 / Date: 2026-10-22
计划窗口 / Planned window: **15:33–16:33 UTC**
本文区分计划、已落盘实现、独立验证和部署；最后两项以各自的执行记录为准。
This record distinguishes the plan, implemented features, independent verification and deployment. Execution records govern the last two.

## 目标 / Goal

把“两个岛之间有一条线”推进为可操作的数学联系：两种表示或结构共享同一份状态，操作后同时改变，读者可以检查等式、构造、条件和反例，并保存可复现的参数与观察。

Turn a line between islands into an operable mathematical connection: two representations or structures share state, respond to the same operations, and expose identities, constructions, assumptions and counterexamples. Readers can save parameters and observations for manual reproduction.

范围是 **24 座既有双语对象课堂 + 6 个新联岛工作台**。本体快照仍有 **21,741 条来源条目、21 条既有文献桥梁**。六个教学联系不作为六条新本体关系写回；不把有限实验称作一般定理证明、已完成的类型化或学习认证。

The scope is **24 existing bilingual object lessons plus six new connection workbenches**. The core snapshot retains **21,741 source entries and 21 existing literature bridges**. The six teaching connections do not become new core relations. Finite experiments are not general theorem proofs, completed formal typing, or learner certification.

## 时间安排 / Planned allocation

以下是本轮计划时段，不表示每项已在对应时间完成。
The following is the planned allocation, not a claim of completion at every listed time.

| UTC | 工作 / Work |
| --- | --- |
| 15:33–15:45 | 并行确定六项精确模型、共享状态与反例；核实课程对应和文献定位。 / Specify six models, shared states and counterexamples in parallel; check lesson references and source passages. |
| 15:45–16:00 | 集成双语联岛工作台、课程说明、真实参数与计算结果快照；独立核对数学模型。 / Integrate bilingual workbenches, curriculum and snapshots of actual parameters/results; independently check the mathematics. |
| 16:00–16:20 | 检查桌面、手机、键盘与数据导入导出；修正实际发现的问题；更新交付文档。 / Exercise desktop, mobile, keyboard and import/export flows; correct observed issues and update delivery documentation. |
| 16:20–16:33 | 汇总最终版本证据、打包静态成品并核验发布入口；记录未完成或有限的检查。 / Collect final-version evidence, package the static artifact and verify publication entry points; record incomplete or limited checks. |

## 已实现的数学联系 / Implemented mathematical connections

| 稳定 ID / Stable ID | 实际模型与可检查联系 / Model and inspectable relation |
| --- | --- |
| `fourier-heat` | 周期 2π、扩散系数 1 的有限正弦展开：`u=m+Σ(k=1…4) aₖ exp(−k²t) sin(kx)`。同一状态驱动模态、波形、均值、能量与耗散读数。 / A finite sine expansion for period 2π and diffusivity 1 drives modes, waveform, preserved mean, energy and dissipation from shared state. |
| `graph-homology` | K₄ 的可选边与三角面生成 F₂ 边界矩阵，核对 `∂₁∂₂=0`、周期/边界和 Betti 数。非周期不给同调类；四面填全是四面体边界。 / Selected K₄ edges and faces determine F₂ boundary matrices, cycles/boundaries and Betti numbers. Noncycles do not receive homology classes; four filled faces form a tetrahedron boundary. |
| `complex-covering` | 圆周 `z↦zⁿ`，指定初始层与闭路绕数，连续提升 `exp(2πi(mt+k)/n)`；终点层变化为 `k+m mod n`。 / The circle covering uses a specified starting sheet and accumulated angle; the explicit lift determines the endpoint permutation. |
| `transport-cdf` | 同一对一维有限概率测度同时生成单调耦合与两条 CDF，核对 `W₁=∫|F−G|`，展示边际误差和浮点差。 / The same finite probability measures generate a monotone coupling and two CDFs, comparing transport cost with the absolute CDF-difference integral and showing numerical residuals. |
| `ideal-zeros` | Fₚ[x] 上真实欧几里得除法、gcd、Bézout 系数与共同零点枚举。包含零多项式、重根、无有理根但非单位理想的反例。 / Polynomial Euclidean division, gcd, Bézout coefficients and common-zero enumeration over Fₚ, including zero inputs, repeated roots and a proper ideal without rational zeros. |
| `symmetry-representation` | D₄ 的复数乘法/共轭动作与实二维矩阵同步，比较两种复合顺序。零向量像相同不能推出群元素交换；反射不声称复线性。 / D₄ complex multiplication/conjugation actions and real matrices share state and expose composition order. Agreement on zero does not imply commutation; reflections are not claimed complex-linear. |

参数范围、三步活动、问题答案、实际课程与核心 ID、文献定位及检索范围见[联岛课程记录](connection-curriculum.md)。中英文课堂组织见[中文教师指南](teacher-guide.zh-CN.md)与[English teacher guide](teacher-guide.en.md)。检索和局部阅读的范围明确记录，不声称重审整部文献的完整证明。

See the [connection curriculum](connection-curriculum.md) for parameter ranges, activities, questions and answers, actual lesson/core references, source locators and retrieval scope. The teacher guides provide bilingual classroom plans. Source retrieval and passage reading do not claim a complete proof audit of the cited works.

## 已实现的记录与分享 / Implemented records and sharing

- 保存时复制**当前参数、计算结果、观察文字、模型版本、时间和核心引用**。笔记存于当前浏览器，不写回本体。 / Saving captures **current parameters, computed results, observation text, model version, time and core references** in the browser, without changing the core.
- 实验记录可导出 JSON 或 Markdown，JSON 可导入。按记录 ID 合并，已有同 ID 记录保留本机版本；不采用对象课堂航记的时间戳合并规则。 / Export experiment records as JSON or Markdown and import JSON. Merge by record ID, preserving existing local IDs; this differs from the island field notes' timestamp merge.
- **最多 500 条**。备份及合并结果最多 5 MiB。错误格式、备份内重复 ID 或超限会整体拒绝导入，保留原记录。浏览器存储失败会提示；不可读的旧备份不会静默覆盖。 / **Up to 500 records**, with a 5 MiB limit on backups and merged results. Malformed data, duplicate IDs inside a backup or exceeded limits reject the whole import. Storage failures are reported; unreadable old data is not silently overwritten.
- **分享只分享入口**，含工作台 ID 和语言，不含参数、结果或私人笔记。打开记录对应的实验入口不会自动恢复参数；使用保存的参数手动复现。 / **Sharing sends only an entry link**, identifying the workbench and language. It excludes parameters, results and private notes. Opening a saved record's entry does not automatically restore parameters; reproduce them manually from the record.
- 既有航记与新实验记录的格式和导入入口分开；清理站点数据会删除本机记录，已下载备份不受影响。 / Existing field notes and experiment records have separate formats and import controls. Clearing site data removes local records, but not downloaded backups.

## 验证与证据 / Verification and evidence

本轮的数学、课程、导入导出与浏览器检查以[独立联岛审查](connections-review.md)及其链接的实际证据为准。该报告区分计划、已执行结果与待完成项；本文不预填测试数量、可访问性结论或生产环境通过状态。课程来源核验与有限模型检查不替代一般数学定理的证明。

The [independent connection review](connections-review.md) and its evidence govern mathematical, curriculum, import/export and browser verification. That report separates planned, executed and pending checks. This page does not prefill test counts, accessibility conclusions or production passing status. Source checks and finite-model verification do not replace proofs of general theorems.

[0.1 交付记录](delivery.md)、[0.1 审查记录](review.md)及原有证据保持历史版本，不用本轮结果覆盖。旧截图不充当新联岛界面的验证截图。本体保留检查仍按明确版本的既有只读审计执行。

The [0.1 delivery](delivery.md), [0.1 review](review.md) and earlier evidence remain historical records. Earlier screenshots are not evidence for the new workbenches. Core-preservation checks continue to use the explicitly versioned read-only audit.

## 发布入口与部署 / Publication and deployment

主代理已完成源码提交、公开静态包和现有 Sites 更新。应用源码提交为 [`0cb6f26`](https://github.com/Lightmaze/Math-Island/commit/0cb6f26dcd166ef597779723bd248829d2cff169)；之后的发布证据提交只补充文档与执行记录。

The coordinating agent committed the implementation, published the static artifact and updated the existing Site. Application source is pinned at [`0cb6f26`](https://github.com/Lightmaze/Math-Island/commit/0cb6f26dcd166ef597779723bd248829d2cff169); later publication-evidence commits add documentation and execution records only.

- **公开静态成品 / Public static artifact:** [`education-static-v0.2.0.zip`](https://github.com/Lightmaze/Math-Island/archive/refs/tags/education-static-v0.2.0.zip), 11,709,855 bytes. SHA-256: `5725b0ac0dd2f7cd5dc79573e49e69436d94a4786de2810b0bda7c70a363cd4c`.
- **现有站点 / Existing Site:** [直接进入联岛实验 / Open Connections](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=connections&lang=zh&connection=fourier-heat). Sites version **2**, deployment succeeded at **2026-10-22 16:18:20 UTC**; current audience remains **owner-private**. GitHub source and the static ZIP are public. GitHub Pages remains disabled.
- **发布记录 / Release:** [education-v0.2.0](https://github.com/Lightmaze/Math-Island/releases/tag/education-v0.2.0). The core release keeps its existing Latest designation.

独立代理从公开链接下载 ZIP，核对了 30 个载荷文件及清单的精确集合、大小和哈希；在 `/Math-Island/` 子路径运行中英 × 桌面/手机 4 个组合，各自检查六个联岛入口及参数改变、保存、重载、导出。结果均通过，无页面、控制台或请求错误。这验证的是公开下载包的实际运行，未将它称为 GitHub Pages 在线验证。

An independent agent downloaded the public ZIP, checked the exact file set and the size/hash of all 30 payload files, and ran four language/device configurations under `/Math-Island/`. Each exercised all six connection entries plus parameter changes, saving, reload and export. All passed without page, console or request errors. This verifies the downloaded artifact, not a live GitHub Pages endpoint.

Sites 从已提交并推送的专用源码 `699d83f1d720a133fcb50b5deb1fd73e15dcbd11` 重建；29 个应用文件与审查后的主仓库构建逐字节相同。Sites 工具确认部署成功及保存版本对应的源码 SHA。未声称另行完成登录后的生产浏览器操作。服务端存档哈希与本地压缩包哈希按各自范围记录。

Sites was rebuilt from committed and pushed source `699d83f1d720a133fcb50b5deb1fd73e15dcbd11`; all 29 application files match the reviewed canonical build byte for byte. Native Sites tools confirmed successful deployment and the saved version's source SHA. No separate authenticated production-browser interaction is claimed. Server archive and submitted-package hashes are recorded under their respective scopes.

实际验证总览：主代理执行 **147 项测试通过**；独立审查执行 **24 个完整浏览器状态、7 项集成检查**，最后仅触控 CSS 改动另测 **4 个状态**；视觉审查覆盖 320px 两语言触控复查；**7,314 个本体基线文件**保持不变。接近 5 MiB 的 90 条记录备份实际导出、回导后哈希相同。

Executed verification: **147 tests passed** by the coordinating agent; the independent reviewer checked **24 complete browser states and seven integration cases**, followed by **four focused states** for the final touch-control CSS change. Visual review included 320px bilingual touch controls. All **7,314 core baseline files** remain unchanged. A 90-record backup near the 5 MiB limit exported and reimported with an identical hash.

机器证据 / Machine-readable evidence: [independent connection review](../evidence/connections-review.json), [public static package](../evidence/static-package-0.2.json), [hosting and source provenance](../evidence/hosting-0.2.json). Visual findings and actual repairs: [concept-to-production ledger](design/connections-fidelity-ledger.md).
