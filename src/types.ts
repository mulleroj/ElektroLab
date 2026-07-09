export type Difficulty = 'základní' | 'střední' | 'pokročilá';

export interface Subject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  years: number[];
  mvpAvailable: boolean;
}

export interface Topic {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  year: number;
  estimatedMinutes: number;
  mvpAvailable: boolean;
}

export interface CircuitOrderActivity {
  type: 'circuit-order';
  instruction: string;
  elements: { id: string; label: string }[];
  correctOrder: string[];
}

export interface TermMatchingActivity {
  type: 'term-matching';
  instruction: string;
  terms: { id: string; label: string }[];
  definitions: { id: string; label: string }[];
  correctPairs: Record<string, string>;
}

export interface FormulaSelectActivity {
  type: 'formula-select';
  instruction: string;
  example: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  successExplanation: string;
}

export interface ConnectionTypeActivity {
  type: 'connection-type';
  instruction: string;
  scenarios: {
    id: string;
    description: string;
    correctType: 'serial' | 'parallel';
  }[];
}

export interface SymbolMatchingActivity {
  type: 'symbol-matching';
  instruction: string;
  symbols: { id: string; symbol: string; ariaLabel: string }[];
  names: { id: string; label: string }[];
  correctPairs: Record<string, string>;
}

export type LessonActivity =
  | CircuitOrderActivity
  | TermMatchingActivity
  | FormulaSelectActivity
  | ConnectionTypeActivity
  | SymbolMatchingActivity;

export interface Activity {
  circuitOrder?: CircuitOrderActivity;
  termMatching?: TermMatchingActivity;
  formulaSelect?: FormulaSelectActivity;
  connectionType?: ConnectionTypeActivity;
  symbolMatching?: SymbolMatchingActivity;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

export interface MicroLesson {
  id: string;
  subjectId: string;
  topicId: string;
  title: string;
  year: number;
  durationMinutes: number;
  difficulty: Difficulty;
  goal: string;
  hook: string;
  explanation: string;
  safetyNote: string;
  memorySentence: string;
  typicalMistake?: string;
  activity: Activity;
  quiz: QuizQuestion[];
  activityXp: number;
  quizXp: number;
  badgeId?: string;
  mvpAvailable: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface LessonProgress {
  activityCompleted: boolean;
  quizCompleted: boolean;
  completedAt?: string;
}

export interface ProgressState {
  totalXp: number;
  earnedBadges: string[];
  lessons: Record<string, LessonProgress>;
  calmMode: boolean;
}

export type Route =
  | { page: 'home' }
  | { page: 'subject'; subjectId: string }
  | { page: 'topic'; subjectId: string; topicId: string }
  | { page: 'lesson'; lessonId: string };

export type LessonStep = 'intro' | 'activity' | 'quiz' | 'complete';

export function getLessonActivity(lesson: MicroLesson): LessonActivity | null {
  const { activity } = lesson;
  if (activity.circuitOrder) return activity.circuitOrder;
  if (activity.termMatching) return activity.termMatching;
  if (activity.formulaSelect) return activity.formulaSelect;
  if (activity.connectionType) return activity.connectionType;
  if (activity.symbolMatching) return activity.symbolMatching;
  return null;
}
