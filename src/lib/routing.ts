import type { Route } from '../types';
import { migrateLessonId } from './lessonIdMigration';

export function parseHash(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const parts = hash.split('/').filter(Boolean);

  if (parts.length === 0) return { page: 'home' };

  switch (parts[0]) {
    case 'subject':
      if (parts[1]) return { page: 'subject', subjectId: parts[1] };
      break;
    case 'topic':
      if (parts[1] && parts[2])
        return { page: 'topic', subjectId: parts[1], topicId: parts[2] };
      break;
    case 'lesson':
      if (parts[1]) {
        // Zpětná kompatibilita: legacy lesson ID převedeme na canonical
        // a adresu tiše nahradíme (bez přidání záznamu do historie).
        const lessonId = migrateLessonId(parts[1]);
        if (lessonId !== parts[1]) {
          window.location.replace(`#/lesson/${lessonId}`);
        }
        return { page: 'lesson', lessonId };
      }
      break;
    case 'teacher':
      return { page: 'teacher' };
  }

  return { page: 'home' };
}

export function navigate(route: Route): void {
  let hash = '#/';

  switch (route.page) {
    case 'home':
      hash = '#/';
      break;
    case 'subject':
      hash = `#/subject/${route.subjectId}`;
      break;
    case 'topic':
      hash = `#/topic/${route.subjectId}/${route.topicId}`;
      break;
    case 'lesson':
      hash = `#/lesson/${route.lessonId}`;
      break;
    case 'teacher':
      hash = '#/teacher';
      break;
  }

  if (window.location.hash !== hash) {
    window.location.hash = hash;
  }
}
