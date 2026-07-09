import { useState } from 'react';
import type { CircuitOrderActivity as CircuitOrderActivityType } from '../types';

interface CircuitOrderActivityProps {
  activity: CircuitOrderActivityType;
  calmMode: boolean;
  onComplete: () => void;
}

export function CircuitOrderActivity({
  activity,
  calmMode,
  onComplete,
}: CircuitOrderActivityProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{
    type: 'error' | 'success';
    message: string;
  } | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleElementClick = (elementId: string) => {
    if (completed) return;

    const expected = activity.correctOrder[selected.length];
    if (elementId !== expected) {
      const element = activity.elements.find((e) => e.id === elementId);
      const expectedElement = activity.elements.find((e) => e.id === expected);
      setFeedback({
        type: 'error',
        message: `"${element?.label}" není správný další krok. Po "${selected.length > 0 ? activity.elements.find((e) => e.id === selected[selected.length - 1])?.label : 'začátku'}" očekáváme "${expectedElement?.label}". Zkus to znovu od začátku.`,
      });
      setSelected([]);
      return;
    }

    const newSelected = [...selected, elementId];
    setSelected(newSelected);
    setFeedback(null);

    if (newSelected.length === activity.correctOrder.length) {
      setCompleted(true);
      setFeedback({
        type: 'success',
        message: 'Výborně! Sestavil jsi správný uzavřený obvod. Proud může téct od zdroje přes vypínač a spotřebič zpět.',
      });
    }
  };

  const handleReset = () => {
    setSelected([]);
    setFeedback(null);
    setCompleted(false);
  };

  const selectedSet = new Set(selected);

  return (
    <section
      className={`circuit-activity${calmMode ? ' circuit-activity--calm' : ''}`}
      aria-labelledby="activity-title"
    >
      <h2 id="activity-title">Interaktivní aktivita</h2>
      <p className="circuit-activity__instruction">{activity.instruction}</p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Krok {Math.min(selected.length + 1, activity.correctOrder.length)} z{' '}
          {activity.correctOrder.length}
        </p>
      )}

      <div className="circuit-activity__selected" aria-live="polite">
        <span className="circuit-activity__selected-label">Tvoje pořadí:</span>
        {selected.length === 0 ? (
          <span className="circuit-activity__selected-empty">Zatím nic</span>
        ) : (
          <ol className="circuit-activity__sequence">
            {selected.map((id) => {
              const el = activity.elements.find((e) => e.id === id);
              return <li key={id}>{el?.label}</li>;
            })}
          </ol>
        )}
      </div>

      <div
        className="circuit-activity__elements"
        role="group"
        aria-label="Prvky obvodu"
      >
        {activity.elements.map((element) => {
          const isSelected = selectedSet.has(element.id);
          const isNext =
            !completed &&
            activity.correctOrder[selected.length] === element.id;

          return (
            <button
              key={element.id}
              type="button"
              className={`circuit-element${isSelected ? ' circuit-element--selected' : ''}${isNext && calmMode ? ' circuit-element--next' : ''}`}
              onClick={() => handleElementClick(element.id)}
              disabled={completed || isSelected}
              aria-pressed={isSelected}
            >
              {element.label}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div
          className={`feedback feedback--${feedback.type}`}
          role={feedback.type === 'error' ? 'alert' : 'status'}
        >
          {feedback.type === 'success' ? '✔ ' : '✖ '}
          {feedback.message}
        </div>
      )}

      <div className="circuit-activity__actions">
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
