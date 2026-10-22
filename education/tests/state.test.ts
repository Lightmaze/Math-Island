import { describe, expect, it } from 'vitest';
import { encodeRoute, importJournal, mergeJournal, parseJournal, parseRoute } from '../src/lib/state';

describe('shareable educational navigation', () => {
  it('round trips core IDs and bilingual island names without treating punctuation as a new parameter', () => {
    const route = { view: 'atlas' as const, lang: 'en' as const, island: '椭圆&曲线', core: 'pm:EllipticCurve', lab: false };
    expect(parseRoute(encodeRoute(route))).toEqual(route);
  });
  it('rejects unknown views and never turns a string into a script', () => {
    expect(parseRoute('#view=javascript%3Aalert(1)&lang=bad')).toMatchObject({ view: 'islands', lang: 'zh' });
  });
});
describe('learner-owned journal', () => {
  it('recovers safely from malformed storage', () => {
    expect(parseJournal('broken')).toEqual({ version: 1, entries: {} });
    expect(parseJournal('{"version":2,"entries":{}}')).toEqual({ version: 1, entries: {} });
  });
  it('accepts valid notes without interpreting their contents and rejects inconsistent identities', () => {
    const good = { islandId: 'elliptic', coreId: 'pm:EllipticCurve', note: '<script>not executable</script>', observed: true, updatedAt: '2026-10-22T13:12:00Z' };
    const parsed = parseJournal(JSON.stringify({ version: 1, entries: { elliptic: good, forged: good } }));
    expect(parsed.entries.elliptic).toEqual(good);
    expect(parsed.entries.forged).toBeUndefined();
  });
  it('refuses partial imports and invalid timestamps without silently dropping data', () => {
    const good = { islandId: 'elliptic', coreId: 'pm:EllipticCurve', note: 'An observation', observed: true, updatedAt: '2026-10-22T13:12:00Z' };
    expect(() => importJournal(JSON.stringify({ version: 1, entries: { elliptic: good, forged: good } }))).toThrow();
    expect(() => importJournal(JSON.stringify({ version: 1, entries: { elliptic: { ...good, updatedAt: 'not a date' } } }))).toThrow();
    expect(() => importJournal('{"version":1,"entries":{"__proto__":{}}}')).toThrow();
    expect(() => importJournal(JSON.stringify({ version: 1, entries: { elliptic: { ...good, note: 'x'.repeat(20001) } } }))).toThrow();
  });
  it('merges backups without removing unrelated notes, preserving local records on equal or older timestamps', () => {
    const entry = { islandId: 'elliptic', coreId: 'pm:EllipticCurve', note: 'Local observation', observed: true, updatedAt: '2026-10-22T13:12:00Z' };
    const local = { version: 1 as const, entries: { elliptic: entry } };
    const equal = { version: 1 as const, entries: { elliptic: { ...entry, note: 'Different content, equal timestamp' } } };
    expect(mergeJournal(local, equal)).toEqual(local);
    const incoming = importJournal(JSON.stringify({ version: 1, entries: { elliptic: { ...entry, note: 'A later revision', updatedAt: '2026-10-22T13:13:00Z' }, future: { ...entry, islandId: 'future', note: 'A course not in this edition' } } }));
    const merged = mergeJournal(local, incoming);
    expect(merged.entries.elliptic.note).toBe('A later revision');
    expect(merged.entries.future.note).toBe('A course not in this edition');
    expect(local.entries.elliptic.note).toBe('Local observation');
    const unusual = importJournal(JSON.stringify({ version: 1, entries: { toString: { ...entry, islandId: 'toString' } } }));
    expect(Object.hasOwn(mergeJournal(local, unusual).entries, 'toString')).toBe(true);
  });
});
