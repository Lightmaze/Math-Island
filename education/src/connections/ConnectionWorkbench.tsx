import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import { ArrowRight, Save } from 'lucide-react';
import { connections } from '../data/connections';
import { islands } from '../data/islands';
import type { Language } from '../lib/state';
import IslandGlyph from '../components/IslandGlyph';
import ShareButton from '../components/ShareButton';
import ExperimentArchive, { type ArchiveProps } from './ExperimentArchive';
import { validSnapshot, EXPERIMENT_LIMIT, type ExperimentRecord } from './notebook';
import type { ConnectionLabProps, ConnectionSnapshot } from './types';
import { HeatFourierLab, TransportCdfLab } from './AnalysisConnections';
import { GraphHomologyLab, SymmetryRepresentationLab } from './DiscreteConnections';
import { CoveringComplexLab, IdealZeroLab } from './StructureConnections';
import './connections.css';
const labs: Record<string, ComponentType<ConnectionLabProps>> = {
  'fourier-heat': HeatFourierLab, 'graph-homology': GraphHomologyLab, 'complex-covering': CoveringComplexLab,
  'transport-cdf': TransportCdfLab, 'ideal-zeros': IdealZeroLab, 'symmetry-representation': SymmetryRepresentationLab,
};
const labels: Record<string, { zh: string; en: string }> = {
  'fourier-heat': { zh: '傅里叶与热流', en: 'Fourier & heat' }, 'graph-homology': { zh: '图与同调', en: 'Graphs & homology' },
  'complex-covering': { zh: '复数与覆盖', en: 'Complex covers' }, 'transport-cdf': { zh: '分布与输运', en: 'Distributions & transport' },
  'ideal-zeros': { zh: '理想与零点', en: 'Ideals & zeros' }, 'symmetry-representation': { zh: '对称与表示', en: 'Symmetry & representations' },
};
interface Props extends Omit<ArchiveProps, 'onOpen'> {
  selectedId?: string;
  onSelect: (id: string) => void;
  onOpenIsland: (id: string) => void;
  onCore: (id: string) => void;
  onSave: (record: ExperimentRecord) => void;
}
export default function ConnectionWorkbench(props: Props) {
  const { language, selectedId, onSelect, onOpenIsland, onCore, onSave, ...archive } = props;
  const selected = connections.find(c => c.id === selectedId) || connections[0];
  const Lab = labs[selected.id];
  const [received, setReceived] = useState<{ id: string; value: ConnectionSnapshot } | null>(null);
  const snapshot = received?.id === selected.id ? received.value : null;
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const receive = useCallback((value: ConnectionSnapshot) => { setReceived(validSnapshot(value) ? { id: selected.id, value } : null); setSaved(false); }, [selected.id]);
  useEffect(() => { setNote(''); setSaved(false); setSaveError(false); }, [selected.id]);
  const choose = (id: string) => { onSelect(id); window.setTimeout(() => heading.current?.focus(), 0); };
  const save = () => {
    if (!snapshot || props.notebook.records.length >= EXPERIMENT_LIMIT) return;
    const id = globalThis.crypto?.randomUUID?.() || `experiment-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    try {
      onSave({ id, connectionId: selected.id, title: selected.title, coreRefs: [...selected.coreRefs], modelVersion: '0.2.0', createdAt: new Date().toISOString(), note, snapshot: structuredClone(snapshot) });
      setSaved(true); setSaveError(false);
    } catch { setSaved(false); setSaveError(true); }
  };
  const invalid = selectedId && selectedId !== selected.id;
  return <main className="connections-page">
    <aside className="connection-directory" aria-label={language === 'zh' ? '联岛实验目录' : 'Connection experiment index'}><h2>{language === 'zh' ? '联岛实验' : 'Connections'}</h2>
      <div className="connection-desktop-index">{connections.map(item => <button key={item.id} aria-current={selected.id === item.id ? 'page' : undefined} onClick={() => choose(item.id)}>{labels[item.id][language]}</button>)}</div>
      <label className="connection-mobile-index"><span className="sr-only">{language === 'zh' ? '选择联岛实验' : 'Choose a connection experiment'}</span><select value={selected.id} onChange={event => choose(event.target.value)}>{connections.map(item => <option key={item.id} value={item.id}>{labels[item.id][language]}</option>)}</select></label>
      <p className="connection-directory-note">{language === 'zh' ? '让两个对象，在同一个计算中相遇。' : 'Bring two objects into the same calculation.'}</p>
    </aside>
    <div className="connection-workspace">
      {invalid && <p className="connection-warning" role="status">{language === 'zh' ? '本版本没有这个实验。已展示目录首项；已保存的未知实验记录仍保留。' : 'This experiment is not in this edition. The first entry is shown; saved records from other editions remain intact.'}</p>}
      <header className="connection-heading"><h1 ref={heading} tabIndex={-1}>{selected.title[language]}</h1><p>{selected.summary[language]}</p></header>
      <div className="connection-experiment" data-connection={selected.id}><Lab key={selected.id} language={language} onSnapshot={receive}/></div>
      <section className="connection-relation" aria-label={language === 'zh' ? '关系与适用条件' : 'Relation and assumptions'}><div><h2>{selected.relation.label[language]}</h2><p>{selected.relation.statement[language]}</p></div><div><h2>{language === 'zh' ? '适用条件' : 'Assumptions'}</h2><p>{selected.assumptions[language]}</p></div></section>
      <section className="connection-observation" aria-label={language === 'zh' ? '保存这次观察' : 'Save this observation'}>
        <label htmlFor="connection-note">{language === 'zh' ? '这次改变，让你观察到什么？' : 'What did this change reveal?'}<textarea id="connection-note" value={note} maxLength={20000} rows={3} onChange={event => { setNote(event.target.value); setSaved(false); }} placeholder={language === 'zh' ? '写下观察、疑问或一个待验证的预测…' : 'Write an observation, a question, or a prediction to test…'}/></label>
        <div className="connection-save-actions"><button className="primary-button connection-save" onClick={save} disabled={!snapshot || props.notebook.records.length >= EXPERIMENT_LIMIT}><Save size={17}/>{language === 'zh' ? '保存实验记录' : 'Save experiment record'}</button><ShareButton language={language} label={language === 'zh' ? '分享实验入口' : 'Share experiment entry'}/></div>
        <p className="connection-status" role="status">{saved ? (language === 'zh' ? '已保存当时的参数、计算结果和观察；可在下方或“我的航记”导出。' : 'Saved the parameters, calculated observations and note; export below or in Field notes.') : props.notebook.records.length >= EXPERIMENT_LIMIT ? (language === 'zh' ? '已达到 500 条记录；先导出备份并删除不再需要的本地记录。' : 'The 500-record limit is reached. Export a backup and remove local records you no longer need.') : ''}</p>
      </section>
      {saveError && <p className="connection-warning" role="alert">{language === 'zh' ? '记录容量不足。请先导出备份，再删除不再需要的记录或缩短观察文字。' : 'The notebook is full. Export a backup, then remove records you no longer need or shorten the note.'}</p>}
      <section className="connection-reading"><div><h2>{language === 'zh' ? '动手检验这座桥' : 'Investigate this connection'}</h2><ol>{selected.steps.map((step, i) => <li key={i}><h3>{step.title[language]}</h3><p>{step.body[language]}</p></li>)}</ol><details><summary>{selected.question[language]}</summary><p>{selected.answer[language]}</p></details></div><div><h2>{language === 'zh' ? '这幅图的边界' : 'Where this picture stops'}</h2><p>{selected.boundary[language]}</p><h2>{language === 'zh' ? '关联课堂' : 'Connected lessons'}</h2><div className="connection-lessons">{selected.lessonIds.map(id => { const island = islands.find(i => i.id === id); return island ? <button key={id} onClick={() => onOpenIsland(id)}><IslandGlyph kind={island.labKey} size={64}/><span>{island.title[language]}</span><ArrowRight size={16}/></button> : null; })}</div></div></section>
      <section className="connection-sources"><h2>{language === 'zh' ? '数学出处与本体条目' : 'Mathematical sources and core entries'}</h2><ul>{selected.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a><p>{source.locator} · {source.evidence[language]}</p></li>)}</ul><div className="connection-core-links">{selected.coreRefs.map(id => <button key={id} className="text-action" onClick={() => onCore(id)}>{id}<ArrowRight size={13}/></button>)}</div></section>
      <ExperimentArchive {...archive} language={language} onOpen={choose}/>
    </div>
  </main>;
}
