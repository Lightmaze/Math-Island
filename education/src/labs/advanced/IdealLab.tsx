import {useState} from 'react';
import {integerIdeals} from './models';
import {Frame,Readout,Slider,Svg,tr,palette,type AdvancedProps} from './shared';
export default function IdealLab({language,onExplore}:AdvancedProps) {
  const [m,setM]=useState(4),[n,setN]=useState(6);
  const model=integerIdeals(m,n), extent=24, x=(v:number)=>172+(v+extent)/(2*extent)*496;
  const labels=[`(${m})`, `(${n})`, `(${m}) + (${n})`, `(${m}) ∩ (${n})`];
  const colors=[palette.teal,palette.copper,palette.teal,palette.ink];
  const relation=m===n?`(${m}) = (${n})`:model.leftSubsetRight?`(${m}) ⊆ (${n})`:model.rightSubsetLeft?`(${n}) ⊆ (${m})`:tr(language,'互不包含','incomparable');
  return <Frame title={tr(language,'理想中的和与交','Sums and intersections of ideals')} formula="(m) + (n) = (gcd(m,n))" description={tr(language,'每一粒实心点是理想的一个整数成员。改变生成元，比较和包含两者、交包含于两者的关系。','Every filled point is an integer belonging to an ideal. Change the generators: the sum contains both ideals, and the intersection lies inside both.')} metrics={[{label:tr(language,'理想的和','Ideal sum'),value:`${model.sum}ℤ`},{label:tr(language,'理想的交','Intersection'),value:`${model.intersection}ℤ`},{label:tr(language,'包含关系','Inclusion'),value:relation}]} readout={<Readout language={language} summary={tr(language,`和 ${model.sum}ℤ 同时包含 ${m}ℤ 与 ${n}ℤ；交 ${model.intersection}ℤ 同时包含在两者中。窗口内四行分别有 ${model.rows.map(row=>row.values.length).join('、')} 个成员。`,`The sum ${model.sum}ℤ contains both ${m}ℤ and ${n}ℤ; the intersection ${model.intersection}ℤ is contained in both. The four rows contain ${model.rows.map(row=>row.values.length).join(', ')} members in the displayed window.`)} caption={tr(language,'−24 ≤ x ≤ 24 内的全部成员；理想本身无限','All members with −24 ≤ x ≤ 24; each ideal itself is infinite')} headers={[tr(language,'理想','Ideal'),tr(language,'生成元','Generator'),tr(language,'窗口中的整数','Integers in the window')]} rows={model.rows.map((row,i)=>[labels[i],row.generator,row.values.join(', ')])}/>} boundary={tr(language,'这是环 ℤ 中的主理想；显示窗口为 −24 到 24，理想本身有无限多个元素。一般环中的理想未必是主理想。','These are principal ideals in ℤ. The display window is −24 to 24; each ideal is infinite. Ideals in a general ring need not be principal.')} controls={<><Slider label={tr(language,'生成元 m','Generator m')} value={m} min={1} max={12} onChange={v=>{setM(v);onExplore?.()}}/><Slider label={tr(language,'生成元 n','Generator n')} value={n} min={1} max={12} onChange={v=>{setN(v);onExplore?.()}}/></>}>
    <Svg language={language} title={tr(language,'四个整数理想的成员','Members of four integer ideals')} description={tr(language,'四行依次为两个理想、它们的和与交。实心点代表该整数属于对应理想。','Rows show the two ideals, their sum, and their intersection. Filled dots denote membership.')} height={330}>
      {model.rows.map((row,i)=><g key={i}><text x={24} y={64+i*65+5} className="advanced-math-label">{labels[i]}</text><line x1={172} x2={668} y1={64+i*65} y2={64+i*65} stroke={palette.line}/>{Array.from({length:49},(_,j)=>j-24).map(v=><circle key={v} cx={x(v)} cy={64+i*65} r={v%row.generator===0?4.5:1.7} fill={v%row.generator===0?colors[i]:palette.line}/>)}</g>)}
      {[-24,-12,0,12,24].map(v=><text key={v} x={x(v)} y={300} textAnchor="middle" className="advanced-axis-label">{v}</text>)}
      <line x1={x(0)} x2={x(0)} y1={38} y2={281} stroke={palette.muted} strokeDasharray="2 5" opacity={.45}/>
    </Svg>
  </Frame>;
}
