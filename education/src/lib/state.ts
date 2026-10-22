export type Language = 'zh' | 'en';
export type View = 'islands' | 'atlas' | 'connections' | 'journal';
export interface RouteState {
  view: View;
  lang: Language;
  island?: string;
  core?: string;
  lab?: boolean;
  connection?: string;
}
export interface JournalEntry {
  islandId: string;
  coreId: string;
  note: string;
  observed: boolean;
  updatedAt: string;
}
export interface Journal {
  version: 1;
  entries: Record<string, JournalEntry>;
}
export const JOURNAL_KEY = 'mathcups.education.journal.v1';
const allowedViews = new Set(['islands', 'atlas', 'connections', 'journal']);

export function parseRoute(hash: string): RouteState {
  const p = new URLSearchParams(hash.replace(/^#/, ''));
  const view = p.get('view') || 'islands';
  return {
    view: (allowedViews.has(view) ? view : 'islands') as View,
    lang: p.get('lang') === 'en' ? 'en' : 'zh',
    island: p.get('island') || undefined,
    core: p.get('core') || undefined,
    lab: p.get('lab') === '1',
    ...(p.get('connection') ? { connection: p.get('connection')! } : {}),
  };
}

export function encodeRoute(route: RouteState): string {
  const p = new URLSearchParams({ view: route.view, lang: route.lang });
  if (route.island) p.set('island', route.island);
  if (route.core && route.view === 'atlas') p.set('core', route.core);
  if (route.lab && route.view === 'islands') p.set('lab', '1');
  if (route.connection && route.view === 'connections') p.set('connection', route.connection);
  return `#${p.toString()}`;
}

export function parseJournal(raw: string | null): Journal {
  const empty: Journal = { version: 1, entries: {} };
  if (!raw) return empty;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !('version' in parsed) || parsed.version !== 1 || !('entries' in parsed)) return empty;
    const entries = (parsed as { entries: unknown }).entries;
    if (!entries || typeof entries !== 'object' || Array.isArray(entries)) return empty;
    const valid: Record<string, JournalEntry> = {};
    for (const [key, entry] of Object.entries(entries)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
      if (!entry || typeof entry !== 'object') continue;
      const e = entry as Record<string, unknown>;
      if (typeof e.islandId === 'string' && e.islandId === key && typeof e.coreId === 'string' && typeof e.note === 'string' && typeof e.observed === 'boolean' && typeof e.updatedAt === 'string' && Number.isFinite(Date.parse(e.updatedAt))) {
        valid[key] = { islandId: e.islandId, coreId: e.coreId, note: e.note.slice(0, 20000), observed: e.observed, updatedAt: e.updatedAt };
      }
    }
    return { version: 1, entries: valid };
  } catch { return empty; }
}

/** A user-selected backup is stricter than a damaged local cache: never silently discard entries. */
export function importJournal(raw: string): Journal {
  const input: unknown = JSON.parse(raw);
  if (!input || typeof input !== 'object' || !('version' in input) || input.version !== 1 || !('entries' in input) || !input.entries || typeof input.entries !== 'object' || Array.isArray(input.entries)) throw new Error('invalid-journal');
  const result = parseJournal(raw);
  if (Object.keys(result.entries).length !== Object.keys(input.entries).length) throw new Error('invalid-entry');
  for (const entry of Object.values(input.entries)) {
    if (typeof entry !== 'object' || !entry || typeof entry.note !== 'string' || entry.note.length > 20000) throw new Error('oversized-entry');
  }
  return result;
}

/** Import is additive. A conflict keeps the newer timestamp, ties keep the local copy. */
export function mergeJournal(current: Journal, incoming: Journal): Journal {
  const entries = { ...current.entries };
  for (const [id, entry] of Object.entries(incoming.entries)) {
    const local = Object.hasOwn(entries, id) ? entries[id] : undefined;
    if (!local || Date.parse(entry.updatedAt) > Date.parse(local.updatedAt)) entries[id] = entry;
  }
  return { version: 1, entries };
}

export function downloadText(filename: string, text: string, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
