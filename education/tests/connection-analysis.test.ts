import {describe,it,expect} from 'vitest';
import {fourierHeat,fourierHeatValue,probabilityTransport,cdfAt,transportCdfScenario} from '../src/connections/analysis-models';
const integrate=(f:(x:number)=>number,n=4096)=>Array.from({length:n},(_,i)=>f(-Math.PI+2*Math.PI*(i+.5)/n)).reduce((a,b)=>a+b,0)*2*Math.PI/n;
describe('The same finite Fourier data governs heat flow and L² energy',()=>{
  it('preserves the initial function, period, and constant mode',()=>{
    const coefficients=[1,.45,-.3,.2],m=.35;
    for(const x of [-2,-.2,.7])expect(fourierHeatValue(x,coefficients,m,0)).toBeCloseTo(m+coefficients.reduce((sum,a,i)=>sum+a*Math.sin((i+1)*x),0),14);
    expect(fourierHeatValue(.3+2*Math.PI,coefficients,m,.3)).toBeCloseTo(fourierHeatValue(.3,coefficients,m,.3),13);
    expect(integrate(fourierHeat(coefficients,m,.5).value)/(2*Math.PI)).toBeCloseTo(m,13);
    expect(fourierHeat([0,0,0,0],m,10).energy).toBeCloseTo(2*Math.PI*m*m,14);
  });
  it('decays the fourth mode at rate sixteen and composes times',()=>{
    const first=fourierHeat([1,-.2,0,.8],.2,.2);
    expect(first.modes[3].current).toBeCloseTo(.8*Math.exp(-16*.2),14);
    const second=fourierHeat(first.modes.map(mode=>mode.current),.2,.3);
    const direct=fourierHeat([1,-.2,0,.8],.2,.5);
    expect(second.energy).toBeCloseTo(direct.energy,13);
  });
  it('matches independent spatial integrals and the PDE',()=>{
    const c=[1,.4,-.6,.3],m=-.2,t=.17,model=fourierHeat(c,m,t);
    expect(integrate(x=>model.value(x)**2)).toBeCloseTo(model.energy,11);
    expect(-2*integrate(x=>model.derivative(x)**2)).toBeCloseTo(model.energyDerivative,11);
    const x=.7,h=1e-4,dt=(fourierHeatValue(x,c,m,t+h)-fourierHeatValue(x,c,m,t-h))/(2*h),dxx=(model.value(x+h)-2*model.value(x)+model.value(x-h))/(h*h);
    expect(dt).toBeCloseTo(dxx,4);expect(model.energyDerivative).toBeLessThan(0);
  });
  it('rejects negative time and non-finite coefficients',()=>{
    expect(()=>fourierHeat([1],0,-1)).toThrow();expect(()=>fourierHeat([NaN],0,0)).toThrow();expect(()=>fourierHeat([1],Infinity,0)).toThrow();
    expect(()=>fourierHeat([1e308],0,0)).toThrow();
    const model=fourierHeat([1,1,1,1],0,0);
    expect(()=>model.value(1e308)).toThrow();expect(()=>model.derivative(1e308)).toThrow();
  });
  it('retains fluctuation variance below the resolution of the mean energy',()=>{
    const model=fourierHeat([1e-12],1,0);
    expect(model.variance).toBeGreaterThan(0);expect(model.variance/(.5e-24)).toBeCloseTo(1,14);
  });
});
describe('One-dimensional W₁ equals the exact CDF-interval area',()=>{
  it('matches Dirac displacement, including negative translation',()=>{
    for(const delta of [-1,-.25,0,.5,1]){
      const model=transportCdfScenario(delta,1,1);
      expect(model.cost).toBeCloseTo(Math.abs(delta),14);expect(model.cdfArea).toBeCloseTo(Math.abs(delta),14);
    }
  });
  it('keeps marginals and the area identity across degenerate probabilities',()=>{
    for(const p of [0,.2,.5,1])for(const b of [-1,-.3,0,1])for(const delta of [-1,-.2,0,.7,1]){
      const model=transportCdfScenario(delta,b,p);
      expect(model.marginalResidual).toBeLessThan(1e-14);expect(model.identityResidual).toBeLessThan(1e-13);
      expect(model.flows.every(flow=>flow.mass>0)).toBe(true);
      expect(model.intervals.every(interval=>interval.area>=0)).toBe(true);
    }
  });
  it('is invariant under input reordering and splits mass when necessary',()=>{
    const s=[{position:2,mass:.5},{position:0,mass:.5}],t=[{position:1,mass:1}];
    const model=probabilityTransport(s,t);expect(model.cost).toBe(1);expect(model.flows).toHaveLength(2);
    expect(probabilityTransport([...s].reverse(),t).cdfArea).toBe(model.cdfArea);
  });
  it('uses right-continuous CDF values at an atom and handles repeated locations',()=>{
    const atoms=[{position:0,mass:.25},{position:0,mass:.25},{position:2,mass:.5}];
    expect(cdfAt(atoms,-Number.EPSILON)).toBe(0);expect(cdfAt(atoms,0)).toBe(.5);expect(cdfAt(atoms,2)).toBe(1);
    expect(probabilityTransport(atoms,[{position:0,mass:.5},{position:2,mass:.5}]).cost).toBe(0);
  });
  it('does not discard a tiny positive mass via a fixed epsilon',()=>{
    const epsilon=1e-12,model=probabilityTransport([{position:0,mass:epsilon},{position:1,mass:1-epsilon}],[{position:1,mass:1}]);
    expect(model.flows.some(flow=>flow.mass===epsilon)).toBe(true);expect(model.cost).toBe(epsilon);expect(model.cdfArea).toBe(epsilon);
  });
  it('rejects non-probabilities and invalid values',()=>{
    const valid=[{position:0,mass:1}];expect(()=>probabilityTransport([{position:0,mass:2}],valid)).toThrow();expect(()=>probabilityTransport([{position:0,mass:-1}],valid)).toThrow();expect(()=>transportCdfScenario(0,2,.5)).toThrow();expect(()=>transportCdfScenario(0,0,NaN)).toThrow();
  });
});
