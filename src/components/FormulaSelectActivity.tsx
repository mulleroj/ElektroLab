import { useState } from 'react';
import type { FormulaSelectActivity as FormulaSelectActivityType } from '../types';

interface FormulaSelectActivityProps {
  activity: FormulaSelectActivityType;
  calmMode: boolean;
  onComplete: () => void;
}

export function FormulaSelectActivity({
  activity,
  calmMode,
  onComplete,
}: FormulaSelectActivityProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const isCorrect = selected === activity.correctOptionId;

  const handleSubmit = () => {
    if (!selected) return;
    setAnswered(true);
  };

  const handleReset = () => {
    setSelected(null);
    setAnswered(false);
  };

  return (
    <section className="formula-activity" aria-labelledby="formula-title">
      <h2 id="formula-title">Interaktivní aktivita</h2>
      <p className="formula-activity__instruction">{activity.instruction}</p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Krok 1 z 1 — vyber správný vztah
        </p>
      )}

      <div className="formula-activity__example">
        <h3>Příklad</h3>
        <p>{activity.example}</p>
      </div>

      <fieldset className="formula-activity__question">
        <legend>{activity.question}</legend>
        <div className="formula-activity__options">
          {activity.options.map((option) => {
            let cls = 'formula-option';
            if (answered) {
              if (option.id === activity.correctOptionId) cls += ' formula-option--correct';
              else if (option.id === selected) cls += ' formula-option--wrong';
            } else if (selected === option.id) {
              cls += ' formula-option--selected';
            }
            return (
              <label key={option.id} className={cls}>
                <input
                  type="radio"
                  name="formula"
                  value={option.id}
                  checked={selected === option.id}
                  onChange={() => setSelected(option.id)}
                  disabled={answered}
                />
                <span>{option.text}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {answered && (
        <div
          className={`feedback feedback--${isCorrect ? 'success' : 'error'}`}
          role="status"
        >
          {isCorrect ? '✔ Správně! ' : '✖ Špatně. '}
          {isCorrect
            ? activity.successExplanation
            : 'Správný vztah je U = R · I. Napětí se rovná součinu odporu a proudu.'}
        </div>
      )}

      <div className="formula-activity__actions">
        {!answered ? (
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={!selected}
          >
            Ověřit odpověď
          </button>
        ) : (
          <>
            {!isCorrect && (
              <button type="button" className="btn btn--secondary" onClick={handleReset}>
                Zkusit znovu
              </button>
            )}
            {isCorrect && (
              <button type="button" className="btn btn--primary" onClick={onComplete}>
                Pokračovat na mini test
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
