# 数学对象实验室 / Mathematical object laboratories

这些实验是数学岛屿图谱的独立教育视窗。图中的生态由数学对象本身构成：可筛除的整数、有限域中的码字、带边界算子的三角剖分、覆盖空间中的提升路径、频率叠加与曲率。交互修改实际模型，读数来自计算。它们不向核心岛屿数据库写入教育状态，也不把有限可视化当成高级理论的完整替代。

These laboratories are independent educational windows into the mathematical-island atlas. Their visual ecologies consist of mathematical objects themselves: sifted integers, finite-field codewords, triangulations with boundary operators, lifted covering-space paths, harmonic sums and curvature. Controls change the underlying model and readouts are computed. Educational state does not write into the core atlas; a finite display is not a replacement for the full theory.

## 接口 / Interface

```tsx
<ObjectLab labKey="homology" language="zh" onExplore={recordLocalExploration} />
```

`ObjectLab.tsx` 分派下表 16 个实验；另外 8 个专用实验分派至 `AdvancedLab.tsx`：`ideal`、`spectrum`、`sheaf`、`transport`、`heat`、`spectral`、`lln`、`algebraiccurve`。未知键不自动展示一个声称等价的基础实验。

`ObjectLab.tsx` dispatches the 16 laboratories below. Eight additional dedicated keys are handled by `AdvancedLab.tsx`: `ideal`, `spectrum`, `sheaf`, `transport`, `heat`, `spectral`, `lln`, and `algebraiccurve`. An unknown key is not silently replaced by an unrelated elementary model.

所有交互使用原生 HTML 按钮、选择框、复选框和滑块，可通过键盘操作。SVG 有可访问标题，输出读数使用 `output`。没有自动动画。语言切换不改变数学模型；切换实验键会重置该实验的局部状态。

Controls are native keyboard-operable HTML buttons, selects, checkboxes and sliders. SVGs have accessible titles, numerical readouts use `output`, and nothing auto-animates. Changing language preserves the mathematical model; changing the laboratory key resets its local state.

手机端默认显示全图并放大图中标签；“放大图形”切换至可横向滚动的细节视图，滚动区域可以获得键盘焦点，“适应宽度”返回全图。傅里叶、曲率、有限域图例采用图外 HTML；有限域另有可展开的逐符号恢复表。

On mobile, labels are enlarged while the complete figure initially fits the screen. **Enlarge figure** opens a horizontally scrollable detail view with keyboard focus; **Fit width** restores the overview. Fourier, curvature and finite-field legends use HTML outside the drawing. The finite-field lab also includes an expandable symbol-by-symbol recovery table.

图形标记使用 `PALETTE`，文字另用 `TEXT_PALETTE`：文字颜色在实验浅色背景上满足至少 4.5:1 对比度，图线不必因此全部变暗。D₄ 顶点中的编号分别使用适合该背景的白色或近黑色；筛去的整数虽然带删除线，仍保持可读。两项回归测试分别检查文字墨色与彩色节点上的编号对比度。

Marks use `PALETTE`; labels use a separate `TEXT_PALETTE` whose text colors reach at least 4.5:1 contrast on the laboratories’ light surfaces. Graph strokes retain their original colors. D₄ vertex numbers use white or near-black according to the actual node background, and crossed-out sieve integers remain readable. Two regression tests check label inks and the numbered colored vertices.

## 16 个模型 / Sixteen models

| Key | 数学对象与操作 / Object and operation | 活读数 / Live quantities | 条件与视窗 / Conditions and scope |
| --- | --- | --- | --- |
| `sieve` | 埃拉托斯特尼筛；上界 60、120、180；逐个启用素数筛除。Eratosthenes sieve with successive prime passes. | 当前筛素数、剩余候选数、已筛数。Current sieving prime, candidates, eliminated integers. | 从 p² 开始，保留 p；遍历至 √N 后才把幸存者称为素数。Start at p², preserve p, and label survivors primes only after all primes ≤√N have been used. |
| `elliptic` | 实曲线 y²=x³−x+1 上的割线、切线、互逆；可切换奇异尖点 y²=x³。Secant, tangent and inverse constructions on a real elliptic curve, with a singular comparison. | Δ、P、Q、P+Q。Discriminant and point coordinates. | Δ≠0 才使用椭圆曲线群解释；无穷远点单独表示。The group-law interpretation requires a smooth curve; the point at infinity is represented separately. |
| `group` | 正方形 D₄ 的 8 个保距对称；选择 A、B 并交换复合次序。Eight square isometries, comparing A∘B and B∘A. | 两种乘积、顶点置换和交换性。Products, vertex images, commutation. | 约定 RᵏSˢ，S(x,y)=(x,−y)；D₄ 不是全部 4! 个顶点置换。The convention is explicit; D₄ is not S₄. |
| `topology` | 圆周 n 重覆盖 z↦zⁿ；n=2…6；推动基空间角度、观察唯一选定起点的路径提升。Circle coverings and path lifting. | 基空间绕数、覆盖空间绕数、提升路径是否闭合。Base turns, lifted turns, closure. | 使用累积角度 t，提升 eⁱᵗ⁄ⁿ；一周基路径通常不对应闭合提升。Accumulated angle is retained; one base loop generally lifts to an open path. |
| `homology` | F₂ 上三角复形：实心、孔洞、切口、分离；选择单个 2-单形或全部 2-链。Triangle complexes over F₂. | β₀、β₁、Euler 示性数、∂₁∂₂。Betti numbers, Euler characteristic, boundary squared. | 从实际关联矩阵做 F₂ 消元，不用外观猜洞数；这里不是整数同调或持久同调。Ranks come from boundary matrices over F₂; integral and persistent homology require additional structure. |
| `geometry` | 正四面体、正八面体、周期三角剖分环面；改变观察角和环面管半径。Closed polyhedral surfaces with angle defects. | V−E+F、总角亏 ΣKᵥ、2πχ。Euler characteristic and total discrete curvature. | 使用实际三维三角形内角；闭合无边界网格满足离散 Gauss–Bonnet。This is discrete curvature on closed meshes, not an arbitrary picture of smooth pointwise Gaussian curvature. |
| `category` | 有限链偏序作为范畴的函子，或有限集合中的可交换方形。Functors between finite poset categories and commuting squares of finite maps. | 单调性、两条复合路径在全部源元素上的值。Monotonicity and both composites on every source element. | 保序映射给出此处的协变函子；逆序映射并非此处的协变函子。Commutativity is checked on every element, not only a highlighted point. |
| `finitefield` | F₅、F₇、F₁₁ 上次数≤2 多项式；改变系数，保留不同横坐标的 3 个求值做 Lagrange 插值。Prime-field polynomial evaluation and interpolation. | 已知求值数、恢复状态、RS 参数 [p,3,p−2]。Known evaluations, recovery, Reed–Solomon parameters. | 3 个不同求值唯一决定次数≤2 多项式；这里演示擦除恢复，不声称任意错误恢复。Distinct evaluation points are required; this shows erasure recovery, not arbitrary error correction. |
| `graph` | 8 点非负权无向图；切换 BFS/Dijkstra，改变一条边权和目标，逐步展开。Unweighted or weighted shortest paths. | 已处理顶点、路径边数、实际总权。Settled vertices, hop count, total cost. | BFS 最小化边数；Dijkstra 最小化非负总权。平行边记录实际使用的边权。The two algorithms optimize different objectives; negative costs are rejected. |
| `matroid` | K₄ 的图拟阵；选择边，比较树基与含环依赖集。The graphic matroid of K₄. | 连通分量、秩 4−c、独立性、基。Components, rank, independence, bases. | 森林恰是独立集；交叉线段并非新增顶点；一般拟阵不一定来自图。Line crossings are not vertices; not every matroid is graphic. |
| `probability` | 高斯增量的有限网格 Brownian 样本；1、8、24 条路径；16、64、256 嵌套网格；固定种子。Finite-grid Brownian samples with coupled refinements. | 终点样本均值、无偏样本方差、理论方差 1。Endpoint sample statistics and theoretical variance. | 连线仅作插值；±2√t 是逐时刻约 95.45% 分布带，不是整条路径置信带。Connecting segments are display interpolation; the band is pointwise, not simultaneous. |
| `fourier` | sgn(sin x) 的前 N 个奇次谐波，N=1…25；显示各谐波。Odd-harmonic Fourier partial sums of the periodic square wave. | 最高频率、采样最大振幅、跳点值。Highest frequency, sampled peak, jump value. | 目标跳点值取 0；不连续目标不可能是连续截断的一致极限；Gibbs 数值现象不是常数证明。Jump values and finite sampling are explicit. |
| `complex` | 复乘法 w=ρeⁱᶿ；改变 ρ 和 θ，观察单位圆及 z=1+0.5i 的像。Complex multiplication as rotation and scaling. | wz 的实虚部、模长比。Product coordinates and norm ratio. | 坐标等比例，屏幕上的圆和角度保持；ρ=0 时辐角未定义。Equal axis scales preserve circles and angles; zero multiplication collapses the plane. |
| `optimization` | f=(λx²+y²)/2 的真实梯度迭代，λ=1…12；步长 η 与步数可调。Gradient descent on a positive definite quadratic. | 实际目标值、迭代谱半径、严格收缩条件。Objective value, spectral radius, contraction test. | 严格收缩当且仅当 0<η<2/λ；图窗裁切不改变数值输出。The stability interval is exact for this quadratic; clipped trajectories retain actual numerical readouts. |
| `logic` | Γ 中假定 f:A→B 与 x:A 的函数应用；可加 g:B→C；改变类型检查规则前提。Typed function application and composition. | 前提是否满足、结果类型或拒绝原因。Validity and resulting type. | 不匹配则拒绝推导；Γ 中的假设不是凭空证明的封闭命题。This is an explicit rule window, not a general theorem prover or dependent type system. |
| `fractal` | Cantor 中间三分之一删除的第 0…6 层。Finite stages of the middle-thirds Cantor construction. | 区间数 2ⁿ、总长 (2/3)ⁿ、极限维数 log2/log3。Counts, remaining length, limit dimension. | 每个有限层是有限区间并；非可数性、零测度和分形维数描述无限交集。The finite union is distinguished from its infinite limiting set. |

## 数学与实现边界 / Mathematical and implementation boundaries

- 纯模型位于 `src/labs/models.ts` 与 `surface-models.ts`；React 组件不充当数学真值来源。Pure model functions are separate from React rendering.
- 有限域和 F₂ 运算在当前小参数范围内是整数精确计算；实曲线、内角、傅里叶和与随机样本使用 IEEE-754 数值，不能充当形式证明。Finite-field and F₂ arithmetic are exact at the supported small sizes; real-valued calculations use floating point and are not formal proofs.
- `ellipticAdd` 的调用前提是输入点位于同一条非奇异短 Weierstrass 曲线上；UI 的三个群运算预设满足该前提，奇异模式单独关闭群律解释。The elliptic addition helper assumes valid points on the same smooth short Weierstrass curve; its UI presets satisfy this precondition.
- 椭圆曲线绘图先加入三次多项式临界点，再对零点和图窗边界交点二分细化。上下分支共享同一 `[r,0]`，避免离散采样在实根处画出虚假的断裂；回归检查包括方程残差、裁切范围及粗网格的三实根情形。Cubic plots insert critical points and refine root/viewport crossings by bisection. Both signs share the same `[r,0]`, avoiding a false visual gap at a real root; regression checks cover equation residuals, clipping bounds and a three-real-root curve on a coarse grid.
- `angleDeficits` 的公式针对闭合三角网格；带边界情形需要边界项。The displayed Gauss–Bonnet formula assumes a closed mesh; surfaces with boundary need a boundary term.
- 模型只处理列明的有限窗口。高级方向由课程链接继续展开，实验不会以“数值似乎成立”替代证明。Advanced continuations belong to the curriculum; visual plausibility never substitutes for proof.

## 验证 / Validation

执行 / Run:

```sh
cd education
npx vitest run tests/math-models.test.ts
```

测试覆盖筛除起点与完全性、D₄ 的全部 64 个二元复合、椭圆曲线加法的在曲线性、有限域插值唯一恢复、F₂ 链复形的 ∂²=0 与四种已知 Betti 数、三类闭曲面的 Gauss–Bonnet、BFS 与最短权路径的区别、平行边权回归、图拟阵独立性、Brownian 网格耦合、傅里叶对称性与 Gibbs 超调、梯度迭代稳定边界、复乘法范数及等比例坐标、Cantor 计数与长度、类型规则、可交换方形的全域检查。16 个实验还分别检查中英文静态渲染，确认存在 SVG、可操作原生控件和条件说明，且默认数值中无 NaN/Infinity。

Tests cover the sieve, all 64 binary D₄ compositions, elliptic closure, prime-field interpolation, chain-complex identities and known Betti numbers, discrete Gauss–Bonnet, graph optimization objectives and parallel-edge regression, graphic independence, coupled Brownian grids, Fourier properties, quadratic stability boundaries, complex norms and equal coordinate scales, finite Cantor measures, typed rules and pointwise commutativity. Every laboratory is also rendered in both languages to check SVGs, native controls, explanatory conditions and finite default numeric output. Browser interaction and responsive visual checks complement these model tests; static rendering alone does not establish usability.

浏览器复核在 Chromium 中检查了 320px 与 390px 视窗，逐项操作 16 个模型并读取变化：例如 3 重覆盖转过 3 周基路径后提升闭合；带孔复形改为分离复形后 β₀=2、β₁=0；四面体的总角亏为 4π；删除一个有限域已知坐标后停止声称唯一恢复；过大梯度步长显示谱半径 2 与发散。还检查了放大后的内部滚动不会造成整页水平溢出。此记录说明实际交互验证范围，不替代跨浏览器无障碍审计。

Chromium checks at 320px and 390px operated all 16 models and inspected the changed readouts: a degree-3 lift closes after three base loops; a separated complex has β₀=2 and β₁=0; the tetrahedron has total defect 4π; removing a retained finite-field coordinate withdraws the unique-recovery claim; an excessive gradient step reports spectral radius 2 and divergence. Enlarged figures were checked for internal scrolling without page overflow. This records the performed interaction checks; it is not a claim of comprehensive cross-browser accessibility certification.
