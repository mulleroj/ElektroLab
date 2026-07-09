import { useState } from 'react';
import type { MicroLesson, ProgressState, LessonStep } from '../types';
import { getNextStepAfterIntro } from '../types';
import { SafetyNote } from './SafetyNote';
import { InteractiveDemoRenderer } from './InteractiveDemoRenderer';
import { ActivityRenderer } from './ActivityRenderer';
import { Quiz } from './Quiz';
import { getLessonProgress } from '../lib/progress';
import { getBadgeById } from '../data/badges';
import { getSubjectById } from '../data/subjects';
import { getTopicById } from '../data/topics';

interface LessonPageProps {
  lesson: MicroLesson;
  progress: ProgressState;
  calmMode: boolean;
  onActivityComplete: () => void;
  onQuizComplete: () => void;
}

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
  onActivityComplete,
  onQuizComplete,
}: LessonPageProps) {
  const lessonProgress = getLessonProgress(progress, lesson.id);
  const subject = getSubjectById(lesson.subjectId);
  const topic = getTopicById(lesson.topicId);

  const [step, setStep] = useState<LessonStep>(() => getInitialStep(lessonProgress));

  const handleActivityComplete = () => {
    onActivityComplete();
    setStep('quiz');
  };

  const handleQuizComplete = () => {
    onQuizComplete();
    setStep('complete');
  };

  const badge = lesson.badgeId ? getBadgeById(lesson.badgeId) : undefined;
  const earnedBadge = lesson.badgeId
    ? progress.earnedBadges.includes(lesson.badgeId)
    : false;

  const hasDemo = Boolean(lesson.interactiveDemo);
  const stepOrder: LessonStep[] = hasDemo
    ? ['intro', 'demo', 'activity', 'quiz']
    : ['intro', 'activity', 'quiz'];

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

      {calmMode && step !== 'complete' && stepIndex >= 0 && (
        <nav className="lesson-steps" aria-label="Kroky lekce">
          <ol>
            {stepOrder.map((s, i) => {
              const labels: Record<LessonStep, string> = {
                intro: 'Úvod',
                demo: 'Ukázka',
                activity: 'Úkol',
                quiz: 'Mini test',
                complete: 'Hotovo',
              };
              let cls = '';
              if (step === s) cls = 'lesson-steps__active';
              else if (stepIndex > i) cls = 'lesson-steps__done';
              return (
                <li key={s} className={cls}>
                  {labels[s]}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

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
          <button
            type="button"
            className="btn btn--primary btn--large"
            onClick={() => setStep(getNextStepAfterIntro(lesson))}
          >
            {hasDemo ? 'Pokračovat na ukázku' : 'Pokračovat na úkol'}
          </button>
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
          <div className="lesson-complete__rewards">
            <p>Získáváš celkem {lesson.activityXp + lesson.quizXp} XP za tuto lekci.</p>
            {badge && earnedBadge && (
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
