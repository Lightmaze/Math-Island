import { useCallback, useDeferredValue, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { assertAtlasBridges, assertAtlasEdges, assertAtlasIndex, decodeAtlasNodes } from '../data/atlas-types';
import type { AtlasBridge, AtlasBridges, AtlasEducationalSearch, AtlasEdges, AtlasIndex, AtlasLanguage, AtlasNode } from '../data/atlas-types';
import './CoreAtlas.css';

export interface CoreAtlasProps {
  language: AtlasLanguage;
  onSelect: (id: string) => void;
  selectedId?: string;
  curatedCoreIds?: string[];
  onOpenLesson?: (coreId: string) => void;
  educationalSearch?: AtlasEducationalSearch;
}

interface View { zoom: number; panX: number; panY: number }
interface Size { width: number; height: number }
interface Point { x: number; y: number }
interface PointLayerCache {
  canvas: HTMLCanvasElement; marks: object; origin: Point;
  width: number; height: number; dpr: number; margin: number;
}
const PAGE_SIZE = 24;
const MAX_BACKGROUND_EDGES = 6000;
const TEXT = {
  zh: {
    title: '完整数学群岛', subtitle: '在来源图谱中定位一个对象，沿记录中的关系继续阅读。',
    search: '检索全部岛屿', placeholder: '名称、稳定 ID 或领域，如 sieve、elliptic…', allDomains: '所有海域',
    domain: '海域', references: '显示背景引用', zoomIn: '放大', zoomOut: '缩小', reset: '全图',
    download: '保存视图', share: '复制位置', found: '个匹配条目', total: '个来源条目', edges: '条关系',
    searchHelp: '名称保留来源原文；可用英文名称、别名或稳定 ID 检索。', selectHelp: '点击一个岛屿，查看来源与相邻航线。',
    loading: '正在展开完整图谱…', edgeLoading: '正在载入引用关系…', error: '图谱暂时未能载入。', retry: '重新载入',
    edgeError: '节点已可使用，引用关系暂未能载入。', noResults: '没有匹配的条目。试试英文名称或稳定 ID。',
    previous: '上一页', next: '下一页', page: '页', source: '阅读原始来源', lesson: '进入生态课堂',
    degree: '记录连接度', kind: '来源类型', provenance: '来源与适用范围', neighbors: '相邻航线',
    outward: '出向引用', inward: '入向引用', evidence: '查看这条关系的依据', noNeighbors: '该快照未记录相邻航线。',
    notIsolation: '没有记录到链接，不意味着数学上孤立。', more: '展开更多航线', quality: '源文质量注记',
    originalNotes: '以下注记保留原审查文字。', motif: '海域图案取自代表性数学对象，是分区标识；每个实心点才是一个来源条目。',
    guideTitle: '这张图怎么读', guide: '位置沿用本体图谱；二维距离不表示数学难度或逻辑距离。点的大小对应记录连接度，空心金环表示有教育入口。引用线用于阅读导航，不自动表示证明依赖。',
    selectedGuide: '选中节点显示它的全部邻接边；背景引用开启时至多绘出 6,000 条，完整关系保存在数据中。',
    keyboard: '拖动平移，滚轮或双指缩放；也可使用按钮。地图获得焦点后，用方向键平移、加减号缩放、Home 复位。',
    copied: '链接已复制', copyUnavailable: '无法自动复制；浏览器地址栏已更新，可直接复制。',
    sourceType: '这里保留来源内容类型，不作为数学工具的形式类型认证。',
    curve: '对象示意', snapshot: '来源快照', resultOf: '个条目中的', clear: '清除检索',
    edgeDetails: '关系记录细节', locator: '来源定位', status: '记录状态', validity: '数学有效性记录',
    routes: '条文献航线', routePrompt: '选择一条跨域联系', routeSubtitle: '读清楚一个工具如何进入另一个领域。',
    routeFrame: '查看两端', routeClose: '收起航线', routeLoading: '正在载入文献航线…', routeError: '文献航线暂未能载入。',
    routeMechanism: '如何相连', routeConditions: '适用条件', routeConclusion: '得到什么', routeLimitations: '结论的边界',
    routeSource: '阅读这条航线的文献', routeAudit: '源文阅读记录', routeReport: '查看原始航线报告',
    routePassage: '原记录的阅读范围', routeReview: '审查范围', routeNotFormal: '原记录：未经证明助手核验',
    educationalMatch: '匹配教育解释', bridgeMatch: '匹配航线说明', attribution: '数据来源与许可',
  },
  en: {
    title: 'The complete archipelago', subtitle: 'Locate an object in the source atlas, then follow its recorded relationships.',
    search: 'Search every island', placeholder: 'Name, stable ID, or subject: sieve, elliptic…', allDomains: 'All regions',
    domain: 'Region', references: 'Show background references', zoomIn: 'Zoom in', zoomOut: 'Zoom out', reset: 'Fit all',
    download: 'Save view', share: 'Copy location', found: 'matching entries', total: 'sourced entries', edges: 'relations',
    searchHelp: 'Source titles are preserved. Search original names, aliases, or stable IDs.', selectHelp: 'Select an island to inspect its source and neighboring routes.',
    loading: 'Opening the complete atlas…', edgeLoading: 'Loading reference routes…', error: 'The atlas could not be loaded.', retry: 'Try again',
    edgeError: 'Nodes are available; reference routes could not be loaded.', noResults: 'No matching entries. Try an English source name or a stable ID.',
    previous: 'Previous', next: 'Next', page: 'page', source: 'Read the original source', lesson: 'Open the ecology lesson',
    degree: 'Recorded degree', kind: 'Source type', provenance: 'Sources and scope', neighbors: 'Neighboring routes',
    outward: 'Outgoing reference', inward: 'Incoming reference', evidence: 'Inspect this relation’s evidence', noNeighbors: 'No neighboring route is recorded in this snapshot.',
    notIsolation: 'An absent recorded link does not establish mathematical isolation.', more: 'Show more routes', quality: 'Source-quality notes',
    originalNotes: 'These notes preserve the original review wording.', motif: 'Region emblems show representative mathematical objects. They are labels, not extra entries; each solid point is a sourced entry.',
    guideTitle: 'Reading this map', guide: 'Positions come from the core atlas. Two-dimensional distance is not mathematical difficulty or logical distance. Point size reflects recorded degree; gold rings mark educational entry points. Reference lines support reading and do not automatically certify proof dependencies.',
    selectedGuide: 'Selecting a node shows all its adjacent edges. Background references are limited to 6,000 lines; the dataset retains every relation.',
    keyboard: 'Drag to pan; use the wheel, pinch, or buttons to zoom. With the map focused, use arrow keys to pan, plus/minus to zoom, and Home to reset.',
    copied: 'Location copied', copyUnavailable: 'Automatic copy is unavailable. The browser address has been updated; copy it directly.',
    sourceType: 'This is the source’s content type, not a formally verified mathematical-tool type.',
    curve: 'Object sketch', snapshot: 'Source snapshot', resultOf: 'entries; showing', clear: 'Clear search',
    edgeDetails: 'Relation record details', locator: 'Source locator', status: 'Recorded status', validity: 'Mathematical-validity record',
    routes: 'literature routes', routePrompt: 'Choose a cross-field connection', routeSubtitle: 'Read how a tool enters another mathematical field.',
    routeFrame: 'Frame both ends', routeClose: 'Close route', routeLoading: 'Loading literature routes…', routeError: 'Literature routes could not be loaded.',
    routeMechanism: 'How the connection works', routeConditions: 'Conditions', routeConclusion: 'What follows', routeLimitations: 'Limits of the conclusion',
    routeSource: 'Read the literature for this route', routeAudit: 'Source-reading record', routeReport: 'Read the original route report',
    routePassage: 'Recorded passage scope', routeReview: 'Review scope', routeNotFormal: 'Original record: not proof-assistant checked',
    educationalMatch: 'Matches educational text', bridgeMatch: 'Matches a route description', attribution: 'Data sources and licenses',
  },
};
const RELATIONS: Record<string, [string, string]> = {
  proof_reference: ['证明文本引用', 'Reference in proof text'], statement_reference: ['陈述文本引用', 'Reference in a statement'],
  encyclopedic_link: ['来源正文链接', 'Source-body link'], title_matched_link: ['名称匹配链接', 'Title-matched link'],
  literature_bridge: ['文献数学桥梁', 'Documented mathematical bridge'],
};
const EDGE_COLORS: Record<string, string> = {
  proof_reference: '#3e827b', statement_reference: '#737ca2', encyclopedic_link: '#6f907c',
  title_matched_link: '#a48b59', literature_bridge: '#c9774c',
};
const EMPTY_CURATED: string[] = [];
const MOTIFS: Record<string, [string, string]> = {
  polynomial: ['多项式曲线示意', 'Polynomial-curve sketch'], ideal: ['理想包含于环的示意：I ⊆ R', 'An ideal included in its ring: I ⊆ R'],
  diagram: ['三个对象之间的图式', 'A diagram between three objects'], symmetry: ['多边形及其对称结构', 'A polygon and its symmetry structure'],
  torus: ['环面的投影轮廓示意', 'Projected torus outline'], wave: ['周期函数的波形示意', 'Periodic-function waveform'],
  prime: ['按行排列 1–25，标出其中的素数', 'Primes marked in a row-wise grid of integers 1–25'],
  logic: ['全称量词与蕴含符号', 'Universal quantification and implication'], graph: ['有限图的顶点与连边', 'Vertices and edges of a finite graph'],
  distribution: ['概率密度的钟形曲线示意', 'Bell-shaped probability-density sketch'], field: ['常向量场', 'A constant vector field'],
  contour: ['正定二次型的等值线示意', 'Level curves of a positive-definite quadratic form'],
};
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const safeUrl = (url: string) => /^https?:\/\//.test(url) ? url : '#';
const initialParameter = (name: string) => typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get(name) ?? '';

function Glyph({ type }: { type: string }) {
  // Mathematical emblems label regions; these strokes are not graph edges.
  const paths: Record<string, string> = {
    polynomial: 'M3 20C8 20 8 3 13 5S17 23 23 3', ideal: 'M2 2H24V24H2ZM7 7H19V19H7Z',
    diagram: 'M4 5H21L13 21ZM4 5L13 21', symmetry: 'M13 2L23 9L19 21H7L3 9ZM13 2V21M3 9L19 21M23 9L7 21',
    torus: 'M2 13C2 2 24 2 24 13S2 24 2 13ZM8 13C8 9 18 9 18 13S8 17 8 13',
    wave: 'M1 13C5 1 9 1 13 13S21 25 25 13',
    prime: [2, 3, 5, 7, 11, 13, 17, 19, 23].map(n => `M${2 + ((n - 1) % 5) * 5} ${2 + Math.floor((n - 1) / 5) * 5}h3v3h-3Z`).join(''),
    logic: 'M3 4L8 22L13 4M5 15H11M15 13H24M20 9L24 13L20 17', graph: 'M4 5L21 7L15 22L4 5L3 19L21 7M3 19L15 22',
    distribution: 'M2 22C7 22 7 3 13 3S19 22 24 22', field: 'M3 5H22M18 2L22 5L18 8M3 13H22M18 10L22 13L18 16M3 21H22M18 18L22 21L18 24',
    contour: 'M2 13C2 2 24 2 24 13S2 24 2 13ZM6 13C6 6 20 6 20 13S6 20 6 13ZM10 13C10 10 16 10 16 13S10 16 10 13',
  };
  return <svg viewBox="0 0 26 26" aria-hidden="true"><path d={paths[type] ?? paths.graph} fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function MapIcon({ kind }: { kind: 'plus' | 'minus' | 'fit' | 'download' | 'link' }) {
  const paths = { plus: 'M12 5v14M5 12h14', minus: 'M5 12h14', fit: 'M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5M8 8h8v8H8z',
    download: 'M12 3v12M7 10l5 5 5-5M4 17v4h16v-4', link: 'M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-2 2M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l2-2' };
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[kind]} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function CoreAtlas({ language, onSelect, selectedId, curatedCoreIds = EMPTY_CURATED, onOpenLesson, educationalSearch }: CoreAtlasProps) {
  const t = TEXT[language];
  const uniqueId = useId();
  const [index, setIndex] = useState<AtlasIndex | null>(null);
  const [graph, setGraph] = useState<AtlasEdges | null>(null);
  const [bridges, setBridges] = useState<AtlasBridges | null>(null);
  const [bridgeId, setBridgeId] = useState(() => initialParameter('atlasBridge'));
  const [loadError, setLoadError] = useState(false);
  const [edgeError, setEdgeError] = useState(false);
  const [bridgeError, setBridgeError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState(() => initialParameter('atlasSearch'));
  const deferredQuery = useDeferredValue(query.normalize('NFKC').toLocaleLowerCase().trim());
  const [domainId, setDomainId] = useState(() => initialParameter('atlasDomain'));
  const [activeId, setActiveId] = useState(() => initialParameter('atlasBridge') ? initialParameter('atlasNode') : selectedId ?? initialParameter('atlasNode'));
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [references, setReferences] = useState(false);
  const [page, setPage] = useState(0);
  const [neighborLimit, setNeighborLimit] = useState(16);
  const [copyMessage, setCopyMessage] = useState('');
  const [size, setSize] = useState<Size>({ width: 900, height: 620 });
  const [measured, setMeasured] = useState(false);
  const [view, setView] = useState<View>({ zoom: 1, panX: 0, panY: 0 });
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointLayerRef = useRef<PointLayerCache | null>(null);
  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef<{ start: Point; view: View; moved: boolean; distance?: number; center?: Point } | null>(null);
  const restoreView = useRef(true);
  const restoreBridge = useRef(true);
  const previousBaseScale = useRef<number | null>(null);
  const viewRef = useRef(view);
  viewRef.current = view;

  useEffect(() => {
    const abort = new AbortController();
    let stopped = false;
    setLoadError(false); setEdgeError(false); setBridgeError(false); setGraph(null); setBridges(null);
    const load = async () => {
      try {
        const base = import.meta.env.BASE_URL;
        const response = await fetch(`${base}data/atlas-index.json`, { signal: abort.signal, cache: 'no-cache' });
        if (!response.ok) throw new Error('Index fetch failed');
        const data: unknown = await response.json();
        assertAtlasIndex(data);
        if (stopped) return;
        setIndex(data);
        const loadEdges = async () => { try {
          const edgeResponse = await fetch(`${base}data/atlas-edges.json`, { signal: abort.signal, cache: 'no-cache' });
          if (!edgeResponse.ok) throw new Error('Edge fetch failed');
          const edgeData: unknown = await edgeResponse.json();
          assertAtlasEdges(edgeData, data);
          if (!stopped) setGraph(edgeData);
        } catch (error) {
          if (!stopped && !(error instanceof DOMException && error.name === 'AbortError')) setEdgeError(true);
        } };
        const loadBridges = async () => { try {
          const bridgeResponse = await fetch(`${base}data/atlas-bridges.json`, { signal: abort.signal, cache: 'no-cache' });
          if (!bridgeResponse.ok) throw new Error('Bridge guide fetch failed');
          const bridgeData: unknown = await bridgeResponse.json();
          assertAtlasBridges(bridgeData, data);
          if (!stopped) setBridges(bridgeData);
        } catch (error) {
          if (!stopped && !(error instanceof DOMException && error.name === 'AbortError')) setBridgeError(true);
        } };
        await Promise.allSettled([loadEdges(), loadBridges()]);
      } catch (error) {
        if (!stopped && !(error instanceof DOMException && error.name === 'AbortError')) setLoadError(true);
      }
    };
    void load();
    return () => { stopped = true; abort.abort(); };
  }, [attempt]);

  const nodes = useMemo(() => index ? decodeAtlasNodes(index) : [], [index]);
  const byId = useMemo(() => new Map(nodes.map(node => [node.id, node])), [nodes]);
  const curated = useMemo(() => new Set(curatedCoreIds), [curatedCoreIds]);
  const selectedBridge = useMemo(() => bridges?.records.find(bridge => bridge.id === bridgeId), [bridges, bridgeId]);
  const bridgeText = selectedBridge?.text[language];
  const bridgeEndpoints = useMemo(() => selectedBridge
    ? [byId.get(selectedBridge.sourceId), byId.get(selectedBridge.targetId)].filter(Boolean) as AtlasNode[] : [], [selectedBridge, byId]);
  const bridgeEndpointIndices = useMemo(() => new Set(bridgeEndpoints.map(node => node.index)), [bridgeEndpoints]);
  const educationAliases = useMemo(() => new Map(Object.entries(educationalSearch?.entries ?? {})
    .filter(([id]) => byId.has(id)).map(([id, aliases]) => [id, aliases.join(' ').normalize('NFKC').toLocaleLowerCase()])), [educationalSearch, byId]);
  const bridgeAliases = useMemo(() => {
    const terms = new Map<string, string[]>();
    for (const bridge of bridges?.records ?? []) for (const id of [bridge.sourceId, bridge.targetId]) {
      const list = terms.get(id) ?? [];
      list.push(bridge.text.zh.title, bridge.text.en.title, bridge.text.zh.endpoints, bridge.text.en.endpoints);
      terms.set(id, list);
    }
    return new Map([...terms].map(([id, values]) => [id, values.join(' ').normalize('NFKC').toLocaleLowerCase()]));
  }, [bridges]);
  const active = byId.get(activeId ?? '');
  const hovered = byId.get(hoveredId ?? '');
  useEffect(() => {
    if (!index || !graph || !bridges) return;
    try { assertAtlasBridges(bridges, index, graph); }
    catch { setBridges(null); setBridgeError(true); }
  }, [index, graph, bridges]);
  useEffect(() => { railRef.current?.scrollTo({ top: 0 }); }, [activeId, bridgeId]);
  const bounds = useMemo(() => {
    const domains = index?.domains ?? [];
    const xs = domains.flatMap(d => [d.center[0] - d.radius, d.center[0] + d.radius]);
    const ys = domains.flatMap(d => [d.center[1] - d.radius, d.center[1] + d.radius]);
    const minX = xs.length ? Math.min(...xs) : -9, maxX = xs.length ? Math.max(...xs) : 7;
    const minY = ys.length ? Math.min(...ys) : -4, maxY = ys.length ? Math.max(...ys) : 5;
    return { minX, maxX, minY, maxY, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 };
  }, [index]);
  const baseScale = Math.max(1, Math.min((size.width - 90) / (bounds.maxX - bounds.minX), (size.height - 110) / (bounds.maxY - bounds.minY)));

  useEffect(() => {
    if (!measured) return;
    const previous = previousBaseScale.current;
    previousBaseScale.current = baseScale;
    if (previous !== null && previous !== baseScale) {
      const ratio = baseScale / previous;
      setView(current => ({ ...current, panX: current.panX * ratio, panY: current.panY * ratio }));
    }
  }, [baseScale, measured]);
  const scale = baseScale * view.zoom;
  const project = useCallback((x: number, y: number) => ({ x: size.width / 2 + (x - bounds.cx) * scale + view.panX,
    y: size.height / 2 - (y - bounds.cy) * scale + view.panY }), [size, bounds, scale, view.panX, view.panY]);
  const unproject = useCallback((x: number, y: number) => ({ x: bounds.cx + (x - size.width / 2 - view.panX) / scale,
    y: bounds.cy - (y - size.height / 2 - view.panY) / scale }), [size, bounds, scale, view.panX, view.panY]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const resize = new ResizeObserver(entries => {
      const box = entries[0].contentRect;
      setSize({ width: Math.max(1, box.width), height: Math.max(1, box.height) });
      setMeasured(true);
    });
    resize.observe(el);
    return () => resize.disconnect();
  }, [index]);

  useEffect(() => {
    if (!index || !measured || !restoreView.current) return;
    restoreView.current = false;
    const z = Number(initialParameter('atlasZoom')), x = Number(initialParameter('atlasX')), y = Number(initialParameter('atlasY'));
    if (z >= .7 && z <= 24 && Number.isFinite(x) && Number.isFinite(y)) {
      setView({ zoom: z, panX: -(x - bounds.cx) * baseScale * z, panY: (y - bounds.cy) * baseScale * z });
    } else {
      const initialNode = byId.get(selectedId ?? initialParameter('atlasNode'));
      if (initialNode) setView({ zoom: 3.5, panX: -(initialNode.x - bounds.cx) * baseScale * 3.5,
        panY: (initialNode.y - bounds.cy) * baseScale * 3.5 });
    }
  }, [index, measured, bounds, baseScale, byId, selectedId]);

  useEffect(() => {
    if (index && domainId && !index.domains.some(domain => domain.id === domainId)) setDomainId('');
  }, [index, domainId]);

  const focusNode = useCallback((node: AtlasNode) => {
    const zoom = Math.max(3.5, viewRef.current.zoom);
    setView({ zoom, panX: -(node.x - bounds.cx) * baseScale * zoom, panY: (node.y - bounds.cy) * baseScale * zoom });
  }, [baseScale, bounds]);
  const frameRoute = useCallback((bridge: AtlasBridge) => {
    const source = byId.get(bridge.sourceId), target = byId.get(bridge.targetId);
    if (!source || !target) return;
    const cx = (source.x + target.x) / 2, cy = (source.y + target.y) / 2;
    const spanX = Math.max(1.25, Math.abs(source.x - target.x)), spanY = Math.max(1, Math.abs(source.y - target.y));
    const zoom = clamp(Math.min((size.width - 130) / (spanX * baseScale), (size.height - 160) / (spanY * baseScale)), .7, 14);
    setView({ zoom, panX: -(cx - bounds.cx) * baseScale * zoom, panY: (cy - bounds.cy) * baseScale * zoom });
  }, [byId, size, baseScale, bounds]);
  const chooseRoute = useCallback((id: string) => {
    setBridgeId(id); setHoveredId(null);
    const bridge = bridges?.records.find(record => record.id === id);
    if (bridge) { setQuery(''); setDomainId(''); setActiveId(''); frameRoute(bridge); }
  }, [bridges, frameRoute]);
  useEffect(() => {
    if (!bridges || !measured || !restoreBridge.current) return;
    restoreBridge.current = false;
    if (!bridgeId) return;
    if (!selectedBridge) { setBridgeId(''); return; }
    if (activeId && activeId !== selectedBridge.sourceId && activeId !== selectedBridge.targetId) setActiveId('');
    const savedZoom = Number(initialParameter('atlasZoom'));
    if (!(savedZoom >= .7 && savedZoom <= 24)) frameRoute(selectedBridge);
  }, [bridges, measured, selectedBridge, bridgeId, activeId, frameRoute]);
  const choose = useCallback((node: AtlasNode, focus = false) => {
    setActiveId(node.id); setHoveredId(null); setNeighborLimit(16); onSelect(node.id);
    if (selectedBridge && node.id !== selectedBridge.sourceId && node.id !== selectedBridge.targetId) setBridgeId('');
    if (focus) focusNode(node);
  }, [focusNode, onSelect, selectedBridge]);
  useEffect(() => {
    if (!bridgeId && measured && selectedId && selectedId !== activeId && byId.has(selectedId)) {
      setActiveId(selectedId); setNeighborLimit(16); focusNode(byId.get(selectedId)!);
    }
    // Incoming selection changes are independent of local pointer selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, byId, measured]);

  const matching = useMemo(() => nodes.filter(node => (!domainId || node.domain.id === domainId)
    && (!deferredQuery || node.searchText.includes(deferredQuery)
      || educationAliases.get(node.id)?.includes(deferredQuery) || bridgeAliases.get(node.id)?.includes(deferredQuery))).sort((a, b) => {
    if (deferredQuery) {
      const exactA = a.id.toLocaleLowerCase() === deferredQuery || a.label.toLocaleLowerCase() === deferredQuery;
      const exactB = b.id.toLocaleLowerCase() === deferredQuery || b.label.toLocaleLowerCase() === deferredQuery;
      if (exactA !== exactB) return Number(exactB) - Number(exactA);
    }
    return Number(curated.has(b.id)) - Number(curated.has(a.id)) || b.degree - a.degree || a.id.localeCompare(b.id);
  }), [nodes, domainId, deferredQuery, curated, educationAliases, bridgeAliases]);
  const matchingSet = useMemo(() => new Set(matching.map(n => n.index)), [matching]);
  const filterActive = Boolean(domainId || deferredQuery);
  const pages = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages - 1);
  const results = matching.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
  useEffect(() => { setPage(0); }, [domainId, deferredQuery]);
  const adjacency = useMemo(() => {
    const map = new Map<number, number[]>();
    graph?.edges.forEach((edge, i) => {
      for (const n of [edge[1], edge[2]]) { const list = map.get(n) ?? []; list.push(i); map.set(n, list); }
    });
    return map;
  }, [graph]);
  const selectedEdges = useMemo(() => active ? adjacency.get(active.index) ?? [] : [], [active, adjacency]);
  const literatureEdges = useMemo(() => graph?.edges.flatMap((edge, i) =>
    graph.relations[edge[3]] === 'literature_bridge' ? [i] : []) ?? [], [graph]);
  const selectedBridgeEdge = useMemo(() => selectedBridge && graph
    ? graph.edges.findIndex(edge => edge[0] === selectedBridge.edgeId) : -1, [selectedBridge, graph]);
  const neighborNodes = useMemo(() => {
    const ids = new Set<number>();
    if (active && graph) for (const i of selectedEdges) {
      const edge = graph.edges[i]; ids.add(edge[1] === active.index ? edge[2] : edge[1]);
    }
    return ids;
  }, [active, graph, selectedEdges]);
  const grid = useMemo(() => {
    const map = new Map<string, AtlasNode[]>();
    for (const node of nodes) {
      const key = `${Math.floor(node.x / .2)},${Math.floor(node.y / .2)}`;
      const items = map.get(key) ?? []; items.push(node); map.set(key, items);
    }
    return map;
  }, [nodes]);
  const pickNode = useCallback((p: Point) => {
    const world = unproject(p.x, p.y), radius = 13 / scale;
    let found: AtlasNode | null = null, best = radius * radius;
    for (let x = Math.floor((world.x - radius) / .2); x <= Math.floor((world.x + radius) / .2); x++) {
      for (let y = Math.floor((world.y - radius) / .2); y <= Math.floor((world.y + radius) / .2); y++) {
        for (const node of grid.get(`${x},${y}`) ?? []) {
          if (filterActive && !matchingSet.has(node.index)) continue;
          const distance = (node.x - world.x) ** 2 + (node.y - world.y) ** 2;
          if (distance < best) { best = distance; found = node; }
        }
      }
    }
    return found;
  }, [unproject, scale, grid, matchingSet, filterActive]);

  const pointMarks = useMemo(() => {
    const batches = new Map<string, { color: string; opacity: number; path: Path2D;
      minX: number; maxX: number; minY: number; maxY: number }>();
    const outlines: { node: AtlasNode; radius: number; matches: boolean; adjacent: boolean }[] = [];
    for (const node of nodes) {
      const matches = !filterActive || matchingSet.has(node.index);
      const adjacent = neighborNodes.has(node.index);
      const opacity = !matches ? .1 : active && !adjacent && node.id !== active.id ? .28
        : selectedBridge && !bridgeEndpointIndices.has(node.index) ? .24 : .78;
      const radius = Math.round(clamp((.65 + Math.log2(node.degree + 1) * .12) * Math.sqrt(view.zoom), .7, 5.6) * 2) / 2;
      const key = `${node.domain.id}:${opacity}:${radius}`;
      const batch = batches.get(key) ?? { color: node.domain.color, opacity, path: new Path2D(),
        minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
      const worldRadius = radius / scale;
      batch.path.moveTo(node.x + worldRadius, node.y);
      batch.path.arc(node.x, node.y, worldRadius, 0, Math.PI * 2);
      batch.minX = Math.min(batch.minX, node.x - worldRadius); batch.maxX = Math.max(batch.maxX, node.x + worldRadius);
      batch.minY = Math.min(batch.minY, node.y - worldRadius); batch.maxY = Math.max(batch.maxY, node.y + worldRadius);
      batches.set(key, batch);
      if (curated.has(node.id) || node.quality.length) outlines.push({ node, radius, matches, adjacent });
    }
    return { batches: [...batches.values()], outlines };
  }, [nodes, filterActive, matchingSet, neighborNodes, active, view.zoom, scale, curated, selectedBridge, bridgeEndpointIndices]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !index) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.round(size.width * dpr), height = Math.round(size.height * dpr);
    // Resizing discards the backing store. Preserve it while panning or hovering.
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, size.width, size.height);
    ctx.fillStyle = '#eef3ef'; ctx.fillRect(0, 0, size.width, size.height);
    // The grid is a layout reference, not a geographic or mathematical metric.
    ctx.strokeStyle = '#dbe5df'; ctx.lineWidth = .5;
    for (let x = bounds.minX; x < bounds.maxX + 1; x += 1) {
      const p = project(x, 0); if (p.x < 0 || p.x > size.width) continue;
      ctx.beginPath(); ctx.moveTo(p.x, 0); ctx.lineTo(p.x, size.height); ctx.stroke();
    }
    for (let y = bounds.minY; y < bounds.maxY + 1; y += 1) {
      const p = project(0, y); if (p.y < 0 || p.y > size.height) continue;
      ctx.beginPath(); ctx.moveTo(0, p.y); ctx.lineTo(size.width, p.y); ctx.stroke();
    }
    for (const domain of index.domains) {
      const center = project(...domain.center), r = domain.radius * scale;
      if (center.x + r < -50 || center.x - r > size.width + 50 || center.y + r < -50 || center.y - r > size.height + 50) continue;
      const opacity = domainId && domainId !== domain.id ? .025 : .065;
      ctx.globalAlpha = opacity; ctx.fillStyle = domain.color; ctx.beginPath(); ctx.arc(center.x, center.y, r + 7, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = domainId && domainId !== domain.id ? .15 : .35;
      ctx.strokeStyle = domain.color; ctx.lineWidth = .8;
      ctx.beginPath(); ctx.arc(center.x, center.y, r + 7, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = .12; ctx.beginPath(); ctx.arc(center.x, center.y, r + 12, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    const drawEdge = (edgeIndex: number, selected = false, route = false) => {
      if (!graph) return;
      const edge = graph.edges[edgeIndex], a = nodes[edge[1]], b = nodes[edge[2]], relation = graph.relations[edge[3]];
      if (filterActive && !selected && (!matchingSet.has(a.index) || !matchingSet.has(b.index))) return;
      const p = project(a.x, a.y), q = project(b.x, b.y);
      if ((p.x < -10 && q.x < -10) || (p.x > size.width + 10 && q.x > size.width + 10)
          || (p.y < -10 && q.y < -10) || (p.y > size.height + 10 && q.y > size.height + 10)) return;
      ctx.strokeStyle = EDGE_COLORS[relation] ?? '#6e8a82';
      ctx.globalAlpha = route ? .92 : selected ? .56 : relation === 'literature_bridge' ? .38 : .055;
      ctx.lineWidth = route ? 2.5 : selected ? 1.2 : relation === 'literature_bridge' ? 1.1 : .55;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
    };
    if (graph) {
      if (references) {
        const stride = Math.max(1, Math.ceil(graph.edges.length / MAX_BACKGROUND_EDGES));
        for (let i = 0; i < graph.edges.length; i += stride) drawEdge(i);
      }
      literatureEdges.forEach(i => drawEdge(i));
      selectedEdges.forEach(i => drawEdge(i, true));
      if (selectedBridgeEdge >= 0) drawEdge(selectedBridgeEdge, true, true);
    }
    const origin = project(0, 0);
    const margin = Math.ceil(Math.min(size.width, size.height) * .3);
    let layer = pointLayerRef.current;
    // A bounded transparent point layer includes a small pan buffer. Panning
    // within that buffer only moves an image; zoom/filter changes rebuild it.
    if (!layer || layer.marks !== pointMarks || layer.width !== size.width || layer.height !== size.height
        || layer.dpr !== dpr || Math.abs(origin.x - layer.origin.x) > margin || Math.abs(origin.y - layer.origin.y) > margin) {
      const surface = layer?.canvas ?? document.createElement('canvas');
      const layerWidth = Math.ceil((size.width + margin * 2) * dpr), layerHeight = Math.ceil((size.height + margin * 2) * dpr);
      if (surface.width !== layerWidth) surface.width = layerWidth;
      if (surface.height !== layerHeight) surface.height = layerHeight;
      const layerContext = surface.getContext('2d');
      if (layerContext) {
        layerContext.setTransform(1, 0, 0, 1, 0, 0); layerContext.clearRect(0, 0, surface.width, surface.height);
        layerContext.setTransform(dpr, 0, 0, dpr, 0, 0);
        layerContext.translate(origin.x + margin, origin.y + margin); layerContext.scale(scale, -scale);
        for (const batch of pointMarks.batches) {
          const upperLeft = project(batch.minX, batch.maxY), lowerRight = project(batch.maxX, batch.minY);
          if (lowerRight.x < -margin || upperLeft.x > size.width + margin
              || lowerRight.y < -margin || upperLeft.y > size.height + margin) continue;
          layerContext.fillStyle = batch.color; layerContext.globalAlpha = batch.opacity; layerContext.fill(batch.path);
        }
      }
      layer = { canvas: surface, marks: pointMarks, origin, width: size.width, height: size.height, dpr, margin };
      pointLayerRef.current = layer;
    }
    ctx.globalAlpha = 1;
    ctx.drawImage(layer.canvas, origin.x - layer.origin.x - layer.margin, origin.y - layer.origin.y - layer.margin,
      layer.canvas.width / dpr, layer.canvas.height / dpr);
    for (const { node, radius, matches, adjacent } of pointMarks.outlines) {
      const p = project(node.x, node.y);
      if (p.x < -8 || p.x > size.width + 8 || p.y < -8 || p.y > size.height + 8) continue;
      if (curated.has(node.id) && matches) {
        ctx.globalAlpha = .8; ctx.strokeStyle = '#af8244'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(p.x, p.y, radius + 3, 0, Math.PI * 2); ctx.stroke();
      }
      if (node.quality.length && matches && (!active || adjacent || node.id === active.id)) {
        ctx.globalAlpha = .9; ctx.strokeStyle = '#b75f47'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(p.x, p.y, radius + 2, 0, Math.PI * 2); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    // Region labels remain actual source domain names; no invented islands are added.
    for (const domain of index.domains) {
      const p = project(...domain.center), r = domain.radius * scale;
      const y = p.y - r - 18;
      if (p.x < 22 || p.x > size.width - 22 || y < 22 || y > size.height - 18) continue;
      if (domainId && domainId !== domain.id) continue;
      if (size.width < 600 && r < (language === 'en' ? 30 : 20) && domainId !== domain.id) continue;
      ctx.font = `600 ${size.width < 600 ? 10 : 12}px system-ui, sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#eef3ef';
      const label = language === 'zh' ? domain.zh : domain.en;
      const maxLength = size.width < 600 ? 23 : 31;
      const words = label.split(' '), lines: string[] = []; let line = '';
      for (const word of words) { if ((line + ' ' + word).trim().length > maxLength && line) { lines.push(line); line = word; } else line = (line + ' ' + word).trim(); }
      if (line) lines.push(line);
      lines.forEach((text, i) => {
        const width = ctx.measureText(text).width;
        ctx.fillStyle = '#eef3ef'; ctx.fillRect(p.x - width / 2 - 4, y + i * 14 - 8, width + 8, 16);
        ctx.fillStyle = '#416359'; ctx.fillText(text, p.x, y + i * 14);
      });
    }
    const labelNodes = [...new Map(([...bridgeEndpoints, hovered, active].filter(Boolean) as AtlasNode[]).map(node => [node.id, node])).values()];
    for (const node of labelNodes) {
      const p = project(node.x, node.y);
      if (p.x < 0 || p.x > size.width || p.y < 0 || p.y > size.height) continue;
      ctx.fillStyle = '#fbfaf4'; ctx.strokeStyle = bridgeEndpointIndices.has(node.index) ? '#c9774c' : node.domain.color; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(p.x, p.y, node.id === activeId ? 6.5 : 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      let label = node.label.length > 44 ? node.label.slice(0, 41) + '…' : node.label;
      ctx.font = '600 12px system-ui, sans-serif';
      while (label.length > 6 && ctx.measureText(label).width > size.width - 30) label = label.slice(0, -2) + '…';
      const w = ctx.measureText(label).width;
      const labelY = selectedBridge?.targetId === node.id ? p.y + 18 : p.y - 22;
      const x = clamp(p.x + 12, 10, size.width - w - 12), y = clamp(labelY, 12, size.height - 26);
      ctx.fillStyle = '#fbfaf4'; ctx.fillRect(x - 5, y - 3, w + 10, 24); ctx.textAlign = 'left';
      ctx.fillStyle = '#193a39'; ctx.fillText(label, x, y + 9);
    }
  }, [index, graph, nodes, size, bounds, project, scale, view.zoom, domainId, filterActive, matchingSet,
    references, selectedEdges, literatureEdges, active, activeId, hovered, curated, neighborNodes, pointMarks, language,
    selectedBridge, selectedBridgeEdge, bridgeEndpoints, bridgeEndpointIndices]);

  const zoomAt = useCallback((factor: number, point?: Point) => {
    const p = point ?? { x: size.width / 2, y: size.height / 2 };
    setView(previous => {
      const zoom = clamp(previous.zoom * factor, .7, 24), ratio = zoom / previous.zoom;
      return { zoom, panX: p.x - size.width / 2 - (p.x - size.width / 2 - previous.panX) * ratio,
        panY: p.y - size.height / 2 - (p.y - size.height / 2 - previous.panY) * ratio };
    });
  }, [size]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      const box = canvas.getBoundingClientRect();
      zoomAt(Math.exp(-clamp(event.deltaY, -140, 140) * .004), { x: event.clientX - box.left, y: event.clientY - box.top });
    };
    canvas.addEventListener('wheel', wheel, { passive: false });
    return () => canvas.removeEventListener('wheel', wheel);
  }, [zoomAt, index]);
  const pointFromEvent = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const box = event.currentTarget.getBoundingClientRect(); return { x: event.clientX - box.left, y: event.clientY - box.top };
  };
  const beginPointer = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const point = pointFromEvent(event); pointers.current.set(event.pointerId, point);
    event.currentTarget.setPointerCapture(event.pointerId);
    if (pointers.current.size === 1) gesture.current = { start: point, view, moved: false };
    else {
      const [a, b] = [...pointers.current.values()];
      gesture.current = { start: point, view, moved: true, distance: Math.hypot(a.x - b.x, a.y - b.y),
        center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } };
    }
  };
  const movePointer = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const point = pointFromEvent(event);
    if (!pointers.current.has(event.pointerId) || !gesture.current) {
      const node = pickNode(point); setHoveredId(node?.id ?? null); return;
    }
    pointers.current.set(event.pointerId, point); const g = gesture.current;
    if (pointers.current.size >= 2 && g.distance && g.center) {
      const [a, b] = [...pointers.current.values()], center = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const zoom = clamp(g.view.zoom * Math.hypot(a.x - b.x, a.y - b.y) / Math.max(1, g.distance), .7, 24);
      const ratio = zoom / g.view.zoom;
      setView({ zoom, panX: center.x - size.width / 2 - (g.center.x - size.width / 2 - g.view.panX) * ratio,
        panY: center.y - size.height / 2 - (g.center.y - size.height / 2 - g.view.panY) * ratio });
    } else {
      const dx = point.x - g.start.x, dy = point.y - g.start.y;
      if (Math.hypot(dx, dy) > 4) g.moved = true;
      if (g.moved) { setHoveredId(null); setView({ ...g.view, panX: g.view.panX + dx, panY: g.view.panY + dy }); }
    }
  };
  const endPointer = (event: ReactPointerEvent<HTMLCanvasElement>, cancelled = false) => {
    if (!cancelled && gesture.current && !gesture.current.moved) {
      const node = pickNode(pointFromEvent(event)); if (node) choose(node);
    }
    pointers.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    const remaining = [...pointers.current.values()][0];
    gesture.current = remaining ? { start: remaining, view: viewRef.current, moved: true } : null;
  };
  const reset = () => { setView({ zoom: 1, panX: 0, panY: 0 }); setDomainId(''); setQuery(''); setActiveId(''); setHoveredId(null); setBridgeId(''); };
  const changeDomain = (id: string) => {
    setDomainId(id); setBridgeId('');
    const domain = index?.domains.find(d => d.id === id);
    if (domain) {
      const zoom = clamp(Math.min(size.width, size.height) * .35 / (domain.radius * baseScale), 1, 12);
      setView({ zoom, panX: -(domain.center[0] - bounds.cx) * baseScale * zoom, panY: (domain.center[1] - bounds.cy) * baseScale * zoom });
    } else setView({ zoom: 1, panX: 0, panY: 0 });
  };
  const mapKey = (event: KeyboardEvent<HTMLCanvasElement>) => {
    const deltas: Record<string, Point> = { ArrowLeft: { x: 50, y: 0 }, ArrowRight: { x: -50, y: 0 }, ArrowUp: { x: 0, y: 50 }, ArrowDown: { x: 0, y: -50 } };
    if (deltas[event.key]) { event.preventDefault(); const delta = deltas[event.key]; setView(v => ({ ...v, panX: v.panX + delta.x, panY: v.panY + delta.y })); }
    else if (event.key === '+' || event.key === '=') { event.preventDefault(); zoomAt(1.4); }
    else if (event.key === '-') { event.preventDefault(); zoomAt(1 / 1.4); }
    else if (event.key === 'Home') { event.preventDefault(); reset(); }
  };
  const shareLocation = async () => {
    const url = new URL(window.location.href), center = unproject(size.width / 2, size.height / 2);
    const values: Record<string, string> = { atlasSearch: query, atlasDomain: domainId, atlasNode: activeId ?? '', atlasBridge: bridgeId,
      atlasZoom: view.zoom.toFixed(4), atlasX: center.x.toFixed(6), atlasY: center.y.toFixed(6) };
    for (const [key, value] of Object.entries(values)) value ? url.searchParams.set(key, value) : url.searchParams.delete(key);
    window.history.replaceState(window.history.state, '', url);
    try { await navigator.clipboard.writeText(url.href); setCopyMessage(t.copied); }
    catch { setCopyMessage(t.copyUnavailable); }
  };
  const saveView = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const output = document.createElement('canvas'); output.width = canvas.width;
    const ctx = output.getContext('2d'); if (!ctx) return;
    const exportScale = canvas.width / size.width, padding = 16 * exportScale, lineHeight = 19 * exportScale;
    ctx.font = `${12 * exportScale}px system-ui`;
    const captions = [language === 'zh'
      ? `MathCups · ${nodes.length.toLocaleString()} 个来源条目 · ${graph?.edges.length.toLocaleString() ?? '—'} 条记录关系`
      : `MathCups · ${nodes.length.toLocaleString()} sourced entries · ${graph?.edges.length.toLocaleString() ?? '—'} recorded relations`];
    if (selectedBridge && bridgeText) captions.push(`${selectedBridge.id} · ${bridgeText.title}`, bridgeText.sourceUrl);
    else if (active) captions.push(`${active.id} · ${active.label}`);
    captions.push(language === 'zh'
      ? `二维距离不表示数学距离。来源快照：${index?.provenance['data/nodes.jsonl'].slice(0, 16)}`
      : `Layout is not mathematical distance. Source snapshot: ${index?.provenance['data/nodes.jsonl'].slice(0, 16)}`);
    const lines: string[] = [];
    for (const caption of captions) {
      let line = '';
      const tokens = caption.match(/[\u3400-\u9fff]|[^\s\u3400-\u9fff]+|\s+/gu) ?? [];
      for (let token of tokens) {
        if (ctx.measureText(line + token).width <= output.width - padding * 2) { line += token; continue; }
        if (line.trim()) { lines.push(line.trimEnd()); line = ''; }
        token = token.trimStart();
        // Break only tokens longer than the full line, such as a citation URL.
        for (const character of token) {
          if (line && ctx.measureText(line + character).width > output.width - padding * 2) { lines.push(line); line = character; }
          else line += character;
        }
      }
      if (line.trim()) lines.push(line.trimEnd());
    }
    output.height = canvas.height + padding * 2 + lines.length * lineHeight;
    ctx.fillStyle = '#fbfaf4'; ctx.fillRect(0, 0, output.width, output.height); ctx.drawImage(canvas, 0, 0);
    ctx.fillStyle = '#193a39'; ctx.font = `${12 * exportScale}px system-ui`; ctx.textBaseline = 'top';
    lines.forEach((line, i) => ctx.fillText(line, padding, canvas.height + padding + i * lineHeight));
    output.toBlob(blob => { if (!blob) return; const url = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = url; a.download = 'mathcups-atlas-view.png'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); });
  };

  if (!index) return <section className="core-atlas core-atlas--loading" aria-busy={!loadError}>
    <h2>{t.title}</h2><p role="status">{loadError ? t.error : t.loading}</p>
    {loadError && <button onClick={() => setAttempt(n => n + 1)}>{t.retry}</button>}
  </section>;

  return <section className="core-atlas" aria-labelledby={`${uniqueId}-title`}>
    <div className="core-atlas__heading"><div><h2 id={`${uniqueId}-title`}>{t.title}</h2><p>{t.subtitle}</p></div>
      <div className="core-atlas__counts"><strong>{nodes.length.toLocaleString()}</strong><span>{t.total}</span><small>{graph ? `${graph.edges.length.toLocaleString()} ${t.edges}` : edgeError ? t.edgeError : t.edgeLoading}</small></div>
    </div>
    <div className="core-atlas__toolbar">
      <label className="core-atlas__search" htmlFor={`${uniqueId}-search`}><span>{t.search}</span>
        <input id={`${uniqueId}-search`} type="search" value={query} placeholder={t.placeholder} onChange={e => { setQuery(e.target.value); setBridgeId(''); }}
          aria-describedby={`${uniqueId}-search-help`} onKeyDown={e => { if (e.key === 'Enter' && matching[0]) choose(matching[0], true); }} />
      </label>
      <label className="core-atlas__domain-select"><span>{t.domain}</span><select value={domainId} onChange={e => changeDomain(e.target.value)}>
        <option value="">{t.allDomains}</option>{index.domains.map(d => <option key={d.id} value={d.id}>{language === 'zh' ? d.zh : d.en} · {d.count.toLocaleString()}</option>)}
      </select></label>
      <label className="core-atlas__toggle"><input type="checkbox" checked={references} onChange={e => setReferences(e.target.checked)} />{t.references}</label>
    </div>
    <p id={`${uniqueId}-search-help`} className="core-atlas__search-help">{t.searchHelp}
      {educationAliases.size > 0 && <span> {language === 'zh'
        ? `另含 ${educationalSearch!.islandCount} 座生态课堂的双语解释，关联 ${educationAliases.size} 个来源条目。`
        : ` Bilingual text from ${educationalSearch!.islandCount} ecology lessons also searches ${educationAliases.size} associated source entries.`}</span>}
      {bridgeAliases.size > 0 && <span> {language === 'zh'
        ? `文献航线标题另关联 ${bridgeAliases.size} 个条目。`
        : ` Literature-route titles also index ${bridgeAliases.size} entries.`}</span>}
    </p>
    <div className="core-atlas__route-toolbar">
      <div><strong>{bridges ? `${bridges.records.length} ${t.routes}` : bridgeError ? t.routeError : t.routeLoading}</strong><span>{t.routeSubtitle}</span></div>
      <label><span className="core-atlas__sr-only">{t.routePrompt}</span>
        <select value={bridgeId} onChange={e => chooseRoute(e.target.value)} disabled={!bridges}>
          <option value="">{bridgeError ? t.routeError : t.routePrompt}</option>
          {bridges?.records.map(bridge => <option value={bridge.id} key={bridge.id}>{bridge.id.slice(-3)} · {bridge.text[language].title}</option>)}
        </select></label>
      {selectedBridge && <button onClick={() => frameRoute(selectedBridge)}>{t.routeFrame}</button>}
      {bridgeError && <button onClick={() => setAttempt(n => n + 1)}>{t.retry}</button>}
    </div>
    <div className="core-atlas__body">
      <div className="core-atlas__map-column">
        <div className="core-atlas__stage" ref={stageRef}>
          <canvas ref={canvasRef} style={{ width: size.width, height: size.height }} tabIndex={0} role="img"
            aria-label={`${t.title}: ${nodes.length.toLocaleString()} ${t.total}. ${t.keyboard}`} aria-describedby={`${uniqueId}-map-help`}
            onPointerDown={beginPointer} onPointerMove={movePointer} onPointerUp={e => endPointer(e)} onPointerCancel={e => endPointer(e, true)}
            onLostPointerCapture={e => { if (pointers.current.has(e.pointerId)) endPointer(e, true); }}
            onPointerLeave={() => { if (!pointers.current.size) setHoveredId(null); }} onKeyDown={mapKey} />
          <div className="core-atlas__map-controls" role="group" aria-label={language === 'zh' ? '地图控制' : 'Map controls'}>
            <button onClick={() => zoomAt(1.5)} aria-label={t.zoomIn} title={t.zoomIn}><MapIcon kind="plus" /></button>
            <button onClick={() => zoomAt(1 / 1.5)} aria-label={t.zoomOut} title={t.zoomOut}><MapIcon kind="minus" /></button>
            <button onClick={reset} aria-label={t.reset} title={t.reset}><MapIcon kind="fit" /></button>
          </div>
          <div className="core-atlas__map-actions"><button onClick={saveView}><MapIcon kind="download" /><span>{t.download}</span></button>
            <button onClick={() => void shareLocation()}><MapIcon kind="link" /><span>{t.share}</span></button></div>
          <div className="core-atlas__map-scale" aria-hidden="true">{Math.round(view.zoom * 100)}%</div>
          {edgeError && <button className="core-atlas__edge-retry" onClick={() => setAttempt(n => n + 1)}>{t.edgeError} {t.retry}</button>}
        </div>
        <p className="core-atlas__copy-status" role="status">{copyMessage}</p>
        <details className="core-atlas__guide"><summary>{t.guideTitle}</summary><p>{t.guide}</p><p>{t.selectedGuide}</p><p>{t.motif}</p><p id={`${uniqueId}-map-help`}>{t.keyboard}</p>
          <p><a href={`${import.meta.env.BASE_URL}attribution.html${language === 'en' ? '#english' : ''}`}>{t.attribution}</a></p></details>
        <div className="core-atlas__domains" role="group" aria-label={t.domain}>{index.domains.map(d => <button key={d.id} onClick={() => changeDomain(domainId === d.id ? '' : d.id)}
          className={domainId === d.id ? 'is-active' : ''} aria-pressed={domainId === d.id}
          title={MOTIFS[d.motif]?.[language === 'zh' ? 0 : 1]} style={{ '--region-color': d.color } as CSSProperties}>
          <Glyph type={d.motif} /><span>{language === 'zh' ? d.zh : d.en}</span><small>{d.count.toLocaleString()}</small></button>)}</div>
      </div>
      <aside ref={railRef} className="core-atlas__rail" aria-label={language === 'zh' ? '检索与节点详情' : 'Search and node details'}>
        {selectedBridge && bridgeText && <article className="core-atlas__bridge" aria-labelledby={`${uniqueId}-bridge-title`}>
          <div className="core-atlas__bridge-kicker"><span>{selectedBridge.id}</span><button onClick={() => setBridgeId('')}>{t.routeClose} <span aria-hidden="true">×</span></button></div>
          <h3 id={`${uniqueId}-bridge-title`}>{bridgeText.title}</h3>
          <div className="core-atlas__bridge-endpoints">{bridgeEndpoints.map((node, i) => <div key={node.id}>
            <button onClick={() => choose(node, true)} style={{ '--region-color': node.domain.color } as CSSProperties}>
              <span>{language === 'zh' ? node.domain.zh : node.domain.en}</span><strong>{node.label}</strong><small>{node.id}</small>
            </button>{curated.has(node.id) && onOpenLesson && <button className="core-atlas__bridge-lesson" onClick={() => onOpenLesson(node.id)}>{t.lesson} ↗</button>}
            {i === 0 && <span className="core-atlas__bridge-endpoint-divider" aria-hidden="true">{bridgeText.title.includes('↔') ? '↕' : '↓'}</span>}
          </div>)}</div>
          <dl className="core-atlas__bridge-reading">
            <div><dt>{t.routeMechanism}</dt><dd>{bridgeText.mechanism}</dd></div>
            <div><dt>{t.routeConditions}</dt><dd>{bridgeText.conditions}</dd></div>
            <div><dt>{t.routeConclusion}</dt><dd>{bridgeText.conclusion}</dd></div>
            <div><dt>{t.routeLimitations}</dt><dd>{bridgeText.limitations}</dd></div>
          </dl>
          <a className="core-atlas__bridge-source" href={safeUrl(bridgeText.sourceUrl)} target="_blank" rel="noreferrer">{bridgeText.sourceTitle}<span aria-hidden="true"> ↗</span></a>
          <p className="core-atlas__bridge-locator">{t.locator}: {bridgeText.locator}</p>
          <details className="core-atlas__bridge-audit"><summary>{t.routeAudit}</summary>
            <p><strong>{t.routePassage}</strong><br />{selectedBridge.sourceAudit.passage_read_scope}</p>
            <p><strong>{t.routeReview}</strong><br />{selectedBridge.sourceAudit.mathematical_review}</p>
            {!selectedBridge.sourceAudit.formal_verification && <p>{t.routeNotFormal}</p>}
            <p>{selectedBridge.sourceAudit.source_type} · SHA-256 <code>{selectedBridge.sourceAudit.sha256}</code></p>
            {bridgeText.reportCommit ? <a href={`https://github.com/Lightmaze/Math-Island/blob/${bridgeText.reportCommit}/${bridgeText.reportPath}#L${bridgeText.reportLine}`} target="_blank" rel="noreferrer">{t.routeReport} ↗</a>
              : <p>{bridgeText.reportPath}:{bridgeText.reportLine}</p>}
          </details>
        </article>}
        {active && <div className="core-atlas__selection" style={{ '--region-color': active.domain.color } as CSSProperties}>
          <div className="core-atlas__selection-domain"><Glyph type={active.domain.motif} /><span>{language === 'zh' ? active.domain.zh : active.domain.en}</span></div>
          <h3>{active.label}</h3><code>{active.id}</code>
          <dl><div><dt>{t.kind}</dt><dd>{active.kind}</dd></div><div><dt>{t.degree}</dt><dd>{active.degree.toLocaleString()}</dd></div></dl>
          <a className="core-atlas__source" href={safeUrl(active.sourceUrl)} target="_blank" rel="noreferrer">{t.source}<span aria-hidden="true">↗</span></a>
          {curated.has(active.id) && onOpenLesson && <button className="core-atlas__lesson" onClick={() => onOpenLesson(active.id)}>{t.lesson}</button>}
          {active.quality.length > 0 && <details className="core-atlas__quality"><summary>{t.quality} · {active.quality.length}</summary><p>{t.originalNotes}</p>
            {active.quality.map((finding, i) => <div key={finding.finding_id ?? i}><p>{finding.finding}</p><p>{finding.correction_or_requirement}</p></div>)}</details>}
          <details className="core-atlas__provenance"><summary>{t.provenance}</summary><p>{t.sourceType}</p><p>{t.snapshot}: <code>{index.provenance['data/nodes.jsonl'].slice(0, 16)}</code></p></details>
          <div className="core-atlas__neighbors"><h4>{t.neighbors} <span>{selectedEdges.length}</span></h4>
            {!graph ? <p>{edgeError ? t.edgeError : t.edgeLoading}</p> : selectedEdges.length === 0 ? <p>{t.noNeighbors} {t.notIsolation}</p> : <ul>
              {selectedEdges.slice(0, neighborLimit).map(edgeIndex => { const edge = graph.edges[edgeIndex], outgoing = edge[1] === active.index;
                const other = nodes[outgoing ? edge[2] : edge[1]], relation = graph.relations[edge[3]];
                return <li key={edge[0]}><button onClick={() => choose(other, true)}>{other.label}</button>
                  <span>{RELATIONS[relation]?.[language === 'zh' ? 0 : 1] ?? relation} · {outgoing ? t.outward : t.inward}</span>
                  <a href={safeUrl(graph.evidenceUrls[edge[4]])} target="_blank" rel="noreferrer" title={graph.locators[edge[5]]}>{t.evidence}</a>
                  <details className="core-atlas__edge-details"><summary>{t.edgeDetails}</summary><code>{edge[0]}</code>
                    <p>{t.locator}: {graph.locators[edge[5]] || '—'}</p><p>{t.status}: {graph.statuses[edge[6]] || '—'}</p>
                    <p>{t.validity}: {graph.validities[edge[7]] || '—'}</p></details></li>; })}
            </ul>}
            {selectedEdges.length > neighborLimit && <button className="core-atlas__more" onClick={() => setNeighborLimit(n => n + 24)}>{t.more}</button>}
          </div>
        </div>}
        <div className="core-atlas__results"><div className="core-atlas__result-heading"><h3>{matching.length.toLocaleString()} <span>{t.found}</span></h3>
          {query && <button onClick={() => setQuery('')}>{t.clear}</button>}</div>
          {!active && <p className="core-atlas__select-help">{t.selectHelp}</p>}
          {results.length ? <ul>{results.map(node => <li key={node.id}><button onClick={() => choose(node, true)} aria-current={node.id === activeId ? 'true' : undefined}
            style={{ '--region-color': node.domain.color } as CSSProperties}><span className="core-atlas__result-dot" /><span><strong>{node.label}</strong>
              <small>{node.id}{node.quality.length ? ' · !' : ''}</small>
              {deferredQuery && !node.searchText.includes(deferredQuery) && <small className="core-atlas__match-note">{educationAliases.get(node.id)?.includes(deferredQuery) ? t.educationalMatch : t.bridgeMatch}</small>}
            </span>{curated.has(node.id) && <span className="core-atlas__lesson-dot" title={t.lesson} aria-label={t.lesson}>◌</span>}</button></li>)}</ul>
            : <p>{t.noResults}</p>}
          {pages > 1 && <nav className="core-atlas__pagination" aria-label={language === 'zh' ? '检索结果分页' : 'Search result pages'}>
            <button disabled={currentPage === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>{t.previous}</button><span>{currentPage + 1} / {pages}</span>
            <button disabled={currentPage + 1 >= pages} onClick={() => setPage(p => Math.min(pages - 1, p + 1))}>{t.next}</button></nav>}
        </div>
      </aside>
    </div>
  </section>;
}
