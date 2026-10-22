# Structural connections / 结构联岛实验

These educational experiments are independent of the source atlas. They neither modify core nodes or edges nor promote an educational correspondence into a literature bridge. Both export `ConnectionLabProps` components from `src/connections/StructureConnections.tsx`, with deterministic models in `structure-models.ts`.

这两项教育实验独立于来源图谱，不修改本体节点或关系，也不把教育对应关系升级为已有文献航线。组件使用共享 `ConnectionLabProps`，纯计算模型可独立核验。

## Complex powers ↔ covering spaces / 复数幂与覆盖空间

`CoveringComplexLab` uses the covering `p:S¹→S¹, p(z)=zⁿ`. For integer winding `m` and selected starting fibre `k`, it defines the entire path by

```
γ(t) = exp(2πimt)
γ̃ₖ(t) = exp(2πi(mt+k)/n),  0 ≤ t ≤ 1.
```

The lift starts at `exp(2πik/n)` and satisfies `γ̃ₖ(t)ⁿ=γ(t)`. Angles are accumulated without reduction to a principal argument. The endpoint index is `k+m mod n`; the full lifted path closes exactly when `n` divides `m`. Negative winding reverses direction; zero winding gives a constant path. A partially traversed path need not be closed, so its noninteger accumulated turns are not called a closed-loop winding number.

提升从选定起点出发，保留未归零的累计角度。完整路径的纤维置换为 `k↦k+m mod n`，提升闭合当且仅当 `n|m`。负绕数反向，零绕数给出常值路径。中途尚未闭合时，累计圈数不称闭路绕数。

Controls: `n=2…8`; `k=0…n−1`; integer `m=−8…8`; progress `t=0…1` in increments of `.01`. Buttons reset progress, complete the selected loop, or set `m=n`. The pure function `coveringLift(n,k,m,t)` validates finite parameters and returns analytic coordinates, unwrapped angles, rendering samples, closure flags and the entire fibre permutation. Its wider tested contract accepts degree `1…32` and winding `−32…32`.

Two SVGs display the covering circle and base circle. Repeated arcs overlap; numerical accumulated angles and five tabulated samples retain the information absent from the picture. Every starting fibre has a tabulated endpoint. Floating-point projection residuals are diagnostic observations, not the proof of the analytic identity.

两个 SVG 分别显示覆盖圆周和底圆周；重复弧的重合不被画成额外几何结构。累计角、五个样本及全部起点的终点表保留路径历史。浮点投影误差是数值观察，不替代公式恒等式。

Scope: zero is excluded from `S¹`. The complex-plane power map is branched at zero. A principal nth root can jump at a branch cut and is not substituted for a continuous lift.

## Polynomial ideals ↔ finite-field points / 多项式理想与有限域点

`IdealZeroLab` works in the univariate ring `Fₚ[x]`. The UI offers `p∈{2,3,5,7,11}` and two polynomial coefficient lists, in ascending degree, with one to seven integer entries. Coefficients are reduced modulo `p`; all-zero lists represent zero. Invalid text produces no mathematical readings and sends `validInput:false` to the snapshot callback, preventing an old result from being recorded as a result of a new invalid input.

The exact finite-field algorithm computes polynomial division, an extended Euclidean trace, and a monic gcd `d` with coefficients `u,v` such that `d=uf+vg`. The exact quotients `f/d,g/d` provide the reverse inclusion, hence `(f,g)=(d)`. When both inputs vanish, `d=u=v=0`, no division by zero is performed, and the zero polynomial is not called monic.

算法在有限域内精确计算每一步商余、扩展欧几里得过程和 Bézout 系数。`d=uf+vg` 与 `f=(f/d)d, g=(g/d)d` 分别给出理想的两个包含方向，得到 `(f,g)=(d)`。两个输入都为零时单独处理 `(0,0)=(0)`，不把零多项式称为首一，也不执行除零。

Every element of `Fₚ` is evaluated, yielding exactly `V(f)∩V(g)=V(d)` for `Fₚ`-rational points. The point diagram uses residue representatives as coordinates and does not interpolate them into real continuous curves. The other diagram shows the actual remainder chain and polynomial degrees; all exact polynomials and quotients remain in HTML tables.

| Preset / 预设 | Field | `f` | `g` | Distinction / 区分 |
|---|---:|---|---|---|
| Shared factor / 共同因子 | F₅ | x²+2x+2 | x²+x+3 | d=x+4; shared root 1 |
| Coprime / 互素 | F₅ | x²+1 | x+1 | d=1; unit ideal; empty common zero set |
| No rational roots / 无域内根 | F₃ | x²+1 | x³+x²+x+1 | d=x²+1; proper ideal despite no F₃ roots |
| Repeated factor / 重因子 | F₅ | (x−1)² | (x−1)² | Point set {1} forgets multiplicity |
| Zero / 零 | F₅ | 0 | 0 | Zero ideal; every field element is a common zero |

Equal root sets do not determine equal ideals. The no-root preset directly distinguishes a proper ideal from the unit ideal despite their identical empty `F₃`-point sets. The repeated-root preset distinguishes `(x−1)²` from `(x−1)` despite the same points. Tests also include `x⁵−x`, which vanishes on all `F₅` elements but generates a nonzero ideal.

根集相同不能反推理想相同。无根预设说明非单位理想也可能没有该有限域内的点；重因子预设说明点集忘记重数。测试另含在 F₅ 的全部点上消失但非零的 `x⁵−x`。这些是明确模型，不是一般 Hilbert 零点定理的证明。

## Integration and checks / 集成与核验

- Props: `{language:'zh'|'en', onSnapshot?}`. Memoized mathematical state is reported through `useEffect`; the host should pass a stable callback.
- Covering snapshots contain degree, starting fibre, winding, progress, current accumulated turns, current/final closure, endpoint coordinates and the full permutation.
- Ideal snapshots contain prime, entered coefficients, validity, gcd, Bézout coefficients, root sets and division count. Arrays contain actual model output.
- Desktop figures are side by side; mobile figures stack. Parameters follow the paired figures. HTML controls and tables provide a keyboard/screen-reader route; figure enlargement creates a focusable, labeled horizontal reading region.
- All interactive controls have a 44px minimum height. Mobile SVG labels use larger font units, with an explicit enlargement option for dense numerical readings.
- `tests/connection-structure.test.ts` checks projection for every initial fibre at UI degrees, branch-cut continuity, negative/zero winding, intermediate closure, division identities, Bézout certificates, exact quotients, small-field exhaustive inputs, zero/unit/proper ideals, multiplicity and invalid parameter rejection.

图示默认先于参数出现，桌面并列、手机堆叠；表格可键盘滚动，图形可放大。测试关注能区分错误实现的反例，不把图像相似或少量数值相等当作理论有效性的证明。
