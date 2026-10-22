import {useId,useState,useRef,useLayoutEffect,type CSSProperties,type ReactNode} from 'react';
export type Language = 'zh' | 'en';
export type AdvancedProps = { language: Language; onExplore?: () => void };
export const tr = (language: Language, zh: string, en: string) => language === 'zh' ? zh : en;
export const palette = {ink:'#193a39',teal:'#2d6d64',copper:'#c9774c',muted:'#738c85',line:'#cbd8d1',paper:'#fbfaf4',sea:'#eef3ef',pale:'#d9e7df'};
export function number(value:number,digits=3) {
  const rounded=Number(value.toFixed(digits));
  return (Object.is(rounded,-0)?0:rounded).toLocaleString('en-US',{maximumFractionDigits:digits});
}
export function Frame({title,formula,description,children,controls,metrics,boundary,readout}:{title:string;formula:string;description:string;children:ReactNode;controls:ReactNode;metrics:{label:string;value:string}[];boundary:string;readout?:ReactNode}) {
  return <section className="advanced-lab" aria-label={title}>
    <div className="advanced-heading"><h3>{title}</h3><p className="advanced-formula">{formula}</p></div>
    <p className="advanced-description">{description}</p>
    <div className="advanced-canvas">{children}</div>
    <div className="advanced-controls">{controls}</div>
    <dl className="advanced-metrics">{metrics.map(m=><div key={m.label}><dt>{m.label}</dt><dd>{m.value}</dd></div>)}</dl>
    {readout}
    <p className="advanced-boundary">{boundary}</p>
  </section>;
}
/** A current-state description remains visible; the numerical table is an optional deeper route. */
export function Readout({language,summary,caption,headers,rows}:{language:Language;summary:string;caption:string;headers:string[];rows:(string|number)[][]}) {
  return <section className="advanced-readout" aria-label={tr(language,'图形的文字与数据','Text and data for the chart')}>
    <p className="advanced-state" aria-live="polite" aria-atomic="true">{summary}</p>
    <details className="advanced-data"><summary>{tr(language,'查看当前数据表','Read the current data table')}</summary><p className="advanced-table-hint">{tr(language,'窄屏可横向滑动；聚焦表格后也可用左右键。','On narrow screens, scroll sideways or focus the table and use the arrow keys.')}</p><div className="advanced-table-region" role="region" aria-label={caption} tabIndex={0}><table><caption>{caption}</caption><thead><tr>{headers.map((header,i)=><th key={i} scope="col">{header}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=>j===0?<th key={j} scope="row">{cell}</th>:<td key={j}>{cell}</td>)}</tr>)}</tbody></table></div></details>
  </section>;
}
export function Slider({label,value,min,max,step=1,onChange,format=String}:{label:string;value:number;min:number;max:number;step?:number;onChange:(value:number)=>void;format?:(value:number)=>string}) {
  const id=useId();
  return <div className="advanced-control"><label htmlFor={id}><span>{label}</span><output htmlFor={id}>{format(value)}</output></label><input id={id} type="range" value={value} min={min} max={max} step={step} onChange={e=>onChange(Number(e.target.value))}/></div>;
}
export function Select({label,value,options,onChange}:{label:string;value:string;options:{value:string;label:string}[];onChange:(value:string)=>void}) {
  const id=useId();
  return <div className="advanced-control"><label htmlFor={id}>{label}</label><select id={id} value={value} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></div>;
}
export function Svg({title,description,children,height=340,language}:{title:string;description:string;children:ReactNode;height?:number;language:Language}) {
  const id=useId();
  const [enlarged,setEnlarged]=useState(false);
  const ref=useRef<SVGSVGElement>(null);
  const [labelSize,setLabelSize]=useState(30);
  useLayoutEffect(()=>{
    const svg=ref.current;
    if(!svg) return;
    const update=()=>{
      const scale=Math.abs(svg.getScreenCTM()?.a??0);
      if(scale>0) {
        // Aim for 14 screen pixels, never fall below 12, and retain the tested narrow-screen spacing.
        const preferred=Math.min(30,14/scale);
        const next=Math.max(16,preferred,12/scale);
        setLabelSize(current=>Math.abs(current-next)>.01?next:current);
      }
    };
    update();
    const observer=new ResizeObserver(update);
    observer.observe(svg);
    return ()=>observer.disconnect();
  },[enlarged]);
  return <>
    <div className="advanced-plot-controls"><button type="button" aria-pressed={enlarged} aria-controls={`${id}-plot`} onClick={()=>setEnlarged(value=>!value)}>{enlarged?tr(language,'适应宽度','Fit width'):tr(language,'放大图形','Enlarge figure')}</button><span>{enlarged?tr(language,'横向滑动查看','Scroll horizontally to inspect'):tr(language,'细节可放大，数据见下方','Enlarge details; data below')}</span></div>
    <div id={`${id}-plot`} className={`advanced-plot-scroll${enlarged?' is-enlarged':''}`} role="region" aria-label={title} tabIndex={enlarged?0:undefined}>
      <svg ref={ref} viewBox={`0 0 720 ${height}`} role="img" aria-labelledby={`${id}-title ${id}-desc`} className="advanced-svg" style={{'--advanced-label-size':`${labelSize}px`} as CSSProperties}><title id={`${id}-title`}>{title}</title><desc id={`${id}-desc`}>{description}</desc>{children}</svg>
    </div>
  </>;
}
export function plotScale(xmin=-3,xmax=3,ymin=-2.6,ymax=2.6,height=330,padding=44) {
  const x=(v:number)=>padding+(v-xmin)/(xmax-xmin)*(720-2*padding);
  const y=(v:number)=>height-padding-(v-ymin)/(ymax-ymin)*(height-2*padding);
  return {x,y,xmin,xmax,ymin,ymax,height,padding};
}
/** Preserve Euclidean shape: one coordinate unit has the same length on both axes. */
export function equalPlotScale(xmin=-3,xmax=3,ymin=-2.6,ymax=2.6,height=420,padding=40) {
  const unit=Math.min((720-2*padding)/(xmax-xmin),(height-2*padding)/(ymax-ymin));
  const left=(720-unit*(xmax-xmin))/2,top=(height-unit*(ymax-ymin))/2;
  const x=(v:number)=>left+(v-xmin)*unit;
  const y=(v:number)=>top+(ymax-v)*unit;
  return {x,y,xmin,xmax,ymin,ymax,height,padding};
}
export function Axes({scale,xTicks=[-2,-1,0,1,2],yTicks=[-2,-1,0,1,2],xLabel='x',yLabel='y'}:{scale:ReturnType<typeof plotScale>;xTicks?:number[];yTicks?:number[];xLabel?:string;yLabel?:string}) {
  const {x,y,xmin,xmax,ymin,ymax}=scale;
  const left=x(xmin),right=x(xmax),top=y(ymax),bottom=y(ymin);
  return <g className="advanced-axes">
    {xTicks.filter(v=>v>=xmin&&v<=xmax).map(v=><g key={`x${v}`}><line x1={x(v)} x2={x(v)} y1={top} y2={bottom} stroke={v===0?palette.muted:palette.line} strokeWidth={v===0?1.2:.6}/><text x={x(v)} y={bottom+19} textAnchor="middle">{number(v,1)}</text></g>)}
    {yTicks.filter(v=>v>=ymin&&v<=ymax).map(v=><g key={`y${v}`}><line x1={left} x2={right} y1={y(v)} y2={y(v)} stroke={v===0?palette.muted:palette.line} strokeWidth={v===0?1.2:.6}/><text x={left-10} y={y(v)+4} textAnchor="end">{number(v,1)}</text></g>)}
    <text x={right+16} y={y(0)+4}>{xLabel}</text><text x={x(0)+10} y={top-13}>{yLabel}</text>
  </g>;
}
export function path(points:[number,number][],x:(v:number)=>number,y:(v:number)=>number) {
  return points.map(([a,b],i)=>`${i?'L':'M'}${x(a).toFixed(2)},${y(b).toFixed(2)}`).join(' ');
}
