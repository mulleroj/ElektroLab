/**
 * MVP-13B: term-matching — pravý sloupec bez poziční nápovědy.
 */
import assert from 'node:assert/strict';

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
  derangeItems,
  hasNoCorrectRowAlignment,
  orderRightItemsWithoutRowHints,
} from '../src/lib/derangeShuffle.ts';
import { lessons } from '../src/data/lessons.ts';
import { getLessonActivity } from '../src/types.ts';
import {
  applyQuizCompletion,
  completeActivity,
  loadProgress,
  resetProgress,
  saveProgress,
} from '../src/lib/progress.ts';

let passed = 0;
const failures: string[] = [];

function test(name: string, fn: () => void) {
  localStorage.clear();
  try {
    fn();
    passed += 1;
    console.log(`PASS ${name}`);
  } catch (err) {
    failures.push(name);
    console.log(`FAIL ${name}`);
    console.log(err);
  }
}

/** Deterministický RNG z posloupnosti hodnot v [0, 1). */
function sequenceRng(values: number[]): () => number {
  let i = 0;
  return () => {
    const v = values[i % values.length] ?? 0;
    i += 1;
    return v;
  };
}

function termMatchingLessons() {
  return lessons.filter((l) => {
    if (!l.mvpAvailable) return false;
    const a = getLessonActivity(l);
    return a?.type === 'term-matching';
  });
}

console.log('ElektroLab term-matching shuffle tests (MVP-13B)');
console.log('');

test('H13B: seznam aktivních lekcí s term-matching', () => {
  const ids = termMatchingLessons().map((l) => l.id).sort();
  assert.deepEqual(ids, [
    'co-je-snimac',
    'elektricky-naboj-a-volne-elektrony',
    'jednotky-a-prevody',
    'napeti-proud-odpor',
    'vodice-a-izolanty',
  ]);
  assert.equal(ids.length, 5);
});

test('H13B: derange 0 a 1 položky bez pádu', () => {
  assert.deepEqual(derangeItems([], () => 0.5), []);
  assert.deepEqual(derangeItems(['only'], () => 0.5), ['only']);
  const left = [{ id: 'a' }];
  const right = [{ id: 'ra', label: 'A' }];
  const ordered = orderRightItemsWithoutRowHints(left, right, { a: 'ra' }, () => 0.5);
  assert.equal(ordered.length, 1);
  assert.equal(ordered[0].id, 'ra');
});

test('H13B: dvě položky se bezpečně prohodí', () => {
  const left = [{ id: 't1' }, { id: 't2' }];
  const right = [
    { id: 'd1', label: 'def1' },
    { id: 'd2', label: 'def2' },
  ];
  const pairs = { t1: 'd1', t2: 'd2' };
  // Jakýkoli RNG v Sattolu pro n=2 vždy prohodí.
  const ordered = orderRightItemsWithoutRowHints(left, right, pairs, () => 0);
  assert.deepEqual(
    ordered.map((o) => o.id),
    ['d2', 'd1'],
  );
  assert.equal(hasNoCorrectRowAlignment(left, ordered, pairs), true);
});

test('H13B: tři položky — derangement bez pevných bodů', () => {
  const left = [{ id: 't1' }, { id: 't2' }, { id: 't3' }];
  const right = [
    { id: 'd1', label: '1' },
    { id: 'd2', label: '2' },
    { id: 'd3', label: '3' },
  ];
  const pairs = { t1: 'd1', t2: 'd2', t3: 'd3' };
  const ordered = orderRightItemsWithoutRowHints(
    left,
    right,
    pairs,
    sequenceRng([0.9, 0.1, 0.5, 0.2]),
  );
  assert.equal(ordered.length, 3);
  assert.equal(new Set(ordered.map((o) => o.id)).size, 3);
  assert.ok(ordered.every((o) => ['d1', 'd2', 'd3'].includes(o.id)));
  assert.equal(hasNoCorrectRowAlignment(left, ordered, pairs), true);
});

test('H13B: každá pravá položka právě jednou a nic nechybí (produkční lekce)', () => {
  for (const lesson of termMatchingLessons()) {
    const activity = getLessonActivity(lesson) as {
      type: 'term-matching';
      terms: { id: string; label: string }[];
      definitions: { id: string; label: string }[];
      correctPairs: Record<string, string>;
    };
    const ordered = orderRightItemsWithoutRowHints(
      activity.terms,
      activity.definitions,
      activity.correctPairs,
      sequenceRng([0.2, 0.8, 0.1, 0.7, 0.3, 0.9]),
    );
    assert.equal(ordered.length, activity.definitions.length, lesson.id);
    assert.equal(
      new Set(ordered.map((o) => o.id)).size,
      activity.definitions.length,
      lesson.id,
    );
    for (const def of activity.definitions) {
      assert.ok(
        ordered.some((o) => o.id === def.id),
        `${lesson.id} missing ${def.id}`,
      );
    }
    if (activity.terms.length > 1) {
      assert.equal(
        hasNoCorrectRowAlignment(activity.terms, ordered, activity.correctPairs),
        true,
        lesson.id,
      );
    }
  }
});

test('H13B: stejný RNG dává stabilní pořadí (re-render kontrakt)', () => {
  const left = [{ id: 't1' }, { id: 't2' }, { id: 't3' }, { id: 't4' }];
  const right = [
    { id: 'd1', label: '1' },
    { id: 'd2', label: '2' },
    { id: 'd3', label: '3' },
    { id: 'd4', label: '4' },
  ];
  const pairs = { t1: 'd1', t2: 'd2', t3: 'd3', t4: 'd4' };
  const seq = [0.11, 0.42, 0.77, 0.05, 0.91, 0.33];
  const a = orderRightItemsWithoutRowHints(left, right, pairs, sequenceRng(seq));
  const b = orderRightItemsWithoutRowHints(left, right, pairs, sequenceRng(seq));
  assert.deepEqual(
    a.map((x) => x.id),
    b.map((x) => x.id),
  );
});

test('H13B: nový RNG při retry může vytvořit jiné pořadí', () => {
  const left = [{ id: 't1' }, { id: 't2' }, { id: 't3' }, { id: 't4' }];
  const right = [
    { id: 'd1', label: '1' },
    { id: 'd2', label: '2' },
    { id: 'd3', label: '3' },
    { id: 'd4', label: '4' },
  ];
  const pairs = { t1: 'd1', t2: 'd2', t3: 'd3', t4: 'd4' };
  const first = orderRightItemsWithoutRowHints(
    left,
    right,
    pairs,
    sequenceRng([0.1, 0.2, 0.3, 0.4]),
  );
  const second = orderRightItemsWithoutRowHints(
    left,
    right,
    pairs,
    sequenceRng([0.9, 0.8, 0.7, 0.6]),
  );
  // Oba derangementy; pořadí se typicky liší (ověřeno na těchto seedách).
  assert.equal(hasNoCorrectRowAlignment(left, first, pairs), true);
  assert.equal(hasNoCorrectRowAlignment(left, second, pairs), true);
  assert.notDeepEqual(
    first.map((x) => x.id),
    second.map((x) => x.id),
  );
});

test('H13B: správnost podle ID nezávisí na indexu po promíchání', () => {
  const lesson = termMatchingLessons().find((l) => l.id === 'vodice-a-izolanty');
  assert.ok(lesson);
  const activity = getLessonActivity(lesson) as {
    terms: { id: string }[];
    definitions: { id: string }[];
    correctPairs: Record<string, string>;
  };
  const ordered = orderRightItemsWithoutRowHints(
    activity.terms,
    activity.definitions,
    activity.correctPairs,
    sequenceRng([0.55, 0.12, 0.88, 0.33]),
  );
  for (let i = 0; i < activity.terms.length; i += 1) {
    const leftId = activity.terms[i].id;
    const expected = activity.correctPairs[leftId];
    // Po promíchání item na stejném řádku NESMÍ být správná odpověď (n>1).
    if (activity.terms.length > 1) {
      assert.notEqual(ordered[i].id, expected);
    }
    // Správná odpověď je stále dohledatelná podle ID kdekoli ve sloupci.
    assert.ok(ordered.some((o) => o.id === expected));
  }
});

test('H13B: wrong→right a completion kontrakt párování podle ID', () => {
  const pairs: Record<string, string> = { a: 'ra', b: 'rb', c: 'rc' };
  const left = ['a', 'b', 'c'];
  // Simulace: uživatel kliká podle ID, ne podle řádku.
  const matched: Record<string, string> = {};
  // wrong
  assert.notEqual(pairs.a, 'rb');
  // right
  matched.a = pairs.a;
  matched.b = pairs.b;
  matched.c = pairs.c;
  assert.equal(Object.keys(matched).length, left.length);
  assert.equal(matched.a, 'ra');
});

test('H13B: XP jednou a retry bez dalšího XP (vodice-a-izolanty)', () => {
  saveProgress(resetProgress(loadProgress()));
  const lesson = lessons.find((l) => l.id === 'vodice-a-izolanty');
  assert.ok(lesson);
  let state = loadProgress();
  state = completeActivity(state, lesson.id, lesson.activityXp);
  assert.equal(state.totalXp, lesson.activityXp);
  state = completeActivity(state, lesson.id, lesson.activityXp);
  assert.equal(state.totalXp, lesson.activityXp);

  const quiz = applyQuizCompletion(state, {
    lessonId: lesson.id,
    xp: lesson.quizXp,
    badgeId: lesson.badgeId,
    correct: 3,
    total: 3,
    projectorMode: false,
  });
  assert.equal(quiz.xpAwarded, lesson.quizXp);
  const xpAfter = quiz.state.totalXp;
  const retry = applyQuizCompletion(quiz.state, {
    lessonId: lesson.id,
    xp: lesson.quizXp,
    badgeId: lesson.badgeId,
    correct: 3,
    total: 3,
    projectorMode: false,
  });
  assert.equal(retry.xpAwarded, 0);
  assert.equal(retry.state.totalXp, xpAfter);
});

test('H13B: projektor bez persistence XP', () => {
  saveProgress(resetProgress(loadProgress()));
  const lesson = lessons.find((l) => l.id === 'vodice-a-izolanty');
  assert.ok(lesson);
  const empty = loadProgress();
  const projector = applyQuizCompletion(empty, {
    lessonId: lesson.id,
    xp: lesson.quizXp,
    badgeId: lesson.badgeId,
    correct: 3,
    total: 3,
    projectorMode: true,
  });
  assert.equal(projector.xpAwarded, 0);
  assert.equal(projector.state.totalXp, 0);
  assert.equal(Object.keys(projector.state.lessons).length, 0);
});

test('H13B: více běhů Math.random — vždy derangement pro n>1', () => {
  const left = [{ id: 't1' }, { id: 't2' }, { id: 't3' }, { id: 't4' }, { id: 't5' }];
  const right = left.map((l) => ({ id: `d-${l.id}`, label: l.id }));
  const pairs = Object.fromEntries(left.map((l) => [l.id, `d-${l.id}`]));
  for (let i = 0; i < 40; i += 1) {
    const ordered = orderRightItemsWithoutRowHints(left, right, pairs);
    assert.equal(hasNoCorrectRowAlignment(left, ordered, pairs), true);
    assert.equal(new Set(ordered.map((o) => o.id)).size, 5);
  }
});

console.log('');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failures.length}`);
console.log('');
console.log(failures.length === 0 ? 'PASS' : 'FAIL');

if (failures.length > 0) {
  process.exit(1);
}
