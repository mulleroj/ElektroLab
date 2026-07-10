/**
 * Migrace historických lesson ID na canonical tvar.
 *
 * Jediný zdroj pravdy pro aliasy starých ID. Aliasy drží zpětnou
 * kompatibilitu starých hash odkazů a uloženého pokroku — NESMÍ se
 * odstranit bez vědomého rozhodnutí o ukončení zpětné kompatibility
 * (viz docs/CONTENT_VALIDATION.md).
 */
import type { ProgressState, LessonProgress } from '../types';

export const LEGACY_LESSON_ID_ALIASES: Record<string, string> = {
  // MVP-10B: jediné historické ID vybočující z kebab-case konvence
  'zakladni-znacKy': 'zakladni-znacky',
};

/** Převede případné legacy ID na canonical; ostatní ID vrací beze změny. */
export function migrateLessonId(id: string): string {
  return LEGACY_LESSON_ID_ALIASES[id] ?? id;
}

/** Sloučí pokrok legacy a canonical záznamu bez ztráty dokončení. */
function mergeLessonProgress(
  canonical: LessonProgress | undefined,
  legacy: LessonProgress,
): LessonProgress {
  if (!canonical) return legacy;
  return {
    activityCompleted: canonical.activityCompleted || legacy.activityCompleted,
    quizCompleted: canonical.quizCompleted || legacy.quizCompleted,
    completedAt: canonical.completedAt ?? legacy.completedAt,
  };
}

/**
 * Čistá migrace referencí na lekce uvnitř pokroku.
 * XP a odznaky se nemění (nejsou indexované lesson ID).
 * Vrací `changed: false`, když nebylo co migrovat — volající pak neukládá.
 * Idempotentní: po první migraci už žádné legacy klíče neexistují.
 */
export function migrateProgressLessonReferences(state: ProgressState): {
  state: ProgressState;
  changed: boolean;
} {
  let changed = false;
  const lessons: Record<string, LessonProgress> = {};

  for (const [id, progress] of Object.entries(state.lessons)) {
    const canonicalId = migrateLessonId(id);
    if (canonicalId !== id) changed = true;
    lessons[canonicalId] = mergeLessonProgress(lessons[canonicalId], progress);
  }

  if (!changed) return { state, changed: false };
  return { state: { ...state, lessons }, changed: true };
}
