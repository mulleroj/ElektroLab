import { useState } from 'react';
import type { AmmeterConnectionDemo } from '../../types';

interface AmmeterDemoProps {
  demo: AmmeterConnectionDemo;
  calmMode: boolean;
  onContinue: () => void;
}

type Placement = 'serial' | 'parallel' | null;

export function AmmeterDemoView({ demo, calmMode, onContinue }: AmmeterDemoProps) {
  const [placement, setPlacement] = useState<Placement>(null);
  const [triedSerial, setTriedSerial] = useState(false);

  const handlePlace = (p: 'serial' | 'parallel') => {
    setPlacement(p);
    if (p === 'serial') setTriedSerial(true);
  };

  return (
    <section className="interactive-demo" aria-labelledby="demo-title">
      <h2 id="demo-title">Interaktivní ukázka</h2>
      <h3>{demo.title}</h3>
      <p>{demo.description}</p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Zkus obě možnosti zapojení ampérmetru (A).
        </p>
      )}

      <div
        className={`meter-circuit meter-circuit--amp${placement ? ` meter-circuit--${placement}` : ''}`}
        role="img"
        aria-label="Obvod se zdrojem, žárovkou a ampérmetrem"
      >
        <span className="meter-circuit__source">🔋 Zdroj</span>
        <span className="meter-circuit__line" />
        {placement === 'serial' && (
          <span className="meter-circuit__meter meter-circuit__meter--inline">A sériově</span>
        )}
        <span className="meter-circuit__load">💡 Spotřebič</span>
        <span className="meter-circuit__line" />
        <span className="meter-circuit__return">↩</span>
        {placement === 'parallel' && (
          <span className="meter-circuit__meter meter-circuit__meter--parallel">A paralelně</span>
        )}
      </div>

      <div className="meter-circuit__controls" role="group" aria-label="Způsob zapojení ampérmetru">
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

      {placement === 'parallel' && (
        <div className="feedback feedback--error" role="alert">
          ✖ Paralelní zapojení ampérmetru je chyba — vytvoří zkrat a může poškodit přístroj.
          Ampérmetr patří sériově do cesty proudu.
        </div>
      )}
      {placement === 'serial' && (
        <div className="feedback feedback--success" role="status">
          ✔ Správně! Ampérmetr je v sérii — měří proud procházející obvodem.
        </div>
      )}

      <button
        type="button"
        className="btn btn--primary"
        onClick={onContinue}
        disabled={!triedSerial}
      >
        Rozumím, pokračovat na úkol
      </button>
    </section>
  );
}
