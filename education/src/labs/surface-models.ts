import type { Triangle } from './models';
export type Vec3 = [number, number, number];
export type SurfaceMesh = { vertices: Vec3[]; faces: Triangle[] };
const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: Vec3, b: Vec3) => a.reduce((sum, v, i) => sum + v * b[i], 0);
const norm = (a: Vec3) => Math.sqrt(dot(a, a));
export function surfaceMesh(kind: 'tetrahedron' | 'octahedron' | 'torus', radius = 0.62): SurfaceMesh {
  if (kind === 'tetrahedron') return { vertices: [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]], faces: [[0, 2, 1], [0, 1, 3], [0, 3, 2], [1, 2, 3]] };
  if (kind === 'octahedron') return { vertices: [[1.5, 0, 0], [-1.5, 0, 0], [0, 1.5, 0], [0, -1.5, 0], [0, 0, 1.5], [0, 0, -1.5]], faces: [[0, 2, 4], [2, 1, 4], [1, 3, 4], [3, 0, 4], [2, 0, 5], [1, 2, 5], [3, 1, 5], [0, 3, 5]] };
  const n = 20, m = 10, vertices: Vec3[] = [], faces: Triangle[] = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { const u = i * 2 * Math.PI / n, v = j * 2 * Math.PI / m; vertices.push([(1.4 + radius * Math.cos(v)) * Math.cos(u), (1.4 + radius * Math.cos(v)) * Math.sin(u), radius * Math.sin(v)]); }
  const at = (i: number, j: number) => ((i + n) % n) * m + ((j + m) % m);
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { const a = at(i, j), b = at(i + 1, j), c = at(i + 1, j + 1), d = at(i, j + 1); faces.push([a, b, c], [a, c, d]); }
  return { vertices, faces };
}
export function angleDeficits(mesh: SurfaceMesh) {
  const sums = mesh.vertices.map(() => 0), edges = new Set<string>();
  for (const face of mesh.faces) {
    for (let i = 0; i < 3; i++) {
      const a = face[i], b = face[(i + 1) % 3], c = face[(i + 2) % 3];
      const u = sub(mesh.vertices[b], mesh.vertices[a]), v = sub(mesh.vertices[c], mesh.vertices[a]);
      const cosine = Math.max(-1, Math.min(1, dot(u, v) / (norm(u) * norm(v))));
      sums[a] += Math.acos(cosine); edges.add(`${Math.min(a, b)},${Math.max(a, b)}`);
    }
  }
  const deficits = sums.map(a => 2 * Math.PI - a), euler = mesh.vertices.length - edges.size + mesh.faces.length;
  return { deficits, total: deficits.reduce((a, b) => a + b, 0), euler, edges: [...edges].map(k => k.split(',').map(Number) as [number, number]) };
}
export function project3d([x, y, z]: Vec3, yaw = 0.45, tilt = 0.65): Vec3 {
  const a = x * Math.cos(yaw) - y * Math.sin(yaw), b = x * Math.sin(yaw) + y * Math.cos(yaw);
  return [a, b * Math.sin(tilt) - z * Math.cos(tilt), b * Math.cos(tilt) + z * Math.sin(tilt)];
}
