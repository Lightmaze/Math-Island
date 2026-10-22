/** Exact finite-field arithmetic and an analytic unit-circle path lift.
 * Polynomials use ascending coefficients: [a0,a1,...] = a0+a1*x+… .
 */
export type Polynomial = number[];
export type ComplexPoint = [number, number];
const TAU = 2 * Math.PI;
const circle = (angle: number): ComplexPoint => [Math.cos(angle), Math.sin(angle)];
const mod = (a: number, p: number) => ((a % p) + p) % p;

export function coveringLift(n: number, k: number, winding: number, progress: number) {
  if (!Number.isInteger(n) || n < 1 || n > 32) throw new RangeError('Covering degree must be an integer from 1 to 32.');
  if (!Number.isInteger(k) || k < 0 || k >= n) throw new RangeError('The start index must lie in 0,…,n−1.');
  if (!Number.isInteger(winding) || Math.abs(winding) > 32) throw new RangeError('Winding must be an integer from −32 to 32.');
  if (!Number.isFinite(progress) || progress < 0 || progress > 1) throw new RangeError('Progress must lie in [0,1].');
  const pointAt = (t: number) => {
    const turns = winding * t, angle = TAU * turns, liftAngle = TAU * (turns + k) / n;
    return { t, turns, angle, liftAngle, base: circle(angle), lift: circle(liftAngle) };
  };
  const current = pointAt(progress), start = pointAt(0), end = pointAt(1);
  const count = Math.max(48, Math.ceil(Math.abs(winding * progress) * 96));
  const samples = Array.from({ length: count + 1 }, (_, i) => pointAt(progress * i / count));
  const isInteger = (value: number) => Math.abs(value - Math.round(value)) < 1e-10;
  return {
    n, k, winding, progress, start, current, end, samples,
    checkpoints: Array.from({ length: 5 }, (_, i) => pointAt(progress * i / 4)),
    fibre: Array.from({ length: n }, (_, j) => circle(TAU * (current.turns + j) / n)),
    permutation: Array.from({ length: n }, (_, j) => mod(j + winding, n)),
    finalIndex: mod(k + winding, n),
    finalClosed: winding % n === 0,
    currentBaseClosed: isInteger(current.turns),
    currentLiftClosed: isInteger(current.turns / n),
    projectionError: Math.hypot(Math.cos(n * current.liftAngle) - current.base[0], Math.sin(n * current.liftAngle) - current.base[1]),
  };
}

function assertPrime(p: number) {
  if (!Number.isInteger(p) || p < 2 || p > 101) throw new RangeError('The field characteristic must be a prime from 2 to 101.');
  for (let d = 2; d * d <= p; d++) if (p % d === 0) throw new RangeError('The field characteristic must be prime.');
}

export function normalizePolynomial(coefficients: readonly number[], p: number): Polynomial {
  assertPrime(p);
  if (!coefficients.length || coefficients.some(v => !Number.isSafeInteger(v))) throw new RangeError('Supply at least one finite safe-integer coefficient.');
  const result = coefficients.map(v => mod(v, p));
  while (result.length > 1 && result.at(-1) === 0) result.pop();
  return result;
}

export const polynomialDegree = (a: Polynomial) => a.length === 1 && a[0] === 0 ? -1 : a.length - 1;
const zero = (a: Polynomial) => polynomialDegree(a) === -1;

export function polyAdd(a: readonly number[], b: readonly number[], p: number): Polynomial {
  const left = normalizePolynomial(a, p), right = normalizePolynomial(b, p);
  return normalizePolynomial(Array.from({ length: Math.max(left.length, right.length) }, (_, i) => (left[i] ?? 0) + (right[i] ?? 0)), p);
}

export function polyScale(a: readonly number[], scalar: number, p: number): Polynomial {
  if (!Number.isSafeInteger(scalar)) throw new RangeError('Scalar must be a safe integer.');
  return normalizePolynomial(normalizePolynomial(a, p).map(v => v * mod(scalar, p)), p);
}

export function polyMultiply(a: readonly number[], b: readonly number[], p: number): Polynomial {
  const left = normalizePolynomial(a, p), right = normalizePolynomial(b, p);
  const result = Array(left.length + right.length - 1).fill(0) as number[];
  left.forEach((x, i) => right.forEach((y, j) => { result[i + j] = mod(result[i + j] + x * y, p); }));
  return normalizePolynomial(result, p);
}

function inverse(a: number, p: number) {
  const residue = mod(a, p);
  for (let i = 1; i < p; i++) if (mod(i * residue, p) === 1) return i;
  throw new RangeError('Zero has no multiplicative inverse.');
}

export function polyDivmod(dividend: readonly number[], divisor: readonly number[], p: number) {
  let remainder = normalizePolynomial(dividend, p);
  const denominator = normalizePolynomial(divisor, p);
  if (zero(denominator)) throw new RangeError('Cannot divide by the zero polynomial.');
  const quotient = Array(Math.max(1, remainder.length - denominator.length + 1)).fill(0) as number[];
  const leadInverse = inverse(denominator.at(-1)!, p);
  while (!zero(remainder) && remainder.length >= denominator.length) {
    const shift = remainder.length - denominator.length, coefficient = mod(remainder.at(-1)! * leadInverse, p);
    quotient[shift] = coefficient;
    const subtract = [...Array(shift).fill(0), ...denominator.map(v => -coefficient * v)];
    remainder = polyAdd(remainder, subtract, p);
  }
  return { quotient: normalizePolynomial(quotient, p), remainder };
}

export interface PolynomialDivisionStep { dividend: Polynomial; divisor: Polynomial; quotient: Polynomial; remainder: Polynomial }

export function extendedPolyGcd(f: readonly number[], g: readonly number[], p: number) {
  let a = normalizePolynomial(f, p), b = normalizePolynomial(g, p);
  let s: Polynomial = [1], nextS: Polynomial = [0], t: Polynomial = [0], nextT: Polynomial = [1];
  const steps: PolynomialDivisionStep[] = [];
  while (!zero(b)) {
    const { quotient, remainder } = polyDivmod(a, b, p);
    steps.push({ dividend: [...a], divisor: [...b], quotient, remainder });
    [a, b] = [b, remainder];
    [s, nextS] = [nextS, polyAdd(s, polyScale(polyMultiply(quotient, nextS, p), -1, p), p)];
    [t, nextT] = [nextT, polyAdd(t, polyScale(polyMultiply(quotient, nextT, p), -1, p), p)];
  }
  if (zero(a)) return { gcd: [0], u: [0], v: [0], steps };
  const scale = inverse(a.at(-1)!, p);
  return { gcd: polyScale(a, scale, p), u: polyScale(s, scale, p), v: polyScale(t, scale, p), steps };
}

export function polynomialValue(a: readonly number[], x: number, p: number) {
  if (!Number.isSafeInteger(x)) throw new RangeError('The field element must be a safe integer.');
  return normalizePolynomial(a, p).reduceRight((result, coefficient) => mod(result * mod(x, p) + coefficient, p), 0);
}

export function idealZeroModel(f: readonly number[], g: readonly number[], p: number) {
  const left = normalizePolynomial(f, p), right = normalizePolynomial(g, p), euclid = extendedPolyGcd(left, right, p);
  const values = Array.from({ length: p }, (_, x) => ({ x, f: polynomialValue(left, x, p), g: polynomialValue(right, x, p), d: polynomialValue(euclid.gcd, x, p) }));
  const rootsF = values.filter(row => row.f === 0).map(row => row.x), rootsG = values.filter(row => row.g === 0).map(row => row.x);
  const commonRoots = values.filter(row => row.f === 0 && row.g === 0).map(row => row.x), rootsD = values.filter(row => row.d === 0).map(row => row.x);
  const bezoutValue = polyAdd(polyMultiply(euclid.u, left, p), polyMultiply(euclid.v, right, p), p);
  return { p, f: left, g: right, ...euclid, values, rootsF, rootsG, commonRoots, rootsD, bezoutValue,
    unitIdeal: euclid.gcd.length === 1 && euclid.gcd[0] === 1,
    zeroIdeal: zero(euclid.gcd),
    quotients: zero(euclid.gcd) ? null : { f: polyDivmod(left, euclid.gcd, p).quotient, g: polyDivmod(right, euclid.gcd, p).quotient },
  };
}

const superscript = (n: number) => String(n).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]).join('');
export function formatPolynomial(a: readonly number[]) {
  const terms = a.map((coefficient, degree) => coefficient === 0 ? '' : degree === 0 ? String(coefficient) : `${coefficient === 1 ? '' : coefficient}x${degree === 1 ? '' : superscript(degree)}`).filter(Boolean);
  return terms.reverse().join(' + ') || '0';
}

export function parseCoefficients(text: string): Polynomial {
  const normalized = text.trim().replaceAll('，', ',');
  const entries = normalized.includes(',') ? normalized.split(',').map(entry => entry.trim()) : normalized.split(/\s+/);
  if (!entries.length || entries.length > 7 || entries.some(entry => !/^[+-]?\d+$/.test(entry))) throw new RangeError('Use one to seven comma-separated integers.');
  const values = entries.map(Number);
  if (values.some(value => !Number.isSafeInteger(value))) throw new RangeError('Coefficients must be safe integers.');
  return values;
}

export const IDEAL_PRESETS = [
  { id: 'shared', p: 5, f: [2, 2, 1], g: [3, 1, 1], zh: '共同线性因子', en: 'A shared linear factor' },
  { id: 'coprime', p: 5, f: [1, 0, 1], g: [1, 1], zh: '互素：生成整个环', en: 'Coprime: the whole ring' },
  { id: 'invisible', p: 3, f: [1, 0, 1], g: [1, 1, 1, 1], zh: '没有域内零点，仍是非单位理想', en: 'No field roots, yet a proper ideal' },
  { id: 'repeated', p: 5, f: [1, 3, 1], g: [1, 3, 1], zh: '重因子被点集遗忘', en: 'A repeated factor forgotten by the point set' },
  { id: 'zero', p: 5, f: [0], g: [0], zh: '两个零多项式', en: 'Two zero polynomials' },
] as const;
