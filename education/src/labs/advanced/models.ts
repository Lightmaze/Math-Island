/** Pure mathematical models for the education layer. No core-graph mutation. */
function finite(...values: number[]) { if (!values.every(Number.isFinite)) throw new Error('Finite numbers required'); }
export function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b)) throw new Error('Integer inputs required');
  while (b) [a, b] = [b, a % b];
  return a;
}
export function lcm(a: number, b: number): number {
  if (!a || !b) return 0;
  return Math.abs(a / gcd(a, b) * b);
}
export function integerIdeals(m: number, n: number, extent = 24) {
  if (![m, n].every(x => Number.isSafeInteger(x) && x > 0)) throw new Error('Positive integer generators required');
  const integers = Array.from({length: extent * 2 + 1}, (_, i) => i - extent);
  const sum = gcd(m, n), intersection = lcm(m, n);
  return { m, n, sum, intersection, leftSubsetRight: m % n === 0,
    rightSubsetLeft: n % m === 0,
    rows: [m, n, sum, intersection].map(generator => ({generator, values: integers.filter(x => x % generator === 0)})) };
}
export function primeFactors(n: number): number[] {
  if (!Number.isSafeInteger(n) || n < 2) throw new Error('n must be an integer at least 2');
  const factors: number[] = [];
  for (let p = 2; p * p <= n; p++) {
    if (n % p === 0) { factors.push(p); while (n % p === 0) n /= p; }
  }
  if (n > 1) factors.push(n);
  return factors;
}
export function finiteSpectrum(n: number, f: number) {
  if (!Number.isSafeInteger(f)) throw new Error('Integer f required');
  const primes = primeFactors(n);
  return { n, f, primes, open: primes.filter(p => f % p !== 0), closed: primes.filter(p => f % p === 0),
    reduced: primes.reduce((a, p) => a * p, 1) === n };
}
export function affineGluing(a: number, b: number, c: number, d: number) {
  finite(a,b,c,d);
  const compatible = a === c && b === d;
  return { compatible, overlap: [-1, 1] as const,
    left: (x: number) => a * x + b, right: (x: number) => c * x + d,
    gapAtZero: Math.abs(b - d), gapAtHalf: Math.abs((a - c) / 2 + b - d),
    // For an affine difference, the supremum on the open overlap equals the maximum at its closure endpoints.
    overlapSupremum: Math.max(Math.abs(-(a - c) + b - d), Math.abs(a - c + b - d)),
    global: compatible ? (x: number) => a * x + b : null };
}
export interface MassPoint { position: number; mass: number }
export interface TransportFlow { source: number; target: number; mass: number; cost: number }
export function monotoneTransport(source: MassPoint[], target: MassPoint[]) {
  const check = (x: MassPoint) => Number.isFinite(x.position) && Number.isFinite(x.mass) && x.mass >= 0;
  if (!source.length || !target.length || !source.every(check) || !target.every(check)) throw new Error('Finite positions and nonnegative masses required');
  const s = source.map(p => ({...p})).sort((a,b) => a.position - b.position);
  const t = target.map(p => ({...p})).sort((a,b) => a.position - b.position);
  const sourceMass = s.reduce((a,p) => a + p.mass, 0), targetMass = t.reduce((a,p) => a + p.mass, 0);
  if (Math.abs(sourceMass - targetMass) > 1e-10 * Math.max(sourceMass,targetMass) || sourceMass <= 0) throw new Error('Positive equal total mass required');
  const tolerance = sourceMass * 1e-13;
  let i = 0, j = 0;
  const remainingS = s.map(p => p.mass), remainingT = t.map(p => p.mass), flows: TransportFlow[] = [];
  while (i < s.length && j < t.length) {
    if (remainingS[i] < tolerance) { i++; continue; }
    if (remainingT[j] < tolerance) { j++; continue; }
    const mass = Math.min(remainingS[i], remainingT[j]);
    flows.push({source: i, target: j, mass, cost: mass * Math.abs(s[i].position - t[j].position)});
    remainingS[i] -= mass; remainingT[j] -= mass;
  }
  return {source: s, target: t, sourceMass, targetMass, flows, cost: flows.reduce((a,f) => a + f.cost, 0)};
}
export function transportScenario(shift: number, tilt: number) {
  finite(shift,tilt);
  if (Math.abs(tilt) > 1) throw new Error('Tilt must preserve nonnegative masses');
  const source = [-2.7, -1, 1.1, 2.6].map((position, i) => ({position, mass: [1,2,2,1][i] / 6}));
  const target = [-2.2,-0.5,0.8,2.1].map((position, i) => ({position: position + shift, mass: [1+tilt,2,2,1-tilt][i] / 6}));
  return monotoneTransport(source, target);
}
export function heatValue(x: number, t: number, amplitude: number): number {
  finite(x,t,amplitude);
  if (t < 0 || !Number.isFinite(t)) throw new Error('Nonnegative time required');
  return Math.exp(-t) * Math.sin(x) + amplitude * Math.exp(-9 * t) * Math.sin(3*x);
}
export function heatEnergy(t: number, amplitude: number): number {
  finite(t,amplitude);
  if (t < 0) throw new Error('Nonnegative time required');
  return Math.PI * (Math.exp(-2*t) + amplitude * amplitude * Math.exp(-18*t));
}
export function dirichletEigenmode(n: number, k: number) {
  if (!Number.isInteger(n) || n < 1 || !Number.isInteger(k) || k < 1 || k > n) throw new Error('1 ≤ k ≤ N required');
  const lambda = 2 - 2 * Math.cos(k*Math.PI/(n+1));
  const vector = Array.from({length:n}, (_,j) => Math.sqrt(2/(n+1)) * Math.sin((j+1)*k*Math.PI/(n+1)));
  const applied = vector.map((v,j) => 2*v - (vector[j-1] ?? 0) - (vector[j+1] ?? 0));
  return {n,k,lambda,vector,applied,residual: Math.max(...vector.map((v,j) => Math.abs(applied[j]-lambda*v)))};
}
export function seededUniforms(seed: number, n: number): number[] {
  if (!Number.isSafeInteger(seed) || !Number.isSafeInteger(n) || n < 0) throw new Error('Integer seed and nonnegative integer sample count required');
  let state = seed >>> 0;
  return Array.from({length:n}, () => {
    state += 0x6D2B79F5;
    let t = Math.imul(state ^ state >>> 15, 1 | state);
    t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  });
}
export function bernoulliPath(seed: number, n: number, p: number) {
  finite(p);
  if (!Number.isInteger(n) || n < 1 || p < 0 || p > 1) throw new Error('N ≥ 1 and p in [0,1] required');
  let sum = 0;
  const samples = seededUniforms(seed,n).map(u => Number(u < p));
  const means = samples.map((value,i) => (sum += value)/(i+1));
  return {samples, means, sum, mean: means[n-1], expectation: p};
}
/** P(|mean_n - p| >= epsilon) <= alpha for each fixed n; not a simultaneous band. */
export function hoeffdingRadius(n: number, alpha = 0.05) {
  finite(n,alpha);
  if (n <= 0 || alpha <= 0 || alpha >= 1) throw new Error('Positive n and 0 < alpha < 1 required');
  return Math.sqrt(Math.log(2/alpha)/(2*n));
}
export type CurveFamily = 'circle' | 'hyperbola' | 'cubic';
export type Point = [number,number];
export function curveValue(family: CurveFamily, x: number, y: number, a: number, b: number) {
  finite(x,y,a,b);
  return family === 'circle' ? x*x+y*y-a*a : family === 'hyperbola' ? x*y-a : y*y-x*x*x-a*x-b;
}
export function curveSingular(family: CurveFamily, a: number, b: number) {
  finite(a,b);
  return family === 'circle' ? a === 0 : family === 'hyperbola' ? a === 0 : Math.abs(4*a*a*a+27*b*b) < 1e-10;
}
export function curveSegments(family: CurveFamily, a: number, b: number, samples = 800): Point[][] {
  finite(a,b,samples);
  if (!Number.isInteger(samples) || samples < 8) throw new Error('At least eight sample intervals required');
  if (family === 'circle') {
    if (a === 0) return [[[0,0]]];
    return [Array.from({length:241}, (_,i) => [a*Math.cos(i*Math.PI/120), a*Math.sin(i*Math.PI/120)] as Point)];
  }
  if (family === 'hyperbola' && a === 0) return [[[-3,0],[3,0]],[[0,-2.6],[0,2.6]]];
  const segments: Point[][] = [];
  const signs = family === 'cubic' ? [1,-1] : [1];
  const sampleXs=Array.from({length:samples+1},(_,i)=>-3+6*i/samples);
  // A double root can be an isolated real point; a uniform mesh may miss it entirely.
  if(family==='cubic'&&4*a*a*a+27*b*b===0) {
    const criticalX=a===0?0:-3*b/(2*a);
    if(criticalX>=-3&&criticalX<=3&&!sampleXs.some(x=>Math.abs(x-criticalX)<1e-12)) {
      sampleXs.push(criticalX);
      sampleXs.sort((x,y)=>x-y);
    }
  }
  for (const sign of signs) {
    let current: Point[] = [];
    let previousX: number | undefined;
    let previousQ: number | undefined;
    for (const x of sampleXs) {
      let y = NaN;
      if (family === 'hyperbola') { if (Math.abs(x)>1e-12) y=a/x; }
      else {
        const q=x*x*x+a*x+b;
        if (previousX !== undefined && previousQ !== undefined && previousQ*q < 0) {
          let lo=previousX, hi=x, flo=previousQ;
          for(let k=0;k<55;k++) { const mid=(lo+hi)/2, fm=mid*mid*mid+a*mid+b; if(flo*fm<=0) hi=mid; else {lo=mid;flo=fm;} }
          const root=(lo+hi)/2;
          if(previousQ<0) current=[[root,0]];
          else {current.push([root,0]);segments.push(current);current=[];}
        }
        if(q>=0) y=sign*Math.sqrt(q);
        previousX=x;previousQ=q;
      }
      if (Number.isFinite(y) && Math.abs(y)<=2.6) current.push([x,y]);
      else if(current.length) { segments.push(current); current=[]; }
    }
    if(current.length) segments.push(current);
  }
  const isolated=new Set<string>();
  return segments.filter(points=>{
    if(points.length!==1) return true;
    const key=points[0].join(',');
    if(isolated.has(key)) return false;
    isolated.add(key);return true;
  });
}
