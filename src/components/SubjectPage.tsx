import { useState } from 'react';
import type { Subject } from '../types';
import type { ProgressState } from '../types';
import { getTopicsBySubject } from '../data/topics';
import { getMvpLessonsBySubject, getLessonsByTopic } from '../data/lessons';
import { getSubjectProgress } from '../lib/progress';
import { navigate } from '../lib/routing';

interface SubjectPageProps {
  subject: Subject;
  progress: ProgressState;
}

export function SubjectPage({ subject, progress }: SubjectPageProps) {
  const [selectedYear, setSelectedYear] = useState(subject.years[0]);
  const topics = getTopicsBySubject(subject.id, selectedYear);

  // Pokrok předmětu počítáme přes všechny ročníky, aby se filtrem neměnil.
  const mvpLessons = getMvpLessonsBySubject(subject.id);
  const allLessonIds = mvpLessons.map((l) => l.id);
  const { completed, total } = getSubjectProgress(progress, allLessonIds);
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="subject-page">
      <nav className="breadcrumb" aria-label="Navigace">
        <a href="#/">← Zpět na rozcestník</a>
      </nav>

      <header className="page-header">
        <span className="page-header__icon" aria-hidden="true">
          {subject.icon}
        </span>
        <h1>{subject.title}</h1>
        <p>{subject.description}</p>
        {total > 0 && (
          <div className="subject-progress">
            <p className="page-header__progress">
              Pokrok: {completed} / {total} mikrolekcí ({progressPercent} %)
            </p>
            <div
              className="subject-progress__bar"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Dokončeno ${completed} z ${total} mikrolekcí`}
            >
              <div
                className="subject-progress__fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </header>

      <div className="year-filter" role="group" aria-label="Filtr ročníku">
        {subject.years.map((year) => (
          <button
            key={year}
            type="button"
            className={`chip${selectedYear === year ? ' chip--active' : ''}`}
            aria-pressed={selectedYear === year}
            onClick={() => setSelectedYear(year)}
          >
            {year}. ročník
          </button>
        ))}
      </div>

      <ul className="topic-list">
        {topics.map((topic) => {
          const lessons = getLessonsByTopic(topic.id).filter((l) => l.mvpAvailable);
          const topicProgress = getSubjectProgress(
            progress,
            lessons.map((l) => l.id),
          );

          return (
            <li key={topic.id}>
              <article
                className={`topic-card${topic.mvpAvailable ? '' : ' topic-card--locked'}`}
              >
                <div className="topic-card__header">
                  <h2>{topic.title}</h2>
                  <span className="tag">{topic.year}. ročník</span>
                </div>
                <p>{topic.description}</p>
                <p className="topic-card__meta">
                  ~{topic.estimatedMinutes} min
                  {lessons.length > 0 && ` · ${lessons.length} mikrolekce`}
                  {topicProgress.total > 0 &&
                    ` · ${topicProgress.completed}/${topicProgress.total} hotovo`}
                </p>
                {topic.mvpAvailable ? (
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() =>
                      navigate({
                        page: 'topic',
                        subjectId: subject.id,
                        topicId: topic.id,
                      })
                    }
                  >
                    Otevřít téma
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
    </section>
  );
}
