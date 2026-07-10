import { useState } from 'react';
import type { VoltageLevelSafetyDemoConfig } from '../../types';

type LevelId = 'nn' | 'vn' | 'vvn' | 'danger';

const LEVELS: {
  id: LevelId;
  label: string;
  examples: string;
  risk: string;
  behavior: string;
}[] = [
  {
    id: 'nn',
    label: 'Nízké napětí (NN)',
    examples: 'domovní rozvody, zásuvky 230 V, běžné spotřebiče, školní dílna',
    risk: 'I NN může vážně zranit nebo zabít — „nízké“ neznamená bezpečné.',
    behavior:
      'Pracuje se jen ve škole pod dohledem učitele a podle bezpečnostních pravidel. Do rozvaděčů a zařízení se nezasahuje.',
  },
  {
    id: 'vn',
    label: 'Vysoké napětí (VN)',
    examples: 'trafostanice, venkovní vedení, průmyslové rozvodny',
    risk: 'Životu nebezpečné — přeskok (oblouk) může nastat i BEZ dotyku, na vzdálenost.',
    behavior:
      'Držet bezpečný odstup, nikdy nepřelézat ploty ani nevstupovat do označených prostor. Smí tam jen odborník s oprávněním.',
  },
  {
    id: 'vvn',
    label: 'Velmi vysoké napětí (VVN)',
    examples: 'dálková přenosová vedení, velké rozvodny (110 kV a víc)',
    risk: 'Extrémní riziko — nebezpečná je už samotná blízkost vodičů.',
    behavior:
      'Velký odstup vždy a všude. Nikdy nelézt na stožáry, nepouštět draky ani nelétat s dronem u vedení.',
  },
  {
    id: 'danger',
    label: 'Nebezpečná situace',
    examples: 'otevřený kryt, spadlý vodič, poškozený plot trafostanice, bzučící zařízení',
    risk: 'Neznámý stav = největší riziko. Nikdy nezkoumat zblízka.',
    behavior:
      'Nepokračovat, držet odstup, nikoho nepouštět blíž a ihned zavolat učitele nebo odborníka (u spadlého vodiče tísňovou linku).',
  },
];

interface VoltageLevelSafetyDemoProps {
  demo: VoltageLevelSafetyDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

export function VoltageLevelSafetyDemoView({
  demo,
  calmMode,
  onContinue,
}: VoltageLevelSafetyDemoProps) {
  const [active, setActive] = useState<LevelId | null>(null);
  const [tried, setTried] = useState<Set<LevelId>>(new Set());

  const level = LEVELS.find((l) => l.id === active) ?? null;
  const allTried = tried.size === LEVELS.length;

  const handleLevel = (id: LevelId) => {
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
          Projdi všechny čtyři karty ({tried.size} / {LEVELS.length}).
        </p>
      )}

      <div
        className="circuit-diagram__controls"
        role="group"
        aria-label="Výběr napěťové hladiny"
      >
        {LEVELS.map((l) => (
          <button
            key={l.id}
            type="button"
            className={`btn btn--secondary${active === l.id ? ' btn--active' : ''}`}
            onClick={() => handleLevel(l.id)}
            aria-pressed={active === l.id}
          >
            {tried.has(l.id) ? '✔ ' : ''}
            {l.label}
          </button>
        ))}
      </div>

      {level && (
        <article className="voltage-card" aria-label={`Karta: ${level.label}`}>
          <h4>{level.label}</h4>
          <dl className="voltage-card__rows">
            <div>
              <dt>Typické příklady</dt>
              <dd>{level.examples}</dd>
            </div>
            <div>
              <dt>Míra rizika</dt>
              <dd>{level.risk}</dd>
            </div>
            <div className="voltage-card__behavior">
              <dt>Správné chování</dt>
              <dd>{level.behavior}</dd>
            </div>
          </dl>
        </article>
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
