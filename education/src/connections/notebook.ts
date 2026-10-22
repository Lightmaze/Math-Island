import { useCallback, useEffect, useState } from 'react';
import type { ConnectionSnapshot, ExperimentValue } from './types';

export const EXPERIMENT_KEY = 'mathcups.education.experiments.v1';
export const EXPERIMENT_LIMIT = 500;
export interface ExperimentRecord {
  id: string;
  connectionId: string;
  title: { zh: string; en: string };
  coreRefs: string[];
  modelVersion: string;
  createdAt: string;
  note: string;
  snapshot: ConnectionSnapshot;
}
export interface ExperimentNotebook { version: 1; records: ExperimentRecord[] }
const empty = (): ExperimentNotebook => ({ version: 1, records: [] });
const text = (v: unknown, limit: number): v is string => typeof v === 'string' && v.length <= limit;
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
function values(value: unknown): value is Record<string, ExperimentValue> {
  return object(value) && Object.keys(value).length <= 100 && Object.entries(value).every(([key, v]) =>
    key.length <= 200 && !['__proto__', 'prototype', 'constructor'].includes(key) &&
    (typeof v === 'boolean' || (typeof v === 'number' && Number.isFinite(v)) || text(v, 10000) ||
      (Array.isArray(v) && v.length <= 512 && v.every(n => typeof n === 'number' && Number.isFinite(n)))));
}
export function validSnapshot(value: unknown): value is ConnectionSnapshot {
  return object(value) && values(value.parameters) && values(value.observations);
}
function validRecord(value: unknown): value is ExperimentRecord {
  if (!object(value)) return false;
  return text(value.id, 150) && !!value.id && text(value.connectionId, 150) && !!value.connectionId &&
    object(value.title) && text(value.title.zh, 400) && text(value.title.en, 400) &&
    Array.isArray(value.coreRefs) && value.coreRefs.length <= 100 && value.coreRefs.every(x => text(x, 1000)) &&
    text(value.modelVersion, 100) && text(value.createdAt, 100) && Number.isFinite(Date.parse(value.createdAt)) &&
    text(value.note, 20000) && validSnapshot(value.snapshot);
}
/** Import is atomic: a malformed record rejects the complete selected backup. */
export function importExperiments(raw: string): ExperimentNotebook {
  if (new TextEncoder().encode(raw).length > 5 * 1024 * 1024) throw new Error('backup-too-large');
  const value: unknown = JSON.parse(raw);
  if (!object(value) || value.version !== 1 || !Array.isArray(value.records) || value.records.length > EXPERIMENT_LIMIT || !value.records.every(validRecord)) throw new Error('invalid-experiment-backup');
  const records = value.records as ExperimentRecord[];
  if (new Set(records.map(r => r.id)).size !== records.length) throw new Error('duplicate-record-identity');
  return { version: 1, records: records.map(r => ({ id: r.id, connectionId: r.connectionId, title: { ...r.title }, coreRefs: [...r.coreRefs], modelVersion: r.modelVersion, createdAt: r.createdAt, note: r.note, snapshot: structuredClone(r.snapshot) })) };
}
export function mergeExperiments(local: ExperimentNotebook, incoming: ExperimentNotebook): ExperimentNotebook {
  const known = new Set(local.records.map(r => r.id));
  const records = [...local.records, ...incoming.records.filter(r => !known.has(r.id))];
  if (records.length > EXPERIMENT_LIMIT) throw new Error('record-limit');
  if (new TextEncoder().encode(JSON.stringify({ version: 1, records })).length > 5 * 1024 * 1024) throw new Error('backup-too-large');
  return { version: 1, records };
}
export function experimentMarkdown(records: ExperimentRecord[], language: 'zh' | 'en'): string {
  const rows = (value: Record<string, ExperimentValue>) => Object.entries(value).map(([key, v]) => `- ${key}: ${JSON.stringify(v)}`);
  return ['# ' + (language === 'zh' ? '数学群岛 · 联岛实验记录' : 'Math Islands · Connection experiments'), '', ...records.flatMap(r => [
    `## ${r.title[language]}`, '', `${r.createdAt} · model ${r.modelVersion} · ${r.connectionId}`, '', r.note, '',
    language === 'zh' ? '### 参数' : '### Parameters', '', ...rows(r.snapshot.parameters), '',
    language === 'zh' ? '### 计算结果' : '### Computed observations', '', ...rows(r.snapshot.observations), '',
    `Core references: ${r.coreRefs.join(', ')}`, '',
    language === 'zh' ? '有限模型的实验记录，不是证明或学习认证。' : 'A finite-model observation, not a proof or assessment certificate.', '',
  ])].join('\n');
}
function initialNotebook() {
  try {
    const raw = localStorage.getItem(EXPERIMENT_KEY);
    if (!raw) return { notebook: empty(), unreadable: null as string | null, available: true };
    try { return { notebook: importExperiments(raw), unreadable: null as string | null, available: true }; }
    catch { return { notebook: empty(), unreadable: raw, available: false }; }
  } catch { return { notebook: empty(), unreadable: null as string | null, available: false }; }
}
export function useExperimentNotebook() {
  const [initial] = useState(initialNotebook);
  const [notebook, setNotebook] = useState(initial.notebook);
  const [unreadable, setUnreadable] = useState(initial.unreadable);
  const [available, setAvailable] = useState(initial.available);
  const persist = useCallback((next: ExperimentNotebook, repair = false) => {
    setNotebook(next);
    if (unreadable !== null && !repair) { setAvailable(false); return; }
    try { localStorage.setItem(EXPERIMENT_KEY, JSON.stringify(next)); setAvailable(true); }
    catch { setAvailable(false); }
  }, [unreadable]);
  useEffect(() => {
    const listener = (event: StorageEvent) => {
      if (event.key !== EXPERIMENT_KEY) return;
      // Receiving another tab's update must not write it back and trigger a feedback loop.
      try { const value = event.newValue ? importExperiments(event.newValue) : empty(); setNotebook(value); setUnreadable(null); setAvailable(true); }
      catch { setUnreadable(event.newValue); setAvailable(false); }
    };
    window.addEventListener('storage', listener); return () => window.removeEventListener('storage', listener);
  }, []);
  const add = useCallback((record: ExperimentRecord) => {
    const next = mergeExperiments(notebook, { version: 1, records: [record] });
    persist(next);
  }, [notebook, persist]);
  const remove = useCallback((id: string) => persist({ version: 1, records: notebook.records.filter(r => r.id !== id) }), [notebook, persist]);
  const restore = useCallback((incoming: ExperimentNotebook) => {
    // Validation and size checks are performed before invoking this callback.
    const next = mergeExperiments(notebook, incoming);
    persist(next, true); setUnreadable(null);
  }, [notebook, persist]);
  return { notebook, available, unreadable, add, remove, restore };
}
