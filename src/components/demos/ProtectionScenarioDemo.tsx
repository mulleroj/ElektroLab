import { useState } from 'react';
import type { ProtectionScenarioDemoConfig } from '../../types';

const CARDS: {
  id: string;
  situation: string;
  answer: string;
  explanation: string;
}[] = [
  {
    id: 'many',
    situation: 'Na jednom obvodu běží rychlovarná konvice, přímotop i trouba.',
    answer: 'Jistič',
    explanation:
      'Velký proud správnou cestou = přetížení vedení. To je práce jističe.',
  },
  {
    id: 'leak',
    situation: 'Ze staré pračky „brní“ kovový kryt — část proudu uniká mimo obvod.',
    answer: 'Proudový chránič',
    explanation:
      'Unikající proud je malý — jistič ho nepozná. Rozdíl proudů ale pozná chránič a vypne.',
  },
  {
    id: 'repeat',
    situation: 'Jistič vypadává znovu a znovu, i po opětovném zapnutí.',
    answer: 'Učitel / odborník — nepokračovat',
    explanation:
      'Opakované vypadávání znamená závadu. Nezkouší se to „počtvrté“ — závadu musí najít odborník.',
  },
];

interface ProtectionScenarioDemoProps {
  demo: ProtectionScenarioDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

export function ProtectionScenarioDemoView({
  demo,
  calmMode,
  onContinue,
}: ProtectionScenarioDemoProps) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const allRevealed = revealed.size === CARDS.length;

  const handleReveal = (id: string) => {
    setRevealed((prev) => new Set(prev).add(id));
  };

  return (
    <section className="interactive-demo" aria-labelledby="demo-title">
      <h2 id="demo-title">Interaktivní ukázka</h2>
      <h3>{demo.title}</h3>
      <p>{demo.description}</p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Odkryj všechny karty ({revealed.size} / {CARDS.length}).
        </p>
      )}

      <ul className="scenario-cards">
        {CARDS.map((card) => {
          const isRevealed = revealed.has(card.id);
          return (
            <li key={card.id}>
              <article className="scenario-card">
                <p className="scenario-card__situation">{card.situation}</p>
                {isRevealed ? (
                  <div className="scenario-card__answer" role="status">
                    <strong>{card.answer}</strong>
                    <p>{card.explanation}</p>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => handleReveal(card.id)}
                  >
                    Ukázat, co pomůže
                  </button>
                )}
              </article>
            </li>
          );
        })}
      </ul>

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
