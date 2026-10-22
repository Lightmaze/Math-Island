import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import artClips from './island-art-clips.json';

/**
 * Mathematical ecology: generated relief is illustrative; the SVG motifs below
 * are deterministic constructions. Knowledge, controls and accessible naming
 * belong to the containing destination / laboratory, not this decorative SVG.
 */
export interface IslandGlyphProps {
  kind: string;
  seed?: number;
  size?: number;
  className?: string;
  selected?: boolean;
}

type Point = readonly [number, number];
const INK = '#193a39';
const TEAL = '#2d6d64';
const COPPER = '#c9774c';
const PAPER = '#fbfaf4';
const PI = Math.PI;

function path(points: readonly Point[], close = false): string {
  return points.map(([x, y], index) => `${index ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ') + (close ? ' Z' : '');
}

function sample(fn: (t: number) => Point, from = 0, to = 1, steps = 80): Point[] {
  return Array.from({ length: steps + 1 }, (_, i) => fn(from + (to - from) * i / steps));
}

function seeded(seed: number): () => number {
  let state = (seed >>> 0) || 123456789;
  return () => {
    state ^= state << 13; state ^= state >>> 17; state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}

function Trace({ d, color = INK, width = 1.4, dash, opacity = 1 }: { d: string; color?: string; width?: number; dash?: string; opacity?: number }) {
  return <g fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={opacity}>
    <path d={d} stroke={PAPER} strokeWidth={width + 2.5} opacity=".65" />
    <path d={d} stroke={color} strokeWidth={width} strokeDasharray={dash} />
  </g>;
}

function Vertex({ point, color = TEAL, radius = 3 }: { point: Point; color?: string; radius?: number }) {
  return <circle cx={point[0]} cy={point[1]} r={radius} fill={PAPER} stroke={color} strokeWidth="1.4" />;
}

function prime(n: number): boolean {
  if (n < 2) return false;
  for (let p = 2; p * p <= n; p++) if (n % p === 0) return false;
  return true;
}

function circlePoints(n: number, radius = 46, yRadius = 31, rotation = -.5 * PI): Point[] {
  return Array.from({ length: n }, (_, i) => [120 + radius * Math.cos(rotation + 2 * PI * i / n), 88 + yRadius * Math.sin(rotation + 2 * PI * i / n)]);
}

function GraphicNetwork({ matroid = false, seed = 1 }: { matroid?: boolean; seed?: number }) {
  const points: Point[] = matroid ? [[120, 52], [74, 116], [166, 116], [120, 88]] : circlePoints(6, 48, 32, -.5 * PI + (seed % 4) * .05);
  const edges: [number, number][] = matroid
    ? [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3]]
    : [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 3], [1, 4], [2, 5]];
  return <>
    {edges.map(([a, b], i) => {
      const t = i > 5 ? .3 + (i - 6) * .15 : .5;
      return <g key={i}><Trace d={path([points[a], points[b]])} color={i < 3 ? COPPER : TEAL} width={i < 3 ? 2 : 1.1} />
        {!matroid && <text x={points[a][0] * (1 - t) + points[b][0] * t + 3} y={points[a][1] * (1 - t) + points[b][1] * t - 3} fontSize="7" fill={INK} stroke={PAPER} strokeWidth="2.4" paintOrder="stroke" textAnchor="middle">{1 + i * 3 % 7}</text>}
      </g>;
    })}
    {points.map((point, i) => <Vertex key={i} point={point} />)}
  </>;
}

function ObjectMotif({ kind, seed }: { kind: string; seed: number }): ReactNode {
  switch (kind) {
    case 'sieve':
      return <g>
        {Array.from({ length: 35 }, (_, i) => {
          const n = i + 1, x = 67 + i % 7 * 17.5, y = 52 + Math.floor(i / 7) * 14;
          return <g key={n}><rect x={x - 5.8} y={y - 6} width="13" height="12" rx="1.4" fill={prime(n) ? PAPER : '#d4dfd6'} fillOpacity={prime(n) ? .96 : .76} stroke={prime(n) ? COPPER : '#829a8e'} strokeWidth={prime(n) ? 1.2 : .55} />
            {prime(n) && <text x={x + .5} y={y + 2.2} fontSize="6.8" textAnchor="middle" fill={INK} fontFamily="Georgia,serif">{n}</text>}
          </g>;
        })}
      </g>;
    case 'elliptic':
      return <>
        {[1, -1].map(sign => <Trace key={sign} d={path(sample(x => [110 + x * 31, 88 - sign * Math.sqrt(Math.max(0, x * x * x - x + 1)) * 18], -1.324717957244746, 1.83))} color={COPPER} width={2} />)}
        <Trace d="M65 88 L177 88 M110 42 L110 130" width={.6} opacity={.55} />
        <Trace d="M69 70 L163 70" color={TEAL} width={1} />
        <Trace d="M79 70 L79 106" color={TEAL} width={.8} dash="2 3" />
        {[110, 141].map(x => <Vertex key={x} point={[x, 70]} radius={2.5} />)}
        <Vertex point={[79, 106]} radius={2.5} color={COPPER} />
      </>;
    case 'group': {
      const pts: Point[] = [[88, 56], [152, 56], [152, 120], [88, 120]];
      return <><Trace d={path(pts, true)} color={INK} width={2} />
        <Trace d="M120 46 L120 130 M78 88 L162 88" color={TEAL} width={.8} dash="3 4" />
        <Trace d={path([pts[0], pts[2]])} color={TEAL} width={.8} dash="3 4" />
        <Trace d={path([pts[1], pts[3]])} color={TEAL} width={.8} dash="3 4" />
        <Trace d="M110 69 A20 20 0 0 1 139 88 L134 82 M139 88 L142 80" color={COPPER} width={1.7} />
        {pts.map((point, i) => <g key={i}><Vertex point={point} color={i === 0 ? COPPER : TEAL} /><text x={point[0] + (i === 0 || i === 3 ? -9 : 9)} y={point[1] + 3} fontSize="8" fill={INK} textAnchor="middle">{i + 1}</text></g>)}
      </>;
    }
    case 'topology': {
      const point = (cx: number, angle: number): Point => [cx + 26 * Math.cos(angle), 87 - 26 * Math.sin(angle)];
      return <>
        {[83, 159].map(cx => <Trace key={cx} d={path(sample(t => point(cx, t), 0, 2 * PI))} color={TEAL} width={1} />)}
        <Trace d={path(sample(t => point(83, t), 0, .7 * PI))} color={COPPER} width={2.5} />
        <Trace d={path(sample(t => point(159, 2 * t), 0, .7 * PI))} color={COPPER} width={2.5} />
        <Trace d="M113 87 L130 87 L126 83 M130 87 L126 91" color={INK} width={1.2} />
        {[0, PI].map(t => <Vertex key={t} point={point(83, t)} radius={2.7} color={COPPER} />)}
        <Vertex point={point(159, 0)} radius={2.7} color={COPPER} />
        <text x="121" y="74" fontSize="8" textAnchor="middle" fill={INK} fontFamily="Georgia,serif">z ↦ z²</text>
      </>;
    }
    case 'homology': {
      const outer = circlePoints(6, 51, 34), inner = circlePoints(6, 23, 15);
      return <>
        {outer.map((point, i) => <Trace key={i} d={path([point, inner[i], inner[(i + 1) % 6], point, outer[(i + 1) % 6]])} color={TEAL} width={.95} />)}
        <Trace d={path(inner, true)} color={COPPER} width={2.3} />
        <Trace d={path(outer, true)} color={INK} width={1.6} />
        {[...outer, ...inner].map((point, i) => <Vertex key={i} point={point} radius={1.9} />)}
      </>;
    }
    case 'graph': return <GraphicNetwork seed={seed} />;
    case 'matroid': return <GraphicNetwork matroid seed={seed} />;
    case 'probability': {
      const rand = seeded(seed + 181), pts: Point[] = [[66, 88]];
      let value = 0;
      for (let i = 1; i <= 48; i++) {
        const normal = Math.sqrt(-2 * Math.log(Math.max(Number.EPSILON, rand()))) * Math.cos(2 * PI * rand());
        value += normal / Math.sqrt(48);
        pts.push([66 + i * 2.25, 88 - 13 * value]);
      }
      return <>
        {[1, -1].map(sign => <Trace key={sign} d={path(sample(t => [66 + 108 * t, 88 - sign * 26 * Math.sqrt(t)]))} color={TEAL} width={.7} dash="2 4" />)}
        <Trace d="M62 88 L181 88" color={TEAL} width={.7} dash="2 4" />
        <Trace d={path(pts)} color={COPPER} width={2.15} /><Vertex point={pts[0]} /><Vertex point={pts.at(-1)!} color={COPPER} />
      </>;
    }
    case 'fourier':
      return <>
        {[1, 3, 5].map((frequency, i) => <Trace key={frequency} d={path(sample(t => [65 + 110 * t, 65 + 20 * i - 12 / frequency * Math.sin(2 * PI * frequency * t)], 0, 1, 120))} color={i === 1 ? COPPER : TEAL} width={1.3} />)}
      </>;
    case 'finitefield':
      return <g>
        {Array.from({ length: 49 }, (_, i) => {
          const x = i % 7, y = Math.floor(i / 7), onCurve = y === (x * x + 1) % 7;
          return <circle key={i} cx={71 + x * 16.5} cy={119 - y * 10.5} r={onCurve ? 3.5 : .9} fill={onCurve ? COPPER : PAPER} stroke={onCurve ? PAPER : TEAL} strokeWidth={onCurve ? 1 : .5} />;
        })}
        <Trace d="M66 123 L176 123 M67 125 L67 50" color={TEAL} width={.8} />
        <text x="122" y="46" fontSize="8" fill={INK} textAnchor="middle" fontFamily="Georgia,serif">y = x² + 1 ∈ 𝔽₇</text>
      </g>;
    case 'optimization': {
      const points: Point[] = [];
      let x = 1.6, y = -1.5;
      for (let i = 0; i < 10; i++) { points.push([120 + x * 22, 91 + y * 22]); x *= .28; y *= .76; }
      return <>
        {[1, 2, 3, 4].map(n => <Trace key={n} d={path(sample(t => [120 + 7 * n * Math.cos(t), 91 + 7 * Math.sqrt(3) * n * Math.sin(t)], 0, 2 * PI))} width={.8} color={TEAL} />)}
        <Trace d={path(points)} color={COPPER} width={2} />{points.map((point, i) => <Vertex key={i} point={point} color={COPPER} radius={i ? 1.6 : 3} />)}
      </>;
    }
    case 'complex': {
      const before = (x: number, y: number): Point => [120 + 29 * x, 88 - 29 * y];
      const after = (x: number, y: number): Point => before(.7 * (x - y), .7 * (x + y));
      return <>
        {[-1, 0, 1].map(v => <g key={v}>
          <Trace d={path([before(v, -1.5), before(v, 1.5)])} color={TEAL} width={.6} dash="2 3" opacity={.8} />
          <Trace d={path([before(-1.5, v), before(1.5, v)])} color={TEAL} width={.6} dash="2 3" opacity={.8} />
          <Trace d={path([after(v, -1.2), after(v, 1.2)])} color={COPPER} width={1.1} />
          <Trace d={path([after(-1.2, v), after(1.2, v)])} color={COPPER} width={1.1} />
        </g>)}
        <Vertex point={before(0, 0)} radius={2.4} /><Vertex point={after(1, 0)} color={COPPER} radius={3} />
      </>;
    }
    case 'logic':
      return <g>
        <Trace d="M72 80 L172 80" color={INK} width={1.4} />
        <text x="99" y="70" fontSize="9.5" fill={INK} textAnchor="middle" fontFamily="Georgia,serif">f : A → B</text>
        <text x="157" y="70" fontSize="9.5" fill={INK} textAnchor="middle" fontFamily="Georgia,serif">x : A</text>
        <text x="120" y="102" fontSize="12" fill={COPPER} textAnchor="middle" fontFamily="Georgia,serif">f x : B</text>
      </g>;
    case 'fractal': {
      let segments: [number, number][] = [[67, 173]];
      const rows: ReactNode[] = [];
      for (let depth = 0; depth < 5; depth++) {
        rows.push(<g key={depth}>{segments.map(([a, b], i) => <Trace key={i} d={path([[a, 56 + depth * 15], [b, 56 + depth * 15]])} color={depth % 2 ? COPPER : TEAL} width={3.5} />)}</g>);
        segments = segments.flatMap(([a, b]) => [[a, a + (b - a) / 3], [b - (b - a) / 3, b]] as [number, number][]);
      }
      return <>{rows}</>;
    }
    case 'geometry': {
      const vertices: Point[] = [[120, 48], [120, 127], [72, 88], [168, 88], [120, 105], [120, 73]];
      const edges = [[0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [1, 3], [1, 4], [1, 5], [2, 4], [4, 3], [3, 5], [5, 2]];
      return <>
        {edges.map(([a, b], i) => <Trace key={i} d={path([vertices[a], vertices[b]])} color={TEAL} width={b === 5 || a === 5 ? .7 : 1.5} dash={b === 5 || a === 5 ? '2 3' : undefined} />)}
        {vertices.map((point, i) => <Vertex key={i} point={point} color={COPPER} radius={i === 5 ? 2 : 3.2} />)}
      </>;
    }
    case 'category': {
      const p: Point[] = [[76, 61], [166, 61], [76, 119], [166, 119]];
      return <>
        <Trace d={path([p[0], p[1], p[3]])} color={COPPER} width={2} />
        <Trace d="M155 56 L163 61 L155 66 M161 108 L166 116 L171 108" color={COPPER} width={1.5} />
        <Trace d={path([p[0], p[2], p[3]])} color={TEAL} width={2} />
        <Trace d="M71 108 L76 116 L81 108 M155 114 L163 119 L155 124" color={TEAL} width={1.5} />
        <Trace d={path([p[0], p[3]])} color={INK} width={.8} dash="3 3" />
        {p.map((point, i) => <g key={i}><Vertex point={point} radius={4} /><text x={point[0]} y={point[1] + (i < 2 ? -9 : 15)} fontSize="9" textAnchor="middle" fill={INK} fontFamily="Georgia,serif">{'ABCD'[i]}</text></g>)}
      </>;
    }
    case 'ideal':
      return <>
        {[2, 3, 6].map((m, row) => <g key={m}>
          <Trace d={path([[67, 59 + row * 28], [179, 59 + row * 28]])} color={TEAL} width={.7} />
          <text x="55" y={62 + row * 28} fontSize="8" textAnchor="middle" fill={INK} fontFamily="Georgia,serif">{m}ℤ</text>
          {Array.from({ length: 13 }, (_, i) => <g key={i}>
            <path d={`M${69 + i * 9} ${57 + row * 28}v4`} stroke={INK} strokeWidth=".55" />
            {(i - 6) % m === 0 && <Vertex point={[69 + i * 9, 59 + row * 28]} color={m === 6 ? COPPER : TEAL} radius={2.4} />}
          </g>)}
        </g>)}
        <text x="123" y="133" fontSize="7" textAnchor="middle" fill={INK}>0</text>
      </>;
    case 'spectrum':
      return <>
        <ellipse cx="121" cy="88" rx="57" ry="35" fill={PAPER} fillOpacity=".5" stroke={TEAL} strokeWidth=".8" />
        <ellipse cx="146" cy="88" rx="23" ry="26" fill="#e6c9a0" fillOpacity=".45" stroke={COPPER} strokeDasharray="3 3" strokeWidth="1.1" />
        {[2, 3].map((p, i) => <g key={p}><Vertex point={[93 + i * 53, 87]} color={p === 3 ? COPPER : TEAL} radius={4.2} /><text x={93 + i * 53} y="106" fontSize="10" textAnchor="middle" fill={INK} fontFamily="Georgia,serif">({p})</text></g>)}
        <text x="121" y="45" fontSize="8" textAnchor="middle" fill={INK} fontFamily="Georgia,serif">Spec(ℤ/12ℤ)</text>
      </>;
    case 'sheaf':
      return <>
        <ellipse cx="100" cy="91" rx="38" ry="28" fill="#e5eee5" fillOpacity=".65" stroke={TEAL} strokeWidth="1" />
        <ellipse cx="140" cy="91" rx="38" ry="28" fill="#ecd8bd" fillOpacity=".5" stroke={COPPER} strokeWidth="1" />
        <Trace d={path(sample(t => [66 + 109 * t, 91 - 17 * Math.sin(2.2 * PI * t)], 0, 1))} color={INK} width={2} />
        <Trace d="M114 65 L114 117 M127 65 L127 117" color={PAPER} width={.8} dash="2 4" />
      </>;
    case 'transport': {
      const mass = [[.2, 0, 0], [.1, .2, 0], [0, .1, .4]];
      return <>
        {mass.flatMap((row, i) => row.map((m, j) => m ? <Trace key={`${i}-${j}`} d={path([[75, 60 + i * 28], [165, 60 + j * 28]])} color={i === j ? COPPER : TEAL} width={m * 8} opacity={.85} /> : null))}
        {[[.2, .3, .5], [.3, .3, .4]].flatMap((masses, side) => masses.map((m, i) => <Vertex key={`${side}-${i}`} point={[75 + side * 90, 60 + i * 28]} radius={Math.sqrt(m) * 9} color={side ? COPPER : TEAL} />))}
      </>;
    }
    case 'heat':
      return <>
        {[0, .45, 1.2].map((time, i) => <Trace key={time} d={path(sample(t => [65 + t * 110, 90 - 27 * (Math.exp(-time) * Math.sin(2 * PI * t) + .35 * Math.exp(-9 * time) * Math.sin(6 * PI * t))], 0, 1, 120))} color={i === 0 ? COPPER : TEAL} width={i ? 1.2 : 2} opacity={1 - i * .14} />)}
      </>;
    case 'spectral':
      return <>
        {[1, 2, 3].map((n, row) => <g key={n}>
          <Trace d={path([[65, 61 + row * 27], [175, 61 + row * 27]])} color={TEAL} width={.5} />
          {Array.from({ length: 9 }, (_, i) => {
            const x = 76 + i * 11, base = 61 + row * 27, value = 13 * Math.sin(n * PI * (i + 1) / 10);
            return <g key={i}><Trace d={path([[x, base], [x, base - value]])} color={row === 1 ? COPPER : TEAL} width={1.2} /><Vertex point={[x, base - value]} color={row === 1 ? COPPER : TEAL} radius={1.6} /></g>;
          })}
        </g>)}
      </>;
    case 'lln': {
      const rand = seeded(seed + 193), pts: Point[] = [];
      let sum = 0;
      for (let n = 1; n <= 70; n++) { sum += rand() < .5 ? 1 : 0; pts.push([64 + n * 1.6, 123 - sum / n * 71]); }
      return <><Trace d="M65 87.5 L178 87.5" color={TEAL} width={1} dash="3 3" /><Trace d={path(pts)} color={COPPER} width={1.8} /></>;
    }
    case 'algebraiccurve':
      return <>
        <Trace d={path(sample(t => [120 + 35 * Math.cos(t), 88 + 35 * Math.sin(t)], 0, 2 * PI))} color={TEAL} width={1.6} />
        <Trace d={path(sample(t => [106 + 25 * t * t, 88 - 18 * t * t * t], -1.3, 1.3))} color={COPPER} width={2} />
      </>;
    default:
      return <GraphicNetwork seed={seed} />;
  }
}

type ReliefKey = keyof typeof artClips;
/** Each course has its own habitat; the six shared atlases are fetched once. */
const reliefByKind: Record<string, ReliefKey> = {
  sieve: 'h00', fourier: 'h01', graph: 'h10', homology: 'h11',
  group: 'c00', topology: 'c01', ideal: 'c10', spectrum: 'c11',
  sheaf: 'd00', transport: 'd01', heat: 'd10', spectral: 'd11',
  probability: 'e00', lln: 'e01', category: 'e10', logic: 'e11',
  fractal: 'f00', optimization: 'f01', algebraiccurve: 'f10', matroid: 'f11',
  elliptic: 'g00', geometry: 'g01', complex: 'g10', finitefield: 'g11',
};

export default function IslandGlyph({ kind, seed = 1, size = 200, className = '', selected = false }: IslandGlyphProps) {
  const id = useId().replace(/:/g, '');
  const element = useRef<SVGSVGElement>(null);
  const [artVisible, setArtVisible] = useState(selected);
  useEffect(() => {
    if (artVisible) return;
    if (!('IntersectionObserver' in window)) { setArtVisible(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setArtVisible(true); observer.disconnect(); }
    }, { rootMargin: '100px' });
    if (element.current) observer.observe(element.current);
    return () => observer.disconnect();
  }, [artVisible]);
  const artClipKey = reliefByKind[kind] ?? 'h10';
  const relief = artClips[artClipKey];
  const art = `${import.meta.env.BASE_URL}art/math-islands-${artClipKey[0]}.webp`;
  const offset = ((seed % 7) - 3) * .5;
  return <svg ref={element} className={`island-glyph ${className}`} width={size} height={size * .75}
    viewBox="0 0 240 180" aria-hidden="true" focusable="false" data-ecology={kind}
    style={{ overflow: 'visible', display: 'block', flexShrink: 0 }}>
    <defs>
      <filter id={`relief-shadow-${id}`} x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="0" dy={selected ? '5' : '3'} stdDeviation={selected ? '3' : '2'} floodColor={selected ? COPPER : INK} floodOpacity={selected ? '.18' : '.11'} />
      </filter>
    </defs>
    {selected && <ellipse cx="120" cy="117" rx="112" ry="48" fill="none" stroke={COPPER} strokeWidth="1.4" strokeDasharray="4 5" opacity=".8" />}
    <g filter={`url(#relief-shadow-${id})`}>
      <svg x={offset} y="-3" width="240" height="180" viewBox={relief.viewBox} preserveAspectRatio="xMidYMid meet" overflow="hidden">
        <defs>
          <clipPath id={`relief-land-${id}`} clipPathUnits="userSpaceOnUse"><path d={relief.path} /></clipPath>
        </defs>
        {(artVisible || selected) && <image href={art} x="0" y="0" width="1024" height="1024" preserveAspectRatio="none" clipPath={`url(#relief-land-${id})`} />}
      </svg>
    </g>
    <g opacity={selected ? '.98' : '.88'} transform={`translate(${offset} -3)`}>
      <ObjectMotif kind={kind} seed={seed} />
    </g>
  </svg>;
}

