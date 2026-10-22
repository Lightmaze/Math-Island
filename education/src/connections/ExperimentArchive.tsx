import { useRef, useState } from 'react';
import { ArrowRight, Download, Trash2, Upload } from 'lucide-react';
import { downloadText, type Language } from '../lib/state';
import { experimentMarkdown, importExperiments, mergeExperiments, type ExperimentNotebook, type ExperimentRecord } from './notebook';
import './connections.css';
export interface ArchiveProps {
  notebook: ExperimentNotebook;
  language: Language;
  available: boolean;
  unreadable: string | null;
  onRemove: (id: string) => void;
  onImport: (incoming: ExperimentNotebook) => void;
  onOpen: (id: string) => void;
}
function Data({ record, language }: { record: ExperimentRecord; language: Language }) {
  return <details className="experiment-values"><summary>{language === 'zh' ? '查看保存的参数与计算结果' : 'Read saved parameters and observations'}</summary>
    {(['parameters', 'observations'] as const).map(key => <div key={key}><h4>{key === 'parameters' ? (language === 'zh' ? '参数' : 'Parameters') : (language === 'zh' ? '计算结果' : 'Observations')}</h4><dl>{Object.entries(record.snapshot[key]).map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{Array.isArray(value) ? value.join(', ') : String(value)}</dd></div>)}</dl></div>)}
    <p>{language === 'zh' ? '模型版本' : 'Model version'} {record.modelVersion} · {record.connectionId}</p>
  </details>;
}
export default function ExperimentArchive({ notebook, language, available, unreadable, onRemove, onImport, onOpen }: ArchiveProps) {
  const input = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState('');
  const [limit, setLimit] = useState(10);
  const records = [...notebook.records].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const importFile = async (file?: File) => {
    if (!file) return;
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error('size');
      const incoming = importExperiments(await file.text());
      const merged = mergeExperiments(notebook, incoming);
      onImport(incoming);
      setStatus(language === 'zh' ? `导入 ${merged.records.length - notebook.records.length} 条新实验记录；已有同编号记录保持不变。` : `Imported ${merged.records.length - notebook.records.length} new experiment records; existing IDs are unchanged.`);
    } catch { setStatus(language === 'zh' ? '未导入：备份格式无效、超过 5 MB 或合并后超过 500 条。现有记录没有改变。' : 'Not imported: invalid format, over 5 MB, or over 500 merged records. Existing observations are unchanged.'); }
    finally { if (input.current) input.current.value = ''; }
  };
  return <section className="experiment-archive" aria-labelledby="experiment-archive-title">
    <div className="experiment-archive-heading"><div><h2 id="experiment-archive-title">{language === 'zh' ? '联岛实验记录' : 'Connection records'}</h2><p>{language === 'zh' ? '把一次参数选择和观察留在一起。' : 'Keep a choice of parameters together with its observations.'}</p></div>
      <div className="experiment-archive-actions"><input type="file" accept="application/json,.json" ref={input} hidden onChange={e => void importFile(e.target.files?.[0])}/>
        <button className="text-action" onClick={() => input.current?.click()}><Upload size={16}/>{language === 'zh' ? '导入实验记录' : 'Import experiments'}</button>
        {!!records.length && <><button className="text-action" onClick={() => downloadText('math-islands-experiments.json', JSON.stringify(notebook), 'application/json')}><Download size={16}/>{language === 'zh' ? '导出实验 JSON' : 'Export experiment JSON'}</button><button className="text-action" onClick={() => downloadText('math-islands-experiments.md', experimentMarkdown(records, language), 'text/markdown;charset=utf-8')}><Download size={16}/>{language === 'zh' ? '导出实验 Markdown' : 'Export experiment Markdown'}</button></>}
      </div>
    </div>
    {!available && <p className="connection-warning" role="status">{unreadable !== null ? (language === 'zh' ? '旧备份无法读取，原数据尚未被覆盖。当前实验保留在本次页面内，请导出。导入有效备份可恢复本地保存。' : 'The old backup is unreadable and has not been overwritten. Current observations stay in this session; export them. Import a valid backup to restore persistence.') : (language === 'zh' ? '浏览器存储不可用；离开前请导出当前记录。' : 'Browser storage is unavailable; export these observations before leaving.')}
      {unreadable !== null && <button className="text-action" onClick={() => downloadText('math-islands-unreadable-experiments.json', unreadable, 'application/json')}>{language === 'zh' ? '下载原始备份' : 'Download original backup'}</button>}</p>}
    {status && <p className="connection-status" role="status">{status}</p>}
    {records.length ? <ol className="experiment-records">{records.slice(0, limit).map(record => <li key={record.id}>
      <div className="experiment-record-heading"><h3>{record.title[language]}</h3><time dateTime={record.createdAt}>{new Date(record.createdAt).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US')}</time></div>
      {record.note && <p className="experiment-record-note">{record.note}</p>}<Data record={record} language={language}/>
      <div className="experiment-record-actions"><button className="text-action" onClick={() => onOpen(record.connectionId)}>{language === 'zh' ? '打开实验入口' : 'Open experiment'}<ArrowRight size={15}/></button><button className="text-action" onClick={() => { if (window.confirm(language === 'zh' ? '删除这条本地实验记录？已导出的文件不受影响。' : 'Delete this local experiment record? Downloaded backups are unaffected.')) onRemove(record.id); }}><Trash2 size={15}/>{language === 'zh' ? '删除实验记录' : 'Delete experiment record'}</button></div>
    </li>)}</ol> : <p className="experiment-empty">{language === 'zh' ? '在任一联岛实验中改变参数，然后保存一份观察。' : 'Change parameters in a connection experiment, then save an observation.'}</p>}
    {records.length > limit && <button className="text-action" onClick={() => setLimit(n => n + 20)}>{language === 'zh' ? '显示更多记录' : 'Show more records'}</button>}
    <p className="experiment-privacy">{language === 'zh' ? '记录仅在本地保存；快照用于比较观察，不是证明或学习认证。打开入口不会自动恢复旧参数。' : 'Records stay local. Snapshots support comparison, not proof or certification. Opening an experiment does not restore old parameters automatically.'}</p>
  </section>;
}
