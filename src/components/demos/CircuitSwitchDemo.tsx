import { useState } from 'react';
import type { CircuitSwitchDemo } from '../../types';

interface CircuitSwitchDemoProps {
  demo: CircuitSwitchDemo;
  calmMode: boolean;
  onContinue: () => void;
}

export function CircuitSwitchDemoView({
  demo,
  calmMode,
  onContinue,
}: CircuitSwitchDemoProps) {
  const [closed, setClosed] = useState(false);
  const [tried, setTried] = useState(false);

  const handleToggle = (nextClosed: boolean) => {
    setClosed(nextClosed);
    setTried(true);
  };

  return (
    <section className="interactive-demo" aria-labelledby="demo-title">
      <h2 id="demo-title">Interaktivní ukázka</h2>
      <h3>{demo.title}</h3>
      <p>{demo.description}</p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Vyzkoušej oba stavy vypínače.
        </p>
      )}

      <div
        className={`circuit-diagram${closed ? ' circuit-diagram--closed' : ' circuit-diagram--open'}`}
        role="img"
        aria-label={
          closed
            ? 'Uzavřený obvod, žárovka svítí'
            : 'Přerušený obvod, žárovka nesvítí'
        }
      >
        <div className="circuit-diagram__part circuit-diagram__source">
          <span className="circuit-diagram__icon" aria-hidden="true">
            🔋
          </span>
          <span>Zdroj</span>
        </div>
        <div className="circuit-diagram__wire" aria-hidden="true" />
        <div
          className={`circuit-diagram__part circuit-diagram__switch${closed ? ' circuit-diagram__switch--closed' : ''}`}
        >
          <span className="circuit-diagram__icon" aria-hidden="true">
            {closed ? '─●─' : '─ ○ ─'}
          </span>
          <span>Vypínač</span>
        </div>
        <div
          className={`circuit-diagram__wire${closed ? '' : ' circuit-diagram__wire--broken'}`}
          aria-hidden="true"
        />
        <div
          className={`circuit-diagram__part circuit-diagram__bulb${closed ? ' circuit-diagram__bulb--on' : ''}`}
        >
          <span className="circuit-diagram__icon" aria-hidden="true">
            💡
          </span>
          <span>Žárovka</span>
        </div>
        <div
          className={`circuit-diagram__wire${closed ? '' : ' circuit-diagram__wire--broken'}`}
          aria-hidden="true"
        />
        <div className="circuit-diagram__part circuit-diagram__return">
          <span className="circuit-diagram__icon" aria-hidden="true">
            ↩
          </span>
          <span>Zpět</span>
        </div>
      </div>

      <div className="circuit-diagram__controls" role="group" aria-label="Ovládání vypínače">
        <button
          type="button"
          className={`btn btn--secondary${closed ? ' btn--active' : ''}`}
          onClick={() => handleToggle(true)}
          aria-pressed={closed}
        >
          Sepnout vypínač
        </button>
        <button
          type="button"
          className={`btn btn--secondary${!closed ? ' btn--active' : ''}`}
          onClick={() => handleToggle(false)}
          aria-pressed={!closed}
        >
          Rozpojit vypínač
        </button>
      </div>

      {tried && (
        <div
          className={`feedback feedback--${closed ? 'success' : 'error'}`}
          role="status"
        >
          {closed ? '✔ ' : '✖ '}
          {closed
            ? 'Obvod je uzavřený, proud může téct. Žárovka svítí.'
            : 'Obvod je přerušený, proud neteče. Žárovka nesvítí.'}
        </div>
      )}

      <button
        type="button"
        className="btn btn--primary"
        onClick={onContinue}
        disabled={!tried}
      >
        Rozumím, pokračovat na úkol
      </button>
    </section>
  );
}
