import { useState } from 'react';
import type { SensorDemoConfig } from '../../types';

type SensorState = 'empty' | 'entered' | 'left';

const STATES: {
  id: SensorState;
  label: string;
  detected: boolean;
  lightOn: boolean;
  explanation: string;
}[] = [
  {
    id: 'empty',
    label: 'Nikdo není v prostoru',
    detected: false,
    lightOn: false,
    explanation:
      'Snímač nezaznamenává žádný pohyb, proto systém nechává světlo zhasnuté.',
  },
  {
    id: 'entered',
    label: 'Osoba vstoupila',
    detected: true,
    lightOn: true,
    explanation:
      'Snímač zaznamenal pohyb a předal informaci řídicímu systému — ten rozsvítil světlo. Snímač sám nic nezapíná, jen hlásí, co zjistil.',
  },
  {
    id: 'left',
    label: 'Osoba odešla',
    detected: false,
    lightOn: false,
    explanation:
      'Snímač už pohyb nehlásí, a tak systém světlo zhasl. Rozhoduje systém — snímač je jeho „oči“, ne „mozek“.',
  },
];

interface SensorDemoProps {
  demo: SensorDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

export function SensorDemoView({ demo, calmMode, onContinue }: SensorDemoProps) {
  const [active, setActive] = useState<SensorState | null>(null);
  const [tried, setTried] = useState<Set<SensorState>>(new Set());

  const state = STATES.find((s) => s.id === active) ?? null;
  const allTried = tried.size === STATES.length;

  const handleState = (id: SensorState) => {
    setActive(id);
    setTried((prev) => new Set(prev).add(id));
  };

  return (
    <section className="interactive-demo" aria-labelledby="demo-title">
      <h2 id="demo-title">Interaktivní ukázka</h2>
      <h3>{demo.title}</h3>
      <p>{demo.description}</p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Vyzkoušej všechny tři situace ({tried.size} / {STATES.length}).
        </p>
      )}

      <div
        className="automation-diagram"
        role="img"
        aria-label={
          state
            ? `${state.label}: snímač ${state.detected ? 'detekuje pohyb' : 'pohyb nedetekuje'}, světlo je ${state.lightOn ? 'rozsvícené' : 'zhasnuté'}`
            : 'Chodba se snímačem pohybu a světlem. Vyber situaci.'
        }
      >
        <div
          className={`automation-diagram__box${state?.detected ? ' automation-diagram__box--active' : ''}`}
        >
          <span aria-hidden="true">📡</span>
          <span>
            Snímač pohybu:{' '}
            <strong>{state ? (state.detected ? 'detekuje' : 'klid') : '—'}</strong>
          </span>
        </div>
        <div className="automation-diagram__arrow" aria-hidden="true">
          ↓ předává informaci
        </div>
        <div className="automation-diagram__box">
          <span aria-hidden="true">🧠</span>
          <span>Řídicí systém rozhoduje</span>
        </div>
        <div className="automation-diagram__arrow" aria-hidden="true">
          ↓ povel
        </div>
        <div
          className={`circuit-diagram__part circuit-diagram__bulb${state?.lightOn ? ' circuit-diagram__bulb--on' : ''}`}
        >
          <span className="circuit-diagram__icon" aria-hidden="true">
            💡
          </span>
          <span>Světlo {state ? (state.lightOn ? '(svítí)' : '(nesvítí)') : ''}</span>
        </div>
      </div>

      <div
        className="circuit-diagram__controls"
        role="group"
        aria-label="Výběr situace"
      >
        {STATES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`btn btn--secondary${active === s.id ? ' btn--active' : ''}`}
            onClick={() => handleState(s.id)}
            aria-pressed={active === s.id}
          >
            {tried.has(s.id) ? '✔ ' : ''}
            {s.label}
          </button>
        ))}
      </div>

      {state && (
        <div className="logic-gate__explain" role="status">
          {state.lightOn ? '💡 Světlo svítí. ' : '· Světlo nesvítí. '}
          {state.explanation}
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
