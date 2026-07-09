import { useState } from 'react';
import type { ResidualCurrentDemoConfig } from '../../types';

type ScenarioId = 'normal' | 'leak' | 'fault' | 'myth';

const SCENARIOS: {
  id: ScenarioId;
  label: string;
  trips: boolean;
  leak: boolean;
  explanation: string;
}[] = [
  {
    id: 'normal',
    label: 'Běžný provoz',
    trips: false,
    leak: false,
    explanation:
      'Proud, který teče ke spotřebiči, je stejně velký jako proud, který se vrací. Chránič je v klidu.',
  },
  {
    id: 'leak',
    label: 'Únik proudu',
    trips: true,
    leak: true,
    explanation:
      'Část proudu uniká mimo běžnou cestu — zpět se vrací méně, než odteklo. Chránič rozdíl pozná a rychle vypne.',
  },
  {
    id: 'fault',
    label: 'Porucha spotřebiče',
    trips: true,
    leak: true,
    explanation:
      'Poškozený spotřebič může pustit proud tam, kam nepatří — třeba na kovový kryt. Vzniká rozdíl proudů a chránič vypne.',
  },
  {
    id: 'myth',
    label: '„Chránič přece nahradí jistič“',
    trips: false,
    leak: false,
    explanation:
      'A právě v tom je ten omyl: při přetížení nebo zkratu teče proud správnou cestou, takže chránič žádný rozdíl nevidí a nevypne. Nadproud řeší jistič — proto bývají v rozvaděči oba.',
  },
];

interface ResidualCurrentDemoProps {
  demo: ResidualCurrentDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

export function ResidualCurrentDemoView({
  demo,
  calmMode,
  onContinue,
}: ResidualCurrentDemoProps) {
  const [active, setActive] = useState<ScenarioId | null>(null);
  const [tried, setTried] = useState<Set<ScenarioId>>(new Set());

  const scenario = SCENARIOS.find((s) => s.id === active) ?? null;
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
          Vyzkoušej všechny scénáře ({tried.size} / {SCENARIOS.length}).
        </p>
      )}

      <div
        className="rcd-diagram"
        role="img"
        aria-label={
          scenario
            ? `${scenario.label}: proud tam a zpět ${scenario.leak ? 'NENÍ stejný — část uniká a chránič vypíná' : 'je stejný — chránič je v klidu'}`
            : 'Školní schéma proudového chrániče: porovnává proud tam a proud zpět.'
        }
      >
        <div className="rcd-diagram__row">
          <span className="rcd-diagram__label">Proud tam →</span>
          <span className="rcd-diagram__value">
            {scenario ? '10 jednotek' : '—'}
          </span>
        </div>
        <div
          className={`rcd-diagram__device${scenario?.trips ? ' rcd-diagram__device--tripped' : ''}`}
        >
          <span aria-hidden="true">{scenario?.trips ? '⚡ VYPNUTO' : '🛡️'}</span>
          <span>Proudový chránič porovnává oba proudy</span>
        </div>
        <div className="rcd-diagram__row">
          <span className="rcd-diagram__label">← Proud zpět</span>
          <span className="rcd-diagram__value">
            {scenario ? (scenario.leak ? '9 jednotek' : '10 jednotek') : '—'}
          </span>
        </div>
        {scenario?.leak && (
          <p className="rcd-diagram__leak" role="status">
            ⚠ 1 jednotka proudu uniká jinudy — proudy se neshodují.
          </p>
        )}
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
          className={`feedback feedback--${scenario.trips ? 'error' : 'success'}`}
          role="status"
        >
          {scenario.trips ? '⚠ Chránič vypnul. ' : '✔ Chránič je v klidu. '}
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
