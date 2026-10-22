import {describe,it,expect} from 'vitest';
import {integerIdeals,primeFactors,finiteSpectrum,affineGluing,monotoneTransport,transportScenario,heatValue,heatEnergy,dirichletEigenmode,seededUniforms,bernoulliPath,hoeffdingRadius,curveValue,curveSegments,curveSingular} from '../src/labs/advanced/models';
import {equalPlotScale,number} from '../src/labs/advanced/shared';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import AdvancedLab from '../src/labs/AdvancedLab';

describe('Integer ideals preserve the reversal between divisibility and inclusion',()=>{
  it('identifies the sum and intersection of (4) and (6)',()=>{
    const m=integerIdeals(4,6); expect(m.sum).toBe(2);expect(m.intersection).toBe(12);
    for(let x=-120;x<=120;x++) expect(x%m.intersection===0).toBe(x%4===0&&x%6===0);
    expect(m.leftSubsetRight).toBe(false);expect(m.rightSubsetLeft).toBe(false);
  });
  it('places (12) inside (4), not the other way round',()=>{
    const m=integerIdeals(12,4);expect(m.leftSubsetRight).toBe(true);expect(m.rightSubsetLeft).toBe(false);
    expect(m.sum).toBe(4);expect(m.intersection).toBe(12);
  });
});
describe('Finite prime spectra distinguish points from nilpotents',()=>{
  it('retains only distinct prime factors, including prime powers',()=>{
    expect(primeFactors(12)).toEqual([2,3]);expect(primeFactors(8)).toEqual([2]);
    expect(finiteSpectrum(8,1).reduced).toBe(false);expect(finiteSpectrum(6,1).reduced).toBe(true);
  });
  it('makes D(0) empty, D(1) full, and D(2) in Spec Z/12 equal to {(3)}',()=>{
    expect(finiteSpectrum(12,0).open).toEqual([]);expect(finiteSpectrum(12,1).open).toEqual([2,3]);expect(finiteSpectrum(12,2).open).toEqual([3]);
  });
});
describe('Affine sheaf sections require equality throughout the overlap',()=>{
  it('rejects sections that only meet at one point',()=>{
    const s=affineGluing(.5,0,.75,0);expect(s.gapAtZero).toBe(0);expect(s.compatible).toBe(false);expect(s.global).toBe(null);expect(s.overlapSupremum).toBe(.25);
  });
  it('glues equal sections into a function on the whole union',()=>{
    const s=affineGluing(.5,0,.5,0);expect(s.compatible).toBe(true);expect(s.global?.(2.5)).toBe(1.25);
  });
});
describe('One-dimensional transport conserves marginals and computes actual cost',()=>{
  it('conserves source and target masses for asymmetric targets',()=>{
    for(const shift of [-1,0,.7])for(const tilt of [-.8,.1,.8]){
      const m=transportScenario(shift,tilt);
      m.source.forEach((p,i)=>expect(m.flows.filter(f=>f.source===i).reduce((a,f)=>a+f.mass,0)).toBeCloseTo(p.mass,12));
      m.target.forEach((p,j)=>expect(m.flows.filter(f=>f.target===j).reduce((a,f)=>a+f.mass,0)).toBeCloseTo(p.mass,12));
      for(let i=0;i<m.flows.length;i++)for(let j=i+1;j<m.flows.length;j++)expect((m.flows[i].source-m.flows[j].source)*(m.flows[i].target-m.flows[j].target)).toBeGreaterThanOrEqual(0);
    }
  });
  it('agrees with exact hand-computed Wasserstein distances',()=>{
    expect(monotoneTransport([{position:0,mass:1}],[{position:3,mass:1}]).cost).toBe(3);
    const m=monotoneTransport([{position:0,mass:.5},{position:2,mass:.5}],[{position:1,mass:1}]);expect(m.cost).toBe(1);
  });
  it('rejects unequal mass rather than silently inventing mass',()=>{
    expect(()=>monotoneTransport([{position:0,mass:1}],[{position:0,mass:.5}])).toThrow();
  });
});
describe('Periodic heat modes obey their PDE and energy decay',()=>{
  it('reproduces the initial condition and 2pi periodicity',()=>{
    for(const x of [-2,-.3,1.4]){expect(heatValue(x,0,.8)).toBeCloseTo(Math.sin(x)+.8*Math.sin(3*x),13);expect(heatValue(x+2*Math.PI,.4,.8)).toBeCloseTo(heatValue(x,.4,.8),13);}
  });
  it('has decreasing energy and numerical time derivative equal to spatial Laplacian',()=>{
    expect(heatEnergy(.4,1.1)).toBeLessThan(heatEnergy(.1,1.1));
    const x=.7,t=.3,a=1.1,h=1e-4;
    const dt=(heatValue(x,t+h,a)-heatValue(x,t-h,a))/(2*h);
    const dxx=(heatValue(x+h,t,a)-2*heatValue(x,t,a)+heatValue(x-h,t,a))/(h*h);
    expect(dt).toBeCloseTo(dxx,5);
  });
});
describe('Dirichlet spectral modes form an orthonormal eigenbasis',()=>{
  it('has small eigen residuals, unit lengths, and orthogonal distinct modes',()=>{
    for(const n of [4,8,12]){
      const modes=Array.from({length:n},(_,i)=>dirichletEigenmode(n,i+1));
      for(const m of modes){expect(m.residual).toBeLessThan(3e-15);expect(Math.hypot(...m.vector)).toBeCloseTo(1,13);expect(m.lambda).toBeGreaterThan(0);expect(m.lambda).toBeLessThan(4);}
      for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)expect(modes[i].vector.reduce((sum,v,k)=>sum+v*modes[j].vector[k],0)).toBeCloseTo(0,13);
    }
  });
});
describe('Bernoulli experiments have reproducible prefixes and pointwise bounds',()=>{
  it('extends one path without regenerating its earlier samples',()=>{
    expect(seededUniforms(123,20)).toEqual(seededUniforms(123,100).slice(0,20));
    expect(bernoulliPath(123,20,.4).means).toEqual(bernoulliPath(123,100,.4).means.slice(0,20));
    expect(bernoulliPath(123,100,0).mean).toBe(0);expect(bernoulliPath(123,100,1).mean).toBe(1);
  });
  it('uses the two-sided fixed-n Hoeffding formula',()=>{
    const epsilon=hoeffdingRadius(200,.05);expect(2*Math.exp(-2*200*epsilon*epsilon)).toBeCloseTo(.05,14);
  });
});
describe('Sampled algebraic curves remain on their stated zero sets',()=>{
  it('preserves Euclidean proportions so a circle is displayed as a circle',()=>{
    const s=equalPlotScale();
    expect(s.x(1)-s.x(0)).toBeCloseTo(s.y(0)-s.y(1),13);
    expect(s.x(0)).toBe(360);expect(s.y(0)).toBe(210);
  });
  it('has small residuals at every plotted point',()=>{
    for(const [family,a,b] of [['circle',1.75,0],['hyperbola',1.25,0],['cubic',-1,.25]] as const){
      for(const segment of curveSegments(family,a,b))for(const [x,y] of segment)expect(Math.abs(curveValue(family,x,y,a,b))).toBeLessThan(2e-14);
    }
  });
  it('preserves degenerate members and distinguishes a cubic singularity',()=>{
    expect(curveSegments('circle',0,0)).toEqual([[[0,0]]]);expect(curveSegments('hyperbola',0,0)).toHaveLength(2);
    expect(curveSingular('cubic',0,0)).toBe(true);expect(curveSingular('cubic',-.75,.25)).toBe(true);expect(curveSingular('cubic',-1,0)).toBe(false);
  });
  it('includes an isolated real singular point exactly once, without inventing out-of-window points',()=>{
    const segments=curveSegments('cubic',-.75,-.25);
    const points=segments.flat().filter(([x,y])=>x===-.5&&y===0);
    expect(points).toEqual([[-.5,0]]);
    expect(curveValue('cubic',-.5,0,-.75,-.25)).toBe(0);
    expect(segments.some(segment=>segment.length===1&&segment[0][0]===-.5)).toBe(true);
    expect(curveSegments('cubic',-48,-128)).toEqual([]);
  });
  it('places the shared node exactly on both continuous branches',()=>{
    const segments=curveSegments('cubic',-.75,.25);
    expect(segments.filter(segment=>segment.length>1&&segment.some(([x,y])=>x===.5&&y===0))).toHaveLength(2);
  });
});

describe('Finite numeric contracts',()=>{
  it('preserves requested precision in exact equation constants and numerical readings',()=>{
    expect(number(1.75**2,4)).toBe('3.0625');
    expect(number(1/6,6)).toBe('0.166667');
    expect(number(-1e-16,6)).toBe('0');
  });
  it('rejects non-finite inputs instead of returning misleading quantities',()=>{
    expect(()=>bernoulliPath(1,10,NaN)).toThrow();
    expect(()=>heatEnergy(NaN,1)).toThrow();
    expect(()=>heatValue(1,.2,Infinity)).toThrow();
    expect(()=>affineGluing(1,0,NaN,0)).toThrow();
    expect(()=>hoeffdingRadius(20,NaN)).toThrow();
  });
});

describe('Unknown laboratory keys',()=>{
  it('does not mistake inherited object properties for implemented laboratories',()=>{
    for(const labKey of ['constructor','toString','__proto__','missing']){
      const html=renderToStaticMarkup(createElement(AdvancedLab,{labKey,language:'en'}));
      expect(html).toContain('A laboratory has not yet been authored');
    }
  });
});
