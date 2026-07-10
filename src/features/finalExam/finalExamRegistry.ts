/**
 * Registr obsahu závěrečné zkoušky.
 *
 * ZÁMĚRNĚ PRÁZDNÝ — oficiální okruhy zatím nebyly dodány.
 * Nový obsah se přidává výhradně postupem popsaným v
 * skills/electrolab-final-exam-content/SKILL.md (šablona, draft, validace, review).
 *
 * Do tohoto pole NIKDY nevkládej vymyšlené ani ukázkové otázky.
 */
import type { FinalExamTopic } from './finalExamTypes';

export const finalExamTopics: FinalExamTopic[] = [];

/** Okruhy viditelné žákům — pouze status 'published'. */
export function getPublishedFinalExamTopics(): FinalExamTopic[] {
  return finalExamTopics.filter((t) => t.status === 'published');
}

export function getFinalExamTopicById(id: string): FinalExamTopic | undefined {
  return finalExamTopics.find((t) => t.id === id);
}

export function getFinalExamTopicsBySubject(subjectId: string): FinalExamTopic[] {
  return getPublishedFinalExamTopics().filter((t) =>
    t.subjectIds.includes(subjectId),
  );
}

export function getFinalExamTopicsByYear(year: number): FinalExamTopic[] {
  return getPublishedFinalExamTopics().filter((t) => t.year === year);
}

/** True, jakmile existuje alespoň jeden publikovaný okruh. */
export function hasPublishedFinalExamContent(): boolean {
  return getPublishedFinalExamTopics().length > 0;
}
