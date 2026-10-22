import {useEffect,useId,useMemo,useState,type ReactNode} from 'react';
import type {ConnectionLabProps,ConnectionSnapshot} from './types';
import {fourierHeat,transportCdfScenario,cdfAt,type ProbabilityAtom} from './analysis-models';
import './analysis.css';

type Language=ConnectionLabProps['language'];
const tr=(language:Language,zh:string,en:string)=>language==='zh'?zh:en;
const colors={ink:'#193a39',teal:'#2d6d64',copper:'#bd6034',muted:'#637a70',line:'#c9d7ce',paper:'#fbfaf4'};
const fmt=(value:number,digits=4)=>{const rounded=Number(value.toFixed(digits));return (Object.is(rounded,-0)?0:rounded).toLocaleString('en-US',{maximumFractionDigits:digits})};
function Range({label,value,min,max,step,onChange}:{label:string;value:number;min:number;max:number;step:number;onChange:(value:number)=>void}) {
  const id=useId();return <div className="ac-control"><label htmlFor={id}>{label}<output htmlFor={id}>{fmt(value,2)}</output></label><input id={id} type="range" min={min} max={max} step={step} value={value} onChange={event=>onChange(Number(event.target.value))}/></div>;
}
function Plot({title,description,caption,children}:{title:string;description:string;caption:string;children:ReactNode}) {
  const id=useId();return <figure className="ac-figure"><h3>{title}</h3><svg viewBox="0 0 480 320" role="img" aria-labelledby={`${id}-title ${id}-description`}><title id={`${id}-title`}>{title}</title><desc id={`${id}-description`}>{description}</desc>{children}</svg><figcaption>{caption}</figcaption></figure>;
}
function Table({title,headers,rows,language}:{title:string;headers:string[];rows:(string|number)[][];language:Language}) {
  return <details className="ac-data"><summary>{title}</summary><p className="ac-table-help">{tr(language,'数值最多保留六位小数；窄屏可横向查看。','Values are rounded to at most six decimals; narrow tables scroll horizontally.')}</p><div className="ac-table-scroll" role="region" aria-label={title} tabIndex={0}><table><caption>{title}</caption><thead><tr>{headers.map((header,index)=><th key={index} scope="col">{header}</th>)}</tr></thead><tbody>{rows.map((row,index)=><tr key={index}>{row.map((value,column)=>column===0?<th key={column} scope="row">{value}</th>:<td key={column}>{value}</td>)}</tr>)}</tbody></table></div></details>;
}
function Metrics({values}:{values:{label:string;value:string}[]}) {return <dl className="ac-metrics">{values.map(value=><div key={value.label}><dt>{value.label}</dt><dd>{value.value}</dd></div>)}</dl>}
const linePath=(points:[number,number][],x:(n:number)=>number,y:(n:number)=>number)=>points.map(([a,b],index)=>`${index?'L':'M'}${x(a).toFixed(2)},${y(b).toFixed(2)}`).join(' ');

export function HeatFourierLab({language,onSnapshot}:ConnectionLabProps) {
  const [time,setTime]=useState(.12),[mean,setMean]=useState(.2),[coefficients,setCoefficients]=useState([1,.45,-.3,.2]);
  const model=useMemo(()=>fourierHeat(coefficients,mean,time),[coefficients,mean,time]);
  const initial=useMemo(()=>fourierHeat(coefficients,mean,0),[coefficients,mean]);
  const snapshot=useMemo<ConnectionSnapshot>(()=>({parameters:{time,mean,coefficients:[...coefficients]},observations:{energy:model.energy,initialEnergy:model.initialEnergy,energyDerivative:model.energyDerivative,mean:model.mean,variance:model.variance,currentCoefficients:model.modes.map(mode=>mode.current)}}),[time,mean,coefficients,model]);
  useEffect(()=>{onSnapshot?.(snapshot)},[onSnapshot,snapshot]);
  const samples=Array.from({length:241},(_,index)=>-Math.PI+index*Math.PI/120);
  const bound=Math.max(1,Math.abs(mean)+coefficients.reduce((sum,a)=>sum+Math.abs(a),0));
  const x=(value:number)=>72+(value+Math.PI)/(2*Math.PI)*360,y=(value:number)=>145-value/bound*106;
  const barX=(frequency:number)=>110+(frequency-1)*96,barY=(value:number)=>151-value/1.5*104;
  const curve=()=>{
    setCoefficients([1,.45,-.3,.2]);setMean(.2);setTime(0);
  };
  return <section className="analysis-connection" aria-label={tr(language,'傅里叶模态与热流联岛实验','Fourier modes and heat flow connection')}>
    <div className="ac-paired-plots">
      <Plot title={tr(language,'频率域 · 模态的衰减','Frequency domain · mode decay')} description={tr(language,'铜色虚框表示初始系数，青色实心柱表示当前系数；正负号保留。','Copper dashed outlines are initial coefficients; solid teal bars are current coefficients, retaining their signs.')} caption={tr(language,'铜色虚框：aₖ；青色实心：aₖe⁻ᵏ²ᵗ。均值 m 是不衰减的零频模态。','Copper outline: aₖ. Teal fill: aₖe⁻ᵏ²ᵗ. The mean m is the unchanged zero-frequency mode.')}>
        {[-1.5,0,1.5].map(value=><g key={value}><line x1={72} x2={438} y1={barY(value)} y2={barY(value)} stroke={colors.line}/><text x={62} y={barY(value)+7} textAnchor="end">{value}</text></g>)}
        {model.modes.map(mode=><g key={mode.frequency}><rect x={barX(mode.frequency)-29} y={Math.min(barY(0),barY(mode.initial))} width={58} height={Math.abs(barY(mode.initial)-barY(0))} fill="none" stroke={colors.copper} strokeDasharray="7 5" strokeWidth={2}/><rect x={barX(mode.frequency)-18} y={Math.min(barY(0),barY(mode.current))} width={36} height={Math.abs(barY(mode.current)-barY(0))} fill={colors.teal}/><text x={barX(mode.frequency)} y={294} textAnchor="middle">k={mode.frequency}</text></g>)}
      </Plot>
      <Plot title={tr(language,'空间域 · 同一个热方程解','Spatial domain · the same heat solution')} description={tr(language,'铜色虚线是初始温度偏差，青色实线是当前温度偏差；水平点线是均值。','The copper dashed curve is initial temperature deviation, the solid teal curve is current deviation, and the dotted horizontal line is the mean.')} caption={tr(language,'x 为周期坐标，区间 [−π,π] 两端相接。纵轴随初始系数确定，推进时间时保持固定。','x is periodic: the endpoints of [−π,π] are identified. The vertical range depends on the initial coefficients and stays fixed while time changes.')}>
        {[-bound,0,bound].map(value=><g key={value}><line x1={72} x2={434} y1={y(value)} y2={y(value)} stroke={colors.line}/><text x={62} y={y(value)+7} textAnchor="end">{fmt(value,1)}</text></g>)}
        <line x1={72} x2={434} y1={y(mean)} y2={y(mean)} stroke={colors.muted} strokeDasharray="3 6"/>
        <path d={linePath(samples.map(value=>[value,initial.value(value)]),x,y)} fill="none" stroke={colors.copper} strokeWidth={2.5} strokeDasharray="7 6"/>
        <path d={linePath(samples.map(value=>[value,model.value(value)]),x,y)} fill="none" stroke={colors.teal} strokeWidth={3.5}/>
        {[-Math.PI,0,Math.PI].map(value=><text key={value} x={x(value)} y={294} textAnchor="middle">{value===0?'0':value<0?'−π':'π'}</text>)}
      </Plot>
    </div>
    <div className="ac-controls"><Range label={tr(language,'扩散时间 t','Diffusion time t')} value={time} min={0} max={1.2} step={.01} onChange={setTime}/><Range label={tr(language,'平均温度偏差 m','Mean temperature deviation m')} value={mean} min={-.5} max={.5} step={.05} onChange={setMean}/>{coefficients.map((coefficient,index)=><Range key={index} label={`${tr(language,'初始系数','Initial coefficient')} a${index+1}`} value={coefficient} min={-1.5} max={1.5} step={.05} onChange={value=>setCoefficients(previous=>previous.map((item,i)=>i===index?value:item))}/>)}<button type="button" className="ac-button" onClick={curve}>{tr(language,'恢复示例初值（t=0）','Restore example initial data (t=0)')}</button></div>
    <p className="ac-equation">u(x,t)=m+∑ₖ₌₁⁴ aₖe⁻ᵏ²ᵗ sin(kx)</p>
    <p className="ac-intro">{tr(language,'改变同一组傅里叶系数，再推进时间。左图的每个模态决定右图的一部分；高频项更快衰减，空间曲线与能量由同一组系数计算。','Change one set of Fourier coefficients, then advance time. Each mode on the left contributes to the curve on the right; higher frequencies decay faster. Both the curve and its energy come from the same coefficients.')}</p>
    <Metrics values={[{label:tr(language,'当前 L² 能量 E(t)','Current L² energy E(t)'),value:fmt(model.energy,6)},{label:tr(language,'初始 L² 能量 E(0)','Initial L² energy E(0)'),value:fmt(model.initialEnergy,6)},{label:tr(language,'能量变化率 E′(t)','Energy derivative E′(t)'),value:fmt(model.energyDerivative,6)},{label:tr(language,'保持不变的均值','Conserved mean'),value:fmt(mean,2)}]}/>
    <p className="ac-equation ac-small-equation">E(t)=∫₋π^π u² dx=2πm²+π∑aₖ²e⁻²ᵏ²ᵗ<br/>E′(t)=−2∫₋π^π |uₓ|² dx</p>
    <p className="ac-reading" aria-live="polite" aria-atomic="true">{tr(language,`t=${fmt(time,2)} 时，能量为 ${fmt(model.energy,6)}，均值为 ${fmt(mean,2)}。能量下限是常数模态的 2πm²=${fmt(model.constantEnergy,6)}；均值非零时，热流不会把总 L² 能量降到零。`,`At t=${fmt(time,2)}, energy is ${fmt(model.energy,6)} and mean is ${fmt(mean,2)}. The constant mode contributes the lower bound 2πm²=${fmt(model.constantEnergy,6)}; a nonzero mean prevents total L² energy from decaying to zero.`)}</p>
    <Table language={language} title={tr(language,'核对每个模态的振幅与能量','Check each mode’s amplitude and energy')} headers={['k','aₖ','e⁻ᵏ²ᵗ','aₖ(t)',tr(language,'能量','Energy')]} rows={[[0,fmt(mean,6),'1',fmt(mean,6),fmt(model.constantEnergy,6)],...model.modes.map(mode=>[mode.frequency,fmt(mode.initial,6),fmt(mode.decay,6),fmt(mode.current,6),fmt(mode.energy,6)])]}/>
    <p className="ac-boundary">{tr(language,'适用范围：周期 2π、扩散系数 1 的热方程 uₜ=uₓₓ；初值限定为常数加四个正弦模态。这些有限和满足方程，能量恒等式来自正交性与分部积分。曲线是采样图，表中数值使用浮点运算；没有宣称任意初值都被四个模态精确表示。','Scope: uₜ=uₓₓ on a circle of period 2π with diffusivity 1. Initial data is a constant plus four sine modes. These finite sums solve the PDE; orthogonality and integration by parts give the energy identities. Curves are sampled and numbers use floating-point arithmetic; arbitrary initial data is not represented exactly by four modes.')}</p>
  </section>;
}

export function TransportCdfLab({language,onSnapshot}:ConnectionLabProps) {
  const [translation,setTranslation]=useState(.6),[tilt,setTilt]=useState(.4),[centralMass,setCentralMass]=useState(.5);
  const model=useMemo(()=>transportCdfScenario(translation,tilt,centralMass),[translation,tilt,centralMass]);
  const snapshot=useMemo<ConnectionSnapshot>(()=>({parameters:{translation,tilt,centralMass},observations:{transportCost:model.cost,cdfArea:model.cdfArea,identityResidual:model.identityResidual,marginalResidual:model.marginalResidual,sourceMasses:model.source.map(atom=>atom.mass),targetMasses:model.target.map(atom=>atom.mass),cdfDifferences:model.intervals.map(interval=>interval.difference)}}),[translation,tilt,centralMass,model]);
  useEffect(()=>{onSnapshot?.(snapshot)},[onSnapshot,snapshot]);
  const x=(value:number)=>72+(value+3.2)/6.4*360,y=(value:number)=>257-value*209;
  const stepPath=(atoms:ProbabilityAtom[])=>{
    const positive=atoms.filter(atom=>atom.mass>0);let probability=0;let d=`M${x(-3.2)},${y(0)}`;
    for(const atom of positive){d+=` H${x(atom.position)} V${y(probability+=atom.mass)}`}
    return d+` H${x(3.2)}`;
  };
  return <section className="analysis-connection" aria-label={tr(language,'离散概率与一维运输联岛实验','Discrete probability and one-dimensional transport connection')}>
    <div className="ac-paired-plots">
      <Plot title={tr(language,'运输计划 · 质量守恒','Transport plan · conserved mass')} description={tr(language,'上排是源分布 μ，下排是目标分布 ν；带宽按实际运输质量成比例。零质量点为空心。','The upper row is source μ and the lower row target ν. Band widths are proportional to transported mass. Zero-mass points are hollow.')} caption={tr(language,'圆旁为位置，圆中为概率。上下两排只区分测度；费用只计算横向位置差。','Outside each circle is position; inside is probability. The two rows distinguish measures; cost uses only the difference in horizontal coordinates.')}>
        {[83,228].map(level=><line key={level} x1={72} x2={434} y1={level} y2={level} stroke={colors.line}/>)}
        {model.flows.map((flow,index)=><path key={index} d={`M${x(model.source[flow.source].position)},94 C${x(model.source[flow.source].position)},143 ${x(model.target[flow.target].position)},173 ${x(model.target[flow.target].position)},217`} fill="none" stroke={flow.source%2?colors.copper:colors.teal} opacity={.42} strokeWidth={flow.mass*58}/>)}
        {[{atoms:model.source,level:83,color:colors.teal},{atoms:model.target,level:228,color:colors.copper}].map(({atoms,level,color},row)=>atoms.map((atom,index)=><g key={`${row}-${index}`}><circle cx={x(atom.position)} cy={level} r={25} fill={atom.mass>0?colors.paper:'none'} stroke={color} strokeWidth={2} strokeDasharray={atom.mass===0?'4 4':undefined}/><text x={x(atom.position)} y={level+7} textAnchor="middle">{fmt(atom.mass,2)}</text><text x={x(atom.position)} y={level+(row?52:-38)} textAnchor="middle">{fmt(atom.position,2)}</text></g>))}
        <text x={16} y={90}>μ</text><text x={16} y={235}>ν</text>
      </Plot>
      <Plot title={tr(language,'分布函数 · 面积就是费用','Distribution functions · area is cost')} description={tr(language,'青色实线为 Fμ，铜色虚线为 Fν。每块阴影是一个支持点间隔上的 |Fμ−Fν| 面积。','Solid teal is Fμ and dashed copper is Fν. Each shaded rectangle is the area of |Fμ−Fν| over an interval between support points.')} caption={tr(language,'F(x)=P(X≤x) 取右连续值。空心点是左极限，实心点是当前值；竖段只标跳跃。阴影宽度是位置间隔。','F(x)=P(X≤x) takes the right-continuous value. Hollow dots are left limits; filled dots are the values. Vertical segments only mark jumps. Shading width is a position interval.')}>
        {[0,.5,1].map(value=><g key={value}><line x1={72} x2={434} y1={y(value)} y2={y(value)} stroke={colors.line}/><text x={62} y={y(value)+7} textAnchor="end">{value}</text></g>)}
        {model.intervals.map((interval,index)=><rect key={index} x={x(interval.left)} y={y(Math.max(interval.sourceCdf,interval.targetCdf))} width={x(interval.right)-x(interval.left)} height={Math.abs(y(interval.sourceCdf)-y(interval.targetCdf))} fill={interval.difference>=0?colors.teal:colors.copper} opacity={.18}/>)}
        <path d={stepPath(model.source)} fill="none" stroke={colors.teal} strokeWidth={3}/><path d={stepPath(model.target)} fill="none" stroke={colors.copper} strokeWidth={3} strokeDasharray="7 5"/>
        {[{atoms:model.source,color:colors.teal},{atoms:model.target,color:colors.copper}].map(({atoms,color},row)=>atoms.filter(atom=>atom.mass>0).map((atom,index)=><g key={`${row}-${index}`}><circle cx={x(atom.position)} cy={y(cdfAt(atoms,atom.position)-atom.mass)} r={4.5} fill={colors.paper} stroke={color} strokeWidth={1.7}/><circle cx={x(atom.position)} cy={y(cdfAt(atoms,atom.position))} r={4.5} fill={color}/></g>))}
        {[-3,0,3].map(value=><text key={value} x={x(value)} y={294} textAnchor="middle">{value}</text>)}
      </Plot>
    </div>
    <div className="ac-controls"><Range label={tr(language,'目标位置平移 δ','Target translation δ')} value={translation} min={-1} max={1} step={.05} onChange={setTranslation}/><Range label={tr(language,'目标两端质量倾斜 b','Target outer-mass tilt b')} value={tilt} min={-1} max={1} step={.05} onChange={setTilt}/><Range label={tr(language,'中心概率 p','Central probability p')} value={centralMass} min={0} max={1} step={.05} onChange={setCentralMass}/><button type="button" className="ac-button" onClick={()=>{setTranslation(0);setTilt(0)}}>{tr(language,'让两个分布相同','Make the distributions identical')}</button></div>
    <p className="ac-equation">W₁(μ,ν)=min ∑ᵢⱼ πᵢⱼ|xᵢ−yⱼ|=∫ℝ |Fμ−Fν| dx</p>
    <p className="ac-intro">{tr(language,'同一对概率分布有两种读法：左边跟踪每份质量运到哪里，右边累积质量并测量两条 CDF 之间的面积。改变位置或概率，两边的费用同步变化。','Read the same pair of probability distributions in two ways: track each transported mass on the left, or accumulate probability and measure the area between the CDFs on the right. Changing positions or probabilities updates both costs together.')}</p>
    <Metrics values={[{label:tr(language,'运输费用 ∑π|x−y|','Transport cost ∑π|x−y|'),value:fmt(model.cost,6)},{label:tr(language,'CDF 阴影面积','Shaded CDF area'),value:fmt(model.cdfArea,6)},{label:tr(language,'两种计算的浮点差','Floating-point discrepancy'),value:model.identityResidual.toExponential(2)},{label:tr(language,'边际质量最大误差','Maximum marginal error'),value:model.marginalResidual.toExponential(2)}]}/>
    <p className="ac-reading" aria-live="polite" aria-atomic="true">{tr(language,`当前 ${model.flows.length} 条非零运输分量的费用为 ${fmt(model.cost,6)}；${model.intervals.length} 个支持点间隔的面积和为 ${fmt(model.cdfArea,6)}。两侧总概率均为 1。${model.cost===0?'此时两分布相同，CDF完全重合。':''}`,`The ${model.flows.length} positive transport flows cost ${fmt(model.cost,6)}; areas over ${model.intervals.length} support intervals sum to ${fmt(model.cdfArea,6)}. Both total probabilities are 1. ${model.cost===0?'The distributions coincide, so their CDFs overlap.':''}`)}</p>
    <div className="ac-data-pair"><Table language={language} title={tr(language,'逐条核对运输分量','Check the transport flows')} headers={['xᵢ','yⱼ','πᵢⱼ','πᵢⱼ|xᵢ−yⱼ|']} rows={model.flows.map(flow=>[fmt(model.source[flow.source].position,6),fmt(model.target[flow.target].position,6),fmt(flow.mass,6),fmt(flow.cost,6)])}/><Table language={language} title={tr(language,'逐区间核对 CDF 面积','Check the CDF interval areas')} headers={[tr(language,'区间 [a,b)','Interval [a,b)'),'Fμ','Fν',tr(language,'面积','Area')]} rows={model.intervals.map(interval=>[`[${fmt(interval.left,4)}, ${fmt(interval.right,4)})`,fmt(interval.sourceCdf,6),fmt(interval.targetCdf,6),fmt(interval.area,6)])}/></div>
    <p className="ac-boundary">{tr(language,'适用范围：实线上有限概率测度，费用为 |x−y|，因此这里计算的是 W₁。单调耦合是最优计划之一，但不保证唯一；允许分拆质量。CDF 面积恒等式使用一维顺序结构，不可直接当作高维运输公式或 W₂ 公式。矩形面积按支持间隔求和，没有用图像像素估计。','Scope: finite probability measures on the real line with cost |x−y|, hence W₁. Monotone coupling is optimal, may split mass, and need not be unique. The CDF-area identity depends on one-dimensional order; it is not a higher-dimensional formula or a formula for W₂. Rectangle areas are summed over support intervals, not estimated from image pixels.')}</p>
    <p className="ac-visually-hidden">{tr(language,`在 x=0 处，右连续值 Fμ(0)=${fmt(cdfAt(model.source,0),6)}，Fν(0)=${fmt(cdfAt(model.target,0),6)}。`,`At x=0, the right-continuous values are Fμ(0)=${fmt(cdfAt(model.source,0),6)} and Fν(0)=${fmt(cdfAt(model.target,0),6)}.`)}</p>
  </section>;
}
