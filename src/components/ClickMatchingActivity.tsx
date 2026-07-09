import { useState } from 'react';

interface ClickMatchingActivityProps {
  instruction: string;
  leftItems: { id: string; label: string; className?: string; ariaLabel?: string }[];
  rightItems: { id: string; label: string }[];
  correctPairs: Record<string, string>;
  calmMode: boolean;
  leftTitle: string;
  rightTitle: string;
  onComplete: () => void;
}

export function ClickMatchingActivity({
  instruction,
  leftItems,
  rightItems,
  calmMode,
  leftTitle,
  rightTitle,
  correctPairs,
  onComplete,
}: ClickMatchingActivityProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'error' | 'success'>('error');

  const totalPairs = Object.keys(correctPairs).length;
  const matchedCount = Object.keys(matched).length;
  const completed = matchedCount === totalPairs;

  const handleLeftClick = (id: string) => {
    if (matched[id]) return;
    setSelectedLeft(id);
    setFeedback(null);
  };

  const handleRightClick = (rightId: string) => {
    if (!selectedLeft || Object.values(matched).includes(rightId)) return;

    const expectedRight = correctPairs[selectedLeft];
    const leftLabel = leftItems.find((i) => i.id === selectedLeft)?.label;
    const rightLabel = rightItems.find((i) => i.id === rightId)?.label;

    if (rightId !== expectedRight) {
      setFeedbackType('error');
      setFeedback(
        `„${leftLabel}" nepatří k „${rightLabel}". Zkus to znovu.`,
      );
      setSelectedLeft(null);
      return;
    }

    const newMatched = { ...matched, [selectedLeft]: rightId };
    setMatched(newMatched);
    setSelectedLeft(null);
    setFeedback(null);

    if (Object.keys(newMatched).length === totalPairs) {
      setFeedbackType('success');
      setFeedback('Výborně! Všechny páry jsou správně.');
    }
  };

  const handleReset = () => {
    setSelectedLeft(null);
    setMatched({});
    setFeedback(null);
  };

  const isRightUsed = (rightId: string) => Object.values(matched).includes(rightId);

  return (
    <section className="matching-activity" aria-labelledby="matching-title">
      <h2 id="matching-title">Interaktivní aktivita</h2>
      <p className="matching-activity__instruction">{instruction}</p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Spárováno {matchedCount} z {totalPairs}
        </p>
      )}

      <div className="matching-activity__columns">
        <div>
          <h3 className="matching-activity__col-title">{leftTitle}</h3>
          <div className="matching-activity__items" role="group" aria-label={leftTitle}>
            {leftItems.map((item) => {
              const isMatched = Boolean(matched[item.id]);
              const isSelected = selectedLeft === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`match-item${item.className ? ` ${item.className}` : ''}${isMatched ? ' match-item--matched' : ''}${isSelected ? ' match-item--selected' : ''}`}
                  onClick={() => handleLeftClick(item.id)}
                  disabled={isMatched}
                  aria-pressed={isSelected}
                  aria-label={item.ariaLabel ?? item.label}
                >
                  {isMatched && <span aria-hidden="true">✔ </span>}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <h3 className="matching-activity__col-title">{rightTitle}</h3>
          <div className="matching-activity__items" role="group" aria-label={rightTitle}>
            {rightItems.map((item) => {
              const isUsed = isRightUsed(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`match-item${isUsed ? ' match-item--matched' : ''}${!selectedLeft ? ' match-item--idle' : ''}`}
                  onClick={() => handleRightClick(item.id)}
                  disabled={isUsed || !selectedLeft}
                >
                  {isUsed && <span aria-hidden="true">✔ </span>}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedLeft && (
        <p className="matching-activity__hint" role="status">
          Vybráno: {leftItems.find((i) => i.id === selectedLeft)?.label}. Teď klikni na
          odpovídající položku vpravo.
        </p>
      )}

      {feedback && (
        <div
          className={`feedback feedback--${feedbackType}`}
          role={feedbackType === 'error' ? 'alert' : 'status'}
        >
          {feedbackType === 'success' ? '✔ ' : '✖ '}
          {feedback}
        </div>
      )}

      <div className="matching-activity__actions">
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
