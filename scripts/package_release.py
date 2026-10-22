#!/usr/bin/env python3
"""Package the bilingual atlas and selected source evidence, with verified hashes.

Run the data audit and both renders before packaging a changed dataset.
The historical Chinese v1 manifest is preserved separately; this command writes
the current bilingual release manifest and never overwrites the old v1 archive.
"""
import argparse
import datetime
import hashlib
import json
from pathlib import Path
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]


def sha(path):
    with path.open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()


def read_json(relative):
    return json.loads((ROOT / relative).read_text(encoding='utf-8'))


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def selected_files():
    """Explicit source allowlist; exclude exploratory archives and paper caches."""
    names = ['README.md', 'README.zh-CN.md', 'README.en.md', 'requirements.txt',
             '.gitignore', '.gitattributes', 'LICENSE.md', 'THIRD_PARTY_NOTICES.md']
    chosen = {ROOT / name for name in names}
    directories = ['scripts', 'spec', 'data', 'maps', 'reports', 'LICENSES',
                   'sources/planetmath', 'sources/stacks/tex', 'sources/wikipedia/bridges']
    for relative in directories:
        for path in (ROOT / relative).rglob('*'):
            if path.is_file() and '__pycache__' not in path.parts and path.suffix not in {'.pyc', '.log'}:
                chosen.add(path)
    for relative in [
        'source/planetmath/entries.jsonl', 'source/planetmath/excluded-entries.jsonl',
        'source/planetmath/records.jsonl', 'source/planetmath/manifest.json',
        'source/planetmath/repos.json', 'source/planetmath/LICENSE-CC-BY-SA-3.0.txt',
        'sources/stacks/entries.jsonl', 'sources/stacks/manifest.json',
        'sources/stacks/source.tar.gz', 'sources/wikipedia/wikipedia-bridge-nodes.json',
        'sources/wikipedia/wikipedia-bridge-edges.json',
        'sources/wikipedia/wikipedia-bridge-manifest.json', 'sources/wikipedia/README.txt',
    ]:
        chosen.add(ROOT / relative)
    excluded_reports = {ROOT / 'reports/release-manifest.json', ROOT / 'reports/release-archive.json'}
    chosen -= excluded_reports
    for path in chosen:
        require(path.is_file() and not path.is_symlink(), f'Missing or symbolic release file: {path}')
        require(path.stat().st_size < 100 * 1024 * 1024, f'File exceeds GitHub file limit: {path}')
    return sorted(chosen)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--version', default='1.0.0', help='Bilingual publication version')
    parser.add_argument('--output', type=Path, help='ZIP path; default: ../Mafh-Island-vVERSION.zip')
    args = parser.parse_args()
    require(bool(re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._-]*', args.version)), 'Invalid version')
    output = (args.output or ROOT.parent / f'Mafh-Island-v{args.version}.zip').resolve()
    require(not output.is_relative_to(ROOT), 'Write the archive outside the repository')
    require(output.name != 'MathCups-数学群岛-v1.zip', 'Preserve the original Chinese v1 archive')
    audit = read_json('reports/atlas-independent-audit.json')
    verify = read_json('reports/release-verification.json')
    require(audit['structural_pass'] and verify['status'] == 'passed', 'Data verification has not passed')
    require(verify['node_count'] == audit['node_count'] > 10000, 'Inconsistent node counts')
    for relative, expected in verify['hashes'].items():
        require(sha(ROOT / relative) == expected, f'Stale data verification: {relative}')
    require(audit['nodes_sha256'] == verify['hashes']['data/nodes.jsonl'], 'Stale independent node audit')
    require(audit['edges_sha256'] == verify['hashes']['data/edges.csv'], 'Stale independent edge audit')
    # Inspect actual SVG elements as well as manifest input identities.
    from render_atlas import verify_svg_content
    for relative, language in [('maps', 'zh'), ('maps/en', 'en')]:
        render = read_json(f'{relative}/render-manifest.json')
        require(render['nodes_sha256'] == verify['hashes']['data/nodes.jsonl'], f'Stale {language} nodes')
        require(render['edges_sha256'] == verify['hashes']['data/edges.csv'], f'Stale {language} edges')
        require(render['bridges']['input_sha256'] == verify['hashes']['data/bridges.csv'], f'Stale {language} bridges')
        actual = verify_svg_content(ROOT / relative, verify['node_count'], render['details'], render['bridges'])
        require(actual == render['svg_actual_counts'], f'SVG contents differ from {language} render manifest')
    chosen = selected_files()
    manifest = dict(
        version=f'mafh-island-{args.version}', atlas_data_version='math-atlas-v1',
        created_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
        languages=['zh-CN', 'en'], nodes=verify['node_count'], edges=verify['edge_count'],
        documented_bridges=21, frozen_data_hashes=verify['hashes'],
        source_unit='sourced mathematical knowledge entry; not an independent theory or verified proof',
        original_chinese_archive=dict(
            filename='MathCups-数学群岛-v1.zip',
            sha256='b12c27898fc2ca7560bf266497d9d3e864f90494901fc4f6cfcc41c226bbc9c0',
            manifest='reports/atlas-v1-original-manifest.json'),
        excluded=['unfiltered MathWorld/Wikipedia exploratory indexes',
                  '1.7GB PlanetMath repository archives', 'external bridge literature PDFs',
                  'any old sealed evaluation or test data', '.git and runtime caches'],
        files=[dict(path=str(path.relative_to(ROOT)), bytes=path.stat().st_size, sha256=sha(path))
               for path in chosen])
    manifest_path = ROOT / 'reports/release-manifest.json'
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    chosen.append(manifest_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = output.with_suffix('.zip.tmp')
    with zipfile.ZipFile(temporary, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
        for path in sorted(chosen):
            archive.write(path, 'Mafh-Island/' + str(path.relative_to(ROOT)))
    with zipfile.ZipFile(temporary) as archive:
        require(archive.testzip() is None, 'ZIP CRC failure')
        require(len(archive.infolist()) == len(chosen), 'ZIP entry count differs')
        for entry in manifest['files']:
            actual = hashlib.sha256(archive.read('Mafh-Island/' + entry['path'])).hexdigest()
            require(actual == entry['sha256'], f'ZIP member hash mismatch: {entry["path"]}')
        require(archive.read('Mafh-Island/reports/release-manifest.json') == manifest_path.read_bytes(),
                'ZIP manifest differs')
    temporary.replace(output)
    result = dict(filename=output.name, bytes=output.stat().st_size, sha256=sha(output),
                  file_count=len(chosen), all_zip_member_hashes_verified=True)
    (ROOT / 'reports/release-archive.json').write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8')
    checksum_file = output.with_suffix('.zip.sha256')
    checksum_file.write_text(f'{result["sha256"]}  {output.name}\n', encoding='utf-8')
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
