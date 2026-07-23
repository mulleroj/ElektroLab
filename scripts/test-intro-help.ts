/**
 * CLI: npm run test
 *
 * MVP-13D: rozšířený Úvod (onboarding) — obsahové a kontraktové kontroly
 * bez DOM. Čte zdrojové soubory a ověřuje, že text odpovídá skutečným
 * kontraktům aplikace (pokrok, projektor, klidný režim, TeacherPage).
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
  LAST_LESSON_KEY,
} from '../src/lib/progress.ts';
import { getTrapFocusIndex } from '../src/lib/focus.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function read(rel: string): string {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

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

const onboarding = read('src/components/Onboarding.tsx');
const app = read('src/App.tsx');
const appShell = read('src/components/AppShell.tsx');
const home = read('src/components/HomePage.tsx');
const teacher = read('src/components/TeacherPage.tsx');
const reportDialog = read('src/components/ReportProblemDialog.tsx');
const progressLib = read('src/lib/progress.ts');
const css = read('src/index.css');

console.log('ElektroLab intro-help tests (MVP-13D)');
console.log('');

test('H13D: ElektroLab je představen jako interaktivní mikrolekce / simulace', () => {
  assert.match(onboarding, /Co je ElektroLab\?/);
  assert.match(onboarding, /Interaktivní mikrolekce/);
  assert.match(onboarding, /simulaci/);
});

test('H13D: bezpečnost — školní simulace, ne návod na skutečné zařízení', () => {
  assert.match(onboarding, /Je to školní simulace/);
  assert.match(onboarding, /není návod k práci na\s+skutečném elektrickém zařízení/);
  assert.match(onboarding, /nenahrazuje učitele/);
  assert.match(onboarding, /bezpečnostní pravidla/);
});

test('H13D: žádné tvrzení „bez internetu“ / offline v onboardingu', () => {
  assert.doesNotMatch(onboarding, /bez internetu/i);
  assert.doesNotMatch(onboarding, /Bez účtů a bez\s+internetu/);
  assert.doesNotMatch(onboarding, /offline/i);
});

test('H13D: bez účtu — pokrok jen v tomto zařízení a prohlížeči', () => {
  assert.match(onboarding, /Nepotřebuješ\s+účet/);
  assert.match(onboarding, /Pokrok se ukládá jen v tomto prohlížeči/);
  assert.match(onboarding, /pouze v tomto zařízení a prohlížeči/);
});

test('H13D: pokrok se nepřenáší mezi zařízeními / prohlížeči', () => {
  assert.match(
    onboarding,
    /jiného zařízení nebo prohlížeče se nepřenese/,
  );
  assert.match(onboarding, /smazání dat prohlížeče/);
});

test('H13D: průběh lekce — vysvětlení, aktivita/ukázka, mini test', () => {
  assert.match(onboarding, /Jak probíhá lekce/);
  assert.match(onboarding, /Krátké vysvětlení/);
  assert.match(onboarding, /interaktivní ukázka/);
  assert.match(onboarding, /ne každá lekce má\s+ukázku/);
  assert.match(onboarding, /Mini test/);
});

test('H13D: XP za první dokončení aktivity a testu; odznaky; retry bez znovuudělení XP', () => {
  assert.match(onboarding, /XP získáš za první dokončení aktivity a mini testu/);
  assert.match(onboarding, /odznaky/);
  assert.match(onboarding, /stejné XP se znovu neudělí/);
});

test('H13D: Pokračovat = naposledy otevřená lekce (Home kontrakt)', () => {
  assert.match(onboarding, /Pokračovat:/);
  assert.match(onboarding, /naposledy otevřené lekci/);
  assert.match(home, /Naposledy otevřená lekce/);
  assert.match(home, /Pokračovat v lekci/);
  assert.match(home, /LAST_LESSON_KEY/);
  assert.match(app, /LAST_LESSON_KEY/);
});

test('H13D: Klidný režim omezí pohyb, nemění obsah/XP/pokrok', () => {
  assert.match(onboarding, /Klidný režim:/);
  assert.match(onboarding, /omezí pohyb, animace/);
  assert.match(onboarding, /Obsah, otázky, XP ani pokrok se nemění/);
  assert.match(onboarding, /kurikulum se nezjednodušuje/);
});

test('H13D: Projektor neukládá XP, odznaky ani pokrok', () => {
  assert.match(onboarding, /Projektor:/);
  assert.match(onboarding, /XP, odznaky ani pokrok se\s+neukládají/);
  assert.match(app, /V projektorovém režimu učitel promítá — pokrok a XP se neukládají/);
  assert.match(appShell, /pokrok a XP se neukládají/);
});

test('H13D: Pro učitele — jen skutečné funkce TeacherPage', () => {
  assert.match(onboarding, /Pro učitele/);
  assert.match(onboarding, /Dnes do hodiny/);
  assert.match(onboarding, /projektor/);
  assert.match(onboarding, /zkopírovat přehled lekcí/);
  assert.match(onboarding, /Reset pokroku maže jen data v tomto zařízení/);
  assert.match(onboarding, /nepotřebují účet ani školní e-mail/);
  assert.match(teacher, /Dnes do hodiny/);
  assert.match(teacher, /Zkopírovat přehled lekcí/);
  assert.match(teacher, /onOpenLessonOnProjector/);
  assert.match(teacher, /neukládá pokrok\s+ani XP/);
});

test('H13D: Nahlásit problém — anonymní, bez jména/e-mailu/třídy, bez školního e-mailu příjemce', () => {
  assert.match(onboarding, /Nahlásit problém:/);
  assert.match(onboarding, /anonymní hlášení/);
  assert.match(onboarding, /Nevyplňuj jméno, e-mail ani třídu/);
  assert.match(onboarding, /není školní e-mail\s+příjemce/);
  assert.match(reportDialog, /Anonymní hlášení/);
  assert.match(reportDialog, /Nevyplňuj jméno, e-mail ani třídu/);
  assert.doesNotMatch(reportDialog, /@.*\.(cz|com).*příjemce/i);
  assert.doesNotMatch(onboarding, /mailto:/i);
});

test('H13D: otevření/zavření onboardingu nemění progress schéma ani XP logiku', () => {
  assert.doesNotMatch(onboarding, /from ['"]\.\.\/lib\/progress/);
  assert.doesNotMatch(onboarding, /completeActivity|applyQuizCompletion|saveProgress|resetProgress/);
  assert.match(app, /localStorage\.setItem\(ONBOARDING_KEY, '1'\)/);
  assert.doesNotMatch(
    app.slice(app.indexOf('handleOnboardingClose'), app.indexOf('handleCalmModeToggle')),
    /setProgress|completeActivity|applyQuizCompletion|resetProgress/,
  );

  // Runtime: zavření příznaku onboardingu neovlivní uložený pokrok.
  const before = completeActivity(loadProgress(), 'co-je-obvod', 10);
  saveProgress(before);
  localStorage.setItem('elektrolab-onboarding-seen', '1');
  const after = loadProgress();
  assert.equal(after.totalXp, before.totalXp);
  assert.deepEqual(after.lessons, before.lessons);
  assert.deepEqual(after.earnedBadges, before.earnedBadges);
});

test('H13D: stejný first-run klíč elektrolab-onboarding-seen', () => {
  assert.match(app, /const ONBOARDING_KEY = 'elektrolab-onboarding-seen'/);
  assert.match(app, /loadOnboardingSeen/);
  assert.match(app, /!loadOnboardingSeen\(\)/);
});

test('H13D: manuální Úvod — closeLabel Zpět do aplikace; first-run Rozumím, jdeme na to', () => {
  assert.match(onboarding, /closeLabel/);
  assert.match(onboarding, /Rozumím, jdeme na to/);
  assert.match(app, /Zpět do aplikace/);
  assert.match(app, /setOnboardingCloseLabel\('Zpět do aplikace'\)/);
  assert.match(appShell, /ℹ️ Úvod/);
  assert.match(appShell, /onOpenOnboarding/);
});

test('H13D: a11y — dialog, aria-modal, title, Escape/focus hook, nadpisy, seznamy', () => {
  assert.match(onboarding, /role="dialog"/);
  assert.match(onboarding, /aria-modal="true"/);
  assert.match(onboarding, /aria-labelledby="onboarding-title"/);
  assert.match(onboarding, /id="onboarding-title"/);
  assert.match(onboarding, /useModalFocusManagement/);
  assert.match(onboarding, /onEscape: onClose/);
  assert.match(onboarding, /<h2 id="onboarding-title">/);
  assert.match(onboarding, /<h3 id="onboarding-lesson-flow">/);
  assert.match(onboarding, /<h3 id="onboarding-ui-elements">/);
  assert.match(onboarding, /<h3 id="onboarding-teachers">/);
  assert.match(onboarding, /<ol className="onboarding__list">/);
  assert.match(onboarding, /<ul className="onboarding__points">/);
  assert.match(css, /\.onboarding\s*\{[\s\S]*overflow-y:\s*auto/);
  assert.match(css, /\.onboarding__section/);
});

test('H13D: XP se neudělí znovu při opakování (kontrakt progress)', () => {
  let state = completeActivity(loadProgress(), 'co-je-obvod', 10);
  assert.equal(state.totalXp, 10);
  state = completeActivity(state, 'co-je-obvod', 10);
  assert.equal(state.totalXp, 10);
  const quiz1 = applyQuizCompletion(state, {
    lessonId: 'co-je-obvod',
    xp: 15,
    correct: 3,
    total: 3,
    projectorMode: false,
  });
  assert.equal(quiz1.xpAwarded, 15);
  const quiz2 = applyQuizCompletion(quiz1.state, {
    lessonId: 'co-je-obvod',
    xp: 15,
    correct: 3,
    total: 3,
    projectorMode: false,
  });
  assert.equal(quiz2.xpAwarded, 0);
  assert.equal(quiz2.state.totalXp, quiz1.state.totalXp);
});

test('H13D: projektorový režim v applyQuizCompletion neukládá XP', () => {
  const result = applyQuizCompletion(loadProgress(), {
    lessonId: 'co-je-obvod',
    xp: 15,
    correct: 2,
    total: 3,
    projectorMode: true,
  });
  assert.equal(result.xpAwarded, 0);
  assert.equal(result.state.totalXp, 0);
});

test('H13D: focus trap helper stále funguje (Escape/Tab kontrakt)', () => {
  assert.equal(getTrapFocusIndex(0, 2, false), 1);
  assert.equal(getTrapFocusIndex(0, 2, true), 1);
  assert.equal(getTrapFocusIndex(-1, 3, false), 0);
});

test('H13D: progress klíč a LAST_LESSON_KEY beze změny', () => {
  assert.match(progressLib, /elektrolab-progress/);
  assert.equal(LAST_LESSON_KEY, 'elektrolab-last-lesson');
  assert.match(progressLib, /calmMode/);
  assert.match(progressLib, /earnedBadges/);
});

console.log('');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failures.length}`);
console.log('');
console.log(failures.length === 0 ? 'PASS' : 'FAIL');

if (failures.length > 0) {
  process.exit(1);
}
