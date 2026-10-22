import { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, ChevronDown, List, Search, X } from 'lucide-react';
import EducationMap from './EducationMap';
import IslandGlyph from './IslandGlyph';
import { islands } from '../data/islands';
import { journeys } from '../data/journeys';
import type { Island } from '../data/islands';
import type { Language } from '../lib/state';

const regionNames: Record<string, string> = {
  '数论与算术':'Number theory','代数与结构':'Algebra','交换代数':'Commutative algebra','代数几何':'Algebraic geometry','范畴与同调':'Categories & homology','几何与拓扑':'Geometry & topology','分析与微分方程':'Analysis','概率与统计':'Probability','离散与计算':'Discrete mathematics','逻辑与基础':'Logic & foundations','数值与优化':'Numerics & optimization','数学物理与应用':'Mathematical physics',
};
export default function Explorer({ language, selectedId, onSelect, onEnter, onCore }: { language: Language; selectedId: string; onSelect: (id: string) => void; onEnter: (id: string) => void; onCore: (id: string) => void }) {
  const selected = islands.find(i => i.id === selectedId) || islands[0];
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState('all');
  const [journeyId, setJourneyId] = useState('');
  const [showList, setShowList] = useState(false);
  const [focusToken, setFocusToken] = useState(0);
  const domains = useMemo(() => [...new Set(islands.map(i => i.domain))], []);
  const filtered = useMemo(() => islands.filter(island => {
    const q = query.trim().toLocaleLowerCase();
    const text = [island.title.zh, island.title.en, island.subtitle.zh, island.subtitle.en, island.object.zh, island.object.en, island.coreId, island.domain].join(' ').toLocaleLowerCase();
    return (domain === 'all' || island.domain === domain) && (!q || text.includes(q));
  }), [query, domain]);
  const visibleIds = useMemo(() => new Set(filtered.map(i => i.id)), [filtered]);
  const journey = journeys.find(j => j.id === journeyId);
  const continueIslands: Island[] = journey ? journey.islands.map(id => islands.find(i => i.id === id)!).filter(i => i && i.id !== selected.id).slice(0, 3) : islands.filter(i => i.domain === selected.domain && i.id !== selected.id).slice(0, 2);
  const select = (id: string, focus = true) => { onSelect(id); if (focus) setFocusToken(n => n + 1); };
  const chooseDomain = (value: string) => {
    setDomain(value);
    const first = islands.find(i => value === 'all' || i.domain === value);
    if (value !== 'all' && first) select(first.id);
  };
  return <main className="explorer-layout">
    <section className="map-panel" aria-label={language === 'zh' ? '数学对象生态地图' : 'Mathematical object habitats'}>
      <EducationMap islands={islands} selected={selected.id} visibleIds={visibleIds} language={language} onSelect={id => select(id, false)} onEnter={onEnter} journey={journey} focusToken={focusToken}/>
      <div className="map-intro"><h1>{language === 'zh' ? '数学，在岛屿间生长' : <>Mathematics grows{' '}<br/>between islands.</>}</h1><p>{language === 'zh' ? '从一个对象出发，看见结构之间的联系。' : 'Begin with an object. See how structures connect.'}</p>
        <div className="island-search"><Search size={18}/><input aria-label={language === 'zh' ? '搜索教学岛屿' : 'Search educational islands'} value={query} onChange={e => setQuery(e.target.value)} placeholder={language === 'zh' ? '搜索岛屿、对象与方法' : 'Search islands, objects and methods'}/>{query && <button aria-label={language === 'zh' ? '清空搜索' : 'Clear search'} onClick={() => setQuery('')}><X size={16}/></button>}</div>
        {query.trim() && <div className="search-results" aria-live="polite">{filtered.length ? <><p>{language === 'zh' ? `${filtered.length} 座教学岛` : `${filtered.length} educational islands`}</p>{filtered.map(island => <button key={island.id} onClick={() => { select(island.id); setQuery(''); }}><span>{island.title[language]}</span><ArrowRight size={15}/></button>)}</> : <p>{language === 'zh' ? '教学岛中没有匹配项。可在“全部图谱”搜索全部来源条目。' : 'No matching lesson. Search all source entries in Full atlas.'}</p>}</div>}
      </div>
      <div className="domain-nav" role="group" aria-label={language === 'zh' ? '筛选海域' : 'Filter region'}><button className={domain === 'all' ? 'active' : ''} aria-pressed={domain === 'all'} onClick={() => chooseDomain('all')}>{language === 'zh' ? '全部海域' : 'All regions'}</button>{domains.map(d => <button key={d} className={domain === d ? 'active' : ''} aria-pressed={domain === d} onClick={() => chooseDomain(d)}>{language === 'zh' ? d : regionNames[d] || d}</button>)}</div>
      <div className="map-bottom-controls"><button className="map-list-toggle" aria-expanded={showList} onClick={() => setShowList(s => !s)}><List size={16}/>{language === 'zh' ? '岛屿目录' : 'Island index'}<span>{filtered.length}</span></button><label className="journey-select"><span className="sr-only">{language === 'zh' ? '策展学习路径' : 'Curated learning journey'}</span><select value={journeyId} onChange={e => { setJourneyId(e.target.value); const j = journeys.find(j => j.id === e.target.value); if (j) { setDomain('all'); setQuery(''); select(j.islands[0]); } }}><option value="">{language === 'zh' ? '选择一条学习路径' : 'Choose a learning journey'}</option>{journeys.map(j => <option key={j.id} value={j.id}>{j.title[language]}</option>)}</select><ChevronDown size={14}/></label></div>
      {journey && <div className="journey-caption"><strong>{journey.title[language]}</strong><p>{journey.description[language]}</p><span>{language === 'zh' ? '虚线表示策展学习顺序' : 'Dashed lines show an editorial learning sequence'}</span></div>}
      {showList && <div className="island-directory"><div><h2>{language === 'zh' ? `${islands.length} 份对象探索课程` : `${islands.length} object explorations`}</h2><button aria-label={language === 'zh' ? '关闭目录' : 'Close index'} onClick={() => setShowList(false)}><X size={18}/></button></div><ol>{filtered.map(island => <li key={island.id}><button aria-current={selected.id === island.id ? 'true' : undefined} onClick={() => { select(island.id); setShowList(false); }}><span>{island.title[language]}</span><small>{language === 'zh' ? island.domain : regionNames[island.domain]}</small><ArrowRight size={16}/></button></li>)}</ol>{filtered.length === 0 && <p>{language === 'zh' ? '当前筛选没有岛屿。' : 'No islands match this filter.'}</p>}</div>}
    </section>
    <aside className="island-dock" aria-label={language === 'zh' ? '当前岛屿' : 'Selected island'}>
      <div className="dock-heading"><span>{language === 'zh' ? '当前岛屿' : 'Selected island'}</span><h2>{selected.title[language]}</h2><p>{selected.subtitle[language]}</p></div>
      <div className="dock-illustration"><IslandGlyph kind={selected.labKey} seed={islands.indexOf(selected) + 1} size={250}/></div>
      <div className="dock-field"><h3>{language === 'zh' ? '岛上对象' : 'The objects here'}</h3><p>{selected.object[language]}</p></div>
      <div className="dock-field discover-field"><h3>{language === 'zh' ? '你将发现' : 'What to explore'}</h3><p>{selected.steps[0]?.body[language] || selected.ecology[language]}</p></div>
      <button className="primary-button enter-island" onClick={() => onEnter(selected.id)}>{language === 'zh' ? '进入岛屿' : 'Explore this island'}<ArrowRight size={18}/></button>
      {continueIslands.length > 0 && <div className="dock-continuations"><h3>{language === 'zh' ? '继续航行' : 'Continue exploring'}</h3>{continueIslands.map(island => <button key={island.id} onClick={() => select(island.id)}>{island.title[language]}<ArrowRight size={16}/></button>)}</div>}
      <button className="text-action dock-source" onClick={() => onCore(selected.coreId)}>{language === 'zh' ? '查看图谱与数学出处' : 'View atlas entry & source'}<ArrowUpRight size={16}/></button>
      <a className="source-notice" href={`${import.meta.env.BASE_URL}attribution.html${language === 'en' ? '#english' : ''}`} target="_blank" rel="noreferrer">{language === 'zh' ? '关于群岛 · 来源与许可' : 'About the islands · Sources & licenses'}</a>
    </aside>
  </main>;
}
