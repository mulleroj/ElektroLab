/**
 * CLI: npm run test
 *
 * Testy pokroku a skóre mini testu (MVP-12A) ve stylu projektu:
 * tsx skript bez další testovací knihovny, čitelný report, exit code 1
 * při alespoň jednom selhání. localStorage je nahrazen in-memory stubem.
 */
import assert from 'node:assert/strict';

// Stub localStorage musí existovat dřív, než testy zavolají funkce pokroku.
// Moduly aplikace na localStorage sahají až za běhu, ne při importu.
function createLocalStorageStub() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    key: (index: number) => [...store.keys()][index] ?? null,
    get length() {
      return store.size;
    },
  };
}

Object.defineProperty(globalThis, 'localStorage', {
  value: createLocalStorageStub(),
  configurable: true,
});

import {
  loadProgress,
  saveProgress,
  completeActivity,
  applyQuizCompletion,
  recordQuizScore,
  resetProgress,
  getLessonProgress,
  getSubjectProgress,
  isLessonComplete,
  LAST_LESSON_KEY,
} from '../src/lib/progress';
import { migrateProgressLessonReferences } from '../src/lib/lessonIdMigration';
import { getMvpLessonsBySubject, getLessonById } from '../src/data/lessons';
import { getTopicById, getTopicsBySubject } from '../src/data/topics';
import { getBadgeById } from '../src/data/badges';
import { getLessonActivity } from '../src/types';
import type { ProgressState } from '../src/types';

const PROGRESS_KEY = 'elektrolab-progress';
const ONBOARDING_KEY = 'elektrolab-onboarding-seen';
const LESSON_ID = 'co-je-obvod';

let passed = 0;
const failures: string[] = [];

function test(name: string, fn: () => void) {
  localStorage.clear();
  try {
    fn();
    passed += 1;
    console.log(`PASS ${name}`);
  } catch (error) {
    failures.push(name);
    console.log(`FAIL ${name}`);
    console.log(`  ${error instanceof Error ? error.message : String(error)}`);
  }
}

function storedProgress(): unknown {
  const raw = localStorage.getItem(PROGRESS_KEY);
  return raw === null ? null : JSON.parse(raw);
}

function finishQuiz(correct: number, total: number, projectorMode = false) {
  return applyQuizCompletion(loadProgress(), {
    lessonId: LESSON_ID,
    xp: 10,
    badgeId: 'testovaci-odznak',
    correct,
    total,
    projectorMode,
  });
}

/** Stav pro přímé testy migrace — lessons přesně v zadaném pořadí klíčů. */
function migrationState(lessons: ProgressState['lessons']): ProgressState {
  return { totalXp: 0, earnedBadges: [], lessons, calmMode: false };
}

console.log('ElektroLab progress tests (MVP-12A)');
console.log('');

test('uloží skóre 2/3 do trvalého pokroku', () => {
  const next = finishQuiz(2, 3).state;
  assert.deepEqual(getLessonProgress(next, LESSON_ID).bestQuizScore, {
    correct: 2,
    total: 3,
  });
  const stored = storedProgress() as {
    lessons: Record<string, { bestQuizScore?: unknown }>;
  };
  assert.deepEqual(stored.lessons[LESSON_ID].bestQuizScore, { correct: 2, total: 3 });
});

test('uloží skóre 3/3 do trvalého pokroku', () => {
  const next = finishQuiz(3, 3).state;
  assert.deepEqual(getLessonProgress(next, LESSON_ID).bestQuizScore, {
    correct: 3,
    total: 3,
  });
});

test('horší opakovaný výsledek nepřepíše lepší', () => {
  finishQuiz(3, 3);
  const next = finishQuiz(1, 3).state;
  assert.deepEqual(getLessonProgress(next, LESSON_ID).bestQuizScore, {
    correct: 3,
    total: 3,
  });
});

test('lepší opakovaný výsledek přepíše horší', () => {
  finishQuiz(1, 3);
  const next = finishQuiz(3, 3).state;
  assert.deepEqual(getLessonProgress(next, LESSON_ID).bestQuizScore, {
    correct: 3,
    total: 3,
  });
});

test('starý progress bez bestQuizScore se načte beze změny významu', () => {
  localStorage.setItem(
    PROGRESS_KEY,
    JSON.stringify({
      totalXp: 40,
      earnedBadges: ['prvni-obvod'],
      lessons: {
        [LESSON_ID]: {
          activityCompleted: true,
          quizCompleted: true,
          completedAt: '2026-01-10T10:00:00.000Z',
        },
      },
      calmMode: false,
    }),
  );
  const state = loadProgress();
  assert.equal(state.totalXp, 40);
  assert.equal(isLessonComplete(state, LESSON_ID), true);
  assert.equal(getLessonProgress(state, LESSON_ID).bestQuizScore, undefined);
});

test('poškozený localStorage neshodí načtení (vrátí výchozí stav)', () => {
  localStorage.setItem(PROGRESS_KEY, '{rozbité json');
  const state = loadProgress();
  assert.equal(state.totalXp, 0);
  assert.deepEqual(state.lessons, {});
});

test('legacy lesson ID se migruje včetně bestQuizScore', () => {
  localStorage.setItem(
    PROGRESS_KEY,
    JSON.stringify({
      totalXp: 20,
      earnedBadges: [],
      lessons: {
        'zakladni-znacKy': {
          activityCompleted: true,
          quizCompleted: true,
          bestQuizScore: { correct: 2, total: 3 },
        },
      },
      calmMode: false,
    }),
  );
  const state = loadProgress();
  assert.equal(state.lessons['zakladni-znacKy'], undefined);
  assert.deepEqual(getLessonProgress(state, 'zakladni-znacky').bestQuizScore, {
    correct: 2,
    total: 3,
  });
});

test('poškozené bestQuizScore se ignoruje a přepíše prvním platným výsledkem', () => {
  localStorage.setItem(
    PROGRESS_KEY,
    JSON.stringify({
      totalXp: 0,
      earnedBadges: [],
      lessons: {
        [LESSON_ID]: {
          activityCompleted: true,
          quizCompleted: true,
          bestQuizScore: { correct: 'tři', total: -1 },
        },
      },
      calmMode: false,
    }),
  );
  const next = recordQuizScore(loadProgress(), LESSON_ID, 1, 3);
  assert.deepEqual(getLessonProgress(next, LESSON_ID).bestQuizScore, {
    correct: 1,
    total: 3,
  });
});

test('projektorový režim skóre ani pokrok trvale neuloží', () => {
  const prev = loadProgress();
  const result = applyQuizCompletion(prev, {
    lessonId: LESSON_ID,
    xp: 10,
    badgeId: 'testovaci-odznak',
    correct: 3,
    total: 3,
    projectorMode: true,
  });
  assert.equal(result.state, prev);
  assert.equal(localStorage.getItem(PROGRESS_KEY), null);
});

test('opakování quizu nepřidělí podruhé XP ani odznak', () => {
  finishQuiz(2, 3);
  const next = finishQuiz(3, 3).state;
  assert.equal(next.totalXp, 10);
  assert.deepEqual(next.earnedBadges, ['testovaci-odznak']);
});

test('reset odstraní XP, dokončení, skóre i odznaky', () => {
  let state = completeActivity(loadProgress(), LESSON_ID, 5);
  state = finishQuiz(2, 3).state;
  const next = resetProgress(state);
  assert.equal(next.totalXp, 0);
  assert.deepEqual(next.earnedBadges, []);
  assert.deepEqual(next.lessons, {});
  assert.equal(localStorage.getItem(PROGRESS_KEY), null);
  const reloaded = loadProgress();
  assert.equal(reloaded.totalXp, 0);
  assert.equal(isLessonComplete(reloaded, LESSON_ID), false);
});

test('reset odstraní poslední otevřenou lekci', () => {
  localStorage.setItem(LAST_LESSON_KEY, LESSON_ID);
  resetProgress(loadProgress());
  assert.equal(localStorage.getItem(LAST_LESSON_KEY), null);
});

test('reset zachová onboardingový příznak', () => {
  localStorage.setItem(ONBOARDING_KEY, '1');
  finishQuiz(2, 3);
  resetProgress(loadProgress());
  assert.equal(localStorage.getItem(ONBOARDING_KEY), '1');
});

test('reset zachová zklidněný režim (nastavení, ne pokrok)', () => {
  finishQuiz(2, 3);
  const state = { ...loadProgress(), calmMode: true };
  saveProgress(state);
  const next = resetProgress(state);
  assert.equal(next.calmMode, true);
  assert.equal(next.totalXp, 0);
  const reloaded = loadProgress();
  assert.equal(reloaded.calmMode, true);
  assert.deepEqual(reloaded.lessons, {});
});

test('reset na prázdném stavu je bezpečný a opakovatelný', () => {
  const first = resetProgress(loadProgress());
  const second = resetProgress(first);
  assert.equal(second.totalXp, 0);
  assert.equal(localStorage.getItem(PROGRESS_KEY), null);
  assert.equal(localStorage.getItem(LAST_LESSON_KEY), null);
});

test('po resetu UI podklady ukazují nulový pokrok', () => {
  completeActivity(loadProgress(), LESSON_ID, 5);
  finishQuiz(3, 3);
  const next = resetProgress(loadProgress());
  assert.deepEqual(getSubjectProgress(next, [LESSON_ID]), { completed: 0, total: 1 });
  assert.equal(next.totalXp, 0);
  assert.deepEqual(next.earnedBadges, []);
  assert.equal(getLessonProgress(next, LESSON_ID).bestQuizScore, undefined);
});

// --- Deterministická migrace shodných poměrů skóre -------------------------

test('migrace: legacy 2/3 před canonical 4/6 → vyhrává 4/6 (větší total)', () => {
  const { state, changed } = migrateProgressLessonReferences(
    migrationState({
      'zakladni-znacKy': {
        activityCompleted: true,
        quizCompleted: true,
        bestQuizScore: { correct: 2, total: 3 },
      },
      'zakladni-znacky': {
        activityCompleted: true,
        quizCompleted: true,
        bestQuizScore: { correct: 4, total: 6 },
      },
    }),
  );
  assert.equal(changed, true);
  assert.deepEqual(state.lessons['zakladni-znacky'].bestQuizScore, {
    correct: 4,
    total: 6,
  });
});

test('migrace: canonical 4/6 před legacy 2/3 → vyhrává 4/6 (větší total)', () => {
  const { state } = migrateProgressLessonReferences(
    migrationState({
      'zakladni-znacky': {
        activityCompleted: true,
        quizCompleted: true,
        bestQuizScore: { correct: 4, total: 6 },
      },
      'zakladni-znacKy': {
        activityCompleted: true,
        quizCompleted: true,
        bestQuizScore: { correct: 2, total: 3 },
      },
    }),
  );
  assert.deepEqual(state.lessons['zakladni-znacky'].bestQuizScore, {
    correct: 4,
    total: 6,
  });
});

test('migrace: legacy 6/9 vs canonical 4/6 → vyhrává 6/9 (větší total)', () => {
  const { state } = migrateProgressLessonReferences(
    migrationState({
      'zakladni-znacKy': {
        activityCompleted: true,
        quizCompleted: true,
        bestQuizScore: { correct: 6, total: 9 },
      },
      'zakladni-znacky': {
        activityCompleted: true,
        quizCompleted: true,
        bestQuizScore: { correct: 4, total: 6 },
      },
    }),
  );
  assert.deepEqual(state.lessons['zakladni-znacky'].bestQuizScore, {
    correct: 6,
    total: 9,
  });
});

test('migrace: canonical 4/6 před legacy 6/9 → vyhrává 6/9 (větší total)', () => {
  const { state } = migrateProgressLessonReferences(
    migrationState({
      'zakladni-znacky': {
        activityCompleted: true,
        quizCompleted: true,
        bestQuizScore: { correct: 4, total: 6 },
      },
      'zakladni-znacKy': {
        activityCompleted: true,
        quizCompleted: true,
        bestQuizScore: { correct: 6, total: 9 },
      },
    }),
  );
  assert.deepEqual(state.lessons['zakladni-znacky'].bestQuizScore, {
    correct: 6,
    total: 9,
  });
});

test('migrace: obě pořadí klíčů vytvoří hluboce shodný výsledek', () => {
  const legacyEntry = {
    activityCompleted: true,
    quizCompleted: true,
    bestQuizScore: { correct: 2, total: 3 },
    completedAt: '2026-01-10T10:00:00.000Z',
  };
  const canonicalEntry = {
    activityCompleted: false,
    quizCompleted: true,
    bestQuizScore: { correct: 4, total: 6 },
    completedAt: '2026-02-01T08:00:00.000Z',
  };
  // Netriviální top-level pole ověří, že migrace mění jen lessons.
  const base = { totalXp: 35, earnedBadges: ['prvni-obvod'], calmMode: true };
  const legacyFirst = migrateProgressLessonReferences({
    ...base,
    lessons: { 'zakladni-znacKy': legacyEntry, 'zakladni-znacky': canonicalEntry },
  });
  const canonicalFirst = migrateProgressLessonReferences({
    ...base,
    lessons: { 'zakladni-znacky': canonicalEntry, 'zakladni-znacKy': legacyEntry },
  });
  // Celý návrat migrace: progress (XP, odznaky, režim, lessons) i changed.
  assert.deepEqual(legacyFirst.state, canonicalFirst.state);
  assert.equal(legacyFirst.changed, true);
  assert.equal(canonicalFirst.changed, true);
  assert.equal(legacyFirst.state.totalXp, 35);
  assert.deepEqual(legacyFirst.state.earnedBadges, ['prvni-obvod']);
  assert.equal(legacyFirst.state.calmMode, true);
  assert.deepEqual(legacyFirst.state.lessons, canonicalFirst.state.lessons);
});

test('migrace: 2/3 vyhraje nad 3/5 (vyšší podíl)', () => {
  const { state } = migrateProgressLessonReferences(
    migrationState({
      'zakladni-znacKy': {
        activityCompleted: true,
        quizCompleted: true,
        bestQuizScore: { correct: 2, total: 3 },
      },
      'zakladni-znacky': {
        activityCompleted: true,
        quizCompleted: true,
        bestQuizScore: { correct: 3, total: 5 },
      },
    }),
  );
  assert.deepEqual(state.lessons['zakladni-znacky'].bestQuizScore, {
    correct: 2,
    total: 3,
  });
});

test('migrace: neplatné canonical skóre nahradí platné legacy skóre', () => {
  const { state, changed } = migrateProgressLessonReferences(
    migrationState({
      'zakladni-znacky': {
        activityCompleted: true,
        quizCompleted: true,
        bestQuizScore: { correct: 'tři', total: -1 } as never,
      },
      'zakladni-znacKy': {
        activityCompleted: true,
        quizCompleted: true,
        bestQuizScore: { correct: 2, total: 3 },
      },
    }),
  );
  assert.equal(changed, true);
  assert.deepEqual(state.lessons['zakladni-znacky'].bestQuizScore, {
    correct: 2,
    total: 3,
  });
});

test('migrace: samotné neplatné canonical skóre se odstraní i z uloženého stavu', () => {
  localStorage.setItem(
    PROGRESS_KEY,
    JSON.stringify({
      totalXp: 10,
      earnedBadges: [],
      lessons: {
        [LESSON_ID]: {
          activityCompleted: true,
          quizCompleted: true,
          bestQuizScore: { correct: 99, total: 0 },
        },
      },
      calmMode: false,
    }),
  );
  const state = loadProgress();
  assert.equal(getLessonProgress(state, LESSON_ID).bestQuizScore, undefined);
  const stored = storedProgress() as {
    lessons: Record<string, { bestQuizScore?: unknown }>;
  };
  assert.equal('bestQuizScore' in stored.lessons[LESSON_ID], false);
  assert.equal(stored.lessons[LESSON_ID].activityCompleted, true);
});

test('migrace: klíč __proto__ nezmění prototyp ani výsledek migrace', () => {
  localStorage.setItem(
    PROGRESS_KEY,
    '{"totalXp":20,"earnedBadges":[],"lessons":{' +
      '"__proto__":{"activityCompleted":true,"quizCompleted":true},' +
      '"zakladni-znacKy":{"activityCompleted":true,"quizCompleted":true,' +
      '"bestQuizScore":{"correct":2,"total":3}}},"calmMode":false}',
  );
  const state = loadProgress();
  // Globální ani lokální prototyp nesmí být znečištěný.
  assert.equal(({} as Record<string, unknown>).activityCompleted, undefined);
  assert.equal(
    Object.getPrototypeOf(state.lessons),
    Object.prototype,
  );
  assert.deepEqual(getLessonProgress(state, 'zakladni-znacky').bestQuizScore, {
    correct: 2,
    total: 3,
  });
  assert.equal(state.totalXp, 20);
});

test('migrace: vlastní klíč constructor nezpůsobí falešnou migraci ani pollution', () => {
  // JSON.parse vytvoří skutečný vlastní klíč "constructor" v lessons.
  const input = migrationState(
    JSON.parse('{"constructor":{"activityCompleted":true,"quizCompleted":true}}'),
  );
  const { state, changed } = migrateProgressLessonReferences(input);
  assert.equal(changed, false);
  assert.equal(state, input);
  assert.deepEqual(getLessonProgress(state, 'constructor'), {
    activityCompleted: true,
    quizCompleted: true,
  });
  // Prototypy zůstávají čisté.
  assert.equal(({} as Record<string, unknown>).activityCompleted, undefined);
  assert.equal(typeof {}.constructor, 'function');
});

test('migrace: vlastní klíč prototype nezpůsobí falešnou migraci ani pollution', () => {
  const input = migrationState(
    JSON.parse('{"prototype":{"activityCompleted":true,"quizCompleted":true}}'),
  );
  const { state, changed } = migrateProgressLessonReferences(input);
  assert.equal(changed, false);
  assert.equal(state, input);
  assert.deepEqual(getLessonProgress(state, 'prototype'), {
    activityCompleted: true,
    quizCompleted: true,
  });
  assert.equal(({} as Record<string, unknown>).activityCompleted, undefined);
  assert.equal(Object.getPrototypeOf({}), Object.prototype);
});

// --- Metadata o nově udělených odměnách (pravdivé UI) ----------------------

test('první dokončení vrátí přesný počet XP přidělených quizem', () => {
  const before = loadProgress().totalXp;
  const result = finishQuiz(2, 3);
  assert.equal(result.xpAwarded, 10);
  assert.equal(result.xpAwarded, result.state.totalXp - before);
  assert.equal(result.lessonBadgeAwarded, true);
  assert.deepEqual(result.subjectBadgeIdsAwarded, []);
});

test('druhý pokus vrátí xpAwarded 0 a žádný nový lekční odznak', () => {
  finishQuiz(2, 3);
  const result = finishQuiz(2, 3);
  assert.equal(result.xpAwarded, 0);
  assert.equal(result.lessonBadgeAwarded, false);
});

test('lepší retry aktualizuje nejlepší skóre, ale nehlásí nové odměny', () => {
  finishQuiz(1, 3);
  const result = finishQuiz(3, 3);
  assert.equal(result.xpAwarded, 0);
  assert.equal(result.lessonBadgeAwarded, false);
  assert.deepEqual(getLessonProgress(result.state, LESSON_ID).bestQuizScore, {
    correct: 3,
    total: 3,
  });
});

test('horší retry ponechá nejlepší skóre a nehlásí nové odměny', () => {
  finishQuiz(3, 3);
  const result = finishQuiz(1, 3);
  assert.equal(result.xpAwarded, 0);
  assert.equal(result.lessonBadgeAwarded, false);
  assert.deepEqual(getLessonProgress(result.state, LESSON_ID).bestQuizScore, {
    correct: 3,
    total: 3,
  });
});

test('projektorový pokus nehlásí trvale získané odměny', () => {
  const result = finishQuiz(3, 3, true);
  assert.equal(result.xpAwarded, 0);
  assert.equal(result.lessonBadgeAwarded, false);
  assert.deepEqual(result.subjectBadgeIdsAwarded, []);
  assert.equal(localStorage.getItem(PROGRESS_KEY), null);
});

test('uložený stav obsahuje XP a odznak jen jednou i po opakování', () => {
  finishQuiz(2, 3);
  finishQuiz(3, 3);
  const stored = storedProgress() as {
    totalXp: number;
    earnedBadges: string[];
  };
  assert.equal(stored.totalXp, 10);
  assert.deepEqual(stored.earnedBadges, ['testovaci-odznak']);
});

// --- Předmětové odznaky a lekce bez lekčního odznaku -----------------------

/** Dokončí aktivitu i mini test lekce přes produkční funkce pokroku. */
function completeLessonFully(lessonId: string, badgeId?: string) {
  const afterActivity = completeActivity(loadProgress(), lessonId, 20);
  return applyQuizCompletion(afterActivity, {
    lessonId,
    xp: 15,
    badgeId,
    correct: 3,
    total: 3,
    projectorMode: false,
  });
}

test('dokončení poslední lekce předmětu udělí nový předmětový odznak', () => {
  const lessons = getMvpLessonsBySubject('rozvody');
  assert.ok(lessons.length > 0, 'předmět rozvody musí mít MVP lekce');
  const last = lessons[lessons.length - 1];
  for (const l of lessons.slice(0, -1)) {
    const partial = completeLessonFully(l.id, l.badgeId);
    assert.deepEqual(partial.subjectBadgeIdsAwarded, []);
  }
  const result = completeLessonFully(last.id, last.badgeId);
  assert.deepEqual(result.subjectBadgeIdsAwarded, ['bezpecny-rozvodar']);
  assert.equal(result.state.earnedBadges.includes('bezpecny-rozvodar'), true);
  const stored = storedProgress() as { earnedBadges: string[] };
  assert.equal(stored.earnedBadges.includes('bezpecny-rozvodar'), true);
});

test('retry lekce po udělení předmětového odznaku vrátí prázdné subjectBadgeIdsAwarded', () => {
  const lessons = getMvpLessonsBySubject('rozvody');
  for (const l of lessons) completeLessonFully(l.id, l.badgeId);
  const last = lessons[lessons.length - 1];
  const retry = applyQuizCompletion(loadProgress(), {
    lessonId: last.id,
    xp: 15,
    badgeId: last.badgeId,
    correct: 3,
    total: 3,
    projectorMode: false,
  });
  assert.deepEqual(retry.subjectBadgeIdsAwarded, []);
  assert.equal(retry.xpAwarded, 0);
  assert.equal(retry.lessonBadgeAwarded, false);
  assert.equal(
    retry.state.earnedBadges.filter((b) => b === 'bezpecny-rozvodar').length,
    1,
  );
});

test('lekce o výkonu je hned po sériovém zapojení a před jištěním', () => {
  const order = getMvpLessonsBySubject('zaklady', 1)
    .filter((l) => l.topicId === 'stejnosmerny-proud')
    .map((l) => l.id);
  const series = order.indexOf('seriove-paralelni');
  const power = order.indexOf('elektricky-vykon-a-energie');
  const protection = order.indexOf('zkrat-pretizeni-a-jisteni');
  assert.ok(series >= 0 && power >= 0 && protection >= 0);
  assert.equal(power, series + 1);
  assert.equal(protection, power + 1);
});

test('dokončení všech lekcí Základů udělí předmětový odznak zakladni-elev', () => {
  const lessons = getMvpLessonsBySubject('zaklady', 1);
  assert.ok(lessons.length > 0, 'Základy musí mít MVP lekce');
  const last = lessons[lessons.length - 1];
  for (const l of lessons.slice(0, -1)) {
    const partial = completeLessonFully(l.id, l.badgeId);
    assert.deepEqual(partial.subjectBadgeIdsAwarded, []);
  }
  const result = completeLessonFully(last.id, last.badgeId);
  assert.deepEqual(result.subjectBadgeIdsAwarded, ['zakladni-elev']);
  assert.equal(result.state.earnedBadges.includes('zakladni-elev'), true);
});

test('téma stavba-latek je aktivní a obsahuje lekci Vodiče a izolanty', () => {
  const topic = getTopicById('stavba-latek');
  assert.ok(topic);
  assert.equal(topic.mvpAvailable, true);
  assert.equal(topic.subjectId, 'zaklady');
  assert.equal(topic.year, 1);
  const lesson = getLessonById('vodice-a-izolanty');
  assert.ok(lesson);
  assert.equal(lesson.topicId, 'stavba-latek');
  assert.equal(lesson.subjectId, 'zaklady');
  assert.equal(lesson.year, 1);
  assert.equal(lesson.mvpAvailable, true);
  assert.equal(lesson.quiz.length, 3);
  const activity = getLessonActivity(lesson);
  assert.ok(activity);
  assert.equal(activity.type, 'term-matching');
  assert.ok(getBadgeById('znalec-materialu'));
  assert.equal(lesson.badgeId, 'znalec-materialu');
});

test('lekce Vodiče a izolanty je první MVP lekcí Základů před obvodem', () => {
  const order = getMvpLessonsBySubject('zaklady', 1).map((l) => l.id);
  assert.equal(order[0], 'vodice-a-izolanty');
  assert.equal(order[1], 'elektricky-naboj-a-volne-elektrony');
  assert.equal(order[2], 'co-je-obvod');
  const topics = getTopicsBySubject('zaklady', 1).filter((t) => t.mvpAvailable);
  assert.equal(topics[0].id, 'stavba-latek');
});

test('lekce Elektrický náboj je ve stavba-latek a má tři otázky', () => {
  const lesson = getLessonById('elektricky-naboj-a-volne-elektrony');
  assert.ok(lesson);
  assert.equal(lesson.topicId, 'stavba-latek');
  assert.equal(lesson.subjectId, 'zaklady');
  assert.equal(lesson.year, 1);
  assert.equal(lesson.mvpAvailable, true);
  assert.equal(lesson.quiz.length, 3);
  const activity = getLessonActivity(lesson);
  assert.ok(activity);
  assert.equal(activity.type, 'term-matching');
  assert.equal(lesson.badgeId, 'znalec-naboje');
  assert.ok(getBadgeById('znalec-naboje'));
});

test('pořadí Základů: vodiče, náboj, obvod', () => {
  const order = getMvpLessonsBySubject('zaklady', 1).map((l) => l.id);
  assert.equal(order[0], 'vodice-a-izolanty');
  assert.equal(order[1], 'elektricky-naboj-a-volne-elektrony');
  assert.equal(order[2], 'co-je-obvod');
});

test('zakladni-elev se neudělí bez lekce Elektrický náboj a volné elektrony', () => {
  const lessons = getMvpLessonsBySubject('zaklady', 1);
  const withoutCharge = lessons.filter((l) => l.id !== 'elektricky-naboj-a-volne-elektrony');
  assert.equal(withoutCharge.length, lessons.length - 1);
  for (const l of withoutCharge) {
    const partial = completeLessonFully(l.id, l.badgeId);
    assert.deepEqual(partial.subjectBadgeIdsAwarded, []);
  }
  assert.equal(loadProgress().earnedBadges.includes('zakladni-elev'), false);
  const result = completeLessonFully(
    'elektricky-naboj-a-volne-elektrony',
    'znalec-naboje',
  );
  assert.deepEqual(result.subjectBadgeIdsAwarded, ['zakladni-elev']);
});

test('dříve uložený zakladni-elev se po přidání lekce o náboji nemaže', () => {
  const allLessons = getMvpLessonsBySubject('zaklady', 1);
  const oldLessons = allLessons.filter(
    (l) => l.id !== 'elektricky-naboj-a-volne-elektrony',
  );
  assert.equal(oldLessons.length, allLessons.length - 1);
  const lessonsState: ProgressState['lessons'] = {};
  for (const l of oldLessons) {
    lessonsState[l.id] = {
      activityCompleted: true,
      quizCompleted: true,
      completedAt: '2026-01-01T00:00:00.000Z',
      bestQuizScore: { correct: 3, total: 3 },
    };
  }
  const seeded: ProgressState = {
    totalXp: oldLessons.length * 35,
    earnedBadges: ['zakladni-elev', 'znalec-materialu'],
    lessons: lessonsState,
    calmMode: false,
  };
  saveProgress(seeded);
  const loaded = loadProgress();
  assert.equal(loaded.earnedBadges.includes('zakladni-elev'), true);
  assert.equal(isLessonComplete(loaded, 'elektricky-naboj-a-volne-elektrony'), false);
  const { completed, total } = getSubjectProgress(
    loaded,
    allLessons.map((l) => l.id),
  );
  assert.equal(completed, oldLessons.length);
  assert.equal(total, allLessons.length);
  const afterOther = completeActivity(loaded, 'elektricky-naboj-a-volne-elektrony', 20);
  assert.equal(afterOther.earnedBadges.includes('zakladni-elev'), true);
  const retry = applyQuizCompletion(afterOther, {
    lessonId: 'vodice-a-izolanty',
    xp: 15,
    badgeId: 'znalec-materialu',
    correct: 2,
    total: 3,
    projectorMode: false,
  });
  assert.equal(retry.state.earnedBadges.includes('zakladni-elev'), true);
  assert.deepEqual(retry.subjectBadgeIdsAwarded, []);
});

test('lekce Proč má vodič odpor je ve stejnosmerny-proud a má tři otázky', () => {
  const lesson = getLessonById('proc-ma-vodic-elektricky-odpor');
  assert.ok(lesson);
  assert.equal(lesson.topicId, 'stejnosmerny-proud');
  assert.equal(lesson.subjectId, 'zaklady');
  assert.equal(lesson.year, 1);
  assert.equal(lesson.mvpAvailable, true);
  assert.equal(lesson.quiz.length, 3);
  const activity = getLessonActivity(lesson);
  assert.ok(activity);
  assert.equal(activity.type, 'measurement-judgment');
  assert.equal(lesson.badgeId, 'znalec-odporu');
  assert.ok(getBadgeById('znalec-odporu'));
});

test('pořadí: napětí-proud-odpor, odpor vodiče, Ohmův zákon', () => {
  const order = getMvpLessonsBySubject('zaklady', 1)
    .filter((l) => l.topicId === 'stejnosmerny-proud')
    .map((l) => l.id);
  const napeti = order.indexOf('napeti-proud-odpor');
  const odpor = order.indexOf('proc-ma-vodic-elektricky-odpor');
  const ohm = order.indexOf('ohmuv-zakon');
  assert.ok(napeti >= 0 && odpor >= 0 && ohm >= 0);
  assert.equal(odpor, napeti + 1);
  assert.equal(ohm, odpor + 1);
});

test('zakladni-elev se neudělí bez lekce Proč má vodič elektrický odpor', () => {
  const lessons = getMvpLessonsBySubject('zaklady', 1);
  const withoutResistance = lessons.filter((l) => l.id !== 'proc-ma-vodic-elektricky-odpor');
  assert.equal(withoutResistance.length, lessons.length - 1);
  for (const l of withoutResistance) {
    const partial = completeLessonFully(l.id, l.badgeId);
    assert.deepEqual(partial.subjectBadgeIdsAwarded, []);
  }
  assert.equal(loadProgress().earnedBadges.includes('zakladni-elev'), false);
  const result = completeLessonFully('proc-ma-vodic-elektricky-odpor', 'znalec-odporu');
  assert.deepEqual(result.subjectBadgeIdsAwarded, ['zakladni-elev']);
});

test('dříve uložený zakladni-elev se po přidání lekce o odporu nemaže', () => {
  const allLessons = getMvpLessonsBySubject('zaklady', 1);
  const oldLessons = allLessons.filter((l) => l.id !== 'proc-ma-vodic-elektricky-odpor');
  assert.equal(oldLessons.length, allLessons.length - 1);
  const lessonsState: ProgressState['lessons'] = {};
  for (const l of oldLessons) {
    lessonsState[l.id] = {
      activityCompleted: true,
      quizCompleted: true,
      completedAt: '2026-01-01T00:00:00.000Z',
      bestQuizScore: { correct: 3, total: 3 },
    };
  }
  const seeded: ProgressState = {
    totalXp: oldLessons.length * 35,
    earnedBadges: ['zakladni-elev', 'znalec-velicin'],
    lessons: lessonsState,
    calmMode: false,
  };
  saveProgress(seeded);
  const loaded = loadProgress();
  assert.equal(loaded.earnedBadges.includes('zakladni-elev'), true);
  assert.equal(isLessonComplete(loaded, 'proc-ma-vodic-elektricky-odpor'), false);
  const { completed, total } = getSubjectProgress(
    loaded,
    allLessons.map((l) => l.id),
  );
  assert.equal(completed, oldLessons.length);
  assert.equal(total, allLessons.length);
  const afterOther = completeActivity(loaded, 'proc-ma-vodic-elektricky-odpor', 20);
  assert.equal(afterOther.earnedBadges.includes('zakladni-elev'), true);
  const retry = applyQuizCompletion(afterOther, {
    lessonId: 'napeti-proud-odpor',
    xp: 15,
    badgeId: 'znalec-velicin',
    correct: 2,
    total: 3,
    projectorMode: false,
  });
  assert.equal(retry.state.earnedBadges.includes('zakladni-elev'), true);
  assert.deepEqual(retry.subjectBadgeIdsAwarded, []);
});

test('zakladni-elev se neudělí bez lekce Vodiče a izolanty', () => {
  const lessons = getMvpLessonsBySubject('zaklady', 1);
  const withoutNew = lessons.filter((l) => l.id !== 'vodice-a-izolanty');
  assert.ok(withoutNew.length === lessons.length - 1);
  for (const l of withoutNew) {
    const partial = completeLessonFully(l.id, l.badgeId);
    assert.deepEqual(partial.subjectBadgeIdsAwarded, []);
  }
  assert.equal(loadProgress().earnedBadges.includes('zakladni-elev'), false);
  const result = completeLessonFully('vodice-a-izolanty', 'znalec-materialu');
  assert.deepEqual(result.subjectBadgeIdsAwarded, ['zakladni-elev']);
});

test('dříve uložený zakladni-elev se po přidání nové lekce nemaže', () => {
  const oldLessons = getMvpLessonsBySubject('zaklady', 1).filter(
    (l) => l.id !== 'vodice-a-izolanty',
  );
  const lessonsState: ProgressState['lessons'] = {};
  for (const l of oldLessons) {
    lessonsState[l.id] = {
      activityCompleted: true,
      quizCompleted: true,
      completedAt: '2026-01-01T00:00:00.000Z',
      bestQuizScore: { correct: 3, total: 3 },
    };
  }
  const seeded: ProgressState = {
    totalXp: oldLessons.length * 35,
    earnedBadges: ['zakladni-elev', 'prvni-zapojeni'],
    lessons: lessonsState,
    calmMode: false,
  };
  saveProgress(seeded);
  const loaded = loadProgress();
  assert.equal(loaded.earnedBadges.includes('zakladni-elev'), true);
  assert.equal(isLessonComplete(loaded, 'vodice-a-izolanty'), false);
  const afterOther = completeActivity(loaded, 'vodice-a-izolanty', 20);
  assert.equal(afterOther.earnedBadges.includes('zakladni-elev'), true);
  const retry = applyQuizCompletion(afterOther, {
    lessonId: 'co-je-obvod',
    xp: 15,
    badgeId: 'prvni-zapojeni',
    correct: 2,
    total: 3,
    projectorMode: false,
  });
  assert.equal(retry.state.earnedBadges.includes('zakladni-elev'), true);
  assert.deepEqual(retry.subjectBadgeIdsAwarded, []);
});

test('lekce bez lekčního odznaku vrátí přesné XP a lessonBadgeAwarded: false', () => {
  const before = loadProgress().totalXp;
  const result = applyQuizCompletion(loadProgress(), {
    lessonId: LESSON_ID,
    xp: 10,
    correct: 2,
    total: 3,
    projectorMode: false,
  });
  assert.equal(result.xpAwarded, 10);
  assert.equal(result.xpAwarded, result.state.totalXp - before);
  assert.equal(result.lessonBadgeAwarded, false);
  assert.deepEqual(result.state.earnedBadges, []);
});

test('lekce Jednotky a převody je ve veliciny a má term-matching bez dema', () => {
  const lesson = getLessonById('jednotky-a-prevody');
  assert.ok(lesson);
  assert.equal(lesson.topicId, 'veliciny');
  assert.equal(lesson.subjectId, 'zaklady');
  assert.equal(lesson.year, 1);
  assert.equal(lesson.mvpAvailable, true);
  assert.equal(lesson.quiz.length, 3);
  assert.equal(lesson.interactiveDemo, undefined);
  const activity = getLessonActivity(lesson);
  assert.ok(activity);
  assert.equal(activity.type, 'term-matching');
  assert.equal(lesson.badgeId, 'prekladac-jednotek');
  assert.ok(getBadgeById('prekladac-jednotek'));
});

test('pořadí Základů: napětí, jednotky, odpor vodiče, Ohmův zákon', () => {
  const order = getMvpLessonsBySubject('zaklady', 1).map((l) => l.id);
  const napeti = order.indexOf('napeti-proud-odpor');
  const units = order.indexOf('jednotky-a-prevody');
  const odpor = order.indexOf('proc-ma-vodic-elektricky-odpor');
  const ohm = order.indexOf('ohmuv-zakon');
  assert.ok(napeti >= 0 && units >= 0 && odpor >= 0 && ohm >= 0);
  assert.equal(units, napeti + 1);
  assert.equal(odpor, units + 1);
  assert.equal(ohm, odpor + 1);
});

test('zakladni-elev se neudělí bez lekce Jednotky a převody', () => {
  const lessons = getMvpLessonsBySubject('zaklady', 1);
  const withoutUnits = lessons.filter((l) => l.id !== 'jednotky-a-prevody');
  assert.equal(withoutUnits.length, lessons.length - 1);
  assert.equal(withoutUnits.length, 10);
  for (const l of withoutUnits) {
    const partial = completeLessonFully(l.id, l.badgeId);
    assert.deepEqual(partial.subjectBadgeIdsAwarded, []);
  }
  assert.equal(loadProgress().earnedBadges.includes('zakladni-elev'), false);
  const result = completeLessonFully('jednotky-a-prevody', 'prekladac-jednotek');
  assert.deepEqual(result.subjectBadgeIdsAwarded, ['zakladni-elev']);
});

test('dříve uložený zakladni-elev se po přidání lekce o jednotkách nemaže', () => {
  const allLessons = getMvpLessonsBySubject('zaklady', 1);
  const oldLessons = allLessons.filter((l) => l.id !== 'jednotky-a-prevody');
  assert.equal(oldLessons.length, 10);
  assert.equal(allLessons.length, 11);
  const lessonsState: ProgressState['lessons'] = {};
  for (const l of oldLessons) {
    lessonsState[l.id] = {
      activityCompleted: true,
      quizCompleted: true,
      completedAt: '2026-01-01T00:00:00.000Z',
      bestQuizScore: { correct: 3, total: 3 },
    };
  }
  const seeded: ProgressState = {
    totalXp: oldLessons.length * 35,
    earnedBadges: ['zakladni-elev', 'znalec-velicin'],
    lessons: lessonsState,
    calmMode: false,
  };
  saveProgress(seeded);
  const loaded = loadProgress();
  assert.equal(loaded.earnedBadges.includes('zakladni-elev'), true);
  assert.equal(isLessonComplete(loaded, 'jednotky-a-prevody'), false);
  const { completed, total } = getSubjectProgress(
    loaded,
    allLessons.map((l) => l.id),
  );
  assert.equal(completed, 10);
  assert.equal(total, 11);
  const afterOther = completeActivity(loaded, 'jednotky-a-prevody', 20);
  assert.equal(afterOther.earnedBadges.includes('zakladni-elev'), true);
  const retry = applyQuizCompletion(afterOther, {
    lessonId: 'napeti-proud-odpor',
    xp: 15,
    badgeId: 'znalec-velicin',
    correct: 2,
    total: 3,
    projectorMode: false,
  });
  assert.equal(retry.state.earnedBadges.includes('zakladni-elev'), true);
  assert.deepEqual(retry.subjectBadgeIdsAwarded, []);
});

test('lekce Zkrat, přetížení a jištění je ve stejnosmerny-proud a má scenario-choice', () => {
  const lesson = getLessonById('zkrat-pretizeni-a-jisteni');
  assert.ok(lesson);
  assert.equal(lesson.topicId, 'stejnosmerny-proud');
  assert.equal(lesson.subjectId, 'zaklady');
  assert.equal(lesson.year, 1);
  assert.equal(lesson.mvpAvailable, true);
  assert.equal(lesson.quiz.length, 3);
  const activity = getLessonActivity(lesson);
  assert.ok(activity);
  assert.equal(activity.type, 'scenario-choice');
  assert.equal(lesson.badgeId, 'strazce-obvodu');
  assert.ok(getBadgeById('strazce-obvodu'));
});

test('pořadí: sériové zapojení, výkon, zkrat-přetížení-jištění', () => {
  const order = getMvpLessonsBySubject('zaklady', 1)
    .filter((l) => l.topicId === 'stejnosmerny-proud')
    .map((l) => l.id);
  const series = order.indexOf('seriove-paralelni');
  const power = order.indexOf('elektricky-vykon-a-energie');
  const protection = order.indexOf('zkrat-pretizeni-a-jisteni');
  assert.ok(series >= 0 && power >= 0 && protection >= 0);
  assert.equal(power, series + 1);
  assert.equal(protection, power + 1);
});

test('zakladni-elev se neudělí bez lekce Zkrat, přetížení a jištění', () => {
  const lessons = getMvpLessonsBySubject('zaklady', 1);
  const withoutProtection = lessons.filter((l) => l.id !== 'zkrat-pretizeni-a-jisteni');
  assert.equal(withoutProtection.length, lessons.length - 1);
  for (const l of withoutProtection) {
    const partial = completeLessonFully(l.id, l.badgeId);
    assert.deepEqual(partial.subjectBadgeIdsAwarded, []);
  }
  assert.equal(loadProgress().earnedBadges.includes('zakladni-elev'), false);
  const result = completeLessonFully('zkrat-pretizeni-a-jisteni', 'strazce-obvodu');
  assert.deepEqual(result.subjectBadgeIdsAwarded, ['zakladni-elev']);
});

test('dříve uložený zakladni-elev se po přidání lekce o jištění nemaže', () => {
  const allLessons = getMvpLessonsBySubject('zaklady', 1);
  const oldLessons = allLessons.filter((l) => l.id !== 'zkrat-pretizeni-a-jisteni');
  assert.equal(oldLessons.length, allLessons.length - 1);
  const lessonsState: ProgressState['lessons'] = {};
  for (const l of oldLessons) {
    lessonsState[l.id] = {
      activityCompleted: true,
      quizCompleted: true,
      completedAt: '2026-01-01T00:00:00.000Z',
      bestQuizScore: { correct: 3, total: 3 },
    };
  }
  const seeded: ProgressState = {
    totalXp: oldLessons.length * 35,
    earnedBadges: ['zakladni-elev', 'vykon-pod-kontrolou'],
    lessons: lessonsState,
    calmMode: false,
  };
  saveProgress(seeded);
  const loaded = loadProgress();
  assert.equal(loaded.earnedBadges.includes('zakladni-elev'), true);
  assert.equal(isLessonComplete(loaded, 'zkrat-pretizeni-a-jisteni'), false);
  const { completed, total } = getSubjectProgress(
    loaded,
    allLessons.map((l) => l.id),
  );
  assert.equal(completed, oldLessons.length);
  assert.equal(total, allLessons.length);
  const afterOther = completeActivity(loaded, 'zkrat-pretizeni-a-jisteni', 20);
  assert.equal(afterOther.earnedBadges.includes('zakladni-elev'), true);
  const retry = applyQuizCompletion(afterOther, {
    lessonId: 'elektricky-vykon-a-energie',
    xp: 15,
    badgeId: 'vykon-pod-kontrolou',
    correct: 2,
    total: 3,
    projectorMode: false,
  });
  assert.equal(retry.state.earnedBadges.includes('zakladni-elev'), true);
  assert.deepEqual(retry.subjectBadgeIdsAwarded, []);
});

test('lekce Od výpočtu k měření je v metody-mereni a má measurement-judgment bez dema', () => {
  const lesson = getLessonById('od-vypoctu-k-mereni');
  assert.ok(lesson);
  assert.equal(lesson.topicId, 'metody-mereni');
  assert.equal(lesson.subjectId, 'mereni');
  assert.equal(lesson.year, 1);
  assert.equal(lesson.mvpAvailable, true);
  assert.equal(lesson.quiz.length, 3);
  assert.equal(lesson.interactiveDemo, undefined);
  const activity = getLessonActivity(lesson);
  assert.ok(activity);
  assert.equal(activity.type, 'measurement-judgment');
  assert.equal(lesson.badgeId, 'merici-detektiv');
  assert.ok(getBadgeById('merici-detektiv'));
});

test('pořadí Měření: přehled před voltmetrem, původní čtyři beze změny', () => {
  const order = getMvpLessonsBySubject('mereni', 1).map((l) => l.id);
  assert.deepEqual(order, [
    'vypnute-odpojeno-bez-napeti',
    'od-vypoctu-k-mereni',
    'voltmetr-zapojeni',
    'ampermetr-zapojeni',
    'mereni-spatne-zapojeni',
    'vyber-rozsahu',
  ]);
  const bridge = order.indexOf('od-vypoctu-k-mereni');
  const volt = order.indexOf('voltmetr-zapojeni');
  assert.equal(bridge, 1);
  assert.equal(volt, bridge + 1);
  assert.equal(order.indexOf('ampermetr-zapojeni'), volt + 1);
  assert.equal(order.indexOf('mereni-spatne-zapojeni'), volt + 2);
  assert.equal(order.indexOf('vyber-rozsahu'), volt + 3);
});

test('merici-elev se neudělí bez lekce Od výpočtu k měření', () => {
  const lessons = getMvpLessonsBySubject('mereni', 1);
  const withoutBridge = lessons.filter((l) => l.id !== 'od-vypoctu-k-mereni');
  assert.equal(withoutBridge.length, lessons.length - 1);
  assert.equal(withoutBridge.length, 5);
  for (const l of withoutBridge) {
    const partial = completeLessonFully(l.id, l.badgeId);
    assert.deepEqual(partial.subjectBadgeIdsAwarded, []);
  }
  assert.equal(loadProgress().earnedBadges.includes('merici-elev'), false);
  const result = completeLessonFully('od-vypoctu-k-mereni', 'merici-detektiv');
  assert.deepEqual(result.subjectBadgeIdsAwarded, ['merici-elev']);
});

test('dříve uložený merici-elev se po přidání lekce Od výpočtu k měření nemaže', () => {
  const allLessons = getMvpLessonsBySubject('mereni', 1);
  const oldLessons = allLessons.filter((l) => l.id !== 'od-vypoctu-k-mereni');
  assert.equal(oldLessons.length, 5);
  assert.equal(allLessons.length, 6);
  const lessonsState: ProgressState['lessons'] = {};
  for (const l of oldLessons) {
    lessonsState[l.id] = {
      activityCompleted: true,
      quizCompleted: true,
      completedAt: '2026-01-01T00:00:00.000Z',
      bestQuizScore: { correct: 3, total: 3 },
    };
  }
  const seeded: ProgressState = {
    totalXp: oldLessons.length * 35,
    earnedBadges: ['merici-elev', 'voltmetr-zvladnut'],
    lessons: lessonsState,
    calmMode: false,
  };
  saveProgress(seeded);
  const loaded = loadProgress();
  assert.equal(loaded.earnedBadges.includes('merici-elev'), true);
  assert.equal(isLessonComplete(loaded, 'od-vypoctu-k-mereni'), false);
  const { completed, total } = getSubjectProgress(
    loaded,
    allLessons.map((l) => l.id),
  );
  assert.equal(completed, 5);
  assert.equal(total, 6);
  const afterOther = completeActivity(loaded, 'od-vypoctu-k-mereni', 20);
  assert.equal(afterOther.earnedBadges.includes('merici-elev'), true);
  const retry = applyQuizCompletion(afterOther, {
    lessonId: 'voltmetr-zapojeni',
    xp: 15,
    badgeId: 'voltmetr-zvladnut',
    correct: 2,
    total: 3,
    projectorMode: false,
  });
  assert.equal(retry.state.earnedBadges.includes('merici-elev'), true);
  assert.deepEqual(retry.subjectBadgeIdsAwarded, []);
});

test('pořadí Základů: Ohm, sériové-paralelní, výkon, zkrat-jištění', () => {
  const order = getMvpLessonsBySubject('zaklady', 1).map((l) => l.id);
  const ohm = order.indexOf('ohmuv-zakon');
  const series = order.indexOf('seriove-paralelni');
  const power = order.indexOf('elektricky-vykon-a-energie');
  const protection = order.indexOf('zkrat-pretizeni-a-jisteni');
  assert.ok(ohm >= 0 && series >= 0 && power >= 0 && protection >= 0);
  assert.equal(series, ohm + 1);
  assert.equal(power, series + 1);
  assert.equal(protection, power + 1);
});

test('starý progress: dokončený výkon a jištění bez sériového → doporučí seriove-paralelni', () => {
  const allLessons = getMvpLessonsBySubject('zaklady', 1);
  assert.equal(allLessons.length, 11);
  const completedIds = allLessons
    .map((l) => l.id)
    .filter((id) => id !== 'seriove-paralelni');
  // Explicitně: výkon a jištění hotové, série ne — podle původního pořadí
  assert.ok(completedIds.includes('elektricky-vykon-a-energie'));
  assert.ok(completedIds.includes('zkrat-pretizeni-a-jisteni'));
  assert.equal(completedIds.includes('seriove-paralelni'), false);

  const lessonsState: ProgressState['lessons'] = {};
  for (const id of completedIds) {
    lessonsState[id] = {
      activityCompleted: true,
      quizCompleted: true,
      completedAt: '2026-01-01T00:00:00.000Z',
      bestQuizScore: { correct: 3, total: 3 },
    };
  }
  const seeded: ProgressState = {
    totalXp: completedIds.length * 35,
    earnedBadges: ['vykon-pod-kontrolou', 'strazce-obvodu'],
    lessons: lessonsState,
    calmMode: false,
  };
  saveProgress(seeded);
  const loaded = loadProgress();
  assert.equal(isLessonComplete(loaded, 'elektricky-vykon-a-energie'), true);
  assert.equal(isLessonComplete(loaded, 'zkrat-pretizeni-a-jisteni'), true);
  assert.equal(isLessonComplete(loaded, 'seriove-paralelni'), false);
  assert.equal(loaded.totalXp, completedIds.length * 35);
  assert.deepEqual(loaded.earnedBadges, ['vykon-pod-kontrolou', 'strazce-obvodu']);
  assert.equal(loaded.earnedBadges.includes('zakladni-elev'), false);

  const next = allLessons.find((l) => !isLessonComplete(loaded, l.id));
  assert.ok(next);
  assert.equal(next.id, 'seriove-paralelni');

  const { completed, total } = getSubjectProgress(
    loaded,
    allLessons.map((l) => l.id),
  );
  assert.equal(completed, 10);
  assert.equal(total, 11);
});

/** Délka explanation před MVP-12H4B — horní mez, ne cílový počet znaků. */
const ZKRAT_EXPLANATION_MAX_CHARS_BEFORE_H4B = 2700;

test('výklad Zkrat, přetížení a jištění zachovává odborné a bezpečnostní jádro', () => {
  const lesson = getLessonById('zkrat-pretizeni-a-jisteni');
  assert.ok(lesson);
  const text = lesson.explanation;
  assert.ok(text.includes('nadproud') || text.includes('Nadproud'));
  assert.ok(text.includes('Přetížení') || text.includes('přetížení'));
  assert.ok(text.includes('Zkrat') || text.includes('zkrat'));
  assert.ok(text.includes('velmi malým odporem') || text.includes('velmi malý odpor'));
  assert.ok(text.includes('není doslova nekonečný') || text.includes('není nekonečný'));
  assert.ok(text.includes('není vždy přesně nula'));
  assert.ok(text.includes('Pojistka') || text.includes('pojistka'));
  assert.ok(text.includes('tavný prvek'));
  assert.ok(text.includes('správným typem') || text.includes('správný typ'));
  assert.ok(text.includes('Jistič') || text.includes('jistič'));
  assert.ok(text.includes('opakované zapínání') || text.includes('Opakované zapínání'));
  assert.ok(text.includes('vedení'));
  assert.ok(text.includes('úrazem') || text.includes('člověka'));
  assert.ok(/proudov[ýy] chránič/i.test(text));
  assert.ok(/absolutn[íi]/i.test(text));
});

test('výklad Zkrat, přetížení a jištění nemá auditované duplicity a zůstává sedm bloků', () => {
  const lesson = getLessonById('zkrat-pretizeni-a-jisteni');
  assert.ok(lesson);
  const text = lesson.explanation;
  assert.ok(text.trim().length > 0);
  assert.ok(
    text.length <= ZKRAT_EXPLANATION_MAX_CHARS_BEFORE_H4B,
    `explanation má ${text.length} znaků, očekáváno ≤ ${ZKRAT_EXPLANATION_MAX_CHARS_BEFORE_H4B}`,
  );
  assert.equal(text.includes('Jednoduše:'), false);
  assert.equal(text.includes('nevhodně zatížený přívod'), false);
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  assert.equal(paragraphs.length, 7);
  for (const label of [
    '**Nadproud**',
    '**Přetížení**',
    '**Zkrat**',
    '**Rozdíl:**',
    '**Pojistka**',
    '**Jistič**',
    '**Hranice ochrany:**',
  ]) {
    assert.ok(text.includes(label), `chybí blok ${label}`);
  }
});

test('lekce PE, N a PEN je v rozvod-obytne-budovy a má scenario-choice bez dema', () => {
  const lesson = getLessonById('pe-n-pen');
  assert.ok(lesson);
  assert.equal(lesson.subjectId, 'rozvody');
  assert.equal(lesson.year, 2);
  assert.equal(lesson.topicId, 'rozvod-obytne-budovy');
  assert.equal(lesson.durationMinutes, 10);
  assert.equal(lesson.mvpAvailable, true);
  assert.equal(lesson.quiz.length, 3);
  assert.equal(lesson.interactiveDemo, undefined);
  const activity = getLessonActivity(lesson);
  assert.ok(activity);
  assert.equal(activity.type, 'scenario-choice');
  assert.equal(activity.scenarios.length, 4);
  assert.equal(lesson.badgeId, 'vodicovy-strazce');
  assert.ok(getBadgeById('vodicovy-strazce'));
});

test('pořadí Rozvodů: jistič, PE-N-PEN, chránič, porovnání', () => {
  const order = getMvpLessonsBySubject('rozvody').map((l) => l.id);
  assert.deepEqual(order, [
    'co-dela-jistic',
    'pe-n-pen',
    'co-dela-chranic',
    'jistic-vs-chranic',
  ]);
  assert.equal(order.indexOf('pe-n-pen'), order.indexOf('co-dela-jistic') + 1);
  assert.equal(order.indexOf('co-dela-chranic'), order.indexOf('pe-n-pen') + 1);
  assert.equal(order.indexOf('jistic-vs-chranic'), order.indexOf('co-dela-chranic') + 1);
});

test('výklad PE, N a PEN zachovává odborné a bezpečnostní jádro', () => {
  const lesson = getLessonById('pe-n-pen');
  assert.ok(lesson);
  const text = [
    lesson.explanation,
    lesson.safetyNote,
    lesson.typicalMistake,
    lesson.memorySentence,
  ].join('\n');
  assert.ok(text.includes('PE') || text.includes('ochranný vodič'));
  assert.ok(text.includes('N') || text.includes('střední vodič'));
  assert.ok(text.includes('PEN'));
  assert.ok(text.includes('pracovní'));
  assert.ok(text.includes('ochrann'));
  assert.ok(/kombinuj|spojen/i.test(text));
  assert.ok(/přerušen/i.test(text));
  assert.ok(/automaticky bezpečný|nepotvrzuje bezpečnost|není.*bezpečný/i.test(text));
  assert.ok(/barva/i.test(text));
  assert.ok(/síťov/i.test(text) || /síťové instalaci/i.test(text));
  assert.ok(/nemanipuluj|nemanipuluje|podle barvy/i.test(text));
  assert.ok(/oprávněná osoba/i.test(text));
});

test('starý progress Rozvodů bez předmětového odznaku: 3/4 a doporučí pe-n-pen', () => {
  const allLessons = getMvpLessonsBySubject('rozvody');
  assert.equal(allLessons.length, 4);
  const originalIds = ['co-dela-jistic', 'co-dela-chranic', 'jistic-vs-chranic'];
  const lessonsState: ProgressState['lessons'] = {};
  for (const id of originalIds) {
    lessonsState[id] = {
      activityCompleted: true,
      quizCompleted: true,
      completedAt: '2026-01-01T00:00:00.000Z',
      bestQuizScore: { correct: 3, total: 3 },
    };
  }
  const seeded: ProgressState = {
    totalXp: 35 * 3,
    earnedBadges: ['hlidac-jistice', 'chranic-pochopen', 'rozvodovy-detektiv'],
    lessons: lessonsState,
    calmMode: false,
  };
  saveProgress(seeded);
  const loaded = loadProgress();
  for (const id of originalIds) {
    assert.equal(isLessonComplete(loaded, id), true);
  }
  assert.equal(isLessonComplete(loaded, 'pe-n-pen'), false);
  assert.equal(loaded.totalXp, 105);
  assert.deepEqual(loaded.earnedBadges, [
    'hlidac-jistice',
    'chranic-pochopen',
    'rozvodovy-detektiv',
  ]);
  assert.equal(loaded.earnedBadges.includes('bezpecny-rozvodar'), false);

  const { completed, total } = getSubjectProgress(
    loaded,
    allLessons.map((l) => l.id),
  );
  assert.equal(completed, 3);
  assert.equal(total, 4);

  const next = allLessons.find((l) => !isLessonComplete(loaded, l.id));
  assert.ok(next);
  assert.equal(next.id, 'pe-n-pen');
});

test('dokončení pe-n-pen udělí vodicovy-strazce a bezpecny-rozvodar jednou', () => {
  const allLessons = getMvpLessonsBySubject('rozvody');
  assert.equal(allLessons.length, 4);
  const originalIds = ['co-dela-jistic', 'co-dela-chranic', 'jistic-vs-chranic'];
  const lessonsState: ProgressState['lessons'] = {};
  for (const id of originalIds) {
    lessonsState[id] = {
      activityCompleted: true,
      quizCompleted: true,
      completedAt: '2026-01-01T00:00:00.000Z',
      bestQuizScore: { correct: 3, total: 3 },
    };
  }
  saveProgress({
    totalXp: 105,
    earnedBadges: ['hlidac-jistice', 'chranic-pochopen', 'rozvodovy-detektiv'],
    lessons: lessonsState,
    calmMode: false,
  });

  const result = completeLessonFully('pe-n-pen', 'vodicovy-strazce');
  assert.equal(result.lessonBadgeAwarded, true);
  assert.ok(result.state.earnedBadges.includes('vodicovy-strazce'));
  assert.deepEqual(result.subjectBadgeIdsAwarded, ['bezpecny-rozvodar']);
  assert.equal(result.state.earnedBadges.includes('bezpecny-rozvodar'), true);

  const { completed, total } = getSubjectProgress(
    result.state,
    allLessons.map((l) => l.id),
  );
  assert.equal(completed, 4);
  assert.equal(total, 4);

  const retry = applyQuizCompletion(loadProgress(), {
    lessonId: 'pe-n-pen',
    xp: 15,
    badgeId: 'vodicovy-strazce',
    correct: 3,
    total: 3,
    projectorMode: false,
  });
  assert.equal(retry.xpAwarded, 0);
  assert.equal(retry.lessonBadgeAwarded, false);
  assert.deepEqual(retry.subjectBadgeIdsAwarded, []);
  assert.equal(
    retry.state.earnedBadges.filter((b) => b === 'vodicovy-strazce').length,
    1,
  );
  assert.equal(
    retry.state.earnedBadges.filter((b) => b === 'bezpecny-rozvodar').length,
    1,
  );
});

test('dříve uložený bezpecny-rozvodar se po přidání pe-n-pen nemaže', () => {
  const allLessons = getMvpLessonsBySubject('rozvody');
  assert.equal(allLessons.length, 4);
  const originalIds = ['co-dela-jistic', 'co-dela-chranic', 'jistic-vs-chranic'];
  const lessonsState: ProgressState['lessons'] = {};
  for (const id of originalIds) {
    lessonsState[id] = {
      activityCompleted: true,
      quizCompleted: true,
      completedAt: '2026-01-01T00:00:00.000Z',
      bestQuizScore: { correct: 3, total: 3 },
    };
  }
  saveProgress({
    totalXp: 105,
    earnedBadges: [
      'hlidac-jistice',
      'chranic-pochopen',
      'rozvodovy-detektiv',
      'bezpecny-rozvodar',
    ],
    lessons: lessonsState,
    calmMode: false,
  });
  const loaded = loadProgress();
  assert.equal(loaded.earnedBadges.includes('bezpecny-rozvodar'), true);
  assert.equal(isLessonComplete(loaded, 'pe-n-pen'), false);

  const { completed, total } = getSubjectProgress(
    loaded,
    allLessons.map((l) => l.id),
  );
  assert.equal(completed, 3);
  assert.equal(total, 4);

  const afterNew = completeLessonFully('pe-n-pen', 'vodicovy-strazce');
  assert.deepEqual(afterNew.subjectBadgeIdsAwarded, []);
  assert.equal(
    afterNew.state.earnedBadges.filter((b) => b === 'bezpecny-rozvodar').length,
    1,
  );
  assert.equal(afterNew.state.earnedBadges.includes('vodicovy-strazce'), true);
});

test('lekce Vypnuté není totéž co bez napětí je v metody-mereni a má scenario-choice bez dema', () => {
  const lesson = getLessonById('vypnute-odpojeno-bez-napeti');
  assert.ok(lesson);
  assert.equal(lesson.subjectId, 'mereni');
  assert.equal(lesson.year, 1);
  assert.equal(lesson.topicId, 'metody-mereni');
  assert.equal(lesson.durationMinutes, 10);
  assert.equal(lesson.mvpAvailable, true);
  assert.equal(lesson.quiz.length, 3);
  assert.equal(lesson.interactiveDemo, undefined);
  const activity = getLessonActivity(lesson);
  assert.ok(activity);
  assert.equal(activity.type, 'scenario-choice');
  assert.equal(activity.scenarios.length, 4);
  assert.equal(lesson.badgeId, 'tri-stavy-napeti');
  assert.ok(getBadgeById('tri-stavy-napeti'));
});

test('pořadí Měření po přidání lekce o stavech napětí', () => {
  const order = getMvpLessonsBySubject('mereni', 1).map((l) => l.id);
  assert.deepEqual(order, [
    'vypnute-odpojeno-bez-napeti',
    'od-vypoctu-k-mereni',
    'voltmetr-zapojeni',
    'ampermetr-zapojeni',
    'mereni-spatne-zapojeni',
    'vyber-rozsahu',
  ]);
  const originalFive = [
    'od-vypoctu-k-mereni',
    'voltmetr-zapojeni',
    'ampermetr-zapojeni',
    'mereni-spatne-zapojeni',
    'vyber-rozsahu',
  ];
  assert.deepEqual(
    order.filter((id) => originalFive.includes(id)),
    originalFive,
  );
});

test('výklad Vypnuté / odpojené / bez napětí zachovává odborné a bezpečnostní jádro', () => {
  const lesson = getLessonById('vypnute-odpojeno-bez-napeti');
  assert.ok(lesson);
  const text = [
    lesson.explanation,
    lesson.safetyNote,
    lesson.typicalMistake,
    lesson.memorySentence,
    lesson.goal,
    lesson.hook,
  ].join('\n');
  assert.ok(/vypnut/i.test(text));
  assert.ok(/odpojen/i.test(text));
  assert.ok(/ověřeně bez napětí|beznapěť/i.test(text));
  assert.ok(/vypínač|jistič/i.test(text));
  assert.ok(/není důkaz|nepotvrzuje|nejsou důkazem/i.test(text));
  assert.ok(/kontrolka|nefunkčnost/i.test(text));
  assert.ok(/více zdroj|další zdroj|druhý zdroj/i.test(text));
  assert.ok(/uložená energie|akumulátor|kondenzátor/i.test(text));
  assert.ok(/síťov/i.test(text));
  assert.ok(/multimetr/i.test(text));
  assert.ok(/zkoušečk/i.test(text));
  assert.ok(/oprávněná osoba/i.test(text));
  assert.ok(/informuje učitele|předám učiteli|informovat učitele/i.test(text));
  assert.equal(/LOTO|fotovolta|\bUPS\b|zkratuj kondenzátor/i.test(text), false);
});

test('starý progress Měření bez předmětového odznaku: 5/6 a doporučí vypnute-odpojeno-bez-napeti', () => {
  const allLessons = getMvpLessonsBySubject('mereni', 1);
  assert.equal(allLessons.length, 6);
  const originalIds = [
    'od-vypoctu-k-mereni',
    'voltmetr-zapojeni',
    'ampermetr-zapojeni',
    'mereni-spatne-zapojeni',
    'vyber-rozsahu',
  ];
  const originalBadges = [
    'merici-detektiv',
    'voltmetr-zvladnut',
    'ampermetr-zvladnut',
    'merak-nespalen',
    'spravny-rozsah',
  ];
  const lessonsState: ProgressState['lessons'] = {};
  for (const id of originalIds) {
    lessonsState[id] = {
      activityCompleted: true,
      quizCompleted: true,
      completedAt: '2026-01-01T00:00:00.000Z',
      bestQuizScore: { correct: 3, total: 3 },
    };
  }
  const seeded: ProgressState = {
    totalXp: 35 * 5,
    earnedBadges: [...originalBadges],
    lessons: lessonsState,
    calmMode: false,
  };
  saveProgress(seeded);
  const loaded = loadProgress();
  for (const id of originalIds) {
    assert.equal(isLessonComplete(loaded, id), true);
  }
  assert.equal(isLessonComplete(loaded, 'vypnute-odpojeno-bez-napeti'), false);
  assert.equal(loaded.totalXp, 175);
  assert.deepEqual(loaded.earnedBadges, originalBadges);
  assert.equal(loaded.earnedBadges.includes('merici-elev'), false);

  const { completed, total } = getSubjectProgress(
    loaded,
    allLessons.map((l) => l.id),
  );
  assert.equal(completed, 5);
  assert.equal(total, 6);

  const next = allLessons.find((l) => !isLessonComplete(loaded, l.id));
  assert.ok(next);
  assert.equal(next.id, 'vypnute-odpojeno-bez-napeti');
});

test('dokončení vypnute-odpojeno-bez-napeti udělí tri-stavy-napeti a merici-elev jednou', () => {
  const allLessons = getMvpLessonsBySubject('mereni', 1);
  assert.equal(allLessons.length, 6);
  const originalIds = [
    'od-vypoctu-k-mereni',
    'voltmetr-zapojeni',
    'ampermetr-zapojeni',
    'mereni-spatne-zapojeni',
    'vyber-rozsahu',
  ];
  const originalBadges = [
    'merici-detektiv',
    'voltmetr-zvladnut',
    'ampermetr-zvladnut',
    'merak-nespalen',
    'spravny-rozsah',
  ];
  const lessonsState: ProgressState['lessons'] = {};
  for (const id of originalIds) {
    lessonsState[id] = {
      activityCompleted: true,
      quizCompleted: true,
      completedAt: '2026-01-01T00:00:00.000Z',
      bestQuizScore: { correct: 3, total: 3 },
    };
  }
  saveProgress({
    totalXp: 175,
    earnedBadges: [...originalBadges],
    lessons: lessonsState,
    calmMode: false,
  });

  const beforeXp = loadProgress().totalXp;
  const result = completeLessonFully('vypnute-odpojeno-bez-napeti', 'tri-stavy-napeti');
  assert.equal(result.lessonBadgeAwarded, true);
  assert.ok(result.state.earnedBadges.includes('tri-stavy-napeti'));
  assert.deepEqual(result.subjectBadgeIdsAwarded, ['merici-elev']);
  assert.equal(result.state.earnedBadges.includes('merici-elev'), true);
  assert.equal(result.state.totalXp, beforeXp + 35);

  const { completed, total } = getSubjectProgress(
    result.state,
    allLessons.map((l) => l.id),
  );
  assert.equal(completed, 6);
  assert.equal(total, 6);

  const best = result.state.lessons['vypnute-odpojeno-bez-napeti']?.bestQuizScore;
  assert.deepEqual(best, { correct: 3, total: 3 });

  const retry = applyQuizCompletion(loadProgress(), {
    lessonId: 'vypnute-odpojeno-bez-napeti',
    xp: 15,
    badgeId: 'tri-stavy-napeti',
    correct: 2,
    total: 3,
    projectorMode: false,
  });
  assert.equal(retry.xpAwarded, 0);
  assert.equal(retry.lessonBadgeAwarded, false);
  assert.deepEqual(retry.subjectBadgeIdsAwarded, []);
  assert.equal(
    retry.state.earnedBadges.filter((b) => b === 'tri-stavy-napeti').length,
    1,
  );
  assert.equal(
    retry.state.earnedBadges.filter((b) => b === 'merici-elev').length,
    1,
  );
  assert.deepEqual(
    retry.state.lessons['vypnute-odpojeno-bez-napeti']?.bestQuizScore,
    { correct: 3, total: 3 },
  );
});

test('dříve uložený merici-elev se po přidání vypnute-odpojeno-bez-napeti nemaže', () => {
  const allLessons = getMvpLessonsBySubject('mereni', 1);
  assert.equal(allLessons.length, 6);
  const originalIds = [
    'od-vypoctu-k-mereni',
    'voltmetr-zapojeni',
    'ampermetr-zapojeni',
    'mereni-spatne-zapojeni',
    'vyber-rozsahu',
  ];
  const lessonsState: ProgressState['lessons'] = {};
  for (const id of originalIds) {
    lessonsState[id] = {
      activityCompleted: true,
      quizCompleted: true,
      completedAt: '2026-01-01T00:00:00.000Z',
      bestQuizScore: { correct: 3, total: 3 },
    };
  }
  saveProgress({
    totalXp: 175,
    earnedBadges: [
      'merici-detektiv',
      'voltmetr-zvladnut',
      'ampermetr-zvladnut',
      'merak-nespalen',
      'spravny-rozsah',
      'merici-elev',
    ],
    lessons: lessonsState,
    calmMode: false,
  });
  const loaded = loadProgress();
  assert.equal(loaded.earnedBadges.includes('merici-elev'), true);
  assert.equal(isLessonComplete(loaded, 'vypnute-odpojeno-bez-napeti'), false);

  const { completed, total } = getSubjectProgress(
    loaded,
    allLessons.map((l) => l.id),
  );
  assert.equal(completed, 5);
  assert.equal(total, 6);

  const afterNew = completeLessonFully('vypnute-odpojeno-bez-napeti', 'tri-stavy-napeti');
  assert.deepEqual(afterNew.subjectBadgeIdsAwarded, []);
  assert.equal(
    afterNew.state.earnedBadges.filter((b) => b === 'merici-elev').length,
    1,
  );
});

console.log('');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failures.length}`);
console.log('');
console.log(failures.length === 0 ? 'PASS' : 'FAIL');

if (failures.length > 0) {
  process.exit(1);
}
