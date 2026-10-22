#!/usr/bin/env python3
"""Replay the negative-edge counterexample for an inspected source's algorithm.

This checks one finite graph, not all of Dijkstra's theorem or source content.
The source's written update rule also updates already examined neighbours.
"""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "sources/planetmath/tex/05_Combinatorics/05C85-TheRealHistoryOfGettingSettledToAccomplishStudies.tex"
edges = {"s": {"a": 2, "b": 5}, "a": {"c": 2}, "b": {"a": -4}, "c": {"s": 100}}
distance = {"s": 0, "a": 2, "b": 5, "c": float("inf")}
examined = {"s"}
trace = []
while len(examined) < len(edges):
    vertex = min(set(edges)-examined, key=lambda v: (distance[v], v))
    examined.add(vertex)
    for target, weight in edges[vertex].items():
        distance[target] = min(distance[target], distance[vertex]+weight)
    trace.append({"examined_next": vertex, "distances": dict(distance)})

paths = []
def visit(vertex, route, weight):
    if vertex == "c":
        paths.append({"path": route, "weight": weight})
    for target, cost in edges[vertex].items():
        if target not in route:
            visit(target, route+[target], weight+cost)
visit("s", ["s"], 0)
best = min(paths, key=lambda p: p["weight"])
assert distance["c"] == 4 and best["weight"] == 3
reachability = {}
for start in edges:
    seen, todo = {start}, [start]
    while todo:
        for target in edges[todo.pop()]:
            if target not in seen:
                seen.add(target)
                todo.append(target)
    reachability[start] = sorted(seen)
assert all(len(v) == len(edges) for v in reachability.values())
# Every cycle must pass through s, because deleting s leaves an acyclic graph.
# The two possible simple cycles are s-a-c-s and s-b-a-c-s.
cycle_weights = {"s-a-c-s": 2+2+100, "s-b-a-c-s": 5-4+2+100}
assert min(cycle_weights.values()) > 0
result = {
    "case": "negative-edge-in-source-dijkstra-description",
    "source_node_id": "pm:TheRealHistoryOfGettingSettledToAccomplishStudies",
    "source_path": str(SOURCE.relative_to(ROOT)),
    "source_sha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    "graph": edges, "source_algorithm_trace": trace,
    "reachability_from_every_vertex": reachability, "simple_cycle_weights": cycle_weights,
    "all_simple_paths_s_to_c": paths, "source_algorithm_distance_c": distance["c"],
    "actual_shortest_path": best,
    "conclusion": "该有向加权强连通图且无负环满足来源列明的连通条件，按原更新规则得到c距离4，真实值3；须补非负边权等充分条件，不能把该原文当作无条件正确算法。",
    "scope": "Exact finite integer counterexample; no novelty claim; source text retained unchanged.",
}
(ROOT/"reports/cartographic-source-counterexamples.json").write_text(json.dumps(result, ensure_ascii=False, indent=2)+"\n")
print(json.dumps({"reported": distance["c"], "actual": best["weight"], "counterexample_verified": True}))
