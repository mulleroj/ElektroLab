import { useState, useEffect, useCallback } from 'react';
import type { Route, ProgressState } from './types';
import { parseHash } from './lib/routing';
import {
  loadProgress,
  completeActivity,
  completeQuiz,
  toggleCalmMode,
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

function App() {
  const [route, setRoute] = useState<Route>(parseHash);
  const [progress, setProgress] = useState<ProgressState>(loadProgress);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleCalmModeToggle = useCallback(() => {
    setProgress((prev) => toggleCalmMode(prev));
  }, []);

  const handleActivityComplete = useCallback((lessonId: string, xp: number) => {
    setProgress((prev) => completeActivity(prev, lessonId, xp));
  }, []);

  const handleQuizComplete = useCallback(
    (lessonId: string, xp: number, badgeId?: string) => {
      setProgress((prev) => completeQuiz(prev, lessonId, xp, badgeId));
    },
    [],
  );

  const renderPage = () => {
    switch (route.page) {
      case 'home':
        return <HomePage />;

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
    >
      {renderPage()}
    </AppShell>
  );
}

export default App;
