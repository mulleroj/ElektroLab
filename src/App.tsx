import { useState, useEffect, useCallback } from 'react';
import type { Route, ProgressState } from './types';
import type { QuizCompletionResult } from './lib/progress';
import { parseHash, navigate } from './lib/routing';
import {
  loadProgress,
  completeActivity,
  applyQuizCompletion,
  resetProgress,
  toggleCalmMode,
  LAST_LESSON_KEY,
} from './lib/progress';
import { getValidatedLesson } from './lib/validation';
import { getSubjectById } from './data/subjects';
import { getTopicById } from './data/topics';
import { getLessonById } from './data/lessons';
import { AppShell } from './components/AppShell';
import { HomePage } from './components/HomePage';
import { SubjectPage } from './components/SubjectPage';
import { TopicPage } from './components/TopicPage';
import { LessonPage } from './components/LessonPage';
import { TeacherPage } from './components/TeacherPage';
import { Onboarding } from './components/Onboarding';

const PROJECTOR_KEY = 'elektrolab-projector';
const ONBOARDING_KEY = 'elektrolab-onboarding-seen';

function loadOnboardingSeen(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === '1';
  } catch {
    return true;
  }
}


function loadProjectorMode(): boolean {
  try {
    return sessionStorage.getItem(PROJECTOR_KEY) === '1';
  } catch {
    return false;
  }
}

function App() {
  const [route, setRoute] = useState<Route>(parseHash);
  const [progress, setProgress] = useState<ProgressState>(loadProgress);
  const [projectorMode, setProjectorMode] = useState<boolean>(loadProjectorMode);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(
    () => !loadOnboardingSeen(),
  );

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(PROJECTOR_KEY, projectorMode ? '1' : '0');
    } catch {
      // sessionStorage nemusí být dostupná — režim pak platí jen do obnovení stránky
    }
  }, [projectorMode]);

  // Zapamatuj poslední otevřenou lekci (mimo projektorový režim).
  useEffect(() => {
    if (route.page === 'lesson' && !projectorMode) {
      try {
        localStorage.setItem(LAST_LESSON_KEY, route.lessonId);
      } catch {
        // bez localStorage se poslední lekce jen nezapamatuje
      }
    }
  }, [route, projectorMode]);

  const handleOnboardingClose = useCallback(() => {
    setShowOnboarding(false);
    try {
      localStorage.setItem(ONBOARDING_KEY, '1');
    } catch {
      // bez localStorage se úvod zobrazí znovu při příštím spuštění
    }
  }, []);

  const handleCalmModeToggle = useCallback(() => {
    setProgress((prev) => toggleCalmMode(prev));
  }, []);

  const handleActivityComplete = useCallback(
    (lessonId: string, xp: number) => {
      // V projektorovém režimu učitel promítá — pokrok a XP se neukládají.
      if (projectorMode) return;
      setProgress((prev) => completeActivity(prev, lessonId, xp));
    },
    [projectorMode],
  );

  const handleQuizComplete = useCallback(
    (
      lessonId: string,
      xp: number,
      correct: number,
      total: number,
      badgeId?: string,
    ): QuizCompletionResult => {
      // Projektorový režim řeší applyQuizCompletion — nic se pak neukládá.
      // Počítá se přímo z aktuálního stavu, aby šla metadata o právě
      // udělených odměnách vrátit synchronně do výsledné obrazovky.
      const result = applyQuizCompletion(progress, {
        lessonId,
        xp,
        badgeId,
        correct,
        total,
        projectorMode,
      });
      setProgress(result.state);
      return result;
    },
    [progress, projectorMode],
  );

  const handleResetProgress = useCallback(() => {
    setProgress((prev) => resetProgress(prev));
  }, []);

  const openLessonOnProjector = useCallback((lessonId: string) => {
    setProjectorMode(true);
    navigate({ page: 'lesson', lessonId });
  }, []);

  const renderPage = () => {
    switch (route.page) {
      case 'home':
        return <HomePage progress={progress} onResetProgress={handleResetProgress} />;

      case 'teacher':
        return (
          <TeacherPage
            onOpenLesson={(lessonId) => {
              setProjectorMode(false);
              navigate({ page: 'lesson', lessonId });
            }}
            onOpenLessonOnProjector={openLessonOnProjector}
          />
        );

      case 'subject': {
        const subject = getSubjectById(route.subjectId);
        if (!subject) {
          return (
            <div className="error-page">
              <h1>Předmět nenalezen</h1>
              <a href="#/">Zpět na rozcestník</a>
            </div>
          );
        }
        return <SubjectPage subject={subject} progress={progress} />;
      }

      case 'topic': {
        const subject = getSubjectById(route.subjectId);
        const topic = getTopicById(route.topicId);
        if (!subject || !topic) {
          return (
            <div className="error-page">
              <h1>Téma nenalezeno</h1>
              <a href="#/">Zpět na rozcestník</a>
            </div>
          );
        }
        return <TopicPage topic={topic} subject={subject} progress={progress} />;
      }

      case 'lesson': {
        const lesson = getValidatedLesson(getLessonById(route.lessonId));
        if (!lesson) {
          return (
            <div className="error-page">
              <h1>Lekce není dostupná</h1>
              <p>
                Lekce nebyla nalezena nebo nemá povinnou bezpečnostní poznámku.
              </p>
              <a href="#/">Zpět na rozcestník</a>
            </div>
          );
        }
        return (
          <LessonPage
            key={lesson.id}
            lesson={lesson}
            progress={progress}
            calmMode={progress.calmMode}
            projectorMode={projectorMode}
            onActivityComplete={() =>
              handleActivityComplete(lesson.id, lesson.activityXp)
            }
            onQuizComplete={(correct, total) =>
              handleQuizComplete(lesson.id, lesson.quizXp, correct, total, lesson.badgeId)
            }
          />
        );
      }
    }
  };

  return (
    <AppShell
      progress={progress}
      route={route}
      calmMode={progress.calmMode}
      onCalmModeToggle={handleCalmModeToggle}
      projectorMode={projectorMode}
      onProjectorModeToggle={() => setProjectorMode((prev) => !prev)}
      onOpenOnboarding={() => setShowOnboarding(true)}
    >
      {showOnboarding && <Onboarding onClose={handleOnboardingClose} />}
      {renderPage()}
    </AppShell>
  );
}

export default App;
