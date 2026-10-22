import { useMemo, useState } from 'react';
import { fmt, LabFrame, linePath, MathSvg, PALETTE, TEXT_PALETTE, Select, Slider, tr, type LabProps, type Point } from './common';
import { monotoneMap, squareCommutes, squareComplex } from './models';
import { angleDeficits, project3d, surfaceMesh } from './surface-models';

export function CoveringLab({ language }: LabProps) {
  const [sheets, setSheets] = useState(3), [angle, setAngle] = useState(360);
  const theta = Math.min(angle, sheets * 360), radians = theta * Math.PI / 180, lifted = radians / sheets;
  const point = (cx: number, phi: number): Point => [cx + 95 * Math.cos(phi), 165 - 95 * Math.sin(phi)];
  const closed = Math.abs(Math.sin(lifted / 2)) < 1e-8;
  const arc = Array.from({ length: 241 }, (_, i) => point(160, lifted * i / 240));
  return <LabFrame title={tr(language, '沿覆盖空间抬起一条路', 'Lift a path through a covering')} formula={`p(z)=z${['', '', '²', '³', '⁴', '⁵', '⁶'][sheets]}`}
    subtitle={tr(language, '底空间转一圈，提升路径未必已经闭合。', 'One loop downstairs need not close the lifted path upstairs.')}
    controls={<><Slider label={tr(language, '覆盖层数 n', 'Covering degree n')} value={sheets} min={2} max={6} onChange={n => { setSheets(n); setAngle(Math.min(angle, n * 360)); }} /><Slider label={tr(language, '底路径角度', 'Base-path angle')} value={theta} min={0} max={sheets * 360} step={15} onChange={setAngle} display={`${theta}°`} /><button className="lab-button" type="button" onClick={() => setAngle(Math.min(theta + 360, sheets * 360))} disabled={theta === sheets * 360}>{tr(language, '再走一圈', 'One more loop')}</button><button className="lab-button lab-button-quiet" type="button" onClick={() => setAngle(0)}>{tr(language, '回到起点', 'Reset path')}</button></>}
    metrics={[{ label: tr(language, '底路径圈数', 'Turns downstairs'), value: fmt(theta / 360) }, { label: tr(language, '提升路径圈数', 'Turns upstairs'), value: fmt(theta / (360 * sheets)) }, { label: tr(language, '提升端点回到 1？', 'Lift returns to 1?'), value: tr(language, closed ? '是' : '尚未', closed ? 'Yes' : 'Not yet') }]}
    note={tr(language, '模型为 S¹→S¹ 的 n 重覆盖，固定提升起点 z=1。路径 e^{it} 的提升是 e^{it/n}；连续抬起路径时不能每圈把角度强行归零。离散显示点只用于绘图，公式给出整条连续路径。', 'This is the n-fold covering S¹→S¹, with the lifted start fixed at z=1. The lift of e^{it} is e^{it/n}; do not reset its accumulated angle after each base loop. Display samples draw a continuously defined path.')}>
    <MathSvg title={tr(language, '左为覆盖圆周及提升路径，右为底圆周及原路径', 'The covering circle and lifted path on the left; the base circle and path on the right')}>
      {[160, 480].map(cx => <g key={cx}><circle cx={cx} cy="165" r="95" fill="none" stroke="#c7d9c9" strokeWidth="10" /><circle cx={cx} cy="165" r="95" fill="none" stroke="#96b29d" strokeWidth="1" /></g>)}
      <path d={linePath(arc)} fill="none" stroke={PALETTE.teal} strokeWidth="5" strokeLinecap="round" />
      <path d={linePath(Array.from({ length: 241 }, (_, i) => point(480, radians * i / 240)))} fill="none" stroke={PALETTE.coral} strokeWidth="5" strokeLinecap="round" />
      {Array.from({ length: sheets }, (_, k) => { const p = point(160, lifted + k * Math.PI * 2 / sheets); return <g key={k}><circle cx={p[0]} cy={p[1]} r={k === 0 ? 9 : 5} fill={k === 0 ? PALETTE.teal : '#afc6b6'} stroke="#fcfbf4" strokeWidth="2" />{k === 0 && <text x={p[0] + 12} y={p[1] - 12} fill={TEXT_PALETTE.teal} fontSize="12">γ̃(t)</text>}</g>; })}
      <circle cx={point(480, radians)[0]} cy={point(480, radians)[1]} r="9" fill={PALETTE.coral} stroke="#fcfbf4" strokeWidth="2" />
      <path d="M286 165H354M345 159L355 165L345 171" stroke={PALETTE.ink} fill="none" strokeWidth="1.5" /><text className="lab-math-label" x="320" y="148" textAnchor="middle" fontSize="16" fill={TEXT_PALETTE.ink}>z ↦ zⁿ</text>
      <text x="160" y="298" textAnchor="middle" className="lab-diagram-title">{tr(language, '覆盖圆周 · n 个原像', 'Cover · n preimages')}</text><text x="480" y="298" textAnchor="middle" className="lab-diagram-title">{tr(language, '底圆周 · 原路径', 'Base · original path')}</text>
      <text x="160" y="168" textAnchor="middle" fontSize="25" fill={TEXT_PALETTE.teal}>{fmt(theta / sheets)}°</text><text x="480" y="168" textAnchor="middle" fontSize="25" fill={TEXT_PALETTE.coral}>{theta}°</text>
    </MathSvg>
  </LabFrame>;
}

export function HomologyLab({ language }: LabProps) {
  const [mode, setMode] = useState<'filled' | 'hole' | 'cut' | 'separate'>('hole'), [chain, setChain] = useState('all');
  const model = squareComplex(mode), chosen = chain === 'all' ? model.faces.map(() => 1) : model.faces.map((_, i) => Number(i === 0));
  const boundary = model.edges.map((_, i) => model.d2[i].reduce((sum, a, j) => sum + a * chosen[j], 0) % 2);
  const boundaryVertices = model.vertices.map((_, i) => model.d1[i].reduce((sum, a, j) => sum + a * boundary[j], 0) % 2);
  const point = (i: number): Point => [184 + model.points[i][0] * 82, 40 + model.points[i][1] * 82];
  return <LabFrame title={tr(language, '把洞写进边界算子', 'Write a hole into the boundary operators')} formula="C₂ →∂₂ C₁ →∂₁ C₀; ∂₁∂₂=0"
    subtitle={tr(language, '橙色二维链的边界是线；边界的边界为空。', 'The boundary of an orange 2-chain is a set of edges; its boundary is zero.')}
    controls={<><Select label={tr(language, '复形形状', 'Complex')} value={mode} options={[{ value: 'filled', label: tr(language, '填满', 'Filled square') }, { value: 'hole', label: tr(language, '挖一个洞', 'One hole') }, { value: 'cut', label: tr(language, '把洞切开', 'Cut the hole open') }, { value: 'separate', label: tr(language, '分成两块', 'Two components') }]} onChange={v => setMode(v as typeof mode)} /><Select label={tr(language, '选择二维链', 'Choose a 2-chain')} value={chain} options={[{ value: 'all', label: tr(language, '全部三角形之和', 'Sum of all triangles') }, { value: 'one', label: tr(language, '单个三角形', 'One triangle') }]} onChange={setChain} /></>}
    metrics={[{ label: 'β₀', value: model.betti[0] }, { label: 'β₁', value: model.betti[1] }, { label: tr(language, '∂₁∂₂ 的非零顶点', 'Nonzero vertices in ∂₁∂₂'), value: boundaryVertices.reduce((a, b) => a + b, 0) }, { label: 'V − E + F', value: model.vertices.length - model.edges.length + model.faces.length }]}
    note={tr(language, '这是有限三角复形上的 F₂ 系数单纯同调。公共边出现两次便相消。β₁ 由两个边界矩阵的秩计算，不是对图片数洞的猜测；这里没有二维闭壳，所以 β₂=0。', 'This is simplicial homology of a finite triangle complex over F₂. Shared edges cancel in pairs. β₁ is calculated from boundary-matrix ranks, not guessed from the picture. These planar examples have β₂=0.')}>
    <MathSvg title={tr(language, '二维链、一次边界与计算出的 Betti 数', 'A 2-chain, its boundary, and calculated Betti numbers')}>
      {model.faces.map((face, i) => <polygon key={i} points={face.map(v => point(v).join(',')).join(' ')} fill={chosen[i] ? '#ddc3a0' : '#e6eddf'} stroke="#c5d2bf" strokeWidth="1" />)}
      {model.edges.map(([a, b], i) => boundary[i] ? <path key={i} d={linePath([point(a), point(b)])} stroke={PALETTE.teal} strokeWidth="4" strokeLinecap="round" /> : null)}
      {model.vertices.map((v, i) => <circle key={v} cx={point(v)[0]} cy={point(v)[1]} r="4" fill={boundaryVertices[i] ? PALETTE.coral : PALETTE.ink} />)}
      <text x="42" y="83" fontSize="14" fill={TEXT_PALETTE.coral}>c ∈ C₂</text><text x="42" y="114" fontSize="14" fill={TEXT_PALETTE.teal}>∂₂c ∈ C₁</text><text x="42" y="145" fontSize="14" fill={TEXT_PALETTE.ink}>∂₁(∂₂c) = 0</text>
      <text x="514" y="111" fontSize="13" fill={TEXT_PALETTE.muted}>dim C₂ = {model.faces.length}</text><text x="514" y="140" fontSize="13" fill={TEXT_PALETTE.muted}>dim C₁ = {model.edges.length}</text><text x="514" y="169" fontSize="13" fill={TEXT_PALETTE.muted}>dim C₀ = {model.vertices.length}</text>
    </MathSvg>
  </LabFrame>;
}

export function GeometryLab({ language }: LabProps) {
  const [kind, setKind] = useState<'tetrahedron' | 'octahedron' | 'torus'>('torus'), [yaw, setYaw] = useState(28), [radius, setRadius] = useState(0.62);
  const mesh = useMemo(() => surfaceMesh(kind, radius), [kind, radius]), curv = useMemo(() => angleDeficits(mesh), [mesh]);
  const projected = mesh.vertices.map(v => project3d(v, yaw * Math.PI / 180)), display = projected.map(([x, y]) => [320 + 95 * x, 165 + 95 * y] as Point);
  const ordered = mesh.faces.map((face, i) => ({ face, i, z: face.reduce((sum, v) => sum + projected[v][2], 0) / 3 })).sort((a, b) => a.z - b.z);
  return <LabFrame title={tr(language, '曲率汇入一个拓扑总量', 'Curvature adds up to topology')} formula="Σᵥ(2π − Σ angles at v) = 2πχ"
    subtitle={tr(language, '在闭合三角网格上，逐顶点计算角亏。', 'Calculate angle deficits at every vertex of a closed triangular mesh.')}
    legend={<><span style={{ color: TEXT_PALETTE.teal }}><i aria-hidden="true" style={{ backgroundColor: PALETTE.teal }} />{tr(language, '正角亏', 'Positive deficit')}</span><span style={{ color: TEXT_PALETTE.coral }}><i aria-hidden="true" style={{ backgroundColor: PALETTE.coral }} />{tr(language, '负角亏', 'Negative deficit')}</span><span>{tr(language, '大小随 |角亏| 增长', 'Size shows |deficit|')}</span></>}
    controls={<><Select label={tr(language, '闭曲面网格', 'Closed surface mesh')} value={kind} options={[{ value: 'tetrahedron', label: tr(language, '正四面体', 'Regular tetrahedron') }, { value: 'octahedron', label: tr(language, '正八面体', 'Regular octahedron') }, { value: 'torus', label: tr(language, '环面', 'Torus') }]} onChange={v => setKind(v as typeof kind)} /><Slider label={tr(language, '视角', 'Viewing angle')} min={0} max={180} value={yaw} onChange={setYaw} display={`${yaw}°`} />{kind === 'torus' && <Slider label={tr(language, '管半径', 'Tube radius')} min={0.3} max={0.9} step={0.05} value={radius} onChange={setRadius} />}</>}
    metrics={[{ label: 'χ = V − E + F', value: curv.euler }, { label: tr(language, '总角亏 / π', 'Total deficit / π'), value: fmt(curv.total / Math.PI, 6) }, { label: '2χ', value: 2 * curv.euler }, { label: tr(language, '顶点数', 'Vertices'), value: mesh.vertices.length }]}
    note={tr(language, '展示的是离散 Gauss–Bonnet：每个平面三角形内角和为 π，闭合网格满足 3F=2E。环面的正负角亏相抵，曲率分布会随形状改变。它对应平滑理论，但不是用有限图像证明一般平滑定理。', 'This is discrete Gauss–Bonnet: each flat triangle has angle sum π and a closed triangular mesh satisfies 3F=2E. Positive and negative torus deficits cancel; their distribution changes with shape. This is a discrete counterpart, not a finite-image proof of the general smooth theorem.')}>
    <MathSvg title={tr(language, '三角网格曲面，绿色顶点为正角亏、橙色为负角亏', 'Triangular surface mesh: teal vertices have positive deficit and orange vertices negative deficit')}>
      {ordered.map(({ face, i, z }) => <polygon key={i} points={face.map(v => display[v].join(',')).join(' ')} fill={z > 0 ? '#d5dfcd' : '#e7e8db'} stroke="#91aa94" strokeWidth="0.65" />)}
      {projected.map((v, i) => ({ v, i })).filter(({ v }) => kind !== 'torus' || v[2] > -0.18).sort((a, b) => a.v[2] - b.v[2]).map(({ i }) => <circle key={i} cx={display[i][0]} cy={display[i][1]} r={kind === 'torus' ? 1.5 + Math.sqrt(Math.abs(curv.deficits[i])) * 7 : 7} fill={curv.deficits[i] >= 0 ? PALETTE.teal : PALETTE.coral} stroke="#f9f6e9" strokeWidth="0.65" />)}
    </MathSvg>
  </LabFrame>;
}

export function CategoryLab({ language }: LabProps) {
  const [mode, setMode] = useState('functor'), [mapping, setMapping] = useState('identity'), [shift, setShift] = useState(0);
  const maps: Record<string, number[]> = { identity: [0, 1, 2], collapse: [0, 0, 2], reverse: [2, 1, 0] }, values = maps[mapping], valid = monotoneMap(values);
  const f = [1, 2, 0], g = [2, 0, 1], h = [0, 1, 2], k = [0, 1, 2].map(x => (x + shift) % 3), commutes = squareCommutes(f, g, h, k);
  return <LabFrame title={tr(language, '让结构与复合一起迁移', 'Carry composition along with objects')} formula={mode === 'functor' ? 'F(g ∘ f) = F(g) ∘ F(f)' : 'g ∘ f = k ∘ h'}
    subtitle={tr(language, '移动对象后，检查每个箭头是否仍有意义。', 'After mapping objects, check whether every arrow still makes sense.')}
    controls={<><Select label={tr(language, '有限观察窗口', 'Finite window')} value={mode} options={[{ value: 'functor', label: tr(language, '偏序作为范畴', 'A poset as a category') }, { value: 'square', label: tr(language, '集合映射可交换方块', 'A commuting square of sets') }]} onChange={setMode} />{mode === 'functor' ? <Select label={tr(language, '对象映射 F', 'Object map F')} value={mapping} options={[{ value: 'identity', label: 'F = [0,1,2]' }, { value: 'collapse', label: 'F = [0,0,2]' }, { value: 'reverse', label: 'F = [2,1,0]' }]} onChange={setMapping} /> : <Slider label={tr(language, '底边映射 k 的平移', 'Shift in bottom map k')} value={shift} min={0} max={2} onChange={setShift} />}</>}
    metrics={mode === 'functor' ? [{ label: tr(language, '保序', 'Order preserving'), value: tr(language, valid ? '是' : '否', valid ? 'Yes' : 'No') }, { label: tr(language, '可定义协变函子', 'Defines a covariant functor'), value: tr(language, valid ? '是' : '箭头方向不匹配', valid ? 'Yes' : 'Arrow direction fails') }] : [{ label: tr(language, '所有输入均交换', 'Commutes for every input'), value: tr(language, commutes ? '是' : '否', commutes ? 'Yes' : 'No') }, { label: 'g∘f(0,1,2)', value: f.map(x => g[x]).join(', ') }, { label: 'k∘h(0,1,2)', value: h.map(x => k[x]).join(', ') }]}
    note={tr(language, mode === 'functor' ? '有限全序 0≤1≤2 被视为范畴：仅当 x≤y 时有唯一态射 x→y。保序映射自然保恒等与复合；反序映射不能当作这里的协变函子，若改变目标为对偶范畴则需另述。' : '方块中的每个对象都是集合 {0,1,2}。f(x)=x+1、g(x)=x−1、h(x)=x，运算模 3；逐个检查全部三个元素，而不是仅检查一条路径的一个样例。', mode === 'functor' ? 'The finite order 0≤1≤2 is a category with a unique arrow x→y exactly when x≤y. Monotone maps preserve identities and composition. Reversing the order does not define this covariant functor; a dual target would be a different claim.' : 'Each corner is the set {0,1,2}. f(x)=x+1, g(x)=x−1 and h(x)=x, modulo 3. The check covers all three inputs, not just a single sample path.')}>
    <MathSvg title={tr(language, '有限范畴中的对象、箭头与复合检查', 'Objects, arrows and composition in finite categories')}>
      {mode === 'functor' ? <>{[0, 1].map(row => <g key={row}>{[0, 1, 2].map(i => <g key={i}><circle cx={150 + i * 170} cy={95 + row * 150} r="26" fill={row === 0 ? '#d8e5d4' : '#e6d9bc'} /><text x={150 + i * 170} y={101 + row * 150} textAnchor="middle" fill={TEXT_PALETTE.ink} fontSize="19">{i}</text>{i < 2 && <path d={`M${181 + i * 170} ${95 + row * 150}h105m-8 -5l8 5l-8 5`} stroke={PALETTE.ink} fill="none" strokeWidth="1.5" />}</g>)}</g>)}{values.map((target, i) => <path key={i} d={`M${150 + i * 170} 125L${150 + target * 170} 214`} stroke={valid ? PALETTE.teal : PALETTE.coral} fill="none" strokeWidth="2" strokeDasharray="6 4" />)}<text x="50" y="100" fill={TEXT_PALETTE.muted} fontSize="15">𝒞</text><text x="50" y="250" fill={TEXT_PALETTE.muted} fontSize="15">𝒟</text><text x="552" y="175" fill={valid ? TEXT_PALETTE.teal : TEXT_PALETTE.coral} fontSize="22">F</text><path d="M150 58Q320 -10 490 58" fill="none" stroke="#a2b2a1" strokeDasharray="3 4" /><text x="320" y="30" textAnchor="middle" fill={TEXT_PALETTE.muted} fontSize="12">0 → 2 = (1 → 2) ∘ (0 → 1)</text></> : <>{[[170, 80, 'A'], [470, 80, 'B'], [170, 255, 'C'], [470, 255, 'D']].map(([x, y, label]) => <g key={label}><rect x={Number(x) - 57} y={Number(y) - 32} width="114" height="64" rx="17" fill="#e4e9d9" stroke="#b3c5af" /><text x={x} y={Number(y) - 2} textAnchor="middle" fill={TEXT_PALETTE.ink} fontSize="18">{label}</text><text x={x} y={Number(y) + 20} textAnchor="middle" fill={TEXT_PALETTE.muted} fontSize="12">{'{0,1,2}'}</text></g>)}<path d="M235 80H400m-8 -5l8 5l-8 5M235 255H400m-8 -5l8 5l-8 5M170 120V212m-5 -8l5 8l5 -8M470 120V212m-5 -8l5 8l5 -8" fill="none" stroke={PALETTE.ink} strokeWidth="1.5" /><text className="lab-math-label" x="320" y="64" textAnchor="middle" fill={TEXT_PALETTE.teal}>f: x ↦ x+1</text><text className="lab-math-label" x="320" y="287" textAnchor="middle" fill={commutes ? TEXT_PALETTE.teal : TEXT_PALETTE.coral}>k: x ↦ x+{shift}</text><text x="142" y="176" textAnchor="end" fill={TEXT_PALETTE.muted}>h=id</text><text className="lab-math-label" x="494" y="176" fill={TEXT_PALETTE.muted}>g: x ↦ x−1</text><text x="320" y="178" textAnchor="middle" fill={commutes ? TEXT_PALETTE.teal : TEXT_PALETTE.coral} fontSize="28">{commutes ? '=' : '≠'}</text></>}
    </MathSvg>
  </LabFrame>;
}
