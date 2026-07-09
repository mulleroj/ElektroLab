import { useState, useEffect, useCallback } from 'react';
import type { Route, ProgressState } from './types';
import { parseHash, navigate } from './lib/routing';
import {
  loadProgress,
  completeActivity,
  completeQuiz,
  toggleCalmMode,
  isLessonComplete,
  saveProgress,
} from './lib/progress';
import { getValidatedLesson } from './lib/validation';
import { getSubjectById } from './data/subjects';
import { getTopicById } from './data/topics';
import { getLessonById, getMvpLessonsBySubject } from './data/lessons';
import { AppShell } from './components/AppShell';
import { HomePage } from './components/HomePage';
import { SubjectPage } from './components/SubjectPage';
import { TopicPage } from './components/TopicPage';
import { LessonPage } from './components/LessonPage';
import { TeacherPage } from './components/TeacherPage';

const PROJECTOR_KEY = 'elektrolab-projector';

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
    (lessonId: string, xp: number, badgeId?: string) => {
      if (projectorMode) return;
      setProgress((prev) => {
        let next = completeQuiz(prev, lessonId, xp, badgeId);
        const mereniIds = getMvpLessonsBySubject('mereni', 1).map((l) => l.id);
        const allMereniDone = mereniIds.every((id) => isLessonComplete(next, id));
        if (allMereniDone && !next.earnedBadges.includes('merici-elev')) {
          next = {
            ...next,
            earnedBadges: [...next.earnedBadges, 'merici-elev'],
          };
          saveProgress(next);
        }
        return next;
      });
    },
    [projectorMode],
  );

  const openLessonOnProjector = useCallback((lessonId: string) => {
    setProjectorMode(true);
    navigate({ page: 'lesson', lessonId });
  }, []);

  const renderPage = () => {
    switch (route.page) {
      case 'home':
        return <HomePage progress={progress} />;

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
            onQuizComplete={() =>
              handleQuizComplete(lesson.id, lesson.quizXp, lesson.badgeId)
            }
          />
        );
      }
    }
  };

  return (
    <AppShell
      progress={progress}
      calmMode={progress.calmMode}
      onCalmModeToggle={handleCalmModeToggle}
      projectorMode={projectorMode}
      onProjectorModeToggle={() => setProjectorMode((prev) => !prev)}
    >
      {renderPage()}
    </AppShell>
  );
}

export default App;
