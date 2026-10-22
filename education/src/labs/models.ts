/** Exact finite models and explicitly finite numerical windows used by the labs. */
export type Vec2 = [number, number];
export type Edge = [number, number];
export type WeightedEdge = [number, number, number];

export function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}
export function sieve(limit: number, passes: number) {
  if (!Number.isInteger(limit) || limit < 2 || limit > 10000) throw new RangeError('Choose an integer limit from 2 to 10000');
  const primes = Array.from({ length: Math.floor(Math.sqrt(limit)) + 1 }, (_, i) => i).filter(isPrime);
  const used = primes.slice(0, Math.max(0, Math.floor(passes)));
  const removed = new Map<number, number>();
  for (const p of used) for (let multiple = p * p; multiple <= limit; multiple += p) if (!removed.has(multiple)) removed.set(multiple, p);
  return { primes, used, removed, survivors: Array.from({ length: limit - 1 }, (_, i) => i + 2).filter(n => !removed.has(n)), complete: used.length === primes.length };
}

export type Dihedral = { rotation: number; reflection: boolean };
export const mod = (n: number, p: number) => ((n % p) + p) % p;
/** R^k S^s; multiplication means a after b, with S(x,y)=(x,-y). */
export function dihedralCompose(a: Dihedral, b: Dihedral): Dihedral { return { rotation: mod(a.rotation + (a.reflection ? -1 : 1) * b.rotation, 4), reflection: a.reflection !== b.reflection }; }
export function dihedralPoint(g: Dihedral, point: Vec2): Vec2 {
  const [x, y0] = point, y = g.reflection ? -y0 : y0;
  const pairs: Vec2[] = [[x, y], [-y, x], [-x, -y], [y, -x]];
  return pairs[mod(g.rotation, 4)];
}
export const dihedralName = (g: Dihedral) => `${g.rotation ? `r${['', '', '²', '³'][g.rotation]}` : ''}${g.reflection ? 's' : ''}` || 'e';

export function ellipticDiscriminant(a: number, b: number) { return -16 * (4 * a ** 3 + 27 * b ** 2); }
/** Finite real branches of y²=x³+ax+b, including root and viewport crossings. */
export function cubicBranches(a: number, b: number, xmin: number, xmax: number, ymax: number, samples = 750): Vec2[][] {
  if (![a, b, xmin, xmax, ymax].every(Number.isFinite) || xmin >= xmax || ymax <= 0 || !Number.isInteger(samples) || samples < 2) throw new RangeError('A finite ordered window and at least two samples are required');
  const polynomial = (x: number) => x ** 3 + a * x + b, ceiling = ymax ** 2;
  const critical = a < 0 ? [-Math.sqrt(-a / 3), Math.sqrt(-a / 3)] : a === 0 ? [0] : [];
  // Critical points partition the cubic into monotone pieces, so a narrow turn
  // between regular samples cannot hide a zero or viewport crossing.
  const xs = [...new Set([...Array.from({ length: samples + 1 }, (_, i) => xmin + (xmax - xmin) * i / samples), ...critical.filter(x => x > xmin && x < xmax)])].sort((x, y) => x - y);
  const nodes: { x: number; q: number }[] = [{ x: xs[0], q: polynomial(xs[0]) }];
  for (let i = 1; i < xs.length; i++) {
    const left = xs[i - 1], right = xs[i], ql = polynomial(left), qr = polynomial(right), crossings: { x: number; q: number }[] = [];
    for (const level of [0, ceiling]) if ((ql - level) * (qr - level) < 0) {
      let lo = left, hi = right;
      for (let iteration = 0; iteration < 60; iteration++) {
        const mid = (lo + hi) / 2;
        if ((polynomial(mid) - level) * (ql - level) > 0) lo = mid;
        else hi = mid;
      }
      // Both signs share this exact floating-point x and y=0 at a real root.
      crossings.push({ x: (lo + hi) / 2, q: level });
    }
    nodes.push(...crossings.sort((x, y) => x.x - y.x), { x: right, q: qr });
  }
  const positive: Vec2[][] = []; let current: Vec2[] = [];
  for (const { x, q } of nodes) {
    if (q >= 0 && q <= ceiling) current.push([x, Math.sqrt(q)]);
    else if (current.length) { positive.push(current); current = []; }
  }
  if (current.length) positive.push(current);
  return [...positive, ...positive.map(branch => branch.map(([x, y]): Vec2 => [x, y === 0 ? 0 : -y]))];
}
export type EllipticPoint = Vec2 | null;
export function ellipticAdd(p: EllipticPoint, q: EllipticPoint, a: number): EllipticPoint {
  if (p === null) return q;
  if (q === null) return p;
  const [x1, y1] = p, [x2, y2] = q;
  if (Math.abs(x1 - x2) < 1e-10 && Math.abs(y1 + y2) < 1e-10) return null;
  const m = Math.abs(x1 - x2) < 1e-10 ? (3 * x1 * x1 + a) / (2 * y1) : (y2 - y1) / (x2 - x1);
  const x3 = m * m - x1 - x2;
  return [x3, m * (x1 - x3) - y1];
}

export function inverseMod(a: number, p: number) {
  if (!isPrime(p)) throw new RangeError('This model requires a prime field');
  let t = 0, nextT = 1, r = p, nextR = mod(a, p);
  while (nextR !== 0) { const q = Math.floor(r / nextR); [t, nextT] = [nextT, t - q * nextT]; [r, nextR] = [nextR, r - q * nextR]; }
  if (r !== 1) throw new RangeError('Zero has no multiplicative inverse');
  return mod(t, p);
}
export function polynomialMod(coefficients: number[], x: number, p: number) { return coefficients.reduceRight((acc, value) => mod(acc * x + value, p), 0); }
export function interpolateMod(points: Vec2[], x: number, p: number) {
  if (!isPrime(p) || new Set(points.map(v => mod(v[0], p))).size !== points.length) throw new RangeError('Distinct evaluation points in a prime field are required');
  return mod(points.reduce((sum, [xi, yi], i) => {
    let term = yi;
    for (let j = 0; j < points.length; j++) if (i !== j) term = mod(term * mod(x - points[j][0], p) * inverseMod(xi - points[j][0], p), p);
    return sum + term;
  }, 0), p);
}

export function binaryRank(matrix: number[][]): number {
  const a = matrix.map(row => row.map(x => mod(x, 2))); let rank = 0;
  const cols = a[0]?.length ?? 0;
  for (let col = 0; col < cols && rank < a.length; col++) {
    const pivot = a.findIndex((row, i) => i >= rank && row[col] !== 0);
    if (pivot < 0) continue;
    [a[rank], a[pivot]] = [a[pivot], a[rank]];
    for (let row = 0; row < a.length; row++) if (row !== rank && a[row][col]) for (let j = col; j < cols; j++) a[row][j] ^= a[rank][j];
    rank++;
  }
  return rank;
}
export type Triangle = [number, number, number];
export function simplicialComplex(points: Vec2[], faces: Triangle[]) {
  const vertices = [...new Set(faces.flat())].sort((a, b) => a - b);
  const edges: Edge[] = [], edgeIndex = new Map<string, number>();
  const key = (a: number, b: number) => `${Math.min(a, b)},${Math.max(a, b)}`;
  for (const [a, b, c] of faces) for (const [u, v] of [[a, b], [b, c], [c, a]]) if (!edgeIndex.has(key(u, v))) { edgeIndex.set(key(u, v), edges.length); edges.push([Math.min(u, v), Math.max(u, v)]); }
  const d1 = vertices.map(v => edges.map(([a, b]) => Number(v === a || v === b)));
  const d2 = edges.map(([u, v]) => faces.map(face => Number(face.includes(u) && face.includes(v))));
  const r1 = binaryRank(d1), r2 = binaryRank(d2);
  const boundarySquaredZero = d1.every(row => faces.every((_, j) => row.reduce((s, a, k) => s + a * d2[k][j], 0) % 2 === 0));
  return { points, vertices, edges, faces, d1, d2, betti: [vertices.length - r1, edges.length - r1 - r2, faces.length - r2], boundarySquaredZero };
}
export function squareComplex(mode: 'filled' | 'hole' | 'cut' | 'separate') {
  const points: Vec2[] = []; for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) points.push([x, y]);
  const faces: Triangle[] = [];
  for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) {
    if (mode === 'hole' && x === 1 && y === 1) continue;
    if (mode === 'cut' && y === 1 && x <= 1) continue;
    if (mode === 'separate' && x === 1) continue;
    const a = y * 4 + x, b = a + 1, c = a + 4, d = c + 1; faces.push([a, b, d], [a, d, c]);
  }
  return simplicialComplex(points, faces);
}

export function components(vertexCount: number, edges: Edge[]) {
  const parent = Array.from({ length: vertexCount }, (_, i) => i);
  const find = (x: number): number => parent[x] === x ? x : (parent[x] = find(parent[x]));
  let count = vertexCount; const cycles: number[] = [];
  edges.forEach(([a, b], i) => { const u = find(a), v = find(b); if (u === v) cycles.push(i); else { parent[u] = v; count--; } });
  return { count, rank: vertexCount - count, independent: cycles.length === 0, cycles };
}
export function shortestPath(vertexCount: number, edges: WeightedEdge[], source: number, target: number, algorithm: 'bfs' | 'dijkstra') {
  if (edges.some(([u, v, w]) => u < 0 || v < 0 || u >= vertexCount || v >= vertexCount || !Number.isFinite(w) || w < 0)) throw new RangeError('Dijkstra requires finite nonnegative edge costs');
  const distance = Array(vertexCount).fill(Infinity), parent = Array(vertexCount).fill(-1), parentCost = Array(vertexCount).fill(0), visited: number[] = [], settled = new Set<number>();
  distance[source] = 0;
  while (settled.size < vertexCount) {
    let u = -1; for (let i = 0; i < vertexCount; i++) if (!settled.has(i) && (u < 0 || distance[i] < distance[u])) u = i;
    if (u < 0 || !Number.isFinite(distance[u])) break;
    visited.push(u); settled.add(u);
    for (const [a, b, w] of edges) {
      const v = a === u ? b : b === u ? a : -1;
      if (v < 0 || settled.has(v)) continue;
      const next = distance[u] + (algorithm === 'bfs' ? 1 : w);
      if (next < distance[v]) { distance[v] = next; parent[v] = u; parentCost[v] = w; }
    }
  }
  const path: number[] = []; let v = target;
  if (Number.isFinite(distance[v])) { while (v !== -1) { path.unshift(v); v = parent[v]; } }
  const cost = path.slice(1).reduce((sum, v) => sum + parentCost[v], 0);
  return { distance, parent, visited, path, cost };
}

/** Mulberry32: deterministic pseudorandomness, used only for labelled simulations. */
export function randomGenerator(seed: number) { let a = seed >>> 0; return () => { a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export function brownianPaths(seed: number, count: number, steps: number): Vec2[][] {
  if (![16, 64, 256].includes(steps)) throw new RangeError('Supported nested grids: 16, 64, 256');
  const random = randomGenerator(seed); const paths: Vec2[][] = [];
  for (let p = 0; p < count; p++) {
    const fine = [0];
    for (let i = 1; i <= 256; i++) { const u = Math.max(Number.EPSILON, random()); const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random()); fine.push(fine[i - 1] + z / 16); }
    paths.push(Array.from({ length: steps + 1 }, (_, i) => [i / steps, fine[i * 256 / steps]]));
  }
  return paths;
}
export function fourierSquare(x: number, terms: number) { let y = 0; for (let k = 0; k < terms; k++) y += Math.sin((2 * k + 1) * x) / (2 * k + 1); return 4 * y / Math.PI; }
export function gradientPath(lambda: number, eta: number, iterations: number, start: Vec2 = [2.6, 2.1]) {
  if (lambda <= 0 || eta < 0 || iterations < 0) throw new RangeError('Positive definite quadratic, nonnegative step and iterations required');
  const points: Vec2[] = [start]; for (let i = 0; i < iterations; i++) { const [x, y] = points[i]; points.push([(1 - eta * lambda) * x, (1 - eta) * y]); }
  return { points, stable: eta > 0 && eta < 2 / Math.max(lambda, 1), radius: Math.max(Math.abs(1 - eta * lambda), Math.abs(1 - eta)), value: ([x, y]: Vec2) => (lambda * x * x + y * y) / 2 };
}
export function complexMultiply([a, b]: Vec2, [c, d]: Vec2): Vec2 { return [a * c - b * d, a * d + b * c]; }
export function cantorIntervals(depth: number): Vec2[] {
  if (!Number.isInteger(depth) || depth < 0 || depth > 12) throw new RangeError('Finite construction depth required');
  let intervals: Vec2[] = [[0, 1]];
  for (let i = 0; i < depth; i++) intervals = intervals.flatMap(([a, b]) => { const d = (b - a) / 3; return [[a, a + d], [b - d, b]] as Vec2[]; });
  return intervals;
}
export function typeApplication(functionType: [string, string], argumentType: string) { return functionType[0] === argumentType ? { valid: true, result: functionType[1] } : { valid: false, result: null }; }
export function squareCommutes(f: number[], g: number[], h: number[], k: number[]) { return f.every((fx, x) => g[fx] === k[h[x]]); }
export function monotoneMap(values: number[]) { return values.every((v, i) => i === 0 || values[i - 1] <= v); }
