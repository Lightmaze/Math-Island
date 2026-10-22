#!/usr/bin/env python3
"""Export a read-only browser view of the mathematical atlas.

Only education/public/data is written. Source coordinates, source identities,
edge IDs, relation types, and evidence locators are copied without inference.
"""
from collections import Counter
import csv
import hashlib
import json
from pathlib import Path
import re
import subprocess

EDUCATION = Path(__file__).resolve().parents[1]
ROOT = EDUCATION.parent
OUT = EDUCATION / 'public/data'

DOMAIN_METADATA = {
    'algebraic-geometry': ('Algebraic geometry', '#427e80', 'polynomial'),
    'commutative-algebra': ('Commutative algebra', '#bd8052', 'ideal'),
    'homological-category': ('Categories & homology', '#5c8c75', 'diagram'),
    'algebra': ('Algebra & structures', '#8a78a0', 'symmetry'),
    'geometry-topology': ('Geometry & topology', '#ae6e75', 'torus'),
    'analysis': ('Analysis & differential equations', '#a38d47', 'wave'),
    'number-theory': ('Number theory & arithmetic', '#41929a', 'prime'),
    'logic-foundations': ('Logic & foundations', '#94775d', 'logic'),
    'discrete-computation': ('Discrete mathematics & computation', '#6b7fa6', 'graph'),
    'probability-statistics': ('Probability & statistics', '#b18498', 'distribution'),
    'mathematical-physics-applications': ('Mathematical physics & applications', '#839354', 'field'),
    'numerics-optimization': ('Numerical methods & optimization', '#b6a061', 'contour'),
}


def digest(path):
    with path.open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()


def write_json(name, value):
    path = OUT / name
    path.write_text(json.dumps(value, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
    return {'path': name, 'bytes': path.stat().st_size, 'sha256': digest(path)}


def report_revision(path):
    """Link to a commit only when it contains exactly the report being exported."""
    relative = str(path.relative_to(ROOT))
    try:
        revision = subprocess.check_output(['git', 'log', '-1', '--format=%H', '--', relative],
                                           cwd=ROOT, text=True).strip()
        committed = subprocess.check_output(['git', 'show', f'{revision}:{relative}'], cwd=ROOT)
        return revision if committed == path.read_bytes() else None
    except (OSError, subprocess.CalledProcessError):
        return None


def read_bridge_report(path, language):
    """Parse the existing six-paragraph guide format without rewriting its text."""
    raw = path.read_text(encoding='utf-8')
    revision = report_revision(path)
    result = {}
    pattern = re.compile(r'^## (bridge:\d+) · ([^\n]+)\n(?P<body>.*?)(?=^## |\Z)', re.M | re.S)
    prefixes = ({'endpoints': '端点：', 'mechanism': '', 'conditions': '条件：',
                 'conclusion': '结论：', 'limitations': '边界：'} if language == 'zh' else
                {'endpoints': 'Endpoints: ', 'mechanism': '**Mechanism:** ', 'conditions': '**Conditions:** ',
                 'conclusion': '**Conclusion:** ', 'limitations': '**Limitations:** '})
    source_pattern = (r'^来源：\[(.+)\]\((https?://[^\n]+)\)；定位：(.*)$' if language == 'zh' else
                      r'^\*\*Source:\*\* \[(.+)\]\((https?://[^\n]+)\)\. \*\*Locator:\*\* (.*)$')
    for section in pattern.finditer(raw):
        identifier, title = section.group(1), section.group(2)
        assert identifier not in result, f'Duplicate bridge section: {identifier} in {path}'
        paragraphs = section.group('body').strip().split('\n\n')
        assert len(paragraphs) == 6, f'Unexpected guide format: {identifier} in {path}'
        text = {'title': title}
        for paragraph, (field, prefix) in zip(paragraphs[:5], prefixes.items()):
            assert paragraph.startswith(prefix), f'Missing {field}: {identifier} in {path}'
            text[field] = paragraph[len(prefix):]
            assert text[field], f'Empty {field}: {identifier} in {path}'
        source = re.fullmatch(source_pattern, paragraphs[5])
        assert source, f'Unexpected source format: {identifier} in {path}'
        text.update(sourceTitle=source.group(1), sourceUrl=source.group(2), locator=source.group(3),
                    reportPath=str(path.relative_to(ROOT)), reportLine=raw[:section.start()].count('\n') + 1,
                    reportCommit=revision,
                    reportSectionSha256=hashlib.sha256(section.group(0).encode('utf-8')).hexdigest())
        result[identifier] = text
    assert result, f'No bridge sections in {path}'
    return result


def build_bridge_guides(node_indices, edges, core_commit, node_order_sha256, provenance):
    with (ROOT / 'data/bridges.csv').open(encoding='utf-8', newline='') as stream:
        bridge_rows = list(csv.DictReader(stream))
    text = {language: read_bridge_report(ROOT / relative, language) for language, relative in
            [('zh', 'reports/math-bridges.md'), ('en', 'reports/math-bridges.en.md')]}
    audit = json.loads((ROOT / 'reports/bridge-source-audit.json').read_text(encoding='utf-8'))
    by_audit_id = {record['bridge_id']: record for record in audit['sources']}
    by_bridge_id = {edge['locator']: edge for edge in edges if edge['relation'] == 'literature_bridge'}
    ids = {row['bridge_id'] for row in bridge_rows}
    assert len(ids) == len(bridge_rows), 'Duplicate bridge IDs'
    assert ids == set(text['zh']) == set(text['en']) == set(by_audit_id) == set(by_bridge_id), 'Bridge sources disagree'
    assert len(by_audit_id) == len(audit['sources']), 'Duplicate bridge audit records'
    assert len(by_bridge_id) == sum(edge['relation'] == 'literature_bridge' for edge in edges)
    records = []
    for row in bridge_rows:
        identifier = row['bridge_id']
        edge = by_bridge_id[identifier]
        assert row['source'] == edge['source'] and row['target'] == edge['target'], f'Bridge endpoints disagree: {identifier}'
        assert row['label'] == text['zh'][identifier]['title'], f'Bridge title differs: {identifier}'
        assert text['zh'][identifier]['sourceUrl'] == text['en'][identifier]['sourceUrl'] == edge['evidence_url'], f'Bridge citation differs: {identifier}'
        records.append(dict(id=identifier, sourceId=row['source'], targetId=row['target'],
                            sourceIndex=node_indices[row['source']], targetIndex=node_indices[row['target']],
                            edgeId=edge['id'], status=row['status'],
                            text={language: text[language][identifier] for language in ('zh', 'en')},
                            sourceAudit=by_audit_id[identifier]))
    return dict(schemaVersion=1, coreCommit=core_commit, nodeOrderSha256=node_order_sha256,
                records=records, sourceAuditScope=audit['scope'], provenance=provenance)


def main():
    nodes_path, edges_path = ROOT / 'data/nodes.jsonl', ROOT / 'data/edges.csv'
    layout_path = ROOT / 'reports/layout.json'
    source_paths = (nodes_path, edges_path, layout_path, ROOT / 'data/bridges.csv',
                    ROOT / 'reports/math-bridges.md', ROOT / 'reports/math-bridges.en.md',
                    ROOT / 'reports/bridge-source-audit.json')
    before = {str(p.relative_to(ROOT)): digest(p) for p in source_paths}
    atlas_provenance = {str(p.relative_to(ROOT)): before[str(p.relative_to(ROOT))]
                        for p in (nodes_path, edges_path, layout_path)}
    nodes = sorted((json.loads(line) for line in nodes_path.open(encoding='utf-8') if line.strip()),
                   key=lambda node: node['id'])
    with edges_path.open(encoding='utf-8', newline='') as stream:
        edges = list(csv.DictReader(stream))
    try:
        core_commit = subprocess.check_output(
            ['git', 'log', '-1', '--format=%H', '--', 'data/nodes.jsonl'], cwd=ROOT, text=True
        ).strip() or None
    except (OSError, subprocess.CalledProcessError):
        core_commit = None
    domain_counts = Counter(node['domain_code'] for node in nodes)
    regions = {r['domain']: r for r in json.loads(layout_path.read_text())['regions']}
    domains = []
    for code, count in domain_counts.most_common():
        sample = next(n for n in nodes if n['domain_code'] == code)
        label = sample['domain']
        english, color, motif = DOMAIN_METADATA.get(code, (label, '#648a80', 'graph'))
        region = regions[label]
        domains.append(dict(id=code, zh=label, en=english, color=color, motif=motif,
                            center=region['center'], radius=region['radius'], count=count))
    domain_index = {d['id']: i for i, d in enumerate(domains)}
    kinds = sorted({node['kind'] for node in nodes})
    sources = sorted({node['source_id'] for node in nodes})
    kind_index, source_index = ({v: i for i, v in enumerate(values)} for values in (kinds, sources))
    node_indices = {node['id']: i for i, node in enumerate(nodes)}
    assert len(node_indices) == len(nodes), 'Duplicate core node identifiers'
    assert all(e['source'] in node_indices and e['target'] in node_indices for e in edges)
    quality = {node['id']: node['source_quality_findings'] for node in nodes if node.get('source_quality_findings')}
    node_rows = [[node['id'], node['label'], domain_index[node['domain_code']], node['x'], node['y'],
                  node['degree'], kind_index[node['kind']], source_index[node['source_id']],
                  node['source_url'], node.get('aliases', [])] for node in nodes]
    node_order_sha256 = hashlib.sha256('\n'.join(node_indices).encode()).hexdigest()
    index = dict(schemaVersion=1, coreCommit=core_commit, nodeOrderSha256=node_order_sha256,
                 nodeColumns=['id', 'label', 'domainIndex', 'x', 'y', 'degree', 'kindIndex',
                              'sourceIndex', 'sourceUrl', 'aliases'],
                 domains=domains, kinds=kinds, sources=sources, nodes=node_rows,
                 qualityFindings=quality, provenance=atlas_provenance,
                 coordinateSemantics='Unmodified core layout coordinates; not mathematical distance or difficulty.',
                 motifSemantics='Representative mathematical objects illustrate domain labels; motifs are not additional nodes or edges.')
    relations = sorted({edge['relation'] for edge in edges})
    evidence_urls = sorted({edge['evidence_url'] for edge in edges})
    locators = sorted({edge['locator'] for edge in edges})
    statuses = sorted({edge['status'] for edge in edges})
    validities = sorted({edge['mathematical_validity'] for edge in edges})
    dictionaries = [relations, evidence_urls, locators, statuses, validities]
    dictionary_indexes = [{value: i for i, value in enumerate(values)} for values in dictionaries]
    relation_index, evidence_index, locator_index, status_index, validity_index = dictionary_indexes
    edge_rows = [[edge['id'], node_indices[edge['source']], node_indices[edge['target']],
                  relation_index[edge['relation']], evidence_index[edge['evidence_url']],
                  locator_index[edge['locator']], status_index[edge['status']],
                  validity_index[edge['mathematical_validity']]] for edge in edges]
    graph = dict(schemaVersion=1, nodeOrderSha256=node_order_sha256,
                 edgeColumns=['id', 'sourceIndex', 'targetIndex', 'relationIndex', 'evidenceUrlIndex',
                              'locatorIndex', 'statusIndex', 'validityIndex'],
                 relations=relations, evidenceUrls=evidence_urls, locators=locators,
                 statuses=statuses, validities=validities, edges=edge_rows, provenance=atlas_provenance)
    bridge_guides = build_bridge_guides(node_indices, edges, core_commit, node_order_sha256, before)
    OUT.mkdir(parents=True, exist_ok=True)
    outputs = [write_json('atlas-index.json', index), write_json('atlas-edges.json', graph),
               write_json('atlas-bridges.json', bridge_guides)]
    after = {str(p.relative_to(ROOT)): digest(p) for p in source_paths}
    assert before == after, 'Core inputs changed during export'
    manifest = dict(schemaVersion=1, coreCommit=core_commit, nodes=len(nodes), edges=len(edges),
                    domains=len(domains), sourceQualityFlaggedNodes=len(quality), bridgeGuides=len(bridge_guides['records']),
                    relations=dict(Counter(edge['relation'] for edge in edges)),
                    sourceHashes=before, outputs=outputs,
                    readOnlyExport=True, coordinatesCopiedExactly=True,
                    mathematicalClassification='Source content types; not formal MathCups tool typing.',
                    licenses={'planetmath': 'CC-BY-SA-3.0', 'stacks': 'GFDL-1.2-or-later',
                              'wikipedia': 'CC-BY-SA-4.0'},
                    attribution='Core per-entry metadata and source license notices remain authoritative. The educational index is a derived view.')
    write_json('atlas-manifest.json', manifest)
    print(json.dumps(manifest, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
