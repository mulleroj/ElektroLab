import { useState } from 'react';
import type { SymbolsDemoConfig } from '../../types';

const SYMBOLS = [
  { symbol: '┤├', name: 'Zdroj', id: 'zdroj' },
  { symbol: '─○─', name: 'Vypínač', id: 'vypinac' },
  { symbol: '╱╲', name: 'Rezistor', id: 'rezistor' },
  { symbol: 'ⓧ', name: 'Žárovka', id: 'zarovka' },
  { symbol: '───', name: 'Vodič', id: 'vodic' },
];

interface SymbolsDemoProps {
  demo: SymbolsDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

export function SymbolsDemoView({ demo, calmMode, onContinue }: SymbolsDemoProps) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allRevealed = revealed.size === SYMBOLS.length;

  return (
    <section className="interactive-demo" aria-labelledby="demo-title">
      <h2 id="demo-title">Interaktivní ukázka</h2>
      <h3>{demo.title}</h3>
      <p>{demo.description}</p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Klikni na každou značku a zobraz její název ({revealed.size} / {SYMBOLS.length})
        </p>
      )}

      <div className="symbols-demo-grid" role="list">
        {SYMBOLS.map((item) => {
          const isRevealed = revealed.has(item.id);
          return (
            <button
              key={item.id}
              type="button"
              className={`symbols-demo-card${isRevealed ? ' symbols-demo-card--revealed' : ''}`}
              onClick={() => toggle(item.id)}
              aria-pressed={isRevealed}
              aria-label={`Značka ${item.name}`}
              role="listitem"
            >
              <span className="symbols-demo-card__symbol" aria-hidden="true">
                {item.symbol}
              </span>
              <span className="symbols-demo-card__name">
                {isRevealed ? item.name : 'Klikni pro název'}
              </span>
            </button>
          );
        })}
      </div>

      {allRevealed && (
        <div className="feedback feedback--success" role="status">
          ✔ Výborně! Všechny základní značky znáš — každá má svůj symbol ve schématu.
        </div>
      )}

      <button
        type="button"
        className="btn btn--primary"
        onClick={onContinue}
        disabled={!allRevealed}
      >
        Rozumím, pokračovat na úkol
      </button>
    </section>
  );
}
