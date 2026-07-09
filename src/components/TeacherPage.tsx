import type { MicroLesson } from '../types';
import { subjects } from '../data/subjects';
import { getTopicById } from '../data/topics';
import { getMvpLessonsBySubject } from '../data/lessons';
import { filterValidLessons } from '../lib/validation';

interface TeacherPageProps {
  onOpenLesson: (lessonId: string) => void;
  onOpenLessonOnProjector: (lessonId: string) => void;
}

const demoLabels: Record<string, string> = {
  'circuit-switch': 'Obvod se spínačem',
  'series-parallel': 'Sériové vs. paralelní schéma',
  'symbols-demo': 'Klikací značky ve schématu',
  'voltmeter-connection': 'Zapojení voltmetru',
  'ammeter-connection': 'Zapojení ampérmetru',
  'measurement-scenarios': 'Měřicí scénáře',
  'protection-device': 'Jistič ve třech scénářích',
  'residual-current': 'Proud tam a zpět (chránič)',
  'protection-scenario': 'Karty situací s ochranami',
  'diode-direction': 'Dioda: propustný a závěrný směr',
  'transistor-switch': 'Tranzistor jako spínač',
  'logic-gates': 'Hradla AND / OR / NOT',
};

const activityLabels: Record<string, string> = {
  circuitOrder: 'Řazení prvků obvodu',
  termMatching: 'Párování pojmů',
  formulaSelect: 'Výběr správného vzorce',
  connectionType: 'Rozhodování sériově/paralelně',
  symbolMatching: 'Párování značek',
  meterConnection: 'Výběr zapojení měřáku',
  measurementJudgment: 'Posuzování správně/chybně',
  scenarioChoice: 'Rozhodovací scénáře s možnostmi',
};

function getActivityLabel(lesson: MicroLesson): string {
  const key = Object.keys(lesson.activity).find(
    (k) => lesson.activity[k as keyof typeof lesson.activity],
  );
  return key ? (activityLabels[key] ?? 'Interaktivní úkol') : 'Interaktivní úkol';
}

function getDefaultTeacherTip(lesson: MicroLesson): string {
  return `Krátká aktivita (~${lesson.durationMinutes} min) pro ${lesson.year}. ročník — vhodná jako opakování nebo rychlá aktivita do hodiny.`;
}

export function TeacherPage({ onOpenLesson, onOpenLessonOnProjector }: TeacherPageProps) {
  const activeSubjects = subjects.filter((s) => s.mvpAvailable);

  return (
    <section className="teacher-page">
      <nav className="breadcrumb" aria-label="Navigace">
        <a href="#/">← Zpět na rozcestník</a>
      </nav>

      <header className="page-header">
        <h1>Učitelský režim</h1>
        <p>
          Přehled všech dostupných mikrolekcí pro rychlé použití ve výuce. Otevření
          lekce „na projektor“ zapne zvětšené zobrazení a <strong>neukládá pokrok
          ani XP</strong> — hodí se pro společnou práci celé třídy.
        </p>
      </header>

      {activeSubjects.map((subject) => {
        const lessons = filterValidLessons(getMvpLessonsBySubject(subject.id));
        if (lessons.length === 0) return null;
        return (
          <section key={subject.id} className="teacher-subject">
            <h2 className="section-title">
              <span aria-hidden="true">{subject.icon}</span> {subject.title}
            </h2>
            <ul className="teacher-lesson-list">
              {lessons.map((lesson) => {
                const topic = getTopicById(lesson.topicId);
                return (
                  <li key={lesson.id}>
                    <article className="teacher-lesson-card">
                      <div className="teacher-lesson-card__header">
                        <h3>{lesson.title}</h3>
                        <p className="teacher-lesson-card__meta">
                          {topic?.title ?? 'Téma'} · {lesson.year}. ročník ·{' '}
                          {lesson.durationMinutes} min · {lesson.difficulty}
                        </p>
                      </div>
                      <dl className="teacher-lesson-card__details">
                        {lesson.interactiveDemo && (
                          <div>
                            <dt>Ukázka</dt>
                            <dd>
                              {demoLabels[lesson.interactiveDemo.type] ??
                                lesson.interactiveDemo.title}
                            </dd>
                          </div>
                        )}
                        <div>
                          <dt>Úkol</dt>
                          <dd>{getActivityLabel(lesson)}</dd>
                        </div>
                        <div>
                          <dt>Kdy použít</dt>
                          <dd>{lesson.teacherTip ?? getDefaultTeacherTip(lesson)}</dd>
                        </div>
                        <div className="teacher-lesson-card__safety">
                          <dt>Bezpečnostní poznámka</dt>
                          <dd>{lesson.safetyNote}</dd>
                        </div>
                      </dl>
                      <div className="teacher-lesson-card__actions">
                        <button
                          type="button"
                          className="btn btn--primary"
                          onClick={() => onOpenLessonOnProjector(lesson.id)}
                        >
                          Otevřít na projektoru
                        </button>
                        <button
                          type="button"
                          className="btn btn--secondary"
                          onClick={() => onOpenLesson(lesson.id)}
                        >
                          Otevřít běžně
                        </button>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </section>
  );
}
