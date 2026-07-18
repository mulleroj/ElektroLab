import type { Topic, Subject } from '../types';
import type { ProgressState } from '../types';
import { getLessonsByTopic } from '../data/lessons';
import { filterValidLessons } from '../lib/validation';
import { isLessonComplete, getLessonProgress } from '../lib/progress';
import { isValidQuizScore } from '../lib/quizScore';
import { navigate } from '../lib/routing';

interface TopicPageProps {
  topic: Topic;
  subject: Subject;
  progress: ProgressState;
}

export function TopicPage({ topic, subject, progress }: TopicPageProps) {
  const lessons = filterValidLessons(
    getLessonsByTopic(topic.id).filter((l) => l.mvpAvailable),
  );
  const completedCount = lessons.filter((l) => isLessonComplete(progress, l.id)).length;

  return (
    <section className="topic-page">
      <nav className="breadcrumb" aria-label="Navigace">
        <a href={`#/subject/${subject.id}`}>← Zpět na {subject.title}</a>
      </nav>

      <header className="page-header">
        <span className="tag">{topic.year}. ročník</span>
        <h1>{topic.title}</h1>
        <p>{topic.description}</p>
        <p className="topic-page__time">Doporučený čas: ~{topic.estimatedMinutes} minut</p>
        {lessons.length > 0 && (
          <p className="topic-page__progress">
            {completedCount} / {lessons.length} mikrolekcí dokončeno
          </p>
        )}
      </header>

      <h2 className="section-title">Mikrolekce</h2>
      <ul className="lesson-list">
        {lessons.map((lesson) => {
          const complete = isLessonComplete(progress, lesson.id);
          const bestQuizScore = getLessonProgress(progress, lesson.id).bestQuizScore;
          return (
            <li key={lesson.id}>
              <article className="lesson-card">
                <div className="lesson-card__header">
                  <h3>{lesson.title}</h3>
                  {complete && (
                    <span className="lesson-card__done" aria-label="Dokončeno">
                      ✔ Hotovo
                    </span>
                  )}
                </div>
                <p className="lesson-card__meta">
                  {lesson.durationMinutes} min · {lesson.difficulty}
                </p>
                {/* Skóre jen pokud skutečně existuje — starší dokončené lekce ho nemají. */}
                {complete && isValidQuizScore(bestQuizScore) && (
                  <p className="lesson-card__quiz-score">
                    Výsledek mini testu: {bestQuizScore.correct}/{bestQuizScore.total}
                  </p>
                )}
                <p className="lesson-card__tags">
                  {lesson.interactiveDemo && (
                    <span className="tag tag--demo">🔬 Interaktivní ukázka</span>
                  )}
                  <span className="tag">🧩 Úkol</span>
                  <span className="tag">❓ Mini test</span>
                  <span className="tag tag--safety">🛡️ Bezpečnost</span>
                </p>
                <p className="lesson-card__goal">{lesson.goal}</p>
                {lesson.mvpAvailable ? (
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => navigate({ page: 'lesson', lessonId: lesson.id })}
                  >
                    {complete ? 'Opakovat lekci' : 'Začít lekci'}
                  </button>
                ) : (
                  <button type="button" className="btn btn--secondary" disabled>
                    🔒 Připraveno pro další fázi
                  </button>
                )}
              </article>
            </li>
          );
        })}
      </ul>

      {lessons.length === 0 && (
        <p className="empty-state">
          V tomto tématu zatím nejsou dostupné mikrolekce.
        </p>
      )}
    </section>
  );
}
