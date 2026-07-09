import { useState } from 'react';
import type { TransistorSwitchDemoConfig } from '../../types';

interface TransistorSwitchDemoProps {
  demo: TransistorSwitchDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

export function TransistorSwitchDemoView({
  demo,
  calmMode,
  onContinue,
}: TransistorSwitchDemoProps) {
  const [signalOn, setSignalOn] = useState<boolean | null>(null);
  const [tried, setTried] = useState<Set<'on' | 'off'>>(new Set());

  const on = signalOn === true;
  const allTried = tried.size === 2;

  const handleSignal = (next: boolean) => {
    setSignalOn(next);
    setTried((prev) => new Set(prev).add(next ? 'on' : 'off'));
  };

  return (
    <section className="interactive-demo" aria-labelledby="demo-title">
      <h2 id="demo-title">Interaktivní ukázka</h2>
      <h3>{demo.title}</h3>
      <p>{demo.description}</p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Vyzkoušej zapnutý i vypnutý řídicí signál ({tried.size} / 2).
        </p>
      )}

      <div
        className="transistor-diagram"
        role="img"
        aria-label={
          signalOn === null
            ? 'Školní model tranzistoru jako spínače: řídicí vstup, tranzistor a LED. Zapni nebo vypni řídicí signál.'
            : on
              ? 'Řídicí signál je zapnutý, tranzistor je sepnutý a LED svítí.'
              : 'Řídicí signál je vypnutý, tranzistor je rozepnutý a LED nesvítí.'
        }
      >
        <div className={`transistor-diagram__control${on ? ' transistor-diagram__control--on' : ''}`}>
          <span aria-hidden="true">{on ? '⚡' : '·'}</span>
          <span>
            Řídicí signál (báze): <strong>{signalOn === null ? '—' : on ? 'zapnutý' : 'vypnutý'}</strong>
          </span>
        </div>
        <div className="transistor-diagram__arrow" aria-hidden="true">
          ↓ malý řídicí proud
        </div>
        <div
          className={`transistor-diagram__device${on ? ' transistor-diagram__device--on' : ''}`}
        >
          <span aria-hidden="true">▷|</span>
          <span>
            Tranzistor: <strong>{signalOn === null ? '—' : on ? 'sepnutý' : 'rozepnutý'}</strong>
          </span>
        </div>
        <div className="transistor-diagram__arrow" aria-hidden="true">
          ↓ větší proud do spotřebiče
        </div>
        <div
          className={`circuit-diagram__part circuit-diagram__bulb${on ? ' circuit-diagram__bulb--on' : ''}`}
        >
          <span className="circuit-diagram__icon" aria-hidden="true">
            💡
          </span>
          <span>LED {signalOn === null ? '' : on ? '(svítí)' : '(nesvítí)'}</span>
        </div>
      </div>

      <div
        className="circuit-diagram__controls"
        role="group"
        aria-label="Ovládání řídicího signálu"
      >
        <button
          type="button"
          className={`btn btn--secondary${on ? ' btn--active' : ''}`}
          onClick={() => handleSignal(true)}
          aria-pressed={on}
        >
          {tried.has('on') ? '✔ ' : ''}Zapnout řídicí signál
        </button>
        <button
          type="button"
          className={`btn btn--secondary${signalOn === false ? ' btn--active' : ''}`}
          onClick={() => handleSignal(false)}
          aria-pressed={signalOn === false}
        >
          {tried.has('off') ? '✔ ' : ''}Vypnout řídicí signál
        </button>
      </div>

      {signalOn !== null && (
        <div
          className={`feedback feedback--${on ? 'success' : 'error'}`}
          role="status"
        >
          {on
            ? '✔ Tranzistor sepne a umožní proud do spotřebiče. LED svítí — malý signál ovládá větší proud.'
            : '✖ Tranzistor nesepnul, proud do spotřebiče neteče. LED nesvítí.'}
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
