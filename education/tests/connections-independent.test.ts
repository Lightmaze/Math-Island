import { describe, expect, it } from 'vitest';
import { fourierHeat, probabilityTransport, cdfAt, transportCdfScenario } from '../src/connections/analysis-models';
import { K4_EDGES, K4_FACES, k4Homology, d4Compose, d4Representation, complexD4Action, representationState } from '../src/connections/discrete-models';
import { coveringLift, idealZeroModel, polyDivmod, normalizePolynomial } from '../src/connections/structure-models';

const mod=(x:number,p:number)=>((x%p)+p)%p;
const trim=(a:number[])=>{while(a.length>1&&a.at(-1)===0)a.pop();return a;};
function sumProducts(a:number[],b:number[],c:number[],d:number[],p:number){const out=Array(Math.max(a.length+b.length,c.length+d.length)-1).fill(0);for(const [l,r] of [[a,b],[c,d]])for(let i=0;i<l.length;i++)for(let j=0;j<r.length;j++)out[i+j]=mod(out[i+j]+l[i]*r[j],p);return trim(out);}
const permutations=(a:number[]):number[][]=>a.length?a.flatMap((x,i)=>permutations(a.filter((_,j)=>i!==j)).map(rest=>[x,...rest])):[[]];
const compositions=()=>Array.from({length:5},(_,a)=>Array.from({length:5-a},(_,b)=>[a,b,4-a-b])).flat();

describe('Independent mathematical oracles for the six connections',()=>{
 it('Fourier energy and dissipation agree with independent quadrature, including the mean',()=>{
  for(const coefficients of [[0,0,0,0],[1,-.5,.25,1.5],[-1.5,0,0,0],[0,0,0,1]])for(const mean of [-.5,0,.5])for(const t of [0,.07,.8,1.2]){
   const model=fourierHeat(coefficients,mean,t);let energy=0,dissipation=0,average=0;const n=1024,dx=2*Math.PI/n;
   for(let i=0;i<n;i++){const x=(i+.5)*dx,u=model.value(x),ux=model.derivative(x);energy+=u*u*dx;dissipation-=2*ux*ux*dx;average+=u/n;}
   expect(model.energy).toBeCloseTo(energy,11);expect(model.energyDerivative).toBeCloseTo(dissipation,10);expect(average).toBeCloseTo(mean,12);
   expect(model.energy).toBeLessThanOrEqual(model.initialEnergy+1e-13);
  }
  expect(fourierHeat([1,0,0,1],0,.5).modes.map(m=>m.decay)).toEqual([1,2,3,4].map(k=>Math.exp(-k*k*.5)));
  expect(fourierHeat([1e-12],1,0).variance).toBeCloseTo(5e-25,35);
 });
 it('Fourier rejects nonphysical time and nonfinite coefficients',()=>{for(const fn of [()=>fourierHeat([NaN],0,1),()=>fourierHeat([1],Infinity,0),()=>fourierHeat([1],0,-1),()=>fourierHeat([1e308],0,0)])expect(fn).toThrow();});
 it('W1 agrees with a brute minimum over all 24 empirical couplings for 225 measure pairs',()=>{
  for(const a of compositions())for(const b of compositions()){
   const source=[-2,0,3].map((position,i)=>({position,mass:a[i]/4})),target=[-1,1,4].map((position,i)=>({position,mass:b[i]/4}));
   const xs=source.flatMap((v,i)=>Array(a[i]).fill(v.position)),ys=target.flatMap((v,i)=>Array(b[i]).fill(v.position));
   const minimum=Math.min(...permutations(ys).map(ordered=>xs.reduce((s,x,i)=>s+Math.abs(x-ordered[i])/4,0)));
   const model=probabilityTransport([...source].reverse(),[target[1],target[2],target[0]]);
   expect(model.cost).toBe(minimum);expect(model.cdfArea).toBe(minimum);expect(model.marginalResidual).toBe(0);
  }
 });
 it('W1 covers Dirac degeneration, right-continuous jumps, coincident atoms and very small positive mass',()=>{
  for(const shift of [-1,-.5,0,.75,1])for(const tilt of [-1,0,1])expect(transportCdfScenario(shift,tilt,1).cost).toBe(Math.abs(shift));
  const atoms=[{position:0,mass:.25},{position:0,mass:.75}];expect(cdfAt(atoms,-Number.EPSILON)).toBe(0);expect(cdfAt(atoms,0)).toBe(1);expect(cdfAt(atoms,Infinity)).toBe(1);
  const tiny=probabilityTransport([{position:0,mass:1-1e-12},{position:2,mass:1e-12}],[{position:0,mass:1}]);expect(Math.abs(tiny.cost-2e-12)).toBeLessThan(2*Number.EPSILON);expect(tiny.cost).toBeGreaterThan(1e-12);expect(tiny.flows.some(f=>f.mass>0&&f.mass<2e-12)).toBe(true);
  for(const bad of [[{position:0,mass:0}],[{position:0,mass:-1},{position:1,mass:2}],[{position:NaN,mass:1}]])expect(()=>probabilityTransport(bad,atoms)).toThrow();
 });
 it('every valid K4 subcomplex agrees with explicit cycle and boundary sets',()=>{
  let count=0;
  for(let edgeMask=0;edgeMask<64;edgeMask++)for(let faceMask=0;faceMask<16;faceMask++){
   const edges=K4_EDGES.flatMap((_,e)=>edgeMask&(1<<e)?[e]:[]),faces=K4_FACES.flatMap((_,f)=>faceMask&(1<<f)?[f]:[]);
   const faceMasks=faces.map(f=>K4_EDGES.reduce((m,[a,b],e)=>K4_FACES[f].includes(a)&&K4_FACES[f].includes(b)?m|(1<<e):m,0));
   if(faceMasks.some(m=>(m&edgeMask)!==m))continue;count++;
   const cycles:number[]=[];for(let chain=0;chain<64;chain++){if((chain&edgeMask)!==chain)continue;const odd=[0,0,0,0];K4_EDGES.forEach(([a,b],e)=>{if(chain&(1<<e)){odd[a]^=1;odd[b]^=1;}});if(odd.every(x=>x===0))cycles.push(chain);}
   const boundaries=new Set<number>();for(let mask=0;mask<(1<<faces.length);mask++)boundaries.add(faceMasks.reduce((m,f,i)=>mask&(1<<i)?m^f:m,0));
   const components=new Set([0,1,2,3].map(v=>{const reach=new Set([v]);for(let pass=0;pass<4;pass++)edges.forEach(e=>{const[a,b]=K4_EDGES[e];if(reach.has(a)||reach.has(b)){reach.add(a);reach.add(b);}});return Math.min(...reach);})).size;
   const model=k4Homology(edges,faces,[]);expect(model.betti).toEqual([components,Math.log2(cycles.length/boundaries.size),faces.length-Math.log2(boundaries.size)]);expect(model.classes.length).toBe(cycles.length/boundaries.size);expect(model.boundarySquared.flat().every(x=>x===0)).toBe(true);
   for(const chain of [0,edgeMask]){const selected=edges.filter(e=>chain&(1<<e)),state=k4Homology(edges,faces,selected);expect(state.cycle).toBe(cycles.includes(chain));expect(state.isBoundary).toBe(boundaries.has(chain));expect(state.classIndex===null).toBe(!state.cycle);}
  }
  expect(count).toBe(113);expect(k4Homology([0,1,2,3,4,5],[0,1,2,3],[]).betti).toEqual([1,0,1]);expect(k4Homology([0,1,2,3,4,5],[0,1,2],[]).betti).toEqual([1,0,0]);
 });
 it('K4 rejects invalid incidence and duplicate selection rather than fabricating a chain complex',()=>{for(const fn of [()=>k4Homology([0,0],[],[]),()=>k4Homology([0],[0],[]),()=>k4Homology([],[],[0]),()=>k4Homology([NaN],[],[])])expect(fn).toThrow();});
 it('all 64 D4 products agree on two independent basis vectors and preserve their norm',()=>{
  for(let a=0;a<8;a++)for(let b=0;b<8;b++)for(const z of [[1,0],[0,1],[-.75,1.25]] as [number,number][]){
   const state=representationState(a,b,z),sequential=complexD4Action(a,complexD4Action(b,z));expect(state.afterAB).toEqual(sequential);expect(state.matrixAB).toEqual(d4Representation(d4Compose(a,b)));expect(state.afterAB[0]**2+state.afterAB[1]**2).toBe(z[0]**2+z[1]**2);
  }
  const zero=representationState(1,4,[0,0]);expect(zero.thisVectorAgrees).toBe(true);expect(zero.matricesCommute).toBe(false);
 });
 it('covering lift projects to the base for all starting sheets, positive and negative winding',()=>{
  for(let n=2;n<=8;n++)for(let k=0;k<n;k++)for(let winding=-8;winding<=8;winding++)for(const t of [0,.137,.5,1]){
   const m=coveringLift(n,k,winding,t);expect(m.finalIndex).toBe(mod(k+winding,n));expect(m.finalClosed).toBe(winding%n===0);expect(m.projectionError).toBeLessThan(1e-12);expect(m.current.liftAngle-m.start.liftAngle).toBeCloseTo(2*Math.PI*winding*t/n,12);expect(Math.hypot(...m.current.lift)).toBeCloseTo(1,14);
  }
  expect(coveringLift(3,2,1,.5).currentBaseClosed).toBe(false);expect(coveringLift(3,2,3,1).currentLiftClosed).toBe(true);
  for(const args of [[2,2,1,1],[0,0,0,0],[2,0,.5,1],[2,0,1,NaN]])expect(()=>coveringLift(...args as [number,number,number,number])).toThrow();
 });
 it('793 small-field polynomial pairs satisfy exact Bezout, divisibility and root-set identities',()=>{
  let count=0;for(const p of [2,3]){const polys=Array.from({length:p**3},(_,v)=>[v%p,Math.floor(v/p)%p,Math.floor(v/p**2)]);for(const f of polys)for(const g of polys){count++;const m=idealZeroModel(f,g,p);expect(sumProducts(m.u,f,m.v,g,p)).toEqual(m.gcd);expect(m.commonRoots).toEqual(m.rootsD);if(!m.zeroIdeal){expect(m.gcd.at(-1)).toBe(1);expect(sumProducts(m.gcd,m.quotients!.f,[0],[0],p)).toEqual(normalizePolynomial(f,p));expect(sumProducts(m.gcd,m.quotients!.g,[0],[0],p)).toEqual(normalizePolynomial(g,p));}for(const s of m.steps){expect(sumProducts(s.quotient,s.divisor,[1],s.remainder,p)).toEqual(s.dividend);expect(s.remainder.length<s.divisor.length||s.remainder.join(',')==='0').toBe(true);}}}expect(count).toBe(793);
 });
 it('finite-field zero sets neither recover ideals nor detect all proper ideals',()=>{
  const invisible=idealZeroModel([1,0,1],[1,1,1,1],3);expect(invisible.commonRoots).toEqual([]);expect(invisible.unitIdeal).toBe(false);expect(invisible.gcd).toEqual([1,0,1]);
  expect(idealZeroModel([0],[0],5).rootsD).toEqual([0,1,2,3,4]);
  const x=idealZeroModel([0,1],[0,1],5),xx=idealZeroModel([0,0,1],[0,0,1],5);expect(x.commonRoots).toEqual(xx.commonRoots);expect(x.gcd).not.toEqual(xx.gcd);
  for(const p of [0,1,4,6,9,NaN])expect(()=>idealZeroModel([1],[0],p)).toThrow();expect(()=>polyDivmod([1],[0],5)).toThrow();
 });
});
