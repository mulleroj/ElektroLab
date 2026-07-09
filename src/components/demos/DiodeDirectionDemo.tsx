import { useState } from 'react';
import type { DiodeDirectionDemoConfig } from '../../types';

type Direction = 'forward' | 'reverse';

interface DiodeDirectionDemoProps {
  demo: DiodeDirectionDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

export function DiodeDirectionDemoView({
  demo,
  calmMode,
  onContinue,
}: DiodeDirectionDemoProps) {
  const [direction, setDirection] = useState<Direction | null>(null);
  const [tried, setTried] = useState<Set<Direction>>(new Set());

  const forward = direction === 'forward';
  const allTried = tried.size === 2;

  const handleDirection = (dir: Direction) => {
    setDirection(dir);
    setTried((prev) => new Set(prev).add(dir));
  };

  return (
    <section className="interactive-demo" aria-labelledby="demo-title">
      <h2 id="demo-title">Interaktivní ukázka</h2>
      <h3>{demo.title}</h3>
      <p>{demo.description}</p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Vyzkoušej oba směry zapojení ({tried.size} / 2).
        </p>
      )}

      <div
        className="circuit-diagram"
        role="img"
        aria-label={
          direction
            ? forward
              ? 'Dioda v propustném směru, LED svítí'
              : 'Dioda v závěrném směru, LED nesvítí'
            : 'Školní nízkonapěťový obvod: zdroj, rezistor, dioda a LED. Vyber směr zapojení.'
        }
      >
        <div className="circuit-diagram__part circuit-diagram__source">
          <span className="circuit-diagram__icon" aria-hidden="true">
            🔋
          </span>
          <span>Zdroj (nízké napětí)</span>
        </div>
        <div className="circuit-diagram__wire" aria-hidden="true" />
        <div className="circuit-diagram__part">
          <span className="circuit-diagram__icon" aria-hidden="true">
            ╱╲
          </span>
          <span>Rezistor (ochrana)</span>
        </div>
        <div className="circuit-diagram__wire" aria-hidden="true" />
        <div
          className={`circuit-diagram__part diode-symbol${direction && !forward ? ' diode-symbol--blocking' : ''}`}
        >
          <span className="circuit-diagram__icon" aria-hidden="true">
            {direction ? (forward ? '─▶|─' : '─|◀─') : '─▶|─'}
          </span>
          <span>
            Dioda{' '}
            {direction ? (forward ? '(propustný směr)' : '(závěrný směr)') : ''}
          </span>
        </div>
        <div
          className={`circuit-diagram__wire${direction && !forward ? ' circuit-diagram__wire--broken' : ''}`}
          aria-hidden="true"
        />
        <div
          className={`circuit-diagram__part circuit-diagram__bulb${forward ? ' circuit-diagram__bulb--on' : ''}`}
        >
          <span className="circuit-diagram__icon" aria-hidden="true">
            💡
          </span>
          <span>LED {direction ? (forward ? '(svítí)' : '(nesvítí)') : ''}</span>
        </div>
      </div>

      <div
        className="circuit-diagram__controls"
        role="group"
        aria-label="Výběr směru zapojení diody"
      >
        <button
          type="button"
          className={`btn btn--secondary${forward ? ' btn--active' : ''}`}
          onClick={() => handleDirection('forward')}
          aria-pressed={forward}
        >
          {tried.has('forward') ? '✔ ' : ''}Propustný směr
        </button>
        <button
          type="button"
          className={`btn btn--secondary${direction === 'reverse' ? ' btn--active' : ''}`}
          onClick={() => handleDirection('reverse')}
          aria-pressed={direction === 'reverse'}
        >
          {tried.has('reverse') ? '✔ ' : ''}Závěrný směr
        </button>
      </div>

      {direction && (
        <div
          className={`feedback feedback--${forward ? 'success' : 'error'}`}
          role="status"
        >
          {forward
            ? '✔ Dioda je zapojená v propustném směru, proud může téct. LED svítí.'
            : '✖ Dioda je v závěrném směru, proud neteče běžnou cestou. LED nesvítí.'}
        </div>
      )}

      <button
        type="button"
        className="btn btn--primary"
        onClick={onContinue}
        disabled={!allTried}
      >
        Rozumím, pokračovat na úkol
      </button>
    </section>
  );
}
