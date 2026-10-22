import { useRef, useState } from 'react';
import { ArrowRight, Download, Feather, Trash2, Upload } from 'lucide-react';
import { islands } from '../data/islands';
import type { Journal as JournalData, Language } from '../lib/state';
import { downloadText, importJournal } from '../lib/state';
import IslandGlyph from './IslandGlyph';

export default function Journal({ journal, language, onOpen, onExplore, onRemove, onImport, storageAvailable }: {
  journal: JournalData; language: Language; onOpen: (id: string) => void; onExplore: () => void;
  onRemove: (id: string) => void; onImport: (journal: JournalData) => void; storageAvailable: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ count?: number; error?: boolean } | null>(null);
  const entries = Object.values(journal.entries).filter(entry => entry.note.trim() || entry.observed).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  const observed = entries.filter(e => e.observed).length;
  const exportMarkdown = () => {
    const text = ['# ' + (language === 'zh' ? '数学群岛 · 我的航记' : 'Math Islands · Field notes'), '', ...entries.flatMap(e => {
      const island = islands.find(i => i.id === e.islandId);
      return [`## ${island?.title[language] || e.islandId}`, '', `Core ID: ${e.coreId}`, `Updated: ${e.updatedAt}`, '', e.note || (language === 'zh' ? '已亲手探索，尚未留下文字。' : 'Explored, with no written note yet.'), ''];
    })].join('\n');
    downloadText('math-islands-field-notes.md', text, 'text/markdown;charset=utf-8');
  };
  const restoreFile = async (file?: File) => {
    if (!file) return;
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error('file-too-large');
      const incoming = importJournal(await file.text());
      onImport(incoming);
      setImportStatus({ count: Object.keys(incoming.entries).length });
    } catch { setImportStatus({ error: true }); }
    finally { if (input.current) input.current.value = ''; }
  };
  return <main className="journal-page">
    <div className="journal-heading">
      <div><Feather className="journal-feather" size={30}/><h1>{language === 'zh' ? '我的航记' : 'Field notes'}</h1><p>{language === 'zh' ? '把一次操作，留成一个能重新出发的问题。' : 'Keep an observation. Leave yourself a new departure point.'}</p></div>
      <div className="journal-export">
        <button className="text-action" onClick={() => input.current?.click()}><Upload size={16}/>{language === 'zh' ? '导入航记' : 'Import notes'}</button>
        <input type="file" accept="application/json,.json" ref={input} hidden onChange={e => void restoreFile(e.target.files?.[0])}/>
        {entries.length > 0 && <><button className="text-action" onClick={exportMarkdown}><Download size={16}/>{language === 'zh' ? '导出 Markdown' : 'Export Markdown'}</button><button className="text-action" onClick={() => downloadText('math-islands-journal.json', JSON.stringify(journal, null, 2), 'application/json')}><Download size={16}/>{language === 'zh' ? '备份 JSON' : 'Back up JSON'}</button></>}
      </div>
    </div>
    {importStatus && <p className={`journal-import-status ${importStatus.error ? 'is-error' : ''}`} role="status">{importStatus.error ? (language === 'zh' ? '这份文件不是有效的航记备份，或超过 5 MB；现有记录没有改变。' : 'This file is not a valid field-note backup or exceeds 5 MB. Your existing notes have not changed.') : (language === 'zh' ? `已读取 ${importStatus.count} 条记录；同一岛屿保留较新的记录，其余航记继续保留。` : `Read ${importStatus.count} records. Newer entries win conflicts; all other notes are retained.`)}</p>}
    {!storageAvailable && <p className="journal-import-status is-error" role="status">{language === 'zh' ? '浏览器存储暂不可用。离开前请导出备份，当前页面中的记录仍可导出。' : 'Browser storage is unavailable. Export a backup before leaving; the notes on this page can still be exported.'}</p>}
    {entries.length ? <>
      <p className="journal-summary">{language === 'zh' ? `${observed} 座已探索 · ${entries.filter(e => e.note.trim()).length} 页文字记录` : `${observed} explored · ${entries.filter(e => e.note.trim()).length} written notes`}</p>
      <ol className="journal-entries">{entries.map(e => {
        const island = islands.find(i => i.id === e.islandId);
        return <li key={e.islandId}>
          <div className="journal-entry-art">{island && <IslandGlyph kind={island.labKey} size={110}/>}</div>
          <div className="journal-entry-body"><span className="entry-date">{new Date(e.updatedAt).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span><h2>{island?.title[language] || e.islandId}</h2><p className="entry-note">{e.note || (language === 'zh' ? '已经亲手探索，下一次留下你的观察。' : 'You have explored this object. Add your observation next time.')}</p>
            {island ? <button className="text-action" onClick={() => onOpen(e.islandId)}>{language === 'zh' ? '回到岛上，继续记录' : 'Return to the island'}<ArrowRight size={16}/></button> : <p className="archived-note">{language === 'zh' ? '本版本尚无此课程，记录已保留，可继续导出。' : 'This lesson is not in this edition. Your note is retained and can be exported.'} <code>{e.coreId}</code></p>}
          </div>
          <button className="entry-delete" aria-label={`${language === 'zh' ? '删除航记：' : 'Delete note: '}${island?.title[language] || e.islandId}`} onClick={() => { if (window.confirm(language === 'zh' ? '删除这座岛的本地航记与探索标记？导出的文件不会受影响。' : 'Delete this island’s local note and exploration mark? Exported files are unchanged.')) onRemove(e.islandId); }}><Trash2 size={17}/></button>
        </li>;
      })}</ol>
    </> : <div className="empty-journal"><IslandGlyph kind="category" size={230}/><h2>{language === 'zh' ? '第一座岛，还在等你。' : 'Your first island is waiting.'}</h2><p>{language === 'zh' ? '转动一个对称、改变一条曲线，或给一个反例留下位置。' : 'Turn a symmetry, change a curve, or make room for a counterexample.'}</p><button className="primary-button" onClick={onExplore}>{language === 'zh' ? '开始探索' : 'Begin exploring'}<ArrowRight size={18}/></button></div>}
    <p className="journal-privacy">{language === 'zh' ? '航记只保存在当前浏览器。JSON 备份可在另一台设备导入，同一岛屿保留时间较新的记录。探索标记记录操作经历，不代表证明或测评认证。' : 'Notes live in this browser. Import a JSON backup on another device; the newer entry is kept for each island. An exploration mark records activity, not proof or assessment certification.'}</p>
    <a className="source-notice" href={`${import.meta.env.BASE_URL}attribution.html${language === 'en' ? '#english' : ''}`} target="_blank" rel="noreferrer">{language === 'zh' ? '来源、许可与自己的航记' : 'Sources, licenses & your notes'}</a>
  </main>;
}
