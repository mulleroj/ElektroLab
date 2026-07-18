/**
 * Migrace historických lesson ID na canonical tvar.
 *
 * Jediný zdroj pravdy pro aliasy starých ID. Aliasy drží zpětnou
 * kompatibilitu starých hash odkazů a uloženého pokroku — NESMÍ se
 * odstranit bez vědomého rozhodnutí o ukončení zpětné kompatibility
 * (viz docs/CONTENT_VALIDATION.md).
 */
import type { ProgressState, LessonProgress, QuizScore } from '../types';
import { isValidQuizScore, isBetterQuizScore } from './quizScore';

export const LEGACY_LESSON_ID_ALIASES: Record<string, string> = {
  // MVP-10B: jediné historické ID vybočující z kebab-case konvence
  'zakladni-znacKy': 'zakladni-znacky',
};

/** Převede případné legacy ID na canonical; ostatní ID vrací beze změny. */
export function migrateLessonId(id: string): string {
  return LEGACY_LESSON_ID_ALIASES[id] ?? id;
}

/**
 * Čistá migrace referencí na lekce uvnitř pokroku.
 * XP a odznaky se nemění (nejsou indexované lesson ID).
 * Vrací `changed: false`, když nebylo co migrovat — volající pak neukládá.
 * Idempotentní: po první migraci už žádné legacy klíče neexistují.
 *
 * completedAt: canonical záznam má přednost; jinak legacy. Nezávislé na
 * pořadí klíčů v načteném objektu.
 *
 * bestQuizScore: při sloučení legacy a canonical záznamu vyhrává lepší
 * skóre; neplatná (poškozená) skóre se při migraci zahazují.
 */
export function migrateProgressLessonReferences(state: ProgressState): {
  state: ProgressState;
  changed: boolean;
} {
  let changed = false;
  const lessons: Record<
    string,
    Pick<LessonProgress, 'activityCompleted' | 'quizCompleted' | 'bestQuizScore'>
  > = {};
  const canonicalCompletedAt: Record<string, string> = {};
  const legacyCompletedAt: Record<string, string> = {};

  for (const [id, progress] of Object.entries(state.lessons)) {
    const canonicalId = migrateLessonId(id);
    if (canonicalId !== id) changed = true;

    const existing = lessons[canonicalId];
    const incomingScore: QuizScore | undefined = isValidQuizScore(progress.bestQuizScore)
      ? progress.bestQuizScore
      : undefined;
    let bestQuizScore = existing?.bestQuizScore;
    if (incomingScore && (!bestQuizScore || isBetterQuizScore(incomingScore, bestQuizScore))) {
      bestQuizScore = incomingScore;
    }

    lessons[canonicalId] = {
      activityCompleted: (existing?.activityCompleted ?? false) || progress.activityCompleted,
      quizCompleted: (existing?.quizCompleted ?? false) || progress.quizCompleted,
      ...(bestQuizScore ? { bestQuizScore } : {}),
    };

    if (progress.completedAt) {
      if (id === canonicalId) {
        canonicalCompletedAt[canonicalId] = progress.completedAt;
      } else {
        legacyCompletedAt[canonicalId] = progress.completedAt;
      }
    }
  }

  const mergedLessons: Record<string, LessonProgress> = {};
  for (const [canonicalId, flags] of Object.entries(lessons)) {
    const completedAt = canonicalCompletedAt[canonicalId] ?? legacyCompletedAt[canonicalId];
    mergedLessons[canonicalId] = completedAt ? { ...flags, completedAt } : flags;
  }

  if (!changed) return { state, changed: false };
  return { state: { ...state, lessons: mergedLessons }, changed: true };
}
