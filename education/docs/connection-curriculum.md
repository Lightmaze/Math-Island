# 联岛课程契约 / Connection curriculum

本批新增 **6 个联岛实验**。它们把同一个明确对象的不同表示放在共同状态下，或把一个明确构造的输入与输出同时呈现。它们不同于把两张独立图片排在一起：控件必须改变共享参数，读数必须解释两侧为何联系。六项数据位于 [`../src/data/connections.ts`](../src/data/connections.ts)，不修改 `islands.ts` 或核心节点、边、坐标、来源和类型标注。

This batch adds **six connection experiments**. Each shares a specified mathematical state across representations, or exposes the input and output of a precise construction. Controls change actual shared parameters; computed quantities explain the relationship. The curriculum lives in [`../src/data/connections.ts`](../src/data/connections.ts) without modifying the original island lessons or core graph.

## 数据接口 / Data contract

`ConnectionLesson` 包含稳定 ID、双语标题/简介/对象、真实 `lessonIds` 和 `coreRefs`、关系陈述、三个操作步骤、反思问题及答案、假设、边界与来源。来源逐项记录 URL、定位、实际读取范围、访问日期及取得的 HTTP 状态。`Localized` 复用原有课程的中英结构。

`ConnectionLesson` includes a stable ID, bilingual title/summary/objects, real lesson and core references, a relationship statement, three operational steps, a question and answer, assumptions, boundaries and sources. Source records include URL, locator, actual reading scope, access date and observed HTTP status.

`relation.kind` 的 `identity`、`construction`、`representation`、`correspondence` 是**教育层关系标签**，不是此前渐进类型系统中的正式类型，也不自动建立新的核心证明依赖。本批使用前三种。`coreRefs` 支持追溯阅读对象，不声明列出的任意两节点都有核心图边。

The four `relation.kind` values are **education-layer labels**, not formal types in the prior gradual typing framework or automatically added proof dependencies. This batch uses identity, construction and representation. `coreRefs` trace reading objects; they do not assert edges between every referenced node.

| ID | 关联课程 / Actual lesson IDs | 明确联系 / Precise relationship |
|---|---|---|
| `fourier-heat` | `fourier-tide`, `heat-shore` | 有限周期初值的系数演化与同一个热方程解。 / Modal coefficients and the same finite periodic heat solution. |
| `graph-homology` | `graph-bridges`, `matroid-forest`, `homology-cavern` | K₄ 子复形的边链、边界矩阵和同调商空间。 / Edge chains, boundary matrices and homology of a K₄ subcomplex. |
| `complex-covering` | `complex-current`, `covering-terraces` | 圆周复幂映射和给定起点的连续提升。 / Circle powers and continuous lifting from a chosen start. |
| `transport-cdf` | `transport-sandbar`, `mean-tide` | 一维 W₁ 运输成本与累计分布差面积；均值不能恢复分布。 / One-dimensional W₁ cost and CDF-gap area; a mean does not determine a distribution. |
| `ideal-zeros` | `ideal-basin`, `finite-field-atoll`, `zero-set-peaks` | Fₚ[x] 的 gcd、Bézout 证据及域内共同零点。 / Polynomial gcd, Bézout witness and common field-valued roots. |
| `symmetry-representation` | `symmetry-grove`, `complex-current` | 同一 D₄ 元素的复数作用和二维实矩阵表示。 / The same D₄ element acting through complex formulas and real matrices. |

## 六个可复查活动 / Six checkable activities

### Fourier → heat

设置 `u₀=m+Σₖ₌₁⁴aₖsin(kx)`，让系数乘 `e^(−k²t)`。左侧模态柱与右侧曲线来自同一组参数。课堂可逐项求导验证 PDE，用正交性推出 `E=2πm²+πΣaₖ²e^(−2k²t)`；这对当前有限和是精确恒等式，不需要把数值残差误当证明。均值 m 不衰减，m=0.2 时极限能量为 0.08π。

Set the constant and four sine coefficients, then evolve each mode by `e^(−k²t)`. The bars and curve share parameters. Differentiate the finite sum to verify the PDE and use orthogonality to derive its energy identity. These are exact finite-sum calculations; numerical residuals are not proofs. A nonzero mean persists.

操作范围：t∈[0,1.2]，m∈[−0.5,0.5]，四个系数各在 [−1.5,1.5]。2π 周期、扩散系数 1。这里不是把波动方程变成热，也不是任意初值或边界的求解器。

Controls cover finite ranges for time, mean and four coefficients. The model assumes 2π periodicity and diffusivity 1; it is neither wave-to-heat conversion nor a solver for arbitrary data and boundaries.

### Graph → homology

始终保留四个顶点，允许选择 K₄ 的六条边、四个三角面和一条 1-链。面只有在其边齐全时才可加入。比较 `∂₁z=0` 与 `z∈im∂₂`：前者说明是循环，后者说明同调类为零。用 `β₁=E−rank∂₁−rank∂₂` 解释读数，不能按视觉数洞替代矩阵计算。

Retain four vertices and choose edges, faces and a 1-chain. A face requires all its edges. Distinguish being a cycle from being a boundary, and calculate β₁ from boundary ranks rather than counting visual holes.

全 K₄ 骨架的循环空间维数为 3。四个面全部加入时，面边界之和为零，`rank∂₂=3`；β₁=0，但没有三维单形，β₂=1。这是四面体边界，不是实心四面体。系数为 F₂，不能据此略去整数系数的挠性。

The complete K₄ skeleton has cycle-space dimension 3. With all four faces, their boundaries sum to zero and have rank 3: β₁=0 but β₂=1 because no 3-simplex is present. This is the tetrahedral boundary, not a solid tetrahedron. Coefficients are F₂.

### Complex powers → covering lifts

选 n∈{2,…,8}、起点 k、整数绕数 w∈[−8,8] 与进度 t∈[0,1]。用 `γ̃(t)=exp(2πi(wt+k)/n)` 同时核对连续性与投影公式。完成整条基闭路后，纤维标签变为 `k+w mod n`；只有 n 整除 w 时提升闭合。中途 wt 非整数时不把截断路径称作完成的闭路。

Choose the covering degree, starting fiber point, integer winding and progress. Check the analytic lift both for continuity and its nth-power projection. The full loop permutes fiber labels by addition of w modulo n; intermediate path progress need not be a loop.

反例活动：三重覆盖、k=1、w=1 的终点为标签 2。每圈重置主辐角会丢失分支历史。单位圆上的覆盖不能无条件扩展成包含原点的整个复平面上的无分支覆盖。

Counterexample: n=3, k=1, w=1 ends at fiber label 2. Resetting a principal argument loses the branch history. The unbranched covering statement is about the circle, not the entire plane including zero.

### Transport → CDF area

μ 的位置为 −2、0、2，质量为 `((1−p)/2,p,(1−p)/2)`；ν 的位置整体平移 δ，质量为 `((1−p)(1+b)/2,p,(1−p)(1−b)/2)`。同一对测度进入单调运输和 CDF 面积计算。合并排序全部支撑点后，把每段恒定的 `|Fμ−Fν|` 乘区间宽度并相加，结果应与运输总成本一致。

The source and translated target share a specified three-point family with adjustable central probability and bias. Both the monotone plan and CDF computation use these same measures. Merge and sort support points, multiply each constant CDF gap by its interval width, and compare the area sum with the transport cost.

参数 p=0.5、b=0.5、δ=0.5 给出两边均值均为零但 W₁=0.75 的反例。因此连接均值课程时，应问统计量丢失了什么信息，而不是把这里的测度说成均值课中的 Bernoulli 样本。离散质量可能分拆；不得不加条件地使用单值 Monge 映射。这个面积恒等式不直接推广到高维或 W₂。

At p=0.5, b=0.5, δ=0.5 both means vanish but W₁=0.75. Use Mean Tide to ask what a statistic forgets, not to identify these measures with the Bernoulli sample model. Atomic mass may split; a Monge map requires extra conditions. This area identity is specific to one-dimensional W₁.

### Ideals → common zeros

素数选项为 2、3、5、7、11；多项式输入按低次到高次排列，最多七个整数系数。观察带余除法、首一 gcd 和 `uf+vg=d`。由于 d 整除 f、g，得到 `(f,g)⊆(d)`；又由于 d 是 f、g 的线性组合，得到反向包含。共同根等式也由这两项代数关系推出，不需要伪称已经证明一般零点定理。

Select a supported prime and enter coefficients in ascending degree order. Use divisibility and the Bézout witness to establish both ideal inclusions; the same identities give equality of common-root sets. This is a specific univariate calculation, not a proof of the general Nullstellensatz.

使用 F₃ 预设 `f=x²+1`、`g=(x+1)(x²+1)`：共同域内根为空，但 gcd 非常数，理想仍为真理想。另有重因子预设，表明点集丢失重数。两个零多项式单独处理：d=0 不称首一，零点为全部域元素。

The F₃ preset has no common field-valued root but a nonconstant gcd and proper ideal. A repeated-factor preset shows that point sets lose multiplicity. The all-zero pair is handled separately: d=0 is not called monic and every field element is a zero.

### Symmetry → representation

选择 A、B∈D₄ 和复数测试向量 z。约定 r 为逆时针四分之一转，s 为实轴反射，A∘B 先做 B。比较复数表达 `iᵏz` 或 `iᵏconjugate(z)`、二维实矩阵以及矩阵对向量的作用。8 个矩阵互异，给出本实验中的忠实实表示。

Select two square symmetries and a complex test vector. The action, real matrices and vector outputs use the same right-to-left composition convention. The eight matrices are distinct, making this particular real representation faithful.

把测试点设为零：r 与 s 的两种复合都固定它，但在 1 上分别得到 i 与 −i。单个点的像一致不证明矩阵一致。共轭是实线性而非复线性，不能把反射误写成固定复标量乘法。当前联岛图显示测试向量和计算路径，不声称画出了带编号的正方形顶点。

At zero, both orders agree, yet at 1 they give i and −i. One matching image does not establish matrix equality. Conjugation is real-linear, not complex-linear. This connection scene displays test vectors and calculation paths, not a labelled-square vertex diagram.

## 来源核验与证据边界 / Source verification and evidence scope

2026-10-22 对下列六个不同 URL 实际取得 HTTP 200，下载正文并读取表中的相关位置。两项使用同一本 Hatcher 教材，因此数据有七条来源记录。HTTP 成功说明当时可访问，不证明数学内容正确；本次也没有重读完整教材或论文的全部证明。

On 2026-10-22, all six distinct URLs below returned HTTP 200. Relevant downloaded passages were read; two lessons cite Hatcher, yielding seven source records. HTTP success records accessibility at that time, not mathematical truth. Complete textbooks and papers were not re-proved.

| 来源 / Source | 核对位置 / Inspected locator | 本课使用的范围 / Used scope |
|---|---|---|
| [Ivrii §6.1](https://www.math.toronto.edu/ivrii/PDE-textbook/Chapter6/S6.1.html) | (6.1.4)–(6.1.7), “Other boundary conditions”, (6.1.21) | 模态时间 ODE、指数衰减、周期常数项。 / Modal ODE, decay and the periodic constant mode. |
| [Ivrii §4.2](https://www.math.toronto.edu/ivrii/PDE-textbook/Chapter4/S4.2.html) | Example 4, (4.2.13)–(4.2.20) | 周期本征值与三角/复指数基，令 l=2π。 / Periodic eigenvalues and bases, specialized to l=2π. |
| [Hatcher, Algebraic Topology](https://pi.math.cornell.edu/~hatcher/AT/AT.pdf) | pp. 56–60, 105–106, 153 | 圆周幂覆盖、唯一路径提升、同调商与 F₂ 系数。 / Circle covers, unique lifting, homology quotient and F₂ coefficients. |
| [Peyré–Cuturi, Computational Optimal Transport](https://arxiv.org/pdf/1803.00567) | Remark 2.30, pp. 31–32, equation (2.37) | 一维 W₁ 的 CDF 恒等式；不无条件搬用邻近的 Monge 映射表述。 / The W₁ CDF identity, without unconditionally applying nearby Monge-map language. |
| [Conrad, Notes on Ideals](https://kconrad.math.uconn.edu/blurbs/ringtheory/ideals.pdf) | §1 的生成理想定义；Theorem 2.1, p. 3 | F[T] 的主理想性质，特化为 gcd/Bézout 与根等式。 / Principal ideals in F[T], specialized to gcd/Bézout and root identities. |
| [Conrad, Dihedral Groups II](https://kconrad.math.uconn.edu/blurbs/grouptheory/dihedral2.pdf) | Theorem 1.1; p. 3 的 GL₂(R) 几何表示 | 旋转/反射矩阵与生成关系，令 n=4。 / Rotation/reflection matrices and generator relations, with n=4. |

下载字节的 SHA-256 和大小列在下方，用于辨识本次实际读取版本。它们是来源完整性记录，不是证明证书。原始缓存位于本次工作环境的 `/tmp/connection-sources/`，不作为仓库长期文件路径；上述 URL、定位与哈希是持久化记录。

The downloaded-byte hashes and sizes below identify the inspected versions. They record source integrity, not proof certification. Temporary caches are not permanent repository paths; the URLs, locators and hashes are the persistent record.

| 来源 / Source | Bytes | SHA-256 |
|---|---:|---|
| Ivrii §6.1 | 7785 | `138c9c49a944416313c291c8790408db6e96f6d0520774f74e8dfa116d3e7095` |
| Ivrii §4.2 | 14431 | `174eb4d953e185acb2f62b801d09d34d1afbfb185b7f0a8dca92e91cb6c93ec2` |
| Hatcher | 8121741 | `bebb3032bf9021b956da3bd070eb6c67dc662cf849be9cdf6679f677560e5618` |
| Peyré–Cuturi | 42429657 | `5292a1fc53631ac28fdbcccecc060de8e072b3008fb8d36c22d963a8f6a06bac` |
| Conrad: Ideals | 349505 | `1a19460414395e939bd4093753e2a081f7ac1145e6345062facbf3c81542f281` |
| Conrad: Dihedral II | 290802 | `703f3820a886af0d180e11de9832e7b1d76bf573e0ce946ba69d721b5341b72d` |

## 课堂产物与扩展 / Classroom evidence and extension

每个活动可用 20–30 分钟，研究读书会可继续扩展。要求提交一次参数配置、两种表示的一组对应值、一个反例、以及一段区分观察和论证的说明。可写出精确有限论证的地方就要求论证；需要额外理论的地方就记录缺口。点击、日志或相近小数本身不证明理解或定理。

Each activity can occupy roughly 20–30 minutes, with further research reading. Request a parameter configuration, corresponding values from both representations, a counterexample, and a statement separating observation from argument. Require exact finite arguments where available, and record missing theory where needed. Clicks, journal entries and nearby decimals alone do not prove understanding or a theorem.

本轮新增关系不写回核心。在核心中增加文献桥、正式类型或证明状态，仍需其自身的证据与审读。教育层可独立增加共享状态、显示表示和教学活动，并通过核心引用保持可追溯性。

No relationship in this batch writes back to the core. A core literature bridge, formal type or proof status requires its own evidence and review. Shared educational states and representations grow independently while retaining traceable references.
