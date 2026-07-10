import { useState } from 'react';
import type { InductionMotorDemoConfig } from '../../types';

type MotorState = 'stopped' | 'field' | 'starting' | 'running';

const STATES: {
  id: MotorState;
  label: string;
  fieldText: string;
  rotorText: string;
  explanation: string;
}[] = [
  {
    id: 'stopped',
    label: 'Motor stojí',
    fieldText: 'bez napájení — pole nevzniká',
    rotorText: 'stojí',
    explanation:
      'Stator není napájený, žádné točivé pole nevzniká a rotor stojí.',
  },
  {
    id: 'field',
    label: 'Pole se otáčí',
    fieldText: 'točí se (vytváří ho stator)',
    rotorText: 'zatím stojí',
    explanation:
      'Stator dostal střídavé napájení a vytvořil točivé magnetické pole. Rotor se ještě nestihl pohnout.',
  },
  {
    id: 'starting',
    label: 'Rotor se rozbíhá',
    fieldText: 'točí se plnou rychlostí',
    rotorText: 'rozbíhá se — pole ho „táhne“',
    explanation:
      'Točivé pole „táhne“ rotor za sebou, rotor se rozbíhá a otáčky rostou.',
  },
  {
    id: 'running',
    label: 'Motor běží',
    fieldText: 'točí se plnou rychlostí',
    rotorText: 'točí se — o kousek pomaleji než pole',
    explanation:
      'Rotor se točí, ale vždy o trochu pomaleji než pole — „opožďuje se“ za ním. Právě proto se motor jmenuje ASYNCHRONNÍ (neběží stejně s polem).',
  },
];

interface InductionMotorDemoProps {
  demo: InductionMotorDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

export function InductionMotorDemoView({
  demo,
  calmMode,
  onContinue,
}: InductionMotorDemoProps) {
  const [active, setActive] = useState<MotorState | null>(null);
  const [tried, setTried] = useState<Set<MotorState>>(new Set());

  const state = STATES.find((s) => s.id === active) ?? null;
  const allTried = tried.size === STATES.length;

  const handleState = (id: MotorState) => {
    setActive(id);
    setTried((prev) => new Set(prev).add(id));
  };

  const rotorMoving = active === 'starting' || active === 'running';

  return (
    <section className="interactive-demo" aria-labelledby="demo-title">
      <h2 id="demo-title">Interaktivní ukázka</h2>
      <h3>{demo.title}</h3>
      <p>{demo.description}</p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Projdi všechny čtyři stavy motoru ({tried.size} / {STATES.length}).
        </p>
      )}

      <div
        className="automation-diagram"
        role="img"
        aria-label={
          state
            ? `${state.label}: magnetické pole ${state.fieldText}, rotor ${state.rotorText}.`
            : 'Zjednodušený asynchronní motor: stator, točivé pole, rotor a hřídel. Vyber stav.'
        }
      >
        <div
          className={`automation-diagram__box${active && active !== 'stopped' ? ' automation-diagram__box--active' : ''}`}
        >
          <span aria-hidden="true">⭕</span>
          <span>
            <strong>Stator</strong> (pevná část) — vytváří točivé pole:{' '}
            {state ? state.fieldText : '—'}
          </span>
        </div>
        <div className="automation-diagram__arrow" aria-hidden="true">
          ↓ pole „táhne“ rotor (směr otáčení ↻)
        </div>
        <div
          className={`automation-diagram__box${rotorMoving ? ' automation-diagram__box--active' : ''}`}
        >
          <span aria-hidden="true">{rotorMoving ? '🌀' : '·'}</span>
          <span>
            <strong>Rotor</strong> (otáčivá část): {state ? state.rotorText : '—'}
          </span>
        </div>
        <div className="automation-diagram__arrow" aria-hidden="true">
          ↓ otáčení jde ven
        </div>
        <div className="automation-diagram__box">
          <span aria-hidden="true">🔩</span>
          <span>
            <strong>Hřídel</strong> — mechanický výstup k poháněnému stroji
          </span>
        </div>
      </div>

      <div
        className="circuit-diagram__controls"
        role="group"
        aria-label="Výběr stavu motoru"
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
