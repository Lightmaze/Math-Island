# 教育模块交付 / Education delivery

[打开数学群岛 / Open the archipelago](https://mathcups-mathematical-islands.ljie5996.chatgpt.site) · [公开静态包 / Public static package](https://github.com/Lightmaze/Math-Island/archive/refs/tags/education-static-v0.1.0.zip) · [源码 / Source](https://github.com/Lightmaze/Math-Island/tree/main/education)

交付版本：教育模块 **0.1.0**。本体数据版本继续独立维护。托管入口当前仅创建者可访问；源码和无需编译的静态成品公开。GitHub Pages 创建遭遇连接权限403，未声称其预期网址已经上线。

Education version **0.1.0** is independent of the core dataset release. The hosted entry is currently owner-private; source and ready-to-serve static files are public. GitHub Pages creation was denied by the integration's permission boundary, so its expected URL is not presented as live.

## 已交付的内容 / Delivered scope

| 内容 / Capability | 实际范围 / Actual coverage |
| --- | --- |
| 对象生态 / Object habitats | 24种独立地貌，覆盖12个教学领域；景观表达结构、运算、不变量与局部/整体关系。24 distinct terrains across 12 teaching areas, organized around structure, operations and invariants. |
| 数学实验 / Laboratories | 24个参数化或离散模型，包括椭圆曲线、有限域、层、同调、素谱、热流、离散谱、最优输运等。Each records its assumptions, observable behavior and limits. |
| 教学 / Teaching | 双语对象定义、3步探索、问题/解释、反例/边界、先修与进阶、来源；4条学习路线、教师指南及高级读书活动。Bilingual lessons, four itineraries and teacher guides. |
| 本体入口 / Core access | 21,741个来源条目、46,812条带类型关系；21座既有文献桥的机制、条件、结论与限制。Source identities, coordinates and evidence remain intact. |
| 使用 / Interaction | 检索、领域筛选、拖动/缩放、键盘与列表入口、手机布局、图形放大/数据表、可分享状态、PNG导出。Search, navigation and readable alternatives. |
| 航记 / Field notes | 浏览器本地保存；JSON备份/导入、Markdown导出、同岛冲突按时间合并、未知课程记录保留。No application backend or core write path. |

**24是经过编写和复核的课程数，21,741是来源条目数。** 没有把数万个来源条目冒充数万个已完成生态课程。当前来源约68%来自Stacks；领域覆盖并不均匀。文献桥属于既有研究，不是本轮发现的新定理。景观位置不度量数学价值、难度或逻辑距离。

**Twenty-four authored lessons and 21,741 source entries are separate counts.** The source snapshot is strongly weighted toward Stacks. Literature bridges are established work, and scenic proximity is not a proof relation or a measure of importance.

## 本体独立性 / Core independence

新增和修改均位于`education/`。网站部署在独立分支与独立Sites项目。本体由只读导出器产生带输入哈希的快照；教育图面、学习路线和笔记不写回节点、边、坐标或渐进类型标注。

相对最新上游`0b56806`，原有7,314文件通过逐项SHA-256与Git blob核验。开发中用户另行提交了根README的名称修正；该修改完整保留，原始基线也保留以供追溯。交付基线不是阻止本体成长的永久门禁。

All education changes stay under `education/`. The deployment branch and Site are separate. Read-only projections preserve core IDs, coordinates and relationships. All 7,314 pre-existing files match the publication upstream, including its legitimate README correction. Version-specific audits do not freeze future core development.

## 验证与归属 / Verification and responsibility

| 实际执行 / Executed check | 结果 / Result |
| --- | --- |
| 数学模型、课程/图谱契约、状态 / Model, contract and state tests |93/93通过 |
|24课×2语言×2视口 / Laboratory configurations |96/96通过 |
| 导航、笔记、故障和图谱 / End-to-end groups |20/20通过 |
| 自动无障碍状态 / Automated axe states |112/112通过，零自动规则违规 |
| 最终语义定点复查 / Focused final semantics |16/16通过 |
| 缓存与失败恢复 / Cache and recovery |3载荷ETag重验证；边请求503后检索可用、重试恢复 |
| 本体发布基线 / Publication baseline |7,314/7,314通过 |
| 公开分发 / Public distribution |新下载ZIP的27载荷哈希与完整文件集通过；4个语言/屏宽配置×5场景通过，零资源错误 |
| 托管 / Hosting |Sites原生部署结果`succeeded`；GitHub Pages未启用 |

完整浏览器扫描与最终语义/缓存修正使用的构建哈希分开记录，没有把前一构建的全量扫描改写成后一构建重新跑过。自动无障碍扫描不等于完整WCAG认证；有限模型和测试不等于形式化证明；本轮未重新审读21座桥的全部原始证明。Sites登录门后的页面没有另行操控。

Full-suite and focused-final-build hashes are recorded separately. Automated accessibility results are not full WCAG certification; finite models are not formal proof certificates. The private authenticated Site was not separately browser-tested.

执行分工：主代理负责总体目标、界面集成、状态/笔记、视觉复看、Git整合与发布；`education_curriculum`负责课程和教师指南；`education_labs`负责16个模型；`education_advanced`负责8个高级模型；`education_atlas`负责投影、全图和桥；`education_art`负责对象地貌与视觉证据；`education_review`独立复核数学、数据契约、浏览器、隔离与公开包。

The parent integrated and published the application. Six named sub-agents authored curriculum, base models, advanced models, atlas projection/browser, art, and independent review respectively. The review is attributed to its actual executor.

证据入口：[独立审查](review.md)、[机器结果](../evidence/review.json)、[静态包验证](../evidence/static-package.json)、[托管结果](../evidence/hosting.json)、[实际视觉比较](design/visual-fidelity-ledger.md)、[三小时目标对照](three-hour-goal.md)、[部署与重建](deployment.md)。
