import { useState } from 'react';
import type { AutomationLogicDemoConfig } from '../../types';

interface AutomationLogicDemoProps {
  demo: AutomationLogicDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

export function AutomationLogicDemoView({
  demo,
  calmMode,
  onContinue,
}: AutomationLogicDemoProps) {
  const [startOn, setStartOn] = useState(false);
  const [coverClosed, setCoverClosed] = useState(true);
  const [seenOutcomes, setSeenOutcomes] = useState<Set<'runs' | 'stopped'>>(
    new Set(),
  );

  const motorRuns = startOn && coverClosed;

  const registerOutcome = (nextStart: boolean, nextCover: boolean) => {
    const runs = nextStart && nextCover;
    setSeenOutcomes((prev) => new Set(prev).add(runs ? 'runs' : 'stopped'));
  };

  const handleStart = () => {
    const next = !startOn;
    setStartOn(next);
    registerOutcome(next, coverClosed);
  };

  const handleCover = () => {
    const next = !coverClosed;
    setCoverClosed(next);
    registerOutcome(startOn, next);
  };

  const allSeen = seenOutcomes.size === 2;

  return (
    <section className="interactive-demo" aria-labelledby="demo-title">
      <h2 id="demo-title">Interaktivní ukázka</h2>
      <h3>{demo.title}</h3>
      <p>{demo.description}</p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Vyzkoušej stav, kdy motor běží, i stav, kdy stojí ({seenOutcomes.size} / 2).
        </p>
      )}

      <div
        className="automation-diagram"
        role="img"
        aria-label={`Dopravníkový pás: START je ${startOn ? 'zapnutý' : 'vypnutý'}, kryt je ${coverClosed ? 'zavřený' : 'otevřený'}, motor ${motorRuns ? 'běží' : 'neběží'}.`}
      >
        <div
          className={`automation-diagram__box${startOn ? ' automation-diagram__box--active' : ''}`}
        >
          <span aria-hidden="true">{startOn ? '🟢' : '⚪'}</span>
          <span>
            Podmínka A — START: <strong>{startOn ? 'zapnuto' : 'vypnuto'}</strong>
          </span>
        </div>
        <div
          className={`automation-diagram__box${coverClosed ? ' automation-diagram__box--active' : ' automation-diagram__box--alert'}`}
        >
          <span aria-hidden="true">{coverClosed ? '🔒' : '⚠️'}</span>
          <span>
            Podmínka B — bezpečnostní kryt:{' '}
            <strong>{coverClosed ? 'zavřený' : 'otevřený'}</strong>
          </span>
        </div>
        <div className="automation-diagram__arrow" aria-hidden="true">
          ↓ logická podmínka: A ZÁROVEŇ B (AND)
        </div>
        <div
          className={`automation-diagram__box${motorRuns ? ' automation-diagram__box--active' : ''}`}
        >
          <span aria-hidden="true">{motorRuns ? '⚙️' : '·'}</span>
          <span>
            Motor pásu: <strong>{motorRuns ? 'běží' : 'neběží'}</strong>
          </span>
        </div>
      </div>

      <div
        className="circuit-diagram__controls"
        role="group"
        aria-label="Ovládání pásu"
      >
        <button
          type="button"
          className={`btn btn--secondary${startOn ? ' btn--active' : ''}`}
          onClick={handleStart}
          aria-pressed={startOn}
        >
          START: {startOn ? 'zapnuto' : 'vypnuto'}
        </button>
        <button
          type="button"
          className={`btn btn--secondary${coverClosed ? ' btn--active' : ''}`}
          onClick={handleCover}
          aria-pressed={coverClosed}
        >
          Kryt: {coverClosed ? 'zavřený' : 'otevřený'}
        </button>
      </div>

      <div className="logic-gate__explain" role="status">
        {motorRuns
          ? 'Motor běží: obě podmínky jsou splněny zároveň — START je zapnutý A ZÁROVEŇ kryt je zavřený. Přesně tak funguje logické AND.'
          : startOn && !coverClosed
            ? 'Motor neběží: otevřený kryt přerušil podmínku AND. To je bezpečnostní funkce — otevřený kryt musí stroj vždy zastavit, aby nikoho nezranil.'
            : 'Motor neběží: podmínka AND není splněna — chybí zapnutý START' +
              (coverClosed ? '.' : ' a zavřený kryt.')}
      </div>

      <button
        type="button"
        className="btn btn--primary"
        onClick={onContinue}
        disabled={!allSeen}
      >
        Rozumím, pokračovat na úkol
      </button>
    </section>
  );
}
