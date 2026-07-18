/**
 * Migrace historických lesson ID na canonical tvar.
 *
 * Jediný zdroj pravdy pro aliasy starých ID. Aliasy drží zpětnou
 * kompatibilitu starých hash odkazů a uloženého pokroku — NESMÍ se
 * odstranit bez vědomého rozhodnutí o ukončení zpětné kompatibility
 * (viz docs/CONTENT_VALIDATION.md).
 */
import type { ProgressState, LessonProgress, QuizScore } from '../types';
import { isValidQuizScore, pickBetterQuizScore } from './quizScore';

export const LEGACY_LESSON_ID_ALIASES: Record<string, string> = {
  // MVP-10B: jediné historické ID vybočující z kebab-case konvence
  'zakladni-znacKy': 'zakladni-znacky',
};

/**
 * Převede případné legacy ID na canonical; ostatní ID vrací beze změny.
 * `Object.hasOwn` chrání před zděděnými klíči (`__proto__`, `constructor`,
 * `toString`, …) — ty aliasem nejsou a musí projít beze změny.
 */
export function migrateLessonId(id: string): string {
  return Object.hasOwn(LEGACY_LESSON_ID_ALIASES, id)
    ? LEGACY_LESSON_ID_ALIASES[id]
    : id;
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
 * skóre (viz pickBetterQuizScore — vyšší podíl, při shodě větší total),
 * takže výsledek nezávisí na pořadí klíčů. Neplatná (poškozená) skóre se
 * při migraci zahazují a označí stav jako změněný, aby se uložil čistý.
 *
 * Akumulátory jsou Map a výstup vzniká přes Object.fromEntries — klíč
 * jako `__proto__` z uložených dat tak nemůže změnit prototyp objektu.
 */
export function migrateProgressLessonReferences(state: ProgressState): {
  state: ProgressState;
  changed: boolean;
} {
  let changed = false;
  const lessons = new Map<
    string,
    Pick<LessonProgress, 'activityCompleted' | 'quizCompleted' | 'bestQuizScore'>
  >();
  const canonicalCompletedAt = new Map<string, string>();
  const legacyCompletedAt = new Map<string, string>();

  for (const [id, progress] of Object.entries(state.lessons)) {
    const canonicalId = migrateLessonId(id);
    if (canonicalId !== id) changed = true;

    const existing = lessons.get(canonicalId);
    const incomingScore: QuizScore | undefined = isValidQuizScore(progress.bestQuizScore)
      ? progress.bestQuizScore
      : undefined;
    if (progress.bestQuizScore !== undefined && !incomingScore) {
      // Neplatné uložené skóre — zahazuje se a vynutí uložení čistého stavu.
      changed = true;
    }
    let bestQuizScore = existing?.bestQuizScore;
    if (incomingScore) {
      bestQuizScore = bestQuizScore
        ? pickBetterQuizScore(bestQuizScore, incomingScore)
        : incomingScore;
    }

    lessons.set(canonicalId, {
      activityCompleted: (existing?.activityCompleted ?? false) || progress.activityCompleted,
      quizCompleted: (existing?.quizCompleted ?? false) || progress.quizCompleted,
      ...(bestQuizScore ? { bestQuizScore } : {}),
    });

    if (progress.completedAt) {
      if (id === canonicalId) {
        canonicalCompletedAt.set(canonicalId, progress.completedAt);
      } else {
        legacyCompletedAt.set(canonicalId, progress.completedAt);
      }
    }
  }

  if (!changed) return { state, changed: false };

  const mergedLessons: Record<string, LessonProgress> = Object.fromEntries(
    [...lessons].map(([canonicalId, flags]) => {
      const completedAt =
        canonicalCompletedAt.get(canonicalId) ?? legacyCompletedAt.get(canonicalId);
      return [canonicalId, completedAt ? { ...flags, completedAt } : flags];
    }),
  );
  return { state: { ...state, lessons: mergedLessons }, changed: true };
}
