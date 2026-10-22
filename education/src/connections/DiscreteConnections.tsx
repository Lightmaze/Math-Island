import { useEffect, useId, useMemo, useState, type ReactNode } from 'react';
import type { ConnectionLabProps, ConnectionSnapshot } from './types';
import { fmt, PALETTE, TEXT_PALETTE, tr } from '../labs/common';
import {
  K4_EDGES, K4_FACES, d4Name, edgeName, faceEdges, faceName, k4Homology,
  representationState, type Matrix2, type Vector2,
} from './discrete-models';
import './discrete.css';

type Language = ConnectionLabProps['language'];
const vertexPositions: Vector2[] = [[70, 70], [350, 70], [350, 250], [70, 250]];
const edgeSum = (edges: number[]) => edges.length ? edges.map(edgeName).join(' + ') : '0';
const yes = (language: Language, value: boolean) => tr(language, value ? '是' : '否', value ? 'Yes' : 'No');

function Figure({ title, children, square = false }: { title: string; children: ReactNode; square?: boolean }) {
  return <figure className="dc-figure"><figcaption>{title}</figcaption><svg viewBox={`0 0 420 ${square ? 420 : 340}`} role="img" aria-label={title}><title>{title}</title>{children}</svg></figure>;
}
function Metric({ label, children }: { label: string; children: ReactNode }) {
  return <div><span>{label}</span><output>{children}</output></div>;
}
function MatrixTable({ title, matrix, rowLabels, colLabels, markedColumns = [] }: { title: string; matrix: number[][]; rowLabels: string[]; colLabels: string[]; markedColumns?: number[] }) {
  return <div className="dc-matrix-scroll" role="region" aria-label={title} tabIndex={0}><table className="dc-boundary-matrix"><caption>{title} · {rowLabels.length} × {colLabels.length}</caption><thead><tr><th scope="col" aria-label="row / column">↓ / →</th>{colLabels.map((label, j) => <th scope="col" key={label} className={markedColumns.includes(j) ? 'dc-marked' : ''}>{label}</th>)}</tr></thead><tbody>{matrix.length ? matrix.map((row, i) => <tr key={rowLabels[i]}><th scope="row">{rowLabels[i]}</th>{row.length ? row.map((value, j) => <td key={j} className={`${value ? 'dc-one' : ''} ${markedColumns.includes(j) ? 'dc-marked' : ''}`}>{value}</td>) : <td>∅</td>}</tr>) : <tr><td>∅</td></tr>}</tbody></table></div>;
}

export function GraphHomologyLab({ language, onSnapshot }: ConnectionLabProps) {
  const [edges, setEdges] = useState([0, 1, 2, 3, 4, 5]), [faces, setFaces] = useState<number[]>([]), [chain, setChain] = useState([0, 1, 3]);
  const model = useMemo(() => k4Homology(edges, faces, chain), [edges, faces, chain]);
  const snapshot = useMemo<ConnectionSnapshot>(() => ({ parameters: { edges: model.edges, faces: model.faces, chain: model.chain }, observations: {
    rankD1: model.rank1, rankD2: model.rank2, betti: model.betti, boundary: model.boundaryVector,
    isCycle: model.cycle, isBoundary: model.isBoundary, homologyClass: model.classIndex ?? 'not-a-cycle',
    cycleCount: model.cycles.length, boundaryCount: model.boundaries.length, classCount: model.classes.length,
  } }), [model]);
  useEffect(() => { onSnapshot?.(snapshot); }, [snapshot, onSnapshot]);
  const toggleEdge = (edge: number) => {
    const next = edges.includes(edge) ? edges.filter(e => e !== edge) : [...edges, edge];
    setEdges(next); setFaces(values => values.filter(f => faceEdges(f).every(e => next.includes(e)))); setChain(values => values.filter(e => next.includes(e)));
  };
  const preset = (kind: 'graph' | 'sphere' | 'tree') => {
    setEdges(kind === 'tree' ? [0, 1, 2] : [0, 1, 2, 3, 4, 5]);
    setFaces(kind === 'sphere' ? [0, 1, 2, 3] : []); setChain(kind === 'tree' ? [] : [0, 1, 3]);
  };
  const nonzeroBoundary = model.boundaryVector.flatMap((v, i) => v ? ['ABCD'[i]] : []);
  const selectedClass = model.classIndex === null ? null : model.classes[model.classIndex];
  return <section className="discrete-connection" aria-label={tr(language, '图、边界矩阵与同调', 'Graphs, boundary matrices and homology')}>
    <header className="dc-heading"><h3>{tr(language, '同一个环，何时成为边界？', 'When does the same cycle become a boundary?')}</h3><p>{tr(language, '添边改变周期空间；填入三角面改变边界空间。两种操作在商空间 H₁ 中留下不同结果。', 'Adding edges changes the cycle space; filling triangles changes the boundary space. These operations have different effects on H₁.')}</p><div className="dc-formula">H₁ = ker ∂₁ / im ∂₂ · ∂₁∂₂ = 0 · 𝔽₂</div></header>
    <div className="dc-two-domains">
      <Figure title={tr(language, '图与所填三角面', 'Graph and selected triangular faces')}>
        {model.faces.map(f => { const points = K4_FACES[f].map(v => vertexPositions[v]); const center = [points.reduce((s, p) => s + p[0], 0) / 3, points.reduce((s, p) => s + p[1], 0) / 3]; return <g key={f}><polygon points={points.map(p => p.join(',')).join(' ')} fill={PALETTE.gold} fillOpacity=".15" stroke="none" /><text x={center[0]} y={center[1]} textAnchor="middle" fill={TEXT_PALETTE.gold} fontSize="19">{faceName(f)}</text></g>; })}
        {K4_EDGES.map(([a, b], i) => <line key={i} x1={vertexPositions[a][0]} y1={vertexPositions[a][1]} x2={vertexPositions[b][0]} y2={vertexPositions[b][1]} stroke={chain.includes(i) ? PALETTE.coral : edges.includes(i) ? PALETTE.teal : '#cbd5c6'} strokeWidth={chain.includes(i) ? 6 : edges.includes(i) ? 3 : 1.5} strokeDasharray={edges.includes(i) ? undefined : '5 6'} />)}
        {vertexPositions.map(([x, y], v) => <g key={v}><circle cx={x} cy={y} r="21" fill={model.boundaryVector[v] ? PALETTE.coral : '#edf0e4'} stroke={TEXT_PALETTE.ink} strokeWidth="1.5" /><text x={x} y={y + 7} textAnchor="middle" fill={model.boundaryVector[v] ? '#111111' : TEXT_PALETTE.ink} fontSize="23">{'ABCD'[v]}</text></g>)}
        <text x="210" y="310" textAnchor="middle" fill={TEXT_PALETTE.ink} fontSize="20">z = {edgeSum(model.chain)}</text>
      </Figure>
      <Figure title={tr(language, '周期按边界归并后的商空间', 'Cycles grouped modulo boundaries')}>
        <text x="210" y="38" textAnchor="middle" fill={TEXT_PALETTE.ink} fontSize="25">H₁ = Z₁ / B₁</text>
        {model.classes.map((item, index) => { const cols = Math.min(4, model.classes.length), x = (420 - cols * 92) / 2 + 46 + (index % cols) * 92, y = 115 + Math.floor(index / cols) * 105, active = model.classIndex === index; return <g key={item.mask}><circle cx={x} cy={y} r="28" fill={active ? PALETTE.teal : '#edf0e4'} stroke={index === 0 ? TEXT_PALETTE.gold : '#9ab2a3'} strokeWidth={index === 0 ? 3 : 1.5} /><text x={x} y={y + 7} textAnchor="middle" fill={active ? '#ffffff' : TEXT_PALETTE.ink} fontSize="23">{index === 0 ? '[0]' : `[z${index}]`}</text></g>; })}
        <text x="210" y="304" textAnchor="middle" fill={TEXT_PALETTE.ink} fontSize="21">dim H₁ = {model.betti[1]} · |H₁| = {model.classes.length}</text>
      </Figure>
    </div>
    <div className="dc-controls"><div className="dc-button-group" role="group" aria-label={tr(language, '预设复形', 'Complex presets')}><button type="button" onClick={() => preset('graph')}>{tr(language, '完整图骨架', 'Full graph skeleton')}</button><button type="button" onClick={() => preset('sphere')}>{tr(language, '填满四个三角面', 'Fill all four faces')}</button><button type="button" onClick={() => preset('tree')}>{tr(language, '只留一棵树', 'Keep a tree')}</button></div>
      <fieldset><legend>{tr(language, '1 · 选边', '1 · Choose edges')}</legend>{K4_EDGES.map((_, i) => <button type="button" key={i} aria-pressed={edges.includes(i)} className={edges.includes(i) ? 'dc-selected' : ''} onClick={() => toggleEdge(i)}>{edgeName(i)}</button>)}</fieldset>
      <fieldset><legend>{tr(language, '2 · 填三角面（必须先有三条边）', '2 · Fill faces (all three edges must exist)')}</legend>{K4_FACES.map((_, i) => <button type="button" key={i} disabled={!faceEdges(i).every(e => edges.includes(e))} aria-pressed={faces.includes(i)} className={faces.includes(i) ? 'dc-selected' : ''} onClick={() => setFaces(values => values.includes(i) ? values.filter(f => f !== i) : [...values, i])}>{faceName(i)}</button>)}</fieldset>
      <fieldset><legend>{tr(language, '3 · 选一个待检查的 1-链 z', '3 · Choose a 1-chain z to inspect')}</legend>{K4_EDGES.map((_, i) => <button type="button" key={i} disabled={!edges.includes(i)} aria-pressed={chain.includes(i)} className={chain.includes(i) ? 'dc-chain-selected' : ''} onClick={() => setChain(values => values.includes(i) ? values.filter(e => e !== i) : [...values, i])}>{edgeName(i)}</button>)}<button type="button" onClick={() => setChain([])}>{tr(language, '零链', 'Zero chain')}</button></fieldset>
    </div>
    <p className="dc-legend">{tr(language, '橙边是 z；橙顶点是 ∂₁z 的非零项。金色填面产生边界；商空间的金圈表示零类。交叉线段不增加顶点。', 'Copper edges form z; copper vertices are nonzero entries of ∂₁z. Filled gold triangles generate boundaries; the gold ring marks the zero class. Edge crossings add no vertices.')}</p>
    <div className="dc-metrics" aria-live="polite"><Metric label="β₀">{model.betti[0]}</Metric><Metric label="β₁">{model.betti[1]}</Metric><Metric label="β₂">{model.betti[2]}</Metric><Metric label="rank ∂₁ / rank ∂₂">{model.rank1} / {model.rank2}</Metric><Metric label="|Z₁| / |B₁|">{model.cycles.length} / {model.boundaries.length}</Metric></div>
    <div className="dc-observation" role="status"><strong>{!model.cycle ? tr(language, '当前链不是周期，不能赋予 H₁ 中的类。', 'This chain is not a cycle, so it has no class in H₁.') : model.isBoundary ? tr(language, '当前周期是边界，因此代表零类。', 'This cycle is a boundary and represents the zero class.') : tr(language, '当前周期不是边界，代表非零同调类。', 'This cycle is not a boundary and represents a nonzero homology class.')}</strong><p>{!model.cycle ? `∂₁z = ${nonzeroBoundary.join(' + ')}` : model.isBoundary ? `z = ∂₂(${model.boundaryWitness?.map(faceName).join(' + ') || '0'})` : `[z] = [${selectedClass ? edgeSum(selectedClass.representative) : '—'}]`}</p></div>
    <div className="dc-two-domains dc-matrix-pair"><MatrixTable title="∂₁ : C₁ → C₀" matrix={model.d1} rowLabels={['A', 'B', 'C', 'D']} colLabels={model.edges.map(edgeName)} markedColumns={model.chainVector.flatMap((v, i) => v ? [i] : [])} /><MatrixTable title="∂₂ : C₂ → C₁" matrix={model.d2} rowLabels={model.edges.map(edgeName)} colLabels={model.faces.map(faceName)} /></div>
    <div className="dc-equation-readout">∂₁z = ({model.boundaryVector.join(', ')}) · ∂₁∂₂ = 0 · β₁ = {model.edges.length} − {model.rank1} − {model.rank2} = {model.betti[1]}</div>
    <details className="dc-data"><summary>{tr(language, '查看每个商类的一个代表', 'Inspect one representative of every quotient class')}</summary><table><thead><tr><th>{tr(language, '类', 'Class')}</th><th>{tr(language, '规范代表（按当前边序）', 'Canonical representative in the current edge order')}</th><th>{tr(language, '类中周期数', 'Cycles in class')}</th></tr></thead><tbody>{model.classes.map((item, i) => <tr key={item.mask}><th scope="row">{i === 0 ? '[0]' : `[z${i}]`}</th><td>{edgeSum(item.representative)}</td><td>{item.members}</td></tr>)}</tbody></table></details>
    <p className="dc-boundary">{tr(language, '所有计算在 𝔽₂ 上；相加即异或，没有整数系数的方向符号。删边会同时移除依赖它的面及链项。四个顶点始终保留。填满四个三角面得到抽象四面体边界 S²：β₂=1；没有填入三维单形。这幅平面示意的重叠面不应解释为平面中的嵌入。', 'All arithmetic is over 𝔽₂: addition is XOR, without integral orientation signs. Removing an edge also removes incident selected faces and that chain entry. All four vertices remain. Filling all four faces gives the abstract tetrahedron boundary S², with β₂=1; no 3-simplex is added. Overlapping triangles in this planar sketch are not a planar embedding.')}</p>
  </section>;
}

function SmallMatrix({ label, matrix }: { label: string; matrix: Matrix2 }) {
  return <div className="dc-small-matrix"><strong>{label}</strong><table aria-label={label}><tbody>{matrix.map((row, i) => <tr key={i}>{row.map((v, j) => <td key={j}>{v}</td>)}</tr>)}</tbody></table></div>;
}
function actionFormula(index: number) {
  const base = index >= 4 ? 'conj(z)' : 'z';
  return `${['', 'i·', '−', '−i·'][index % 4]}${base}`;
}
function vectorLabels(vectors: { point: Vector2; label: string }[]): Vector2[] {
  const occupied: { x: number; y: number; width: number; height: number }[] = [];
  return vectors.map(({ point, label }) => {
    const [px, py] = [210 + point[0] * 52, 210 - point[1] * 52], width = label.length * 14;
    const offsets = [[10, -14], [10, 29], [-width - 10, -14], [-width - 10, 29], [10, 0], [-width - 10, 0], [-width / 2, -28], [-width / 2, 44]];
    const candidates = offsets.map(([dx, dy]) => ({ x: px + dx, y: py + dy - 21, width, height: 27 }));
    const rectangle = candidates.find(r => r.x > 45 && r.x + r.width < 395 && r.y > 45 && r.y + r.height < 375 && occupied.every(q => r.x + r.width + 6 < q.x || q.x + q.width + 6 < r.x || r.y + r.height + 6 < q.y || q.y + q.height + 6 < r.y)) ?? candidates[0];
    occupied.push(rectangle);
    return [rectangle.x, rectangle.y + 21];
  });
}
function PlaneVector({ point, label, color, labelPoint }: { point: Vector2; label: string; color: string; labelPoint: Vector2 }) {
  const [x, y] = [210 + point[0] * 52, 210 - point[1] * 52];
  return <g><line x1="210" y1="210" x2={x} y2={y} stroke={color} strokeWidth="3" /><circle cx={x} cy={y} r="5" fill={color} /><text className="dc-vector-label" x={labelPoint[0]} y={labelPoint[1]} fill={color} fontSize="21">{label}</text></g>;
}
function RouteNode({ x, y, label, point }: { x: number; y: number; label: string; point: Vector2 }) {
  return <g><rect x={x - 55} y={y - 46} width="110" height="100" rx="12" fill="#e8ede0" stroke="#a9bdad" /><text x={x} y={y - 22} textAnchor="middle" fill={TEXT_PALETTE.ink} fontSize="23">{label}</text><text x={x} y={y + 8} textAnchor="middle" fill={TEXT_PALETTE.ink} fontSize="20">x={fmt(point[0])}</text><text x={x} y={y + 34} textAnchor="middle" fill={TEXT_PALETTE.ink} fontSize="20">y={fmt(point[1])}</text></g>;
}

export function SymmetryRepresentationLab({ language, onSnapshot }: ConnectionLabProps) {
  const [a, setA] = useState(1), [b, setB] = useState(4), [x, setX] = useState(1), [y, setY] = useState(0.5);
  const model = useMemo(() => representationState(a, b, [x, y]), [a, b, x, y]);
  const labelPoints = vectorLabels([{ point: model.afterAB, label: 'ABz' }, { point: model.afterBA, label: 'BAz' }, { point: [x, y], label: 'z' }]);
  const snapshot = useMemo<ConnectionSnapshot>(() => ({ parameters: { a, b, z: [x, y] }, observations: {
    ab: model.ab, ba: model.ba, matrixAB: model.matrixAB.flat(), matrixBA: model.matrixBA.flat(), afterAB: model.afterAB, afterBA: model.afterBA,
    matricesCommute: model.matricesCommute, thisVectorAgrees: model.thisVectorAgrees, representationHolds: model.representationHolds, determinant: model.determinant,
  } }), [a, b, x, y, model]);
  useEffect(() => { onSnapshot?.(snapshot); }, [snapshot, onSnapshot]);
  const id = useId(), options = Array.from({ length: 8 }, (_, i) => <option key={i} value={i}>{d4Name(i)} · {actionFormula(i)}</option>);
  return <section className="discrete-connection" aria-label={tr(language, '对称群、复数与实矩阵表示', 'Symmetry groups, complex numbers and real matrix representations')}>
    <header className="dc-heading"><h3>{tr(language, '同一次对称，三种语言', 'One symmetry, three languages')}</h3><p>{tr(language, '正方形的 D₄、复平面的旋转与共轭、二维实矩阵描述同一个作用。交换操作顺序，同时观察三种表示。', 'The square group D₄, rotation and conjugation in the complex plane, and real 2×2 matrices describe the same action. Swap the order and follow all three.')}</p><div className="dc-formula">ρ(A ∘ B) = ρ(A)ρ(B) · A ∘ B: {tr(language, '先 B，后 A', 'B first, then A')}</div></header>
    <div className="dc-two-domains">
      <Figure square title={tr(language, '复平面中的向量作用（等比例坐标）', 'Vector action in the complex plane (equal scales)')}>
        {[-3, -2, -1, 0, 1, 2, 3].map(n => <g key={n}><line x1={210 + n * 52} x2={210 + n * 52} y1="54" y2="366" stroke={n === 0 ? '#92a89b' : '#dce4d9'} /><line x1="54" x2="366" y1={210 + n * 52} y2={210 + n * 52} stroke={n === 0 ? '#92a89b' : '#dce4d9'} />{n !== 0 && <><text x={210 + n * 52} y="393" textAnchor="middle" fill={TEXT_PALETTE.muted} fontSize="18">{n}</text><text x="34" y={216 - n * 52} textAnchor="middle" fill={TEXT_PALETTE.muted} fontSize="18">{n}</text></>}</g>)}
        <circle cx="210" cy="210" r="52" fill="none" stroke="#92a89b" strokeDasharray="4 4" /><PlaneVector point={[x, y]} label="z" color={TEXT_PALETTE.muted} labelPoint={labelPoints[2]} /><PlaneVector point={model.afterAB} label="ABz" color={TEXT_PALETTE.teal} labelPoint={labelPoints[0]} /><PlaneVector point={model.afterBA} label="BAz" color={TEXT_PALETTE.coral} labelPoint={labelPoints[1]} /><text x="380" y="42" textAnchor="end" fill={TEXT_PALETTE.ink} fontSize="21">Re</text><text x="34" y="42" textAnchor="middle" fill={TEXT_PALETTE.ink} fontSize="21">Im</text>
      </Figure>
      <Figure title={tr(language, '实向量按两种顺序经过矩阵', 'Real vectors pass through both matrix orders')}>
        <text x="210" y="24" textAnchor="middle" fill={TEXT_PALETTE.teal} fontSize="21">ρ(A)ρ(B)</text><text x="210" y="189" textAnchor="middle" fill={TEXT_PALETTE.coral} fontSize="21">ρ(B)ρ(A)</text>
        {[105, 270].map((cy, row) => <g key={cy}><path d={`M125 ${cy}H155m-8 -5l8 5l-8 5M265 ${cy}H295m-8 -5l8 5l-8 5`} stroke={row === 0 ? TEXT_PALETTE.teal : TEXT_PALETTE.coral} fill="none" strokeWidth="2" /><text x="140" y={cy - 54} textAnchor="middle" fill={TEXT_PALETTE.ink} fontSize="19">{row === 0 ? 'ρ(B)' : 'ρ(A)'}</text><text x="280" y={cy - 54} textAnchor="middle" fill={TEXT_PALETTE.ink} fontSize="19">{row === 0 ? 'ρ(A)' : 'ρ(B)'}</text></g>)}
        <RouteNode x={70} y={105} label="z" point={[x, y]} /><RouteNode x={210} y={105} label="Bz" point={model.afterB} /><RouteNode x={350} y={105} label="ABz" point={model.afterAB} /><RouteNode x={70} y={270} label="z" point={[x, y]} /><RouteNode x={210} y={270} label="Az" point={model.afterA} /><RouteNode x={350} y={270} label="BAz" point={model.afterBA} />
      </Figure>
    </div>
    <div className="dc-controls dc-sym-controls"><label htmlFor={`${id}-a`}>A<select id={`${id}-a`} value={a} onChange={e => setA(Number(e.target.value))}>{options}</select></label><label htmlFor={`${id}-b`}>B<select id={`${id}-b`} value={b} onChange={e => setB(Number(e.target.value))}>{options}</select></label><button type="button" onClick={() => { setA(b); setB(a); }}>{tr(language, '交换 A 与 B', 'Swap A and B')}</button><label htmlFor={`${id}-x`}>Re z <output>{fmt(x)}</output><input id={`${id}-x`} type="range" min="-2" max="2" step=".25" value={x} onChange={e => setX(Number(e.target.value))} /></label><label htmlFor={`${id}-y`}>Im z <output>{fmt(y)}</output><input id={`${id}-y`} type="range" min="-2" max="2" step=".25" value={y} onChange={e => setY(Number(e.target.value))} /></label><button type="button" onClick={() => { setX(0); setY(0); }}>{tr(language, '观察 z=0', 'Inspect z=0')}</button></div>
    <div className="dc-action-formulas"><span>A: z {tr(language, '映到', 'maps to')} {actionFormula(a)}</span><span>B: z {tr(language, '映到', 'maps to')} {actionFormula(b)}</span><span>AB = {d4Name(model.ab)}: z {tr(language, '映到', 'maps to')} {actionFormula(model.ab)}</span><span>BA = {d4Name(model.ba)}: z {tr(language, '映到', 'maps to')} {actionFormula(model.ba)}</span></div>
    <div className="dc-four-matrices"><SmallMatrix label="ρ(A)" matrix={model.matrixA} /><SmallMatrix label="ρ(B)" matrix={model.matrixB} /><SmallMatrix label="ρ(A)ρ(B)" matrix={model.matrixAB} /><SmallMatrix label="ρ(B)ρ(A)" matrix={model.matrixBA} /></div>
    <div className="dc-metrics" aria-live="polite"><Metric label={tr(language, '两矩阵可交换？', 'Matrices commute?')}>{yes(language, model.matricesCommute)}</Metric><Metric label={tr(language, '此向量的两个像相同？', 'Same image for this vector?')}>{yes(language, model.thisVectorAgrees)}</Metric><Metric label="ρ(AB)=ρ(A)ρ(B)">{yes(language, model.representationHolds)}</Metric><Metric label="det ρ(AB)">{model.determinant}</Metric></div>
    <div className="dc-observation" role="status"><strong>{!model.matricesCommute && model.thisVectorAgrees ? tr(language, '此向量的像重合，但两种操作并不相同。', 'This vector has the same image, but the two operations are different.') : model.matricesCommute ? tr(language, '两矩阵相等，因此对每个向量都给出相同结果。', 'The matrices are equal, so every vector has the same image.') : tr(language, '复合次序不同，矩阵和当前向量的像都不同。', 'Changing the order changes both the matrix and this vector’s image.')}</strong><p>{tr(language, '矩阵作用与复数作用逐坐标一致；对单个向量的检验不能代替矩阵等式。', 'The real-matrix and complex actions agree coordinate by coordinate; testing one vector cannot establish a matrix identity.')}</p></div>
    <p className="dc-boundary">{tr(language, '约定 r(z)=iz、s(z)=conj(z)，元素为 rᵏsᵋ，s 先作用。这里共得到 8 个不同的实 2×2 矩阵，故这个 D₄ 表示忠实。含共轭的反射是实线性的，不是复线性的；因此这不是把 D₄ 都表示为复数乘法。此具体表示不替代一般群表示论。', 'We use r(z)=iz and s(z)=conj(z), with elements rᵏsᵋ and s acting first. The eight distinct real 2×2 matrices make this particular D₄ representation faithful. Reflections involving conjugation are real-linear, not complex-linear: D₄ is not represented solely by complex multiplication. This concrete example is not general representation theory.')}</p>
  </section>;
}
