import IdealLab from './advanced/IdealLab';
import SpectrumLab from './advanced/SpectrumLab';
import SheafLab from './advanced/SheafLab';
import TransportLab from './advanced/TransportLab';
import HeatLab from './advanced/HeatLab';
import SpectralLab from './advanced/SpectralLab';
import LlnLab from './advanced/LlnLab';
import AlgebraicCurveLab from './advanced/AlgebraicCurveLab';
import type {AdvancedProps} from './advanced/shared';
import './advanced/advanced.css';
export const advancedLabKeys = ['ideal','spectrum','sheaf','transport','heat','spectral','lln','algebraiccurve'] as const;
export type AdvancedLabKey = typeof advancedLabKeys[number];
const laboratories = {ideal:IdealLab,spectrum:SpectrumLab,sheaf:SheafLab,transport:TransportLab,heat:HeatLab,spectral:SpectralLab,lln:LlnLab,algebraiccurve:AlgebraicCurveLab};
export default function AdvancedLab({labKey,language,onExplore}:AdvancedProps&{labKey:string}) {
  const Lab=Object.prototype.hasOwnProperty.call(laboratories,labKey)?laboratories[labKey as AdvancedLabKey]:undefined;
  if(!Lab) return <p role="status">{language==='zh'?'这座岛的实验室尚未编写。':'A laboratory has not yet been authored for this island.'}</p>;
  return <Lab language={language} onExplore={onExplore}/>;
}
