import { binaryRank } from '../labs/models';

export type Edge = readonly [number, number];
export type Face = readonly [number, number, number];
export type Vector2 = [number, number];
export type Matrix2 = [[number, number], [number, number]];
export const K4_EDGES: readonly Edge[] = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
export const K4_FACES: readonly Face[] = [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]];
export const edgeName = (id: number) => K4_EDGES[id].map(v => 'ABCD'[v]).join('');
export const faceName = (id: number) => K4_FACES[id].map(v => 'ABCD'[v]).join('');
export const faceEdges = (id: number) => K4_EDGES.flatMap(([a, b], i) => K4_FACES[id].includes(a) && K4_FACES[id].includes(b) ? [i] : []);

function ids(values: number[], limit: number, name: string) {
  if (new Set(values).size !== values.length || values.some(v => !Number.isInteger(v) || v < 0 || v >= limit)) throw new RangeError(`${name} must contain distinct valid indices`);
  return [...values].sort((a, b) => a - b);
}
export const binaryProduct = (matrix: number[][], vector: number[]) => matrix.map(row => row.reduce((sum, x, i) => sum + x * vector[i], 0) % 2);
const fromMask = (mask: number, length: number) => Array.from({ length }, (_, i) => (mask >> i) & 1);
const toMask = (values: number[]) => values.reduce((mask, x, i) => mask | ((x & 1) << i), 0);

/** Four vertices are retained even when isolated. There are no 3-simplices. */
export function k4Homology(selectedEdges: number[], selectedFaces: number[], selectedChain: number[]) {
  const edges = ids(selectedEdges, 6, 'Edges'), faces = ids(selectedFaces, 4, 'Faces'), chain = ids(selectedChain, 6, 'Chain');
  if (faces.some(f => faceEdges(f).some(e => !edges.includes(e)))) throw new RangeError('Every selected face requires all three boundary edges');
  if (chain.some(e => !edges.includes(e))) throw new RangeError('A chain can use only edges of the complex');
  const d1 = Array.from({ length: 4 }, (_, v) => edges.map(e => Number(K4_EDGES[e].includes(v))));
  const d2 = edges.map(e => faces.map(f => Number(faceEdges(f).includes(e))));
  const rank1 = binaryRank(d1), rank2 = binaryRank(d2), betti = [4 - rank1, edges.length - rank1 - rank2, faces.length - rank2];
  const boundarySquared = d1.map(row => faces.map((_, j) => row.reduce((s, x, i) => s + x * d2[i][j], 0) % 2));
  const chainVector = edges.map(e => Number(chain.includes(e))), boundaryVector = binaryProduct(d1, chainVector), cycle = boundaryVector.every(v => v === 0);
  const boundaryWitnesses = new Map<number, number[]>();
  for (let mask = 0; mask < 2 ** faces.length; mask++) {
    const coefficients = fromMask(mask, faces.length), boundary = toMask(binaryProduct(d2, coefficients));
    if (!boundaryWitnesses.has(boundary)) boundaryWitnesses.set(boundary, faces.filter((_, i) => coefficients[i] === 1));
  }
  const boundaries = [...boundaryWitnesses.keys()].sort((a, b) => a - b);
  const cycles: number[] = [];
  for (let mask = 0; mask < 2 ** edges.length; mask++) if (binaryProduct(d1, fromMask(mask, edges.length)).every(v => v === 0)) cycles.push(mask);
  const classKey = (mask: number) => Math.min(...boundaries.map(b => mask ^ b));
  const classes = [...new Set(cycles.map(classKey))].sort((a, b) => a - b).map(mask => ({ mask, representative: edges.filter((_, i) => (mask >> i) & 1), members: cycles.filter(c => classKey(c) === mask).length }));
  const mask = toMask(chainVector), isBoundary = boundaryWitnesses.has(mask);
  return { edges, faces, chain, d1, d2, rank1, rank2, betti, boundarySquared, chainVector, boundaryVector, cycle, isBoundary,
    boundaryWitness: boundaryWitnesses.get(mask) ?? null, cycles, boundaries, classes,
    classIndex: cycle ? classes.findIndex(c => c.mask === classKey(mask)) : null };
}

function d4Index(index: number) { if (!Number.isInteger(index) || index < 0 || index > 7) throw new RangeError('D₄ has indices 0 through 7'); return index; }
const quarterTurns: Matrix2[] = [[[1, 0], [0, 1]], [[0, -1], [1, 0]], [[-1, 0], [0, -1]], [[0, 1], [-1, 0]]];
export function multiplyMatrix(a: Matrix2, b: Matrix2): Matrix2 {
  return [[a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]], [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]]].map(row => row.map(v => v === 0 ? 0 : v)) as Matrix2;
}
export function d4Representation(index: number): Matrix2 {
  d4Index(index);
  return multiplyMatrix(quarterTurns[index % 4], [[1, 0], [0, index >= 4 ? -1 : 1]]);
}
/** A∘B: B acts first. Elements are rᵏsᵋ, s(z)=conj(z). */
export function d4Compose(a: number, b: number) {
  d4Index(a); d4Index(b);
  return ((a % 4 + (a >= 4 ? -1 : 1) * (b % 4)) % 4 + 4) % 4 + (Number((a >= 4) !== (b >= 4)) * 4);
}
export function actMatrix(matrix: Matrix2, [x, y]: Vector2): Vector2 { return [matrix[0][0] * x + matrix[0][1] * y, matrix[1][0] * x + matrix[1][1] * y].map(v => v === 0 ? 0 : v) as Vector2; }
export function complexD4Action(index: number, [x, y]: Vector2): Vector2 {
  d4Index(index); if (![x, y].every(Number.isFinite)) throw new RangeError('Finite complex coordinates required');
  const conjugatedY = index >= 4 ? -y : y;
  const [re, im] = [[1, 0], [0, 1], [-1, 0], [0, -1]][index % 4];
  return [re * x - im * conjugatedY, im * x + re * conjugatedY].map(v => v === 0 ? 0 : v) as Vector2;
}
export const d4Name = (index: number) => { d4Index(index); return `${['', 'r', 'r²', 'r³'][index % 4]}${index >= 4 ? 's' : ''}` || 'e'; };
export function representationState(a: number, b: number, z: Vector2) {
  const ab = d4Compose(a, b), ba = d4Compose(b, a), matrixA = d4Representation(a), matrixB = d4Representation(b);
  const matrixAB = multiplyMatrix(matrixA, matrixB), matrixBA = multiplyMatrix(matrixB, matrixA), afterAB = complexD4Action(ab, z), afterBA = complexD4Action(ba, z);
  return { a, b, z, ab, ba, matrixA, matrixB, matrixAB, matrixBA, afterA: complexD4Action(a, z), afterB: complexD4Action(b, z), afterAB, afterBA,
    matricesCommute: ab === ba, thisVectorAgrees: afterAB.every((v, i) => v === afterBA[i]),
    representationHolds: matrixAB.flat().every((v, i) => v === d4Representation(ab).flat()[i]),
    actionAgrees: afterAB.every((v, i) => v === actMatrix(matrixAB, z)[i]), determinant: matrixAB[0][0] * matrixAB[1][1] - matrixAB[0][1] * matrixAB[1][0] };
}
