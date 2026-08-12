export interface User {
  id: string;
  name: string;
  email: string;
  university?: string;
  degree?: string;
  semester?: string;
  profileImage?: string;
  subscription?: {
    plan: 'Free' | 'Pro' | 'Premium';
    status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
  };
  settings?: {
    theme: 'light' | 'dark' | 'system';
    studyReminders: boolean;
    quizReminders: boolean;
    taskReminders: boolean;
  };
}

export interface Subject {
  _id: string;
  name: string;
  description?: string;
  color: string;
  notesCount?: number;
  tasksCount?: number;
  completedTasksCount?: number;
  quizAvg?: number;
  studyTimeHours?: string;
  progressPercentage?: number;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  subjectId?: Subject | string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  userAnswer?: number;
}

export interface Quiz {
  _id: string;
  subjectName?: string;
  topic: string;
  questions: QuizQuestion[];
  score: number;
  totalQuestions: number;
  percentage: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeTakenSeconds: number;
  completed: boolean;
  lastScore?: number;
  createdAt: string;
}

export interface StudyTask {
  _id: string;
  title: string;
  subjectId?: Subject | { _id: string; name: string; color: string };
  date: string;
  startTime?: string;
  duration: number;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
}

export interface Flashcard {
  _id: string;
  subjectId?: Subject | { _id: string; name: string; color: string };
  question?: string;
  answer?: string;
  front: string;
  back: string;
  status: 'New' | 'Learning' | 'Mastered';
  learned?: boolean;
  review?: boolean;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  saved?: boolean;
  timestamp: string;
}

export interface Conversation {
  _id: string;
  subject: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface Summary {
  _id: string;
  fileName: string;
  title: string;
  summaryText: string;
  importantPoints: string[];
  keyTerms: { term: string; definition: string }[];
  reviewQuestions: string[];
  shortNotes: string;
  createdAt: string;
}

export interface AnalyticsMetrics {
  totalNotes: number;
  totalTasks: number;
  completedTasks: number;
  totalFlashcards: number;
  learnedFlashcards: number;
  avgQuizScore: number;
  currentStreak: number;
  totalStudyHoursThisWeek: string;
  weeklyGoalHours: number;
}

export interface AnalyticsCharts {
  weeklyStudy: { labels: string[]; data: number[] };
  quizPerformance: { labels: string[]; data: number[] };
  subjectDistribution: { labels: string[]; colors: string[]; data: number[] };
}
