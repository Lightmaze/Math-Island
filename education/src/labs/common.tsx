import { createContext, useContext, useId, useState, type ReactNode } from 'react';

export type Language = 'zh' | 'en';
export const LabLanguageContext = createContext<Language>('zh');
export type LabProps = { language: Language };
export const tr = (language: Language, zh: string, en: string) => language === 'zh' ? zh : en;
export const PALETTE = { ink: '#244947', muted: '#6f827b', grid: '#dce4d9', sea: '#e8efe5', teal: '#367f78', coral: '#c97958', gold: '#ba9d59', purple: '#8c80a5', blue: '#647e9d' };
/** Text inks are separate from mark colors: small labels need at least 4.5:1. */
export const TEXT_PALETTE = { ink: '#244947', muted: '#4f665d', teal: '#205f59', coral: '#884325', gold: '#68501d', purple: '#605077', blue: '#415a77' };
export function labelInk(color: string) {
  const key = (Object.keys(TEXT_PALETTE) as (keyof typeof TEXT_PALETTE)[]).find(key => PALETTE[key] === color);
  return key ? TEXT_PALETTE[key] : TEXT_PALETTE.ink;
}
export const fmt = (x: number, digits = 2) => Number.isFinite(x) ? (Math.abs(x) >= 1e5 ? x.toExponential(2) : Number(x.toFixed(digits)).toString()) : '—';

export function LabFrame({ title, subtitle, formula, metrics = [], controls, note, legend, data, children }: {
  title: string; subtitle?: string; formula?: string; metrics?: { label: string; value: ReactNode }[];
  controls: ReactNode; note: ReactNode; legend?: ReactNode; data?: ReactNode; children: ReactNode;
}) {
  return <section className="object-lab" aria-label={title}>
    <div className="lab-heading"><div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>{formula && <div className="lab-formula">{formula}</div>}</div>
    <div className="lab-stage">{children}</div>
    {legend && <div className="lab-legend">{legend}</div>}
    <div className="lab-controls">{controls}</div>
    {metrics.length > 0 && <div className="lab-metrics" aria-live="polite">{metrics.map(m => <div key={m.label}><span>{m.label}</span><output>{m.value}</output></div>)}</div>}
    {data}
    <p className="lab-note">{note}</p>
  </section>;
}

export function Slider({ label, value, min, max, step = 1, onChange, display }: { label: string; value: number; min: number; max: number; step?: number; onChange: (n: number) => void; display?: string }) {
  const id = useId();
  return <label className="lab-control lab-slider" htmlFor={id}><span>{label}<output>{display ?? value}</output></span><input id={id} type="range" value={value} min={min} max={max} step={step} onChange={e => onChange(Number(e.target.value))} /></label>;
}

export function Select({ label, value, options, onChange }: { label: string; value: string | number; options: { value: string | number; label: string }[]; onChange: (value: string) => void }) {
  const id = useId();
  return <label className="lab-control" htmlFor={id}><span>{label}</span><select id={id} value={value} onChange={e => onChange(e.target.value)}>{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>;
}

export function MathSvg({ title, children, viewBox = '0 0 640 340', className = '', ...props }: { title: string; children: ReactNode; viewBox?: string; className?: string } & Omit<React.SVGProps<SVGSVGElement>, 'children'>) {
  const [enlarged, setEnlarged] = useState(false), language = useContext(LabLanguageContext), id = useId();
  return <div className={`lab-figure${enlarged ? ' is-enlarged' : ''}`}>
    <div id={id} className="lab-figure-scroll" tabIndex={enlarged ? 0 : undefined} role={enlarged ? 'region' : undefined} aria-label={enlarged ? title : undefined}>
      <svg className={`lab-svg ${className}`} viewBox={viewBox} role="img" aria-label={title} {...props}><title>{title}</title>{children}</svg>
    </div>
    <div className="lab-figure-tools"><span>{enlarged ? tr(language, '横向滑动查看', 'Scroll horizontally to inspect') : tr(language, '可放大查看图中细节', 'Enlarge to inspect the details')}</span><button type="button" aria-controls={id} aria-pressed={enlarged} onClick={() => setEnlarged(v => !v)}>{enlarged ? tr(language, '适应宽度', 'Fit width') : tr(language, '放大图形', 'Enlarge figure')}</button></div>
  </div>;
}

export type Point = [number, number];
export function coordinates(xmin = -3, xmax = 3, ymin = -3, ymax = 3, width = 640, height = 340, margin = 34) {
  const x = (v: number) => margin + (v - xmin) * (width - 2 * margin) / (xmax - xmin);
  const y = (v: number) => height - margin - (v - ymin) * (height - 2 * margin) / (ymax - ymin);
  return { x, y, xmin, xmax, ymin, ymax, width, height, margin, point: ([a, b]: Point): Point => [x(a), y(b)] };
}
export type Coordinates = ReturnType<typeof coordinates>;
export function linePath(points: Point[], map?: Coordinates) { return points.map((p, i) => { const [x, y] = map ? map.point(p) : p; return `${i ? 'L' : 'M'}${fmt(x, 3)},${fmt(y, 3)}`; }).join(' '); }

export function CartesianGrid({ c, xticks, yticks, xlabel = 'x', ylabel = 'y' }: { c: Coordinates; xticks?: number[]; yticks?: number[]; xlabel?: string; ylabel?: string }) {
  const xs = xticks ?? Array.from({ length: Math.floor(c.xmax) - Math.ceil(c.xmin) + 1 }, (_, i) => Math.ceil(c.xmin) + i);
  const ys = yticks ?? Array.from({ length: Math.floor(c.ymax) - Math.ceil(c.ymin) + 1 }, (_, i) => Math.ceil(c.ymin) + i);
  return <g className="lab-grid">{xs.map(n => <g key={`x${n}`}><line x1={c.x(n)} x2={c.x(n)} y1={c.margin} y2={c.height - c.margin} stroke={n === 0 ? '#a1b5aa' : PALETTE.grid} /><text x={c.x(n)} y={c.height - 12} textAnchor="middle">{fmt(n)}</text></g>)}{ys.map(n => <g key={`y${n}`}><line x1={c.margin} x2={c.width - c.margin} y1={c.y(n)} y2={c.y(n)} stroke={n === 0 ? '#a1b5aa' : PALETTE.grid} /><text x={c.margin - 9} y={c.y(n) + 4} textAnchor="end">{fmt(n)}</text></g>)}<text x={c.width - 12} y={30} textAnchor="end">{xlabel}</text><text x={c.margin - 10} y={30}>{ylabel}</text></g>;
}

export function PointMark({ point, label, color = PALETTE.teal, radius = 5 }: { point: Point; label?: string; color?: string; radius?: number }) {
  return <g><circle cx={point[0]} cy={point[1]} r={radius} fill={color} stroke="#fcfbf4" strokeWidth="2" />{label && <text className="lab-point-label" x={point[0] + 9} y={point[1] - 9} fill={labelInk(color)}>{label}</text>}</g>;
}
