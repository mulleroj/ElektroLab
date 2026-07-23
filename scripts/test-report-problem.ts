/**
 * MVP-13C: anonymní hlášení problémů (Netlify Forms).
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
  allReportFieldNames,
  buildReportContext,
  buildReportPayload,
  EMPTY_MANUAL_VALUES,
  getSafeAppVersion,
  REPORT_FORM_NAME,
  REPORT_HONEYPOT_NAME,
  REPORT_REQUIRED_MANUAL_FIELDS,
  submitReportToNetlify,
  validateManualValues,
} from '../src/lib/reportProblem.ts';
import { buildRouteReportContext } from '../src/lib/reportRouteContext.ts';
import { loadProgress, saveProgress, completeActivity } from '../src/lib/progress.ts';
import { getTrapFocusIndex } from '../src/lib/focus.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

let passed = 0;
const failures: string[] = [];

function test(name: string, fn: () => void | Promise<void>) {
  const run = async () => {
    localStorage.clear();
    try {
      await fn();
      passed += 1;
      console.log(`PASS ${name}`);
    } catch (err) {
      failures.push(name);
      console.log(`FAIL ${name}`);
      console.log(err);
    }
  };
  return run();
}

console.log('ElektroLab report-problem tests (MVP-13C)');
console.log('');

await test('H13C: form name je elektrolab-pilot-feedback', () => {
  assert.equal(REPORT_FORM_NAME, 'elektrolab-pilot-feedback');
});

await test('H13C: honeypot bot-field je v seznamu polí', () => {
  assert.equal(REPORT_HONEYPOT_NAME, 'bot-field');
  assert.ok(allReportFieldNames().includes('bot-field'));
});

await test('H13C: skrytý HTML form obsahuje všechna stejná pole', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /name=["']elektrolab-pilot-feedback["']/);
  assert.match(html, /data-netlify=["']true["']/);
  assert.match(html, /data-netlify-honeypot=["']bot-field["']/);
  for (const name of allReportFieldNames()) {
    if (name === 'form-name') {
      assert.match(html, /name=["']form-name["']/);
      continue;
    }
    assert.match(
      html,
      new RegExp(`name=["']${name}["']`),
      `chybí pole ${name} ve skrytém HTML formuláři`,
    );
  }
  assert.doesNotMatch(html, /mullerova@stsul\.cz/);
  assert.doesNotMatch(html, /type=["']file["']/);
});

await test('H13C: produkční build detekuje Netlify form', () => {
  const distIndex = path.join(root, 'dist', 'index.html');
  assert.ok(fs.existsSync(distIndex), 'dist/index.html musí existovat po npm run build');
  const html = fs.readFileSync(distIndex, 'utf8');
  assert.match(html, /name=["']elektrolab-pilot-feedback["']/);
  assert.match(html, /data-netlify=["']true["']/);
  for (const name of allReportFieldNames()) {
    if (name === 'form-name') continue;
    assert.match(html, new RegExp(`name=["']${name}["']`), `dist chybí ${name}`);
  }
});

await test('H13C: povinná pole — prázdný formulář se neodesílá', () => {
  const missing = validateManualValues({ ...EMPTY_MANUAL_VALUES });
  assert.deepEqual(missing, [...REPORT_REQUIRED_MANUAL_FIELDS]);
});

await test('H13C: validní ruční hodnoty projdou validací', () => {
  const values = {
    ...EMPTY_MANUAL_VALUES,
    testerRole: 'zak',
    category: 'aktivita',
    location: 'aktivita',
    steps: '1. otevři lekci',
    actualResult: 'chyba',
    expectedResult: 'ok',
    reproducibility: 'vzdy',
    impact: 'blokuje',
    progressImpact: 'ne',
    optionalNote: '',
  };
  assert.deepEqual(validateManualValues(values), []);
});

await test('H13C: kontext Home / subject / lesson', () => {
  const home = buildRouteReportContext({ page: 'home' }, loadProgress());
  assert.equal(home.page, 'home');
  assert.equal(home.lessonId, undefined);

  const subject = buildRouteReportContext(
    { page: 'subject', subjectId: 'zaklady' },
    loadProgress(),
  );
  assert.equal(subject.page, 'subject');
  assert.equal(subject.subjectId, 'zaklady');
  assert.ok((subject.subjectTitle ?? '').length > 0);

  let progress = loadProgress();
  progress = completeActivity(progress, 'vodice-a-izolanty', 20);
  saveProgress(progress);
  const lesson = buildRouteReportContext(
    { page: 'lesson', lessonId: 'vodice-a-izolanty' },
    progress,
  );
  assert.equal(lesson.page, 'lesson');
  assert.equal(lesson.lessonId, 'vodice-a-izolanty');
  assert.equal(lesson.activityCompleted, true);
  assert.equal(lesson.quizCompleted, false);
  assert.ok((lesson.lessonTitle ?? '').includes('Vodiče'));
});

await test('H13C: buildReportContext neobsahuje progress dump ani e-mail příjemce', () => {
  const ctx = buildReportContext({
    route: {
      page: 'lesson',
      lessonId: 'vodice-a-izolanty',
      lessonTitle: 'Vodiče a izolanty',
      subjectId: 'zaklady',
      subjectTitle: 'Základy',
      activityCompleted: false,
      quizCompleted: false,
    },
    projectorMode: false,
    calmMode: true,
    appVersion: 'abc1234',
    now: () => new Date('2026-07-23T10:00:00.000Z'),
    randomId: () => 'el-test-id',
    location: { href: 'https://elektro-lab.netlify.app/#/lesson/vodice-a-izolanty', hash: '#/lesson/vodice-a-izolanty' },
    navigator: { userAgent: 'TestAgent' },
    viewport: { width: 375, height: 667 },
  });
  assert.equal(ctx.reportId, 'el-test-id');
  assert.equal(ctx.timestamp, '2026-07-23T10:00:00.000Z');
  assert.equal(ctx.currentSection, 'lesson');
  assert.equal(ctx.mode, 'normal');
  assert.equal(ctx.calmMode, 'true');
  assert.equal(ctx.viewport, '375x667');
  assert.equal(ctx.appVersion, 'abc1234');
  const blob = JSON.stringify(ctx);
  assert.doesNotMatch(blob, /mullerova@stsul\.cz/);
  assert.doesNotMatch(blob, /totalXp/);
  assert.doesNotMatch(blob, /earnedBadges/);
  assert.doesNotMatch(blob, /elektrolab-progress/);
});

await test('H13C: payload obsahuje form-name a honeypot', () => {
  const ctx = buildReportContext({
    route: { page: 'home' },
    projectorMode: true,
    calmMode: false,
    appVersion: null,
    randomId: () => 'id-1',
    now: () => new Date('2026-01-01T00:00:00.000Z'),
    location: { href: 'http://localhost/', hash: '' },
    navigator: { userAgent: 'ua' },
    viewport: { width: 800, height: 600 },
  });
  assert.equal(ctx.mode, 'projector');
  assert.equal(ctx.appVersion, '');
  const payload = buildReportPayload({
    context: ctx,
    manual: {
      ...EMPTY_MANUAL_VALUES,
      testerRole: 'ucitel',
      category: 'jine',
      location: 'home',
      steps: 'x',
      actualResult: 'y',
      expectedResult: 'z',
      reproducibility: 'jednou',
      impact: 'drobnost',
      progressImpact: 'nevim',
    },
    honeypot: '',
  });
  assert.equal(payload['form-name'], REPORT_FORM_NAME);
  assert.equal(payload[REPORT_HONEYPOT_NAME], '');
  assert.equal(payload.testerRole, 'ucitel');
});

await test('H13C: submit success a error', async () => {
  const ok = await submitReportToNetlify(
    { 'form-name': REPORT_FORM_NAME },
    async () => new Response('', { status: 200 }) as Response,
  );
  assert.equal(ok.ok, true);

  const fail = await submitReportToNetlify(
    { 'form-name': REPORT_FORM_NAME },
    async () => new Response('nope', { status: 500 }) as Response,
  );
  assert.equal(fail.ok, false);
  if (!fail.ok) assert.match(fail.message, /HTTP 500/);

  const net = await submitReportToNetlify(
    { 'form-name': REPORT_FORM_NAME },
    async () => {
      throw new Error('offline');
    },
  );
  assert.equal(net.ok, false);
});

await test('H13C: dvojí odeslání — druhý fetch se nespustí při zámku (sim)', async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    await new Promise((r) => setTimeout(r, 20));
    return new Response('', { status: 200 }) as Response;
  };
  // Simulace kontraktu submittingRef: druhé volání se neprovádí, dokud první běží.
  let submitting = false;
  const guarded = async () => {
    if (submitting) return { ok: false as const, message: 'busy' };
    submitting = true;
    const result = await submitReportToNetlify({ 'form-name': REPORT_FORM_NAME }, fetchImpl);
    submitting = false;
    return result;
  };
  const p1 = guarded();
  const p2 = guarded();
  const [r1, r2] = await Promise.all([p1, p2]);
  assert.equal(r1.ok, true);
  assert.equal(r2.ok, false);
  assert.equal(calls, 1);
});

await test('H13C: odeslání nemění progress ani localStorage', async () => {
  let state = loadProgress();
  state = completeActivity(state, 'vodice-a-izolanty', 20);
  saveProgress(state);
  const before = localStorage.getItem('elektrolab-progress');
  await submitReportToNetlify(
    buildReportPayload({
      context: buildReportContext({
        route: { page: 'home' },
        projectorMode: false,
        calmMode: false,
        randomId: () => 'x',
        now: () => new Date('2026-01-01T00:00:00.000Z'),
        location: { href: 'http://x/', hash: '' },
        navigator: { userAgent: 'ua' },
        viewport: { width: 1, height: 1 },
      }),
      manual: {
        ...EMPTY_MANUAL_VALUES,
        testerRole: 'zak',
        category: 'obsah',
        location: 'x',
        steps: 'x',
        actualResult: 'x',
        expectedResult: 'x',
        reproducibility: 'vzdy',
        impact: 'zmatek',
        progressImpact: 'ne',
      },
    }),
    async () => new Response('', { status: 200 }) as Response,
  );
  assert.equal(localStorage.getItem('elektrolab-progress'), before);
  assert.equal(loadProgress().totalXp, 20);
});

await test('H13C: getSafeAppVersion jen při neprázdné hodnotě', () => {
  assert.equal(getSafeAppVersion({}), null);
  assert.equal(getSafeAppVersion({ VITE_COMMIT_REF: '  ' }), null);
  assert.equal(getSafeAppVersion({ VITE_COMMIT_REF: '3ccd0f3' }), '3ccd0f3');
});

await test('H13C: Escape/Tab trap kontrakt zůstává platný (focus helper)', () => {
  // Dialog používá stejný getTrapFocusIndex jako ostatní modaly.
  assert.equal(getTrapFocusIndex(0, 4, false), 1);
  assert.equal(getTrapFocusIndex(0, 4, true), 3);
});

await test('H13C: React dialog obsahuje honeypot a success text', () => {
  const dialog = fs.readFileSync(
    path.join(root, 'src/components/ReportProblemDialog.tsx'),
    'utf8',
  );
  assert.match(dialog, /bot-field|REPORT_HONEYPOT_NAME/);
  assert.match(
    dialog,
    /Děkujeme, hlášení bylo odesláno\. Můžeš pokračovat v lekci\./,
  );
  assert.match(dialog, /Nahlásit problém/);
  assert.doesNotMatch(dialog, /mullerova@stsul\.cz/);
  assert.doesNotMatch(dialog, /type=["']file["']/);
});

await test('H13C: AppShell skrývá tlačítko v projektoru', () => {
  const shell = fs.readFileSync(path.join(root, 'src/components/AppShell.tsx'), 'utf8');
  assert.match(shell, /!projectorMode &&/);
  assert.match(shell, /Nahlásit problém/);
});

console.log('');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failures.length}`);
console.log('');
console.log(failures.length === 0 ? 'PASS' : 'FAIL');

if (failures.length > 0) process.exit(1);
