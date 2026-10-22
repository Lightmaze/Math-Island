# 数学群岛的 21 条跨域航线

以下均为已有文献中的数学联系。每条保留适用条件；它们不是本项目的新定理，也不是已经由证明助手检查的边。百科正文的普通链接不自动进入此表。来源阅读及获取状态另见 bridge-source-audit.json。

## bridge:001 · 椭圆曲线 → 模形式

端点：Elliptic curve → Modular form。

把椭圆曲线的算术信息转入模形式与 Galois 表示的语言，利用模性提升连接两侧。

条件：本条记录 Wiles 1995 的范围：定义在 Q 上的半稳定椭圆曲线。

结论：这些椭圆曲线具有相应的模参数化；结合 Frey–Ribet 路线可推出费马大定理。

边界：此引文不能单独证明所有 Q 上椭圆曲线的完整模性，也不是任意数域的结论。

来源：[Andrew Wiles, Modular elliptic curves and Fermat’s Last Theorem (1995)](https://annals.math.princeton.edu/1995/141-3/p01)；定位：Introduction, semistable modularity theorem。

## bridge:002 · 模形式 → 八维球堆积

端点：Modular form → Sphere packing。

用模形式构造具有所需符号和 Fourier 变换性质的 Schwartz 函数，使 Cohn–Elkies 上界在 E8 上取等。

条件：欧氏空间 R^8；同半径球的通常堆积密度。

结论：E8 格点堆积达到所有八维球堆积的最大密度。

边界：不是仅在格点堆积中最优；也不是任意维数的最优结论。

来源：[Maryna Viazovska, The sphere packing problem in dimension 8 (2017)](https://arxiv.org/abs/1603.04246)；定位：Introduction and modular-form construction。

## bridge:003 · 霍奇理论结构 → 拟阵对数凹性

端点：Hodge theory → Matroid。

给拟阵构造 Chow 环，在其中建立 Hard Lefschetz 与 Hodge–Riemann 关系，再把交叉乘积不等式转为组合系数不等式。

条件：有限非空基集上的无自环（loopless）拟阵的 Chow 环；使用其 ample 类。

结论：拟阵特征多项式系数的绝对值构成对数凹序列。

边界：不要求拟阵可由向量表示；并非声称每个拟阵都来自一个光滑射影簇。

来源：[Adiprasito, Huh, Katz, Hodge Theory for Combinatorial Geometries (2018)](https://arxiv.org/abs/1511.02888)；定位：Abstract and main theorem statements。

## bridge:004 · 局部引理 → 重抽样算法

端点：Lovász local lemma → Randomized algorithm。

对独立随机变量定义坏事件；每遇到坏事件只重抽样其涉及变量，用 witness trees 控制重抽样次数。

条件：有限独立变量模型和有限坏事件族；Γ(A) 由共享变量的坏事件构成。 存在 0<x(A)<1，使 P(A)≤x(A)∏_{B∈Γ(A)}(1−x(B))。

结论：得到避开所有坏事件的赋值；事件 A 的期望重抽样次数至多 x(A)/(1−x(A))。

边界：运行时间还依赖检测事件和重抽样的成本；不能直接推广到任意依赖模型。

来源：[Moser and Tardos, A constructive proof of the general Lovasz Local Lemma (2009)](https://arxiv.org/abs/0903.0544)；定位：Theorem 1.2。

## bridge:005 · 稠密组合定理 → 素数等差数列

端点：Szemerédi’s theorem → Prime number。

用筛法生成的伪随机控制测度容纳稀疏素数，并建立相对 Szemerédi 定理以迁移稠密集合中的组合结论。

条件：每个固定正整数 k。 迁移步骤需要论文中的伪随机性条件，不能仅假定集合无限。

结论：素数中存在任意有限长度的等差数列。

边界：不是要求数列由连续素数组成；不能把正整数中的正密度假设直接用于零密度的素数集。

来源：[Green and Tao, The primes contain arbitrarily long arithmetic progressions (2008)](https://arxiv.org/abs/math/0404188)；定位：Introduction and transference discussion。

## bridge:006 · 最优输运 → 合成 Ricci 曲率

端点：Optimal transport → Ricci curvature。

在概率测度的 Wasserstein 空间上，以熵类泛函沿测地线的位移凸性表达曲率下界。

条件：使用 Lott–Villani 论文的紧致测度长度空间与概率测度框架。 有限 N 的非负 N-Ricci 与无限维 K 下界分别有自己的定义。 此版本要求在每对端点之间存在合适的 Wasserstein 测地线，不要求所有测地线都满足。

结论：得到可用于非光滑空间、并在所述 measured Gromov–Hausdorff 极限下保持的曲率条件。

边界：不把所有可能的 CD、RCD 或非分支条件混为同一版本。

来源：[Lott and Villani, Ricci curvature for metric-measure spaces via optimal transport (2009)](https://arxiv.org/abs/math/0412127)；定位：Abstract and definitions in introduction。

## bridge:007 · 扩张图 → 纠错码

端点：Expander graph → Error-correcting code。

以具有足够扩张性质的图组织局部校验，使局部错误信号能够引导迭代纠正。

条件：图满足构造和解码定理所需的定量扩张条件。 局部码和码率参数必须与选定的 expander-code 构造匹配。

结论：可构造渐近良好码族，并有能纠正常数比例错误的有效解码算法。

边界：任意被称为 expander 的图加任意局部码，并不自动满足相同解码保证。

来源：[Sipser and Spielman, Expander Codes (1996)](https://www.cs.yale.edu/homes/spielman/Research/expanders.html)；定位：Abstract and construction overview。

## bridge:008 · 模型论稳定性 → 图正则性

端点：Stability theory (model theory) → Szemerédi regularity lemma。

将半图序结构识别为模型论不稳定性的组合见证；排除统一大小的半图后应用稳定性理论分解。

条件：有限图满足固定 k 的 non-k-order property。 固定近似参数 ε>0。

结论：得到稳定图的加强正则分割，其中没有通常版本中的不规则对，并改善分割规模界。

边界：条件不是单纯排除某一种诱导完整图；不能用于所有有限图。

来源：[Malliaris and Shelah, Regularity lemmas for stable graphs (2014)](https://arxiv.org/abs/1102.3904)；定位：Abstract; Theorem 5.18 locator。

## bridge:009 · 直觉主义逻辑 ↔ 带类型 λ 演算

端点：Intuitionistic logic → Lambda calculus。

把命题对应为类型、证明对应为项、证明归约对应为程序求值；连接引入/消去规则与构造/使用规则。

条件：首个基本实例：直觉主义蕴含片段与只有函数类型的简单类型 λ 演算。 扩展到合取、析取、假命题 ⊥ 时，分别加入 product、sum、empty types，并匹配引入和消去规则。

结论：证明对象可作为受类型检查的程序表达，逻辑规则和程序构造建立精确对应。

边界：加入任意递归、异常或不受控制的公理后，不能仍无条件把任意程序当作总正确性证明。

来源：[Philip Wadler, Propositions as Types (2015)](https://www.research.ed.ac.uk/en/publications/propositions-as-types/)；定位：Propositions/types and proofs/programs sections。

## bridge:010 · 依赖类型论 ↔ 同伦结构

端点：Type theory → Homotopy theory。

把类型看作空间、恒等类型看作路径，再把高阶恒等解释为同伦；univalence 将类型相等与等价连接。

条件：明确所用依赖类型论、恒等类型规则及 univalence 等额外公理。

结论：可以在该基础内构造和计算同伦不变量，并用同伦语言组织证明。

边界：不是说任意传统类型系统已自动满足 univalence，亦不宣称本地图经过证明助手核验。

来源：[The Univalent Foundations Program, Homotopy Type Theory (2013)](https://homotopytypetheory.org/book/)；定位：Chapter 2: types, identity paths, and univalence。

## bridge:011 · 算子代数 → 纽结不变量

端点：Von Neumann algebra → Jones polynomial。

从子因子相关的代数关系得到辫群表示，并用满足 Markov 性质的迹归一化，消除辫表示选择的依赖。

条件：温和的有向经典链环；辫闭包和 Markov 等价。 迹与归一化必须满足不变性所需关系。

结论：构造 Jones 多项式这一链环同痕不变量。

边界：不变量相同不保证纽结同痕；不能把一个不变量误当完整分类。

来源：[Vaughan Jones, A polynomial invariant for knots via von Neumann algebras (1985)](https://doi.org/10.1090/S0273-0979-1985-15304-2)；定位：Pages 103–105, Theorems 1–2。

## bridge:012 · 覆盖空间 ↔ 基本群的子群

端点：Covering space → Fundamental group。

通过路径提升把覆盖的纤维组织为基本群作用；连通覆盖由相应子群刻画。

条件：基空间路径连通、局部路径连通、半局部单连通。 带基点版本用子群，忘掉基点的连通覆盖用共轭类。

结论：得到覆盖空间分类与群论对象之间的对应。

边界：不能删掉局部条件后仍声称全部经典分类定理成立。

来源：[Allen Hatcher, Algebraic Topology (2002), Section 1.3](https://pi.math.cornell.edu/~hatcher/AT/ATpage.html)；定位：Section 1.3, classification of covering spaces。

## bridge:013 · 根理想 ↔ 仿射代数集合

端点：Radical ideal → Algebraic set。

利用 Hilbert 零点定理把多项式共同零点与消失理想互相转换，I(V(I))=√I。

条件：k 为代数闭域；k[x1,…,xn] 为有限变量多项式环。

结论：仿射代数集合与根理想之间建立反向包含的双射。

边界：一般非代数闭域上只取 k-有理点不能恢复同样的理想；有理点为空不表示理想是单位理想。

来源：[The Stacks Project, Hilbert Nullstellensatz, Tag 00FV](https://stacks.math.columbia.edu/tag/00FV)；定位：Theorem 10.34.1 and its proof; algebraically closed specialization。

## bridge:014 · 曲率积分 → 欧拉示性数

端点：Gaussian curvature → Euler characteristic。

局部曲率的积分通过 Gauss–Bonnet 转换为拓扑不变量。

条件：采用所引讲义的范围：R^3 中光滑、紧致、无边界、可定向的正则曲面，取诱导度量。

结论：∫M K dA=2πχ(M)。

边界：有边界需加边界曲率项；非紧情形不能直接套用此式。相同总曲率不能反推同一个度量或曲率分布。

来源：[Robert Hale, The Gauss–Bonnet Theorem, University of Chicago REU (2022)](https://www.math.uchicago.edu/~may/REU2022/REUPapers/Hale.pdf)；定位：Global Gauss–Bonnet statement; institutional expository source。

## bridge:015 · Brownian 路径 → 抛物型 PDE

端点：Brownian motion → Heat equation。

沿 Brownian 路径对初值和势函数取期望，把概率演化转为带势热方程的解。

条件：保守的充分范围：R^d 上有界、非负、光滑势 V 和有界光滑初值 f；固定有限 t。 Brownian 运动的生成元取 (1/2)Δ。

结论：u(t,x)=E_x[exp(−∫0^t V(Bs)ds)f(Bt)] 解 ∂t u=(1/2)Δu−Vu，u(0,x)=f(x)。

边界：对无界势、爆炸扩散或边界停止问题需要额外可积性和边界条件。

来源：[Steven Lalley, Stochastic Differential Equations, Diffusion Processes, and the Feynman–Kac Formula](https://www.stat.uchicago.edu/~lalley/Courses/391/)；定位：Feynman–Kac theorem; stated here in conservative smooth bounded scope。

## bridge:016 · 稀疏几何 → 凸优化恢复

端点：Restricted isometry property → Compressed sensing。

以受限等距性控制稀疏方向，将欠定观测中的稀疏恢复问题交给带噪声约束的 ℓ1 最小化。

条件：矩阵的受限等距常数满足 δ_(3S)+3δ_(4S)<2（所引论文定理 1）。 真实误差满足 ||e||2≤ε；使用约束 ℓ1 问题的全局最小解。

结论：足够稀疏向量的恢复误差由观测噪声控制；近似稀疏时额外包含尾部逼近误差。

边界：不是任意低秩矩阵、任意可行解或未检查噪声半径都能恢复；本条不混用后续文献的更优 RIP 常数。

来源：[Candès, Romberg, Tao, Stable Signal Recovery from Incomplete and Inaccurate Measurements (2006)](https://arxiv.org/abs/math/0503066)；定位：Abstract and main recovery statements。

## bridge:017 · 概率集中 → 欧氏降维

端点：Concentration of measure → Johnson–Lindenstrauss lemma。

随机投影对一个向量的长度集中，再对有限点对作 union bound，得到同时保持距离的嵌入。

条件：n≥2 个欧氏点，0<ε<1，目标维数 k 为正整数。 目标维数 k≥4 log(n)/(ε²/2−ε³/3) 可采用所引证明；k≥原维数时可用等距嵌入。

结论：存在到 R^k 的映射，使所有点对平方距离落在原值的 (1±ε) 范围内。

边界：不是保持整个连续空间中所有点对，也不能直接替代一般度量空间嵌入定理。

来源：[Dasgupta and Gupta, An elementary proof of a theorem of Johnson and Lindenstrauss (2003)](https://doi.org/10.1002/rsa.10073)；定位：Theorem 2.1 and proof outline。

## bridge:018 · 拓扑零点原理 → 多项式划分

端点：Borsuk–Ulam theorem → Polynomial partitioning。

把多项式系数看作参数空间，借拓扑零点论证同时平衡细胞中的代数簇交会数。

条件：Γ 是 R^n 中有限个 k 维、复杂度有统一界的实代数簇。 D≥1；复杂度界固定后常数才能统一。

结论：存在非零 deg P≤D，使 R^n\Z(P) 每个连通分支与至多 C D^(k−n)|Γ| 个成员相交。

边界：不控制落在 Z(P) 上的部分；一个簇可穿过多个细胞；这里不是高效构造算法的保证。

来源：[Larry Guth, Polynomial partitioning for a set of varieties (2015)](https://arxiv.org/abs/1410.8871)；定位：Main theorem and topological argument。

## bridge:019 · 半正定优化 → 零误差容量上界

端点：Semidefinite programming → Shannon capacity。

用正交表示或等价的半正定规划定义 Lovász θ；借图乘积性质控制独立集增长。

条件：有限无向简单图；Shannon 容量使用强图乘积的独立数增长率。

结论：α(G)≤Θ(G)≤θ(G)；五边形 C5 有 Θ(C5)=√5。

边界：一般图不保证 Θ(G)=θ(G)；高精度数值 SDP 结果需额外误差控制才能成为严格上界证书。

来源：[László Lovász, On the Shannon Capacity of a Graph (1979)](https://doi.org/10.1109/TIT.1979.1055985)；定位：Definition of theta and capacity upper bound。

## bridge:020 · 有限域插值 → Reed–Solomon 码

端点：Polynomial interpolation → Reed–Solomon code。

把消息作为低次多项式的系数，在多个不同的有限域元素上求值；根数界把多项式差异转成 Hamming 距离。

条件：有限域 Fq；1≤k≤n≤q；n 个求值点互异。 求值多项式次数严格小于 k。

结论：得到 [n,k,n−k+1]q 码；任意 k 个无误符号可插值恢复消息。

边界：擦除恢复与未知位置错误纠正是不同保证；重复求值点会破坏距离论证。

来源：[MIT 6.885 Algebra and Computation, Lecture 16 (2005), Reed–Solomon evaluation codes; original: Reed and Solomon (1960)](https://people.csail.mit.edu/madhu/FT05/scribe/lect16.pdf)；定位：Section on Reed–Solomon codes; primary course notes, not a scan of the 1960 paper。

## bridge:021 · 多项式根数界 → 交互式证明

端点：Polynomial identity testing → Sum-check protocol。

逐轮将高维有限和压为一元多项式一致性检查，用新鲜随机挑战把虚假等式的通过概率限制在根数比例内。

条件：有限域 F；每个变量次数至多 d；m 轮。 验证者逐轮检查次数并使用独立均匀挑战；最后能可信求值目标多项式。

结论：标准 sum-check 具有完备性，虚假和的接受概率至多 md/|F|（并且总是不超过 1）。

边界：复用挑战、取消次数检查、或把最终求值交给未验证的回答都会失去该保证。

来源：[Justin Thaler, The Sum-Check Protocol; Proofs, Arguments, and Zero-Knowledge](https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.html)；定位：Protocol and soundness theorem。
