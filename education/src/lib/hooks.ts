import { useCallback, useEffect, useState } from 'react';
import { encodeRoute, JOURNAL_KEY, mergeJournal, parseJournal, parseRoute } from './state';
import type { Journal, JournalEntry, RouteState } from './state';

export function useRoute() {
  const [route, setRoute] = useState<RouteState>(() => parseRoute(location.hash));
  useEffect(() => {
    const sync = () => setRoute(parseRoute(location.hash));
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('popstate', sync); };
  }, []);
  const navigate = useCallback((patch: Partial<RouteState>, replace = false) => {
    setRoute(current => {
      const next = { ...current, ...patch };
      const hash = encodeRoute(next);
      if (location.hash !== hash) history[replace ? 'replaceState' : 'pushState'](null, '', hash);
      return next;
    });
  }, []);
  return [route, navigate] as const;
}

export function useJournal() {
  const [journal, setJournal] = useState<Journal>(() => {
    try { return parseJournal(localStorage.getItem(JOURNAL_KEY)); } catch { return { version: 1, entries: {} }; }
  });
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => {
    try { localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal)); setStorageAvailable(true); }
    catch { setStorageAvailable(false); }
  }, [journal]);
  useEffect(() => {
    const sync = (event: StorageEvent) => { if (event.key === JOURNAL_KEY) setJournal(parseJournal(event.newValue)); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const update = useCallback((islandId: string, coreId: string, patch: Partial<Pick<JournalEntry, 'note' | 'observed'>>) => {
    setJournal(current => ({ version: 1, entries: { ...current.entries, [islandId]: {
      note: current.entries[islandId]?.note ?? '', observed: current.entries[islandId]?.observed ?? false,
      ...patch, islandId, coreId, updatedAt: new Date().toISOString(),
    } } }));
  }, []);
  const remove = useCallback((islandId: string) => {
    setJournal(current => {
      const entries = { ...current.entries };
      delete entries[islandId];
      return { version: 1, entries };
    });
  }, []);
  const restore = useCallback((incoming: Journal) => setJournal(current => mergeJournal(current, incoming)), []);
  return { journal, update, remove, restore, storageAvailable };
}
