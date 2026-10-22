import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ObjectLab from '../src/labs/ObjectLab';
import { coordinates, PALETTE, TEXT_PALETTE, labelInk } from '../src/labs/common';
import {
  binaryRank, brownianPaths, cantorIntervals, complexMultiply, components, cubicBranches,
  dihedralCompose, dihedralPoint, ellipticAdd, ellipticDiscriminant, fourierSquare,
  gradientPath, interpolateMod, inverseMod, isPrime, mod, monotoneMap, polynomialMod,
  shortestPath, sieve, squareCommutes, squareComplex, typeApplication,
  type Dihedral, type Vec2, type WeightedEdge,
} from '../src/labs/models';
import { angleDeficits, surfaceMesh } from '../src/labs/surface-models';

describe('sieve invariants', () => {
  it('starts each elimination at p² and preserves the prime itself', () => {
    const first = sieve(120, 1);
    expect(first.removed.get(4)).toBe(2);
    expect(first.removed.has(2)).toBe(false);
    expect(first.removed.has(3)).toBe(false);
    expect(first.survivors).toContain(9);
    expect(first.complete).toBe(false);
    const second = sieve(120, 2);
    expect(second.removed.get(6)).toBe(2);
    expect(second.removed.get(9)).toBe(3);
    expect(second.survivors).toContain(3);
  });
  it('finishes with precisely the known primes, including square-boundary handling', () => {
    const complete = sieve(120, 100);
    expect(complete.survivors).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113]);
    expect(complete.complete).toBe(true);
    expect(sieve(121, 4).survivors).toContain(121);
    expect(sieve(121, 5).removed.get(121)).toBe(11);
    expect([0, 1, -3, 2.5, 9, 121].some(isPrime)).toBe(false);
  });
});

describe('algebraic structures', () => {
  const group: Dihedral[] = [false, true].flatMap(reflection => [0, 1, 2, 3].map(rotation => ({ reflection, rotation })));
  it('D₄ composition agrees with applying the two spatial transformations', () => {
    for (const a of group) for (const b of group) {
      expect(dihedralPoint(dihedralCompose(a, b), [2, 1])).toEqual(dihedralPoint(a, dihedralPoint(b, [2, 1])));
    }
    expect(new Set(group.map(g => dihedralPoint(g, [2, 1]).join(','))).size).toBe(8);
    const r = { rotation: 1, reflection: false }, s = { rotation: 0, reflection: true };
    expect(dihedralCompose(s, s)).toEqual({ rotation: 0, reflection: false });
    expect(dihedralCompose(r, s)).not.toEqual(dihedralCompose(s, r));
    expect(dihedralCompose(dihedralCompose(r, r), dihedralCompose(r, r))).toEqual({ rotation: 0, reflection: false });
  });
  it('elliptic secants, tangents and inverse pairs obey the smooth-curve group rule', () => {
    const p: Vec2 = [0, 1], q: Vec2 = [1, 1];
    expect(ellipticAdd(p, q, -1)).toEqual([-1, -1]);
    expect(ellipticAdd(p, p, -1)).toEqual([0.25, -0.875]);
    expect(ellipticAdd(p, [0, -1], -1)).toBeNull();
    expect(ellipticAdd(null, p, -1)).toEqual(p);
    for (const point of [ellipticAdd(p, q, -1), ellipticAdd(p, p, -1)]) {
      expect(point).not.toBeNull();
      const [x, y] = point!;
      expect(y * y).toBeCloseTo(x ** 3 - x + 1, 12);
    }
    expect(ellipticDiscriminant(-1, 1)).toBe(-368);
    expect(ellipticDiscriminant(0, 0)).toBeCloseTo(0, 12);
  });
  it.each([[-1, 1], [0, 0]])('joins both real cubic branches at y=0 for a=%s, b=%s', (a, b) => {
    const branches = cubicBranches(a, b, -2.1, 2.3, 2.6);
    expect(branches).toHaveLength(2);
    const [upper, lower] = branches;
    expect(upper[0]).toEqual(lower[0]);
    expect(upper[0][1]).toBe(0);
    const root = upper[0][0];
    expect(Math.abs(root ** 3 + a * root + b)).toBeLessThan(1e-12);
    if (a === -1) expect(root).toBeCloseTo(-1.324717957244746, 12);
    else expect(root).toBe(0);
    expect(upper.at(-1)![1]).toBe(2.6);
    expect(lower.at(-1)![1]).toBe(-2.6);
    for (const [x, y] of branches.flat()) {
      expect(x).toBeGreaterThanOrEqual(-2.1);
      expect(x).toBeLessThanOrEqual(2.3);
      expect(Math.abs(y)).toBeLessThanOrEqual(2.6);
      expect(Math.abs(y ** 2 - (x ** 3 + a * x + b))).toBeLessThan(1e-12);
    }
  });
  it('retains three cubic roots and two components even with a coarse sampling grid', () => {
    const branches = cubicBranches(-1, 0, -2.1, 2.3, 2.6, 2);
    expect(branches).toHaveLength(4);
    expect(branches[0][0][0]).toBeCloseTo(-1, 12);
    expect(branches[0].at(-1)![0]).toBeCloseTo(0, 12);
    expect(branches[1][0][0]).toBeCloseTo(1, 12);
    expect(branches[0][0][1]).toBe(0);
    expect(branches[0].at(-1)![1]).toBe(0);
    expect(branches[1][0][1]).toBe(0);
    expect(branches[2][0]).toEqual(branches[0][0]);
    expect(branches[3][0]).toEqual(branches[1][0]);
  });
  it('three distinct finite-field evaluations uniquely recover every degree ≤ 2 codeword', () => {
    for (const p of [5, 7, 11]) {
      for (let a = 1; a < p; a++) expect(mod(a * inverseMod(a, p), p)).toBe(1);
      const coefficients = [p - 1, 2, 3];
      const points: Vec2[] = [0, 2, p - 1].map(x => [x, polynomialMod(coefficients, x, p)]);
      for (let x = 0; x < p; x++) expect(interpolateMod(points, x, p)).toBe(polynomialMod(coefficients, x, p));
    }
    expect(() => inverseMod(0, 7)).toThrow();
    expect(() => inverseMod(2, 9)).toThrow();
    expect(() => interpolateMod([[0, 1], [7, 2]], 3, 7)).toThrow();
    // Two samples do not identify a quadratic: x(x−1) vanishes at both sample points.
    expect([0, 1].map(x => polynomialMod([0, -1, 1], x, 7))).toEqual([0, 0]);
    expect(polynomialMod([0, -1, 1], 2, 7)).not.toBe(0);
  });
});

describe('topological computations', () => {
  it('computes rank over F₂ rather than over the reals', () => {
    expect(binaryRank([[1, 1, 0], [1, 0, 1], [0, 1, 1]])).toBe(2);
    expect(binaryRank([[1, 0], [0, 1]])).toBe(2);
    expect(binaryRank([])).toBe(0);
  });
  it.each([
    ['filled', [1, 0, 0]], ['hole', [1, 1, 0]],
    ['cut', [1, 0, 0]], ['separate', [2, 0, 0]],
  ] as const)('has the expected homology for the %s mesh', (mode, betti) => {
    const complex = squareComplex(mode);
    expect(complex.betti).toEqual(betti);
    expect(complex.boundarySquaredZero).toBe(true);
    expect(complex.vertices.length - complex.edges.length + complex.faces.length).toBe(betti[0] - betti[1] + betti[2]);
  });
  it.each(['tetrahedron', 'octahedron', 'torus'] as const)('satisfies discrete Gauss–Bonnet on the closed %s mesh', kind => {
    for (const radius of [0.3, 0.62, 0.9]) {
      const mesh = surfaceMesh(kind, radius), curvature = angleDeficits(mesh);
      expect(curvature.euler).toBe(kind === 'torus' ? 0 : 2);
      expect(curvature.total).toBeCloseTo(2 * Math.PI * curvature.euler, 10);
      if (kind === 'torus') {
        expect(curvature.deficits.some(k => k > 1e-5)).toBe(true);
        expect(curvature.deficits.some(k => k < -1e-5)).toBe(true);
      }
    }
  });
});

describe('graph algorithms and matroid independence', () => {
  it('distinguishes the fewest edges from the least total nonnegative cost', () => {
    const edges: WeightedEdge[] = [[0, 3, 10], [0, 1, 1], [1, 2, 1], [2, 3, 1]];
    expect(shortestPath(4, edges, 0, 3, 'bfs').path).toEqual([0, 3]);
    const weighted = shortestPath(4, edges, 0, 3, 'dijkstra');
    expect(weighted.path).toEqual([0, 1, 2, 3]);
    expect(weighted.cost).toBe(3);
    expect(weighted.distance[3]).toBe(3);
  });
  it('keeps the actual edge cost on parallel edges and handles disconnected vertices', () => {
    const parallel = shortestPath(3, [[0, 1, 10], [0, 1, 1]], 0, 1, 'dijkstra');
    expect(parallel.cost).toBe(1);
    expect(parallel.cost).toBe(parallel.distance[1]);
    expect(shortestPath(3, [[0, 1, 1]], 0, 2, 'dijkstra').path).toEqual([]);
    expect(() => shortestPath(2, [[0, 1, -1]], 0, 1, 'dijkstra')).toThrow();
  });
  it('graphic rank is |V|−components; cycles destroy independence', () => {
    const tree = components(4, [[0, 1], [0, 2], [0, 3]]);
    expect(tree).toMatchObject({ count: 1, rank: 3, independent: true });
    const cycle = components(4, [[0, 1], [1, 2], [2, 0]]);
    expect(cycle).toMatchObject({ count: 2, rank: 2, independent: false });
    expect(cycle.cycles).toHaveLength(1);
    expect(components(4, []).rank).toBe(0);
  });
});

describe('finite analytic windows', () => {
  it('Brownian grid refinements preserve the same coupled sample at coarse times', () => {
    const fine = brownianPaths(42, 3, 256), coarse = brownianPaths(42, 3, 16);
    expect(brownianPaths(42, 3, 16)).toEqual(coarse);
    for (let path = 0; path < 3; path++) {
      expect(coarse[path][0]).toEqual([0, 0]);
      for (let t = 0; t <= 16; t++) expect(coarse[path][t]).toEqual(fine[path][t * 16]);
    }
    expect(brownianPaths(43, 3, 16)).not.toEqual(coarse);
    expect(() => brownianPaths(42, 1, 20)).toThrow();
  });
  it('Fourier sums have the target odd symmetry and jump midpoint', () => {
    expect(fourierSquare(Math.PI / 2, 1)).toBeCloseTo(4 / Math.PI, 12);
    for (const n of [1, 4, 25]) {
      expect(fourierSquare(0, n)).toBe(0);
      for (const x of [0.13, 1.3, 2.7]) expect(fourierSquare(-x, n)).toBeCloseTo(-fourierSquare(x, n), 12);
    }
    expect(Math.abs(fourierSquare(Math.PI / 2, 25) - 1)).toBeLessThan(0.02);
    // A jump-neighbourhood retains Gibbs overshoot even at this finer truncation.
    expect(fourierSquare(Math.PI / 50, 25)).toBeGreaterThan(1.17);
  });
  it('the exact quadratic iteration contracts below and loses stability at the spectral boundary', () => {
    const stable = gradientPath(5, 0.18, 20);
    expect(stable.stable).toBe(true);
    expect(stable.radius).toBeLessThan(1);
    for (let i = 1; i < stable.points.length; i++) expect(stable.value(stable.points[i])).toBeLessThan(stable.value(stable.points[i - 1]));
    expect(gradientPath(5, 0.4, 10).stable).toBe(false);
    expect(gradientPath(5, 0.4, 10).radius).toBe(1);
    const unstable = gradientPath(5, 0.6, 8);
    expect(unstable.value(unstable.points[8])).toBeGreaterThan(unstable.value(unstable.points[0]));
    expect(gradientPath(2, 0.25, 1, [2, 4]).points[1]).toEqual([1, 3]);
  });
  it('complex multiplication preserves the norm product and rotates by i', () => {
    expect(complexMultiply([0, 1], [3, 4])).toEqual([-4, 3]);
    const z: Vec2 = [2, -3], w: Vec2 = [-4, 0.5], product = complexMultiply(z, w);
    expect(Math.hypot(...product)).toBeCloseTo(Math.hypot(...z) * Math.hypot(...w), 12);
    const c = coordinates(-4.875, 4.875, -3, 3, 640, 420);
    expect(c.x(1) - c.x(0)).toBeCloseTo(c.y(0) - c.y(1), 12);
  });
  it('finite Cantor stages retain exactly 2ⁿ intervals with total length (2/3)ⁿ', () => {
    for (let depth = 0; depth <= 6; depth++) {
      const intervals = cantorIntervals(depth);
      expect(intervals).toHaveLength(2 ** depth);
      expect(intervals.reduce((sum, [a, b]) => sum + b - a, 0)).toBeCloseTo((2 / 3) ** depth, 12);
      expect(intervals[0][0]).toBe(0);
      expect(intervals.at(-1)![1]).toBe(1);
      if (depth > 0) expect(intervals.every(([a, b]) => b <= 1 / 3 || a >= 2 / 3)).toBe(true);
    }
    expect(() => cantorIntervals(-1)).toThrow();
  });
});

describe('typed composition and functor constraints', () => {
  it('rejects an application with a mismatched argument type', () => {
    expect(typeApplication(['A', 'B'], 'A')).toEqual({ valid: true, result: 'B' });
    expect(typeApplication(['A', 'B'], 'C')).toEqual({ valid: false, result: null });
  });
  it('checks commuting maps on every source element, not only a highlighted example', () => {
    expect(squareCommutes([1, 2, 0], [2, 0, 1], [0, 1, 2], [0, 1, 2])).toBe(true);
    expect(squareCommutes([1, 2, 0], [2, 0, 1], [0, 1, 2], [0, 2, 1])).toBe(false);
    expect(monotoneMap([0, 0, 2])).toBe(true);
    expect(monotoneMap([2, 1, 0])).toBe(false);
  });
});

describe('lab rendering contract', () => {
  const keys = ['sieve', 'elliptic', 'group', 'topology', 'homology', 'graph', 'probability', 'fourier', 'finitefield', 'optimization', 'matroid', 'complex', 'logic', 'fractal', 'geometry', 'category'];
  it.each(keys)('%s renders a mathematical SVG and operable controls in both languages', labKey => {
    for (const language of ['zh', 'en'] as const) {
      const markup = renderToStaticMarkup(createElement(ObjectLab, { labKey, language }));
      expect(markup).toContain('<svg');
      expect(markup).toContain('<title>');
      expect(markup).toMatch(/<(input|select|button)\b/);
      expect(markup).not.toMatch(/(?:NaN|Infinity)/);
      expect(markup).toContain('lab-note');
    }
  });
});

describe('readable mathematical labels', () => {
  const luminance = (hex: string) => {
    const linear = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  };
  const contrast = (a: string, b: string) => {
    const [dark, light] = [luminance(a), luminance(b)].sort((x, y) => x - y);
    return (light + 0.05) / (dark + 0.05);
  };
  it('uses a distinct text palette with at least 4.5:1 contrast on every light chart surface', () => {
    for (const color of Object.values(TEXT_PALETTE)) for (const surface of ['#f7f6ec', '#fbfaf4', '#e8e8dd', '#e4e9d9']) expect(contrast(color, surface)).toBeGreaterThanOrEqual(4.5);
    expect(labelInk(PALETTE.coral)).toBe(TEXT_PALETTE.coral);
    expect(labelInk(PALETTE.gold)).toBe(TEXT_PALETTE.gold);
  });
  it('keeps numbered D₄ vertices readable against their actual colored backgrounds', () => {
    expect(contrast('#ffffff', PALETTE.teal)).toBeGreaterThanOrEqual(4.5);
    for (const color of [PALETTE.coral, PALETTE.gold, PALETTE.purple]) expect(contrast('#111111', color)).toBeGreaterThanOrEqual(4.5);
  });
});
