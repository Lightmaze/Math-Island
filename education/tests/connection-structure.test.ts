import { describe, expect, it } from 'vitest';
import { coveringLift, extendedPolyGcd, idealZeroModel, normalizePolynomial, parseCoefficients, polyAdd, polyDivmod, polyMultiply, polynomialDegree, IDEAL_PRESETS } from '../src/connections/structure-models';

describe('Continuous lifts retain winding history', () => {
  it('projects every sampled lifted point to the base, for all starting fibres and both orientations', () => {
    for (let n = 2; n <= 8; n++) for (let k = 0; k < n; k++) for (const m of [-8, -3, 0, 1, 8]) {
      const model = coveringLift(n, k, m, 0.73);
      for (const sample of model.samples) {
        expect(Math.cos(n * sample.liftAngle)).toBeCloseTo(sample.base[0], 11);
        expect(Math.sin(n * sample.liftAngle)).toBeCloseTo(sample.base[1], 11);
      }
      expect(model.currentBaseClosed).toBe(m === 0);
      expect(model.projectionError).toBeLessThan(1e-12);
    }
  });
  it('distinguishes a closed base loop from a nonclosed lift and retains the selected start', () => {
    const single = coveringLift(3, 2, 1, 1);
    expect(single.currentBaseClosed).toBe(true); expect(single.currentLiftClosed).toBe(false);
    expect(single.finalIndex).toBe(0); expect(single.permutation).toEqual([1, 2, 0]);
    expect(single.current.liftAngle).toBeCloseTo(2 * Math.PI, 13);
    expect(single.start.lift).not.toEqual([1, 0]);
    const three = coveringLift(3, 2, 3, 1);
    expect(three.finalClosed).toBe(true); expect(three.finalIndex).toBe(2);
    expect(three.current.lift[0]).toBeCloseTo(three.start.lift[0], 13);
    expect(three.current.lift[1]).toBeCloseTo(three.start.lift[1], 13);
  });
  it('has no principal-root jump at either a branch cut or a completed base turn', () => {
    for (const progress of [0.25, 0.5, 0.75]) {
      const before = coveringLift(3, 1, 2, progress - 1e-7).current;
      const after = coveringLift(3, 1, 2, progress + 1e-7).current;
      expect(after.liftAngle - before.liftAngle).toBeGreaterThan(0);
      expect(Math.hypot(after.lift[0] - before.lift[0], after.lift[1] - before.lift[1])).toBeLessThan(1e-5);
    }
    expect(coveringLift(3, 0, 2, 0.5).current.liftAngle).toBeCloseTo(2 * Math.PI / 3, 13);
  });
  it('computes negative monodromy, zero winding, and intermediate closure correctly', () => {
    expect(coveringLift(5, 0, -1, 1).permutation).toEqual([4, 0, 1, 2, 3]);
    expect(coveringLift(5, 3, 0, 0.41).currentLiftClosed).toBe(true);
    expect(coveringLift(3, 0, 6, 0.5).currentLiftClosed).toBe(true);
    const partial = coveringLift(3, 0, 3, 1 / 3);
    expect(partial.currentBaseClosed).toBe(true); expect(partial.currentLiftClosed).toBe(false);
    for (let n = 2; n <= 8; n++) for (let m = -8; m <= 8; m++) expect(coveringLift(n, 0, m, 1).finalClosed).toBe(m % n === 0);
  });
  it('rejects non-finite, fractional and out-of-domain parameters', () => {
    for (const args of [[NaN, 0, 1, 1], [2.5, 0, 1, 1], [3, -1, 1, 1], [3, 3, 1, 1], [3, 0, 1.2, 1], [3, 0, Infinity, 1], [3, 0, 1, -0.1], [3, 0, 1, NaN], [3, 0, 1, 1.01]]) expect(() => coveringLift(...args as [number, number, number, number])).toThrow(RangeError);
  });
});

describe('Polynomial arithmetic over finite fields', () => {
  it('performs a known nontrivial division and normalizes signed coefficients', () => {
    // In F5[x], (x^3 + 2x + 4) = (x^2 + 4x + 3)(x+1) + 1.
    const division = polyDivmod([4, 2, 0, 1], [1, 1], 5);
    expect(division.quotient).toEqual([3, 4, 1]); expect(division.remainder).toEqual([1]);
    expect(normalizePolynomial([-1, 5, 10], 5)).toEqual([4]);
    expect(polyDivmod([0], [1, 1], 5)).toEqual({ quotient: [0], remainder: [0] });
  });
  it('returns exact Bézout coefficients, division identities and decreasing remainder degree', () => {
    const cases: { p: number; f: number[]; g: number[] }[] = IDEAL_PRESETS.map(item => ({ p: item.p, f: [...item.f], g: [...item.g] }));
    cases.push({ p: 7, f: [6, 2, 0, 5, 1], g: [4, 0, 3, 2] });
    for (const { f, g, p } of cases) {
      const result = extendedPolyGcd(f, g, p);
      expect(polyAdd(polyMultiply(result.u, f, p), polyMultiply(result.v, g, p), p)).toEqual(result.gcd);
      for (const step of result.steps) {
        expect(polyAdd(polyMultiply(step.quotient, step.divisor, p), step.remainder, p)).toEqual(step.dividend);
        expect(polynomialDegree(step.remainder)).toBeLessThan(polynomialDegree(step.divisor));
      }
      if (polynomialDegree(result.gcd) >= 0) {
        expect(result.gcd.at(-1)).toBe(1);
        expect(polyDivmod(f, result.gcd, p).remainder).toEqual([0]);
        expect(polyDivmod(g, result.gcd, p).remainder).toEqual([0]);
      }
    }
  });
  it('checks every pair of degree≤1 inputs over F2 and F3, including zero', () => {
    for (const p of [2, 3]) {
      const polynomials = Array.from({ length: p * p }, (_, value) => [value % p, Math.floor(value / p)]);
      for (const f of polynomials) for (const g of polynomials) {
        const model = idealZeroModel(f, g, p);
        expect(model.bezoutValue).toEqual(model.gcd);
        expect(model.commonRoots).toEqual(model.rootsD);
        if (!model.zeroIdeal) {
          expect(polyMultiply(model.quotients!.f, model.gcd, p)).toEqual(model.f);
          expect(polyMultiply(model.quotients!.g, model.gcd, p)).toEqual(model.g);
        }
      }
    }
  });
  it('handles zero ideals, one zero generator, and the unit ideal distinctly', () => {
    const both = idealZeroModel([0], [0], 5);
    expect(both.gcd).toEqual([0]); expect(both.zeroIdeal).toBe(true); expect(both.unitIdeal).toBe(false);
    expect(both.commonRoots).toEqual([0, 1, 2, 3, 4]); expect(both.quotients).toBeNull();
    expect(extendedPolyGcd([0], [2, 2], 5).gcd).toEqual([1, 1]);
    expect(extendedPolyGcd([2, 2], [0], 5).gcd).toEqual([1, 1]);
    const unit = idealZeroModel([1, 0, 1], [1, 1], 5);
    expect(unit.gcd).toEqual([1]); expect(unit.commonRoots).toEqual([]); expect(unit.unitIdeal).toBe(true);
  });
  it('does not identify no rational roots with a unit ideal, or equal roots with equal ideals', () => {
    const invisible = idealZeroModel([1, 0, 1], [1, 1, 1, 1], 3);
    expect(invisible.gcd).toEqual([1, 0, 1]); expect(invisible.commonRoots).toEqual([]); expect(invisible.unitIdeal).toBe(false);
    const repeated = idealZeroModel([1, 3, 1], [1, 3, 1], 5);
    const simple = idealZeroModel([4, 1], [4, 1], 5);
    expect(repeated.commonRoots).toEqual(simple.commonRoots); expect(repeated.gcd).not.toEqual(simple.gcd);
    expect(polyDivmod(simple.gcd, repeated.gcd, 5).remainder).not.toEqual([0]);
    const vanishesEverywhere = idealZeroModel([0, 4, 0, 0, 0, 1], [0], 5); // x^5−x
    expect(vanishesEverywhere.commonRoots).toEqual([0, 1, 2, 3, 4]);
    expect(vanishesEverywhere.zeroIdeal).toBe(false);
  });
  it('rejects composite fields, division by zero and malformed coefficient input', () => {
    for (const p of [0, 1, 4, 9, NaN, Infinity, 2.5]) expect(() => idealZeroModel([1], [0], p)).toThrow(RangeError);
    expect(() => polyDivmod([1, 2], [0, 0], 5)).toThrow(RangeError);
    for (const text of ['', '1,,2', ',1', '1,', '1, 2.5', '1, NaN', 'x²+1', '1,2,3,4,5,6,7,8', '9007199254740992']) expect(() => parseCoefficients(text)).toThrow(RangeError);
    expect(() => parseCoefficients('−1, 2')).toThrow(RangeError); // Unicode minus is not silently reinterpreted.
    expect(parseCoefficients('-1， 2, +3')).toEqual([-1, 2, 3]);
  });
});
