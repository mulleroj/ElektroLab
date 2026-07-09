import { lessons } from '../data/lessons';
import { validateLessonSafety } from './validation';

export function validateAllLessons(): boolean {
  return lessons.every((lesson) => validateLessonSafety(lesson));
}
