import { useMemo, useState } from 'react';
import { CartesianGrid, coordinates, fmt, LabFrame, linePath, MathSvg, PALETTE, TEXT_PALETTE, PointMark, Select, Slider, tr, type LabProps, type Point } from './common';
import { cubicBranches, dihedralCompose, dihedralName, dihedralPoint, ellipticAdd, ellipticDiscriminant, interpolateMod, mod, polynomialMod, sieve, type Dihedral } from './models';

export function SieveLab({ language }: LabProps) {
  const [limit, setLimit] = useState(120), [passes, setPasses] = useState(2);
  const result = sieve(limit, passes), columns = 12, rows = Math.ceil(limit / columns), height = 46 + rows * 25;
  return <LabFrame title={tr(language, '素数的筛床', 'A nursery for primes')} formula="p², p²+p, p²+2p, …"
    subtitle={tr(language, '一轮只筛去当前素数的合数倍数。', 'Each pass removes composite multiples of one prime.')}
    controls={<><Select label={tr(language, '观察到', 'Integer limit')} value={limit} options={[60, 120, 180].map(n => ({ value: n, label: String(n) }))} onChange={v => { setLimit(Number(v)); setPasses(0); }} /><Slider label={tr(language, '完成筛轮', 'Completed passes')} value={Math.min(passes, result.primes.length)} min={0} max={result.primes.length} onChange={setPasses} /><button type="button" className="lab-button" onClick={() => setPasses(Math.min(passes + 1, result.primes.length))} disabled={result.complete}>{tr(language, '再筛一轮', 'Next prime pass')}</button></>}
    metrics={[{ label: tr(language, '已使用的素数', 'Prime passes'), value: result.used.join(' · ') || '—' }, { label: tr(language, result.complete ? '素数个数' : '待确认候选', result.complete ? 'Primes remaining' : 'Unresolved candidates'), value: result.survivors.length }]}
    note={tr(language, '1 不属于素数。每轮从 p² 开始，因为更小的合数倍数已被较小的素数筛去；完成所有 p≤√N 的轮次后，幸存者才全是素数。', '1 is not prime. Start at p²: smaller composite multiples were removed by smaller primes. Only after every p≤√N pass are all survivors certified prime by the sieve argument.')}>
    <MathSvg title={tr(language, '整数筛选网格，未筛者为深色、合数为浅色并画删除线', 'Integer grid: surviving candidates are dark; eliminated composites are pale and crossed out')} viewBox={`0 0 640 ${height}`}>
      {Array.from({ length: limit }, (_, i) => i + 1).map(n => { const x = 24 + ((n - 1) % columns) * 49.5, y = 22 + Math.floor((n - 1) / columns) * 25, removed = result.removed.has(n), primePass = result.used.includes(n); return <g key={n}><rect x={x} y={y} width="42" height="21" rx="5" fill={n === 1 ? '#e7e5db' : removed ? '#e8e8dd' : primePass ? PALETTE.teal : '#d5e6d9'} /><text x={x + 21} y={y + 15} textAnchor="middle" fill={primePass ? 'white' : removed || n === 1 ? TEXT_PALETTE.muted : TEXT_PALETTE.ink} fontSize="12" fontWeight={removed ? 400 : 650}>{n}</text>{removed && <path d={`M${x + 11},${y + 16}L${x + 31},${y + 5}`} stroke="#aeb8a9" strokeWidth="1" />}</g>; })}
    </MathSvg>
  </LabFrame>;
}

export function EllipticLab({ language }: LabProps) {
  const [mode, setMode] = useState('secant');
  const a = mode === 'singular' ? 0 : -1, b = mode === 'singular' ? 0 : 1;
  const p: Point = [0, 1], q: Point = mode === 'tangent' ? [0, 1] : mode === 'inverse' ? [0, -1] : [1, 1];
  const sum = mode === 'singular' ? null : ellipticAdd(p, q, a), disc = ellipticDiscriminant(a, b);
  const c = coordinates(-2.1, 2.3, -2.6, 2.6);
  const branches = useMemo(() => cubicBranches(a, b, -2.1, 2.3, 2.6), [a, b]);
  const slope = mode === 'tangent' ? a / 2 : 0;
  return <LabFrame title={tr(language, '割线与反射的群运算', 'Addition by secant and reflection')} formula={`y² = x³ ${a ? '− x + 1' : ''}`}
    subtitle={tr(language, '曲线上的点相加，结果仍在曲线上。', 'Add two curve points and remain on the curve.')}
    controls={<Select label={tr(language, '构造情形', 'Construction')} value={mode} options={[{ value: 'secant', label: tr(language, '割线：P + Q', 'Secant: P + Q') }, { value: 'tangent', label: tr(language, '切线：P + P', 'Tangent: P + P') }, { value: 'inverse', label: tr(language, '互逆：P + (−P)', 'Inverses: P + (−P)') }, { value: 'singular', label: tr(language, '奇异边界：y² = x³', 'Singular boundary: y² = x³') }]} onChange={setMode} />}
    metrics={[{ label: tr(language, '判别式 Δ', 'Discriminant Δ'), value: disc }, { label: tr(language, '和点', 'Sum'), value: mode === 'singular' ? tr(language, '光滑群律条件失效', 'Smoothness fails') : sum ? `(${fmt(sum[0], 4)}, ${fmt(sum[1], 4)})` : '𝒪' }]}
    note={tr(language, '这里观察实平面上的光滑 Weierstrass 曲线，并补入无穷远点 𝒪。割线（重合时取切线）的第三交点再关于 x 轴反射。Δ=0 时曲线奇异，不能把同一光滑椭圆曲线群律声明直接照搬。', 'This real Weierstrass curve includes the point at infinity 𝒪. Reflect the third secant intersection (or tangent intersection for doubling) across the x-axis. Δ=0 is singular: the smooth elliptic-curve group-law claim does not transfer unchanged.')}>
    <MathSvg title={tr(language, '椭圆曲线与割线群运算', 'Elliptic curve with secant construction')}><CartesianGrid c={c} xticks={[-2, -1, 0, 1, 2]} yticks={[-2, -1, 0, 1, 2]} />
      {branches.map((points, i) => <path key={i} d={linePath(points, c)} fill="none" stroke={PALETTE.teal} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />)}
      {mode !== 'singular' && <>{mode === 'inverse' ? <line x1={c.x(0)} x2={c.x(0)} y1={c.y(-2.4)} y2={c.y(2.4)} stroke={PALETTE.coral} strokeWidth="1.5" strokeDasharray="5 4" /> : <path d={linePath([[-2, 1 + slope * -2], [2.1, 1 + slope * 2.1]], c)} stroke={PALETTE.coral} strokeWidth="1.5" strokeDasharray="5 4" fill="none" />}
        <PointMark point={c.point(p)} label={mode === 'tangent' ? 'P = Q' : 'P'} color={PALETTE.coral} />{mode !== 'tangent' && <PointMark point={c.point(q)} label="Q" color={PALETTE.gold} />}
        {sum && <><line x1={c.x(sum[0])} x2={c.x(sum[0])} y1={c.y(-sum[1])} y2={c.y(sum[1])} stroke={PALETTE.purple} strokeDasharray="3 4" /><PointMark point={c.point([sum[0], -sum[1]])} label="R" color={PALETTE.purple} /><PointMark point={c.point(sum)} label="P + Q" color={PALETTE.teal} radius={6} /></>}
        {!sum && <text x="440" y="55" fill={TEXT_PALETTE.coral} fontSize="17">P + (−P) = 𝒪</text>}</>}
      {mode === 'singular' && <PointMark point={c.point([0, 0])} label={tr(language, '尖点', 'cusp')} color={PALETTE.coral} radius={7} />}
    </MathSvg>
  </LabFrame>;
}

export function GroupLab({ language }: LabProps) {
  const [aIndex, setA] = useState(1), [bIndex, setB] = useState(4);
  const element = (i: number): Dihedral => ({ rotation: i % 4, reflection: i >= 4 });
  const a = element(aIndex), b = element(bIndex), ab = dihedralCompose(a, b), ba = dihedralCompose(b, a), commute = dihedralName(ab) === dihedralName(ba);
  const colors = [PALETTE.teal, PALETTE.coral, PALETTE.gold, PALETTE.purple];
  const square: Point[] = [[-1, 1], [1, 1], [1, -1], [-1, -1]];
  const options = Array.from({ length: 8 }, (_, i) => ({ value: i, label: dihedralName(element(i)) }));
  return <LabFrame title={tr(language, '对称操作的栖息地', 'Where symmetries compose')} formula="D₄ = ⟨r,s | r⁴=s²=e, sr=r⁻¹s⟩"
    subtitle={tr(language, '保留顶点编号，才能看见组合顺序。', 'Keep vertex identities visible to see the order of composition.')}
    controls={<><Select label="A" value={aIndex} options={options} onChange={v => setA(Number(v))} /><Select label="B" value={bIndex} options={options} onChange={v => setB(Number(v))} /><button className="lab-button" type="button" onClick={() => { setA(bIndex); setB(aIndex); }}>{tr(language, '交换顺序', 'Swap the order')}</button></>}
    metrics={[{ label: tr(language, '先 B 后 A', 'B first, then A'), value: dihedralName(ab) }, { label: tr(language, '先 A 后 B', 'A first, then B'), value: dihedralName(ba) }, { label: tr(language, '本次是否可交换', 'Do these commute?'), value: tr(language, commute ? '是' : '否', commute ? 'Yes' : 'No') }]}
    note={tr(language, 'r 为逆时针 90° 旋转，s 为关于水平轴的反射，乘积按从右到左作用。这是正方形的 8 个对称，不是所有 4! 个顶点排列；多数旋转与反射不交换。', 'r rotates 90° counterclockwise; s reflects across the horizontal axis. Products act right to left. These are the square’s 8 symmetries, not all 4! vertex permutations. Rotations and reflections need not commute.')}>
    <MathSvg title={tr(language, '相同编号顶点在不同对称组合下的位置', 'Labelled vertices under different symmetry compositions')}>
      {[{ g: { rotation: 0, reflection: false }, label: tr(language, '原方形', 'Original') }, { g: ab, label: `A ∘ B = ${dihedralName(ab)}` }, { g: ba, label: `B ∘ A = ${dihedralName(ba)}` }].map(({ g, label }, j) => { const cx = 115 + j * 205, cy = 160; return <g key={label}><circle cx={cx} cy={cy} r="93" fill="#edf0e4" /><path d={linePath([...square, square[0]].map(([x, y]) => [cx + x * 60, cy - y * 60]))} stroke="#b8c9bb" strokeWidth="1.5" fill="none" strokeDasharray="4 5" /><path d={linePath([...square, square[0]].map(v => dihedralPoint(g, v)).map(([x, y]) => [cx + x * 60, cy - y * 60]))} stroke={PALETTE.teal} strokeWidth="2" fill="#d4e5d54d" />{square.map((p, i) => { const [x, y] = dihedralPoint(g, p); return <g key={i}><circle cx={cx + x * 60} cy={cy - y * 60} r="13" fill={colors[i]} /><text x={cx + x * 60} y={cy - y * 60 + 4} textAnchor="middle" fill={i === 0 ? 'white' : '#111111'} fontSize="12" fontWeight="700">{i + 1}</text></g>; })}<text x={cx} y="280" textAnchor="middle" className="lab-diagram-title">{label}</text></g>; })}
    </MathSvg>
  </LabFrame>;
}

export function FiniteFieldLab({ language }: LabProps) {
  const [p, setP] = useState(7), [coefficients, setCoefficients] = useState([2, 1, 2]), [known, setKnown] = useState([0, 2, 4]);
  const points: Point[] = Array.from({ length: p }, (_, x) => [x, polynomialMod(coefficients, x, p)]), selected = points.filter(([x]) => known.includes(x));
  const recovered = selected.length === 3 ? points.every(([x, y]) => interpolateMod(selected, x, p) === y) : false;
  const c = coordinates(-0.5, p - 0.5, -0.5, p - 0.5);
  function changePrime(next: number) { setP(next); setCoefficients(coefficients.map(n => mod(n, next))); setKnown([0, 1, 2]); }
  function toggle(x: number) { setKnown(known.includes(x) ? known.filter(v => v !== x) : [...known.slice(-2), x]); }
  return <LabFrame title={tr(language, '有限域上的插值珊瑚', 'Interpolation in a finite field')} formula={`f(x) = ${coefficients[0]} + ${coefficients[1]}x + ${coefficients[2]}x² (mod ${p})`}
    subtitle={tr(language, '保留三个互异坐标，其余码字符号可以恢复。', 'Retain three distinct coordinates to recover the erased symbols.')}
    legend={<><span style={{ color: TEXT_PALETTE.teal }}>{tr(language, '实心：保留的求值', 'Filled: retained evaluation')}</span><span style={{ color: TEXT_PALETTE.coral }}>{tr(language, '空心：被擦除的求值', 'Open: erased evaluation')}</span></>}
    controls={<><Select label={tr(language, '素数域', 'Prime field')} value={p} options={[5, 7, 11].map(n => ({ value: n, label: `𝔽${n}` }))} onChange={v => changePrime(Number(v))} />{coefficients.map((v, i) => <Slider key={i} label={`a${['₀', '₁', '₂'][i]}`} value={v} min={0} max={p - 1} onChange={n => setCoefficients(coefficients.map((a, j) => i === j ? n : a))} />)}<div className="lab-choice-row" role="group" aria-label={tr(language, '选择已知坐标', 'Choose retained coordinates')}>{points.map(([x]) => <button key={x} type="button" className={`lab-choice ${known.includes(x) ? 'is-active' : ''}`} aria-pressed={known.includes(x)} onClick={() => toggle(x)}>x={x}</button>)}</div></>}
    metrics={[{ label: tr(language, '保留符号', 'Known symbols'), value: `${selected.length} / 3` }, { label: tr(language, '唯一恢复', 'Unique recovery'), value: tr(language, recovered ? '全部坐标一致' : '还需三个互异点', recovered ? 'Every coordinate matches' : 'Need three distinct points') }, { label: tr(language, '码参数 [n,k,d]', 'Code parameters [n,k,d]'), value: `[${p}, 3, ${p - 2}]` }]}
    data={<details className="lab-data"><summary>{tr(language, '逐个检查码字符号', 'Inspect each codeword symbol')}</summary><table><thead><tr><th scope="col">x</th><th scope="col">{tr(language, '保留值', 'Retained')}</th><th scope="col">{tr(language, '插值恢复', 'Recovered')}</th><th scope="col">f(x)</th></tr></thead><tbody>{points.map(([x, y]) => <tr key={x}><th scope="row">{x}</th><td>{known.includes(x) ? y : '—'}</td><td>{recovered ? interpolateMod(selected, x, p) : '—'}</td><td>{y}</td></tr>)}</tbody></table></details>}
    note={tr(language, '此处次数 <3，且所有运算在素域中进行。三个正确的互异取值可恢复多项式；这是已知丢失位置的擦除恢复，不等于三个含任意错误的取值仍能恢复。网格只排列域元素，不赋予有限域欧氏距离。', 'Degree is <3 and all arithmetic is in a prime field. Three correct values at distinct points recover the polynomial. This is erasure recovery, not a guarantee for three arbitrarily corrupted values. Grid positions label field elements; they do not define a Euclidean field metric.')}>
    <MathSvg title={tr(language, '有限域多项式取值，实心点是保留坐标', 'Polynomial evaluations over a prime field; filled points are retained coordinates')}><CartesianGrid c={c} xticks={points.map(v => v[0])} yticks={points.filter(([x]) => p < 11 || x % 2 === 0).map(v => v[0])} xlabel="x ∈ 𝔽ₚ" ylabel="f(x)" />{points.map(([x, y]) => <circle key={x} cx={c.x(x)} cy={c.y(y)} r={known.includes(x) ? 9 : 6} fill={known.includes(x) ? PALETTE.teal : 'none'} stroke={known.includes(x) ? PALETTE.teal : PALETTE.coral} strokeWidth="2" />)}</MathSvg>
  </LabFrame>;
}
