import { useState } from 'react';
import type { FeedbackDemoConfig } from '../../types';

type LevelState = 'low' | 'ok' | 'high';

const STATES: {
  id: LevelState;
  label: string;
  pump: 'on' | 'off' | 'stop';
  levelText: string;
  explanation: string;
}[] = [
  {
    id: 'low',
    label: 'Hladina nízká',
    pump: 'on',
    levelText: 'nízká (▁)',
    explanation:
      'Snímač hladiny hlásí málo vody. Systém zapne čerpadlo a nádrž se doplňuje.',
  },
  {
    id: 'ok',
    label: 'Hladina správná',
    pump: 'off',
    levelText: 'správná (▄)',
    explanation:
      'Snímač hlásí správnou hladinu. Čerpadlo je vypnuté — systém jen dál sleduje. To je zpětná vazba v praxi.',
  },
  {
    id: 'high',
    label: 'Hladina vysoká',
    pump: 'stop',
    levelText: 'vysoká (█) — nad limitem!',
    explanation:
      'Hladina je nad bezpečným limitem — čerpadlo se bezpečně zastaví a systém signalizuje stav. Takovou situaci v reálu řeší odborník, ne pokusy.',
  },
];

interface FeedbackDemoProps {
  demo: FeedbackDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

export function FeedbackDemoView({ demo, calmMode, onContinue }: FeedbackDemoProps) {
  const [active, setActive] = useState<LevelState | null>(null);
  const [tried, setTried] = useState<Set<LevelState>>(new Set());

  const state = STATES.find((s) => s.id === active) ?? null;
  const allTried = tried.size === STATES.length;

  const handleState = (id: LevelState) => {
    setActive(id);
    setTried((prev) => new Set(prev).add(id));
  };

  const pumpLabel =
    state?.pump === 'on'
      ? 'zapnuto'
      : state?.pump === 'off'
        ? 'vypnuto'
        : state?.pump === 'stop'
          ? 'bezpečně zastaveno + signalizace'
          : '—';

  return (
    <section className="interactive-demo" aria-labelledby="demo-title">
      <h2 id="demo-title">Interaktivní ukázka</h2>
      <h3>{demo.title}</h3>
      <p>{demo.description}</p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Vyzkoušej všechny tři stavy hladiny ({tried.size} / {STATES.length}).
        </p>
      )}

      <div
        className="automation-diagram"
        role="img"
        aria-label={
          state
            ? `Hladina v nádrži je ${state.levelText}. Čerpadlo: ${pumpLabel}.`
            : 'Nádrž se snímačem hladiny a čerpadlem. Vyber stav hladiny.'
        }
      >
        <div className="automation-diagram__box">
          <span aria-hidden="true">🛢️</span>
          <span>
            Nádrž — hladina: <strong>{state ? state.levelText : '—'}</strong>
          </span>
        </div>
        <div className="automation-diagram__arrow" aria-hidden="true">
          ↓ snímač hladiny hlásí stav
        </div>
        <div className="automation-diagram__box">
          <span aria-hidden="true">🧠</span>
          <span>Řídicí systém porovnává s limity</span>
        </div>
        <div className="automation-diagram__arrow" aria-hidden="true">
          ↓ povel
        </div>
        <div
          className={`automation-diagram__box${state?.pump === 'on' ? ' automation-diagram__box--active' : ''}${state?.pump === 'stop' ? ' automation-diagram__box--alert' : ''}`}
        >
          <span aria-hidden="true">
            {state?.pump === 'on' ? '⚙️' : state?.pump === 'stop' ? '⚠️' : '·'}
          </span>
          <span>
            Čerpadlo: <strong>{pumpLabel}</strong>
          </span>
        </div>
        <div className="automation-diagram__arrow" aria-hidden="true">
          ↺ zpětná vazba: hladina se měří znovu
        </div>
      </div>

      <div
        className="circuit-diagram__controls"
        role="group"
        aria-label="Výběr stavu hladiny"
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
          {state.pump === 'stop' ? '⚠️ ' : ''}
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
