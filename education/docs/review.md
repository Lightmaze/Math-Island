# 教育模块独立复核 / Independent education review

执行者：子代理 **`/root/education_review`**。主代理负责集成、提交和发布。本记录分别列出代码阅读、机器校验、真实浏览器操作和人工图面复核，不把子代理工作署名为主代理独立完成。

Reviewer: the **`/root/education_review` sub-agent**. The parent owns integration and publication. Source inspection, automated checks, browser actions and visual review are distinguished.

截至 2026-10-22，生产构建通过 **93 项测试、96 个实验配置、20 组端到端检查和112个 axe 状态检查**。待完成：命名控件组的语义定点复查，以及整合上游 README 修正后的发布基线审计。详见[机器证据](../evidence/review.json)。

The production build passed **93 tests, 96 lesson configurations, 20 end-to-end checks, and 112 automated axe states**. Pending: focused semantic-group checks and the post-rebase publication-baseline audit. See the [machine-readable evidence](../evidence/review.json).

## 两个明确的核心基线 / Two explicit core baselines

| 基线 / Baseline | 提交 / Commit | 已执行结果 / Executed result |
| --- | --- | --- |
| 原始任务 / Original task | `66751e9d9b0e661ec06c4b60c61c9204972917b6` | 整合上游前7,314/7,314文件通过 / All 7,314 files passed before upstream integration |
| 发布上游 / Publication upstream | `0b56806abb61fe06f7f63481c2008adad646a3af` | 重放前仅README.md存在预期差异；重放后待查 / Only the expected README difference before rebase; post-rebase audit pending |

开发期间，上游独立将根 README 项目名从 `Mafh` 改为 `Math`。两个实际 Git tree 的文件集合均为7,314项，唯一变化的 blob 是 README.md。[发布基线](publication-base.json)保留未变项，并从新提交的真实 Git blob 计算 README 的 SHA-256；[原始基线](core-baseline.json)原封保留。不能声称整合修正后的 README 仍与原始任务版本逐字节相同。

Upstream independently corrected the root README from `Mafh` to `Math`. Both actual Git trees contain the same 7,314 paths; only that blob differs. The publication baseline preserves the correction while the original baseline remains untouched. The two README versions are **not** claimed to be byte-identical.

[校验器](../scripts/verify_core.py)只读，不恢复文件或更新基线；同时比对清单、明确提交的文件集合和 Git blob。独立临时 Git 仓库中，有效样本通过；改写、缺失、同时篡改文件与清单哈希、删去清单条目四类反例均被拒绝。真实核心未被用作破坏性测试夹具。

两份基线是本轮明确版本的交付审计，**不是冻结本体的永久 CI 门禁**。本体可继续演进，教育模块继续使用旧快照；导入新快照时，由教育模块显式检查并迁移自己的引用。本体无需为24课永久保留当前条目。

Both baselines are **version-specific delivery audits, not permanent core-development gates**. Education can retain a pinned snapshot while the core evolves; an explicit future import must migrate education's own references.

## 只读边界和数据契约 / Read-only boundary and data contracts

检查了导出器路径和客户端读写入口：核心输入只读，导出器仅写 `education/public/data/`；客户端 GET 教育节点、边和文献桥载荷，航记写入浏览器本地存储。没有核心写回接口。屏幕距离、共同主题和教学路线均不新建数学关系。

The exporter reads core files and writes education payloads only. The client fetches those payloads and stores learner notes locally. There is no core write-back endpoint; spatial proximity and editorial itineraries create no mathematical edges.

21项数据/课程契约实际覆盖：

- **21,741节点**：ID、原名、坐标、度数、类别、来源、领域、别名和既有质量注记逐项一致。
- **46,812边**：ID、源、靶、关系、证据URL、定位符、状态、数学有效性八字段，经标准CSV解析后全量比对。
- **21既有文献桥、42双语报告段**：端点、方向、引用、机制、条件、结论、边界、行号与原文段落SHA完整保留；历史审读记录逐字段复制。
- **24课、12教学领域、51不同核心引用**：来源可追溯，双语字段齐全，四条学习路线引用有效。AHK附加论文由既有`bridge:003`的证据支持，没有伪装成已有节点。
- **负例**：非有限坐标、负度数、重复/重排身份、非整数索引、悬空端点、错误快照、自环、重复边、遗漏桥、错误引用、缺少条件、语言报告误归属和非法审读URL均被拒绝。

Source-fidelity tests run when matching pinned inputs are available. If future core inputs differ, these comparisons explicitly skip; education payload, ordering, reference and runtime-validator checks continue. A skip does not certify a different source snapshot.

历史文献审读属于先前记录，本次核对的是忠实复制与展示，**不是本代理重新读完21篇完整证明**。来源内容类别也未被提升为已验证的数学工具形式类型。

## 数学与图面复核 / Mathematical and visual inspection

阅读了24个有限模型的核心公式、前提和反例路径，包括筛法p²起点、D₄、椭圆判别式与无穷远点、素域插值、F₂边界矩阵、累积路径提升、闭三角网格角亏、函子与方块、整数理想、有限素谱、胶合、运输、热流、离散谱、Brownian取样、Bernoulli均值、Cantor阶段、梯度稳定性及类型应用。

| 问题 / Finding | 修复与证据 / Resolution and evidence |
| --- | --- |
| 平行边选中成本1却报告同端点第一边成本10 / Wrong parallel-edge cost | 保存实际父边成本；回归通过 / Chosen parent-edge cost retained; regression passes |
| 数组重排使边错接 / Silent endpoint miswiring | 共享有序ID摘要、严格顺序及负例 / Ordered-ID digest, strict ordering and negative tests |
| 圆与复平面横纵比例失真 / Distorted circles and complex angles | 等比例投影、测试与手机图面复看 / Equal scaling, projection checks and visual review |
| Fourier跳点竖线、椭圆根处假断裂 / Misleading jumps and root gaps | 分段目标、空端点与真实根细化 / Separate intervals and refined real roots |
| 孤立实奇点未进采样模型 / Omitted isolated real singularity | 纳入窗口内真实奇点并去重；残差回归 / Explicit in-window points and residual regressions |
| 课程写了不存在的控件或过强结论 / Curriculum overstatement | 对齐预设、控件、条件与量词 / Wording aligned with actual controls and hypotheses |
| 导入`toString`键被原型继承误判 / Inherited-property import bug | 自有键检查，实际往返测试 / Own-key detection and browser round-trip |
| skip-link干扰hash路由 / Skip-link route collision | 聚焦正文且保留路由 / Explicit focus without route mutation |
| 手机标签小、对比不足 / Small labels and low contrast | 放大图形、数据表、深色文字；图面/axe复查 / Zoom, tables, darker text and rechecks |
| 装饰SVG文本干扰按钮名称 / Decorative text in button naming | 图形与含岛名的按钮分离 / Semantic separation, verified by axe |

教师指南另核对了`√2 B_t`将生成元½Δ匹配到Δ、`e^(−n²t)`衰减、W₁实验与W₂位移凸性区别，以及三个补充工作坊的前提。四条教学路线没有被写成同一对象转换、未命名等价或已完成函子。

These finite-model checks and bounded pedagogical reviews are **not kernel-checked proofs or comprehensive literature certification**. The sourced atlas and authored curriculum remain separately counted.

## 实际浏览器和无障碍检查 / Actual browser and accessibility checks

环境：Chromium **154.0.8037.57**，生产`dist/`的独立临时快照；隔离浏览器上下文；中英文；**1440×1000**桌面与**390×844**手机。脚本关闭自建服务器并清理临时副本。

- **96/96实验配置**：操作所有滑条端点、选项、可用按钮和复选框；展开数据表、放大/恢复图形、键盘切步骤、展开解释；无NaN/Infinity、未命名控件、横向页面溢出或运行错误。
- **20/20端到端检查**：前进/后退、焦点、双语检索、目录、领域、四路线、Canvas键盘、21桥双语正文与分享、真实PNG、笔记持久化/跨页签/确认删除/Markdown与JSON导出、严格导入和完整往返。
- **故障注入**：存储不可用仍能导出内存笔记；损坏缓存恢复为空；超5MB或部分非法导入整体拒绝且不丢已有记录；剪贴板拒绝时提供URL；两语言各阻断实验chunk，错误页仍可导出原航记，恢复后刷新可进入实验。
- **数学结论**：3重覆盖1/2圈不闭合、3圈闭合；K₄三角形秩2且依赖；120以内30素数；椭圆互逆和为O、奇异例拒绝套用光滑群律；类型不匹配不推出结论；不相容截面需修正才能胶合。
- **112/112 axe状态**：24课、地图、全图、展开文献桥、航记×两语言×两宽度，WCAG2A/AA及2.1A/AA自动规则零违规，无规则排除。进一步人工追查了控件组ARIA语义，并复看手机地图、椭圆、复平面图和数据表。

Axe cannot fully decide short mathematical labels, text over SVG/images or every assistive-technology behavior. **Zero automated violations is not full WCAG conformance.** Keyboard and selected visual reviews supplement the scan; no dedicated screen-reader study was performed. Control scans do not exhaust every Cartesian product of parameters.

## 重现 / Reproduce

```sh
cd education
npm ci
npm test
npm run build
npm run test:browser
npm run test:a11y
npm run verify:publication
```

可用`CHROMIUM_PATH`指定浏览器，或`BROWSER_AUDIT_URL`审查部署版。详细临时结果在被Git忽略的`test-results/`；本次执行者、结果和范围持久化在[证据JSON](../evidence/review.json)。整合上游后，`npm run verify:historical-core`预期只对README报告版本差异；不要为了让历史比较通过而回退用户修正。

Use `CHROMIUM_PATH` for a system browser or `BROWSER_AUDIT_URL` for a deployment. Detailed transient results are ignored by Git; review evidence is retained. After upstream integration, the historical comparison should report the README difference; do not undo the user's correction to make it pass.
