import type { Activity } from '../types';
import { CircuitOrderActivity } from './CircuitOrderActivity';
import { ClickMatchingActivity } from './ClickMatchingActivity';
import { FormulaSelectActivity } from './FormulaSelectActivity';
import { ConnectionTypeActivity } from './ConnectionTypeActivity';
import { MeterConnectionActivity } from './MeterConnectionActivity';
import { MeasurementJudgmentActivity } from './MeasurementJudgmentActivity';
import { ScenarioChoiceActivity } from './ScenarioChoiceActivity';

interface ActivityRendererProps {
  activity: Activity;
  calmMode: boolean;
  onComplete: () => void;
}

export function ActivityRenderer({
  activity,
  calmMode,
  onComplete,
}: ActivityRendererProps) {
  if (activity.circuitOrder) {
    return (
      <CircuitOrderActivity
        activity={activity.circuitOrder}
        calmMode={calmMode}
        onComplete={onComplete}
      />
    );
  }

  if (activity.termMatching) {
    const a = activity.termMatching;
    return (
      <ClickMatchingActivity
        instruction={a.instruction}
        leftItems={a.terms}
        rightItems={a.definitions}
        correctPairs={a.correctPairs}
        leftTitle={a.leftTitle ?? 'Veličiny'}
        rightTitle={a.rightTitle ?? 'Význam'}
        calmMode={calmMode}
        onComplete={onComplete}
      />
    );
  }

  if (activity.formulaSelect) {
    return (
      <FormulaSelectActivity
        activity={activity.formulaSelect}
        calmMode={calmMode}
        onComplete={onComplete}
      />
    );
  }

  if (activity.connectionType) {
    return (
      <ConnectionTypeActivity
        activity={activity.connectionType}
        calmMode={calmMode}
        onComplete={onComplete}
      />
    );
  }

  if (activity.symbolMatching) {
    const a = activity.symbolMatching;
    return (
      <ClickMatchingActivity
        instruction={a.instruction}
        leftItems={a.symbols.map((s) => ({
          id: s.id,
          label: s.symbol,
          ariaLabel: s.ariaLabel,
          className: 'match-item--symbol',
        }))}
        rightItems={a.names}
        correctPairs={a.correctPairs}
        leftTitle="Značky"
        rightTitle="Názvy prvků"
        calmMode={calmMode}
        onComplete={onComplete}
      />
    );
  }

  if (activity.meterConnection) {
    return (
      <MeterConnectionActivity
        activity={activity.meterConnection}
        calmMode={calmMode}
        onComplete={onComplete}
      />
    );
  }

  if (activity.measurementJudgment) {
    return (
      <MeasurementJudgmentActivity
        activity={activity.measurementJudgment}
        calmMode={calmMode}
        onComplete={onComplete}
      />
    );
  }

  if (activity.scenarioChoice) {
    return (
      <ScenarioChoiceActivity
        activity={activity.scenarioChoice}
        calmMode={calmMode}
        onComplete={onComplete}
      />
    );
  }

  return (
    <p className="empty-state" role="alert">
      Aktivita pro tuto lekci není k dispozici.
    </p>
  );
}
