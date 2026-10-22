# Analysis connection laboratories / 分析联岛实验

The two exports in `src/connections/AnalysisConnections.tsx` implement `ConnectionLabProps`: `language: 'zh' | 'en'` and optional `onSnapshot`. A memoized snapshot is emitted from an effect when mathematical state changes. Parent callbacks should be stable. Neither component writes the research atlas or changes the existing 24 island laboratories.

## Fourier modes ↔ periodic heat flow

`HeatFourierLab` uses the same finite coefficient vector in both views:

\[
u(x,t)=m+\sum_{k=1}^4 a_k e^{-k^2t}\sin(kx),\quad x\in\mathbb R/(2\pi\mathbb Z),\quad u_t=u_{xx}.
\]

The left plot compares initial and current signed coefficients. The right compares initial and current spatial temperature deviations. The vertical range follows the initial coefficients and stays fixed when time changes. Diffusivity is 1. The zero-frequency mean is conserved.

Orthogonality gives the exact finite-model identities

\[
E(t)=\int_{-\pi}^{\pi}u^2\,dx=2\pi m^2+\pi\sum_{k=1}^4a_k^2e^{-2k^2t},\qquad
E'(t)=-2\int_{-\pi}^{\pi}|u_x|^2\,dx.
\]

Controls: t∈[0,1.2], m∈[−.5,.5], a₁,…,a₄∈[−1.5,1.5]. The initial-profile button restores a=[1,.45,−.3,.2], m=.2, t=0. A numerical table includes the constant mode and each mode’s amplitude, decay factor and energy. A nonzero mean leaves the positive energy floor 2πm². This is not a claim that arbitrary initial data has an exact four-mode representation.

Snapshot parameters: `time`, `mean`, `coefficients`. Observations: `energy`, `initialEnergy`, `energyDerivative`, `mean`, `variance`, `currentCoefficients`.

## Discrete probability ↔ W₁ transport

`TransportCdfLab` works with finite probability measures on the real line and absolute-distance cost. It computes a monotone coupling and independently sums areas between right-continuous CDFs:

\[
W_1(\mu,\nu)=\min_{\pi}\sum_{ij}\pi_{ij}|x_i-y_j|=\int_{\mathbb R}|F_\mu(x)-F_\nu(x)|\,dx.
\]

The identity is one-dimensional and concerns W₁, not W₂. Optimal plans can split mass and need not be unique. The plot’s vertical bank separation does not enter the cost. CDF vertical segments mark jumps; hollow/filled endpoints distinguish left limits from actual right-continuous values.

Source positions are −2,0,2, with masses ((1−p)/2,p,(1−p)/2). Target positions are translated by δ and have masses ((1−p)(1+b)/2,p,(1−p)(1−b)/2). Controls δ,b∈[−1,1] and p∈[0,1] include identical distributions, zero-mass atoms, and the p=1 Dirac case. The equality button sets δ=b=0 and preserves p.

The algorithm sorts atom positions, pairs remaining positive mass, and advances exhausted atoms without a fixed mass cutoff. CDF areas are computed from the union of positive-mass supports, as width times absolute cumulative-probability difference over each half-open interval. No image pixels are used to estimate areas. Unit-probability validation admits only machine-scale summation error; arbitrary unequal total masses, negative masses, non-finite values and overflowing numerical ranges are rejected. Displayed arithmetic is floating point, and both the identity discrepancy and marginal residual are shown.

Snapshot parameters: `translation`, `tilt`, `centralMass`. Observations: `transportCost`, `cdfArea`, `identityResidual`, `marginalResidual`, `sourceMasses`, `targetMasses`, `cdfDifferences`.

## Verification and access

`tests/connection-analysis.test.ts` checks initial conditions, periodicity, conserved mean, mode-4 decay, composition of evolution times, independent spatial energy/dissipation integrals, a numerical PDE residual, Dirac displacement, marginal conservation, CDF-area equality across 80 parameter combinations, reordered/repeated supports, right continuity, tiny positive masses and invalid inputs. Fluctuation variance is summed from modal energies rather than subtracting nearly equal total/mean energies; a tiny-mode regression checks this numerical boundary. All 11 tests pass.

Both views use mathematical SVG generated from the model, then labeled HTML controls and live numerical readings. Tables have captions and row/column headers, and overflow regions accept keyboard focus. Layout is paired on desktop and stacked in narrow containers. All controls are native and animation does not start automatically. Screenshots and temporary browser scripts live outside the repository.

Component-level Chromium verification covered both laboratories in Chinese and English at 1200, 390 and 320 pixels (12 combinations). No horizontal page overflow, SVG label overflow or page errors occurred. The smallest SVG text rendered at 14.3 CSS pixels in the 320-pixel viewport. Keyboard arrow changes produced one new snapshot per change; table disclosure opened with Enter. This is a component-level check; the integrated workbench is verified separately.

Additional 320-pixel keyboard checks reached t=1.2, m=.5 and all four coefficients=1.5, retaining all signed axis labels; restoring initial data returned t=0 and equal initial/current energies within floating-point tolerance. Transport checks reached a negative Dirac translation, identical measures, and zero-mass endpoints while retaining matching costs/CDF areas. The education TypeScript project also passed `npx tsc --noEmit` at this handoff.

中文：两个实验用同一模型中的两种表示建立可核对的联系。傅里叶系数、热流和 L² 能量同步；运输分量、概率 CDF 与面积同步。参数变化的快照可交给上层航记，但不会写入本体图谱。数值图与浮点残差用于观察和核对，不代替恒等式本身的证明。
