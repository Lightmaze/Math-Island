import { useId, useMemo, useState } from 'react';
import { CartesianGrid, coordinates, fmt, LabFrame, linePath, MathSvg, PALETTE, TEXT_PALETTE, PointMark, Select, Slider, tr, type LabProps, type Point } from './common';
import { brownianPaths, complexMultiply, fourierSquare, gradientPath } from './models';

export function ProbabilityLab({ language }: LabProps) {
  const [seed, setSeed] = useState(42), [count, setCount] = useState(8), [steps, setSteps] = useState(64);
  const paths = useMemo(() => brownianPaths(seed, count, steps), [seed, count, steps]);
  const endpoints = paths.map(p => p[p.length - 1][1]), mean = endpoints.reduce((a, b) => a + b, 0) / count;
  const variance = count > 1 ? endpoints.reduce((sum, x) => sum + (x - mean) ** 2, 0) / (count - 1) : null;
  const range = Math.max(2.7, ...paths.flatMap(p => p.map(([, y]) => Math.abs(y) + 0.2))), c = coordinates(0, 1, -range, range);
  const band: Point[] = [...Array.from({ length: 65 }, (_, i) => [i / 64, 2 * Math.sqrt(i / 64)] as Point), ...Array.from({ length: 65 }, (_, i) => [1 - i / 64, -2 * Math.sqrt(1 - i / 64)] as Point)];
  return <LabFrame title={tr(language, '随机路径的潮汐', 'A tide of random paths')} formula="ΔW ∼ N(0, Δt); Var(Wₜ)=t"
    subtitle={tr(language, '同一种子保留同一路径的嵌套网格。', 'One seed preserves the same paths across nested time grids.')}
    controls={<><Select label={tr(language, '路径数', 'Paths')} value={count} options={[1, 8, 24].map(n => ({ value: n, label: String(n) }))} onChange={v => setCount(Number(v))} /><Select label={tr(language, '时间步数', 'Time steps')} value={steps} options={[16, 64, 256].map(n => ({ value: n, label: String(n) }))} onChange={v => setSteps(Number(v))} /><button className="lab-button" type="button" onClick={() => setSeed(seed + 1)}>{tr(language, '换一组路径', 'Draw another sample')}</button><span className="lab-inline-value">seed {seed}</span></>}
    metrics={[{ label: tr(language, '终点样本均值', 'Endpoint sample mean'), value: fmt(mean, 3) }, { label: tr(language, '终点样本方差', 'Endpoint sample variance'), value: variance === null ? '—' : fmt(variance, 3) }, { label: tr(language, '理论终点方差', 'Theoretical endpoint variance'), value: 1 }]}
    note={tr(language, '这是布朗运动在有限时间网格上的高斯样本，点间连线是展示用插值，不是完整连续路径。浅带为 ±2√t：它在每个固定时刻约覆盖 95.45% 的 N(0,t) 分布，不是整条路径的 95% 置信带。伪随机数固定种子可复现。', 'These are Gaussian Brownian samples on a finite time grid; connecting segments interpolate for display and are not the full continuous path. The ±2√t band contains about 95.45% of N(0,t) at each fixed time, not 95% of entire paths. Seeded pseudorandomness makes this sample reproducible.')}>
    <MathSvg title={tr(language, '有限网格布朗样本路径和逐时刻两标准差带', 'Finite-grid Brownian paths with a pointwise two-standard-deviation band')}><CartesianGrid c={c} xticks={[0, 0.25, 0.5, 0.75, 1]} yticks={[-2, -1, 0, 1, 2]} xlabel="t" ylabel="Wₜ" />
      <path d={`${linePath(band, c)}Z`} fill="#dfe8d5" opacity="0.8" />
      {paths.map((points, i) => <path key={i} d={linePath(points, c)} fill="none" stroke={[PALETTE.teal, PALETTE.coral, PALETTE.blue, PALETTE.gold][i % 4]} opacity={count === 24 ? 0.55 : 0.8} strokeWidth={count === 1 ? 2.7 : 1.4} />)}
      <text x={c.x(0.87)} y={c.y(2 * Math.sqrt(0.87)) - 9} textAnchor="middle" fontSize="12" fill={TEXT_PALETTE.muted}>+2√t</text><text x={c.x(0.87)} y={c.y(-2 * Math.sqrt(0.87)) + 18} textAnchor="middle" fontSize="12" fill={TEXT_PALETTE.muted}>−2√t</text>
    </MathSvg>
  </LabFrame>;
}

export function FourierLab({ language }: LabProps) {
  const [terms, setTerms] = useState(4), [showHarmonics, setShowHarmonics] = useState(false);
  const c = coordinates(-Math.PI, Math.PI, -1.6, 1.6);
  const sample = Array.from({ length: 1001 }, (_, i) => -Math.PI + i * Math.PI * 2 / 1000);
  const points = sample.map(x => [x, fourierSquare(x, terms)] as Point), peak = Math.max(...points.map(([, y]) => Math.abs(y)));
  return <LabFrame title={tr(language, '用频率长出一条方波', 'Grow a square wave from frequencies')} formula="Sₙ(x)=⁴⁄π Σₖ₌₀ⁿ⁻¹ sin((2k+1)x)/(2k+1)"
    subtitle={tr(language, '增加谐波会改善整体逼近，但不会消灭跳跃附近的超调比例。', 'More harmonics improve the approximation without eliminating the relative overshoot near a jump.')}
    legend={<><span style={{ color: TEXT_PALETTE.coral }}>{tr(language, '虚线：目标方波', 'Dashed: square-wave target')}</span><span style={{ color: TEXT_PALETTE.teal }}>{tr(language, '实线：有限傅里叶和', 'Solid: finite Fourier sum')}</span></>}
    controls={<><Slider label={tr(language, '奇次谐波数 N', 'Odd harmonics N')} value={terms} min={1} max={25} onChange={setTerms} /><label className="lab-checkbox"><input type="checkbox" checked={showHarmonics} onChange={e => setShowHarmonics(e.target.checked)} />{tr(language, '显示前五个单独分量', 'Show up to five individual terms')}</label></>}
    metrics={[{ label: tr(language, '最高频率', 'Highest frequency'), value: 2 * terms - 1 }, { label: tr(language, '本次网格最大 |Sₙ|', 'Sampled maximum |Sₙ|'), value: fmt(peak, 3) }, { label: tr(language, '跳点 x=0 的截断值', 'Partial sum at jump x=0'), value: 0 }]}
    note={tr(language, '目标是 2π 周期方波 sgn(sin x)，跳点取 0。有限和在跳点趋向左右极限的平均值，不能以连续函数的一致收敛方式逼近这个不连续目标；这里只展示有限截断，并不把数值峰值当成 Gibbs 常数的证明。', 'The target is the 2π-periodic square wave sgn(sin x), with value 0 at jumps. Partial sums converge to the midpoint of the one-sided limits at a jump; continuous partial sums cannot converge uniformly to this discontinuous target. The sampled peak is not a proof of the Gibbs constant.')}>
    <MathSvg title={tr(language, '方波、有限傅里叶和与可选谐波分量', 'Square wave, finite Fourier partial sum and optional harmonics')}><CartesianGrid c={c} xticks={[-Math.PI, -Math.PI / 2, 0, Math.PI / 2, Math.PI]} yticks={[-1, 0, 1]} />
      <path d={linePath([[-Math.PI, -1], [0, -1]], c)} fill="none" stroke={PALETTE.coral} strokeWidth="1.6" strokeDasharray="5 4" /><path d={linePath([[0, 1], [Math.PI, 1]], c)} fill="none" stroke={PALETTE.coral} strokeWidth="1.6" strokeDasharray="5 4" />
      {[[0, -1], [0, 1], [-Math.PI, -1], [Math.PI, 1]].map(([x, y]) => <circle key={`${x},${y}`} cx={c.x(x)} cy={c.y(y)} r="4" fill="#f7f6ec" stroke={PALETTE.coral} strokeWidth="1.5" />)}
      {showHarmonics && Array.from({ length: Math.min(terms, 5) }, (_, k) => <path key={k} d={linePath(sample.map(x => [x, 4 * Math.sin((2 * k + 1) * x) / ((2 * k + 1) * Math.PI)]), c)} stroke={[PALETTE.gold, PALETTE.purple, PALETTE.blue][k % 3]} opacity="0.45" fill="none" strokeWidth="1" />)}
      <path d={linePath(points, c)} fill="none" stroke={PALETTE.teal} strokeWidth="2.7" /><circle cx={c.x(0)} cy={c.y(0)} r="4" fill={PALETTE.teal} />
      {[-Math.PI, Math.PI].map(x => <circle key={x} cx={c.x(x)} cy={c.y(0)} r="4" fill={PALETTE.teal} />)}
    </MathSvg>
  </LabFrame>;
}

export function ComplexLab({ language }: LabProps) {
  const [rho, setRho] = useState(1.5), [angle, setAngle] = useState(60);
  // Equal screen length per real/imaginary unit: complex rotations must stay rotations.
  const theta = angle * Math.PI / 180, z: Point = [1, 0.5], w: Point = [rho * Math.cos(theta), rho * Math.sin(theta)], product = complexMultiply(w, z), c = coordinates(-4.875, 4.875, -3, 3, 640, 420);
  const unit = Array.from({ length: 161 }, (_, i) => [Math.cos(i * Math.PI / 80), Math.sin(i * Math.PI / 80)] as Point), transformed = unit.map(p => complexMultiply(w, p));
  const arc = Array.from({ length: 60 }, (_, i) => { const a = Math.atan2(z[1], z[0]) + theta * i / 59; return [0.5 * Math.cos(a), 0.5 * Math.sin(a)] as Point; });
  return <LabFrame title={tr(language, '复数乘法的旋转与伸缩', 'Complex multiplication rotates and scales')} formula="wz = ρeⁱᶿz"
    subtitle={tr(language, '一个乘数同时决定长度倍率和角度变化。', 'One multiplier determines both length scaling and rotation.')}
    controls={<><Slider label={tr(language, '乘数模长 ρ', 'Multiplier modulus ρ')} value={rho} min={0} max={2.5} step={0.1} onChange={setRho} /><Slider label={tr(language, '旋转角 θ', 'Rotation θ')} value={angle} min={-180} max={180} step={5} onChange={setAngle} display={`${angle}°`} /></>}
    metrics={[{ label: 'z', value: '1 + 0.5i' }, { label: 'wz', value: `${fmt(product[0], 3)} ${product[1] < 0 ? '−' : '+'} ${fmt(Math.abs(product[1]), 3)}i` }, { label: '|wz| / |z|', value: fmt(rho) }]}
    note={tr(language, '非零复数乘法是定向保持的相似变换；模相乘，辐角相加（模 2π）。ρ=0 时所有点塌缩为原点，辐角不再定义。图中的圆是单位圆及其像；这是复数乘法，不是一般复函数都具有同样的全局形状。', 'Multiplication by a nonzero complex number is an orientation-preserving similarity: moduli multiply and arguments add modulo 2π. At ρ=0 every point collapses to the origin and argument is undefined. The circles are the unit circle and its image; general complex functions need not share this global form.')}>
    <MathSvg viewBox="0 0 640 420" title={tr(language, '单位圆及其在复乘法下的像，向量 z 与 wz', 'The unit circle and its image under multiplication, with vectors z and wz')}><CartesianGrid c={c} xlabel="Re" ylabel="Im" />
      <path d={linePath(unit, c)} fill="none" stroke="#9db7a5" strokeDasharray="4 4" strokeWidth="1.5" /><path d={linePath(transformed, c)} fill="#cddfcd33" stroke={PALETTE.teal} strokeWidth="2.5" />
      {unit.filter((_, i) => i % 20 === 0).map((p, i) => { const q = complexMultiply(w, p); return <g key={i}><circle cx={c.x(p[0])} cy={c.y(p[1])} r="3" fill="#91a991" /><circle cx={c.x(q[0])} cy={c.y(q[1])} r="4" fill={PALETTE.teal} /></g>; })}
      <path d={linePath([[0, 0], z], c)} stroke={PALETTE.coral} strokeWidth="2" fill="none" /><path d={linePath([[0, 0], product], c)} stroke={PALETTE.teal} strokeWidth="2.5" fill="none" />
      <PointMark point={c.point(z)} label="z" color={PALETTE.coral} /><PointMark point={c.point(product)} label="wz" color={PALETTE.teal} />{rho > 0 && <path d={linePath(arc, c)} stroke={PALETTE.gold} strokeWidth="2" fill="none" />}
    </MathSvg>
  </LabFrame>;
}

export function OptimizationLab({ language }: LabProps) {
  const [lambda, setLambda] = useState(5), [eta, setEta] = useState(0.18), [iterations, setIterations] = useState(12);
  const model = gradientPath(lambda, eta, iterations), c = coordinates(-5.2, 5.2, -3.2, 3.2, 640, 420), id = useId().replace(/:/g, ''), end = model.points[model.points.length - 1];
  const visible = model.points.map(([x, y]) => [Math.max(-1000, Math.min(1000, x)), Math.max(-1000, Math.min(1000, y))] as Point), outside = Math.abs(end[0]) > c.xmax || Math.abs(end[1]) > c.ymax;
  return <LabFrame title={tr(language, '沿梯度穿过等高线', 'Follow the gradient through level sets')} formula={`f(x,y)=(${lambda}x²+y²)/2`}
    subtitle={tr(language, '地形决定方向，步长决定收敛还是失稳。', 'The landscape sets the direction; step size controls stability.')}
    controls={<><Slider label={tr(language, '条件数 λ', 'Condition number λ')} value={lambda} min={1} max={12} onChange={setLambda} /><Slider label={tr(language, '步长 η', 'Step size η')} value={eta} min={0.02} max={1.2} step={0.02} onChange={setEta} /><Slider label={tr(language, '迭代步数', 'Iterations')} value={iterations} min={0} max={24} onChange={setIterations} /></>}
    metrics={[{ label: tr(language, '当前 f 值', 'Current f value'), value: fmt(model.value(end), 4) }, { label: tr(language, '迭代矩阵谱半径', 'Iteration spectral radius'), value: fmt(model.radius, 3) }, { label: tr(language, '严格收缩条件', 'Strict contraction'), value: tr(language, model.stable ? '满足' : '不满足', model.stable ? 'Satisfied' : 'Not satisfied') }]}
    note={tr(language, `正定二次型的梯度迭代为 x←(1−ηλ)x、y←(1−η)y；这里 λ≥1，严格收缩需要 0<η<2/λ=${fmt(2 / lambda, 3)}。越界轨迹会被图窗裁切，数值输出仍显示实际计算值。`, `For this positive definite quadratic, x←(1−ηλ)x and y←(1−η)y. Since λ≥1, strict contraction requires 0<η<2/λ=${fmt(2 / lambda, 3)}. Trajectories outside the viewport are clipped; the numeric readout retains the actual computed value.`)}>
    <MathSvg viewBox="0 0 640 420" title={tr(language, '二次型等高线与真实梯度下降迭代轨迹', 'Quadratic level sets and the computed gradient-descent trajectory')}>
      <defs><clipPath id={id}><rect x={c.margin} y={c.margin} width={c.width - 2 * c.margin} height={c.height - 2 * c.margin} /></clipPath></defs><CartesianGrid c={c} xticks={[-3, -2, -1, 0, 1, 2, 3]} yticks={[-3, -2, -1, 0, 1, 2, 3]} />
      <g clipPath={`url(#${id})`}>{[0.1, 0.3, 0.7, 1.5, 3, 6, 12, 24].map(level => <path key={level} d={linePath(Array.from({ length: 121 }, (_, i) => [Math.sqrt(2 * level / lambda) * Math.cos(i * Math.PI / 60), Math.sqrt(2 * level) * Math.sin(i * Math.PI / 60)]), c)} fill="none" stroke="#aec7b0" strokeWidth="1" />)}<path d={linePath(visible, c)} fill="none" stroke={model.stable ? PALETTE.teal : PALETTE.coral} strokeWidth="2.2" />{visible.map((p, i) => <circle key={i} cx={c.x(p[0])} cy={c.y(p[1])} r={i === visible.length - 1 ? 5 : 3} fill={model.stable ? PALETTE.teal : PALETTE.coral} opacity={0.4 + i / Math.max(1, visible.length - 1) * 0.6} />)}</g>
      <PointMark point={c.point([0, 0])} label="min f = 0" color={PALETTE.gold} radius={4} />{outside && <text x="320" y="24" textAnchor="middle" fill={TEXT_PALETTE.coral} fontSize="12">{tr(language, '轨迹已超出绘图窗口', 'Trajectory has left the plotting window')}</text>}
    </MathSvg>
  </LabFrame>;
}
