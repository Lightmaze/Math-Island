/** Exact finite-model formulas, evaluated with floating-point arithmetic. */
function finite(...values:number[]) { if(!values.every(Number.isFinite)) throw new Error('Finite numbers required'); }
export interface FourierHeatMode { frequency:number; initial:number; current:number; decay:number; energy:number; }
export function fourierHeat(coefficients:readonly number[],mean:number,time:number) {
  finite(mean,time,...coefficients);
  if(time<0) throw new Error('Time must be nonnegative');
  const modes:FourierHeatMode[]=coefficients.map((initial,index)=>{
    const frequency=index+1,decay=Math.exp(-frequency*frequency*time),current=initial*decay;
    return {frequency,initial,current,decay,energy:Math.PI*current*current};
  });
  const constantEnergy=2*Math.PI*mean*mean;
  const energy=constantEnergy+modes.reduce((sum,mode)=>sum+mode.energy,0);
  const initialEnergy=constantEnergy+Math.PI*coefficients.reduce((sum,a)=>sum+a*a,0);
  const energyDerivative=-2*modes.reduce((sum,mode)=>sum+mode.frequency**2*mode.energy,0);
  finite(energy,initialEnergy,energyDerivative);
  const value=(x:number)=>{finite(x);const result=mean+modes.reduce((sum,mode)=>sum+mode.current*Math.sin(mode.frequency*x),0);finite(result);return result};
  const derivative=(x:number)=>{finite(x);const result=modes.reduce((sum,mode)=>sum+mode.frequency*mode.current*Math.cos(mode.frequency*x),0);finite(result);return result};
  // Sum fluctuation energy directly: subtracting the mean energy loses tiny modes.
  const variance=modes.reduce((sum,mode)=>sum+mode.energy,0)/(2*Math.PI);
  return {modes,mean,time,energy,initialEnergy,constantEnergy,energyDerivative,variance,value,derivative};
}
export function fourierHeatValue(x:number,coefficients:readonly number[],mean:number,time:number) { return fourierHeat(coefficients,mean,time).value(x); }

export interface ProbabilityAtom { position:number;mass:number; }
export interface CouplingFlow { source:number;target:number;mass:number;distance:number;cost:number; }
export interface CdfInterval { left:number;right:number;sourceCdf:number;targetCdf:number;difference:number;area:number; }
function probability(atoms:readonly ProbabilityAtom[]) {
  if(!atoms.length) throw new Error('A probability measure needs at least one atom');
  if(atoms.some(atom=>!Number.isFinite(atom.position)||!Number.isFinite(atom.mass)||atom.mass<0)) throw new Error('Finite positions and nonnegative masses required');
  const total=atoms.reduce((sum,atom)=>sum+atom.mass,0);
  if(!Number.isFinite(total)||Math.abs(total-1)>32*Number.EPSILON*Math.max(1,atoms.length)) throw new Error('Total probability mass must be one');
  return atoms.map(atom=>({...atom})).sort((a,b)=>a.position-b.position);
}
/** Right-continuous distribution function; callers provide a valid probability measure. */
export function cdfAt(atoms:readonly ProbabilityAtom[],x:number) {
  if(Number.isNaN(x)) throw new Error('CDF argument cannot be NaN');
  return atoms.reduce((sum,atom)=>sum+(atom.position<=x?atom.mass:0),0);
}
export function probabilityTransport(sourceInput:readonly ProbabilityAtom[],targetInput:readonly ProbabilityAtom[]) {
  const source=probability(sourceInput),target=probability(targetInput);
  const sourceRemaining=source.map(atom=>atom.mass),targetRemaining=target.map(atom=>atom.mass);
  const flows:CouplingFlow[]=[];
  let i=0,j=0;
  while(i<source.length&&j<target.length) {
    if(sourceRemaining[i]===0){i++;continue}
    if(targetRemaining[j]===0){j++;continue}
    const mass=Math.min(sourceRemaining[i],targetRemaining[j]);
    const sourceDone=sourceRemaining[i]<=targetRemaining[j],targetDone=targetRemaining[j]<=sourceRemaining[i];
    const distance=Math.abs(source[i].position-target[j].position),cost=mass*distance;
    finite(distance,cost);
    flows.push({source:i,target:j,mass,distance,cost});
    sourceRemaining[i]-=mass;targetRemaining[j]-=mass;
    if(sourceDone)i++;
    if(targetDone)j++;
  }
  const knots=[...new Set([...source,...target].filter(atom=>atom.mass>0).map(atom=>atom.position))].sort((a,b)=>a-b);
  const intervals:CdfInterval[]=knots.slice(0,-1).map((left,index)=>{
    const right=knots[index+1],sourceCdf=cdfAt(source,left),targetCdf=cdfAt(target,left),difference=sourceCdf-targetCdf;
    const area=(right-left)*Math.abs(difference);finite(area);
    return {left,right,sourceCdf,targetCdf,difference,area};
  });
  const cost=flows.reduce((sum,flow)=>sum+flow.cost,0),cdfArea=intervals.reduce((sum,interval)=>sum+interval.area,0);
  finite(cost,cdfArea);
  const sourceError=Math.max(...source.map((atom,index)=>Math.abs(atom.mass-flows.filter(flow=>flow.source===index).reduce((sum,flow)=>sum+flow.mass,0))));
  const targetError=Math.max(...target.map((atom,index)=>Math.abs(atom.mass-flows.filter(flow=>flow.target===index).reduce((sum,flow)=>sum+flow.mass,0))));
  return {source,target,flows,knots,intervals,cost,cdfArea,identityResidual:Math.abs(cost-cdfArea),marginalResidual:Math.max(sourceError,targetError)};
}
export function transportCdfScenario(translation:number,tilt:number,centralMass:number) {
  finite(translation,tilt,centralMass);
  if(Math.abs(tilt)>1||centralMass<0||centralMass>1) throw new Error('Tilt must lie in [-1,1] and central probability in [0,1]');
  const side=(1-centralMass)/2;
  const source=[-2,0,2].map((position,index)=>({position,mass:[side,centralMass,side][index]}));
  const target=[-2,0,2].map((position,index)=>({position:position+translation,mass:[side*(1+tilt),centralMass,side*(1-tilt)][index]}));
  return probabilityTransport(source,target);
}
