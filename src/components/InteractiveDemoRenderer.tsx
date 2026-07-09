import type { InteractiveDemo } from '../types';
import { CircuitSwitchDemoView } from './demos/CircuitSwitchDemo';
import { SeriesParallelDemoView } from './demos/SeriesParallelDemo';
import { SymbolsDemoView } from './demos/SymbolsDemo';
import { VoltmeterDemoView } from './demos/VoltmeterDemo';
import { AmmeterDemoView } from './demos/AmmeterDemo';
import { MeasurementScenariosDemoView } from './demos/MeasurementScenariosDemo';
import { ProtectionDeviceDemoView } from './demos/ProtectionDeviceDemo';
import { ResidualCurrentDemoView } from './demos/ResidualCurrentDemo';
import { ProtectionScenarioDemoView } from './demos/ProtectionScenarioDemo';
import { DiodeDirectionDemoView } from './demos/DiodeDirectionDemo';
import { TransistorSwitchDemoView } from './demos/TransistorSwitchDemo';
import { LogicGateDemoView } from './demos/LogicGateDemo';

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
    case 'protection-device':
      return (
        <ProtectionDeviceDemoView demo={demo} calmMode={calmMode} onContinue={onContinue} />
      );
    case 'residual-current':
      return (
        <ResidualCurrentDemoView demo={demo} calmMode={calmMode} onContinue={onContinue} />
      );
    case 'protection-scenario':
      return (
        <ProtectionScenarioDemoView demo={demo} calmMode={calmMode} onContinue={onContinue} />
      );
    case 'diode-direction':
      return (
        <DiodeDirectionDemoView demo={demo} calmMode={calmMode} onContinue={onContinue} />
      );
    case 'transistor-switch':
      return (
        <TransistorSwitchDemoView demo={demo} calmMode={calmMode} onContinue={onContinue} />
      );
    case 'logic-gates':
      return <LogicGateDemoView demo={demo} calmMode={calmMode} onContinue={onContinue} />;
    default:
      return null;
  }
}
