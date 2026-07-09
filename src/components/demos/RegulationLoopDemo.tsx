import { useState } from 'react';
import type { RegulationLoopDemoConfig } from '../../types';

type TempState = 'cold' | 'hot' | 'ok';

const TARGET = 22;

const STATES: {
  id: TempState;
  label: string;
  temp: number;
  heatingOn: boolean;
  explanation: string;
}[] = [
  {
    id: 'cold',
    label: 'Je zima',
    temp: 18,
    heatingOn: true,
    explanation:
      'Snímač hlásí 18 °C. Regulátor porovná hodnotu s požadovanými 22 °C — je nižší, proto zapne topení.',
  },
  {
    id: 'hot',
    label: 'Je teplo',
    temp: 26,
    heatingOn: false,
    explanation:
      'Snímač hlásí 26 °C — víc, než je požadováno. Regulátor topení vypne, aby se místnost nepřehřívala.',
  },
  {
    id: 'ok',
    label: 'Teplota je správná',
    temp: 22,
    heatingOn: false,
    explanation:
      'Snímač hlásí 22 °C — přesně požadovanou hodnotu. Regulátor topení nechává vypnuté a dál hlídá. Právě tohle je zpětná vazba: systém pořád sleduje výsledek a reaguje.',
  },
];

interface RegulationLoopDemoProps {
  demo: RegulationLoopDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

export function RegulationLoopDemoView({
  demo,
  calmMode,
  onContinue,
}: RegulationLoopDemoProps) {
  const [active, setActive] = useState<TempState | null>(null);
  const [tried, setTried] = useState<Set<TempState>>(new Set());

  const state = STATES.find((s) => s.id === active) ?? null;
  const allTried = tried.size === STATES.length;

  const handleState = (id: TempState) => {
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
            ? `Aktuální teplota ${state.temp} stupňů, požadovaná ${TARGET}. Topení je ${state.heatingOn ? 'zapnuté' : 'vypnuté'}.`
            : `Regulace teploty v místnosti na ${TARGET} stupňů. Vyber situaci.`
        }
      >
        <div className="automation-diagram__box">
          <span aria-hidden="true">🎯</span>
          <span>
            Požadovaná hodnota: <strong>{TARGET} °C</strong>
          </span>
        </div>
        <div className="automation-diagram__box">
          <span aria-hidden="true">🌡️</span>
          <span>
            Snímač měří: <strong>{state ? `${state.temp} °C` : '—'}</strong>
          </span>
        </div>
        <div className="automation-diagram__arrow" aria-hidden="true">
          ↓ porovnání hodnot
        </div>
        <div className="automation-diagram__box">
          <span aria-hidden="true">🧠</span>
          <span>Regulátor rozhoduje</span>
        </div>
        <div className="automation-diagram__arrow" aria-hidden="true">
          ↓ povel akčnímu členu
        </div>
        <div
          className={`automation-diagram__box${state?.heatingOn ? ' automation-diagram__box--active' : ''}`}
        >
          <span aria-hidden="true">{state?.heatingOn ? '🔥' : '·'}</span>
          <span>
            Topení: <strong>{state ? (state.heatingOn ? 'zapnuto' : 'vypnuto') : '—'}</strong>
          </span>
        </div>
        <div className="automation-diagram__arrow" aria-hidden="true">
          ↺ zpětná vazba: snímač měří výsledek znovu
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
          {state.heatingOn ? '🔥 Topení zapnuto. ' : '· Topení vypnuto. '}
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
