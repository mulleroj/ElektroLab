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

export interface CircuitSwitchDemo {
  type: 'circuit-switch';
  title: string;
  description: string;
}

export interface SeriesParallelDemoConfig {
  type: 'series-parallel';
  title: string;
  description: string;
}

export interface SymbolsDemoConfig {
  type: 'symbols-demo';
  title: string;
  description: string;
}

export interface VoltmeterConnectionDemo {
  type: 'voltmeter-connection';
  title: string;
  description: string;
}

export interface AmmeterConnectionDemo {
  type: 'ammeter-connection';
  title: string;
  description: string;
}

export interface MeasurementScenariosDemo {
  type: 'measurement-scenarios';
  title: string;
  description: string;
}

export type InteractiveDemo =
  | CircuitSwitchDemo
  | SeriesParallelDemoConfig
  | SymbolsDemoConfig
  | VoltmeterConnectionDemo
  | AmmeterConnectionDemo
  | MeasurementScenariosDemo;

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

export interface MeterConnectionActivity {
  type: 'meter-connection';
  instruction: string;
  meterLabel: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  successExplanation: string;
}

export interface MeasurementJudgmentActivity {
  type: 'measurement-judgment';
  instruction: string;
  /** Popisek tlačítka „v pořádku" — výchozí: „Zapojení je v pořádku". */
  correctLabel?: string;
  /** Popisek tlačítka „chybné" — výchozí: „Zapojení je chybné". */
  wrongLabel?: string;
  /** Zpráva po vyřešení všech situací. */
  successMessage?: string;
  scenarios: {
    id: string;
    text: string;
    correct: 'correct' | 'wrong';
    explanation: string;
  }[];
}

export type LessonActivity =
  | CircuitOrderActivity
  | TermMatchingActivity
  | FormulaSelectActivity
  | ConnectionTypeActivity
  | SymbolMatchingActivity
  | MeterConnectionActivity
  | MeasurementJudgmentActivity;

export interface Activity {
  circuitOrder?: CircuitOrderActivity;
  termMatching?: TermMatchingActivity;
  formulaSelect?: FormulaSelectActivity;
  connectionType?: ConnectionTypeActivity;
  symbolMatching?: SymbolMatchingActivity;
  meterConnection?: MeterConnectionActivity;
  measurementJudgment?: MeasurementJudgmentActivity;
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
  /** Doporučení pro učitele, kdy lekci použít ve výuce. */
  teacherTip?: string;
  interactiveDemo?: InteractiveDemo;
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
  | { page: 'lesson'; lessonId: string }
  | { page: 'teacher' };

export type LessonStep = 'intro' | 'demo' | 'activity' | 'quiz' | 'complete';

export function getLessonActivity(lesson: MicroLesson): LessonActivity | null {
  const { activity } = lesson;
  if (activity.circuitOrder) return activity.circuitOrder;
  if (activity.termMatching) return activity.termMatching;
  if (activity.formulaSelect) return activity.formulaSelect;
  if (activity.connectionType) return activity.connectionType;
  if (activity.symbolMatching) return activity.symbolMatching;
  if (activity.meterConnection) return activity.meterConnection;
  if (activity.measurementJudgment) return activity.measurementJudgment;
  return null;
}

export function getNextStepAfterIntro(lesson: MicroLesson): LessonStep {
  return lesson.interactiveDemo ? 'demo' : 'activity';
}
