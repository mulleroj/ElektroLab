import { useState } from 'react';
import type { MicroLesson } from '../types';
import { subjects, getSubjectById } from '../data/subjects';
import { getTopicById } from '../data/topics';
import { getMvpLessonsBySubject, getLessonById } from '../data/lessons';
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
  'sensor-demo': 'Snímač pohybu a světlo',
  'regulation-loop': 'Regulační smyčka s teplotou',
  'feedback-loop': 'Zpětná vazba na nádrži',
  'automation-logic': 'Dopravník s podmínkou AND',
  'transformer-demo': 'Transformátor: závity a napětí',
  'induction-motor': 'Asynchronní motor krok za krokem',
  'contactor-relay': 'Stykač: cívka spíná kontakt',
  'voltage-level-safety': 'Karty NN / VN / VVN a odstup',
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

/** Doporučené rychlé lekce do hodiny (~10 minut). Kurátorovaný stabilní výběr; pořadí je záměrné. */
const QUICK_LESSONS: { id: string; studentTries: string }[] = [
  {
    id: 'pred-praci-zastav-a-oznam',
    studentTries:
      'Projde čtyři situace a rozhodne, kdy pokračovat, zastavit, nepoužít nebo odstoupit.',
  },
  {
    id: 'co-je-obvod',
    studentTries: 'Sepne a rozpojí obvod a seřadí prvky tak, jak jimi teče proud.',
  },
  {
    id: 'voltmetr-zapojeni',
    studentTries: 'V simulaci vyzkouší, proč voltmetr patří paralelně.',
  },
  {
    id: 'co-dela-jistic',
    studentTries: 'Projde scénáře přetížení a zkratu a rozhodne, kdy jistič vypne.',
  },
  {
    id: 'logicka-hradla',
    studentTries: 'Přepíná vstupy 0/1 a sleduje výstup hradel AND, OR a NOT.',
  },
];

const PILOT_CHECKLIST = [
  'Spustit na projektoru',
  'Vybrat lekci',
  'Žáci projdou ukázku',
  'Žáci splní úkol',
  'Společně projít mini test',
  'Zapsat, co bylo nejasné',
];

function buildLessonsOverview(): string {
  const lines: string[] = ['ElektroLab — přehled dostupných lekcí', ''];
  for (const subject of subjects.filter((s) => s.mvpAvailable)) {
    const lessons = filterValidLessons(getMvpLessonsBySubject(subject.id));
    if (lessons.length === 0) continue;
    lines.push(`=== ${subject.title} ===`);
    for (const lesson of lessons) {
      const demo = lesson.interactiveDemo
        ? (demoLabels[lesson.interactiveDemo.type] ?? lesson.interactiveDemo.title)
        : 'bez ukázky';
      lines.push(
        `- ${lesson.title} (${lesson.year}. ročník, ${lesson.durationMinutes} min)`,
      );
      lines.push(`  Interaktivita: ${demo}; úkol: ${getActivityLabel(lesson)}`);
      lines.push(`  Bezpečnost: ${lesson.safetyNote}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

export function TeacherPage({ onOpenLesson, onOpenLessonOnProjector }: TeacherPageProps) {
  const activeSubjects = subjects.filter((s) => s.mvpAvailable);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'fallback'>('idle');
  const [overviewText, setOverviewText] = useState('');

  const handleCopyOverview = async () => {
    const text = buildLessonsOverview();
    setOverviewText(text);
    try {
      if (!navigator.clipboard) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(text);
      setCopyState('copied');
    } catch {
      setCopyState('fallback');
    }
  };

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

      <section className="teacher-quick" aria-labelledby="quick-title">
        <h2 id="quick-title" className="section-title">
          ⏱️ Dnes do hodiny — rychlé lekce na ~10 minut
        </h2>
        <ul className="teacher-quick__list">
          {QUICK_LESSONS.map(({ id, studentTries }) => {
            const lesson = getLessonById(id);
            if (!lesson) return null;
            const subject = getSubjectById(lesson.subjectId);
            return (
              <li key={id}>
                <article className="teacher-quick__card">
                  <h3>{lesson.title}</h3>
                  <p className="teacher-quick__meta">
                    {subject?.title} · {lesson.durationMinutes} min
                  </p>
                  <p className="teacher-quick__tries">
                    <strong>Žák si vyzkouší:</strong> {studentTries}
                  </p>
                  <div className="teacher-lesson-card__actions">
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={() => onOpenLessonOnProjector(id)}
                    >
                      Projektor
                    </button>
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={() => onOpenLesson(id)}
                    >
                      Otevřít
                    </button>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="teacher-checklist" aria-labelledby="checklist-title">
        <h2 id="checklist-title" className="section-title">
          📋 Checklist pro pilotní hodinu
        </h2>
        <ol className="teacher-checklist__list">
          {PILOT_CHECKLIST.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section className="teacher-export" aria-labelledby="export-title">
        <h2 id="export-title" className="section-title">
          📄 Přehled lekcí pro přípravu
        </h2>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={handleCopyOverview}
        >
          Zkopírovat přehled lekcí
        </button>
        <p role="status" className="teacher-export__status">
          {copyState === 'copied' && '✔ Přehled je zkopírovaný ve schránce.'}
          {copyState === 'fallback' &&
            'Schránka není dostupná — text si zkopíruj ručně z pole níže.'}
        </p>
        {copyState === 'fallback' && (
          <textarea
            className="teacher-export__textarea"
            readOnly
            rows={12}
            value={overviewText}
            aria-label="Přehled lekcí k ručnímu zkopírování"
            onFocus={(e) => e.currentTarget.select()}
          />
        )}
      </section>

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
