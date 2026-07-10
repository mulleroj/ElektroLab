/** Strukturovaný výsledek validace obsahu ElektroLabu. */

export interface ContentValidationIssue {
  severity: 'error' | 'warning';
  /** Strojově čitelný kód pravidla, např. QUIZ_CORRECT_OPTION_MISSING. */
  code: string;
  /** Typ entity: subject | topic | lesson | badge | subject-badge | final-exam-topic. */
  entityType: string;
  entityId?: string;
  field?: string;
  message: string;
}

export interface ContentValidationResult {
  valid: boolean;
  errors: ContentValidationIssue[];
  warnings: ContentValidationIssue[];
  summary: {
    subjects: number;
    activeSubjects: number;
    topics: number;
    lessons: number;
    quizQuestions: number;
    activities: number;
    demos: number;
    badges: number;
    finalExamTopics: number;
  };
}
