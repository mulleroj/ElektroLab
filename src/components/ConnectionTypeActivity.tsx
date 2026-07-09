import { useState } from 'react';
import type { ConnectionTypeActivity as ConnectionTypeActivityType } from '../types';

interface ConnectionTypeActivityProps {
  activity: ConnectionTypeActivityType;
  calmMode: boolean;
  onComplete: () => void;
}

const TYPE_LABELS = {
  serial: 'Sériové zapojení',
  parallel: 'Paralelní zapojení',
} as const;

export function ConnectionTypeActivity({
  activity,
  calmMode,
  onComplete,
}: ConnectionTypeActivityProps) {
  const [answers, setAnswers] = useState<Record<string, 'serial' | 'parallel' | null>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  const total = activity.scenarios.length;
  const answeredCount = activity.scenarios.filter(
    (s) => answers[s.id] === s.correctType,
  ).length;
  const completed = answeredCount === total;

  const handleAnswer = (scenarioId: string, type: 'serial' | 'parallel') => {
    const scenario = activity.scenarios.find((s) => s.id === scenarioId);
    if (!scenario || answers[scenarioId] === scenario.correctType) return;

    if (type !== scenario.correctType) {
      setFeedback((prev) => ({
        ...prev,
        [scenarioId]: `Špatně. ${scenario.description} — toto je ${TYPE_LABELS[scenario.correctType].toLowerCase()}.`,
      }));
      setAnswers((prev) => ({ ...prev, [scenarioId]: null }));
      return;
    }

    setFeedback((prev) => {
      const next = { ...prev };
      delete next[scenarioId];
      return next;
    });
    setAnswers((prev) => ({ ...prev, [scenarioId]: type }));
  };

  const handleReset = () => {
    setAnswers({});
    setFeedback({});
  };

  return (
    <section className="connection-activity" aria-labelledby="connection-title">
      <h2 id="connection-title">Interaktivní aktivita</h2>
      <p className="connection-activity__instruction">{activity.instruction}</p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Správně {answeredCount} z {total} scénářů
        </p>
      )}

      <ul className="connection-activity__scenarios">
        {activity.scenarios.map((scenario, index) => {
          const isCorrect = answers[scenario.id] === scenario.correctType;
          return (
            <li key={scenario.id}>
              <article className={`connection-card${isCorrect ? ' connection-card--done' : ''}`}>
                <h3>
                  Scénář {index + 1}
                  {isCorrect && (
                    <span className="connection-card__done" aria-label="Správně">
                      {' '}
                      ✔
                    </span>
                  )}
                </h3>
                <p>{scenario.description}</p>
                <div
                  className="connection-card__buttons"
                  role="group"
                  aria-label={`Typ zapojení pro scénář ${index + 1}`}
                >
                  <button
                    type="button"
                    className={`btn btn--secondary${answers[scenario.id] === 'serial' ? ' btn--active' : ''}`}
                    onClick={() => handleAnswer(scenario.id, 'serial')}
                    disabled={isCorrect}
                    aria-pressed={answers[scenario.id] === 'serial'}
                  >
                    Sériové
                  </button>
                  <button
                    type="button"
                    className={`btn btn--secondary${answers[scenario.id] === 'parallel' ? ' btn--active' : ''}`}
                    onClick={() => handleAnswer(scenario.id, 'parallel')}
                    disabled={isCorrect}
                    aria-pressed={answers[scenario.id] === 'parallel'}
                  >
                    Paralelní
                  </button>
                </div>
                {feedback[scenario.id] && (
                  <div className="feedback feedback--error" role="alert">
                    ✖ {feedback[scenario.id]}
                  </div>
                )}
              </article>
            </li>
          );
        })}
      </ul>

      {completed && (
        <div className="feedback feedback--success" role="status">
          ✔ Výborně! Rozlišil jsi sériové a paralelní zapojení ve všech scénářích.
        </div>
      )}

      <div className="connection-activity__actions">
        <button type="button" className="btn btn--secondary" onClick={handleReset}>
          Zkusit znovu
        </button>
        {completed && (
          <button type="button" className="btn btn--primary" onClick={onComplete}>
            Pokračovat na mini test
          </button>
        )}
      </div>
    </section>
  );
}
