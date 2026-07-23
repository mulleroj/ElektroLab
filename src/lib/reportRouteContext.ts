import type { Route } from '../types';
import type { ProgressState } from '../types';
import { getLessonProgress } from './progress';
import { getLessonById } from '../data/lessons';
import { getSubjectById } from '../data/subjects';
import type { ReportRouteContext } from './reportProblem';

/** Sestaví anonymní kontext stránky pro hlášení problémů. */
export function buildRouteReportContext(
  route: Route,
  progress: ProgressState,
): ReportRouteContext {
  switch (route.page) {
    case 'home':
      return { page: 'home' };
    case 'teacher':
      return { page: 'teacher' };
    case 'subject': {
      const subject = getSubjectById(route.subjectId);
      return {
        page: 'subject',
        subjectId: route.subjectId,
        subjectTitle: subject?.title ?? '',
      };
    }
    case 'topic': {
      const subject = getSubjectById(route.subjectId);
      return {
        page: 'topic',
        subjectId: route.subjectId,
        subjectTitle: subject?.title ?? '',
      };
    }
    case 'lesson': {
      const lesson = getLessonById(route.lessonId);
      const subject = lesson ? getSubjectById(lesson.subjectId) : undefined;
      const lp = getLessonProgress(progress, route.lessonId);
      return {
        page: 'lesson',
        lessonId: route.lessonId,
        lessonTitle: lesson?.title ?? '',
        subjectId: lesson?.subjectId ?? '',
        subjectTitle: subject?.title ?? '',
        activityCompleted: lp.activityCompleted,
        quizCompleted: lp.quizCompleted,
      };
    }
  }
}
