import { useState } from 'react';
import type { ProtectionDeviceDemoConfig } from '../../types';

type ScenarioId = 'normal' | 'overload' | 'short';

const SCENARIOS: {
  id: ScenarioId;
  label: string;
  breakerTrips: boolean;
  explanation: string;
}[] = [
  {
    id: 'normal',
    label: 'Normální provoz',
    breakerTrips: false,
    explanation:
      'Obvodem teče běžný proud. Jistič zůstává sepnutý a spotřebič pracuje.',
  },
  {
    id: 'overload',
    label: 'Přetížení',
    breakerTrips: true,
    explanation:
      'Obvodem teče větší proud, než na jaký je navržen — třeba kvůli mnoha spotřebičům najednou. Jistič po chvíli vypne, aby se vodiče nepřehřály.',
  },
  {
    id: 'short',
    label: 'Zkrat',
    breakerTrips: true,
    explanation:
      'Proud najednou prudce vzroste — teče zkratovou cestou bez spotřebiče. Jistič vypne okamžitě, aby nevznikl požár nebo poškození rozvodu.',
  },
];

interface ProtectionDeviceDemoProps {
  demo: ProtectionDeviceDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

export function ProtectionDeviceDemoView({
  demo,
  calmMode,
  onContinue,
}: ProtectionDeviceDemoProps) {
  const [active, setActive] = useState<ScenarioId | null>(null);
  const [tried, setTried] = useState<Set<ScenarioId>>(new Set());

  const scenario = SCENARIOS.find((s) => s.id === active) ?? null;
  const tripped = scenario?.breakerTrips ?? false;
  const allTried = tried.size === SCENARIOS.length;

  const handleScenario = (id: ScenarioId) => {
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
          Vyzkoušej všechny tři scénáře ({tried.size} / {SCENARIOS.length}).
        </p>
      )}

      <div
        className="circuit-diagram"
        role="img"
        aria-label={
          scenario
            ? `${scenario.label}: jistič je ${tripped ? 'vypnutý, obvod je přerušený' : 'sepnutý, obvod pracuje'}`
            : 'Školní obvod: zdroj, jistič a spotřebič. Vyber scénář.'
        }
      >
        <div className="circuit-diagram__part circuit-diagram__source">
          <span className="circuit-diagram__icon" aria-hidden="true">
            🔌
          </span>
          <span>Zdroj</span>
        </div>
        <div className="circuit-diagram__wire" aria-hidden="true" />
        <div
          className={`circuit-diagram__part protection-breaker${tripped ? ' protection-breaker--tripped' : ''}`}
        >
          <span className="circuit-diagram__icon" aria-hidden="true">
            {tripped ? '─/ ─' : '─●─'}
          </span>
          <span>Jistič {scenario ? (tripped ? '(vypnul)' : '(sepnutý)') : ''}</span>
        </div>
        <div
          className={`circuit-diagram__wire${tripped ? ' circuit-diagram__wire--broken' : ''}`}
          aria-hidden="true"
        />
        <div
          className={`circuit-diagram__part circuit-diagram__bulb${scenario && !tripped ? ' circuit-diagram__bulb--on' : ''}`}
        >
          <span className="circuit-diagram__icon" aria-hidden="true">
            💡
          </span>
          <span>Spotřebič</span>
        </div>
      </div>

      <div
        className="circuit-diagram__controls"
        role="group"
        aria-label="Výběr scénáře"
      >
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`btn btn--secondary${active === s.id ? ' btn--active' : ''}`}
            onClick={() => handleScenario(s.id)}
            aria-pressed={active === s.id}
          >
            {tried.has(s.id) ? '✔ ' : ''}
            {s.label}
          </button>
        ))}
      </div>

      {scenario && (
        <div
          className={`feedback feedback--${tripped ? 'error' : 'success'}`}
          role="status"
        >
          {tripped ? '⚠ Jistič vypnul. ' : '✔ Jistič zůstává sepnutý. '}
          {scenario.explanation}
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
