#!/usr/bin/env python3
"""Render a sourced mathematical atlas without fabricating nodes or coordinates.

Input: JSONL nodes with id,label,domain,x,y,source_url; CSV edges with
source,target,relation. All source nodes are drawn. Edge selection is disclosed.
No frontend, network call, or inferred mathematical relation is generated here.
"""
from __future__ import annotations

import argparse
import collections
import csv
import hashlib
import json
import math
from pathlib import Path
import textwrap
import xml.etree.ElementTree as ET

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.backends.backend_pdf import PdfPages
from matplotlib.collections import LineCollection
from matplotlib.patches import FancyArrowPatch
from matplotlib.patches import Polygon
from matplotlib.transforms import Bbox
import numpy as np
from scipy.spatial import ConvexHull, QhullError

ROOT = Path(__file__).resolve().parents[1]
BG = "#f7f6ed"
INK = "#173b49"
MUTED = "#627a7e"
GRID = "#cad7d5"
COLORS = ["#256f86", "#d17443", "#40896a", "#8878a5", "#ae5760",
          "#a18a37", "#3a99a5", "#8b674b", "#6371ab", "#b67d9d",
          "#6e8c3c", "#bc9b63", "#485b76", "#b34e37", "#537854",
          "#7e6290", "#288b83", "#a5754b", "#768095", "#bb7781"]
NAMES = {
    "algebra": "代数", "geometry": "几何", "topology": "拓扑",
    "analysis": "分析", "number_theory": "数论", "number theory": "数论",
    "probability": "概率", "statistics": "统计", "combinatorics": "组合",
    "logic": "逻辑与基础", "foundations": "基础", "computation": "计算",
    "computer_science": "计算机科学", "optimization": "优化",
    "applied": "应用数学", "applied_mathematics": "应用数学",
    "discrete": "离散数学", "general": "交叉与通论", "unclassified": "待分类",
    "algebra_geometry": "代数几何", "differential_equations": "微分方程",
    "linear_algebra": "线性代数", "set_theory": "集合论",
    "mathematical_physics": "数学物理", "numerical_analysis": "数值分析",
}
LANGUAGE = "zh"
ENGLISH_DOMAINS = {
    "代数几何": "Algebraic geometry",
    "交换代数": "Commutative algebra",
    "范畴与同调": "Categories & homology",
    "代数与结构": "Algebra & structures",
    "几何与拓扑": "Geometry & topology",
    "分析与微分方程": "Analysis & differential equations",
    "数论与算术": "Number theory & arithmetic",
    "逻辑与基础": "Logic & foundations",
    "离散与计算": "Discrete mathematics & computation",
    "概率与统计": "Probability & statistics",
    "数学物理与应用": "Mathematical physics & applications",
    "数值与优化": "Numerical methods & optimization",
}
ENGLISH_BRIDGES = {
    "bridge:001": "Elliptic curves → modular forms",
    "bridge:002": "Modular forms → sphere packing in 8D",
    "bridge:003": "Hodge theory → log-concavity for matroids",
    "bridge:004": "Local lemma → resampling algorithms",
    "bridge:005": "Dense combinatorics → prime progressions",
    "bridge:006": "Optimal transport → synthetic Ricci curvature",
    "bridge:007": "Expander graphs → error-correcting codes",
    "bridge:008": "Model-theoretic stability → graph regularity",
    "bridge:009": "Intuitionistic logic ↔ typed λ-calculus",
    "bridge:010": "Dependent types ↔ homotopy structure",
    "bridge:011": "Operator algebras → knot invariants",
    "bridge:012": "Covering spaces ↔ fundamental-group subgroups",
    "bridge:013": "Radical ideals ↔ affine algebraic sets",
    "bridge:014": "Curvature integrals → Euler characteristic",
    "bridge:015": "Brownian paths → parabolic PDEs",
    "bridge:016": "Sparse geometry → convex recovery",
    "bridge:017": "Concentration → Euclidean dimension reduction",
    "bridge:018": "Topological zero principles → polynomial partitioning",
    "bridge:019": "Semidefinite optimization → zero-error capacity bounds",
    "bridge:020": "Finite-field interpolation → Reed–Solomon codes",
    "bridge:021": "Polynomial root bounds → interactive proofs",
}


def localized(chinese, english):
    return english if LANGUAGE == "en" else chinese


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def file_reference(path: Path) -> str:
    try:
        return str(path.relative_to(ROOT))
    except ValueError:
        return str(path)


def choose_fonts():
    cjk = Path("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc")
    if cjk.exists():
        font_manager.fontManager.addfont(str(cjk))
        family = font_manager.FontProperties(fname=str(cjk)).get_name()
    else:
        family = "DejaVu Sans"
    plt.rcParams.update({"font.family": [family, "DejaVu Sans"],
                         "axes.unicode_minus": False,
                         "svg.fonttype": "none", "pdf.fonttype": 42,
                         "svg.hashsalt": "math-atlas-v1",
                         "text.parse_math": False,
                         "figure.facecolor": BG, "axes.facecolor": BG,
                         "savefig.facecolor": BG})
    return str(cjk) if cjk.exists() else family


def load_data(nodepath, edgepath):
    nodes = [json.loads(line) for line in nodepath.read_text().splitlines() if line.strip()]
    ids = [str(n["id"]) for n in nodes]
    if len(ids) != len(set(ids)):
        raise ValueError("Duplicate node IDs: renderer refuses to inflate count")
    index = {ident: i for i, ident in enumerate(ids)}
    xy = np.asarray([[n["x"], n["y"]] for n in nodes], dtype=float)
    if len(nodes) == 0 or not np.isfinite(xy).all():
        raise ValueError("Nonempty, finite source coordinates required")
    domains = [str(n.get("domain", "unclassified")) for n in nodes]
    with edgepath.open(newline="") as f:
        rows = list(csv.DictReader(f))
    bad = [(e.get("source"), e.get("target")) for e in rows
           if str(e.get("source")) not in index or str(e.get("target")) not in index]
    if bad:
        raise ValueError(f"{len(bad)} edges have unknown endpoints")
    edges = [(index[str(e["source"])], index[str(e["target"])],
              e.get("relation", "reference")) for e in rows]
    degree = np.zeros(len(nodes), dtype=int)
    for i, j, _ in edges:
        degree[i] += 1
        degree[j] += 1
    return nodes, xy, domains, edges, degree


def domain_title(domain):
    if LANGUAGE == "en":
        return ENGLISH_DOMAINS.get(domain, domain.replace("_", " "))
    return NAMES.get(domain, domain.replace("_", " "))


def priority_edges(edges, degree, limit):
    # Deterministic, data-derived priority. Edges incident to highly connected
    # nodes are visually navigational; this is not mathematical importance.
    return sorted(range(len(edges)), key=lambda k: (
        -(degree[edges[k][0]] + degree[edges[k][1]]), edges[k][0], edges[k][1], edges[k][2]))[:limit]


def set_extent(ax, xy, pad=0.05):
    mins, maxs = xy.min(0), xy.max(0)
    span = np.maximum(maxs - mins, 1e-6)
    ax.set_xlim(mins[0] - pad*span[0], maxs[0] + pad*span[0])
    ax.set_ylim(mins[1] - pad*span[1], maxs[1] + pad*span[1])
    ax.set_aspect("equal", adjustable="box")
    return mins, maxs


def reference_grid(ax, xy):
    mins, maxs = xy.min(0), xy.max(0)
    for axis in range(2):
        vals = np.linspace(mins[axis], maxs[axis], 7)
        for v in vals[1:-1]:
            if axis == 0:
                ax.axvline(v, color=GRID, linewidth=.45, alpha=.65, zorder=0)
            else:
                ax.axhline(v, color=GRID, linewidth=.45, alpha=.65, zorder=0)
    ax.set_xticks([])
    ax.set_yticks([])
    for spine in ax.spines.values():
        spine.set_visible(False)


def grid_reference(xy, point, n=6, bounds=None):
    mins, maxs = bounds if bounds is not None else (xy.min(0), xy.max(0))
    span = np.maximum(maxs-mins, 1e-9)
    # Rows count from the map's north/top edge downwards.
    col = min(n-1, max(0, int((point[0]-mins[0])/span[0]*n)))
    row = min(n-1, max(0, int((maxs[1]-point[1])/span[1]*n)))
    return chr(65+col)+str(row+1)


def label_reference_grid(ax, xy):
    mins, maxs = xy.min(0), xy.max(0)
    span = np.maximum(maxs-mins, 1e-9)
    for k in range(6):
        ax.text(mins[0]+(k+.5)*span[0]/6, maxs[1]+.025*span[1], chr(65+k),
                fontsize=9, color=MUTED, ha="center", va="bottom", zorder=7)
        ax.text(mins[0]-.025*span[0], maxs[1]-(k+.5)*span[1]/6, str(k+1),
                fontsize=9, color=MUTED, ha="right", va="center", zorder=7)


def domain_regions(ax, xy, domains, order, colors):
    """Outline actual domain point clouds; boundaries are editorial, not metrics."""
    darray = np.asarray(domains)
    full_span = np.maximum(xy.max(0)-xy.min(0), 1e-6)
    titles = []
    for d in order:
        pts = xy[darray == d]
        center = np.mean(pts, axis=0)
        if len(pts) >= 3:
            try:
                hull = ConvexHull(pts)
                boundary = pts[hull.vertices]
                boundary = center+(boundary-center)*1.09
                patch = Polygon(boundary, facecolor=colors[d], edgecolor=colors[d],
                                alpha=.075, linewidth=1.4, joinstyle="round", zorder=1)
                ax.add_patch(patch)
            except QhullError:
                pass
        loc = [np.median(pts[:, 0]), pts[:, 1].max()+full_span[1]*.019]
        label = "\n".join(textwrap.wrap(domain_title(d), 24)) if LANGUAGE == "en" else domain_title(d)
        title = ax.text(*loc, label, fontsize=10.5 if LANGUAGE == "en" else 12, fontweight="bold", color=colors[d],
                        ha="center", va="bottom", zorder=8,
                        bbox={"facecolor": BG, "alpha": .85, "edgecolor": "none", "pad": 2})
        titles.append(title)
    return titles


def add_node_labels(fig, ax, nodes, xy, degree, selected, limit, fontsize=8, reserved_artists=None):
    """Greedy display-space label placement with overlap rejection.

    Rejecting a label never removes its node. Links point to original sources.
    """
    fig.canvas.draw()
    renderer = fig.canvas.get_renderer()
    accepted = [artist.get_window_extent(renderer).expanded(1.1, 1.3) for artist in (reserved_artists or [])]
    labelled = []
    selected = sorted(selected, key=lambda i: (-degree[i], str(nodes[i]["id"])))
    offsets = [(8, 7), (8, -9), (-8, 7), (-8, -9), (0, 14), (0, -16)]
    abox = ax.get_window_extent(renderer)
    for i in selected:
        if len(labelled) >= limit:
            break
        label = str(nodes[i].get("label", nodes[i]["id"]))
        if len(label) > 64:
            label = label[:61] + "…"
        for dx, dy in offsets:
            ha = "left" if dx > 0 else "right" if dx < 0 else "center"
            ann = ax.annotate(label, xy[i], xytext=(dx, dy), textcoords="offset points",
                              fontsize=fontsize, color=INK, ha=ha, va="center", zorder=6,
                              bbox={"facecolor": BG, "alpha": .88, "edgecolor": "none", "pad": 1.5},
                              url=nodes[i].get("source_url"))
            bb = ann.get_window_extent(renderer).expanded(1.09, 1.25)
            inside = (bb.x0 >= abox.x0 and bb.x1 <= abox.x1 and
                      bb.y0 >= abox.y0 and bb.y1 <= abox.y1)
            if inside and not any(bb.overlaps(b) for b in accepted):
                accepted.append(bb)
                labelled.append(str(nodes[i]["id"]))
                break
            ann.remove()
    return labelled


def scatter_nodes(ax, nodes, xy, domains, degree, domain_order, colors, *, size=2.0,
                  selected=None, svg_groups=None):
    allsel = np.arange(len(nodes)) if selected is None else np.asarray(selected, dtype=int)
    darray = np.asarray(domains)
    for k, d in enumerate(domain_order):
        which = allsel[darray[allsel] == d]
        if not len(which):
            continue
        s = size + np.minimum(np.log1p(degree[which]), 5.5) * size * .35
        sc = ax.scatter(xy[which, 0], xy[which, 1], s=s,
                        c=colors[d], edgecolors="none", alpha=.86, zorder=4,
                        urls=[str(nodes[i].get("source_url", "")) for i in which])
        gid = f"islands-{k:02d}"
        sc.set_gid(gid)
        if svg_groups is not None:
            svg_groups[gid] = {"domain": d, "expected_nodes": len(which)}
    flagged = [i for i in allsel if int(nodes[i].get("source_quality_issue_count", 0)) > 0]
    if flagged:
        warnings = ax.scatter(xy[flagged, 0], xy[flagged, 1], s=max(24, size*4),
                              facecolors="none", edgecolors="#c24532", linewidths=.85, zorder=5)
        warnings.set_gid("source-quality-markers")


def add_edges(ax, xy, edges, indices, alpha=.05, linewidth=.24):
    if not indices:
        return
    segs = [[xy[edges[k][0]], xy[edges[k][1]]] for k in indices]
    collection = LineCollection(segs, color=INK, alpha=alpha, linewidths=linewidth, zorder=2)
    collection.set_gid("reference-routes")
    ax.add_collection(collection)


def decorate_overview(fig, nodes, domains, edges, selected_edges, domain_order, colors):
    fig.text(.045, .952, localized("数学群岛", "Mathematical Archipelago"), fontsize=39, fontweight="bold", color=INK, va="top")
    fig.text(.047, .900, localized("A MATHEMATICAL ARCHIPELAGO", "A SOURCED NAVIGATION MAP OF MATHEMATICS"), fontsize=12, color=MUTED, fontweight="bold")
    fig.text(.953, .945, f"{len(nodes):,}", ha="right", va="top", fontsize=40, color=INK)
    fig.text(.952, .899, localized(f"有来源的数学条目  ·  {len(edges):,} 条数据关系", f"sourced entries · {len(edges):,} recorded relations"), ha="right", fontsize=12, color=MUTED)
    fig.text(.82, .807, localized("海域索引", "REGION INDEX"), fontsize=15, color=INK, fontweight="bold")
    fig.text(.82, .777, localized("颜色对应数据中的主题分区", "Colors identify subject groups in the data."), fontsize=9, color=MUTED)
    counts = collections.Counter(domains)
    step = min(.031, .40 / max(len(domain_order), 1))
    for k, d in enumerate(domain_order):
        y = .743 - step*k
        fig.text(.821, y, "●", fontsize=14, color=colors[d])
        fig.text(.839, y, domain_title(d), fontsize=(8.5 if LANGUAGE == "en" else 10) if len(domain_order)<16 else 9, color=INK)
        fig.text(.956, y, f"{counts[d]:,}", ha="right", fontsize=10, color=MUTED)
    legend_y = .743 - step*len(domain_order) - .035
    fig.text(.82, legend_y, localized("读图约定", "HOW TO READ THE MAP"), fontsize=12, fontweight="bold", color=INK)
    notes = ["每一点对应一个数学条目 ID；", "名称未全部展开，节点全部保留。",
             "点大小依据图中连接度；", "不代表数学价值、难度或真伪。",
             "细线是条目之间的数据关系；", "不自动构成证明依赖。",
             "位置用于索引与导航；", "二维距离不是数学距离。",
             "外缘环：域内未记录到连线；", "这不等于数学上彼此孤立。"]
    if LANGUAGE == "en":
        notes = ["Each point is one mathematical entry ID.", "All nodes remain; only some labels appear.",
                 "Point size reflects graph degree,", "not mathematical value, difficulty or truth.",
                 "Thin lines are recorded data relations,", "not automatically proof dependencies.",
                 "Positions support indexing and navigation;", "2D distance is not mathematical distance.",
                 "Outer rings: no recorded in-region links.", "This does not establish mathematical isolation."]
    if any(int(n.get("source_quality_issue_count", 0)) for n in nodes):
        notes.append(localized("红圈：已登记的源文本质量问题。", "Red rings: registered source-quality issues."))
    for k, line in enumerate(notes):
        fig.text(.82, legend_y-.025*(k+1), line, fontsize=8.7, color=MUTED)
    fig.text(.048, .069, localized("既有联系提供航道；新的联通需要定义、条件与证明。", "Known connections offer routes. New connections require definitions, assumptions and proofs."), fontsize=16, color=INK)
    fig.text(.048, .039,
             localized(f"总图显示全部 {len(nodes):,} 个节点与 {len(selected_edges):,} 条导航线；完整关系见数据表。"
             "  原始条目名保留英文；详图与索引用于定位。",
             f"All {len(nodes):,} nodes and {len(selected_edges):,} selected routes are shown. Full relations are in the data tables; detail maps and the index locate individual entries."), fontsize=9.5, color=MUTED)


def overview(nodes, xy, domains, edges, degree, order, colors, outdir, edge_limit, dpi):
    fig = plt.figure(figsize=(26, 17))
    ax = fig.add_axes([.037, .125, .745, .735])
    set_extent(ax, xy)
    reference_grid(ax, xy)
    label_reference_grid(ax, xy)
    region_titles = domain_regions(ax, xy, domains, order, colors)
    edgeids = priority_edges(edges, degree, edge_limit)
    add_edges(ax, xy, edges, edgeids, alpha=.045)
    groups = {}
    scatter_nodes(ax, nodes, xy, domains, degree, order, colors, svg_groups=groups)
    # Keep representation broad: candidate labels from each domain, then rank.
    candidates = []
    for d in order:
        in_d = [i for i, x in enumerate(domains) if x == d]
        candidates.extend(sorted(in_d, key=lambda i: (-degree[i], str(nodes[i]["id"])))[:12])
    labels = add_node_labels(fig, ax, nodes, xy, degree, candidates, limit=60, fontsize=8,
                             reserved_artists=region_titles)
    decorate_overview(fig, nodes, domains, edges, edgeids, order, colors)
    base = outdir / "mathematical-archipelago-overview"
    fig.savefig(base.with_suffix(".svg"))
    fig.savefig(base.with_suffix(".pdf"))
    fig.savefig(base.with_suffix(".png"), dpi=dpi)
    plt.close(fig)
    return {"svg_node_groups": groups, "nodes_drawn": len(nodes), "edges_drawn": len(edgeids),
            "labels_drawn": len(labels), "labelled_ids": labels,
            "edge_selection": "deterministic descending sum of endpoint degree; ties by endpoint indices/relation",
            "edge_indices": edgeids,
            "files": [file_reference(base.with_suffix(ext)) for ext in [".svg", ".pdf", ".png"]]}


def detail_figure(nodes, xy, domains, edges, degree, order, colors, domain, detail_edge_limit):
    selected = [i for i, d in enumerate(domains) if d == domain]
    chosen = set(selected)
    internal = [k for k, (i, j, _) in enumerate(edges) if i in chosen and j in chosen]
    internal = sorted(internal, key=lambda k: (-(degree[edges[k][0]]+degree[edges[k][1]]), k))[:detail_edge_limit]
    fig = plt.figure(figsize=(19, 13))
    ax = fig.add_axes([.055, .15, .70, .70])
    set_extent(ax, xy[selected], pad=.08)
    reference_grid(ax, xy[selected])
    add_edges(ax, xy, edges, internal, alpha=.095, linewidth=.4)
    scatter_nodes(ax, nodes, xy, domains, degree, order, colors, size=8, selected=selected)
    labels = add_node_labels(fig, ax, nodes, xy, degree, selected, limit=55, fontsize=9)
    fig.text(.05, .93, domain_title(domain), fontsize=30, color=INK, fontweight="bold")
    fig.text(.05, .883, localized(f"数学群岛 · 分区详图  /  {len(selected):,} 个条目", f"Mathematical Archipelago · Region detail / {len(selected):,} entries"), fontsize=12, color=MUTED)
    fig.text(.79, .81, localized("高连接度条目", "Highly connected entries"), fontsize=13, color=INK, fontweight="bold")
    hubs = sorted(selected, key=lambda i: (-degree[i], str(nodes[i]["id"])))[:14]
    y = .77
    for i in hubs:
        name = str(nodes[i].get("label", nodes[i]["id"]))
        lines = textwrap.wrap(name, 28)[:2]
        fig.text(.79, y, "\n".join(lines), fontsize=8.5, color=INK,
                 url=nodes[i].get("source_url"), va="top")
        y -= .036 + .014*(len(lines)-1)
    fig.text(.05, .083, localized("本页保留该分区的全部节点；灰线仅显示部分区内数据关系。", "Every node in this region is retained. Gray lines show selected relations within the region."), fontsize=11, color=INK)
    fig.text(.05, .053, localized("文字标签可点击前往来源。跨区关系保留在完整边表中；连接度不代表价值，位置不代表数学距离。", "Click labels for sources. Cross-region relations remain in the full edge table. Degree is not value; position is not mathematical distance."), fontsize=9, color=MUTED)
    return fig, {"domain": domain, "nodes_drawn": len(selected), "edges_drawn": len(internal),
                 "labels_drawn": len(labels), "labelled_ids": labels}


def add_svg_titles(svg_path, nodes):
    # Add human-readable source labels to hyperlinks without changing markers.
    namespace = "http://www.w3.org/2000/svg"
    ET.register_namespace("", namespace)
    ET.register_namespace("xlink", "http://www.w3.org/1999/xlink")
    labels = {str(n.get("source_url", "")): str(n.get("label", n["id"])) +
              (localized(f" | 已登记源文本问题 {n['source_quality_issue_count']} 项；详见 source-quality-findings.json",
                         f" | {n['source_quality_issue_count']} registered source-quality issue(s); see source-quality-findings.json")
               if int(n.get("source_quality_issue_count", 0)) else "") for n in nodes}
    tree = ET.parse(svg_path)
    for el in tree.iter(f"{{{namespace}}}a"):
        url = el.attrib.get("{http://www.w3.org/1999/xlink}href", "")
        if url in labels:
            title = ET.Element(f"{{{namespace}}}title")
            title.text = labels[url]
            el.insert(0, title)
    tree.write(svg_path, encoding="utf-8", xml_declaration=True)


def bridge_map(nodes, xy, domains, edges, degree, order, colors, bridgepath, outdir, dpi):
    """A separately legible chart of explicitly supplied, sourced bridges."""
    if not bridgepath.exists():
        return {"status": "not_supplied", "bridges_drawn": 0}
    with bridgepath.open(newline="") as f:
        bridges = list(csv.DictReader(f))
    index = {str(n["id"]): i for i, n in enumerate(nodes)}
    bridge_ids = [str(b.get("bridge_id", "")) for b in bridges]
    if len(set(bridge_ids)) != len(bridge_ids) or any(not x for x in bridge_ids):
        raise ValueError("Documented routes require distinct nonempty bridge IDs")
    for b in bridges:
        if str(b.get("source")) not in index or str(b.get("target")) not in index:
            raise ValueError("Bridge endpoint not present in island data")
        if str(b["source"]) == str(b["target"]):
            raise ValueError("A bridge must bind two distinct island IDs")
        if b.get("status") not in ("known_in_literature", "documented", "known"):
            raise ValueError("This chart is reserved for documented bridges; label candidates separately")
    fig = plt.figure(figsize=(26, 17))
    ax = fig.add_axes([.04, .13, .69, .73])
    set_extent(ax, xy)
    reference_grid(ax, xy)
    label_reference_grid(ax, xy)
    region_titles = domain_regions(ax, xy, domains, order, colors)
    background = ax.scatter(xy[:, 0], xy[:, 1], s=1.6, c="#bdcbc5", edgecolors="none", alpha=.65, zorder=1)
    background.set_gid("bridge-map-background-islands")
    endpoint_ids = set()
    route_labels = []
    display_ids = {str(b["bridge_id"]): f"B{k+1:02d}" for k, b in enumerate(bridges)}
    for k, b in enumerate(bridges):
        i, j = index[str(b["source"])], index[str(b["target"])]
        endpoint_ids.update([i, j])
        rad = (.07+.025*(k%3)) * (1 if k % 2 else -1)
        # Arrow direction follows source/target inventory, and is not an implication sign.
        arrow = FancyArrowPatch(xy[i], xy[j], connectionstyle=f"arc3,rad={rad}",
                                 arrowstyle="-", linewidth=1.0, color="#b3693c", alpha=.66, zorder=3)
        arrow.set_gid(f"documented-route-{k+1:02d}")
        ax.add_patch(arrow)
        mid = (xy[i]+xy[j])/2
        delta = xy[j]-xy[i]
        # Arc3's control point is midpoint + rad*(dy, -dx); the
        # quadratic curve midpoint uses half that displacement.
        mid -= np.array([-delta[1], delta[0]])*rad*.5
        route_labels.append((mid, display_ids[str(b["bridge_id"])]))
    scatter_nodes(ax, nodes, xy, domains, degree, order, colors, size=22, selected=sorted(endpoint_ids))
    fig.canvas.draw()
    renderer = fig.canvas.get_renderer()
    occupied = [a.get_window_extent(renderer).expanded(1.1, 1.3) for a in region_titles]
    route_artists = []
    for mid, bid in route_labels:
        for dx, dy in [(0, 0), (0, 10), (0, -10), (15, 0), (-15, 0),
                       (15, 12), (-15, 12), (15, -12), (-15, -12), (0, 24)]:
            a = ax.annotate(bid, mid, xytext=(dx, dy), textcoords="offset points",
                            color="#8c482d", fontsize=8, ha="center", va="center", zorder=7,
                            arrowprops=({"arrowstyle": "-", "color": "#b3693c", "linewidth": .45}
                                        if (dx, dy) != (0, 0) else None),
                            bbox={"facecolor": BG, "alpha": .9, "edgecolor": "none", "pad": 1.2})
            bb = a.get_window_extent(renderer).expanded(1.1, 1.3)
            if not any(bb.overlaps(b) for b in occupied) or (dx, dy) == (0, 24):
                occupied.append(bb)
                route_artists.append(a)
                break
            a.remove()
    labels = add_node_labels(fig, ax, nodes, xy, degree, sorted(endpoint_ids), limit=60, fontsize=9,
                             reserved_artists=region_titles+route_artists)
    fig.text(.045, .95, localized("跨海航线", "Routes Across the Seas"), fontsize=39, fontweight="bold", color=INK, va="top")
    fig.text(.047, .897, "DOCUMENTED BRIDGES BETWEEN MATHEMATICAL TOOLS", fontsize=12, color=MUTED)
    fig.text(.953, .942, f"{len(bridges)}", fontsize=40, color=INK, ha="right", va="top")
    fig.text(.953, .897, localized("已绑定地图端点的文献桥梁", "documented bridges with mapped endpoints"), fontsize=12, color=MUTED, ha="right")
    fig.text(.76, .807, localized("航线目录", "ROUTE DIRECTORY"), fontsize=15, color=INK, fontweight="bold")
    step = min(.03, .66/max(1, len(bridges)))
    for k, b in enumerate(bridges):
        bid = display_ids[str(b["bridge_id"])]
        title = str(b.get("label", b.get("title_zh", "")))
        if LANGUAGE == "en":
            title = ENGLISH_BRIDGES.get(str(b["bridge_id"]), b.get("label_en", title))
            title = "\n".join(textwrap.wrap(title, 44))
        else:
            title = title[:34]
        fig.text(.76, .765-step*k, bid, color="#8c482d", fontsize=9.2)
        fig.text(.79, .765-step*k, title, color=INK, fontsize=8.7 if LANGUAGE == "en" else 9.2)
    fig.text(.047, .073, localized("一条跨海航线的成立，取决于可迁移的结构与适用条件。", "A bridge works through transferable structures and explicit assumptions."), fontsize=16, color=INK)
    fig.text(.047, .043, localized("此页仅展示有文献支持且端点已匹配的桥梁；曲线不是蕴含箭头，弧长与位置没有数学距离含义。条件与来源见桥梁报告。",
             "Only documented bridges with matched endpoints appear. Curves are not implication arrows; their length and position are not mathematical distances. See the bridge report for assumptions and sources."),
             fontsize=9.5, color=MUTED)
    base = outdir/"mathematical-archipelago-bridges"
    for ext in [".svg", ".pdf", ".png"]:
        fig.savefig(base.with_suffix(ext), **({"dpi": dpi} if ext == ".png" else {}))
    add_svg_titles(base.with_suffix(".svg"), nodes)
    plt.close(fig)
    return {"status": "rendered", "input_path": file_reference(bridgepath), "input_sha256": digest(bridgepath),
            "bridges_drawn": len(bridges), "endpoint_count": len(endpoint_ids), "labelled_ids": labels,
            "display_id_mapping": display_ids}


def verify_svg_content(outdir, expected_nodes, detail_records, bridge_record):
    ns = "{http://www.w3.org/2000/svg}"
    observed = {}
    for path in sorted(outdir.glob("*.svg")):
        tree = ET.parse(path)
        groups = {e.get("id"): e for e in tree.iter(ns+"g") if e.get("id")}
        counts = {gid: len(list(g.iter(ns+"a"))) for gid, g in groups.items()
                  if gid.startswith("islands-")}
        background = groups.get("bridge-map-background-islands")
        background_count = len(list(background.iter(ns+"use"))) if background is not None else 0
        routes = [gid for gid in groups if gid.startswith("documented-route-")]
        observed[path.name] = {"anchored_node_groups": counts,
            "anchored_node_count": sum(counts.values()), "background_marker_count": background_count,
            "documented_route_count": len(routes), "sha256": digest(path)}
    if observed["mathematical-archipelago-overview.svg"]["anchored_node_count"] != expected_nodes:
        raise RuntimeError("Actual overview SVG node count differs from input")
    for k, detail in enumerate(detail_records):
        if observed[f"domain-{k+1:02d}.svg"]["anchored_node_count"] != detail["nodes_drawn"]:
            raise RuntimeError("Actual domain SVG node count differs from input")
    if bridge_record.get("status") == "rendered":
        r = observed["mathematical-archipelago-bridges.svg"]
        if r["background_marker_count"] != expected_nodes or r["documented_route_count"] != bridge_record["bridges_drawn"]:
            raise RuntimeError("Actual bridge SVG marker/route count differs from input")
    return observed


def main():
    global LANGUAGE
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--language", choices=["zh", "en"], default="zh",
                        help="Map language; default output is maps/ for zh and maps/en/ for en")
    parser.add_argument("--nodes", type=Path, default=ROOT/"data/nodes.jsonl")
    parser.add_argument("--edges", type=Path, default=ROOT/"data/edges.csv")
    parser.add_argument("--out", type=Path, default=None)
    parser.add_argument("--edge-limit", type=int, default=16000)
    parser.add_argument("--detail-edge-limit", type=int, default=7000)
    parser.add_argument("--dpi", type=int, default=180)
    parser.add_argument("--bridges", type=Path, default=ROOT/"data/bridges.csv")
    args = parser.parse_args()
    LANGUAGE = args.language
    if args.out is None:
        args.out = ROOT / ("maps/en" if LANGUAGE == "en" else "maps")
    args.out.mkdir(parents=True, exist_ok=True)
    font = choose_fonts()
    nodes, xy, domains, edges, degree = load_data(args.nodes, args.edges)
    order = sorted(set(domains), key=lambda d: (-domains.count(d), d))
    colors = {d: COLORS[k % len(COLORS)] for k, d in enumerate(order)}
    grid_bounds = (xy.min(0), xy.max(0))
    with (args.out/"navigation-index.csv").open("w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "label", "kind", "grid_cell", "domain", "domain_display", "domain_sheet", "x", "y", "source_id", "source_url", "verification_status", "source_quality_issue_count", "node_jsonl_line", "source_quality_findings_json"])
        writer.writeheader()
        for i, node in enumerate(nodes):
            writer.writerow({"id": node["id"], "label": node.get("label", node["id"]),
                             "kind": node.get("kind", "unknown"),
                             "grid_cell": grid_reference(xy, xy[i], bounds=grid_bounds), "domain": domains[i],
                             "domain_display": domain_title(domains[i]),
                             "domain_sheet": f"domain-{order.index(domains[i])+1:02d}",
                             "x": xy[i,0], "y": xy[i,1], "source_id": node.get("source_id", ""),
                             "source_url": node.get("source_url", ""),
                             "verification_status": node.get("verification_status", node.get("review_status", "")),
                             "source_quality_issue_count": int(node.get("source_quality_issue_count", 0)),
                             "node_jsonl_line": i+1,
                             "source_quality_findings_json": json.dumps(node.get("source_quality_findings", []), ensure_ascii=False)})
    quality_records = [{"id": n["id"], "label": n.get("label", n["id"]),
                        "source_url": n.get("source_url"), "node_jsonl_line": i+1,
                        "findings": n.get("source_quality_findings", [])}
                       for i, n in enumerate(nodes) if int(n.get("source_quality_issue_count", 0)) > 0]
    (args.out/"source-quality-findings.json").write_text(json.dumps({"input_sha256": digest(args.nodes),
           "source_nodes_with_registered_issues": len(quality_records), "records": quality_records}, ensure_ascii=False, indent=2)+"\n")
    manifest = {"schema_version": "1.0", "renderer": "matplotlib-static-vector-atlas",
                "language": LANGUAGE, "locale": "en" if LANGUAGE == "en" else "zh-CN",
                "renderer_script_sha256": digest(Path(__file__)),
                "rendering_command": ["python", "scripts/render_atlas.py", "--language", LANGUAGE,
                                      "--nodes", file_reference(args.nodes), "--edges", file_reference(args.edges),
                                      "--bridges", file_reference(args.bridges), "--out", file_reference(args.out),
                                      "--dpi", str(args.dpi), "--edge-limit", str(args.edge_limit),
                                      "--detail-edge-limit", str(args.detail_edge_limit)],
                "nodes_path": file_reference(args.nodes), "nodes_sha256": digest(args.nodes),
                "edges_path": file_reference(args.edges), "edges_sha256": digest(args.edges),
                "source_node_count": len(nodes), "source_edge_count": len(edges),
                "domains": dict(collections.Counter(domains)), "colors": colors,
                "domain_display_names": {d: domain_title(d) for d in order},
                "bridge_display_labels": ENGLISH_BRIDGES if LANGUAGE == "en" else {},
                "translation_scope": "Display text only; input data, IDs, coordinates, source labels and original audit findings retained",
                "font": font, "dpi": args.dpi,
                "source_quality_flagged_node_count": len(quality_records),
                "all_source_nodes_drawn": True,
                "coordinate_semantics": "Provided source layout; no mathematical metric is asserted",
                "point_size_semantics": "bounded logarithmic graph degree, not value or validity",
                "relation_semantics": "See edge relation field; references are not proof dependencies",
                "overview": overview(nodes, xy, domains, edges, degree, order, colors,
                                     args.out, args.edge_limit, args.dpi), "details": []}
    manifest["bridges"] = bridge_map(nodes, xy, domains, edges, degree, order, colors,
                                     args.bridges, args.out, args.dpi)
    add_svg_titles(args.out / "mathematical-archipelago-overview.svg", nodes)
    with PdfPages(args.out/"mathematical-archipelago-domain-atlas.pdf") as pdf:
        for k, d in enumerate(order):
            fig, detail = detail_figure(nodes, xy, domains, edges, degree, order, colors,
                                        d, args.detail_edge_limit)
            base = args.out / f"domain-{k+1:02d}"
            pdf.savefig(fig)
            fig.savefig(base.with_suffix(".svg"))
            add_svg_titles(base.with_suffix(".svg"), nodes)
            fig.savefig(base.with_suffix(".png"), dpi=130)
            plt.close(fig)
            detail["files"] = [file_reference(base.with_suffix(e)) for e in [".svg", ".png"]]
            manifest["details"].append(detail)
            print(f"Rendered {domain_title(d)}: {detail['nodes_drawn']} nodes", flush=True)
    manifest["svg_actual_counts"] = verify_svg_content(args.out, len(nodes), manifest["details"], manifest["bridges"])
    (args.out/"render-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+"\n")
    print(json.dumps({"nodes": len(nodes), "edges": len(edges), "domains": len(order),
                      "output": str(args.out)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
