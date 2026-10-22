import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { GraphHomologyLab, SymmetryRepresentationLab } from '../src/connections/DiscreteConnections';
import { actMatrix, complexD4Action, d4Compose, d4Representation, faceEdges, k4Homology, multiplyMatrix, representationState, type Matrix2, type Vector2 } from '../src/connections/discrete-models';

describe('a graph becomes a chain complex', () => {
  const allEdges = [0, 1, 2, 3, 4, 5], abc = [0, 1, 3];
  it('distinguishes a nonbounding graph cycle from the same chain after its face is filled', () => {
    const graph = k4Homology(allEdges, [], abc), filled = k4Homology(allEdges, [0], abc);
    expect(graph.betti).toEqual([1, 3, 0]);
    expect(graph.cycle).toBe(true);
    expect(graph.isBoundary).toBe(false);
    expect(graph.classIndex).not.toBe(0);
    expect(filled.betti).toEqual([1, 2, 0]);
    expect(filled.chainVector).toEqual(graph.chainVector);
    expect(filled.isBoundary).toBe(true);
    expect(filled.classIndex).toBe(0);
    expect(filled.boundaryWitness).toEqual([0]);
  });
  it('keeps isolated vertices and refuses a homology class for a noncycle', () => {
    expect(k4Homology([], [], []).betti).toEqual([4, 0, 0]);
    const edge = k4Homology([0], [], [0]);
    expect(edge.betti).toEqual([3, 0, 0]);
    expect(edge.boundaryVector).toEqual([1, 1, 0, 0]);
    expect(edge.cycle).toBe(false);
    expect(edge.classIndex).toBeNull();
    expect(edge.isBoundary).toBe(false);
  });
  it('the four faces form a 2-sphere; removing any face gives a contractible disk', () => {
    expect(k4Homology(allEdges, [0, 1, 2, 3], abc).betti).toEqual([1, 0, 1]);
    for (let missing = 0; missing < 4; missing++) expect(k4Homology(allEdges, [0, 1, 2, 3].filter(f => f !== missing), abc).betti).toEqual([1, 0, 0]);
    expect(k4Homology([0, 1, 2], [], []).betti).toEqual([1, 0, 0]);
  });
  it('checks boundary², Euler characteristic and quotient sizes for every admissible K4 subcomplex', () => {
    let checked = 0;
    for (let edgeMask = 0; edgeMask < 64; edgeMask++) {
      const edges = allEdges.filter(i => (edgeMask >> i) & 1);
      const availableFaces = [0, 1, 2, 3].filter(f => faceEdges(f).every(e => edges.includes(e)));
      for (let faceMask = 0; faceMask < 2 ** availableFaces.length; faceMask++) {
        const faces = availableFaces.filter((_, i) => (faceMask >> i) & 1), m = k4Homology(edges, faces, []);
        expect(m.boundarySquared.flat().every(x => x === 0)).toBe(true);
        expect(4 - edges.length + faces.length).toBe(m.betti[0] - m.betti[1] + m.betti[2]);
        expect(m.classes).toHaveLength(2 ** m.betti[1]);
        expect(m.boundaries).toHaveLength(2 ** m.rank2);
        expect(m.classes.every(c => c.members === m.boundaries.length)).toBe(true);
        expect(m.classes.reduce((sum, c) => sum + c.members, 0)).toBe(m.cycles.length);
        checked++;
      }
    }
    expect(checked).toBe(113);
  });
  it('rejects duplicate or invalid indices and faces or chains outside the complex', () => {
    for (const edges of [[0, 0], [6], [-1], [0.5]]) expect(() => k4Homology(edges, [], [])).toThrow();
    expect(() => k4Homology(allEdges, [0, 0], [])).toThrow();
    expect(() => k4Homology(allEdges, [4], [])).toThrow();
    expect(() => k4Homology(allEdges, [], [0, 0])).toThrow();
    expect(() => k4Homology([0, 1], [0], [])).toThrow();
    expect(() => k4Homology([0], [], [1])).toThrow();
  });
});

describe('D4 as complex maps and real matrices', () => {
  const identity: Matrix2 = [[1, 0], [0, 1]];
  it('rotates by i and conjugates across the real axis in the declared convention', () => {
    expect(d4Representation(1)).toEqual([[0, -1], [1, 0]]);
    expect(d4Representation(4)).toEqual([[1, 0], [0, -1]]);
    expect(complexD4Action(1, [2, 3])).toEqual([-3, 2]);
    expect(complexD4Action(4, [2, 3])).toEqual([2, -3]);
    expect(d4Compose(1, 4)).toBe(5);
    expect(d4Compose(4, 1)).toBe(7);
  });
  it('has eight distinct orthogonal matrices and obeys all 64 multiplication identities', () => {
    expect(new Set(Array.from({ length: 8 }, (_, i) => d4Representation(i).flat().join(','))).size).toBe(8);
    for (let a = 0; a < 8; a++) {
      const m = d4Representation(a), transpose: Matrix2 = [[m[0][0], m[1][0]], [m[0][1], m[1][1]]];
      expect(multiplyMatrix(transpose, m)).toEqual(identity);
      for (let b = 0; b < 8; b++) {
        expect(multiplyMatrix(m, d4Representation(b))).toEqual(d4Representation(d4Compose(a, b)));
        for (const z of [[1.25, -0.5], [0, 0], [-2, 2]] as Vector2[]) {
          expect(complexD4Action(a, complexD4Action(b, z))).toEqual(complexD4Action(d4Compose(a, b), z));
          expect(actMatrix(d4Representation(d4Compose(a, b)), z)).toEqual(complexD4Action(d4Compose(a, b), z));
        }
      }
    }
  });
  it('does not infer equality of operations from a shared image of the zero vector', () => {
    const m = representationState(1, 4, [0, 0]);
    expect(m.thisVectorAgrees).toBe(true);
    expect(m.matricesCommute).toBe(false);
    expect(m.matrixAB).not.toEqual(m.matrixBA);
    expect(m.representationHolds).toBe(true);
  });
  it('conjugation is real-linear but fails complex linearity', () => {
    const z: Vector2 = [1, 2], iz: Vector2 = [-2, 1];
    const conjugate = complexD4Action(4, z), iConjugate: Vector2 = [-conjugate[1], conjugate[0]];
    expect(complexD4Action(4, iz)).not.toEqual(iConjugate);
    expect(complexD4Action(4, [2, 4])).toEqual([2, -4]);
    expect(() => d4Representation(8)).toThrow();
    expect(() => complexD4Action(0, [Infinity, 0])).toThrow();
  });
});

describe('connection rendering', () => {
  it.each([GraphHomologyLab, SymmetryRepresentationLab])('renders two mathematical domains and native controls in both languages', Component => {
    for (const language of ['zh', 'en'] as const) {
      const markup = renderToStaticMarkup(createElement(Component, { language }));
      expect(markup.match(/<svg /g)).toHaveLength(2);
      expect(markup).toContain('<table');
      expect(markup).toContain('<button');
      expect(markup).toContain('dc-boundary');
      expect(markup).not.toMatch(/NaN|Infinity/);
    }
  });
});
