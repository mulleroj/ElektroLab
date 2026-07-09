import { useState } from 'react';
import type { MeasurementScenariosDemo } from '../../types';

const SCENARIOS = [
  {
    id: 'v-par',
    text: 'Voltmetr je připojen paralelně ke spotřebiči.',
    correct: true,
    explanation: 'Voltmetr měří napětí — paralelní zapojení je správné.',
  },
  {
    id: 'a-par',
    text: 'Ampérmetr je zapojen paralelně ke zdroji.',
    correct: false,
    explanation: 'Paralelní ampérmetr je chyba — hrozí zkrat a poškození přístroje.',
  },
  {
    id: 'a-ser',
    text: 'Ampérmetr je zapojen sériově v obvodu.',
    correct: true,
    explanation: 'Ampérmetr patří do série — měří proud v obvodu.',
  },
];

interface MeasurementScenariosDemoProps {
  demo: MeasurementScenariosDemo;
  calmMode: boolean;
  onContinue: () => void;
}

export function MeasurementScenariosDemoView({
  demo,
  calmMode,
  onContinue,
}: MeasurementScenariosDemoProps) {
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  const correctCount = SCENARIOS.filter((s) => results[s.id] === s.correct).length;
  const allAnswered = SCENARIOS.every((s) => s.id in results);
  const allCorrect = correctCount === SCENARIOS.length;

  const handleAnswer = (id: string, answer: 'correct' | 'wrong') => {
    const scenario = SCENARIOS.find((s) => s.id === id);
    if (!scenario) return;
    const isRight = (answer === 'correct') === scenario.correct;
    setResults((prev) => ({ ...prev, [id]: scenario.correct }));
    setFeedback(isRight ? scenario.explanation : `Špatně. ${scenario.explanation}`);
  };

  return (
    <section className="interactive-demo" aria-labelledby="demo-title">
      <h2 id="demo-title">Interaktivní ukázka</h2>
      <h3>{demo.title}</h3>
      <p>{demo.description}</p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Posuď každou situaci ({Object.keys(results).length} / {SCENARIOS.length})
        </p>
      )}

      <ul className="measurement-scenarios">
        {SCENARIOS.map((scenario) => (
          <li key={scenario.id}>
            <article className="measurement-scenario-card">
              <p>{scenario.text}</p>
              <div className="measurement-scenario-card__buttons" role="group">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => handleAnswer(scenario.id, 'correct')}
                  disabled={scenario.id in results}
                >
                  Správně
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => handleAnswer(scenario.id, 'wrong')}
                  disabled={scenario.id in results}
                >
                  Chybně
                </button>
              </div>
              {scenario.id in results && (
                <span
                  className={
                    results[scenario.id] === scenario.correct
                      ? 'measurement-scenario-card__ok'
                      : 'measurement-scenario-card__bad'
                  }
                  role="status"
                >
                  {results[scenario.id] === scenario.correct ? '✔ Posouzeno správně' : '✖ Zkus znovu příště'}
                </span>
              )}
            </article>
          </li>
        ))}
      </ul>

      {feedback && allAnswered && (
        <div
          className={`feedback feedback--${allCorrect ? 'success' : 'error'}`}
          role="status"
        >
          {allCorrect ? '✔ ' : '✖ '}
          {feedback}
        </div>
      )}

      <button
        type="button"
        className="btn btn--primary"
        onClick={onContinue}
        disabled={!allAnswered}
      >
        Rozumím, pokračovat na úkol
      </button>
    </section>
  );
}
