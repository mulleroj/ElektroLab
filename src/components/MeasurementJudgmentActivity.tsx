import { useState } from 'react';
import type { MeasurementJudgmentActivity as MeasurementJudgmentActivityType } from '../types';

interface MeasurementJudgmentActivityProps {
  activity: MeasurementJudgmentActivityType;
  calmMode: boolean;
  onComplete: () => void;
}

export function MeasurementJudgmentActivity({
  activity,
  calmMode,
  onComplete,
}: MeasurementJudgmentActivityProps) {
  const [answers, setAnswers] = useState<Record<string, 'correct' | 'wrong' | null>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  const total = activity.scenarios.length;
  const solved = activity.scenarios.filter(
    (s) => answers[s.id] === s.correct,
  ).length;
  const completed = solved === total;

  const handleAnswer = (scenarioId: string, choice: 'correct' | 'wrong') => {
    const scenario = activity.scenarios.find((s) => s.id === scenarioId);
    if (!scenario || answers[scenarioId] === scenario.correct) return;

    if (choice !== scenario.correct) {
      setFeedback((prev) => ({
        ...prev,
        [scenarioId]: `Špatně. ${scenario.explanation}`,
      }));
      setAnswers((prev) => ({ ...prev, [scenarioId]: null }));
      return;
    }

    setFeedback((prev) => {
      const next = { ...prev };
      delete next[scenarioId];
      return next;
    });
    setAnswers((prev) => ({ ...prev, [scenarioId]: scenario.correct }));
  };

  const handleReset = () => {
    setAnswers({});
    setFeedback({});
  };

  return (
    <section className="judgment-activity" aria-labelledby="judgment-title">
      <h2 id="judgment-title">Interaktivní aktivita</h2>
      <p className="judgment-activity__instruction">{activity.instruction}</p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Správně {solved} z {total} situací
        </p>
      )}

      <ul className="judgment-activity__list">
        {activity.scenarios.map((scenario, index) => {
          const done = answers[scenario.id] === scenario.correct;
          return (
            <li key={scenario.id}>
              <article className={`judgment-card${done ? ' judgment-card--done' : ''}`}>
                <h3>Situace {index + 1}</h3>
                <p>{scenario.text}</p>
                <div className="judgment-card__buttons" role="group">
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => handleAnswer(scenario.id, 'correct')}
                    disabled={done}
                  >
                    {activity.correctLabel ?? 'Zapojení je v pořádku'}
                  </button>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => handleAnswer(scenario.id, 'wrong')}
                    disabled={done}
                  >
                    {activity.wrongLabel ?? 'Zapojení je chybné'}
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
          ✔{' '}
          {activity.successMessage ??
            'Výborně! Rozpoznal jsi správné i chybné zapojení měřicích přístrojů.'}
        </div>
      )}

      <div className="judgment-activity__actions">
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
