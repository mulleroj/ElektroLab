import { useState } from 'react';
import type { MicroLesson, ProgressState, LessonStep, QuizScore } from '../types';
import { getNextStepAfterIntro } from '../types';
import { SafetyNote } from './SafetyNote';
import { InteractiveDemoRenderer } from './InteractiveDemoRenderer';
import { ActivityRenderer } from './ActivityRenderer';
import { Quiz } from './Quiz';
import { getLessonProgress } from '../lib/progress';
import type { QuizCompletionResult } from '../lib/progress';
import { isValidQuizScore } from '../lib/quizScore';
import { getBadgeById } from '../data/badges';
import { getSubjectById } from '../data/subjects';
import { getTopicById } from '../data/topics';

interface LessonPageProps {
  lesson: MicroLesson;
  progress: ProgressState;
  calmMode: boolean;
  projectorMode: boolean;
  onActivityComplete: () => void;
  onQuizComplete: (correct: number, total: number) => QuizCompletionResult;
}

const stepLabels: Record<LessonStep, string> = {
  intro: 'Úvod',
  demo: 'Ukázka',
  activity: 'Úkol',
  quiz: 'Mini test',
  complete: 'Hotovo',
};

function getInitialStep(lessonProgress: ReturnType<typeof getLessonProgress>): LessonStep {
  if (lessonProgress.activityCompleted) {
    return lessonProgress.quizCompleted ? 'intro' : 'quiz';
  }
  return 'intro';
}

export function LessonPage({
  lesson,
  progress,
  calmMode,
  projectorMode,
  onActivityComplete,
  onQuizComplete,
}: LessonPageProps) {
  const lessonProgress = getLessonProgress(progress, lesson.id);
  const subject = getSubjectById(lesson.subjectId);
  const topic = getTopicById(lesson.topicId);

  const [step, setStep] = useState<LessonStep>(() => getInitialStep(lessonProgress));
  // Výsledek právě dokončeného mini testu — jen lokální stav komponenty,
  // takže se zobrazí i v projektorovém režimu, kde se nic neukládá.
  const [quizResult, setQuizResult] = useState<QuizScore | null>(null);
  // Co bylo právě teď skutečně uděleno — dodává produkční logika pokroku,
  // ne domněnka „uživatel právě dokončil quiz, tedy dostal odměny".
  const [quizOutcome, setQuizOutcome] = useState<QuizCompletionResult | null>(null);

  const handleActivityComplete = () => {
    onActivityComplete();
    setStep('quiz');
  };

  const handleQuizComplete = (correct: number, total: number) => {
    setQuizResult({ correct, total });
    setQuizOutcome(onQuizComplete(correct, total));
    setStep('complete');
  };

  const badge = lesson.badgeId ? getBadgeById(lesson.badgeId) : undefined;

  const hasDemo = Boolean(lesson.interactiveDemo);
  const stepOrder: LessonStep[] = hasDemo
    ? ['intro', 'demo', 'activity', 'quiz', 'complete']
    : ['intro', 'activity', 'quiz', 'complete'];

  const stepIndex = stepOrder.indexOf(step);

  return (
    <section className="lesson-page">
      <nav className="breadcrumb" aria-label="Navigace">
        <a href={`#/topic/${lesson.subjectId}/${lesson.topicId}`}>
          ← Zpět na {topic?.title ?? 'téma'}
        </a>
      </nav>

      <header className="page-header">
        <div className="lesson-page__tags">
          <span className="tag">{lesson.year}. ročník</span>
          <span className="tag">{lesson.difficulty}</span>
          <span className="tag">{lesson.durationMinutes} min</span>
        </div>
        <h1>{lesson.title}</h1>
        <p className="lesson-page__context">
          {subject?.title} · {topic?.title}
        </p>
      </header>

      <SafetyNote text={lesson.safetyNote} />

      <nav className="lesson-steps" aria-label="Kroky lekce">
        <ol>
          {stepOrder.map((s, i) => {
            let cls = '';
            let stateText = '';
            if (step === s) {
              cls = 'lesson-steps__active';
              stateText = ' (právě zde)';
            } else if (stepIndex > i) {
              cls = 'lesson-steps__done';
              stateText = ' (hotovo)';
            }
            return (
              <li key={s} className={cls} aria-current={step === s ? 'step' : undefined}>
                <span className="lesson-steps__number" aria-hidden="true">
                  {i + 1}
                </span>{' '}
                {stepLabels[s]}
                <span className="visually-hidden">{stateText}</span>
                {stepIndex > i && (
                  <span className="lesson-steps__check" aria-hidden="true">
                    {' '}✔
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {step === 'intro' && (
        <article className="lesson-intro">
          <div className="lesson-intro__section">
            <h2>Cíl lekce</h2>
            <p>{lesson.goal}</p>
          </div>
          <div className="lesson-intro__section lesson-intro__hook">
            <h2>Háček z praxe</h2>
            <p>{lesson.hook}</p>
          </div>
          <div className="lesson-intro__section">
            <h2>Vysvětlení</h2>
            <p>{lesson.explanation}</p>
          </div>
          {lesson.typicalMistake && (
            <div className="lesson-intro__section lesson-intro__mistake">
              <h2>Typická chyba</h2>
              <p>{lesson.typicalMistake}</p>
            </div>
          )}
          <blockquote className="memory-sentence">
            <p>„{lesson.memorySentence}"</p>
          </blockquote>
          {projectorMode ? (
            <div className="lesson-intro__projector-actions">
              {hasDemo && (
                <button
                  type="button"
                  className="btn btn--primary btn--large"
                  onClick={() => setStep('demo')}
                >
                  Spustit ukázku
                </button>
              )}
              <button
                type="button"
                className={`btn btn--large ${hasDemo ? 'btn--secondary' : 'btn--primary'}`}
                onClick={() => setStep('activity')}
              >
                Přejít na úkol
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn--primary btn--large"
              onClick={() => setStep(getNextStepAfterIntro(lesson))}
            >
              {hasDemo ? 'Pokračovat na ukázku' : 'Pokračovat na úkol'}
            </button>
          )}
        </article>
      )}

      {step === 'demo' && lesson.interactiveDemo && (
        <InteractiveDemoRenderer
          demo={lesson.interactiveDemo}
          calmMode={calmMode}
          onContinue={() => setStep('activity')}
        />
      )}

      {step === 'activity' && (
        <ActivityRenderer
          activity={lesson.activity}
          calmMode={calmMode}
          onComplete={handleActivityComplete}
        />
      )}

      {step === 'quiz' && (
        <Quiz
          questions={lesson.quiz}
          calmMode={calmMode}
          onComplete={handleQuizComplete}
        />
      )}

      {step === 'complete' && (
        <article className="lesson-complete">
          <h2>🎉 Lekce dokončena!</h2>
          <p className="lesson-complete__memory">„{lesson.memorySentence}"</p>
          {quizResult && (
            <p className="lesson-complete__quiz-score">
              Výsledek mini testu: {quizResult.correct}/{quizResult.total}
            </p>
          )}
          <div className="lesson-complete__rewards">
            {projectorMode ? (
              <p>
                Režim na projektor — pokrok a XP se neukládají. Žáci si lekci projdou
                sami ve svém zařízení.
              </p>
            ) : quizOutcome?.xpAwarded ? (
              <p>Získáváš celkem {lesson.activityXp + lesson.quizXp} XP za tuto lekci.</p>
            ) : (
              <>
                <p>{badge ? 'XP a odznak za tuto lekci už máš.' : 'XP za tuto lekci už máš.'}</p>
                {isValidQuizScore(lessonProgress.bestQuizScore) && (
                  <p className="lesson-complete__best-score">
                    Nejlepší uložený výsledek: {lessonProgress.bestQuizScore.correct}/
                    {lessonProgress.bestQuizScore.total}
                  </p>
                )}
              </>
            )}
            {badge && quizOutcome?.lessonBadgeAwarded && (
              <div className="badge-earned">
                <span className="badge-earned__icon" aria-hidden="true">
                  {badge.icon}
                </span>
                <div>
                  <strong>Nový odznak: {badge.title}</strong>
                  <p>{badge.description}</p>
                </div>
              </div>
            )}
          </div>
          <a
            href={`#/topic/${lesson.subjectId}/${lesson.topicId}`}
            className="btn btn--primary"
          >
            Zpět na téma
          </a>
        </article>
      )}
    </section>
  );
}
