export type AtlasLanguage = 'zh' | 'en';

export interface AtlasDomain {
  id: string;
  zh: string;
  en: string;
  color: string;
  center: [number, number];
  radius: number;
  count: number;
  motif: string;
}

export interface SourceQualityFinding {
  finding_id?: string;
  finding?: string;
  correction_or_requirement?: string;
  severity?: string;
  source_url?: string;
  [key: string]: unknown;
}

export type AtlasNodeRow = [
  id: string, label: string, domainIndex: number, x: number, y: number,
  degree: number, kindIndex: number, sourceIndex: number, sourceUrl: string, aliases: string[],
];

export interface AtlasIndex {
  schemaVersion: 1;
  coreCommit: string | null;
  nodeOrderSha256: string;
  nodeColumns: string[];
  domains: AtlasDomain[];
  kinds: string[];
  sources: string[];
  nodes: AtlasNodeRow[];
  qualityFindings: Record<string, SourceQualityFinding[]>;
  provenance: Record<string, string>;
  coordinateSemantics: string;
  motifSemantics: string;
}

export interface AtlasNode {
  index: number;
  id: string;
  label: string;
  domain: AtlasDomain;
  x: number;
  y: number;
  degree: number;
  kind: string;
  source: string;
  sourceUrl: string;
  aliases: string[];
  quality: SourceQualityFinding[];
  searchText: string;
}

export type AtlasEdgeRow = [
  id: string, sourceIndex: number, targetIndex: number, relationIndex: number,
  evidenceUrlIndex: number, locatorIndex: number, statusIndex: number, validityIndex: number,
];

export interface AtlasEdges {
  schemaVersion: 1;
  nodeOrderSha256: string;
  edgeColumns: string[];
  relations: string[];
  evidenceUrls: string[];
  locators: string[];
  statuses: string[];
  validities: string[];
  edges: AtlasEdgeRow[];
  provenance: Record<string, string>;
}

export interface AtlasBridgeText {
  title: string;
  endpoints: string;
  mechanism: string;
  conditions: string;
  conclusion: string;
  limitations: string;
  sourceTitle: string;
  sourceUrl: string;
  locator: string;
  reportPath: string;
  reportLine: number;
  reportCommit: string | null;
  reportSectionSha256: string;
}

export interface AtlasBridgeSourceAudit {
  bridge_id: string;
  url: string;
  final_url: string;
  status: number;
  passage_reviewed: boolean;
  passage_read_scope: string;
  mathematical_review: string;
  formal_verification: boolean;
  source_type: string;
  sha256: string;
  [key: string]: unknown;
}

export interface AtlasBridge {
  id: string;
  sourceId: string;
  targetId: string;
  sourceIndex: number;
  targetIndex: number;
  edgeId: string;
  status: string;
  text: Record<AtlasLanguage, AtlasBridgeText>;
  sourceAudit: AtlasBridgeSourceAudit;
}

export interface AtlasBridges {
  schemaVersion: 1;
  coreCommit: string | null;
  nodeOrderSha256: string;
  records: AtlasBridge[];
  sourceAuditScope: string;
  provenance: Record<string, string>;
}

export interface AtlasEducationalSearch {
  islandCount: number;
  entries: Record<string, string[]>;
}

export function decodeAtlasNodes(index: AtlasIndex): AtlasNode[] {
  return index.nodes.map((row, i) => ({
    index: i, id: row[0], label: row[1], domain: index.domains[row[2]], x: row[3], y: row[4],
    degree: row[5], kind: index.kinds[row[6]], source: index.sources[row[7]], sourceUrl: row[8],
    aliases: row[9], quality: index.qualityFindings[row[0]] ?? [],
    searchText: `${row[0]} ${row[1]} ${row[9].join(' ')} ${index.domains[row[2]].zh} ${index.domains[row[2]].en}`.normalize('NFKC').toLocaleLowerCase(),
  }));
}

export function assertAtlasIndex(value: unknown): asserts value is AtlasIndex {
  const data = value as AtlasIndex;
  if (!data || data.schemaVersion !== 1 || !Array.isArray(data.nodes) || !Array.isArray(data.domains)
      || !Array.isArray(data.kinds) || !Array.isArray(data.sources) || !data.provenance
      || !data.qualityFindings || typeof data.qualityFindings !== 'object' || Array.isArray(data.qualityFindings)
      || typeof data.nodeOrderSha256 !== 'string' || !/^[a-f0-9]{64}$/.test(data.nodeOrderSha256)
      || !data.kinds.every(v => typeof v === 'string') || !data.sources.every(v => typeof v === 'string')) {
    throw new Error('Unsupported atlas index');
  }
  const domains = new Set<string>();
  for (const domain of data.domains) {
    if (!domain || typeof domain.id !== 'string' || !domain.id || domains.has(domain.id)
        || typeof domain.zh !== 'string' || typeof domain.en !== 'string' || typeof domain.motif !== 'string'
        || typeof domain.color !== 'string' || !/^#[a-fA-F0-9]{6}$/.test(domain.color)
        || !Array.isArray(domain.center) || domain.center.length !== 2 || !domain.center.every(Number.isFinite)
        || !Number.isFinite(domain.radius) || domain.radius <= 0
        || !Number.isInteger(domain.count) || domain.count < 0) throw new Error('Invalid atlas domain');
    domains.add(domain.id);
  }
  const seen = new Set<string>();
  let previousId = '';
  for (const node of data.nodes) {
    if (!Array.isArray(node) || node.length !== 10 || typeof node[0] !== 'string'
        || typeof node[1] !== 'string' || !Number.isFinite(node[3]) || !Number.isFinite(node[4])
        || !Number.isInteger(node[2]) || !Number.isInteger(node[6]) || !Number.isInteger(node[7])
        || !Number.isInteger(node[5]) || node[5] < 0
        || !data.domains[node[2]] || !data.kinds[node[6]] || !data.sources[node[7]]
        || typeof node[8] !== 'string' || !/^https?:\/\//.test(node[8])
        || !Array.isArray(node[9]) || !node[9].every(alias => typeof alias === 'string')
        || seen.has(node[0]) || node[0] <= previousId) throw new Error('Invalid atlas node or node order');
    seen.add(node[0]);
    previousId = node[0];
  }
}

export function assertAtlasEdges(value: unknown, index: AtlasIndex): asserts value is AtlasEdges {
  const data = value as AtlasEdges;
  if (!data || data.schemaVersion !== 1 || !Array.isArray(data.edges) || !Array.isArray(data.relations)
      || !data.provenance || data.provenance['data/nodes.jsonl'] !== index.provenance['data/nodes.jsonl']
      || data.provenance['data/edges.csv'] !== index.provenance['data/edges.csv']
      || data.nodeOrderSha256 !== index.nodeOrderSha256
      || !Array.isArray(data.evidenceUrls) || !Array.isArray(data.locators)
      || !Array.isArray(data.statuses) || !Array.isArray(data.validities)
      || ![data.relations, data.evidenceUrls, data.locators, data.statuses, data.validities]
        .every(values => values.every(value => typeof value === 'string'))) {
    throw new Error('Atlas edge snapshot differs from node snapshot');
  }
  const seen = new Set<string>();
  for (const edge of data.edges) {
    if (!Array.isArray(edge) || edge.length !== 8 || !index.nodes[edge[1]] || !index.nodes[edge[2]]
        || typeof edge[0] !== 'string' || !edge[0] || seen.has(edge[0]) || edge[1] === edge[2]
        || !edge.slice(1).every(n => typeof n === 'number' && Number.isInteger(n) && n >= 0)
        || !data.relations[edge[3]] || data.evidenceUrls[edge[4]] === undefined
        || data.locators[edge[5]] === undefined || data.statuses[edge[6]] === undefined
        || data.validities[edge[7]] === undefined) throw new Error('Invalid atlas edge');
    seen.add(edge[0]);
  }
}

export function assertAtlasBridges(value: unknown, index: AtlasIndex, graph?: AtlasEdges): asserts value is AtlasBridges {
  const data = value as AtlasBridges;
  const sourcePaths = ['data/nodes.jsonl', 'data/edges.csv', 'data/bridges.csv',
    'reports/math-bridges.md', 'reports/math-bridges.en.md', 'reports/bridge-source-audit.json'];
  if (!data || data.schemaVersion !== 1 || !Array.isArray(data.records) || !data.provenance
      || typeof data.sourceAuditScope !== 'string' || data.nodeOrderSha256 !== index.nodeOrderSha256
      || data.provenance['data/nodes.jsonl'] !== index.provenance['data/nodes.jsonl']
      || data.provenance['data/edges.csv'] !== index.provenance['data/edges.csv']
      || !sourcePaths.every(path => /^[a-f0-9]{64}$/.test(data.provenance[path] ?? ''))) {
    throw new Error('Bridge guides differ from the atlas snapshot');
  }
  const edgeById = graph ? new Map(graph.edges.map(edge => [edge[0], edge])) : null;
  const seen = new Set<string>(), seenEdges = new Set<string>();
  for (const bridge of data.records) {
    if (!bridge || typeof bridge.id !== 'string' || !bridge.id || seen.has(bridge.id)
        || typeof bridge.edgeId !== 'string' || !bridge.edgeId || seenEdges.has(bridge.edgeId)
        || !Number.isInteger(bridge.sourceIndex) || !Number.isInteger(bridge.targetIndex)
        || bridge.sourceIndex < 0 || bridge.targetIndex < 0 || bridge.sourceIndex === bridge.targetIndex
        || index.nodes[bridge.sourceIndex]?.[0] !== bridge.sourceId || index.nodes[bridge.targetIndex]?.[0] !== bridge.targetId
        || typeof bridge.status !== 'string' || !bridge.status || !bridge.text) throw new Error('Invalid bridge identity or endpoints');
    seen.add(bridge.id); seenEdges.add(bridge.edgeId);
    for (const language of ['zh', 'en'] as const) {
      const text = bridge.text[language];
      if (!text || !['title', 'endpoints', 'mechanism', 'conditions', 'conclusion', 'limitations', 'sourceTitle', 'locator']
        .every(key => typeof text[key as keyof AtlasBridgeText] === 'string' && text[key as keyof AtlasBridgeText])
          || typeof text.sourceUrl !== 'string' || !/^https?:\/\//.test(text.sourceUrl)
          || text.reportPath !== (language === 'zh' ? 'reports/math-bridges.md' : 'reports/math-bridges.en.md')
          || !Number.isInteger(text.reportLine) || text.reportLine < 1
          || !(text.reportCommit === null || typeof text.reportCommit === 'string' && /^[a-f0-9]{40}$/.test(text.reportCommit))
          || typeof text.reportSectionSha256 !== 'string' || !/^[a-f0-9]{64}$/.test(text.reportSectionSha256)) {
        throw new Error('Invalid bridge guide text or report provenance');
      }
    }
    if (bridge.text.zh.sourceUrl !== bridge.text.en.sourceUrl) throw new Error('Bridge citations disagree across languages');
    const audit = bridge.sourceAudit;
    if (!audit || audit.bridge_id !== bridge.id || typeof audit.passage_reviewed !== 'boolean'
        || typeof audit.formal_verification !== 'boolean' || !Number.isInteger(audit.status)
        || !['url', 'final_url', 'passage_read_scope', 'mathematical_review', 'source_type', 'sha256']
          .every(key => typeof audit[key] === 'string') || !/^[a-f0-9]{64}$/.test(audit.sha256)
        || !/^https?:\/\//.test(audit.url) || !/^https?:\/\//.test(audit.final_url)) {
      throw new Error('Invalid bridge source-reading record');
    }
    if (graph && edgeById) {
      const edge = edgeById.get(bridge.edgeId);
      if (!edge || edge[1] !== bridge.sourceIndex || edge[2] !== bridge.targetIndex
          || graph.relations[edge[3]] !== 'literature_bridge' || graph.locators[edge[5]] !== bridge.id
          || graph.evidenceUrls[edge[4]] !== bridge.text.en.sourceUrl) throw new Error('Bridge guide disagrees with its recorded edge');
    }
  }
  if (graph && data.records.length !== graph.edges.filter(edge => graph.relations[edge[3]] === 'literature_bridge').length) {
    throw new Error('Bridge guide coverage differs from recorded literature bridges');
  }
}
