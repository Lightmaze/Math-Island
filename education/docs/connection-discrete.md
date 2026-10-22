# 图、同调与对称表示的联岛实验 / Discrete connections

这两项实验把同一份参数同时解释为不同数学对象；图形、矩阵、数值和条件一起变化。它们是教育层，不修改核心数学岛屿数据，也不把一个具体模型等同于一般理论。

These experiments interpret the same parameters as several mathematical objects at once. Figures, matrices, numerical observations and conditions change together. They belong to the education layer and do not modify core atlas data or identify a specific example with a general theory.

## 接口 / Interface

`GraphHomologyLab` 与 `SymmetryRepresentationLab` 从 `src/connections/DiscreteConnections.tsx` 导出，接受 `ConnectionLabProps`：`language: 'zh' | 'en'`、可选 `onSnapshot(snapshot)`。快照含可序列化的 `parameters` 与 `observations`，由记忆化模型和稳定 effect 在参数变化后发送。父组件应提供稳定回调。

Both components are exported from `src/connections/DiscreteConnections.tsx` and accept `ConnectionLabProps`: `language` and optional `onSnapshot`. Serializable parameter/observation snapshots are derived from memoized models and emitted by an effect. The parent should provide a stable callback.

## 图 ↔ 链复形 ↔ 商空间 / Graph ↔ chain complex ↔ quotient

- 顶点始终为 A、B、C、D，边次序为 AB、AC、AD、BC、BD、CD，面次序为 ABC、ABD、ACD、BCD。所有运算在 𝔽₂ 上。Vertices always remain, including isolated vertices; edge and face orders are fixed, and arithmetic is over 𝔽₂.
- 原生按钮选择边、填面及待检查的 1-链 z。一个面只能在它的三条边存在时选择；删边会同时移除依赖面和对应链项。Faces require all boundary edges; removing an edge also removes dependent selected faces and chain entries.
- 纯模型 `k4Homology(edgeIds, faceIds, chainIds)` 拒绝重复、非整数、越界索引、不闭合的复形及不属于复形的链。The model rejects malformed indices, missing face boundaries and chains outside the complex.
- 实际构造 ∂₁（4×|E|）、∂₂（|E|×|F|），用 F₂ 消元求秩。β₀=4−rank∂₁，β₁=|E|−rank∂₁−rank∂₂，β₂=|F|−rank∂₂。Matrices and Betti numbers are computed from incidence, not guessed from the drawing.
- 枚举最多 64 条 1-链和 16 条 2-链，算出 Z₁、B₁ 和至多 8 个商类。类的代表取当前边序下最小二进制掩码；它只是可复现的选取，不是天然的几何基。At most 64 one-chains and 16 two-chains are enumerated. Representatives use the smallest bit mask in the current edge order, a deterministic convention rather than a canonical geometric basis.
- 当 ∂₁z≠0，显示非零顶点见证，不给 z 指派 H₁ 类；当 z 是边界，显示一组实际 2-链见证。Noncycles have no assigned H₁ class; boundaries include a computed two-chain witness.

可复现路线 / Reproducible route:

1. 默认 K₄ 骨架没有面，β₁=3，z=AB+AC+BC 是非零同调类。The initial graph has β₁=3 and the ABC cycle is nonbounding.
2. 填 ABC，z 不变，但 z=∂₂ABC，β₁降至 2，类变为零。Filling ABC leaves the chain unchanged but makes it a boundary and lowers β₁ to 2.
3. 填满四面，得到抽象四面体边界 S²，β=(1,0,1)。任意三面则 β=(1,0,0)。没有加入三维单形，所以四面不是一个被填实的 3-球。All four faces give the abstract tetrahedron boundary S²; any three give a disk. No 3-simplex is present.

平面中的边交叉不是新顶点，重叠的三角图形不是该抽象复形的平面嵌入。图中橙边标记 z，橙顶点标记 ∂₁z 的非零项，矩阵被选列与链联动。Edge crossings are not vertices and overlapping faces are not a planar embedding. Copper marks identify the selected chain and its boundary; matrix columns track the same chain.

## D₄ ↔ 复映射 ↔ 实矩阵 / D₄ ↔ complex maps ↔ real matrices

- 元素索引 0…7 表示 rᵏsᵋ，k=index mod 4，ε=⌊index/4⌋；r(z)=iz，s(z)=conj(z)。A∘B 表示先 B 后 A。The order convention is explicit and shared by group multiplication, complex actions and matrix products.
- `d4Representation(index)` 返回 Rᵏdiag(1,(−1)ᵋ)；`d4Compose(a,b)` 与 `multiplyMatrix` 独立执行群复合和矩阵复合；`complexD4Action` 用复数乘法与共轭求像。Independent formulas let the UI compare the group, complex and matrix descriptions.
- 控件选择 A、B 的八个元素，交换次序，调整 Re z、Im z∈[−2,2]（步长 0.25），或设置 z=0。两个 SVG 分别呈现等比例复平面和两条实向量复合路线；四张 HTML 矩阵表显示 ρ(A)、ρ(B)、ρ(A)ρ(B)、ρ(B)ρ(A)。Controls and both visual domains remain keyboard accessible.
- 快照区分“矩阵可交换”与“这个向量的像相同”。对 r、s 和 z=0，后者为真，前者为假。The experiment explicitly separates equality on one vector from equality of linear maps.
- 八个实矩阵互不相同，所以这个具体 D₄ 表示忠实。反射含共轭，属于实线性、非复线性变换；不能声称 D₄ 全部由复数乘法给出，也不能据此替代一般表示论。The eight distinct real matrices make this representation faithful. Reflections are real-linear, not complex-linear; this is not a representation solely by multiplication by complex scalars.

## 验证 / Verification

```sh
cd education
npx vitest run tests/connection-discrete.test.ts
```

11 项测试覆盖全部 113 个合法 K₄ 子复形的 ∂²=0、Euler 等式、商类计数及等大陪集；图周期填面后成为边界；全部四面与任意三面的 Betti 数；孤立顶点、非周期和非法输入；八矩阵互异、正交、全部 64 个复合、复数与实矩阵作用一致；z=0 的反例、共轭不满足复线性；中英文双图及表格渲染。

Eleven tests cover all 113 admissible K₄ subcomplexes, boundary squared, Euler characteristic, quotient counts and equal coset sizes; filling-cycle behavior and known sphere/disk Betti numbers; isolated vertices, noncycles and malformed input; eight distinct orthogonal matrices, all 64 compositions, complex/matrix action agreement, the zero-vector counterexample and failure of complex linearity for conjugation; and bilingual two-domain rendering.

浏览器复核覆盖 1366px、390px，以及 320px 中英文版本；两项实验均无页面溢出、SVG 文字越界、axe WCAG A/AA 报错或运行时异常。实际执行填 ABC、删 AB、填四面、设置 z=0 与交换 A/B，并读取相应矩阵/结论。保存后的本地快照也逐字段核对：填 ABC 时 β=(1,2,0)、isBoundary=true；z=0 时两向量像相同而 matricesCommute=false。复平面标签另测试 20 组元素/向量状态，无标签交叠。

Chromium checks covered 1366px, 390px, and bilingual 320px views, with no page overflow, out-of-bounds SVG labels, axe WCAG A/AA violations or runtime exceptions in these two experiments. Interaction checks filled ABC, removed AB, filled all four faces, set z=0 and swapped A/B. Saved local snapshots were inspected field by field: filling ABC produced β=(1,2,0) with `isBoundary=true`; at z=0 the vector images agreed while `matricesCommute=false`. Twenty group/vector configurations were additionally checked for overlapping complex-plane labels. This records the tested scope, not a comprehensive accessibility certification.
