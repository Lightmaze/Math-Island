# 数学岛屿教育航海图 · Curriculum and interpretation contract

本模块为本体数学图谱增加一个可独立成长的教育解释层。当前人工编写了 **24 座双语教学岛屿、24 个对应实验、12 个教学领域**。每座岛以自身的数学对象、操作和约束构造生态。21,741 条核心记录仍是来源索引，不能据此声称它们已有 21,741 套课程。

This module adds an independently maintainable educational interpretation layer to the mathematical atlas. It currently contains **24 authored bilingual islands, 24 corresponding laboratories, and 12 teaching domains**. Each habitat is built around its own mathematical objects, operations, and constraints. The 21,741 core records remain a source-indexed corpus; they are not 21,741 authored lessons.

课程数据的唯一编辑入口是 [`../src/data/islands.ts`](../src/data/islands.ts)。每座岛的来源链接、三个学习步骤、反思题与答案、适用边界及后续研究入口都存放在那里。文档说明选题与检查契约，不另造一份可能失同步的完整课程副本。

The canonical lesson content lives in [`../src/data/islands.ts`](../src/data/islands.ts): source links, three learning steps, a reflection question and answer, boundaries, and further study. This document explains the editorial and checking contract rather than maintaining a second copy of every lesson.

## 1. 与本体图谱的接口 / Interface with the core atlas

- `id` 是稳定的教育层标识。`coreId` 是真实核心记录的主引用；`coreRefs` 是阅读引用，不声明证明依赖或新增核心图边。
- `domain` 与 `(x,y)` 服务于教学导航。它们不覆盖核心条目的领域、坐标、布局、来源或类型标注。
- `labKey` 指向数学对象匹配的实验。理想、素谱、层、运输、热方程和谱分别有专用模型，不由一个通用小例子代替。
- 访问、学习进度、实验状态和导出属于教育层。教学记录不能写回数学结论、证明状态或核心质量记录。
- `level` 是讲解层次：`explore` 从可操作对象进入，`structure` 追踪结构与不变量，`frontier` 明确接向较深理论。它不是数学价值、人的能力、猜想可解性或研究重要性的排序。

The stable educational `id` is distinct from the source `coreId`. `coreRefs` are reading references, not asserted proof dependencies. Teaching domains and positions organize navigation without reclassifying or relocating the core graph. Laboratory, journal, and progress state belong to the education layer. The three level labels describe the depth of this particular explanation, not the value of a topic or the ability of a learner.

本轮使用的核心快照：

| 项目 / Item | 值 / Value |
|---|---|
| 基线提交 / Baseline commit | `66751e9d9b0e661ec06c4b60c61c9204972917b6` |
| 核心记录 / Core records | 21,741 |
| 核心边 / Core edges | 46,812 |
| `data/nodes.jsonl` SHA-256 | `4f146b824e4cce0f3b8e47e1c756557124c5075288fdf8cd7db0145a879abce1` |
| 本批课程主引用 / Primary lesson references | 24 |
| 唯一核心阅读引用 / Distinct core reading references | 51 |
| 每教学领域课程数 / Lessons per teaching domain | 2 |

核心保护检查由 [`../scripts/verify_core.py`](../scripts/verify_core.py) 与 [`core-baseline.json`](core-baseline.json) 记录。该检查验证文件完整性，不证明文件中的每个数学命题。

Core integrity is checked against the recorded file baseline. File integrity establishes that the corpus was preserved; it does not establish the correctness of every mathematical statement in that corpus.

## 2. 生态的语义 / What an ecology means

每座岛必须同时回答三个问题：**画出的实体是什么数学对象；用户改变什么数学量；在哪些条件下能解释观察结果。** 海岸、山脊、林地等名称提供记忆入口，不能成为数学论证的依据。

Every island must identify three things: **which mathematical objects the marks represent, which mathematical quantities an action changes, and which assumptions justify an interpretation**. Ecological names support memory; their visual resemblance is not mathematical evidence.

| 表现层 / Presentation | 数学责任 / Mathematical obligation | 例子 / Example |
|---|---|---|
| 实体 / Entity | 标明对象及其表示 / Identify the object and representation | 同调洞窟的面是二维单形；有限域网格的位置是元素标签，不是欧氏域距离。 / Faces are 2-simplices; finite-field grid positions label elements, not a Euclidean metric. |
| 动作 / Action | 连接到真实运算 / Connect to an actual operation | 理想的和通过 gcd 计算；梯度脚印由指定迭代公式产生。 / Ideal sums use gcd; gradient footsteps follow the stated update rule. |
| 读数 / Measurement | 指定量、单位或尺度 / Specify the quantity and scale | 运输通道宽度表示质量；离散谱注明是否包含网格因子 h⁻²。 / Transport widths represent mass; the spectrum states its grid scaling. |
| 状态变化 / Change | 说明条件和失败情况 / Explain conditions and failure | 三次曲线判别式为零时不能继续套用非奇异椭圆曲线群规则。 / A singular cubic does not satisfy the nonsingular elliptic-curve group hypotheses. |
| 延伸 / Continuation | 区分已实现与后续理论 / Separate implementation from further theory | K₄ 的图拟阵通向一般拟阵与 Hodge 理论；屏幕没有实现完整 Chow 环。 / A graphic matroid leads toward general matroids and Hodge theory; a full Chow ring is not implemented. |

教学目标不是让每个岛都像同一张地图卡片。素谱显示素理想点与开集，同调显示链和边界，覆盖显示提升路径，类型显示推导的前提，运输显示保持边际的计划。共享界面只承担导航、语言切换和可访问性，不替代对象自己的结构。

The habitats are intentionally different: spectra expose prime points and opens; homology exposes chains and boundaries; coverings expose lifted paths; types expose premises of inference; transport exposes plans with fixed marginals. Shared controls support navigation and accessibility while the mathematical structures remain distinct.

## 3. 24 座岛的交叉索引 / Crosswalk of the 24 islands

下表明确区分教学领域和核心领域。核心领域来自原有索引的粗分组；例如 `pm:Ideal` 在核心中暂归几何与拓扑，教育层按本课内容放入交换代数。**11 座岛的两种分组不同，这是显式教学选择，不是静默修改核心分类。**

The table distinguishes teaching domains from the core corpus's provisional source grouping. Eleven lessons use a different teaching group. This is an explicit instructional decision, not a silent edit to the core classification.

| 教育 ID / Educational ID | 岛屿 / Island | 教学领域 / Teaching domain | 核心领域 / Core domain | 主引用 / Primary reference | 实验 / Lab |
|---|---|---|---|---|---|
| prime-reef | 素数礁 / Prime Reef | 数论与算术 | 数论与算术 | `pm:SieveOfEratosthenes` | `sieve` |
| elliptic-garden | 椭圆曲线园 / Elliptic Garden | 数论与算术 | 数论与算术 | `pm:EllipticCurve` | `elliptic` |
| symmetry-grove | 对称林 / Symmetry Grove | 代数与结构 | 代数与结构 | `pm:DihedralGroup` | `group` |
| finite-field-atoll | 有限域环礁 / Finite-field Atoll | 代数与结构 | 代数与结构 | `pm:FiniteField` | `finitefield` |
| ideal-basin | 理想沉积湾 / Ideal Basin | 交换代数 | 几何与拓扑 | `pm:Ideal` | `ideal` |
| spectrum-marsh | 素谱湿地 / Spectrum Marsh | 交换代数 | 交换代数 | `stacks:00DZ` | `spectrum` |
| zero-set-peaks | 零点群峰 / Zero-set Peaks | 代数几何 | 几何与拓扑 | `pm:AlgebraicSetsAndPolynomialIdeals` | `algebraiccurve` |
| sheaf-canopy | 层的云冠 / Sheaf Canopy | 代数几何 | 几何与拓扑 | `pm:Sheaf` | `sheaf` |
| homology-cavern | 同调洞窟 / Homology Caverns | 范畴与同调 | 代数与结构 | `pm:HomologyOfAChainComplex` | `homology` |
| functor-harbor | 函子港 / Functor Harbor | 范畴与同调 | 代数与结构 | `pm:Functor` | `category` |
| covering-terraces | 覆盖梯田 / Covering Terraces | 几何与拓扑 | 几何与拓扑 | `pm:CoveringSpace` | `topology` |
| curvature-ridge | 曲率山脊 / Curvature Ridge | 几何与拓扑 | 几何与拓扑 | `pm:GaussianCurvature` | `geometry` |
| fourier-tide | 傅里叶潮汐 / Fourier Tide | 分析与微分方程 | 分析与微分方程 | `pm:FourierSeriesOfFunctionOfBoundedVariation` | `fourier` |
| complex-current | 复流海峡 / Complex Current | 分析与微分方程 | 代数与结构 | `pm:ComplexNumber` | `complex` |
| brownian-delta | 布朗三角洲 / Brownian Delta | 概率与统计 | 概率与统计 | `pm:BrownianMotion` | `probability` |
| mean-tide | 均值潮汐 / Mean Tide | 概率与统计 | 概率与统计 | `pm:StrongLawOfLargeNumbers` | `lln` |
| graph-bridges | 图的桥群 / Graph Bridges | 离散与计算 | 离散与计算 | `pm:Graph` | `graph` |
| matroid-forest | 拟阵森林 / Matroid Forest | 离散与计算 | 离散与计算 | `pm:Matroid` | `matroid` |
| type-observatory | 类型观测台 / Type Observatory | 逻辑与基础 | 逻辑与基础 | `wikipedia:Type_theory` | `logic` |
| cantor-coast | Cantor 海岸 / Cantor Coast | 逻辑与基础 | 分析与微分方程 | `pm:CantorSet` | `fractal` |
| gradient-basin | 梯度盆地 / Gradient Basin | 数值与优化 | 分析与微分方程 | `pm:GradientSystem` | `optimization` |
| transport-sandbar | 运输沙洲 / Transport Sandbar | 数值与优化 | 分析与微分方程 | `wikipedia:Optimal_transport` | `transport` |
| heat-shore | 热流海岸 / Heat Shore | 数学物理与应用 | 分析与微分方程 | `pm:HeatEquation` | `heat` |
| spectral-lighthouse | 本征态灯塔 / Spectral Lighthouse | 数学物理与应用 | 数值与优化 | `pm:EigenvalueofAMatrix` | `spectral` |

这里的覆盖是有意选择的广度样本，绝不代表数学工具的完整分类。它包含消去与筛选、对称运算、有限域编码、理想运算、空间化、局部胶合、链与商、函子、提升、不变量、频率分解、随机过程、极限、图搜索、独立性公理、类型推导、优化、运输与谱。每一种都保留了超出当前屏幕的后续数学内容。

This is a broad curated sample, not a complete taxonomy of mathematical tools. It includes elimination and sieving, symmetry, coding, ideal operations, spatialization, gluing, chains and quotients, functors, lifting, invariants, frequency decomposition, stochastic processes, limits, graph search, independence axioms, type inference, optimization, transport, and spectra. Each has a continuation beyond the displayed model.

## 4. 已实现观察窗口的条件 / Conditions of the implemented windows

| 实验 / Lab | 精确窗口 / Precise window | 不能从屏幕推出的结论 / What the display does not establish |
|---|---|---|
| `sieve` | 有限整数区间的 Eratosthenes 筛，保留 p，从 p² 筛除。 / Eratosthenes on a finite interval, retaining p and marking from p². | 不是所有现代筛法的实现；二次筛用于因数分解。 / Not an implementation of all modern sieves; the quadratic sieve is for factorization. |
| `elliptic` | y²=x³−x+1 的割线、切线、互逆预设；另列奇异曲线 y²=x³。 / Secant, tangent and inverse presets on y²=x³−x+1, with y²=x³ as a singular comparison. | 一张实仿射图不是一般域上的椭圆曲线理论或模性证明。 / A real affine plot is not general-field theory or a modularity proof. |
| `group` | 正方形的八个对称，记为 D₄；复合从右向左作用。 / The eight square symmetries, denoted D₄; composition acts right to left. | 八个对称不等于顶点的全部 4! 个排列。 / Eight symmetries are not all 4! vertex permutations. |
| `finitefield` | p∈{5,7,11}，次数小于 3，三个互异且正确的取值恢复。 / p∈{5,7,11}, degree below 3, recovery from three distinct correct values. | 是擦除恢复窗口；没有承诺任意错误纠正，也没有构造所有素数幂域。 / Erasure recovery, not arbitrary error correction or all prime-power fields. |
| `ideal` | Z 中 (m)+(n)=(gcd(m,n))，(m)∩(n)=(lcm(m,n))。 / Principal ideals in Z with gcd sums and lcm intersections. | 有限倍数图不把无限理想变成有限集合；并集通常不是和。 / A bounded plot does not make an ideal finite; union is generally not ideal sum. |
| `spectrum` | n∈{6,8,12,30}，素点 p∣n，D(f)={p:p∤f}。 / Prime points dividing n and their basic opens D(f). | 该有限谱的拓扑是离散的；不能当作一般 Zariski 拓扑，也不能仅由点数恢复环。 / These finite spectra are discrete; they do not model all Zariski spaces or recover the ring from point count. |
| `algebraiccurve` | 实圆、xy=c、y²=x³+ax+b；以方程和偏导检查奇点。 / Real circles, xy=c, and short-Weierstrass cubics; singularity conditions from equations and derivatives. | 实图采样会遗漏离屏或未解析结构；Nullstellensatz 的代数闭域条件不能省略。 / Real sampling can miss features; the algebraically closed-field hypotheses of the Nullstellensatz remain essential. |
| `sheaf` | U=(−3,1)、V=(−1,3) 上一次函数，在整个交集上一致后胶合。 / Affine local functions on two overlapping real intervals, glued only when they agree throughout the overlap. | 这是连续函数层的局部截面例子，不把“所有开集上只允许同一条全局直线”的赋值误称为一般层。 / These are local sections of the continuous-function sheaf, not a claim that an unrestricted global-affine assignment is a sheaf. |
| `homology` | 有限三角复形、F₂ 系数、边界矩阵秩、β₀ 与 β₁。 / Finite simplicial complexes over F₂, boundary-matrix ranks, β₀ and β₁. | 图上闭环可能是边界；没有展示整数系数的挠性。 / A visible cycle may bound; integer torsion is not represented. |
| `category` | 有限全序作为范畴；有限集合方块逐点检查交换。 / Finite orders as categories and exhaustive checks of a finite-set square. | 相同源靶不保证交换；此窗口没有实现一般范畴中的所有函子。 / Common endpoints do not imply commutativity; the window does not implement every general functor. |
| `topology` | p:S¹→S¹，p(z)=zⁿ，起点固定为 1，积累角度给出路径提升。 / Circle coverings with a fixed starting lift and accumulated angle. | 底空间闭路的提升不一定闭合；覆盖空间分类另有拓扑条件。 / A loop downstairs need not lift to a loop; classification requires further hypotheses. |
| `geometry` | 四面体、八面体、环面三角网格的 δ(v)=2π−Σθ，总和 2πχ。 / Vertex angle defects on closed triangular meshes, summing to 2πχ. | 不是任意光滑曲面的数值证明；有边界需补边界项。 / Not a numerical proof for arbitrary smooth surfaces; boundaries require boundary terms. |
| `fourier` | 周期方波的前 N 个奇次谐波，N=1,…,25。 / The first N odd harmonics of a periodic square wave. | 有限截断不等于无限级数；Gibbs 相对超调不会消失。 / A truncation is not the full series; relative Gibbs overshoot persists. |
| `complex` | z↦ρeⁱθz，旋转与伸缩，另显式处理 ρ=0。 / Complex multiplication as rotation and scaling, including collapse at ρ=0. | 不能由常系数乘法直接断言所有复函数都保角。 / Constant multiplication does not establish conformality of arbitrary complex functions. |
| `probability` | 固定种子的正态增量模拟；16/64/256 步和多条路径。 / Seeded normal-increment simulations at several mesh sizes. | 折线不是理论上无处可微的连续路径；±2√t 是逐时刻尺度，不是整条路径的保证带。 / A polygonal sample is not the theoretical path; ±2√t is pointwise, not a simultaneous path guarantee. |
| `lln` | Bernoulli(p) 的固定种子有限样本均值。 / Seeded finite running means of Bernoulli(p) samples. | 实验不是几乎处处收敛的证明；误差不必单调减小。 / Simulation does not prove almost-sure convergence; errors need not decrease monotonically. |
| `graph` | 同一八顶点非负权图，比较 BFS 与 Dijkstra。 / BFS and Dijkstra on the same eight-vertex graph with nonnegative costs. | BFS 最少边数一般不等于最小总权；等非负权是保证二者一致的充分条件。 / Fewest edges need not minimize total cost; equal nonnegative weights suffice for agreement. |
| `matroid` | K₄ 图拟阵，森林独立，r(A)=4−c(A)，孤立顶点计入。 / The graphic matroid of K₄, with forest independence and all components counted. | 不是每个拟阵都可由图表示；视觉交叉不是额外顶点。 / Not every matroid is graphic; crossings in a drawing are not vertices. |
| `logic` | 上下文 Γ 中简单箭头类型的应用与组合规则。 / Arrow-type application and composition under assumptions in Γ. | 局部规则可用不代表任意类型已有闭项；没有实现依赖类型或通用证明器。 / An admissible local rule does not inhabit arbitrary types; dependent typing and a general prover are not implemented. |
| `fractal` | Cantor 中间三分之一构造第 0…6 层；2ⁿ 个区间，总长 (2/3)ⁿ。 / Finite Cantor stages, with exact interval counts and total lengths. | 每一有限层仍包含区间；零测度、不可数及 log2/log3 维数属于无限极限。 / Finite stages contain intervals; measure zero, uncountability and the fractal dimension concern the infinite limit. |
| `optimization` | f=(λx²+y²)/2，λ≥1，固定步长；稳定条件 0<η<2/λ。 / A positive-definite quadratic with a stated fixed-step stability condition. | 连续梯度流的下降不能给任意离散步长担保。 / Continuous gradient-flow descent does not justify arbitrary discrete steps. |
| `transport` | 一维、相同总质量、成本 ∣x−y∣ 的单调耦合。 / Monotone coupling in one dimension, with equal total mass and absolute-distance cost. | 最优计划可以不唯一；不能把该算法搬到任意高维成本问题。 / Optimal plans may be nonunique; this is not a solver for arbitrary high-dimensional costs. |
| `heat` | 2π 周期，u=e⁻ᵗ sin x+a e⁻⁹ᵗ sin 3x 的解析解。 / An exact two-mode solution of the periodic heat equation. | 图中负值是温度偏差；不同边界和非线性方程需要其他论证。 / Negative values are deviations; other boundaries or nonlinear equations need other arguments. |
| `spectral` | N=4,…,12 的未缩放 Dirichlet 三对角矩阵，λₖ=2−2cos(kπ/(N+1))。 / An unscaled finite Dirichlet tridiagonal matrix with its exact sine eigenpairs. | 连续极限需 h⁻² 缩放；一般无界自伴算子不保证纯离散谱，定义域不可省。 / A continuum limit needs h⁻² scaling; general unbounded self-adjoint operators need not have pure point spectrum and require domains. |

## 5. 学习动作与反思 / Learning actions and reflection

每座岛都有三个内容相关的步骤，而不是统一的“观察—点击—完成”任务。学习者应当能从中完成如下链条：**确定对象与条件 → 操作并记录变化 → 用规则解释结果或构造反例**。这是一条教学顺序，不是核心命题间的证明依赖。

Every island has three topic-specific steps. They should let a learner identify objects and assumptions, manipulate them and record a change, then explain the result or give a counterexample. This is an instructional order, not a dependency claim between core theorems.

反思题必须允许明确否定错误断言。例如：

- `ideal-basin`：2=6−4 是 `(4)+(6)` 中但不在 `(4)∪(6)` 中的见证。
- `matroid-forest`：K₄ 的三角形有三条边，但秩是 2；孤立的第四个顶点仍计入分量。
- `mean-tide`：20 次中成功 10 次后再成功一次，均值从 1/2 变成 11/21，误差增大而不违反大数定律。
- `gradient-basin`：λ=4、η=0.6 时，从 x=1 更新到 −1.4，凸性没有阻止不稳定步长。
- `sheaf-canopy`：x 与 −x 在一个点相等，不等于在整个重叠开区间上相等。

Reflection questions must expose a falsifiable claim. A counterexample can be a missing ideal-sum element, a dependent triangle, a temporary increase in sample-mean error, an unstable gradient step, or a failed equality on an overlap. The answer must explain the mechanism rather than merely report “incorrect.”

有些反思题故意离开当前允许的滑块值，例如模 6 不是域。它们是课程中的书面反例，不宣称界面提供了对应控件。相反，正文里的操作步骤必须与真实可用控件一致。比较未展示的系数、点击不存在的顶点等操作不应进入步骤。

Some reflection questions deliberately test a case outside the available controls, such as arithmetic modulo 6. These are written counterexamples, not claims that the interface includes those controls. Operational steps, in contrast, must match controls actually available in the lab.

## 6. 来源与数学审读 / Sources and mathematical review

24 个主引用与全部 51 个不同的 `coreRefs` 均从现有 `data/nodes.jsonl` 解析。主来源链接沿用核心记录的 `source_url` 或其 `source_urls`，保留原始标识、来源文件与可追溯哈希。这里的来源状态仍是“索引到来源”，没有升级为“形式化认证”。

All 24 primary references and 51 distinct core reading references resolve to existing records. Primary source links follow those records, preserving identifiers and provenance. Being indexed and cited is not a claim of formal verification.

课程可以增补核心暂未收录的真实文献。当前拟阵延伸额外引用 Adiprasito、Huh、Katz 的 [Hodge theory for combinatorial geometries](https://arxiv.org/abs/1511.02888)。它支持从拟阵到 Chow 环与 Hodge 理论的进阶入口，并且已有核心文献桥 `edge:d306509566dd437c3f`（`pm:HodgeTheory`→`pm:Matroid`，`bridge:003`）把该论文作为证据。没有为这篇论文虚构核心节点或依赖边。引用检查保证主引用可追溯，也允许这种已有文献桥的证据 URL。

Lessons may cite genuine additional literature not yet present in the corpus. The matroid continuation cites Adiprasito–Huh–Katz as an additional primary paper. It is already the evidence URL of the recorded literature bridge `edge:d306509566dd437c3f`, from Hodge theory to matroids. This does not manufacture a core node or edge. The reference contract validates primary provenance and permits this existing bridge evidence.

本轮读过相关来源的定义、陈述或局部正文，并针对课程公式、条件、反例和当前控件做了审读。没有逐条证明所有引用文章的全部内容。已看到的来源问题在教育层保持透明：

| 来源 / Source | 观察到的问题 / Observed issue | 本课处理 / Lesson treatment |
|---|---|---|
| `pm:SieveOfEratosthenes` | 原步骤把 p 本身列在划去的倍数中；现代二次筛的用途也需区分。 / Its listed multiples include p itself; the role of the quadratic sieve also needs separation. | 保留 p，从 p² 开始；延伸中区分列素数与整数分解。 / Retain p, start at p², and separate prime enumeration from factorization. |
| `pm:DihedralGroup` | 文中称有限二面体群为秩 1 Coxeter 群；通常的二面体反射系统为秩 2。 / It calls the dihedral reflection group rank 1; the standard dihedral Coxeter system has rank 2. | 本课只使用核对过的八个对称及复合关系，不传递该秩断言。 / Use the checked eight symmetries and composition relations without repeating the rank claim. |
| `pm:EigenvalueProblem`（未选为主引用） / not selected as the primary reference | 过宽地把自伴性和离散本征基联系起来。 / An overbroad association of self-adjointness with a discrete eigenbasis. | 主引用改为有限矩阵本征值定义；实验明确有限维、Dirichlet 边界和尺度。 / Use the finite-matrix definition and explicit finite dimension, boundary conditions, and scale. |
| Dijkstra 的核心来源质量记录 / Dijkstra source quality finding | 记录中已保留非负边权条件缺失的问题；其 canonical ID 与修订后标题不直观对应。 / A missing nonnegative-weight hypothesis is already recorded; the preserved canonical ID is unintuitive. | 保留真实 ID，课程明确非负权，不因标题难读而制造新 ID。 / Preserve the real ID and state nonnegative weights rather than inventing a replacement identifier. |

上述差异不修改原始核心文件。进一步发现来源错误时，应另行提交带定位和证据的核心校勘提案；教育内容仍可在自身范围内写出正确条件。

These observations do not modify core source files. A future corpus correction should carry a location and evidence through a separate editorial change; the education layer can already state the correct conditions within its scope.

## 7. 扩展与验收 / Extension and acceptance

增加一座岛时，先确定具有独特教学意义的数学对象，再选择来源与实验。至少完成以下可复查工作：

1. 验证主 `coreId` 和全部 `coreRefs` 确实存在；记录所用快照，保留精确 ID。独立文献单独链接。
2. 明确对象、允许操作、约束和不变量，说明实验与一般理论之间的距离。
3. 编写中英对照的简介、先修知识、三个步骤、一个可证伪反思题及答案、边界和进阶延伸。
4. 检查每条操作对应实际控件。若只有理论延伸，就把它放进 `continuation`，不写成已实现能力。
5. 用有鉴别力的反例或不变量核对数学实现。例如验证 ∂₁∂₂=0、运输边际、有限域插值唯一性、类型不匹配拒绝或梯度稳定边界。
6. 检查教育领域、视觉生态与源领域的关系，确保所有改动留在教育层。
7. 与至少一次独立审读交叉核对内容、语言和交互，再把课程加入导航。

For each additional island: resolve its references; state the object, operations, assumptions and invariants; write all bilingual fields; align steps with real controls; test a discriminating counterexample or invariant; preserve the source/teaching distinction; and obtain an independent content-and-interaction review. Extensions should broaden mathematical coverage through meaningful objects, not inflate lesson counts by generating decorative variants.

本批结构验收包括 24 个唯一 ID、24 个匹配实验键、12 个领域各两课、全部双语字段非空、每课恰好三个步骤、所有核心引用可解析，以及教学坐标落在独立的 0…100 范围。结构检查通过只是内容完整性的必要条件；数学模型测试、视觉审查、交互审查和核心完整性检查分别提供不同证据。

The structural acceptance checks cover 24 unique IDs, 24 matched laboratory keys, two lessons in each of 12 domains, nonempty bilingual fields, exactly three steps per lesson, resolvable core references, and independent teaching coordinates in 0…100. Structural validity is only one kind of evidence. Mathematical model tests, visual review, interaction review, and core-integrity checks answer different questions.

本批课程在 2026-10-22 完成以下核对：360 个双语字段对均非空；24 个主来源 URL 与核心记录相符；51 个不同核心引用全部可解析；文档表格结构检查通过；理想和、素谱点数、49 的筛除、均值反摆、梯度发散及拟阵秩的所列反例复算通过。独立审读已据实验控件纠正椭圆预设、有限域取值比较、曲率顶点观察和生态中的视觉量说明。`npm test -- --run tests/education-contract.test.ts` 的 14 项契约测试通过。这些结果不包含对所有来源定理的形式化证明，也不替代整个应用的交互与视觉验收。

For this batch, the 2026-10-22 checks confirmed 360 nonempty bilingual field pairs, 24 matching primary source URLs, 51 resolvable distinct core references, valid documentation tables, and recomputed counterexamples for ideals, spectrum points, sieving, running means, gradient stability and matroid rank. Independent review corrected control descriptions and visual encodings. All 14 tests in `tests/education-contract.test.ts` passed. This record is scoped to the curriculum contract, not formal proofs of every cited theorem or acceptance of the entire application.
