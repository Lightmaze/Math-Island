import { LabLanguageContext, type Language } from './common';
import { EllipticLab, FiniteFieldLab, GroupLab, SieveLab } from './AlgebraLabs';
import { ComplexLab, FourierLab, OptimizationLab, ProbabilityLab } from './AnalysisLabs';
import { FractalLab, GraphLab, LogicLab, MatroidLab } from './DiscreteLabs';
import { CategoryLab, CoveringLab, GeometryLab, HomologyLab } from './TopologyLabs';
import AdvancedLab from './AdvancedLab';
import './labs.css';

export interface ObjectLabProps { labKey: string; language: Language; onExplore?: () => void }

const LABS = {
  sieve: SieveLab, elliptic: EllipticLab, group: GroupLab, topology: CoveringLab,
  homology: HomologyLab, graph: GraphLab, probability: ProbabilityLab, fourier: FourierLab,
  finitefield: FiniteFieldLab, optimization: OptimizationLab, matroid: MatroidLab,
  complex: ComplexLab, logic: LogicLab, fractal: FractalLab, geometry: GeometryLab, category: CategoryLab,
};

export default function ObjectLab({ labKey, language, onExplore }: ObjectLabProps) {
  const Lab = Object.prototype.hasOwnProperty.call(LABS, labKey) ? LABS[labKey as keyof typeof LABS] : undefined;
  if (!Lab) return <AdvancedLab labKey={labKey} language={language} onExplore={onExplore} />;
  return <LabLanguageContext.Provider value={language}><div className="object-lab-host" key={labKey} onChange={onExplore} onClick={event => {
    if ((event.target as Element).closest('button')) onExplore?.();
  }}><Lab language={language} /></div></LabLanguageContext.Provider>;
}
