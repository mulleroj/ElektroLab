import { useState } from 'react';
import type { QuizQuestion } from '../types';

interface QuizProps {
  questions: QuizQuestion[];
  calmMode: boolean;
  onComplete: (correct: number, total: number) => void;
}

export function Quiz({ questions, calmMode, onComplete }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[currentIndex];
  const isCorrect = selectedOption === question.correctOptionId;

  const handleSubmit = () => {
    if (!selectedOption) return;
    setAnswered(true);
    if (selectedOption === question.correctOptionId) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      setFinished(true);
      onComplete(correctCount, questions.length);
    }
  };

  if (finished) {
    return (
      <section className="quiz quiz--complete" aria-labelledby="quiz-complete-title">
        <h2 id="quiz-complete-title">Mini test dokončen</h2>
        <p className="quiz__result">
          Správně {correctCount} z {questions.length} otázek.
        </p>
        <p>Výborná práce! Získáváš XP a odznak za dokončení lekce.</p>
      </section>
    );
  }

  return (
    <section
      className={`quiz${calmMode ? ' quiz--calm' : ''}`}
      aria-labelledby="quiz-title"
    >
      <h2 id="quiz-title">Mini test</h2>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Otázka {currentIndex + 1} z {questions.length}
        </p>
      )}

      <fieldset className="quiz__question">
        <legend>
          <span className="quiz__number">
            Otázka {currentIndex + 1}/{questions.length}:
          </span>{' '}
          {question.text}
        </legend>
        <div className="quiz__options">
          {question.options.map((option) => {
            let optionClass = 'quiz-option';
            if (answered) {
              if (option.id === question.correctOptionId) {
                optionClass += ' quiz-option--correct';
              } else if (option.id === selectedOption) {
                optionClass += ' quiz-option--wrong';
              }
            } else if (selectedOption === option.id) {
              optionClass += ' quiz-option--selected';
            }

            return (
              <label key={option.id} className={optionClass}>
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={() => setSelectedOption(option.id)}
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
          {question.explanation}
        </div>
      )}

      <div className="quiz__actions">
        {!answered ? (
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={!selectedOption}
          >
            Ověřit odpověď
          </button>
        ) : (
          <button type="button" className="btn btn--primary" onClick={handleNext}>
            {currentIndex < questions.length - 1 ? 'Další otázka' : 'Dokončit test'}
          </button>
        )}
      </div>
    </section>
  );
}
