/**
 * Validace datové konzistence celého ElektroLabu.
 *
 * Čisté funkce bez vedlejších efektů — pracují nad předanými daty
 * (`validateContentData`), takže jdou použít i pro negativní testy
 * s dočasnými daty v paměti. Skript `scripts/validate-content.ts`
 * volá `validateContentData()` nad skutečnými produkčními daty.
 *
 * Validátor NIKDY nemění obsah — jen hlásí. Nalezené obsahové problémy
 * řeší člověk (učitel), viz docs/CONTENT_VALIDATION.md.
 */
import type {
  Subject,
  Topic,
  MicroLesson,
  Badge,
  LessonActivity,
  InteractiveDemo,
} from '../types';
import { getLessonActivity } from '../types';
import type { FinalExamTopic } from '../features/finalExam/finalExamTypes';
import { validateFinalExamTopics } from '../features/finalExam/finalExamValidation';
import type { SubjectBadgeRule } from '../data/subjectBadges';
import type {
  ContentValidationIssue,
  ContentValidationResult,
} from './contentValidationTypes';
import { assertNever } from '../lib/assertNever';

export interface ContentInput {
  subjects: Subject[];
  topics: Topic[];
  lessons: MicroLesson[];
  badges: Badge[];
  subjectBadges: SubjectBadgeRule[];
  finalExamTopics: FinalExamTopic[];
  /** Migrační aliasy legacy lesson ID → canonical (volitelné). */
  lessonIdAliases?: Record<string, string>;
}

/** Přísný kebab-case (doporučená konvence). */
const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** Znaky bezpečné pro hash routing (mírnější — jen ASCII bez rezervovaných znaků URL). */
const URL_SAFE = /^[a-zA-Z0-9_-]+$/;
/** Nevyplněné placeholdery. */
const PLACEHOLDER = /__[A-Z0-9_]+__|TODO|FIXME|\bXXX\b|Lorem ipsum/;

const MIN_SAFETY_NOTE_LENGTH = 30;

class IssueCollector {
  errors: ContentValidationIssue[] = [];
  warnings: ContentValidationIssue[] = [];

  error(code: string, entityType: string, message: string, entityId?: string, field?: string) {
    this.errors.push({ severity: 'error', code, entityType, entityId, field, message });
  }

  warning(code: string, entityType: string, message: string, entityId?: string, field?: string) {
    this.warnings.push({ severity: 'warning', code, entityType, entityId, field, message });
  }
}

function isBlank(value: unknown): boolean {
  return typeof value !== 'string' || value.trim().length === 0;
}

function hasPlaceholder(value: string): boolean {
  return PLACEHOLDER.test(value);
}

/** Kontrola ID: chyba u URL-nebezpečných, varování u odchylky od kebab-case. */
function checkId(c: IssueCollector, entityType: string, id: string, owner?: string) {
  const entityId = owner ?? id;
  if (isBlank(id)) {
    c.error('ID_EMPTY', entityType, 'ID nesmí být prázdné.', entityId, 'id');
    return;
  }
  if (!URL_SAFE.test(id)) {
    c.error('ID_NOT_URL_SAFE', entityType, `ID "${id}" obsahuje znaky nebezpečné pro hash routing.`, entityId, 'id');
  } else if (!KEBAB_CASE.test(id)) {
    c.warning('ID_NOT_KEBAB_CASE', entityType, `ID "${id}" se odchyluje od konvence kebab-case (funguje, ale doporučujeme sjednotit).`, entityId, 'id');
  }
}

function checkUnique(
  c: IssueCollector,
  code: string,
  entityType: string,
  ids: string[],
  context?: string,
) {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) {
      c.error(code, entityType, `Duplicitní ID "${id}"${context ? ` (${context})` : ''}.`, id);
    }
    seen.add(id);
  }
}

// ---------------------------------------------------------------------------
// Kvíz
// ---------------------------------------------------------------------------

function validateQuiz(c: IssueCollector, lesson: MicroLesson) {
  const questionIds: string[] = [];
  for (const q of lesson.quiz) {
    const where = `otázka ${q.id || '?'}`;
    if (q.id) questionIds.push(q.id);
    if (isBlank(q.text)) {
      c.error('QUIZ_TEXT_EMPTY', 'lesson', `${where}: text otázky je prázdný.`, lesson.id, `quiz.${q.id}.text`);
    }
    if (q.options.length < 2) {
      c.error('QUIZ_TOO_FEW_OPTIONS', 'lesson', `${where}: otázka musí mít alespoň 2 možnosti.`, lesson.id, `quiz.${q.id}.options`);
    }
    const optIds = q.options.map((o) => o.id);
    if (new Set(optIds).size !== optIds.length) {
      c.error('QUIZ_OPTION_ID_DUPLICATE', 'lesson', `${where}: duplicitní ID možností.`, lesson.id, `quiz.${q.id}.options`);
    }
    if (isBlank(q.correctOptionId)) {
      c.error('QUIZ_CORRECT_OPTION_EMPTY', 'lesson', `${where}: correctOptionId je prázdné.`, lesson.id, `quiz.${q.id}.correctOptionId`);
    } else if (!optIds.includes(q.correctOptionId)) {
      c.error('QUIZ_CORRECT_OPTION_MISSING', 'lesson', `${where}: correctOptionId "${q.correctOptionId}" neexistuje mezi možnostmi.`, lesson.id, `quiz.${q.id}.correctOptionId`);
    }
    if (isBlank(q.explanation)) {
      c.error('QUIZ_EXPLANATION_EMPTY', 'lesson', `${where}: vysvětlení je prázdné.`, lesson.id, `quiz.${q.id}.explanation`);
    }
    for (const text of [q.text, q.explanation, ...q.options.map((o) => o.text)]) {
      if (typeof text === 'string' && hasPlaceholder(text)) {
        c.error('QUIZ_PLACEHOLDER', 'lesson', `${where}: obsahuje nevyplněný placeholder.`, lesson.id, `quiz.${q.id}`);
      }
    }
  }
  if (new Set(questionIds).size !== questionIds.length) {
    c.error('QUIZ_QUESTION_ID_DUPLICATE', 'lesson', 'Duplicitní ID otázek v rámci lekce.', lesson.id, 'quiz');
  }
}

// ---------------------------------------------------------------------------
// Aktivity — vyčerpávající přes celý union
// ---------------------------------------------------------------------------

function checkOptionSet(
  c: IssueCollector,
  lessonId: string,
  field: string,
  options: { id: string }[],
  correctOptionId: string,
  minOptions = 2,
) {
  if (options.length < minOptions) {
    c.error('ACTIVITY_TOO_FEW_OPTIONS', 'lesson', `${field}: méně než ${minOptions} možnosti.`, lessonId, field);
  }
  const ids = options.map((o) => o.id);
  if (new Set(ids).size !== ids.length) {
    c.error('ACTIVITY_OPTION_ID_DUPLICATE', 'lesson', `${field}: duplicitní ID možností.`, lessonId, field);
  }
  if (!ids.includes(correctOptionId)) {
    c.error('ACTIVITY_CORRECT_OPTION_MISSING', 'lesson', `${field}: správná odpověď "${correctOptionId}" není mezi možnostmi.`, lessonId, field);
  }
}

function checkPairs(
  c: IssueCollector,
  lessonId: string,
  field: string,
  left: { id: string }[],
  right: { id: string }[],
  correctPairs: Record<string, string>,
) {
  const leftIds = left.map((i) => i.id);
  const rightIds = right.map((i) => i.id);
  checkUnique(c, 'ACTIVITY_ITEM_ID_DUPLICATE', 'lesson', leftIds, `${field}: levé položky lekce ${lessonId}`);
  checkUnique(c, 'ACTIVITY_ITEM_ID_DUPLICATE', 'lesson', rightIds, `${field}: pravé položky lekce ${lessonId}`);

  const usedTargets = new Set<string>();
  for (const [l, r] of Object.entries(correctPairs)) {
    if (!leftIds.includes(l)) {
      c.error('ACTIVITY_PAIR_UNKNOWN_LEFT', 'lesson', `${field}: pár odkazuje na neexistující levou položku "${l}".`, lessonId, field);
    }
    if (!rightIds.includes(r)) {
      c.error('ACTIVITY_PAIR_UNKNOWN_RIGHT', 'lesson', `${field}: pár odkazuje na neexistující pravou položku "${r}".`, lessonId, field);
    }
    if (usedTargets.has(r)) {
      c.error('ACTIVITY_PAIR_DUPLICATE_TARGET', 'lesson', `${field}: pravá položka "${r}" je cílem více párů.`, lessonId, field);
    }
    usedTargets.add(r);
  }
  for (const l of leftIds) {
    if (!(l in correctPairs)) {
      c.error('ACTIVITY_PAIR_MISSING', 'lesson', `${field}: levá položka "${l}" nemá správný pár.`, lessonId, field);
    }
  }
}

function validateActivity(c: IssueCollector, lesson: MicroLesson, activity: LessonActivity) {
  const lid = lesson.id;
  switch (activity.type) {
    case 'circuit-order': {
      const ids = activity.elements.map((e) => e.id);
      checkUnique(c, 'ACTIVITY_ITEM_ID_DUPLICATE', 'lesson', ids, `circuit-order lekce ${lid}`);
      const orderSet = new Set(activity.correctOrder);
      if (orderSet.size !== activity.correctOrder.length) {
        c.error('ORDER_DUPLICATE', 'lesson', 'circuit-order: correctOrder obsahuje duplicity.', lid, 'activity.circuitOrder.correctOrder');
      }
      for (const id of activity.correctOrder) {
        if (!ids.includes(id)) {
          c.error('ORDER_UNKNOWN_ITEM', 'lesson', `circuit-order: correctOrder obsahuje neexistující ID "${id}".`, lid, 'activity.circuitOrder.correctOrder');
        }
      }
      for (const id of ids) {
        if (!orderSet.has(id)) {
          c.error('ORDER_MISSING_ITEM', 'lesson', `circuit-order: položka "${id}" chybí v correctOrder.`, lid, 'activity.circuitOrder.correctOrder');
        }
      }
      if (activity.successMessage !== undefined && isBlank(activity.successMessage)) {
        c.error('ACTIVITY_EMPTY_LABEL', 'lesson', 'circuit-order: zadaná successMessage je prázdná.', lid, 'activity.circuitOrder.successMessage');
      }
      break;
    }
    case 'term-matching': {
      checkPairs(c, lid, 'term-matching', activity.terms, activity.definitions, activity.correctPairs);
      for (const [field, value] of [['leftTitle', activity.leftTitle], ['rightTitle', activity.rightTitle]] as const) {
        if (value !== undefined && isBlank(value)) {
          c.error('ACTIVITY_EMPTY_LABEL', 'lesson', `term-matching: zadaný ${field} je prázdný.`, lid, `activity.termMatching.${field}`);
        }
      }
      break;
    }
    case 'symbol-matching': {
      checkPairs(c, lid, 'symbol-matching', activity.symbols, activity.names, activity.correctPairs);
      for (const s of activity.symbols) {
        if (isBlank(s.ariaLabel)) {
          c.error('ACTIVITY_EMPTY_LABEL', 'lesson', `symbol-matching: značka "${s.id}" nemá ariaLabel.`, lid, 'activity.symbolMatching.symbols');
        }
      }
      break;
    }
    case 'formula-select': {
      checkOptionSet(c, lid, 'formula-select', activity.options, activity.correctOptionId);
      for (const [field, value] of [
        ['example', activity.example],
        ['question', activity.question],
        ['successExplanation', activity.successExplanation],
      ] as const) {
        if (isBlank(value)) {
          c.error('ACTIVITY_TEXT_EMPTY', 'lesson', `formula-select: pole ${field} je prázdné.`, lid, `activity.formulaSelect.${field}`);
        }
      }
      break;
    }
    case 'connection-type': {
      const ids = activity.scenarios.map((s) => s.id);
      checkUnique(c, 'ACTIVITY_SCENARIO_ID_DUPLICATE', 'lesson', ids, `connection-type lekce ${lid}`);
      for (const s of activity.scenarios) {
        if (isBlank(s.description)) {
          c.error('ACTIVITY_TEXT_EMPTY', 'lesson', `connection-type: scénář "${s.id}" má prázdný popis.`, lid, 'activity.connectionType.scenarios');
        }
        if (s.correctType !== 'serial' && s.correctType !== 'parallel') {
          c.error('ACTIVITY_INVALID_VALUE', 'lesson', `connection-type: scénář "${s.id}" má neplatný correctType.`, lid, 'activity.connectionType.scenarios');
        }
      }
      break;
    }
    case 'meter-connection': {
      checkOptionSet(c, lid, 'meter-connection', activity.options, activity.correctOptionId);
      for (const [field, value] of [
        ['meterLabel', activity.meterLabel],
        ['successExplanation', activity.successExplanation],
      ] as const) {
        if (isBlank(value)) {
          c.error('ACTIVITY_TEXT_EMPTY', 'lesson', `meter-connection: pole ${field} je prázdné.`, lid, `activity.meterConnection.${field}`);
        }
      }
      break;
    }
    case 'measurement-judgment': {
      const ids = activity.scenarios.map((s) => s.id);
      checkUnique(c, 'ACTIVITY_SCENARIO_ID_DUPLICATE', 'lesson', ids, `measurement-judgment lekce ${lid}`);
      for (const s of activity.scenarios) {
        if (isBlank(s.text)) {
          c.error('ACTIVITY_TEXT_EMPTY', 'lesson', `measurement-judgment: scénář "${s.id}" má prázdné tvrzení.`, lid, 'activity.measurementJudgment.scenarios');
        }
        if (s.correct !== 'correct' && s.correct !== 'wrong') {
          c.error('ACTIVITY_INVALID_VALUE', 'lesson', `measurement-judgment: scénář "${s.id}" má neplatnou hodnotu correct.`, lid, 'activity.measurementJudgment.scenarios');
        }
        if (isBlank(s.explanation)) {
          c.error('ACTIVITY_EXPLANATION_EMPTY', 'lesson', `measurement-judgment: scénář "${s.id}" nemá vysvětlení.`, lid, 'activity.measurementJudgment.scenarios');
        }
      }
      for (const [field, value] of [
        ['correctLabel', activity.correctLabel],
        ['wrongLabel', activity.wrongLabel],
        ['successMessage', activity.successMessage],
      ] as const) {
        if (value !== undefined && isBlank(value)) {
          c.error('ACTIVITY_EMPTY_LABEL', 'lesson', `measurement-judgment: zadané pole ${field} je prázdné.`, lid, `activity.measurementJudgment.${field}`);
        }
      }
      break;
    }
    case 'scenario-choice': {
      const ids = activity.scenarios.map((s) => s.id);
      checkUnique(c, 'ACTIVITY_SCENARIO_ID_DUPLICATE', 'lesson', ids, `scenario-choice lekce ${lid}`);
      if (isBlank(activity.successMessage)) {
        c.error('ACTIVITY_TEXT_EMPTY', 'lesson', 'scenario-choice: successMessage je prázdná.', lid, 'activity.scenarioChoice.successMessage');
      }
      for (const s of activity.scenarios) {
        const effective = s.options ?? activity.options;
        checkOptionSet(c, lid, `scenario-choice scénář "${s.id}"`, effective, s.correctOptionId);
        if (isBlank(s.text)) {
          c.error('ACTIVITY_TEXT_EMPTY', 'lesson', `scenario-choice: scénář "${s.id}" má prázdný text.`, lid, 'activity.scenarioChoice.scenarios');
        }
        if (isBlank(s.explanation)) {
          c.error('ACTIVITY_EXPLANATION_EMPTY', 'lesson', `scenario-choice: scénář "${s.id}" nemá vysvětlení.`, lid, 'activity.scenarioChoice.scenarios');
        }
      }
      break;
    }
    default:
      // Nový activity.type bez validační větve = chyba už při typecheck.
      assertNever(activity);
  }
}

// ---------------------------------------------------------------------------
// Interaktivní demo — vyčerpávající přes celý union
// ---------------------------------------------------------------------------

function validateDemo(c: IssueCollector, lesson: MicroLesson, demo: InteractiveDemo) {
  if (isBlank(demo.title) || isBlank(demo.description)) {
    c.error('DEMO_TEXT_EMPTY', 'lesson', `Demo "${demo.type}" má prázdný titulek nebo popis.`, lesson.id, 'interactiveDemo');
  }
  switch (demo.type) {
    case 'circuit-switch':
    case 'series-parallel':
    case 'symbols-demo':
    case 'voltmeter-connection':
    case 'ammeter-connection':
    case 'measurement-scenarios':
    case 'protection-device':
    case 'residual-current':
    case 'protection-scenario':
    case 'diode-direction':
    case 'transistor-switch':
    case 'logic-gates':
    case 'sensor-demo':
    case 'regulation-loop':
    case 'feedback-loop':
    case 'automation-logic':
    case 'transformer-demo':
    case 'induction-motor':
    case 'contactor-relay':
    case 'voltage-level-safety':
      // Konfigurace těchto dem je { type, title, description } — ověřeno výše.
      break;
    default:
      // Nový demo typ bez validační větve = chyba už při typecheck.
      assertNever(demo);
  }
}

// ---------------------------------------------------------------------------
// Hlavní validace
// ---------------------------------------------------------------------------

export function validateContentData(input: ContentInput): ContentValidationResult {
  const c = new IssueCollector();
  const { subjects, topics, lessons, badges, subjectBadges, finalExamTopics } = input;

  const subjectIds = new Set(subjects.map((s) => s.id));
  const topicById = new Map(topics.map((t) => [t.id, t]));
  const badgeIds = new Set(badges.map((b) => b.id));

  // Globální ID
  checkUnique(c, 'SUBJECT_ID_DUPLICATE', 'subject', subjects.map((s) => s.id));
  checkUnique(c, 'TOPIC_ID_DUPLICATE', 'topic', topics.map((t) => t.id));
  checkUnique(c, 'LESSON_ID_DUPLICATE', 'lesson', lessons.map((l) => l.id));
  checkUnique(c, 'BADGE_ID_DUPLICATE', 'badge', badges.map((b) => b.id));
  for (const s of subjects) checkId(c, 'subject', s.id);
  for (const t of topics) checkId(c, 'topic', t.id);
  for (const l of lessons) checkId(c, 'lesson', l.id);
  for (const b of badges) checkId(c, 'badge', b.id);

  // Témata
  for (const t of topics) {
    if (!subjectIds.has(t.subjectId)) {
      c.error('TOPIC_UNKNOWN_SUBJECT', 'topic', `Téma odkazuje na neexistující předmět "${t.subjectId}".`, t.id, 'subjectId');
    }
  }

  // Lekce
  let quizQuestions = 0;
  let activities = 0;
  let demos = 0;

  for (const lesson of lessons) {
    if (!subjectIds.has(lesson.subjectId)) {
      c.error('LESSON_UNKNOWN_SUBJECT', 'lesson', `Lekce odkazuje na neexistující předmět "${lesson.subjectId}".`, lesson.id, 'subjectId');
    }
    const topic = topicById.get(lesson.topicId);
    if (!topic) {
      c.error('LESSON_UNKNOWN_TOPIC', 'lesson', `Lekce odkazuje na neexistující téma "${lesson.topicId}".`, lesson.id, 'topicId');
    } else {
      if (topic.subjectId !== lesson.subjectId) {
        c.error('LESSON_TOPIC_SUBJECT_MISMATCH', 'lesson', `Téma "${topic.id}" patří předmětu "${topic.subjectId}", lekce ale předmětu "${lesson.subjectId}".`, lesson.id, 'topicId');
      }
      if (topic.year !== lesson.year) {
        c.error('LESSON_TOPIC_YEAR_MISMATCH', 'lesson', `Lekce má ročník ${lesson.year}, její téma "${topic.id}" ročník ${topic.year}.`, lesson.id, 'year');
      }
      if (lesson.mvpAvailable && !topic.mvpAvailable) {
        c.warning('LESSON_UNDER_LOCKED_TOPIC', 'lesson', `Aktivní lekce je pod zamčeným tématem "${topic.id}" — žák se k ní nedostane.`, lesson.id, 'topicId');
      }
    }
    if (lesson.year < 1 || lesson.year > 3) {
      c.error('LESSON_YEAR_OUT_OF_RANGE', 'lesson', `Ročník ${lesson.year} je mimo rozsah 1–3.`, lesson.id, 'year');
    }
    const subject = subjects.find((s) => s.id === lesson.subjectId);
    if (subject && !subject.years.includes(lesson.year)) {
      c.error('LESSON_YEAR_NOT_IN_SUBJECT', 'lesson', `Ročník ${lesson.year} není mezi ročníky předmětu "${subject.id}" (${subject.years.join(', ')}).`, lesson.id, 'year');
    }

    // safetyNote (pravidla lekcí; final-exam má vlastní pravidla ve svém modulu)
    if (isBlank(lesson.safetyNote)) {
      c.error('SAFETY_NOTE_MISSING', 'lesson', 'Lekce nemá bezpečnostní poznámku (safetyNote).', lesson.id, 'safetyNote');
    } else {
      if (hasPlaceholder(lesson.safetyNote)) {
        c.error('SAFETY_NOTE_PLACEHOLDER', 'lesson', 'safetyNote obsahuje nevyplněný placeholder.', lesson.id, 'safetyNote');
      }
      if (lesson.safetyNote.trim().length < MIN_SAFETY_NOTE_LENGTH) {
        c.warning('SAFETY_NOTE_SHORT', 'lesson', `safetyNote je podezřele krátká (${lesson.safetyNote.trim().length} znaků).`, lesson.id, 'safetyNote');
      }
    }

    // kvíz
    quizQuestions += lesson.quiz.length;
    if (lesson.quiz.length === 0) {
      c.error('QUIZ_MISSING', 'lesson', 'Lekce nemá žádnou otázku mini testu.', lesson.id, 'quiz');
    }
    validateQuiz(c, lesson);

    // aktivita
    const definedActivities = Object.values(lesson.activity).filter(Boolean).length;
    if (definedActivities === 0) {
      c.error('ACTIVITY_MISSING', 'lesson', 'Lekce nemá žádnou interaktivní aktivitu.', lesson.id, 'activity');
    } else if (definedActivities > 1) {
      c.warning('ACTIVITY_MULTIPLE', 'lesson', 'Lekce má definováno více aktivit — použije se jen první.', lesson.id, 'activity');
    }
    const activity = getLessonActivity(lesson);
    if (activity) {
      activities += 1;
      validateActivity(c, lesson, activity);
    }

    // demo (volitelné — model umožňuje lekci bez ukázky)
    if (lesson.interactiveDemo) {
      demos += 1;
      validateDemo(c, lesson, lesson.interactiveDemo);
    }

    // odznak
    if (lesson.badgeId !== undefined) {
      if (!badgeIds.has(lesson.badgeId)) {
        c.error('LESSON_UNKNOWN_BADGE', 'lesson', `Lekce odkazuje na neexistující odznak "${lesson.badgeId}".`, lesson.id, 'badgeId');
      }
    } else if (lesson.mvpAvailable) {
      c.warning('LESSON_NO_BADGE', 'lesson', 'Aktivní lekce nemá odznak.', lesson.id, 'badgeId');
    }
  }

  // Aktivní předmět má aspoň jednu aktivní lekci
  for (const s of subjects) {
    if (!s.mvpAvailable) continue;
    const hasLesson = lessons.some((l) => l.subjectId === s.id && l.mvpAvailable);
    if (!hasLesson) {
      c.error('SUBJECT_NO_ACTIVE_LESSON', 'subject', 'Aktivní předmět nemá žádnou aktivní lekci.', s.id);
    }
  }

  // Odznaky
  for (const b of badges) {
    if (isBlank(b.title) || isBlank(b.description)) {
      c.error('BADGE_TEXT_EMPTY', 'badge', 'Odznak má prázdný titulek nebo popis.', b.id);
    }
  }

  // Předmětové odznaky
  const seenSubjectBadgeSubjects = new Set<string>();
  for (const rule of subjectBadges) {
    const rid = `${rule.subjectId}/${rule.badgeId}`;
    if (!subjectIds.has(rule.subjectId)) {
      c.error('SUBJECT_BADGE_UNKNOWN_SUBJECT', 'subject-badge', `Mapování odkazuje na neexistující předmět "${rule.subjectId}".`, rid, 'subjectId');
    }
    if (!badgeIds.has(rule.badgeId)) {
      c.error('SUBJECT_BADGE_UNKNOWN_BADGE', 'subject-badge', `Mapování odkazuje na neexistující odznak "${rule.badgeId}".`, rid, 'badgeId');
    }
    const key = rule.year === undefined ? rule.subjectId : `${rule.subjectId}#${rule.year}`;
    if (seenSubjectBadgeSubjects.has(key)) {
      c.error('SUBJECT_BADGE_DUPLICATE', 'subject-badge', `Předmět "${rule.subjectId}" má více předmětových odznaků pro stejný rozsah.`, rid);
    }
    seenSubjectBadgeSubjects.add(key);
  }

  // Migrační aliasy lesson ID
  const lessonIdSet = new Set(lessons.map((l) => l.id));
  for (const [legacy, canonical] of Object.entries(input.lessonIdAliases ?? {})) {
    const aid = `${legacy}→${canonical}`;
    if (legacy === canonical) {
      c.error('ALIAS_SELF_REFERENCE', 'lesson-id-alias', 'Legacy ID je stejné jako canonical ID.', aid);
    }
    if (!lessonIdSet.has(canonical)) {
      c.error('ALIAS_UNKNOWN_CANONICAL', 'lesson-id-alias', `Canonical ID "${canonical}" neexistuje mezi lekcemi.`, aid);
    }
    if (lessonIdSet.has(legacy)) {
      c.error('ALIAS_LEGACY_STILL_EXISTS', 'lesson-id-alias', `Legacy ID "${legacy}" stále existuje jako produkční lesson.id.`, aid);
    }
    if ((input.lessonIdAliases ?? {})[canonical] !== undefined) {
      c.error('ALIAS_CHAINED', 'lesson-id-alias', `Canonical ID "${canonical}" je zároveň legacy klíčem jiného aliasu (řetězení/cyklus).`, aid);
    }
  }

  // Final exam (existující pravidla — bez duplikace logiky)
  const finalExamResult = validateFinalExamTopics(finalExamTopics);
  for (const issue of finalExamResult.errors) {
    c.error(`FINAL_EXAM_${issue.field.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`, 'final-exam-topic', issue.message, issue.topicId, issue.field);
  }
  for (const issue of finalExamResult.warnings) {
    c.warning(`FINAL_EXAM_${issue.field.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`, 'final-exam-topic', issue.message, issue.topicId, issue.field);
  }

  return {
    valid: c.errors.length === 0,
    errors: c.errors,
    warnings: c.warnings,
    summary: {
      subjects: subjects.length,
      activeSubjects: subjects.filter((s) => s.mvpAvailable).length,
      topics: topics.length,
      lessons: lessons.length,
      quizQuestions,
      activities,
      demos,
      badges: badges.length,
      finalExamTopics: finalExamTopics.length,
    },
  };
}
