import type { InteractiveDemo } from '../types';
import { CircuitSwitchDemoView } from './demos/CircuitSwitchDemo';
import { SeriesParallelDemoView } from './demos/SeriesParallelDemo';
import { SymbolsDemoView } from './demos/SymbolsDemo';
import { VoltmeterDemoView } from './demos/VoltmeterDemo';
import { AmmeterDemoView } from './demos/AmmeterDemo';
import { MeasurementScenariosDemoView } from './demos/MeasurementScenariosDemo';

interface InteractiveDemoRendererProps {
  demo: InteractiveDemo;
  calmMode: boolean;
  onContinue: () => void;
}

export function InteractiveDemoRenderer({
  demo,
  calmMode,
  onContinue,
}: InteractiveDemoRendererProps) {
  switch (demo.type) {
    case 'circuit-switch':
      return (
        <CircuitSwitchDemoView demo={demo} calmMode={calmMode} onContinue={onContinue} />
      );
    case 'series-parallel':
      return (
        <SeriesParallelDemoView demo={demo} calmMode={calmMode} onContinue={onContinue} />
      );
    case 'symbols-demo':
      return <SymbolsDemoView demo={demo} calmMode={calmMode} onContinue={onContinue} />;
    case 'voltmeter-connection':
      return <VoltmeterDemoView demo={demo} calmMode={calmMode} onContinue={onContinue} />;
    case 'ammeter-connection':
      return <AmmeterDemoView demo={demo} calmMode={calmMode} onContinue={onContinue} />;
    case 'measurement-scenarios':
      return (
        <MeasurementScenariosDemoView
          demo={demo}
          calmMode={calmMode}
          onContinue={onContinue}
        />
      );
    default:
      return null;
  }
}
