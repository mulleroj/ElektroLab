import type { MicroLesson } from '../types';

export function validateLessonSafety(lesson: MicroLesson): boolean {
  if (!lesson.safetyNote || lesson.safetyNote.trim().length === 0) {
    console.error(
      `[ElektroLab] BEZPEČNOSTNÍ CHYBA: Lekce "${lesson.id}" (${lesson.title}) nemá povinnou safetyNote. Lekce nebude zobrazena.`,
    );
    return false;
  }
  return true;
}

export function getValidatedLesson(lesson: MicroLesson | undefined): MicroLesson | null {
  if (!lesson) return null;
  if (!validateLessonSafety(lesson)) return null;
  return lesson;
}

export function filterValidLessons(lessonList: MicroLesson[]): MicroLesson[] {
  return lessonList.filter((lesson) => validateLessonSafety(lesson));
}
