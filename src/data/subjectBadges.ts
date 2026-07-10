/**
 * Předmětové odznaky: udělí se po dokončení všech MVP lekcí předmětu
 * (a případně ročníku). Jediný zdroj pravdy — používá ho App.tsx
 * (udělování) i validátor obsahu (kontrola referencí).
 */
export interface SubjectBadgeRule {
  subjectId: string;
  year?: number;
  badgeId: string;
}

export const SUBJECT_BADGES: SubjectBadgeRule[] = [
  { subjectId: 'mereni', year: 1, badgeId: 'merici-elev' },
  { subjectId: 'rozvody', badgeId: 'bezpecny-rozvodar' },
  { subjectId: 'elektronika', badgeId: 'elektronicky-elev' },
  { subjectId: 'automatizace', badgeId: 'automatizacni-elev' },
  { subjectId: 'stroje', badgeId: 'strojarsky-elev' },
];
