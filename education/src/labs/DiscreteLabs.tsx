import { useState } from 'react';
import { fmt, LabFrame, linePath, MathSvg, PALETTE, TEXT_PALETTE, Select, Slider, tr, type LabProps, type Point } from './common';
import { cantorIntervals, components, shortestPath, typeApplication, type Edge, type WeightedEdge } from './models';

export function GraphLab({ language }: LabProps) {
  const [algorithm, setAlgorithm] = useState<'bfs' | 'dijkstra'>('dijkstra'), [step, setStep] = useState(8), [shortcut, setShortcut] = useState(6), [target, setTarget] = useState(7);
  const positions: Point[] = [[65, 166], [220, 60], [210, 260], [360, 52], [350, 169], [375, 292], [505, 95], [573, 252]];
  const edges: WeightedEdge[] = [[0, 1, 3], [0, 2, 1], [1, 3, 1], [1, 4, 4], [2, 4, 1], [2, 5, 4], [3, 6, 3], [4, 6, 1], [4, 7, shortcut], [5, 7, 1], [6, 7, 1]];
  const result = shortestPath(positions.length, edges, 0, target, algorithm), visited = new Set(result.visited.slice(0, step)), reached = visited.has(target);
  const edgeKey = (a: number, b: number) => `${Math.min(a, b)}-${Math.max(a, b)}`, pathEdges = new Set(reached ? result.path.slice(1).map((v, i) => edgeKey(result.path[i], v)) : []);
  return <LabFrame title={tr(language, '什么叫“最短”的航路？', 'What makes a route shortest?')} formula={algorithm === 'bfs' ? 'min number of edges' : 'min Σ edge costs'}
    subtitle={tr(language, '同一张图，换一种代价就会换一条路线。', 'Change the notion of cost and the preferred route can change.')}
    controls={<><Select label={tr(language, '搜索规则', 'Search rule')} value={algorithm} options={[{ value: 'bfs', label: tr(language, 'BFS：最少边数', 'BFS: fewest edges') }, { value: 'dijkstra', label: tr(language, 'Dijkstra：最小总权', 'Dijkstra: least total cost') }]} onChange={v => { setAlgorithm(v as typeof algorithm); setStep(0); }} /><Select label={tr(language, '目标顶点', 'Destination')} value={target} options={positions.map((_, i) => ({ value: i, label: String.fromCharCode(65 + i) }))} onChange={v => { setTarget(Number(v)); setStep(0); }} /><Slider label={tr(language, '边 E–H 的代价', 'Cost of edge E–H')} value={shortcut} min={1} max={8} onChange={n => { setShortcut(n); setStep(0); }} /><button type="button" className="lab-button" disabled={step === positions.length} onClick={() => setStep(Math.min(step + 1, positions.length))}>{tr(language, '展开一步', 'Expand one vertex')}</button><button type="button" className="lab-button lab-button-quiet" onClick={() => setStep(step === positions.length ? 0 : positions.length)}>{tr(language, step === positions.length ? '重新搜索' : '完成搜索', step === positions.length ? 'Restart' : 'Complete search')}</button></>}
    metrics={[{ label: tr(language, '已确定顶点', 'Settled vertices'), value: step }, { label: tr(language, '路径边数', 'Path edges'), value: reached ? result.path.length - 1 : '—' }, { label: tr(language, '路径总权', 'Total path cost'), value: reached ? result.cost : '—' }]}
    note={tr(language, 'BFS 最小化无权边数，Dijkstra 最小化非负边权之和。图上每条边都标出代价；BFS 不会因为看见这些数字就自动变成最小权搜索。搜索次序中的同代价顶点按编号打破平局。', 'BFS minimizes unweighted edge count; Dijkstra minimizes the sum of nonnegative costs. Every edge is labelled with its cost; BFS does not become a weighted search merely because those labels are visible. Ties in the search order are broken by vertex index.')}>
    <MathSvg title={tr(language, '带非负权的图，显示已展开顶点与最短路径', 'A graph with nonnegative costs, settled vertices and the selected shortest path')}>
      {edges.map(([a, b, w], i) => { const inPath = pathEdges.has(edgeKey(a, b)), [x1, y1] = positions[a], [x2, y2] = positions[b]; return <g key={i}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={inPath ? PALETTE.coral : '#bbcdbb'} strokeWidth={inPath ? 4 : 1.8} /><rect x={(x1 + x2) / 2 - 10} y={(y1 + y2) / 2 - 11} width="20" height="22" rx="7" fill="#f7f6ec" /><text x={(x1 + x2) / 2} y={(y1 + y2) / 2 + 4} textAnchor="middle" fill={inPath ? TEXT_PALETTE.coral : TEXT_PALETTE.muted} fontSize="12">{w}</text></g>; })}
      {positions.map(([x, y], i) => <g key={i}>{i === target && <circle cx={x} cy={y} r="23" fill="none" stroke={PALETTE.coral} strokeDasharray="4 3" />}<circle cx={x} cy={y} r="17" fill={visited.has(i) ? PALETTE.teal : '#e4eadb'} stroke={i === result.visited[step - 1] ? PALETTE.coral : '#c1d1bd'} strokeWidth={i === result.visited[step - 1] ? 3 : 1} /><text x={x} y={y + 5} textAnchor="middle" fill={visited.has(i) ? 'white' : TEXT_PALETTE.ink} fontWeight="650" fontSize="13">{String.fromCharCode(65 + i)}</text></g>)}
      <text x="35" y="323" fontSize="12" fill={TEXT_PALETTE.muted}>{tr(language, '起点 A · 虚线圈为目标', 'Start A · dashed ring marks destination')}</text>
    </MathSvg>
  </LabFrame>;
}

export function MatroidLab({ language }: LabProps) {
  const [selection, setSelection] = useState([0, 1, 2]);
  const points: Point[] = [[185, 75], [455, 75], [455, 265], [185, 265]], edges: Edge[] = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]], active = edges.filter((_, i) => selection.includes(i)), result = components(4, active), basis = result.independent && selection.length === 3;
  const edgeLabel = ([a, b]: Edge) => `${String.fromCharCode(65 + a)}${String.fromCharCode(65 + b)}`;
  return <LabFrame title={tr(language, '森林里的独立性', 'Independence in a forest')} formula="r(A)=|V|−c(A); independent ⇔ |A|=r(A)"
    subtitle={tr(language, '边可以自由组合，但闭合成环会产生依赖。', 'Combine edges freely; closing a cycle introduces dependence.')}
    controls={<><div className="lab-choice-row" role="group" aria-label={tr(language, '选择图拟阵的元素', 'Select graphic-matroid elements')}>{edges.map((edge, i) => <button key={i} type="button" className={`lab-choice ${selection.includes(i) ? 'is-active' : ''}`} aria-pressed={selection.includes(i)} onClick={() => setSelection(selection.includes(i) ? selection.filter(j => j !== i) : [...selection, i])}>{edgeLabel(edge)}</button>)}</div><button className="lab-button lab-button-quiet" type="button" onClick={() => setSelection([0, 1, 2])}>{tr(language, '星形基', 'Star basis')}</button><button className="lab-button lab-button-quiet" type="button" onClick={() => setSelection([0, 3, 5])}>{tr(language, '路径基', 'Path basis')}</button></>}
    metrics={[{ label: '|A|', value: selection.length }, { label: 'r(A)', value: result.rank }, { label: tr(language, '连通分量 c(A)', 'Components c(A)'), value: result.count }, { label: tr(language, '状态', 'Status'), value: tr(language, basis ? '基：生成树' : result.independent ? '独立：森林' : '依赖：含环', basis ? 'Basis: spanning tree' : result.independent ? 'Independent: forest' : 'Dependent: cycle') }]}
    note={tr(language, '这里只展示 K₄ 的图拟阵，地面集合是六条边，独立集是无环边集。线的几何交叉不是额外顶点。基之间可通过合适的删边与添边交换；这种独立性结构会出现在更一般的拟阵中，不能把图像当成所有拟阵的表示。', 'This is the graphic matroid of K₄. Its ground set is six edges; forests are independent sets. Crossings in the drawing are not additional vertices. Bases admit suitable edge exchanges; more general matroids need not have a graph representation.')}>
    <MathSvg title={tr(language, 'K₄中所选边集、秩与是否存在环', 'A selected edge set in K₄, its rank and cycle status')}>
      {edges.map(([a, b], i) => <path key={i} d={linePath([points[a], points[b]])} stroke={selection.includes(i) ? result.independent ? PALETTE.teal : PALETTE.coral : '#d1dccc'} strokeWidth={selection.includes(i) ? 4 : 1.5} strokeDasharray={selection.includes(i) ? undefined : '4 5'} fill="none" />)}
      {points.map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="22" fill="#eff1e6" stroke={PALETTE.teal} strokeWidth="2" /><text x={x} y={y + 6} fontSize="18" textAnchor="middle" fill={TEXT_PALETTE.ink}>{String.fromCharCode(65 + i)}</text></g>)}
      <text x="320" y="328" textAnchor="middle" fontSize="12" fill={TEXT_PALETTE.muted}>{tr(language, '虚线是尚未选择的地面元素', 'Dashed edges are unselected ground-set elements')}</text>
    </MathSvg>
  </LabFrame>;
}

export function LogicLab({ language }: LabProps) {
  const [functionType, setFunctionType] = useState('A,B'), [argument, setArgument] = useState('A'), [compose, setCompose] = useState(false);
  const [from, to] = functionType.split(','), result = typeApplication([from, to], argument), compositionValid = result.valid && to === 'B', valid = compose ? compositionValid : result.valid;
  const term = compose ? 'g(f x)' : 'f x', inferred = valid ? compose ? 'C' : to : '?';
  return <LabFrame title={tr(language, '类型约束让推导生长', 'Let type constraints guide a derivation')} formula="Γ ⊢ f:A→B    Γ ⊢ x:A  ⇒  Γ ⊢ f x:B"
    subtitle={tr(language, '改变输入类型，观察哪一步推导会失去前提。', 'Change the input type and see which inference loses its premise.')}
    controls={<><Select label={tr(language, '函数假设', 'Function assumption')} value={functionType} options={[{ value: 'A,B', label: 'f : A → B' }, { value: 'B,C', label: 'f : B → C' }, { value: 'A,A', label: 'f : A → A' }]} onChange={setFunctionType} /><Select label={tr(language, '参数假设', 'Argument assumption')} value={argument} options={['A', 'B', 'C'].map(a => ({ value: a, label: `x : ${a}` }))} onChange={setArgument} /><label className="lab-checkbox"><input type="checkbox" checked={compose} onChange={e => setCompose(e.target.checked)} />{tr(language, '再应用 g : B → C', 'Then apply g : B → C')}</label></>}
    metrics={[{ label: tr(language, '局部应用规则', 'Application rule'), value: tr(language, result.valid ? '前提匹配' : '输入类型不匹配', result.valid ? 'Premises match' : 'Input type mismatch') }, { label: tr(language, '结论类型', 'Conclusion type'), value: inferred }, { label: tr(language, '组合项', 'Term'), value: term }]}
    note={tr(language, '模型采用简单类型 λ 演算的箭头类型应用规则；f、g、x 是上下文 Γ 中给定的假设。类型匹配允许这个局部推导，不会凭空证明任意 A、B、C 都存在闭项；这里也没有实现依赖类型或一般定理证明器。', 'This uses the arrow-type application rule of simply typed λ-calculus. f, g and x are assumptions in context Γ. Matching types permits this local inference; it does not prove that arbitrary A, B or C has a closed inhabitant. This is not dependent typing or a general theorem prover.')}>
    <MathSvg title={tr(language, '函数应用的推导树，类型不匹配时拒绝结论', 'An application derivation tree that refuses a mismatched conclusion')}>
      <rect x="52" y="63" width="235" height="52" rx="10" fill="#e3eadc" /><rect x="350" y="63" width="235" height="52" rx="10" fill="#e3eadc" />
      <text x="170" y="95" fontSize="19" textAnchor="middle" fill={TEXT_PALETTE.ink}>Γ ⊢ f : {from} → {to}</text><text x="468" y="95" fontSize="19" textAnchor="middle" fill={TEXT_PALETTE.ink}>Γ ⊢ x : {argument}</text>
      <path d="M170 120V143H468V120M319 143V161" stroke={result.valid ? PALETTE.teal : PALETTE.coral} fill="none" strokeWidth="2" /><text x="320" y="195" textAnchor="middle" fontSize="21" fill={result.valid ? TEXT_PALETTE.teal : TEXT_PALETTE.coral}>Γ ⊢ f x : {result.valid ? to : '?'}</text>
      {compose ? <><text x="505" y="211" textAnchor="middle" fontSize="15" fill={TEXT_PALETTE.ink}>Γ ⊢ g : B → C</text><path d="M320 208V235H505V222M405 235V254" stroke={valid ? PALETTE.teal : PALETTE.coral} fill="none" strokeWidth="2" /><text x="405" y="288" textAnchor="middle" fill={valid ? TEXT_PALETTE.teal : TEXT_PALETTE.coral} fontSize="21">Γ ⊢ g(f x) : {inferred}</text></> : <text x="320" y="272" textAnchor="middle" fill={result.valid ? TEXT_PALETTE.muted : TEXT_PALETTE.coral} fontSize="13">{tr(language, result.valid ? '规则的每个前提都已在上下文中给出' : `需要 x:${from}，目前给出 x:${argument}`, result.valid ? 'Every premise is supplied by the context' : `Requires x:${from}; the context supplies x:${argument}`)}</text>}
    </MathSvg>
  </LabFrame>;
}

export function FractalLab({ language }: LabProps) {
  const [depth, setDepth] = useState(4), intervals = cantorIntervals(depth), total = intervals.reduce((sum, [a, b]) => sum + b - a, 0);
  return <LabFrame title={tr(language, '有限层级，通向无限集合', 'Finite stages toward an infinite set')} formula="2ⁿ intervals · total length (2/3)ⁿ"
    subtitle={tr(language, '每一步删去各区间的中间三分之一。', 'At each stage remove the middle third of every remaining interval.')}
    controls={<Slider label={tr(language, '构造层级 n', 'Construction depth n')} value={depth} min={0} max={6} onChange={setDepth} />}
    metrics={[{ label: tr(language, '第 n 层区间数', 'Intervals at stage n'), value: intervals.length }, { label: tr(language, '第 n 层总长度', 'Total length at stage n'), value: fmt(total, 5) }, { label: tr(language, '无限极限的维数', 'Dimension of the infinite limit'), value: 'log 2 / log 3' }]}
    note={tr(language, '每个有限层仍是有限个非退化闭区间之并，尚不是 Cantor 集。无限交集才是不可数、零长度的 Cantor 集，其 Hausdorff 维数为 log2/log3；有限图像只能展示构造，不能代替极限论证。', 'Every finite stage is still a finite union of nondegenerate closed intervals, not the Cantor set. The infinite intersection is uncountable, has length zero and Hausdorff dimension log2/log3. A finite picture illustrates the construction; it does not replace the limiting argument.')}>
    <MathSvg title={tr(language, 'Cantor 集构造的各有限层区间', 'Intervals at successive finite stages of the Cantor construction')}>
      {Array.from({ length: depth + 1 }, (_, n) => <g key={n}><text x="43" y={50 + n * 41} fill={TEXT_PALETTE.muted} fontSize="12" textAnchor="end">n={n}</text>{cantorIntervals(n).map(([a, b], i) => <rect key={i} x={65 + a * 545} y={32 + n * 41} width={(b - a) * 545} height="23" rx={n < 3 ? 3 : 0} fill={n === depth ? PALETTE.teal : '#abc4ac'} />)}</g>)}
      <text x="65" y="325" fill={TEXT_PALETTE.muted} fontSize="12">0</text><text x="610" y="325" fill={TEXT_PALETTE.muted} fontSize="12" textAnchor="end">1</text>
    </MathSvg>
  </LabFrame>;
}
