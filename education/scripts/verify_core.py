#!/usr/bin/env python3
"""Audit that this education delivery has not changed the pinned core atlas.

This is a read-only check. It never restores files or updates the baseline.
It is an explicit delivery audit, not a permanent core-development gate. Future
core revisions can coexist with the education module's older source snapshot.
Importing a newer education snapshot requires an explicit reference migration;
the exporter must not silently rewrite this historical audit baseline.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]


def file_digests(path: Path) -> tuple[str, str]:
    """Return content SHA-256 and Git blob SHA-1 without loading a large file."""
    size = path.stat().st_size
    sha256 = hashlib.sha256()
    git_blob = hashlib.sha1(f"blob {size}\0".encode())
    with path.open("rb") as stream:
        while chunk := stream.read(1024 * 1024):
            sha256.update(chunk)
            git_blob.update(chunk)
    return sha256.hexdigest(), git_blob.hexdigest()


def inspect_core(root: Path, baseline_path: Path, require_git: bool = False) -> dict:
    root = root.resolve()
    raw_baseline = baseline_path.read_bytes()
    baseline = json.loads(raw_baseline)
    files = baseline.get("files")
    commit = baseline.get("baseline_commit", "")
    if not isinstance(files, dict) or not files:
        raise ValueError("Baseline must contain a non-empty files dictionary")
    if not isinstance(commit, str) or not re.fullmatch(r"[0-9a-f]{40}", commit):
        raise ValueError("Baseline must name an explicit 40-character Git commit")
    errors: list[dict] = []
    for name, expected in files.items():
        relative = Path(name)
        if (not isinstance(name, str) or not relative.parts or relative.is_absolute() or ".." in relative.parts
                or not isinstance(expected, str) or not re.fullmatch(r"[0-9a-f]{64}", expected)):
            raise ValueError(f"Invalid baseline entry: {name!r}")
        if relative.parts[0] == "education":
            raise ValueError("The core baseline must not include the education module itself")

    # Resolve the historical Git tree, not HEAD: education commits may advance HEAD.
    git_tree: dict[str, str] | None = None
    try:
        git_result = subprocess.run(
            ["git", "ls-tree", "-r", "-z", "--full-tree", commit], cwd=root,
            capture_output=True, check=False,
        )
    except FileNotFoundError:
        git_result = subprocess.CompletedProcess(args=["git"], returncode=127, stdout=b"")
    if git_result.returncode == 0:
        git_tree = {}
        for record in git_result.stdout.split(b"\0"):
            if not record:
                continue
            metadata, path = record.split(b"\t", 1)
            _mode, kind, object_id = metadata.decode("ascii").split()
            name = path.decode("utf-8")
            if name.startswith("education/"):
                continue
            if kind != "blob":
                errors.append({"path": name, "reason": "baseline_git_object_is_not_a_blob"})
            else:
                git_tree[name] = object_id
        if set(git_tree) != set(files):
            errors.append({
                "reason": "baseline_manifest_does_not_match_commit_file_set",
                "missing_from_manifest": sorted(set(git_tree) - set(files)),
                "absent_from_commit": sorted(set(files) - set(git_tree)),
            })
    elif require_git or (root / ".git").exists():
        errors.append({"reason": "pinned_git_tree_unavailable", "commit": commit})

    checked = 0
    for name, expected in files.items():
        path = root / name
        if path.is_symlink() or not path.resolve().is_relative_to(root):
            errors.append({"path": name, "reason": "symbolic_link_or_path_escape"})
            continue
        if not path.is_file():
            errors.append({"path": name, "reason": "missing_core_file"})
            continue
        actual, git_blob = file_digests(path)
        checked += 1
        if actual != expected:
            errors.append({"path": name, "reason": "sha256_changed",
                           "expected": expected, "actual": actual})
        if git_tree is not None and name in git_tree and git_blob != git_tree[name]:
            errors.append({"path": name, "reason": "differs_from_pinned_git_blob"})

    return {
        "status": "passed" if not errors else "failed",
        "baseline_commit": commit,
        "baseline_sha256": hashlib.sha256(raw_baseline).hexdigest(),
        "baseline_file_count": len(files),
        "files_checked": checked,
        "git_tree_checked": git_tree is not None,
        "errors": errors,
        "scope": "All pinned core file bytes; no core file was written or repaired.",
        "future_core_changes": "This delivery audit is not a permanent core gate. Education may retain its pinned snapshot while core evolves; importing a new education snapshot requires an explicit reference migration.",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT, help="Repository root")
    parser.add_argument("--baseline", type=Path, help="Baseline JSON; defaults to education/docs/core-baseline.json")
    parser.add_argument("--require-git", action="store_true", help="Require the pinned Git tree even in a source ZIP")
    args = parser.parse_args()
    baseline = args.baseline or args.root / "education/docs/core-baseline.json"
    try:
        report = inspect_core(args.root, baseline, args.require_git)
    except (OSError, ValueError, json.JSONDecodeError) as error:
        report = {"status": "failed", "errors": [{"reason": "invalid_or_unreadable_baseline", "detail": str(error)}]}
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if report["status"] == "passed" else 1


if __name__ == "__main__":
    sys.exit(main())
