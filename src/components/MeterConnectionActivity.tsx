import { useState } from 'react';
import type { MeterConnectionActivity as MeterConnectionActivityType } from '../types';

interface MeterConnectionActivityProps {
  activity: MeterConnectionActivityType;
  calmMode: boolean;
  onComplete: () => void;
}

export function MeterConnectionActivity({
  activity,
  calmMode,
  onComplete,
}: MeterConnectionActivityProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const isCorrect = selected === activity.correctOptionId;

  return (
    <section className="meter-activity" aria-labelledby="meter-activity-title">
      <h2 id="meter-activity-title">Interaktivní aktivita</h2>
      <p className="meter-activity__instruction">{activity.instruction}</p>
      <p className="meter-activity__meter-label">
        Měřicí přístroj: <strong>{activity.meterLabel}</strong>
      </p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Vyber jednu možnost zapojení.
        </p>
      )}

      <fieldset className="meter-activity__options">
        <legend>Jak zapojíš {activity.meterLabel}?</legend>
        {activity.options.map((option) => {
          let cls = 'quiz-option';
          if (answered) {
            if (option.id === activity.correctOptionId) cls += ' quiz-option--correct';
            else if (option.id === selected) cls += ' quiz-option--wrong';
          } else if (selected === option.id) {
            cls += ' quiz-option--selected';
          }
          return (
            <label key={option.id} className={cls}>
              <input
                type="radio"
                name="meter-connection"
                value={option.id}
                checked={selected === option.id}
                onChange={() => setSelected(option.id)}
                disabled={answered}
              />
              <span>{option.text}</span>
            </label>
          );
        })}
      </fieldset>

      {answered && (
        <div
          className={`feedback feedback--${isCorrect ? 'success' : 'error'}`}
          role="status"
        >
          {isCorrect ? '✔ Správně! ' : '✖ Špatně. '}
          {activity.successExplanation}
        </div>
      )}

      <div className="meter-activity__actions">
        {!answered ? (
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => selected && setAnswered(true)}
            disabled={!selected}
          >
            Ověřit odpověď
          </button>
        ) : (
          <>
            {!isCorrect && (
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => {
                  setSelected(null);
                  setAnswered(false);
                }}
              >
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
