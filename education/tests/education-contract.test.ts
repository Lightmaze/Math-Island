import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { assertAtlasBridges, assertAtlasEdges, assertAtlasIndex, decodeAtlasNodes } from '../src/data/atlas-types';
import type { AtlasBridges, AtlasEdges, AtlasIndex } from '../src/data/atlas-types';
import { islands } from '../src/data/islands';
import { journeys } from '../src/data/journeys';
import type { Localized } from '../src/data/islands';

const education = resolve(import.meta.dirname, '..');
const core = resolve(education, '..');
const read = (path: string) => readFileSync(path, 'utf8');
const digest = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
const index = JSON.parse(read(resolve(education, 'public/data/atlas-index.json'))) as AtlasIndex;
const edges = JSON.parse(read(resolve(education, 'public/data/atlas-edges.json'))) as AtlasEdges;
const manifest = JSON.parse(read(resolve(education, 'public/data/atlas-manifest.json')));
const bridges = JSON.parse(read(resolve(education, 'public/data/atlas-bridges.json'))) as AtlasBridges;
const corePaths = ['data/nodes.jsonl', 'data/edges.csv', 'reports/layout.json'];
// A newer core is allowed to coexist with an older education snapshot. These
// optional source-fidelity checks run only when the pinned source is available;
// the education payload's own checks below always run.
const matchingCoreSnapshot = corePaths.every(path => existsSync(resolve(core, path))
  && digest(resolve(core, path)) === index.provenance[path]);
const matchingBridgeSnapshot = Object.entries(bridges.provenance).every(([path, hash]) =>
  existsSync(resolve(core, path)) && digest(resolve(core, path)) === hash);
const coreNodes = matchingCoreSnapshot
  ? read(resolve(core, 'data/nodes.jsonl')).trim().split('\n').map(line => JSON.parse(line)) : [];

describe('read-only atlas bridge', () => {
  it('pins both source identities and every generated payload by SHA-256', () => {
    expect(manifest.coreCommit).toMatch(/^[a-f0-9]{40}$/);
    expect(manifest.outputs.map((output: { path: string }) => output.path).sort())
      .toEqual(['atlas-bridges.json', 'atlas-edges.json', 'atlas-index.json']);
    for (const relative of corePaths) {
      expect(index.provenance[relative]).toMatch(/^[a-f0-9]{64}$/);
      expect(edges.provenance[relative]).toBe(index.provenance[relative]);
      expect(manifest.sourceHashes[relative]).toBe(index.provenance[relative]);
    }
    for (const output of manifest.outputs) {
      expect(digest(resolve(education, 'public/data', output.path))).toBe(output.sha256);
    }
  });

  it.skipIf(!matchingCoreSnapshot)('preserves all real node identities, exact coordinates, titles, and source links when the pinned core snapshot is available', () => {
    assertAtlasIndex(index);
    const decoded = decodeAtlasNodes(index);
    const byId = new Map(decoded.map(node => [node.id, node]));
    expect(byId.size).toBe(coreNodes.length);
    expect(manifest.nodes).toBe(coreNodes.length);
    expect(manifest.readOnlyExport).toBe(true);
    expect(manifest.coordinatesCopiedExactly).toBe(true);
    const actual = coreNodes.map(source => {
      const node = byId.get(source.id)!;
      return [node.id, node.label, node.x, node.y, node.degree, node.kind, node.source,
        node.sourceUrl, node.domain.id, node.aliases, node.quality];
    });
    const expected = coreNodes.map(source => [source.id, source.label, source.x, source.y,
      source.degree, source.kind, source.source_id, source.source_url, source.domain_code,
      source.aliases ?? [], source.source_quality_findings ?? []]);
    expect(actual).toEqual(expected);
    expect(Object.keys(index.qualityFindings).length).toBe(coreNodes.filter(source => source.source_quality_findings?.length).length);
  });

  it.skipIf(!matchingCoreSnapshot)('preserves every field of every recorded edge when the pinned core snapshot is available', () => {
    const sourceDigest = execFileSync('python', ['-c', [
      'import csv,hashlib,json,sys',
      "fields=['id','source','target','relation','evidence_url','locator','status','mathematical_validity']",
      "with open(sys.argv[1],encoding='utf-8',newline='') as f: rows=[[r[k] for k in fields] for r in csv.DictReader(f)]",
      "print(hashlib.sha256(json.dumps(rows,ensure_ascii=False,separators=(',',':')).encode()).hexdigest())",
    ].join('\n'), resolve(core, 'data/edges.csv')], { encoding: 'utf8', timeout: 15000 }).trim();
    const decoded = edges.edges.map(edge => [edge[0], index.nodes[edge[1]][0], index.nodes[edge[2]][0],
      edges.relations[edge[3]], edges.evidenceUrls[edge[4]], edges.locators[edge[5]],
      edges.statuses[edge[6]], edges.validities[edge[7]]]);
    expect(createHash('sha256').update(JSON.stringify(decoded)).digest('hex')).toBe(sourceDigest);
  });

  it('uses the identical ordered identity list for node and edge indexing', () => {
    assertAtlasIndex(index);
    assertAtlasEdges(edges, index);
    const orderHash = createHash('sha256').update(index.nodes.map(node => node[0]).join('\n')).digest('hex');
    expect(index.nodeOrderSha256).toBe(orderHash);
    expect(edges.nodeOrderSha256).toBe(orderHash);
    expect(manifest.edges).toBe(edges.edges.length);
    expect(manifest.nodes).toBe(index.nodes.length);
    expect(manifest.domains).toBe(index.domains.length);
    index.domains.forEach((domain, domainIndex) => {
      expect(domain.count).toBe(index.nodes.filter(node => node[2] === domainIndex).length);
    });
    expect(new Set(edges.edges.map(edge => edge[0])).size).toBe(edges.edges.length);
    const counts: Record<string, number> = {};
    for (const edge of edges.edges) {
      const relation = edges.relations[edge[3]];
      counts[relation] = (counts[relation] ?? 0) + 1;
    }
    expect(counts).toEqual(manifest.relations);
  });
});

describe('malformed and mismatched educational atlas inputs', () => {
  const changedIndex = () => ({ ...index, nodes: index.nodes.map(node => [...node]) }) as AtlasIndex;
  const changedEdges = () => ({ ...edges, edges: edges.edges.slice(0, 3).map(edge => [...edge]) }) as AtlasEdges;

  it('rejects non-finite coordinates, negative degree, and non-string aliases', () => {
    const invalidCoordinate = changedIndex();
    invalidCoordinate.nodes[0][3] = Number.NaN;
    expect(() => assertAtlasIndex(invalidCoordinate)).toThrow();
    const invalidDegree = changedIndex();
    invalidDegree.nodes[0][5] = -1;
    expect(() => assertAtlasIndex(invalidDegree)).toThrow();
    const invalidAlias = changedIndex();
    invalidAlias.nodes[0][9] = [42 as unknown as string];
    expect(() => assertAtlasIndex(invalidAlias)).toThrow();
  });

  it('rejects duplicate IDs, reordered nodes, and non-integer dictionary indices', () => {
    const duplicate = changedIndex();
    duplicate.nodes[1][0] = duplicate.nodes[0][0];
    expect(() => assertAtlasIndex(duplicate)).toThrow();
    const reordered = changedIndex();
    [reordered.nodes[0], reordered.nodes[1]] = [reordered.nodes[1], reordered.nodes[0]];
    expect(() => assertAtlasIndex(reordered)).toThrow();
    const fraction = changedIndex();
    fraction.nodes[0][2] = 0.5;
    expect(() => assertAtlasIndex(fraction)).toThrow();
  });

  it('rejects an edge snapshot from a different node order or source revision', () => {
    expect(() => assertAtlasEdges({ ...edges, nodeOrderSha256: '0'.repeat(64) }, index)).toThrow();
    expect(() => assertAtlasEdges({ ...edges, provenance: { ...edges.provenance, 'data/nodes.jsonl': '0'.repeat(64) } }, index)).toThrow();
  });

  it('rejects duplicate edge IDs, self-links, and unresolved references', () => {
    const duplicate = changedEdges();
    duplicate.edges[1][0] = duplicate.edges[0][0];
    expect(() => assertAtlasEdges(duplicate, index)).toThrow();
    const selfLink = changedEdges();
    selfLink.edges[0][2] = selfLink.edges[0][1];
    expect(() => assertAtlasEdges(selfLink, index)).toThrow();
    const dangling = changedEdges();
    dangling.edges[0][1] = index.nodes.length;
    expect(() => assertAtlasEdges(dangling, index)).toThrow();
  });

  it('rejects malformed domain geometry and duplicate domain identities', () => {
    const invalidCenter = { ...index, domains: index.domains.map(domain => ({ ...domain })) };
    invalidCenter.domains[0].center = [Number.NaN, 0];
    expect(() => assertAtlasIndex(invalidCenter)).toThrow();
    const invalidRadius = { ...index, domains: index.domains.map(domain => ({ ...domain })) };
    invalidRadius.domains[0].radius = -1;
    expect(() => assertAtlasIndex(invalidRadius)).toThrow();
    const duplicate = { ...index, domains: index.domains.map(domain => ({ ...domain })) };
    duplicate.domains[1].id = duplicate.domains[0].id;
    expect(() => assertAtlasIndex(duplicate)).toThrow();
  });

  it('rejects invalid edge dictionaries and fractional edge indices', () => {
    const invalidDictionary = { ...edges, relations: [42 as unknown as string, ...edges.relations.slice(1)] };
    expect(() => assertAtlasEdges(invalidDictionary, index)).toThrow();
    const fractional = changedEdges();
    fractional.edges[0][3] = .5;
    expect(() => assertAtlasEdges(fractional, index)).toThrow();
  });
});

describe('authored curriculum and its pinned source references', () => {
  const nodes = new Map(decodeAtlasNodes(index).map(node => [node.id, node]));
  const lessonIds = new Set(islands.map(island => island.id));
  const localized = (field: Localized) => {
    expect(field.zh.trim().length).toBeGreaterThan(0);
    expect(field.en.trim().length).toBeGreaterThan(0);
  };

  it('provides distinct authored objects across all twelve teaching regions', () => {
    expect(islands.length).toBeGreaterThanOrEqual(24);
    expect(lessonIds.size).toBe(islands.length);
    expect(new Set(islands.map(island => island.labKey)).size).toBe(islands.length);
    expect(new Set(islands.map(island => island.domain)).size).toBeGreaterThanOrEqual(12);
    for (const island of islands) {
      expect(island.id).toMatch(/^[a-z][a-z0-9-]*$/);
      expect(island.coreId).not.toBe(island.id);
      expect(Number.isFinite(island.x) && Number.isFinite(island.y)).toBe(true);
      expect(island.x).toBeGreaterThanOrEqual(0);
      expect(island.x).toBeLessThanOrEqual(100);
      expect(island.y).toBeGreaterThanOrEqual(0);
      expect(island.y).toBeLessThanOrEqual(100);
    }
  });

  it('resolves every teaching reference and its source URL within the independent education snapshot', () => {
    for (const island of islands) {
      expect(island.coreRefs).toContain(island.coreId);
      expect(new Set(island.coreRefs).size).toBe(island.coreRefs.length);
      const urls = new Set<string>();
      for (const reference of island.coreRefs) {
        const node = nodes.get(reference);
        expect(node, `${island.id}: unresolved ${reference}`).toBeDefined();
        urls.add(node!.sourceUrl);
      }
      expect(island.sources.length).toBeGreaterThan(0);
      expect(island.sources.some(source => source.url === nodes.get(island.coreId)!.sourceUrl)).toBe(true);
      // A primary paper may be the evidence for an existing bridge rather than
      // a graph node in its own right (for example the Adiprasito–Huh–Katz paper).
      // Admit only recorded bridges whose two endpoints are explicit coreRefs.
      const referenceIds = new Set(island.coreRefs);
      for (const edge of edges.edges) {
        if (edges.relations[edge[3]] === 'literature_bridge'
          && referenceIds.has(index.nodes[edge[1]][0])
          && referenceIds.has(index.nodes[edge[2]][0])) urls.add(edges.evidenceUrls[edge[4]]);
      }
      for (const source of island.sources) {
        expect(source.title.trim()).not.toBe('');
        expect(new URL(source.url).protocol).toBe('https:');
        expect(urls.has(source.url), `${island.id}: source not supported by coreRefs or their recorded literature bridges`).toBe(true);
      }
    }
  });

  it('supplies bilingual object, ecology, actions, assumptions, counterexample and continuation', () => {
    for (const island of islands) {
      for (const key of ['title', 'subtitle', 'object', 'ecology', 'prerequisites', 'question', 'answer', 'boundary', 'continuation'] as const) localized(island[key]);
      expect(island.steps.length).toBeGreaterThanOrEqual(3);
      for (const step of island.steps) { localized(step.title); localized(step.body); }
    }
  });

  it('keeps editorial learning itineraries resolvable without creating core edges', () => {
    expect(new Set(journeys.map(journey => journey.id)).size).toBe(journeys.length);
    for (const journey of journeys) {
      localized(journey.title); localized(journey.description);
      expect(journey.islands.length).toBeGreaterThan(1);
      expect(new Set(journey.islands).size).toBe(journey.islands.length);
      for (const islandId of journey.islands) {
        expect(lessonIds.has(islandId), `${journey.id}: unresolved lesson ${islandId}`).toBe(true);
      }
    }
  });
});

describe('existing literature bridges remain attributable read-only projections', () => {
  const edgeById = new Map(edges.edges.map(edge => [edge[0], edge]));

  it('accepts the complete bridge payload with and without loaded edge data', () => {
    expect(() => assertAtlasBridges(bridges, index)).not.toThrow();
    expect(() => assertAtlasBridges(bridges, index, edges)).not.toThrow();
  });

  it('rejects duplicate bridge identities, missing coverage and miswired endpoints', () => {
    const duplicate = structuredClone(bridges);
    duplicate.records[1].id = duplicate.records[0].id;
    expect(() => assertAtlasBridges(duplicate, index, edges)).toThrow();
    const missing = structuredClone(bridges);
    missing.records.pop();
    expect(() => assertAtlasBridges(missing, index, edges)).toThrow();
    const fractional = structuredClone(bridges);
    fractional.records[0].sourceIndex += .5;
    expect(() => assertAtlasBridges(fractional, index)).toThrow();
    const mismatch = structuredClone(bridges);
    mismatch.records[0].sourceId = mismatch.records[0].targetId;
    expect(() => assertAtlasBridges(mismatch, index)).toThrow();
  });

  it('rejects a different node order, source snapshot or edge citation', () => {
    const order = structuredClone(bridges);
    order.nodeOrderSha256 = '0'.repeat(64);
    expect(() => assertAtlasBridges(order, index)).toThrow();
    const snapshot = structuredClone(bridges);
    snapshot.provenance['data/edges.csv'] = '0'.repeat(64);
    expect(() => assertAtlasBridges(snapshot, index)).toThrow();
    const citation = structuredClone(bridges);
    citation.records[0].text.en.sourceUrl = citation.records[0].text.zh.sourceUrl = 'https://example.org/wrong-paper';
    expect(() => assertAtlasBridges(citation, index, edges)).toThrow();
  });

  it('rejects missing mathematical conditions, missing languages and malformed reading attribution', () => {
    const conditions = structuredClone(bridges);
    conditions.records[0].text.en.conditions = '';
    expect(() => assertAtlasBridges(conditions, index)).toThrow();
    const language = structuredClone(bridges) as unknown as { records: Array<{ text: { en?: unknown } }> };
    delete language.records[0].text.en;
    expect(() => assertAtlasBridges(language, index)).toThrow();
    const attribution = structuredClone(bridges);
    attribution.records[0].sourceAudit.bridge_id = attribution.records[1].id;
    expect(() => assertAtlasBridges(attribution, index)).toThrow();
    const wrongLanguageReport = structuredClone(bridges);
    wrongLanguageReport.records[0].text.en.reportPath = 'reports/math-bridges.md';
    expect(() => assertAtlasBridges(wrongLanguageReport, index)).toThrow();
    const invalidAuditUrl = structuredClone(bridges);
    invalidAuditUrl.records[0].sourceAudit.url = 'not-a-source-url';
    expect(() => assertAtlasBridges(invalidAuditUrl, index)).toThrow();
  });

  it('retains exactly the existing literature edges, their directions and citations', () => {
    expect(bridges.nodeOrderSha256).toBe(index.nodeOrderSha256);
    expect(bridges.coreCommit).toBe(manifest.coreCommit);
    expect(manifest.bridgeGuides).toBe(bridges.records.length);
    const literatureEdges = edges.edges.filter(edge => edges.relations[edge[3]] === 'literature_bridge');
    expect(new Set(bridges.records.map(bridge => bridge.id)).size).toBe(literatureEdges.length);
    expect(bridges.records.map(bridge => bridge.edgeId).sort()).toEqual(literatureEdges.map(edge => edge[0]).sort());
    for (const [path, hash] of Object.entries(bridges.provenance)) {
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
      expect(manifest.sourceHashes[path]).toBe(hash);
    }
    for (const bridge of bridges.records) {
      const edge = edgeById.get(bridge.edgeId)!;
      expect(bridge.sourceIndex).toBe(edge[1]);
      expect(bridge.targetIndex).toBe(edge[2]);
      expect(bridge.sourceId).toBe(index.nodes[edge[1]][0]);
      expect(bridge.targetId).toBe(index.nodes[edge[2]][0]);
      expect(bridge.id).toBe(edges.locators[edge[5]]);
      expect(bridge.text.zh.sourceUrl).toBe(edges.evidenceUrls[edge[4]]);
      expect(bridge.text.en.sourceUrl).toBe(edges.evidenceUrls[edge[4]]);
      expect(bridge.sourceAudit.bridge_id).toBe(bridge.id);
    }
  });

  it.skipIf(!matchingBridgeSnapshot)('copies bridge IDs, endpoints, titles, statuses and full historical audit records exactly', () => {
    const csvRows = JSON.parse(execFileSync('python', ['-c',
      'import csv,json,sys\nwith open(sys.argv[1],encoding="utf-8",newline="") as f: print(json.dumps(list(csv.DictReader(f)),ensure_ascii=False))',
      resolve(core, 'data/bridges.csv')], { encoding: 'utf8', timeout: 15000 }));
    const records = bridges.records.map(bridge => ({ source: bridge.sourceId, target: bridge.targetId,
      bridge_id: bridge.id, label: bridge.text.zh.title, status: bridge.status }));
    expect(records).toEqual(csvRows);
    const audit = JSON.parse(read(resolve(core, 'reports/bridge-source-audit.json')));
    expect(bridges.sourceAuditScope).toBe(audit.scope);
    expect(bridges.records.map(bridge => bridge.sourceAudit)).toEqual(audit.sources);
  });

  it.skipIf(!matchingBridgeSnapshot)('preserves all forty-two bilingual report sections, including conditions and limitations', () => {
    for (const bridge of bridges.records) for (const language of ['zh', 'en'] as const) {
      const text = bridge.text[language];
      const raw = read(resolve(core, text.reportPath));
      const lines = raw.split('\n');
      expect(lines[text.reportLine - 1]).toBe(`## ${bridge.id} · ${text.title}`);
      const start = lines.slice(0, text.reportLine - 1).join('\n').length + (text.reportLine > 1 ? 1 : 0);
      const next = raw.indexOf('\n## ', start + 1);
      const section = raw.slice(start, next < 0 ? undefined : next + 1);
      expect(createHash('sha256').update(section).digest('hex')).toBe(text.reportSectionSha256);
      const paragraphs = section.split('\n\n').slice(1).map(paragraph => paragraph.trim()).filter(Boolean);
      const fields = ['endpoints', 'mechanism', 'conditions', 'conclusion', 'limitations'] as const;
      const prefixes = language === 'zh' ? ['端点：', '', '条件：', '结论：', '边界：']
        : ['Endpoints: ', '**Mechanism:** ', '**Conditions:** ', '**Conclusion:** ', '**Limitations:** '];
      expect(paragraphs.length).toBe(6);
      fields.forEach((field, position) => expect(paragraphs[position]).toBe(prefixes[position] + text[field]));
      expect(paragraphs[5]).toContain(`[${text.sourceTitle}](${text.sourceUrl})`);
      expect(paragraphs[5].endsWith(text.locator)).toBe(true);
      if (text.reportCommit !== null) expect(text.reportCommit).toMatch(/^[a-f0-9]{40}$/);
    }
  });
});
