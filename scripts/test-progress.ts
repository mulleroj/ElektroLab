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
import { getMvpLessonsBySubject } from '../src/data/lessons';
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

test('lekce o výkonu je hned po Ohmově zákonu a před sériovým zapojením', () => {
  const order = getMvpLessonsBySubject('zaklady', 1)
    .filter((l) => l.topicId === 'stejnosmerny-proud')
    .map((l) => l.id);
  const ohm = order.indexOf('ohmuv-zakon');
  const power = order.indexOf('elektricky-vykon-a-energie');
  const series = order.indexOf('seriove-paralelni');
  assert.ok(ohm >= 0 && power >= 0 && series >= 0);
  assert.equal(power, ohm + 1);
  assert.equal(series, power + 1);
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

console.log('');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failures.length}`);
console.log('');
console.log(failures.length === 0 ? 'PASS' : 'FAIL');

if (failures.length > 0) {
  process.exit(1);
}
