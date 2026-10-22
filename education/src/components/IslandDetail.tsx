import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, Feather, Network } from 'lucide-react';
import type { Island } from '../data/islands';
import { domainLabels } from '../data/domains';
import type { JournalEntry, Language } from '../lib/state';
import IslandGlyph from './IslandGlyph';
import ShareButton from './ShareButton';
const ObjectLab = lazy(() => import('../labs/ObjectLab'));

export default function IslandDetail({ island, language, entry, storageAvailable, onBack, onCore, onUpdate, onNext, nextTitle }: {
  island: Island; language: Language; entry?: JournalEntry; storageAvailable: boolean;
  onBack: () => void; onCore: () => void; onUpdate: (patch: Partial<Pick<JournalEntry, 'note' | 'observed'>>) => void; onNext?: () => void; nextTitle?: string;
}) {
  const [step, setStep] = useState(0), [answer, setAnswer] = useState(false), [backgroundOpen, setBackgroundOpen] = useState(false);
  useEffect(() => { setStep(0); setAnswer(false); setBackgroundOpen(false); }, [island.id]);
  const observe = () => { if (!entry?.observed) onUpdate({ observed: true }); };
  return <main className="island-detail" id="island-detail-main">
    <div className="detail-toolbar"><button className="text-action" onClick={onBack}><ArrowLeft size={17}/>{language === 'zh' ? '返回群岛' : 'Back to the islands'}</button><ShareButton language={language}/></div>
    <div className="detail-heading"><div><span className="detail-domain">{language === 'zh' ? island.domain : domainLabels[island.domain] || island.domain}</span><h1>{island.title[language]}</h1><p>{island.subtitle[language]}</p></div><div className="detail-emblem"><IslandGlyph kind={island.labKey} size={150}/></div></div>
    <div className="lesson-layout">
      <aside className="lesson-reading"><div className={`lesson-background ${backgroundOpen ? 'is-open' : ''}`}><button className="lesson-background-toggle" aria-expanded={backgroundOpen} aria-controls={`lesson-background-${island.id}`} onClick={() => setBackgroundOpen(v => !v)}><BookOpen size={17}/>{language === 'zh' ? '数学对象与生态说明' : 'The mathematical object & its habitat'}<ChevronDown size={17}/></button><div id={`lesson-background-${island.id}`} className="lesson-background-body"><section><h2>{language === 'zh' ? '岛上对象' : 'The objects here'}</h2><p>{island.object[language]}</p></section><section className="ecology-reading"><h2>{language === 'zh' ? '为什么是这样的生态？' : 'Why this habitat?'}</h2><p>{island.ecology[language]}</p></section></div></div>
        <div className="lesson-steps" role="tablist" aria-label={language === 'zh' ? '探索步骤' : 'Exploration steps'}>{island.steps.map((s, i) => <button key={i} role="tab" aria-selected={step === i} aria-controls={`lesson-step-${island.id}`} id={`lesson-tab-${island.id}-${i}`} tabIndex={step === i ? 0 : -1} className={step === i ? 'active' : ''} onClick={() => setStep(i)} onKeyDown={e => { if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); const n = (step + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1) + island.steps.length) % island.steps.length; setStep(n); document.getElementById(`lesson-tab-${island.id}-${n}`)?.focus(); } }}><span>{String(i + 1).padStart(2, '0')}</span>{s.title[language]}<ArrowRight size={15}/></button>)}</div>
        <div className="lesson-step-copy" role="tabpanel" id={`lesson-step-${island.id}`} aria-labelledby={`lesson-tab-${island.id}-${step}`}><p>{island.steps[step]?.body[language]}</p></div>
        <div className="prerequisite-note"><BookOpen size={16}/><p>{island.prerequisites[language]}</p></div>
      </aside>
      <div className="laboratory"><Suspense fallback={<div className="loading-surface" role="status">{language === 'zh' ? '正在展开这座岛的数学对象…' : 'Unfolding the mathematical objects…'}</div>}><ObjectLab key={island.id} labKey={island.labKey} language={language} onExplore={observe}/></Suspense></div>
    </div>
    <div className="lesson-afterword">
      <section className="reflection"><h2>{language === 'zh' ? '带走一个问题' : 'Take a question with you'}</h2><p className="reflection-question">{island.question[language]}</p><button className="text-action" aria-expanded={answer} onClick={() => setAnswer(a => !a)}>{answer ? (language === 'zh' ? '收起解释' : 'Hide explanation') : (language === 'zh' ? '展开解释' : 'Reveal an explanation')}<ChevronDown size={16} style={{ transform: answer ? 'rotate(180deg)' : undefined }}/></button>{answer && <div className="reflection-answer">{island.answer[language]}</div>}<div className="scope-note"><h3>{language === 'zh' ? '这幅图的边界' : 'Where this picture stops'}</h3><p>{island.boundary[language]}</p></div></section>
      <section className="fieldnote-editor"><h2><Feather size={21}/>{language === 'zh' ? '留下一页航记' : 'Leave a field note'}</h2><label htmlFor="island-note">{language === 'zh' ? '你观察到了什么？条件改变后，什么还成立？' : 'What did you observe? What survives a change of assumptions?'}</label><textarea id="island-note" value={entry?.note || ''} onChange={e => onUpdate({ note: e.target.value })} maxLength={20000} placeholder={language === 'zh' ? '记录一个观察、一个反例，或一个还没解决的问题。' : 'An observation, a counterexample, or a question still open to you.'}/><div className="note-status"><span>{storageAvailable ? (language === 'zh' ? '自动保存在这台设备，可在「我的航记」导出。' : 'Saved on this device. Export from Field notes.') : (language === 'zh' ? '此浏览器未能保存，请及时导出航记。' : 'Browser storage is unavailable. Export your notes before leaving.')}</span><button className={entry?.observed ? 'observed active' : 'observed'} aria-pressed={Boolean(entry?.observed)} onClick={() => onUpdate({ observed: !entry?.observed })}><Check size={15}/>{language === 'zh' ? (entry?.observed ? '已亲手探索' : '标记已探索') : (entry?.observed ? 'Explored' : 'Mark explored')}</button></div></section>
    </div>
    <div className="lesson-footer"><section className="further-reading"><h2>{language === 'zh' ? '从这里，走向更深处' : 'Go deeper from here'}</h2><p>{island.continuation[language]}</p><div className="lesson-sources">{island.sources.map((source, i) => <a key={`${source.url}-${i}`} href={source.url} target="_blank" rel="noreferrer">{source.title}<ArrowUpRight size={14}/></a>)}</div><button className="text-action" onClick={onCore}><Network size={16}/>{language === 'zh' ? '在完整数学图谱中查看这个对象' : 'Find this object in the full mathematical atlas'}<ArrowUpRight size={15}/></button></section>{onNext && <button className="next-island" onClick={onNext}><span>{language === 'zh' ? '继续航行' : 'Continue exploring'}</span><strong>{nextTitle}</strong><ArrowRight size={24}/></button>}</div>
  </main>;
}
