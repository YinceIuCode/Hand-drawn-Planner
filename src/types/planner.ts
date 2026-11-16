export interface Theme {
  id: string;
  name: string;
  bgGrid: string;
  gridLine: string;
  cardBg: string;
  textMain: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  accent: string;
  border: string;
  swatches: string[];
}

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export type Priority = 'urgent' | 'important' | 'normal';

export interface Task {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  priority: Priority | string;
  recurrence: string[];
  subtasks: Subtask[];
}

export interface Habit {
  id: string;
  title: string;
  rate: number;
  daysDone: number[];
}

export interface GoalStep {
  id: string;
  text: string;
  done: boolean;
}

export interface Goal {
  id: string;
  title: string;
  category: string;
  deadline: string;
  reward: string;
  status: string;
  steps: GoalStep[];
}

export interface YearMonthItem {
  id: string;
  text: string;
  done: boolean;
}

export interface YearMonth {
  month: number;
  isCurrent?: boolean;
  done: number;
  total: number;
  items: YearMonthItem[];
}

export interface YearData {
  keyword: string;
  vision: string;
  months: YearMonth[];
}

export type TabId = 'today' | 'goals' | 'habits' | 'weekly' | 'yearly' | 'stats';

export type GoalCategory =
  | 'Học tập'
  | 'Sức khỏe'
  | 'Tài chính'
  | 'Phát triển'
  | 'Sự nghiệp'
  | 'Gia đình'
  | string;

export interface ChillTrack {
  id: number;
  title: string;
  freq: number;
}

export interface TrendItem {
  label: string;
  rate: number;
  tasks: number;
}

export interface MusicTrackPreset {
  id: string;
  title: string;
  type: 'youtube' | 'synth';
  videoId?: string;
  freq?: number;
}

export interface CustomTrack {
  id: string;
  title: string;
  videoId: string;
  addedAt: string;
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

export interface User {
  id?: string;
  email: string;
  name: string;
  avatar?: string;
  loggedInAt?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  morningTime: string;
  eveningTime: string;
  lastMorningNotifiedDate?: string;
  lastEveningNotifiedDate?: string;
}

export interface CloudPlannerState {
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  yearData: YearData;
  themeId: string;
  youtubeVideoId?: string | null;
  currentTrackTitle?: string;
  musicSourceType?: 'youtube' | 'synth';
  customTracks?: CustomTrack[];
  lifeScores?: Record<string, number>;
  notificationSettings?: NotificationSettings;
  updatedAt?: string;
}

export interface PlannerBackupData {
  version: string;
  exportedAt: string;
  themeId?: string;
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  yearly?: YearData;
  youtubeVideoId?: string | null;
  currentTrackTitle?: string;
  musicSourceType?: 'youtube' | 'synth';
  customTracks?: CustomTrack[];
  lifeScores?: Record<string, number>;
  notificationSettings?: NotificationSettings;
  user?: User | null;
}
