import type { Language } from '../lib/state';

export type ExperimentValue = number | string | boolean | number[];
export interface ConnectionSnapshot {
  parameters: Record<string, ExperimentValue>;
  observations: Record<string, ExperimentValue>;
}
export interface ConnectionLabProps {
  language: Language;
  onSnapshot?: (snapshot: ConnectionSnapshot) => void;
}
