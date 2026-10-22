import { useEffect, useId, useMemo, useState, type ReactNode } from 'react';
import type { ConnectionLabProps, ConnectionSnapshot } from './types';
import { coveringLift, formatPolynomial, IDEAL_PRESETS, idealZeroModel, parseCoefficients, polynomialDegree, type ComplexPoint } from './structure-models';
import './structure.css';

const tr = (language: 'zh' | 'en', zh: string, en: string) => language === 'zh' ? zh : en;
const number = (value: number) => Math.abs(value) < 1e-10 ? '0' : Number(value.toFixed(4)).toString();
const setText = (values: readonly number[]) => values.length ? `{${values.join(', ')}}` : '∅';
const complexText = ([real, imaginary]: ComplexPoint) => `${number(real)} ${imaginary < -1e-10 ? '−' : '+'} ${number(Math.abs(imaginary))}i`;
const point = ([real, imaginary]: ComplexPoint) => [180 + 100 * real, 142 - 100 * imaginary];
const path = (points: ComplexPoint[]) => points.map((p, index) => `${index ? 'L' : 'M'}${point(p).map(number).join(',')}`).join(' ');

function Figure({ language, title, description, children, height = 300 }: { language: 'zh' | 'en'; title: string; description: string; children: ReactNode; height?: number }) {
  const id = useId(), [enlarged, setEnlarged] = useState(false);
  return <figure className="structure-figure"><figcaption>{title}</figcaption><div id={`${id}-figure`} className={`structure-figure-scroll${enlarged ? ' is-enlarged' : ''}`} tabIndex={enlarged ? 0 : undefined} role={enlarged ? 'region' : undefined} aria-label={enlarged ? title : undefined}><svg viewBox={`0 0 360 ${height}`} role="img" aria-labelledby={`${id}-title ${id}-desc`}>
    <title id={`${id}-title`}>{title}</title><desc id={`${id}-desc`}>{description}</desc>{children}
  </svg></div><p>{description}</p><button className="structure-figure-toggle" type="button" aria-pressed={enlarged} aria-controls={`${id}-figure`} onClick={() => setEnlarged(value => !value)}>{tr(language, enlarged ? '适应宽度' : '放大读数', enlarged ? 'Fit width' : 'Enlarge readings')}</button></figure>;
}

function Range({ label, value, min, max, step = 1, onChange, display }: { label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void; display?: string }) {
  const id = useId();
  return <label className="structure-control" htmlFor={id}><span>{label}<output>{display ?? value}</output></span><input id={id} type="range" min={min} max={max} step={step} value={value} onChange={event => onChange(Number(event.target.value))} /></label>;
}

function Table({ caption, headers, children }: { caption: string; headers: string[]; children: ReactNode }) {
  return <div className="structure-table-wrap" role="region" aria-label={caption} tabIndex={0}><table><caption>{caption}</caption><thead><tr>{headers.map(header => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}

function CircleAxes() {
  return <g className="structure-axes"><line x1="59" x2="302" y1="142" y2="142"/><line x1="180" x2="180" y1="21" y2="263"/><circle cx="180" cy="142" r="100" fill="none" strokeWidth="2"/><text x="305" y="147">Re</text><text x="187" y="25">Im</text><text x="283" y="161">1</text></g>;
}

export function CoveringComplexLab({ language, onSnapshot }: ConnectionLabProps) {
  const [n, setN] = useState(3), [k, setK] = useState(0), [winding, setWinding] = useState(1), [progress, setProgress] = useState(1);
  const model = useMemo(() => coveringLift(n, k, winding, progress), [n, k, winding, progress]);
  const snapshot = useMemo(() => ({ parameters: { degree: n, startIndex: k, winding, progress }, observations: {
    baseTurns: model.current.turns, liftedTurns: model.current.turns / n, finalFibreIndex: model.finalIndex,
    baseCurrentlyClosed: model.currentBaseClosed, liftCurrentlyClosed: model.currentLiftClosed, finalLiftClosed: model.finalClosed,
    liftedEndpoint: model.current.lift, fibrePermutation: model.permutation, projectionError: model.projectionError,
  } }), [n, k, winding, progress, model]);
  useEffect(() => { onSnapshot?.(snapshot); }, [onSnapshot, snapshot]);
  const startPoint = point(model.start.lift), liftedPoint = point(model.current.lift), basePoint = point(model.current.base);
  const title = tr(language, '复数幂如何携带一条连续路径', 'How a complex power carries a continuous path');
  return <section className="structure-connection" aria-label={title}>
    <header className="structure-heading"><h3>{title}</h3><p>{tr(language, '同一个底空间端点，能对应不同的提升端点。记录走过的角度，才能保留路径的历史。', 'The same endpoint downstairs can have different lifted endpoints. The accumulated angle retains the history of the path.')}</p></header>
    <div className="structure-formula">γ(t) = exp(2πimt)　·　γ̃ₖ(t) = exp(2πi(mt + k)/n)　·　γ̃ₖ(t)ⁿ = γ(t)</div>
    <div className="structure-pair">
      <Figure language={language} title={tr(language, '覆盖圆周：连续选择一个原像', 'Covering circle: follow one preimage')} description={tr(language, '空心圈是选定起点，实心点是当前提升；其余小点是同一底点的其他原像。', 'The hollow circle is the chosen start; the filled point is the lift. Small dots are the other preimages of the same base point.')}>
        <CircleAxes/><path d={path(model.samples.map(sample => sample.lift))} className="structure-lift-path"/>
        {model.fibre.map((p, index) => <circle key={index} cx={point(p)[0]} cy={point(p)[1]} r={index === k ? 4 : 4.5} fill="#657e73" stroke="#fbfaf4" strokeWidth="2"/>)}
        <circle cx={startPoint[0]} cy={startPoint[1]} r="10" fill="#fbfaf4" stroke="#205f59" strokeWidth="2"/>
        <circle cx={liftedPoint[0]} cy={liftedPoint[1]} r="5.5" fill="#205f59"/>
        <text x="180" y="133" textAnchor="middle" className="structure-large-number">{number(model.current.turns / n)}</text><text x="180" y="155" textAnchor="middle">{tr(language, '从起点累计的圈数', 'turns from start')}</text>
        <text x="180" y="285" textAnchor="middle">z = {complexText(model.current.lift)}</text>
      </Figure>
      <Figure language={language} title={tr(language, '底圆周：复数幂将 z 映到 zⁿ', 'Base circle: the power map sends z to zⁿ')} description={tr(language, '幂映射把提升投回底路径。正绕数逆时针，负绕数顺时针；重复走过的弧在图中重合。', 'The power map projects the lift to the base path. Positive turns are counterclockwise, negative turns clockwise; repeated arcs overlap.')}>
        <CircleAxes/><path d={path(model.samples.map(sample => sample.base))} className="structure-base-path"/>
        <circle cx="280" cy="142" r="10" fill="#fbfaf4" stroke="#8b482d" strokeWidth="2"/>
        <circle cx={basePoint[0]} cy={basePoint[1]} r="5.5" fill="#8b482d"/>
        <text x="180" y="133" textAnchor="middle" className="structure-large-number">{number(model.current.turns)}</text><text x="180" y="155" textAnchor="middle">{tr(language, '累计角度 / 2π', 'accumulated turns')}</text>
        <text x="180" y="285" textAnchor="middle">zⁿ = {complexText(model.current.base)}</text>
      </Figure>
    </div>
    <div className="structure-controls">
      <Range label={tr(language, '覆盖次数 n', 'Covering degree n')} value={n} min={2} max={8} onChange={value => { setN(value); setK(current => Math.min(current, value - 1)); }}/>
      <label className="structure-control"><span>{tr(language, '提升起点 k', 'Lifted start k')}</span><select value={k} onChange={event => setK(Number(event.target.value))}>{Array.from({ length: n }, (_, index) => <option key={index} value={index}>k = {index} · exp(2πi·{index}/{n})</option>)}</select></label>
      <Range label={tr(language, '整条底路径的绕数 m', 'Winding m of the full base loop')} value={winding} min={-8} max={8} onChange={setWinding}/>
      <Range label={tr(language, '路径进度 t', 'Path progress t')} value={progress} min={0} max={1} step={0.01} onChange={setProgress} display={`${Math.round(progress * 100)}%`}/>
    </div>
    <div className="structure-actions"><button type="button" onClick={() => setProgress(0)}>{tr(language, '回到起点', 'Return to the start')}</button><button type="button" onClick={() => setProgress(1)}>{tr(language, '走完当前路径', 'Complete this path')}</button><button type="button" onClick={() => { setWinding(n); setProgress(1); }}>{tr(language, '试走 n 圈', 'Try n full turns')}</button></div>
    <div className="structure-metrics" aria-live="polite">
      <div><span>{tr(language, '完整路径的纤维变化', 'Fibre change after the full loop')}</span><strong>k = {k} → {model.finalIndex}</strong></div>
      <div><span>{tr(language, '完整提升是否闭合', 'Does the full lift close?')}</span><strong>{tr(language, model.finalClosed ? '闭合' : '不闭合', model.finalClosed ? 'Closed' : 'Not closed')} · {n} {model.finalClosed ? '∣' : '∤'} {winding}</strong></div>
      <div><span>{tr(language, '当前路径是否回到各自起点', 'Do the current paths return to their starts?')}</span><strong>{tr(language, `底：${model.currentBaseClosed ? '是' : '否'}；提升：${model.currentLiftClosed ? '是' : '否'}`, `Base: ${model.currentBaseClosed ? 'yes' : 'no'}; lift: ${model.currentLiftClosed ? 'yes' : 'no'}`)}</strong></div>
    </div>
    <p className="structure-explanation">{tr(language, '固定起点后，沿整条路径连续提升；θ = 2πmt 不在每圈后归零。当前进度的 mt 若不是整数，底路径尚未闭合，此时它是累计圈数，不称闭路绕数。完整路径在 t=1 闭合，提升闭合恰当且仅当 n 整除 m。', 'After fixing the start, lift continuously along the entire path; θ = 2πmt is never reset after a turn. If mt is not an integer, the current base path is open: mt is accumulated turns, not a closed-loop winding number. The full base path closes at t=1, and the full lift closes exactly when n divides m.')}</p>
    <details className="structure-details"><summary>{tr(language, '读数：路径样本与全部起点的终点', 'Readings: path samples and every starting fibre')}</summary>
      <Table caption={tr(language, '当前已走路径的五个样本；角度列保留历史', 'Five samples along the current path; angle columns retain its history')} headers={['t', 'θ / 2π', '(θ̃ − θ̃₀) / 2π', 'γ(t)', 'γ̃ₖ(t)']}>{model.checkpoints.map((sample, index) => <tr key={index}><td>{number(sample.t)}</td><td>{number(sample.turns)}</td><td>{number(sample.turns / n)}</td><td>{complexText(sample.base)}</td><td>{complexText(sample.lift)}</td></tr>)}</Table>
      <Table caption={tr(language, '整条闭路在纤维上的置换：k 映到 (k+m) mod n', 'Permutation of the fibre by the full loop: k maps to (k+m) mod n')} headers={['k', tr(language, 't=1 的纤维下标', 'Fibre index at t=1')]}>{model.permutation.map((endpoint, index) => <tr key={index}><th scope="row">{index}</th><td>{endpoint}</td></tr>)}</Table>
    </details>
    <p className="structure-boundary">{tr(language, '范围：S¹ 上的 n 重覆盖及明确给出的连续路径。z=0 不在模型中；复平面上将 z 映到 zⁿ 的映射在 0 处分歧。主值 n 次根可能在割线上跳变，不能替代这里固定起点的连续提升。图上采样用于显示，连续公式定义路径。', 'Scope: the n-fold covering of S¹ and the explicit continuous path above. Zero is outside this model; the complex-plane power map is branched at zero. A principal nth root may jump at its branch cut and cannot replace this continuous lift with a fixed start. Samples draw the path; the formula defines it continuously.')}</p>
  </section>;
}

export function IdealZeroLab({ language, onSnapshot }: ConnectionLabProps) {
  const [p, setP] = useState(5), [rawF, setRawF] = useState('2, 2, 1'), [rawG, setRawG] = useState('3, 1, 1'), [preset, setPreset] = useState('shared');
  const parsed = useMemo(() => {
    const parse = (text: string) => { try { return parseCoefficients(text); } catch { return null; } };
    const f = parse(rawF), g = parse(rawG);
    return { model: f && g ? idealZeroModel(f, g, p) : null, fValid: !!f, gValid: !!g };
  }, [rawF, rawG, p]);
  const model = parsed.model;
  const snapshot = useMemo<ConnectionSnapshot>(() => {
    const observations: ConnectionSnapshot['observations'] = { validInput: !!model };
    if (model) Object.assign(observations, { gcd: model.gcd, bezoutU: model.u, bezoutV: model.v, commonRoots: model.commonRoots, gcdRoots: model.rootsD, unitIdeal: model.unitIdeal, zeroIdeal: model.zeroIdeal, divisionSteps: model.steps.length });
    return { parameters: { prime: p, fCoefficients: rawF, gCoefficients: rawG }, observations };
  }, [p, rawF, rawG, model]);
  useEffect(() => { onSnapshot?.(snapshot); }, [onSnapshot, snapshot]);
  const applyPreset = (id: string) => { const selected = IDEAL_PRESETS.find(item => item.id === id); if (!selected) return; setPreset(id); setP(selected.p); setRawF(selected.f.join(', ')); setRawG(selected.g.join(', ')); };
  const title = tr(language, '从多项式理想到有限域零点', 'From polynomial ideals to finite-field zero sets');
  const plotX = (x: number) => 42 + 280 * x / (p - 1), plotY = (y: number) => 241 - 190 * y / (p - 1);
  const remainders = model ? [model.f, model.g, ...model.steps.map(step => step.remainder)] : [];
  const diagramHeight = Math.max(300, 66 + remainders.length * 42), maximumDegree = model ? Math.max(1, polynomialDegree(model.f), polynomialDegree(model.g)) : 1;
  const controls = <>
    <div className="structure-controls">
      <label className="structure-control"><span>{tr(language, '有辨别力的实验情形', 'Choose a distinguishing case')}</span><select value={preset} onChange={event => applyPreset(event.target.value)}><option value="custom" disabled>{tr(language, '自定义', 'Custom')}</option>{IDEAL_PRESETS.map(item => <option key={item.id} value={item.id}>{item[language]}</option>)}</select></label>
      <label className="structure-control"><span>{tr(language, '系数域 Fₚ', 'Coefficient field Fₚ')}</span><select value={p} onChange={event => { setP(Number(event.target.value)); setPreset('custom'); }}>{[2, 3, 5, 7, 11].map(prime => <option key={prime} value={prime}>p = {prime}</option>)}</select></label>
      <label className="structure-control"><span>{tr(language, 'f：从常数项到最高次的系数', 'f: coefficients from constant term upward')}</span><input type="text" value={rawF} spellCheck={false} aria-invalid={!parsed.fValid} onChange={event => { setRawF(event.target.value); setPreset('custom'); }}/></label>
      <label className="structure-control"><span>{tr(language, 'g：从常数项到最高次的系数', 'g: coefficients from constant term upward')}</span><input type="text" value={rawG} spellCheck={false} aria-invalid={!parsed.gValid} onChange={event => { setRawG(event.target.value); setPreset('custom'); }}/></label>
    </div>
    <p className="structure-input-help">{tr(language, '用逗号分隔 1–7 个整数；例如 2, 2, 1 表示 2+2x+x²。系数按 p 取模，允许零多项式。', 'Enter 1–7 comma-separated integers; for example, 2, 2, 1 means 2+2x+x². Coefficients are reduced modulo p; the zero polynomial is allowed.')}</p>
  </>;
  return <section className="structure-connection" aria-label={title}>
    <header className="structure-heading"><h3>{title}</h3><p>{tr(language, '欧几里得算法把两个生成元化为一个；在同一个有限域里，逐点查看哪些条件同时消失。', 'Euclid’s algorithm replaces two ideal generators by one. Over the same finite field, inspect every point where both conditions vanish.')}</p></header>
    {model && <>
      <div className="structure-formula">F{p}[x]　·　f = {formatPolynomial(model.f)}　·　g = {formatPolynomial(model.g)}<br/>(f, g) = ({formatPolynomial(model.gcd)})</div>
      <div className="structure-pair">
        <Figure language={language} title={tr(language, '代数侧：实际除法得到的余式链', 'Algebra: the computed remainder chain')} height={diagramHeight} description={tr(language, '条长表示多项式次数；零多项式没有次数，记为 0。完整商余等式见下方表格。', 'Bar length encodes polynomial degree. The zero polynomial has no degree and is marked 0. Full division identities appear in the table below.')}>
          {remainders.map((polynomial, index) => { const degree = polynomialDegree(polynomial), lastNonzero = degree >= 0 && index === remainders.length - 2; return <g key={index}>
            <text x="25" y={50 + index * 42}>{index === 0 ? 'f' : index === 1 ? 'g' : `r${index - 1}`}</text>
            {degree >= 0 ? <><rect x="65" y={34 + index * 42} width={10 + degree / maximumDegree * 170} height="23" rx="3" fill={lastNonzero ? '#2d6d64' : '#becdbd'}/><text x={85 + degree / maximumDegree * 170} y={50 + index * 42}>{tr(language, '次数', 'degree')} {degree}</text></> : <text x="72" y={50 + index * 42}>0</text>}
          </g>; })}
          <text x="25" y={diagramHeight - 15}>{tr(language, '运算全在', 'All arithmetic in')} F{p}[x]</text>
        </Figure>
        <Figure language={language} title={tr(language, '几何侧：枚举 Fₚ 的全部点', 'Geometry: enumerate every point of Fₚ')} description={tr(language, '圆点是 f(x)，方框是 g(x)；零线上的绿色环标出共同根。坐标使用剩余类代表，不连接成连续曲线。', 'Circles show f(x); squares show g(x). Green rings on the zero line mark common roots. Coordinates use residue representatives; no continuous curve is implied.')}>
          {Array.from({ length: p }, (_, x) => <g key={x}><line x1={plotX(x)} x2={plotX(x)} y1="43" y2="241" stroke="#dce4da"/><text x={plotX(x)} y="263" textAnchor="middle">{x}</text></g>)}
          {Array.from({ length: p }, (_, y) => <g key={y}><line x1="42" x2="322" y1={plotY(y)} y2={plotY(y)} stroke={y === 0 ? '#6a8074' : '#dce4da'}/><text x="30" y={plotY(y) + 4} textAnchor="end">{y}</text></g>)}
          {model.values.map(row => <g key={row.x}><rect x={plotX(row.x) - 6} y={plotY(row.g) - 6} width="12" height="12" fill="none" stroke="#8b482d" strokeWidth="2"/><circle cx={plotX(row.x)} cy={plotY(row.f)} r="3.5" fill="#244947"/>{row.f === 0 && row.g === 0 && <circle cx={plotX(row.x)} cy={plotY(0)} r="10" fill="none" stroke="#205f59" strokeWidth="2.5"/>}</g>)}
          <text x="330" y="286">x</text><text x="42" y="26">f(x), g(x) ∈ F{p}</text>
        </Figure>
      </div>
    </>}
    {controls}
    {!model ? <p role="alert" className="structure-invalid">{tr(language, '请输入 1–7 个可精确表示的整数系数后再计算。当前输入未产生数学读数。', 'Enter 1–7 safe-integer coefficients to compute. The current input has no mathematical readings.')}</p> : <>
      <div className="structure-metrics" aria-live="polite"><div><span>{tr(language, model.zeroIdeal ? '零理想的生成元' : '首一最大公因式 d', model.zeroIdeal ? 'Generator of the zero ideal' : 'Monic greatest common divisor d')}</span><strong>{formatPolynomial(model.gcd)}</strong></div><div><span>V(f) ∩ V(g)</span><strong>{setText(model.commonRoots)}</strong></div><div><span>V(d)</span><strong>{setText(model.rootsD)}</strong></div></div>
      <div className="structure-proof"><h4>{tr(language, '为什么两个侧面一致', 'Why the two sides agree')}</h4><p>{tr(language, '计算出的 Bézout 恒等式：', 'Computed Bézout identity:')}</p><code>{formatPolynomial(model.gcd)} = ({formatPolynomial(model.u)})·f + ({formatPolynomial(model.v)})·g</code>
        {model.quotients ? <><p><code>f = ({formatPolynomial(model.quotients.f)})·d;　g = ({formatPolynomial(model.quotients.g)})·d</code></p><p>{tr(language, '前一个等式说明 d∈(f,g)，后两个等式说明 f,g∈(d)，所以 (f,g)=(d)。逐点代入即得 V(f)∩V(g)=V(d)。', 'The first identity puts d in (f,g); the next two put f and g in (d). Thus (f,g)=(d), and evaluation at each point gives V(f)∩V(g)=V(d).')}</p></> : <p>{tr(language, 'f=g=0，所以 (f,g)=(0)，而 Fₚ 的每个元素都是共同零点。这里不把 0 称为首一多项式，也不执行除以 0。', 'Here f=g=0, so (f,g)=(0) and every element of Fₚ is a common zero. Zero is not called monic and no division by zero is performed.')}</p>}
      </div>
      <p className="structure-boundary">{tr(language, '根集相同不能反推理想相同。这个实验只枚举 Fₚ 的有理点：非恒定多项式可能没有 Fₚ 内的根，点集也会遗忘因子的重数。', 'Equal root sets do not imply equal ideals. This experiment enumerates only Fₚ-rational points: a nonconstant polynomial can have no root in Fₚ, and point sets forget factor multiplicities.')}{!model.unitIdeal && !model.zeroIdeal && !model.commonRoots.length && <strong> {tr(language, '当前就出现：根集为空，但 (d) 仍是非单位理想。', 'This occurs now: the root set is empty, yet (d) is a proper ideal.')}</strong>}</p>
      <details className="structure-details"><summary>{tr(language, '查看每一步除法与全部点值', 'Inspect every division and every point value')}</summary>
        {model.steps.length ? <Table caption={tr(language, '欧几里得算法：a=q·b+r（系数模 p）', 'Euclid’s algorithm: a=q·b+r, coefficients modulo p')} headers={['a', 'q', 'b', 'r']}>{model.steps.map((step, index) => <tr key={index}><td>{formatPolynomial(step.dividend)}</td><td>{formatPolynomial(step.quotient)}</td><td>{formatPolynomial(step.divisor)}</td><td>{formatPolynomial(step.remainder)}</td></tr>)}</Table> : <p>{tr(language, '第二个生成元为 0，无需执行多项式除法。', 'The second generator is zero; no polynomial division is needed.')}</p>}
        <Table caption={tr(language, `F${p} 的所有 ${p} 个元素；没有抽样`, `All ${p} elements of F${p}; no sampling`)} headers={['x', 'f(x)', 'g(x)', 'd(x)', tr(language, '共同零点', 'Common zero')]}>{model.values.map(row => <tr key={row.x}><th scope="row">{row.x}</th><td>{row.f}</td><td>{row.g}</td><td>{row.d}</td><td>{tr(language, row.f === 0 && row.g === 0 ? '是' : '否', row.f === 0 && row.g === 0 ? 'Yes' : 'No')}</td></tr>)}</Table>
      </details>
      <p className="structure-scope">{tr(language, '范围：单变量多项式环 Fₚ[x]，输入最高六次。该环中的欧几里得算法与 Bézout 恒等式给出这里的理想等式；有限域点的枚举不是一般 Hilbert 零点定理的证明。', 'Scope: the univariate polynomial ring Fₚ[x], with inputs of degree at most six. Euclid’s algorithm and Bézout identities give the ideal equality here; enumerating finite-field points is not a proof of the general Hilbert Nullstellensatz.')}</p>
    </>}
  </section>;
}
