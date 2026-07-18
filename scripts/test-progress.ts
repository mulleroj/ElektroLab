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

console.log('ElektroLab progress tests (MVP-12A)');
console.log('');

test('uloží skóre 2/3 do trvalého pokroku', () => {
  const next = finishQuiz(2, 3);
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
  const next = finishQuiz(3, 3);
  assert.deepEqual(getLessonProgress(next, LESSON_ID).bestQuizScore, {
    correct: 3,
    total: 3,
  });
});

test('horší opakovaný výsledek nepřepíše lepší', () => {
  finishQuiz(3, 3);
  const next = finishQuiz(1, 3);
  assert.deepEqual(getLessonProgress(next, LESSON_ID).bestQuizScore, {
    correct: 3,
    total: 3,
  });
});

test('lepší opakovaný výsledek přepíše horší', () => {
  finishQuiz(1, 3);
  const next = finishQuiz(3, 3);
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
  const next = applyQuizCompletion(prev, {
    lessonId: LESSON_ID,
    xp: 10,
    badgeId: 'testovaci-odznak',
    correct: 3,
    total: 3,
    projectorMode: true,
  });
  assert.equal(next, prev);
  assert.equal(localStorage.getItem(PROGRESS_KEY), null);
});

test('opakování quizu nepřidělí podruhé XP ani odznak', () => {
  finishQuiz(2, 3);
  const next = finishQuiz(3, 3);
  assert.equal(next.totalXp, 10);
  assert.deepEqual(next.earnedBadges, ['testovaci-odznak']);
});

test('reset odstraní XP, dokončení, skóre i odznaky', () => {
  let state = completeActivity(loadProgress(), LESSON_ID, 5);
  state = finishQuiz(2, 3);
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

console.log('');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failures.length}`);
console.log('');
console.log(failures.length === 0 ? 'PASS' : 'FAIL');

if (failures.length > 0) {
  process.exit(1);
}
