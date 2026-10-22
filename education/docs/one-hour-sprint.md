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

0.2 静态交付链接：[`education-static-v0.2.0.zip`](https://github.com/Lightmaze/Math-Island/archive/refs/tags/education-static-v0.2.0.zip)。本轮最终打包、上传与发布链接核验由主代理完成，并在此追加实际结果；此链接的列出本身不代表已经核验发布成功。

0.2 static delivery link: [`education-static-v0.2.0.zip`](https://github.com/Lightmaze/Math-Island/archive/refs/tags/education-static-v0.2.0.zip). The coordinating agent will append actual packaging, upload and publication checks. Listing the target link is not itself evidence that publication has succeeded.

现有 Sites 入口为 [数学群岛](https://mathcups-mathematical-islands.ljie5996.chatgpt.site)，当前仅创建者可访问；GitHub Pages 尚未启用。本节不声明该入口已更新为 0.2。公开教学可自行部署静态成品。既有托管限制见[部署记录](deployment.md)。

The existing [Sites entry](https://mathcups-mathematical-islands.ljie5996.chatgpt.site) is currently owner-private; GitHub Pages is not enabled. This section does not assert that the hosted entry already serves 0.2. Public teaching can use a self-hosted static artifact. See the existing [deployment record](deployment.md) for hosting limitations.
