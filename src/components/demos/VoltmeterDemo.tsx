import { useState } from 'react';
import type { VoltmeterConnectionDemo } from '../../types';

interface VoltmeterDemoProps {
  demo: VoltmeterConnectionDemo;
  calmMode: boolean;
  onContinue: () => void;
}

type Placement = 'serial' | 'parallel' | null;

export function VoltmeterDemoView({ demo, calmMode, onContinue }: VoltmeterDemoProps) {
  const [placement, setPlacement] = useState<Placement>(null);
  const [triedParallel, setTriedParallel] = useState(false);

  const handlePlace = (p: 'serial' | 'parallel') => {
    setPlacement(p);
    if (p === 'parallel') setTriedParallel(true);
  };

  return (
    <section className="interactive-demo" aria-labelledby="demo-title">
      <h2 id="demo-title">Interaktivní ukázka</h2>
      <h3>{demo.title}</h3>
      <p>{demo.description}</p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Zkus obě možnosti zapojení voltmetru (V).
        </p>
      )}

      <div
        className={`meter-circuit meter-circuit--volt${placement ? ` meter-circuit--${placement}` : ''}`}
        role="img"
        aria-label="Obvod se zdrojem, žárovkou a voltmetrem"
      >
        <span className="meter-circuit__source">🔋 Zdroj</span>
        <span className="meter-circuit__line" />
        <span className="meter-circuit__load">💡 Spotřebič</span>
        <span className="meter-circuit__line" />
        <span className="meter-circuit__return">↩</span>
        {placement === 'serial' && (
          <span className="meter-circuit__meter meter-circuit__meter--serial">V sériově</span>
        )}
        {placement === 'parallel' && (
          <span className="meter-circuit__meter meter-circuit__meter--parallel">V paralelně</span>
        )}
      </div>

      <div className="meter-circuit__controls" role="group" aria-label="Způsob zapojení voltmetru">
        <button
          type="button"
          className={`btn btn--secondary${placement === 'serial' ? ' btn--active' : ''}`}
          onClick={() => handlePlace('serial')}
          aria-pressed={placement === 'serial'}
        >
          Zapojit sériově
        </button>
        <button
          type="button"
          className={`btn btn--secondary${placement === 'parallel' ? ' btn--active' : ''}`}
          onClick={() => handlePlace('parallel')}
          aria-pressed={placement === 'parallel'}
        >
          Zapojit paralelně
        </button>
      </div>

      {placement === 'serial' && (
        <div className="feedback feedback--error" role="alert">
          ✖ Sériové zapojení voltmetru je chyba — přeruší obvod a měření bude špatné.
          Voltmetr patří paralelně ke spotřebiči.
        </div>
      )}
      {placement === 'parallel' && (
        <div className="feedback feedback--success" role="status">
          ✔ Správně! Voltmetr je paralelně ke spotřebiči — měří napětí mezi dvěma body.
        </div>
      )}

      <button
        type="button"
        className="btn btn--primary"
        onClick={onContinue}
        disabled={!triedParallel}
      >
        Rozumím, pokračovat na úkol
      </button>
    </section>
  );
}
