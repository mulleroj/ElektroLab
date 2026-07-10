import { useState } from 'react';
import type { TransformerDemoConfig } from '../../types';

type TurnsState = 'more' | 'less' | 'same';

const STATES: {
  id: TurnsState;
  label: string;
  secondaryTurns: string;
  output: string;
  explanation: string;
}[] = [
  {
    id: 'more',
    label: 'Více závitů na sekundáru',
    secondaryTurns: 'více závitů (např. dvojnásobek)',
    output: 'vyšší než na vstupu',
    explanation:
      'Sekundární vinutí má více závitů než primární — napětí se zvýší. Takový transformátor napětí ZVYŠUJE.',
  },
  {
    id: 'less',
    label: 'Méně závitů na sekundáru',
    secondaryTurns: 'méně závitů (např. polovina)',
    output: 'nižší než na vstupu',
    explanation:
      'Sekundární vinutí má méně závitů — napětí se sníží. Takový transformátor napětí SNIŽUJE (třeba v nabíječce).',
  },
  {
    id: 'same',
    label: 'Stejný počet závitů',
    secondaryTurns: 'stejně závitů jako primár',
    output: 'přibližně stejné jako na vstupu',
    explanation:
      'Stejný počet závitů na obou stranách — napětí zůstane přibližně stejné (převod asi 1:1). Takový transformátor se používá hlavně k oddělení obvodů.',
  },
];

interface TransformerDemoProps {
  demo: TransformerDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

export function TransformerDemoView({
  demo,
  calmMode,
  onContinue,
}: TransformerDemoProps) {
  const [active, setActive] = useState<TurnsState | null>(null);
  const [tried, setTried] = useState<Set<TurnsState>>(new Set());

  const state = STATES.find((s) => s.id === active) ?? null;
  const allTried = tried.size === STATES.length;

  const handleState = (id: TurnsState) => {
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
          Vyzkoušej všechny tři varianty vinutí ({tried.size} / {STATES.length}).
        </p>
      )}

      <div
        className="automation-diagram"
        role="img"
        aria-label={
          state
            ? `Transformátor: sekundár má ${state.secondaryTurns}, výstupní napětí je ${state.output}.`
            : 'Školní transformátor: primární vinutí, magnetické jádro a sekundární vinutí. Vyber variantu vinutí.'
        }
      >
        <div className="automation-diagram__box">
          <span aria-hidden="true">🔌</span>
          <span>
            Vstup — <strong>primární vinutí</strong> (střídavé napětí, např. 230 V)
          </span>
        </div>
        <div className="automation-diagram__arrow" aria-hidden="true">
          ↓ magnetické pole prochází jádrem
        </div>
        <div className="automation-diagram__box">
          <span aria-hidden="true">🧲</span>
          <span>
            <strong>Magnetické jádro</strong> — přenáší energii mezi vinutími
          </span>
        </div>
        <div className="automation-diagram__arrow" aria-hidden="true">
          ↓ indukuje napětí v druhém vinutí
        </div>
        <div
          className={`automation-diagram__box${state ? ' automation-diagram__box--active' : ''}`}
        >
          <span aria-hidden="true">🌀</span>
          <span>
            Výstup — <strong>sekundární vinutí</strong>:{' '}
            {state ? state.secondaryTurns : '—'}
          </span>
        </div>
        <div className="automation-diagram__box">
          <span aria-hidden="true">📤</span>
          <span>
            Výstupní napětí: <strong>{state ? state.output : '—'}</strong>
          </span>
        </div>
      </div>

      <div
        className="circuit-diagram__controls"
        role="group"
        aria-label="Výběr počtu závitů sekundáru"
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
