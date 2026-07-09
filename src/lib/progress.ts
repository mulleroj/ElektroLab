import type { ProgressState, LessonProgress } from '../types';

const STORAGE_KEY = 'elektrolab-progress';

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
    return {
      totalXp: parsed.totalXp ?? 0,
      earnedBadges: parsed.earnedBadges ?? [],
      lessons: parsed.lessons ?? {},
      calmMode: parsed.calmMode ?? false,
    };
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
