export type Difficulty = 'základní' | 'střední' | 'pokročilá';

export type ActivityType = 'circuit-order' | 'matching' | 'quiz' | 'scenario';

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
  xpReward: number;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

export interface Activity {
  circuitOrder?: CircuitOrderActivity;
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
