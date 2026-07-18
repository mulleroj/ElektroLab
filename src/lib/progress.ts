import type { ProgressState, LessonProgress } from '../types';
import { migrateProgressLessonReferences } from './lessonIdMigration';
import { isValidQuizScore, isBetterQuizScore } from './quizScore';
import { SUBJECT_BADGES } from '../data/subjectBadges';
import { getMvpLessonsBySubject } from '../data/lessons';

const STORAGE_KEY = 'elektrolab-progress';
export const LAST_LESSON_KEY = 'elektrolab-last-lesson';

const defaultProgress: ProgressState = {
  totalXp: 0,
  earnedBadges: [],
  lessons: {},
  calmMode: false,
};

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultProgress };
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    const loaded: ProgressState = {
      totalXp: parsed.totalXp ?? 0,
      earnedBadges: parsed.earnedBadges ?? [],
      lessons: parsed.lessons ?? {},
      calmMode: parsed.calmMode ?? false,
    };
    // Jednorázová migrace historických lesson ID; ukládá se jen při změně.
    const { state, changed } = migrateProgressLessonReferences(loaded);
    if (changed) saveProgress(state);
    return state;
  } catch {
    return { ...defaultProgress };
  }
}

export function saveProgress(state: ProgressState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getLessonProgress(
  state: ProgressState,
  lessonId: string,
): LessonProgress {
  return (
    state.lessons[lessonId] ?? {
      activityCompleted: false,
      quizCompleted: false,
    }
  );
}

export function isLessonComplete(state: ProgressState, lessonId: string): boolean {
  const lp = getLessonProgress(state, lessonId);
  return lp.activityCompleted && lp.quizCompleted;
}

export function completeActivity(
  state: ProgressState,
  lessonId: string,
  xp: number,
): ProgressState {
  const existing = getLessonProgress(state, lessonId);
  if (existing.activityCompleted) return state;

  const updated: ProgressState = {
    ...state,
    totalXp: state.totalXp + xp,
    lessons: {
      ...state.lessons,
      [lessonId]: {
        ...existing,
        activityCompleted: true,
      },
    },
  };
  saveProgress(updated);
  return updated;
}

export function completeQuiz(
  state: ProgressState,
  lessonId: string,
  xp: number,
  badgeId?: string,
): ProgressState {
  const existing = getLessonProgress(state, lessonId);
  if (existing.quizCompleted) return state;

  const earnedBadges = badgeId && !state.earnedBadges.includes(badgeId)
    ? [...state.earnedBadges, badgeId]
    : state.earnedBadges;

  const updated: ProgressState = {
    ...state,
    totalXp: state.totalXp + xp,
    earnedBadges,
    lessons: {
      ...state.lessons,
      [lessonId]: {
        ...existing,
        quizCompleted: true,
        completedAt: new Date().toISOString(),
      },
    },
  };
  saveProgress(updated);
  return updated;
}

/**
 * Zapíše nejlepší dosažené skóre mini testu. Horší nebo shodný opakovaný
 * pokus dřívější lepší výsledek nepřepíše; neplatné vstupy se ignorují.
 * Poškozené dříve uložené skóre se přepíše prvním platným výsledkem.
 */
export function recordQuizScore(
  state: ProgressState,
  lessonId: string,
  correct: number,
  total: number,
): ProgressState {
  const score = { correct, total };
  if (!isValidQuizScore(score)) return state;

  const existing = getLessonProgress(state, lessonId);
  const previousBest = isValidQuizScore(existing.bestQuizScore)
    ? existing.bestQuizScore
    : undefined;
  if (previousBest && !isBetterQuizScore(score, previousBest)) return state;

  const updated: ProgressState = {
    ...state,
    lessons: {
      ...state.lessons,
      [lessonId]: {
        ...existing,
        bestQuizScore: score,
      },
    },
  };
  saveProgress(updated);
  return updated;
}

/**
 * Co bylo při právě dokončeném pokusu skutečně nově uděleno. UI z toho
 * pozná první dokončení od opakovaného pokusu — nesmí novost odvozovat
 * jen z toho, že uživatel právě dokončil komponentu Quiz.
 */
export interface QuizCompletionResult {
  state: ProgressState;
  /** Počet XP právě přidělených tímto voláním (0 při retry i v projektorovém režimu). */
  xpAwarded: number;
  /** Právě teď byl udělen lekční odznak. */
  lessonBadgeAwarded: boolean;
  /** Předmětové odznaky nově udělené tímto dokončením. */
  subjectBadgeIdsAwarded: string[];
}

/**
 * Kompletní zpracování dokončeného mini testu: nejlepší skóre, XP a odznak
 * za lekci (jen jednou) a případné oborové odznaky. V projektorovém režimu
 * se nic neukládá, stav se vrací beze změny a žádná odměna se nehlásí.
 * Metadata o nově udělených odměnách se odvozují ze skutečné změny stavu.
 */
export function applyQuizCompletion(
  state: ProgressState,
  opts: {
    lessonId: string;
    xp: number;
    badgeId?: string;
    correct: number;
    total: number;
    projectorMode: boolean;
  },
): QuizCompletionResult {
  if (opts.projectorMode) {
    return { state, xpAwarded: 0, lessonBadgeAwarded: false, subjectBadgeIdsAwarded: [] };
  }

  let next = recordQuizScore(state, opts.lessonId, opts.correct, opts.total);
  const beforeQuiz = next;
  next = completeQuiz(next, opts.lessonId, opts.xp, opts.badgeId);
  // Odvozeno ze skutečné změny stavu, ne z druhé kopie obchodní logiky.
  // Math.max chrání hlášení před záporem při neobvyklém uloženém stavu.
  const xpAwarded = Math.max(0, next.totalXp - beforeQuiz.totalXp);
  const lessonBadgeAwarded =
    opts.badgeId !== undefined &&
    !beforeQuiz.earnedBadges.includes(opts.badgeId) &&
    next.earnedBadges.includes(opts.badgeId);

  const subjectBadgeIdsAwarded: string[] = [];
  for (const sb of SUBJECT_BADGES) {
    if (next.earnedBadges.includes(sb.badgeId)) continue;
    const ids = getMvpLessonsBySubject(sb.subjectId, sb.year).map((l) => l.id);
    if (ids.length > 0 && ids.every((id) => isLessonComplete(next, id))) {
      next = {
        ...next,
        earnedBadges: [...next.earnedBadges, sb.badgeId],
      };
      subjectBadgeIdsAwarded.push(sb.badgeId);
      saveProgress(next);
    }
  }

  return { state: next, xpAwarded, lessonBadgeAwarded, subjectBadgeIdsAwarded };
}

/**
 * Smaže pokrok uložený v tomto zařízení: XP, dokončení, skóre, odznaky
 * a poslední otevřenou lekci. Zachovává uživatelská nastavení, která nejsou
 * pokrokem (zklidněný režim, onboardingový příznak). Bezpečné i na prázdném
 * stavu — opakované volání nezpůsobí chybu.
 */
export function resetProgress(state: ProgressState): ProgressState {
  const next: ProgressState = { ...defaultProgress, calmMode: state.calmMode };
  try {
    if (next.calmMode) {
      // Zklidněný režim je nastavení, ne pokrok — přežije reset.
      saveProgress(next);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    localStorage.removeItem(LAST_LESSON_KEY);
  } catch {
    // Bez dostupného localStorage stačí vynulovat stav v paměti.
  }
  return next;
}

export function toggleCalmMode(state: ProgressState): ProgressState {
  const updated: ProgressState = {
    ...state,
    calmMode: !state.calmMode,
  };
  saveProgress(updated);
  return updated;
}

export function getSubjectProgress(
  state: ProgressState,
  lessonIds: string[],
): { completed: number; total: number } {
  const total = lessonIds.length;
  const completed = lessonIds.filter((id) => isLessonComplete(state, id)).length;
  return { completed, total };
}
