/**
 * Validace obsahu závěrečné zkoušky.
 *
 * Prázdný registr je PLATNÝ stav (okruhy zatím nebyly dodány).
 * Neplatný published obsah musí být zachytitelný dřív, než se dostane k žákům —
 * validace se spouští před publikací každého obsahového batche
 * (viz docs/FINAL_EXAM_CONTENT_BATCH_CHECKLIST.md).
 */
import type {
  FinalExamTopic,
  FinalExamValidationIssue,
  FinalExamValidationResult,
} from './finalExamTypes';
import { FINAL_EXAM_SCHEMA_VERSION } from './finalExamTypes';
import { subjects } from '../../data/subjects';
import { lessons } from '../../data/lessons';

/** Vzory placeholderů ze šablony — nesmí přežít do reviewed/published obsahu. */
const PLACEHOLDER_PATTERN = /__[A-Z0-9_]+__/;

/** Klíčová slova, při kterých je safetyNote povinná (stejný duch jako u lekcí). */
const RISK_KEYWORDS = [
  'napět',
  'proud',
  'měřen',
  'zapoj',
  'instalac',
  'rozvad',
  'stroj',
  'motor',
  'zařízen',
  'manipul',
  'práce',
  'bezpečn',
];

function isRiskTopic(topic: FinalExamTopic): boolean {
  const haystack = (
    topic.officialTitle +
    ' ' +
    topic.officialText +
    ' ' +
    topic.keyTerms.join(' ')
  ).toLowerCase();
  return RISK_KEYWORDS.some((kw) => haystack.includes(kw));
}

const ALLOWED_STATUSES = new Set(['draft', 'reviewed', 'published', 'archived']);

/**
 * Zvaliduje pole okruhů a vrátí strukturovaný výsledek.
 * Nevyhazuje výjimky a nefunguje destruktivně — jen hlásí.
 */
export function validateFinalExamTopics(
  topics: FinalExamTopic[],
): FinalExamValidationResult {
  const errors: FinalExamValidationIssue[] = [];
  const warnings: FinalExamValidationIssue[] = [];

  const error = (topicId: string, field: string, message: string) =>
    errors.push({ topicId, field, message, severity: 'error' });
  const warning = (topicId: string, field: string, message: string) =>
    warnings.push({ topicId, field, message, severity: 'warning' });

  const subjectIds = new Set(subjects.map((s) => s.id));
  const lessonIds = new Set(lessons.map((l) => l.id));

  const seenIds = new Set<string>();
  const seenOfficialNumbers = new Map<number, string>();

  for (const topic of topics) {
    const tid = topic.id || '(bez id)';
    const requiresContent = topic.status === 'reviewed' || topic.status === 'published';

    // schéma
    if (topic.schemaVersion !== FINAL_EXAM_SCHEMA_VERSION) {
      error(
        tid,
        'schemaVersion',
        `Nepodporovaná verze schématu ${topic.schemaVersion} (podporovaná: ${FINAL_EXAM_SCHEMA_VERSION}).`,
      );
    }

    // id
    if (!topic.id || topic.id.trim().length === 0) {
      error(tid, 'id', 'Id nesmí být prázdné.');
    } else {
      if (seenIds.has(topic.id)) {
        error(tid, 'id', `Duplicitní id "${topic.id}".`);
      }
      seenIds.add(topic.id);
      if (/^\d+$/.test(topic.id)) {
        error(tid, 'id', 'Id nesmí být jen pořadové číslo — použij stabilní slug.');
      }
    }

    // status
    if (!ALLOWED_STATUSES.has(topic.status)) {
      error(tid, 'status', `Nepovolený status "${topic.status}".`);
    }

    // officialNumber
    if (topic.officialNumber !== null) {
      if (!Number.isInteger(topic.officialNumber) || topic.officialNumber <= 0) {
        error(tid, 'officialNumber', 'officialNumber musí být kladné celé číslo, nebo null (záměrně nepřiděleno).');
      } else {
        const existing = seenOfficialNumbers.get(topic.officialNumber);
        if (existing) {
          error(
            tid,
            'officialNumber',
            `Duplicitní officialNumber ${topic.officialNumber} (koliduje s "${existing}"). Pokud je duplicita záměrná, musí být výslovně schválená učitelem a zdůvodněná v teacherNote.`,
          );
        }
        seenOfficialNumbers.set(topic.officialNumber, topic.id);
      }
    } else if (requiresContent) {
      warning(tid, 'officialNumber', 'Okruh nemá přidělené oficiální číslo — ověř, že je to záměr.');
    }

    // oficiální znění
    if (!topic.officialTitle || topic.officialTitle.trim().length === 0) {
      error(tid, 'officialTitle', 'officialTitle nesmí být prázdný.');
    }
    if (!topic.officialText || topic.officialText.trim().length === 0) {
      error(tid, 'officialText', 'officialText nesmí být prázdný.');
    }

    // zdroj
    if (
      !topic.sourceReference ||
      !topic.sourceReference.description?.trim() ||
      !topic.sourceReference.providedBy?.trim()
    ) {
      error(tid, 'sourceReference', 'sourceReference (popis i dodavatel znění) je povinná.');
    }
    if (topic.status === 'published' && !topic.sourceVerified) {
      error(tid, 'sourceVerified', 'Published okruh musí mít sourceVerified = true.');
    }

    // vazby na existující data
    if (topic.subjectIds.length === 0) {
      error(tid, 'subjectIds', 'Okruh musí odkazovat alespoň na jeden předmět.');
    }
    for (const sid of topic.subjectIds) {
      if (!subjectIds.has(sid)) {
        error(tid, 'subjectIds', `Předmět "${sid}" neexistuje v src/data/subjects.ts.`);
      }
    }
    for (const lid of topic.relatedLessonIds) {
      if (!lessonIds.has(lid)) {
        error(tid, 'relatedLessonIds', `Lekce "${lid}" neexistuje v src/data/lessons.ts.`);
      }
    }
    if (requiresContent && topic.relatedLessonIds.length === 0) {
      warning(tid, 'relatedLessonIds', 'Okruh nemá návazné lekce — žák nebude mít kam pokračovat.');
    }

    // výukový obsah u reviewed/published
    if (requiresContent) {
      if (topic.learningGoals.length === 0) {
        error(tid, 'learningGoals', 'Reviewed/published okruh musí mít výukové cíle.');
      }
      if (topic.answerOutline.length === 0) {
        error(tid, 'answerOutline', 'Reviewed/published okruh musí mít osnovu odpovědi.');
      }
    }

    // practice items
    const seenPracticeIds = new Set<string>();
    for (const item of topic.practiceItems) {
      const ref = `practiceItems[${item.id || '?'}]`;
      if (!item.id || seenPracticeIds.has(item.id)) {
        error(tid, ref, 'Procvičovací položka musí mít unikátní neprázdné id.');
      }
      seenPracticeIds.add(item.id);
      if (!item.options.some((o) => o.id === item.correctOptionId)) {
        error(tid, ref, `Správná odpověď "${item.correctOptionId}" není mezi možnostmi.`);
      }
      if (!item.explanation || item.explanation.trim().length === 0) {
        error(tid, ref, 'Vysvětlení odpovědi nesmí být prázdné.');
      }
    }

    // bezpečnost
    if (isRiskTopic(topic) && (!topic.safetyNote || topic.safetyNote.trim().length === 0)) {
      error(
        tid,
        'safetyNote',
        'Okruh se týká elektrického zařízení, měření nebo práce — safetyNote je povinná.',
      );
    }

    // placeholdery
    if (topic.status !== 'draft') {
      const serialized = JSON.stringify(topic);
      if (PLACEHOLDER_PATTERN.test(serialized)) {
        error(tid, '(celý záznam)', 'Reviewed/published obsah nesmí obsahovat placeholder text ze šablony (__NAZEV__).');
      }
    }

    // hygiena
    if (topic.year < 1 || topic.year > 3) {
      error(tid, 'year', 'Ročník musí být 1–3.');
    }
    if (!topic.lastReviewedAt && requiresContent) {
      warning(tid, 'lastReviewedAt', 'Reviewed/published okruh by měl mít datum poslední kontroly.');
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Pomocník pro budoucí zapojení (dev kontrola / npm script):
 * vrátí true a nic nevypíše, když je registr v pořádku; jinak vypíše
 * chyby do konzole a vrátí false. Zatím není nikde volaný — registr je prázdný
 * a feature vypnutá; zapojení popisuje docs/FINAL_EXAM_EXTENSION_STATUS.md.
 */
export function reportFinalExamValidation(topics: FinalExamTopic[]): boolean {
  const result = validateFinalExamTopics(topics);
  for (const issue of result.errors) {
    console.error(
      `[ElektroLab][final-exam] CHYBA ${issue.topicId} / ${issue.field}: ${issue.message}`,
    );
  }
  for (const issue of result.warnings) {
    console.warn(
      `[ElektroLab][final-exam] Varování ${issue.topicId} / ${issue.field}: ${issue.message}`,
    );
  }
  return result.valid;
}
