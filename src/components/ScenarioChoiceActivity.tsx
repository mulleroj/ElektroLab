import { useState } from 'react';
import type { ScenarioChoiceActivity as ScenarioChoiceActivityType } from '../types';

interface ScenarioChoiceActivityProps {
  activity: ScenarioChoiceActivityType;
  calmMode: boolean;
  onComplete: () => void;
}

export function ScenarioChoiceActivity({
  activity,
  calmMode,
  onComplete,
}: ScenarioChoiceActivityProps) {
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  const total = activity.scenarios.length;
  const completed = solved.size === total;

  const handleAnswer = (scenarioId: string, optionId: string) => {
    const scenario = activity.scenarios.find((s) => s.id === scenarioId);
    if (!scenario || solved.has(scenarioId)) return;

    if (optionId !== scenario.correctOptionId) {
      setFeedback((prev) => ({
        ...prev,
        [scenarioId]: `Špatně. ${scenario.explanation}`,
      }));
      return;
    }

    setSolved((prev) => new Set(prev).add(scenarioId));
    setFeedback((prev) => ({
      ...prev,
      [scenarioId]: `Správně. ${scenario.explanation}`,
    }));
  };

  const handleReset = () => {
    setSolved(new Set());
    setFeedback({});
  };

  return (
    <section className="scenario-choice" aria-labelledby="activity-title">
      <h2 id="activity-title">Interaktivní aktivita</h2>
      <p className="scenario-choice__instruction">{activity.instruction}</p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Vyřešeno {solved.size} z {total} situací
        </p>
      )}

      <ul className="scenario-choice__list">
        {activity.scenarios.map((scenario, index) => {
          const done = solved.has(scenario.id);
          const fb = feedback[scenario.id];
          return (
            <li key={scenario.id}>
              <article
                className={`judgment-card${done ? ' judgment-card--done' : ''}`}
              >
                <h3>Situace {index + 1}</h3>
                <p>{scenario.text}</p>
                <div
                  className="scenario-choice__buttons"
                  role="group"
                  aria-label={`Možnosti pro situaci ${index + 1}`}
                >
                  {(scenario.options ?? activity.options).map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className="btn btn--secondary"
                      onClick={() => handleAnswer(scenario.id, option.id)}
                      disabled={done}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {fb && (
                  <div
                    className={`feedback feedback--${done ? 'success' : 'error'}`}
                    role={done ? 'status' : 'alert'}
                  >
                    {done ? '✔ ' : '✖ '}
                    {fb}
                  </div>
                )}
              </article>
            </li>
          );
        })}
      </ul>

      {completed && (
        <div className="feedback feedback--success" role="status">
          ✔ {activity.successMessage}
        </div>
      )}

      <div className="scenario-choice__actions">
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
