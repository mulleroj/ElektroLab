import type { ProgressState } from '../types';
import { subjects } from '../data/subjects';
import { lessons, getLessonById } from '../data/lessons';
import { getBadgeById } from '../data/badges';
import { isLessonComplete, LAST_LESSON_KEY } from '../lib/progress';
import { SubjectCard } from './SubjectCard';
import { ResetProgress } from './ResetProgress';
import { navigate } from '../lib/routing';
import { migrateLessonId } from '../lib/lessonIdMigration';

interface HomePageProps {
  progress: ProgressState;
  onResetProgress: () => void;
}

const RECOMMENDED_FIRST_LESSON_ID = 'co-je-obvod';

function getLastOpenedLesson() {
  try {
    const stored = localStorage.getItem(LAST_LESSON_KEY);
    if (!stored) return undefined;
    const id = migrateLessonId(stored);
    if (id !== stored) {
      localStorage.setItem(LAST_LESSON_KEY, id);
    }
    const lesson = getLessonById(id);
    return lesson?.mvpAvailable ? lesson : undefined;
  } catch {
    return undefined;
  }
}

export function HomePage({ progress, onResetProgress }: HomePageProps) {
  const mvpLessons = lessons.filter((l) => l.mvpAvailable);
  const completedLessons = mvpLessons.filter((l) => isLessonComplete(progress, l.id));
  const lastOpened = getLastOpenedLesson();
  const recommended = getLessonById(RECOMMENDED_FIRST_LESSON_ID);

  const lastCompleted = Object.entries(progress.lessons)
    .filter(([, lp]) => lp.completedAt)
    .sort(([, a], [, b]) => (a.completedAt! < b.completedAt! ? 1 : -1))
    .map(([id]) => getLessonById(id))
    .find((l) => l !== undefined);

  const nextLesson = mvpLessons.find((l) => !isLessonComplete(progress, l.id));

  const earnedBadges = progress.earnedBadges
    .map((id) => getBadgeById(id))
    .filter((b) => b !== undefined);

  return (
    <section className="home-page">
      <div className="page-intro">
        <h1>ElektroLab</h1>
        <p className="page-intro__lead">
          Bezpečná dílna v mobilu pro budoucí elektrikáře.
        </p>
        <p>
          Vyber předmět a projdi krátké mikrolekce s interaktivními úkoly.
          Vše běží lokálně — bez přihlášení, bez internetu po načtení.
        </p>
      </div>

      <section className="continue-box" aria-labelledby="continue-title">
        {lastOpened ? (
          <>
            <h2 id="continue-title">Pokračuj tam, kde jsi skončil</h2>
            <p>
              Naposledy otevřená lekce: <strong>{lastOpened.title}</strong> (
              {lastOpened.durationMinutes} min)
            </p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => navigate({ page: 'lesson', lessonId: lastOpened.id })}
            >
              Pokračovat v lekci
            </button>
          </>
        ) : (
          recommended && (
            <>
              <h2 id="continue-title">Začni první lekcí</h2>
              <p>
                Doporučujeme: <strong>{recommended.title}</strong> (
                {recommended.durationMinutes} min)
              </p>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() =>
                  navigate({ page: 'lesson', lessonId: recommended.id })
                }
              >
                Začít lekci
              </button>
            </>
          )
        )}
      </section>

      {completedLessons.length > 0 && (
        <section className="progress-overview" aria-labelledby="progress-overview-title">
          <h2 id="progress-overview-title">Co už umím</h2>
          <dl className="progress-overview__stats">
            <div>
              <dt>Dokončené lekce</dt>
              <dd>
                {completedLessons.length} / {mvpLessons.length}
              </dd>
            </div>
            <div>
              <dt>Celkem XP</dt>
              <dd>{progress.totalXp}</dd>
            </div>
            {lastCompleted && (
              <div>
                <dt>Poslední dokončená lekce</dt>
                <dd>{lastCompleted.title}</dd>
              </div>
            )}
          </dl>
          {earnedBadges.length > 0 && (
            <div className="progress-overview__badges">
              <h3>Odznaky ({earnedBadges.length})</h3>
              <ul>
                {earnedBadges.map((badge) => (
                  <li key={badge.id} title={badge.description}>
                    <span aria-hidden="true">{badge.icon}</span> {badge.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {nextLesson ? (
            <p className="progress-overview__next">
              Další doporučená lekce: <strong>{nextLesson.title}</strong>
            </p>
          ) : (
            <p className="progress-overview__done">
              🎉 Všechny dostupné lekce máš hotové. Můžeš je kdykoli opakovat.
            </p>
          )}
        </section>
      )}

      <div className="subject-grid" role="list">
        {subjects.map((subject) => (
          <div key={subject.id} role="listitem">
            <SubjectCard
              subject={subject}
              onSelect={(id) => navigate({ page: 'subject', subjectId: id })}
            />
          </div>
        ))}
      </div>

      <ResetProgress onReset={onResetProgress} />
    </section>
  );
}
