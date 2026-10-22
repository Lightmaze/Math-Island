import { lazy, Suspense, useEffect } from 'react';
import Header from './components/Header';
import Explorer from './components/Explorer';
import IslandDetail from './components/IslandDetail';
import Journal from './components/Journal';
import { islands } from './data/islands';
import { journeys } from './data/journeys';
import { useJournal, useRoute } from './lib/hooks';
import { useExperimentNotebook } from './connections/notebook';
import ExperimentArchive from './connections/ExperimentArchive';
const ConnectionWorkbench = lazy(() => import('./connections/ConnectionWorkbench'));
const CoreAtlas = lazy(() => import('./components/CoreAtlas'));
const educationalSearch = {
  islandCount: islands.length,
  entries: islands.reduce<Record<string, string[]>>((lookup, island) => {
    const text = [island.title, island.subtitle, island.object, island.continuation].flatMap(value => [value.zh, value.en]);
    for (const id of island.coreRefs) lookup[id] = [...(lookup[id] || []), ...text];
    return lookup;
  }, {}),
};
export default function App() {
  const [route, navigate] = useRoute();
  const { journal, update, remove, restore, storageAvailable } = useJournal();
  const experiments = useExperimentNotebook();
  const selected = islands.find(i => i.id === route.island) || islands.find(i => i.id === 'elliptic-garden') || islands[0];
  const language = route.lang;
  useEffect(() => { document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'; document.title = language === 'zh' ? `${route.lab ? selected.title.zh + ' · ' : ''}数学群岛` : `${route.lab ? selected.title.en + ' · ' : ''}Math Islands`; }, [language, route.lab, selected]);
  const openIsland = (id: string) => { navigate({ view: 'islands', island: id, lab: true }); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const openCore = (id: string) => { navigate({ view: 'atlas', core: id, lab: false }); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const openConnection = (connection: string) => { navigate({ view: 'connections', connection, lab: false }); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const experimentArchive = { notebook: experiments.notebook, available: experiments.available, unreadable: experiments.unreadable, onRemove: experiments.remove, onImport: experiments.restore, language };
  const nextJourney = journeys.find(j => j.islands.includes(selected.id));
  const nextId = nextJourney?.islands[(nextJourney.islands.indexOf(selected.id) + 1) % nextJourney.islands.length] || islands[(islands.indexOf(selected) + 1) % islands.length].id;
  const next = islands.find(i => i.id === nextId);
  return <><a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); }}>{language === 'zh' ? '跳到主要内容' : 'Skip to content'}</a><Header language={language} view={route.view} onView={view => { navigate({ view, lab: false }); window.scrollTo({ top: 0, behavior: 'instant' }); }} onLanguage={lang => navigate({ lang })}/><div id="main-content" tabIndex={-1}>
    {route.view === 'islands' && (route.lab ? <IslandDetail island={selected} language={language} entry={journal.entries[selected.id]} storageAvailable={storageAvailable} onBack={() => navigate({ lab: false })} onCore={() => openCore(selected.coreId)} onUpdate={patch => update(selected.id, selected.coreId, patch)} onNext={next ? () => openIsland(next.id) : undefined} nextTitle={next?.title[language]}/> : <Explorer language={language} selectedId={selected.id} onSelect={id => navigate({ island: id }, true)} onEnter={openIsland} onCore={openCore}/>)}
    {route.view === 'atlas' && <Suspense fallback={<div className="loading-surface full-loading" role="status">{language === 'zh' ? '正在载入有出处的数学条目…' : 'Loading sourced mathematical entries…'}</div>}><CoreAtlas language={language} selectedId={route.core} onSelect={core => navigate({ core }, true)} curatedCoreIds={islands.map(i => i.coreId)} educationalSearch={educationalSearch} onOpenLesson={core => { const island = islands.find(i => i.coreId === core); if (island) openIsland(island.id); }}/></Suspense>}
    {route.view === 'connections' && <Suspense fallback={<div className="loading-surface full-loading" role="status">{language === 'zh' ? '正在载入联岛实验…' : 'Loading connection experiments…'}</div>}><ConnectionWorkbench {...experimentArchive} selectedId={route.connection} onSelect={openConnection} onOpenIsland={openIsland} onCore={openCore} onSave={experiments.add}/></Suspense>}
    {route.view === 'journal' && <Journal journal={journal} language={language} onOpen={openIsland} onExplore={() => navigate({ view: 'islands', lab: false })} onRemove={remove} onImport={restore} storageAvailable={storageAvailable} connectionRecords={experiments.notebook.records.length || experiments.unreadable ? <ExperimentArchive {...experimentArchive} onOpen={openConnection}/> : undefined}/>}
  </div></>;
}
