import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { ArrowRight, Focus, Minus, Plus } from 'lucide-react';
import IslandGlyph from './IslandGlyph';
import type { Island } from '../data/islands';
import type { Language } from '../lib/state';
import type { LearningJourney } from '../data/journeys';

const WORLD = { width: 1650, height: 1370 };
const position = (island: Island) => ({ x: 115 + island.x * 14.4, y: 150 + island.y * 11.8 });
interface Transform { x: number; y: number; scale: number }
export default function EducationMap({ islands, selected, visibleIds, language, onSelect, onEnter, journey, focusToken }: {
  islands: Island[]; selected: string; visibleIds: Set<string>; language: Language;
  onSelect: (id: string) => void; onEnter: (id: string) => void; journey?: LearningJourney; focusToken: number;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 1000, height: 800 });
  const [transform, setTransform] = useState<Transform>({ x: -70, y: -20, scale: .92 });
  const [dragging, setDragging] = useState(false);
  const initial = useRef(true);
  const drag = useRef<{ id: number; x: number; y: number; ox: number; oy: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ distance: number; transform: Transform; center: { x: number; y: number } } | null>(null);
  const latest = useRef(transform); latest.current = transform;
  useEffect(() => {
    if (!frame.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width, height = entry.contentRect.height;
      setSize({ width, height });
      if (initial.current && width > 0) {
        initial.current = false;
        const mobile = width < 640;
        const target = islands.find(i => i.id === selected);
        const p = target ? position(target) : { x: 518, y: 268 };
        const scale = mobile ? .66 : Math.min(.95, width / 1080);
        const focusDesktop = !mobile && selected !== 'elliptic-garden';
        setTransform({ x: mobile ? width * .5 - p.x * scale : focusDesktop ? width * .6 - p.x * scale : 0, y: mobile ? height * .28 - p.y * scale : focusDesktop ? height * .48 - p.y * scale : -25, scale });
      }
    });
    observer.observe(frame.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (focusToken === 0) return;
    const island = islands.find(i => i.id === selected);
    if (!island) return;
    const p = position(island);
    setTransform(t => ({ scale: Math.max(t.scale, size.width < 640 ? .82 : .92), x: size.width * .57 - p.x * Math.max(t.scale, size.width < 640 ? .82 : .92), y: size.height * .48 - p.y * Math.max(t.scale, size.width < 640 ? .82 : .92) }));
  }, [focusToken, selected, islands, size.width, size.height]);
  function zoom(factor: number, cx = size.width / 2, cy = size.height / 2) {
    setTransform(t => {
      const scale = Math.min(2.1, Math.max(.3, t.scale * factor));
      return { scale, x: cx - (cx - t.x) * scale / t.scale, y: cy - (cy - t.y) * scale / t.scale };
    });
  }
  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const wheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const rect = element.getBoundingClientRect();
      zoom(e.deltaY > 0 ? .92 : 1.08, e.clientX - rect.left, e.clientY - rect.top);
    };
    element.addEventListener('wheel', wheel, { passive: false });
    return () => element.removeEventListener('wheel', wheel);
  }, [size.width, size.height]);
  function down(e: ReactPointerEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest('button, a, select')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    pointers.current.set(e.pointerId, point);
    e.currentTarget.setPointerCapture(e.pointerId);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { distance: Math.hypot(a.x - b.x, a.y - b.y), transform: latest.current, center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } };
      drag.current = null;
    } else drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, ox: transform.x, oy: transform.y };
    setDragging(true);
  }
  function move(e: ReactPointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(e.pointerId)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointers.current.set(e.pointerId, { x: e.clientX - rect.left, y: e.clientY - rect.top });
    if (pinch.current && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()], p = pinch.current;
      const scale = Math.max(.3, Math.min(2.1, p.transform.scale * Math.hypot(a.x - b.x, a.y - b.y) / Math.max(1, p.distance)));
      const center = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      setTransform({ scale, x: center.x - (p.center.x - p.transform.x) * scale / p.transform.scale, y: center.y - (p.center.y - p.transform.y) * scale / p.transform.scale });
    } else if (drag.current?.id === e.pointerId) {
      const d = drag.current;
      setTransform(t => ({ ...t, x: d.ox + e.clientX - d.x, y: d.oy + e.clientY - d.y }));
    }
  }
  function end(e: ReactPointerEvent<HTMLDivElement>) {
    pointers.current.delete(e.pointerId); drag.current = null; pinch.current = null; setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  }
  const fit = () => {
    const scale = Math.min((size.width - 64) / WORLD.width, (size.height - 80) / WORLD.height);
    setTransform({ scale, x: (size.width - WORLD.width * scale) / 2, y: (size.height - WORLD.height * scale) / 2 + 10 });
  };
  const currentIsland = islands.find(i => i.id === selected);
  const overview = transform.scale < .44;
  const points = journey?.islands.map(id => islands.find(i => i.id === id)).filter((i): i is Island => Boolean(i)).map(position) || [];
  return <div ref={frame} className={`education-map ${dragging ? 'dragging' : ''} ${overview ? 'map-overview' : ''}`} onPointerDown={down} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end} tabIndex={0} role="region" aria-label={language === 'zh' ? '教学群岛地图；方向键平移，加减键缩放，Home 总览' : 'Educational map. Arrow keys pan, plus and minus zoom, Home fits all islands.'} onKeyDown={e => {
    if (e.target !== e.currentTarget) return;
    const offsets: Record<string, [number, number]> = { ArrowLeft: [70, 0], ArrowRight: [-70, 0], ArrowUp: [0, 70], ArrowDown: [0, -70] };
    if (offsets[e.key]) { e.preventDefault(); const [x, y] = offsets[e.key]; setTransform(t => ({ ...t, x: t.x + x, y: t.y + y })); }
    if (e.key === '+' || e.key === '=') { e.preventDefault(); zoom(1.2); }
    if (e.key === '-') { e.preventDefault(); zoom(.83); }
    if (e.key === 'Home') { e.preventDefault(); fit(); }
  }}>
    <svg className="sea-lines" width="100%" height="100%" aria-hidden="true"><defs><pattern id="sea-contours" width="220" height="170" patternUnits="userSpaceOnUse"><path d="M-20 20C35-15 80 60 140 20S230 10 240 45M-20 28C35-7 80 68 140 28S230 18 240 53M-20 36C35 1 80 76 140 36S230 26 240 61M-20 108C30 75 72 143 130 110S210 85 240 123M-20 116C30 83 72 151 130 118S210 93 240 131" fill="none" stroke="#bdcfc5" strokeWidth=".6" opacity=".3"/></pattern></defs><rect width="100%" height="100%" fill="url(#sea-contours)"/></svg>
    <div className="island-world" style={{ width: WORLD.width, height: WORLD.height, transform: `translate(${transform.x}px,${transform.y}px) scale(${transform.scale})` }}>
      {points.length > 1 && <svg className="learning-route-lines" width={WORLD.width} height={WORLD.height} aria-hidden="true"><defs><marker id="learning-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="#bd653c" strokeWidth="1.1"/></marker></defs>{points.slice(1).map((p, i) => <path key={i} d={`M${points[i].x} ${points[i].y}Q${(p.x + points[i].x) / 2 + 70} ${(p.y + points[i].y) / 2 - 60} ${p.x} ${p.y}`} fill="none" stroke="#bd653c" strokeWidth="1.6" strokeDasharray="5 7" markerEnd="url(#learning-arrow)"/>)}</svg>}
      {islands.map((island, i) => {
        const p = position(island), active = selected === island.id, visible = visibleIds.has(island.id);
        return <div key={island.id} className={`island-stop ${active ? 'selected' : ''} ${visible ? '' : 'filtered'}`} style={{ left: p.x, top: p.y, zIndex: active ? 3 : 1 }}>
          <IslandGlyph kind={island.labKey} seed={i + 1} size={205} selected={active}/>
          <button className="island-hit-target" onClick={() => { onSelect(island.id); if (overview) setTransform({ scale: .85, x: size.width * .55 - p.x * .85, y: size.height * .45 - p.y * .85 }); }} onFocus={e => { if (e.currentTarget.matches(':focus-visible')) { frame.current?.scrollTo(0, 0); const box = e.currentTarget.getBoundingClientRect(), bounds = frame.current?.getBoundingClientRect(); if (bounds && (box.right < bounds.left || box.left > bounds.right || box.bottom < bounds.top || box.top > bounds.bottom)) setTransform(t => ({ ...t, x: size.width * .6 - p.x * t.scale, y: size.height * .48 - p.y * t.scale })); } }} aria-pressed={active} aria-label={`${island.title[language]} — ${island.subtitle[language]}`} tabIndex={visible && active ? 0 : -1} disabled={!visible}>
            <span className="island-name" style={{ transform: `scale(${Math.min(active ? 6 : 3.4, Math.max(.5, 1 / transform.scale))})` }}>{island.title[language]}</span>
          </button>
          {journey?.islands.includes(island.id) && <span className="journey-step" aria-hidden="true">{journey.islands.indexOf(island.id) + 1}</span>}
        </div>;
      })}
    </div>
    <div className="map-tools" onPointerDown={e => e.stopPropagation()}><button aria-label={language === 'zh' ? '放大地图' : 'Zoom in'} onClick={() => zoom(1.22)} disabled={transform.scale >= 2.1}><Plus size={20}/></button><button aria-label={language === 'zh' ? '缩小地图' : 'Zoom out'} onClick={() => zoom(.82)} disabled={transform.scale <= .3}><Minus size={20}/></button><button aria-label={language === 'zh' ? `总览${islands.length}座教学岛` : `Fit all ${islands.length} educational islands`} title={language === 'zh' ? '总览' : 'Fit map'} onClick={fit}><Focus size={20}/></button></div>
    {currentIsland && <button className="mobile-island-entry" onClick={() => onEnter(currentIsland.id)}>{currentIsland.title[language]}<ArrowRight size={17}/></button>}
    <div className="map-caption">{overview ? (language === 'zh' ? '群岛总览 · 点选一座岛放大' : 'Overview · Select an island to zoom in') : (language === 'zh' ? `${islands.length} 座对象课堂 · 地貌为对象示意` : `${islands.length} object explorations · Illustrative habitats`)}<span>{language === 'zh' ? '拖动航行 · Ctrl / ⌘ + 滚轮缩放' : 'Drag to navigate · Ctrl / ⌘ + wheel to zoom'}</span></div>
  </div>;
}
