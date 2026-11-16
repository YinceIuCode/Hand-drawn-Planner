"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useRef,
  useEffect,
  ReactNode
} from 'react';
import { Task, Habit, Goal, GoalStep, YearData, Theme, TabId, PlannerBackupData, User, SyncStatus, CloudPlannerState, NotificationSettings } from '@/types/planner';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  THEMES,
  CHILL_TRACKS,
  CHILL_PRESETS,
  playCelebrationSound,
  getTodayString,
  DEFAULT_DATE_STR,
  addDaysToDate,
  getDayOfWeekTag,
  getFullDayOfWeekLabel,
  extractYouTubeVideoId,
  calculateStreak,
  DEFAULT_LIFE_SCORES,
  DEFAULT_NOTIFICATION_SETTINGS
} from '@/lib/constants';

// ============================================================================
// DỮ LIỆU MẪU ĐỒNG BỘ THEO THỜI GIAN THỰC (DÙNG NGÀY TĨNH ĐỂ PRERENDER AN TOÀN)
// ============================================================================
export const DEFAULT_STATIC_DATE = DEFAULT_DATE_STR;

export const createInitialTasks = (today: string = DEFAULT_DATE_STR): Task[] => {
  const yesterday = addDaysToDate(today, -1);
  const twoDaysAgo = addDaysToDate(today, -2);

  return [
    {
      id: 't1',
      title: 'Ôn 20 từ vựng HSK 3',
      date: today,
      completed: true,
      priority: 'urgent',
      recurrence: ['T2', 'T4', 'T6'],
      subtasks: [
        { id: 's1', title: 'Viết chữ Hán 10 từ đầu', done: true },
        { id: 's2', title: 'Đặt câu với 10 từ sau', done: true }
      ]
    },
    {
      id: 't2',
      title: 'Nghe 1 bài hội thoại tiếng Trung',
      date: today,
      completed: true,
      priority: 'important',
      recurrence: [],
      subtasks: []
    },
    {
      id: 't3',
      title: 'Trả lời email khách hàng',
      date: today,
      completed: true,
      priority: 'urgent',
      recurrence: [],
      subtasks: []
    },
    {
      id: 't4',
      title: 'Họp nhóm lúc 9 giờ',
      date: today,
      completed: false,
      priority: 'urgent',
      recurrence: ['T2', 'T6'],
      subtasks: [
        { id: 's3', title: 'Chuẩn bị slide tiến độ tuần', done: true },
        { id: 's4', title: 'Chốt deadline Sprint 1', done: false }
      ]
    },
    {
      id: 't5',
      title: 'Chạy bộ 30 phút',
      date: today,
      completed: false,
      priority: 'important',
      recurrence: ['T3', 'T5', 'T7'],
      subtasks: []
    },
    {
      id: 't6',
      title: 'Viết 5 câu với ngữ pháp mới',
      date: today,
      completed: false,
      priority: 'normal',
      recurrence: [],
      subtasks: []
    },
    {
      id: 't7',
      title: 'Gọi điện cho gia đình',
      date: today,
      completed: false,
      priority: 'normal',
      recurrence: ['CN'],
      subtasks: []
    },
    {
      id: 't8',
      title: 'Chỉnh sửa slide thuyết trình',
      date: twoDaysAgo,
      completed: false,
      priority: 'urgent',
      recurrence: [],
      subtasks: []
    },
    {
      id: 't9',
      title: 'Thanh toán hóa đơn điện nước',
      date: yesterday,
      completed: false,
      priority: 'important',
      recurrence: [],
      subtasks: []
    }
  ];
};

export const createInitialHabits = (dayNum: number = 23): Habit[] => {
  const daysUpTo = (count: number) =>
    Array.from({ length: Math.min(Math.max(1, dayNum), count) }, (_, i) => i + 1);

  return [
    {
      id: 'h1',
      title: 'Uống đủ 2 lít nước',
      rate: 96,
      daysDone: daysUpTo(dayNum)
    },
    {
      id: 'h2',
      title: 'Học từ vựng 20 phút',
      rate: 70,
      daysDone: daysUpTo(dayNum).filter((d) => d % 2 === 0 || d === dayNum)
    },
    {
      id: 'h3',
      title: 'Đọc sách 15 phút',
      rate: 74,
      daysDone: daysUpTo(dayNum).filter((d) => d % 3 !== 0 || d === dayNum)
    },
    {
      id: 'h4',
      title: 'Tập thể dục',
      rate: 48,
      daysDone: daysUpTo(dayNum).filter((d) => d % 2 === 1)
    },
    {
      id: 'h5',
      title: 'Thiền 10 phút',
      rate: 30,
      daysDone: daysUpTo(dayNum).filter((d) => d % 4 === 0)
    },
    {
      id: 'h6',
      title: 'Đi ngủ trước 23 giờ',
      rate: 74,
      daysDone: daysUpTo(dayNum).filter((d) => d % 5 !== 0 || d === dayNum)
    }
  ];
};

export const INITIAL_TASKS: Task[] = createInitialTasks(DEFAULT_STATIC_DATE);
export const INITIAL_HABITS: Habit[] = createInitialHabits(23);

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'g1',
    title: 'Đạt HSK 4 trong 6 tháng',
    category: 'Học tập',
    deadline: '22/03/2027 · còn 150 ngày',
    reward: 'Một chuyến du lịch Trung Quốc',
    status: 'Đang thực hiện',
    steps: [
      { id: 'gs1', text: 'Hoàn thành giáo trình Hán ngữ 4', done: true },
      { id: 'gs2', text: 'Thuộc 1200 từ vựng HSK 4', done: true },
      { id: 'gs3', text: 'Luyện 15 đề thi thử đạt > 240 điểm', done: false },
      { id: 'gs4', text: 'Luyện nghe phản xạ 30 phút mỗi ngày', done: false },
      { id: 'gs5', text: 'Đăng ký lệ phí thi chính thức', done: false }
    ]
  },
  {
    id: 'g2',
    title: 'Chạy bộ 5 km không nghỉ',
    category: 'Sức khỏe',
    deadline: '22/12/2026 · còn 60 ngày',
    reward: 'Đôi giày chạy mới',
    status: 'Đang thực hiện',
    steps: [
      { id: 'gs6', text: 'Chạy liên tục 2km tuần đầu', done: true },
      { id: 'gs7', text: 'Nâng lên 3.5km tuần thứ 3', done: true },
      { id: 'gs8', text: 'Giữ nhịp thở đều ở km thứ 4', done: false },
      { id: 'gs9', text: 'Chinh phục 5km dưới 35 phút', done: false }
    ]
  },
  {
    id: 'g3',
    title: 'Tiết kiệm 20 triệu',
    category: 'Tài chính',
    deadline: '20/02/2027 · còn 120 ngày',
    reward: 'Bữa tối nhà hàng yêu thích',
    status: 'Đang thực hiện',
    steps: [
      { id: 'gs10', text: 'Tự động trích 5 triệu đầu tháng 10', done: true },
      { id: 'gs11', text: 'Trích 5 triệu đầu tháng 11', done: true },
      { id: 'gs12', text: 'Trích 5 triệu đầu tháng 12', done: false },
      { id: 'gs13', text: 'Trích 5 triệu đầu tháng 1', done: false }
    ]
  },
  {
    id: 'g4',
    title: 'Đọc 12 cuốn sách trong năm',
    category: 'Phát triển',
    deadline: '21/01/2027 · còn 90 ngày',
    reward: 'Một kệ sách mới',
    status: 'Đã hoàn thành',
    steps: [
      { id: 'gs14', text: 'Đọc xong 6 cuốn nửa đầu năm', done: true },
      { id: 'gs15', text: 'Đọc xong 6 cuốn nửa cuối năm', done: true }
    ]
  },
  {
    id: 'g5',
    title: 'Thuyết trình dự án trước công ty',
    category: 'Sự nghiệp',
    deadline: '12/11/2026 · còn 20 ngày',
    reward: 'Nghỉ phép 2 ngày',
    status: 'Đang thực hiện',
    steps: [
      { id: 'gs16', text: 'Hoàn thiện bộ slide demo', done: true },
      { id: 'gs17', text: 'Tập nói thử trước gương 3 lần', done: true },
      { id: 'gs18', text: 'Trình bày chính thức', done: false }
    ]
  },
  {
    id: 'g6',
    title: 'Dành tối Chủ nhật cho gia đình',
    category: 'Gia đình',
    deadline: '31/12/2026 · còn 69 ngày',
    reward: 'Album ảnh kỷ niệm gia đình',
    status: 'Đang thực hiện',
    steps: [
      { id: 'gs19', text: 'Ăn tối cuối tuần cùng bố mẹ', done: true },
      { id: 'gs20', text: 'Tổ chức 1 buổi dã ngoại ngoại ô', done: false }
    ]
  }
];

export const INITIAL_YEAR_DATA: YearData = {
  keyword: 'Bứt phá',
  vision: 'Năm nay, mình tự tin giao tiếp tiếng Trung, đạt HSK 4, rèn luyện thể lực và có quỹ dự phòng tài chính vững vàng.',
  months: [
    { month: 1, done: 5, total: 5, items: [{ id: 'm1', text: 'Khai xuân & lập kế hoạch năm', done: true }] },
    { month: 2, done: 4, total: 4, items: [{ id: 'm2', text: 'Hoàn thành HSK 2', done: true }] },
    { month: 3, done: 4, total: 5, items: [{ id: 'm3', text: 'Bắt đầu thói quen chạy bộ', done: true }] },
    { month: 4, done: 3, total: 4, items: [{ id: 'm4', text: 'Đọc xong 3 cuốn sách kỹ năng', done: true }] },
    { month: 5, done: 5, total: 5, items: [{ id: 'm5', text: 'Thi đỗ chứng chỉ HSK 3', done: true }] },
    { month: 6, done: 3, total: 4, items: [{ id: 'm6', text: 'Sơ kết mục tiêu 6 tháng đầu năm', done: true }] },
    { month: 7, done: 3, total: 4, items: [{ id: 'm7', text: 'Du lịch hè cùng gia đình', done: true }] },
    { month: 8, done: 4, total: 5, items: [{ id: 'm8', text: 'Hoàn thành khóa Excel nâng cao', done: true }] },
    { month: 9, done: 3, total: 4, items: [{ id: 'm9', text: 'Tiết kiệm đạt mốc 15 triệu', done: true }] },
    {
      month: 10,
      isCurrent: true,
      done: 1,
      total: 4,
      items: [
        { id: 'm10_1', text: 'Học xong HSK 4 quyển thượng', done: false },
        { id: 'm10_2', text: 'Tiết kiệm 17 triệu', done: true },
        { id: 'm10_3', text: 'Chuyến đi cuối tuần', done: false },
        { id: 'm10_4', text: 'Dọn tủ đồ cũ để tặng', done: false }
      ]
    },
    { month: 11, done: 0, total: 4, items: [{ id: 'm11', text: 'Thuyết trình dự án lớn cuối năm', done: false }] },
    { month: 12, done: 0, total: 4, items: [{ id: 'm12', text: 'Tổng kết năm & đón Tết', done: false }] }
  ]
};

export const INITIAL_YEARLY = INITIAL_YEAR_DATA;

/** Hàm đồng bộ và tự động tạo công việc cho ngày mới nếu trùng thứ lặp lại (recurrence) */
export const syncRecurringTasks = (targetDate: string, existingTasks: Task[]): Task[] => {
  const dayTag = getDayOfWeekTag(targetDate);
  const recurringTemplates = new Map<string, Task>();
  for (const t of existingTasks) {
    if (t.recurrence && t.recurrence.length > 0) {
      if (!recurringTemplates.has(t.title.trim().toLowerCase())) {
        recurringTemplates.set(t.title.trim().toLowerCase(), t);
      }
    }
  }

  const tasksOnDate = existingTasks.filter((t) => t.date === targetDate);
  const newTasksToAdd: Task[] = [];

  recurringTemplates.forEach((template, lowerTitle) => {
    if (template.recurrence.includes(dayTag)) {
      const alreadyExists = tasksOnDate.some(
        (t) => t.title.trim().toLowerCase() === lowerTitle
      );
      if (!alreadyExists) {
        newTasksToAdd.push({
          id: 't_rec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          title: template.title,
          date: targetDate,
          completed: false,
          priority: template.priority,
          recurrence: [...template.recurrence],
          subtasks: template.subtasks.map((s) => ({
            id: 's_rec_' + Math.random().toString(36).substring(2, 6),
            title: s.title,
            done: false
          }))
        });
      }
    }
  });

  return newTasksToAdd.length > 0 ? [...newTasksToAdd, ...existingTasks] : existingTasks;
};

// ============================================================================
// CONTEXT TYPE DEFINITION
// ============================================================================
export const getUserStorageKey = (key: string, email?: string | null): string => {
  if (!email) return `planner_${key}`;
  const safe = email.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
  return `planner_data_${safe}_${key}`;
};
export interface PlannerContextType {
  // Themes & UI
  themeId: string;
  setThemeId: React.Dispatch<React.SetStateAction<string>>;
  currentTheme: Theme;
  activeTab: TabId;
  setActiveTab: React.Dispatch<React.SetStateAction<TabId>>;
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showFloatingPalette: boolean;
  setShowFloatingPalette: React.Dispatch<React.SetStateAction<boolean>>;
  toastMessage: string | null;
  triggerToast: (msg: string) => void;
  showConfetti: boolean;
  setShowConfetti: React.Dispatch<React.SetStateAction<boolean>>;

  // User & Auth & Cloud Sync
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  showAuthModal: boolean;
  setShowAuthModal: React.Dispatch<React.SetStateAction<boolean>>;
  login: (email: string, name: string) => void;
  logout: () => void;
  syncStatus: SyncStatus;
  setSyncStatus: React.Dispatch<React.SetStateAction<SyncStatus>>;
  syncToCloudNow: () => Promise<void>;
  isCloudConfigured: boolean;

  // Music Player
  isPlayingMusic: boolean;
  setIsPlayingMusic: React.Dispatch<React.SetStateAction<boolean>>;
  currentTrackIndex: number;
  setCurrentTrackIndex: React.Dispatch<React.SetStateAction<number>>;
  toggleMusic: () => void;
  youtubeVideoId: string | null;
  setYoutubeVideoId: React.Dispatch<React.SetStateAction<string | null>>;
  musicSourceType: 'youtube' | 'synth';
  setMusicSourceType: React.Dispatch<React.SetStateAction<'youtube' | 'synth'>>;
  currentTrackTitle: string;
  setCurrentTrackTitle: React.Dispatch<React.SetStateAction<string>>;
  showMusicPopover: boolean;
  setShowMusicPopover: React.Dispatch<React.SetStateAction<boolean>>;
  playPresetTrack: (presetId: string) => void;
  playCustomYoutubeUrl: (url: string) => boolean;

  // Data
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  yearData: YearData;
  setYearData: React.Dispatch<React.SetStateAction<YearData>>;
  yearly: YearData;
  setYearly: React.Dispatch<React.SetStateAction<YearData>>;
  lifeScores: Record<string, number>;
  setLifeScores: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  updateLifeScore: (subject: string, score: number) => void;

  // Data Management Modal & Storage
  showDataModal: boolean;
  setShowDataModal: React.Dispatch<React.SetStateAction<boolean>>;
  exportPlannerData: () => void;
  importPlannerData: (jsonString: string) => boolean;
  resetToDefaultData: () => void;
  clearAllData: () => void;

  // Form State
  newTaskTitle: string;
  setNewTaskTitle: React.Dispatch<React.SetStateAction<string>>;
  newTaskPriority: string;
  setNewTaskPriority: React.Dispatch<React.SetStateAction<string>>;
  newTaskRecurrence: string[];
  setNewTaskRecurrence: React.Dispatch<React.SetStateAction<string[]>>;
  expandedTaskId: string | null;
  setExpandedTaskId: React.Dispatch<React.SetStateAction<string | null>>;
  newSubtaskText: string;
  setNewSubtaskText: React.Dispatch<React.SetStateAction<string>>;
  newHabitTitle: string;
  setNewHabitTitle: React.Dispatch<React.SetStateAction<string>>;
  calendarMode: string;
  setCalendarMode: React.Dispatch<React.SetStateAction<string>>;
  statsPeriod: string;
  setStatsPeriod: React.Dispatch<React.SetStateAction<string>>;
  chartType: string;
  setChartType: React.Dispatch<React.SetStateAction<string>>;

  // Derived Values
  todaysTasks: Task[];
  overdueTasks: Task[];
  todayCompletionStats: {
    totalTasks: number;
    doneTasks: number;
    doneHabits: number;
    totalHabits: number;
    percent: number;
  };
  selectedDayNumber: number;
  currentStreak: number;
  monthProgressRate: number;
  fullDayOfWeek: string;

  // Handlers - Tasks
  addTask: (title?: string, priority?: string, recurrence?: string[], targetDate?: string) => void;
  handleAddTask: (e: React.FormEvent) => void;
  toggleTask: (taskId: string) => void;
  handleToggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  addSubtask: (taskId: string, subtaskTitle?: string) => void;
  handleAddSubtask: (taskId: string) => void;
  toggleSubtask: (taskId: string, subId: string) => void;
  handleToggleSubtask: (taskId: string, subId: string) => void;
  moveToTomorrow: (taskId: string) => void;
  handleMoveToTomorrow: (taskId: string) => void;
  rolloverOverdueTasks: () => void;
  handleRolloverOverdue: () => void;

  // Handlers - Habits
  toggleHabitDate: (habitId: string, dayNum: number) => void;
  handleToggleHabitDay: (habitId: string, dayNum: number) => void;
  addHabit: (title: string) => void;
  handleAddHabit: (e: React.FormEvent) => void;
  deleteHabit: (habitId: string) => void;
  updateHabit: (habitId: string, newTitle: string) => void;

  // Handlers - Goals
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (goalId: string, updated: Partial<Goal>) => void;
  deleteGoal: (goalId: string) => void;
  toggleGoalStep: (goalId: string, stepId: string) => void;
  addGoalStep: (goalId: string, stepText: string) => void;
  deleteGoalStep: (goalId: string, stepId: string) => void;

  // Handlers - Yearly
  addYearlyItem: (monthNum: number, text: string) => void;
  deleteYearlyItem: (monthNum: number, itemId: string) => void;
  toggleYearlyItem: (monthNum: number, itemId: string) => void;
  updateYearlyMeta: (keyword: string, vision: string) => void;

  // Notifications & PWA
  showNotificationModal: boolean;
  setShowNotificationModal: React.Dispatch<React.SetStateAction<boolean>>;
  notificationSettings: NotificationSettings;
  setNotificationSettings: React.Dispatch<React.SetStateAction<NotificationSettings>>;
  updateNotificationSettings: (partial: Partial<NotificationSettings>) => void;
  sendTestNotification: () => Promise<boolean>;
  canInstallPwa: boolean;
  installPwa: () => Promise<void>;
  isPwaInstalled: boolean;
  isIOSDevice: boolean;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

const priorityWeight: Record<string, number> = { urgent: 1, important: 2, normal: 3 };

export function PlannerProvider({ children }: { children: ReactNode }) {
  // Quản lý Ngày chọn thực tế - khởi tạo tĩnh bằng DEFAULT_DATE_STR để SSR & Client khớp 100%
  const [selectedDate, setSelectedDateState] = useState<string>(DEFAULT_DATE_STR);

  // Quản lý Theme, Tab (khởi tạo tĩnh mặc định để Hydration-safe)
  const [themeId, setThemeId] = useState<string>('bamboo');
  const [activeTab, setActiveTab] = useState<TabId>('today');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showFloatingPalette, setShowFloatingPalette] = useState<boolean>(false);

  // Modal quản lý dữ liệu
  const [showDataModal, setShowDataModal] = useState<boolean>(false);

  // Modal Nhắc nhở & Cài đặt Ứng dụng (PWA)
  const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);

  // PWA states
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deferredPromptRef = useRef<any>(null);
  const [canInstallPwa, setCanInstallPwa] = useState<boolean>(false);
  const [isPwaInstalled, setIsPwaInstalled] = useState<boolean>(false);
  const [isIOSDevice, setIsIOSDevice] = useState<boolean>(false);

  // Modal & Trạng thái Tài khoản người dùng (User & Auth)
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // State dữ liệu chính khởi tạo tĩnh (Hydration-safe 100%)
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [yearly, setYearly] = useState<YearData>(INITIAL_YEAR_DATA);
  const [lifeScores, setLifeScores] = useState<Record<string, number>>(DEFAULT_LIFE_SCORES);

  // State form thêm việc ở tab Hôm nay
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskPriority, setNewTaskPriority] = useState<string>('normal');
  const [newTaskRecurrence, setNewTaskRecurrence] = useState<string[]>([]);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>('t4');
  const [newSubtaskText, setNewSubtaskText] = useState<string>('');
  const [newHabitTitle, setNewHabitTitle] = useState<string>('');
  const [calendarMode, setCalendarMode] = useState<string>('month');
  const [statsPeriod, setStatsPeriod] = useState<string>('8w');
  const [chartType, setChartType] = useState<string>('line');

  // State hiệu ứng pháo hoa & thông báo
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // State Trình phát nhạc Chill: Hỗ trợ cả YouTube Iframe ẩn & Web Audio Synth
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>('jfKfPfyJRdk');
  const [musicSourceType, setMusicSourceType] = useState<'youtube' | 'synth'>('youtube');
  const [currentTrackTitle, setCurrentTrackTitle] = useState<string>(
    'Lofi Girl - Beats to relax/study'
  );
  const [showMusicPopover, setShowMusicPopover] = useState<boolean>(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const currentTheme = useMemo(
    () => THEMES.find((t) => t.id === themeId) || THEMES[0],
    [themeId]
  );

  // Hiển thị thông báo ngắn
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Đồng bộ chọn ngày: tự động đồng bộ recurring tasks khi đổi ngày
  const setSelectedDate: React.Dispatch<React.SetStateAction<string>> = (action) => {
    setSelectedDateState((prev) => {
      const nextDate = typeof action === 'function' ? action(prev) : action;
      setTasks((currentTasks) => syncRecurringTasks(nextDate, currentTasks));
      return nextDate;
    });
  };

  // Cập nhật lại ngày hôm nay thực tế & nạp dữ liệu từ localStorage khi component đã mount trên client (tránh lỗi Hydration 100%)
  useEffect(() => {
    const mountTimer = setTimeout(() => {
      try {
        const today = getTodayString();
        setSelectedDateState(today);

        const savedTheme = localStorage.getItem('planner_theme');
        if (savedTheme) setThemeId(savedTheme);

        const savedUserStr = localStorage.getItem('planner_current_user');
        let initialEmail: string | null = null;
        if (savedUserStr) {
          const parsedUser = JSON.parse(savedUserStr);
          setUser(parsedUser);
          initialEmail = parsedUser?.email || null;
        }

        const tasksKey = getUserStorageKey('tasks', initialEmail);
        const habitsKey = getUserStorageKey('habits', initialEmail);
        const goalsKey = getUserStorageKey('goals', initialEmail);
        const yearlyKey = getUserStorageKey('yearly', initialEmail);
        const lifeScoresKey = getUserStorageKey('life_scores', initialEmail);

        const savedTasks = localStorage.getItem(tasksKey);
        if (savedTasks) {
          setTasks(syncRecurringTasks(today, JSON.parse(savedTasks)));
        } else {
          setTasks((prev) => syncRecurringTasks(today, prev));
        }

        const savedHabits = localStorage.getItem(habitsKey);
        if (savedHabits) {
          setHabits(JSON.parse(savedHabits));
        }

        const savedGoals = localStorage.getItem(goalsKey);
        if (savedGoals) {
          setGoals(JSON.parse(savedGoals));
        }

        const savedYearly = localStorage.getItem(yearlyKey);
        if (savedYearly) {
          setYearly(JSON.parse(savedYearly));
        }

        const savedLifeScores = localStorage.getItem(lifeScoresKey);
        if (savedLifeScores) {
          setLifeScores(JSON.parse(savedLifeScores));
        }

        const notifKey = getUserStorageKey('notification_settings', initialEmail);
        const savedNotif = localStorage.getItem(notifKey);
        if (savedNotif) {
          setNotificationSettings(JSON.parse(savedNotif));
        } else {
          const guestNotif = localStorage.getItem('planner_notification_settings');
          if (guestNotif) {
            setNotificationSettings(JSON.parse(guestNotif));
          }
        }

        const savedYoutube = localStorage.getItem('planner_youtube_id');
        if (savedYoutube) {
          setYoutubeVideoId(savedYoutube);
        }
      } catch {
        // Ignore localStorage read errors
      }
    }, 0);
    return () => clearTimeout(mountTimer);
  }, []);

  // Đăng ký Service Worker và lắng nghe sự kiện cài đặt PWA (chạy phía client)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Đăng ký Service Worker thất bại:', err);
      });
    }

    const checkTimer = setTimeout(() => {
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as unknown as { MSStream?: unknown }).MSStream;
      setIsIOSDevice(isIOS);

      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as unknown as { standalone?: boolean }).standalone === true;
      if (isStandalone) {
        setIsPwaInstalled(true);
      }
    }, 0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      setCanInstallPwa(true);
    };

    const handleAppInstalled = () => {
      setIsPwaInstalled(true);
      setCanInstallPwa(false);
      deferredPromptRef.current = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      clearTimeout(checkTimer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Lưu trạng thái vào localStorage khi state thay đổi (phân tách theo email nếu đã đăng nhập)
  // Trạng thái đồng bộ đám mây (Cloud Sync)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHydratingRef = useRef<boolean>(false);
  const isCloudConfigured = isSupabaseConfigured;
  const loadedUserIdRef = useRef<string | null>(null);

  // Xử lý nạp hoặc khởi tạo dữ liệu Supabase khi user đăng nhập
  const handleSupabaseUser = async (
    sbUser: {
      id: string;
      email?: string | null;
      user_metadata?: Record<string, unknown>;
    },
    shouldNotify: boolean = false
  ) => {
    if (!supabase || !sbUser.email) return;

    const email = sbUser.email;
    const name =
      (sbUser.user_metadata?.full_name as string) ||
      (sbUser.user_metadata?.name as string) ||
      email.split('@')[0] ||
      'User';
    const avatar =
      (sbUser.user_metadata?.avatar_url as string) ||
      (sbUser.user_metadata?.picture as string) ||
      name.charAt(0).toUpperCase() ||
      'U';

    const authUser: User = {
      id: sbUser.id,
      email,
      name,
      avatar,
      loggedInAt: new Date().toISOString()
    };

    setUser(authUser);
    try {
      localStorage.setItem('planner_current_user', JSON.stringify(authUser));
    } catch {}

    // Lấy dữ liệu từ bảng user_planner_data trên Supabase
    try {
      setSyncStatus('syncing');
      const { data, error } = await supabase
        .from('user_planner_data')
        .select('planner_state')
        .eq('user_id', sbUser.id)
        .maybeSingle();

      if (error) {
        console.error('Lỗi tải dữ liệu Supabase:', error);
        setSyncStatus('error');
        return;
      }

      if (data && data.planner_state) {
        // Trên Cloud đã có dữ liệu -> nạp vào State và localStorage
        isHydratingRef.current = true;
        const cloud = data.planner_state as CloudPlannerState;

        if (cloud.tasks && Array.isArray(cloud.tasks)) {
          setTasks(syncRecurringTasks(getTodayString(), cloud.tasks));
        }
        if (cloud.habits && Array.isArray(cloud.habits)) {
          setHabits(cloud.habits);
        }
        if (cloud.goals && Array.isArray(cloud.goals)) {
          setGoals(cloud.goals);
        }
        if (cloud.yearData) {
          setYearly(cloud.yearData);
        }
        if (cloud.themeId) {
          setThemeId(cloud.themeId);
        }
        if (cloud.youtubeVideoId) {
          setYoutubeVideoId(cloud.youtubeVideoId);
        }
        if (cloud.lifeScores && typeof cloud.lifeScores === 'object') {
          setLifeScores(cloud.lifeScores);
        }
        if (cloud.notificationSettings && typeof cloud.notificationSettings === 'object') {
          setNotificationSettings(cloud.notificationSettings);
        }

        setSyncStatus('synced');
        if (shouldNotify) {
          triggerToast(`☁️ Đã đồng bộ dữ liệu đám mây cho ${name}!`);
        }
      } else {
        // Tài khoản mới tinh chưa có dòng nào trên Cloud -> tự động upsert dữ liệu hiện tại lên Cloud
        const initialCloudState: CloudPlannerState = {
          tasks,
          habits,
          goals,
          yearData: yearly,
          themeId,
          youtubeVideoId,
          lifeScores,
          notificationSettings,
          updatedAt: new Date().toISOString()
        };

        const { error: upsertErr } = await supabase.from('user_planner_data').upsert(
          {
            user_id: sbUser.id,
            email: email,
            planner_state: initialCloudState,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'user_id' }
        );

        if (upsertErr) {
          console.error('Lỗi khởi tạo dữ liệu đám mây:', upsertErr);
          setSyncStatus('error');
        } else {
          setSyncStatus('synced');
          if (shouldNotify) {
            triggerToast(`🎉 Đã liên kết tài khoản & lưu dữ liệu đám mây!`);
          }
        }
      }
    } catch (err) {
      console.error('Lỗi khi fetchAndApplyCloudData:', err);
      setSyncStatus('error');
    }
  };

  // Lắng nghe trạng thái đăng nhập thực tế qua supabase.auth.onAuthStateChange
  useEffect(() => {
    if (!supabase) return;

    // 1. Kiểm tra session hiện tại khi mở web
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        if (loadedUserIdRef.current !== session.user.id) {
          loadedUserIdRef.current = session.user.id;
          handleSupabaseUser(session.user, false);
        }
      }
    });

    // 2. Đăng ký listener sự kiện Auth từ Supabase
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Bỏ qua sự kiện TOKEN_REFRESHED khi focus lại tab trình duyệt
      if (event === 'TOKEN_REFRESHED') {
        return;
      }

      if (event === 'SIGNED_OUT') {
        loadedUserIdRef.current = null;
        setUser(null);
        setSyncStatus('idle');
        return;
      }

      if (session?.user) {
        // Nếu user ID đã được tải trước đó thì KHÔNG gọi lại fetch dữ liệu và KHÔNG toast
        if (loadedUserIdRef.current === session.user.id) {
          // Chỉ cập nhật nhẹ thông tin user nếu cần
          const email = session.user.email || '';
          const name =
            (session.user.user_metadata?.full_name as string) ||
            (session.user.user_metadata?.name as string) ||
            email.split('@')[0] ||
            'User';
          const avatar =
            (session.user.user_metadata?.avatar_url as string) ||
            (session.user.user_metadata?.picture as string) ||
            name.charAt(0).toUpperCase() ||
            'U';

          setUser((prev) =>
            prev?.id === session.user.id
              ? { ...prev, email, name, avatar }
              : {
                  id: session.user.id,
                  email,
                  name,
                  avatar,
                  loggedInAt: new Date().toISOString()
                }
          );
          return;
        }

        // Lần đầu tiên mở web lên hoặc vừa đổi tài khoản mới
        loadedUserIdRef.current = session.user.id;
        handleSupabaseUser(session.user, false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Đồng bộ 2 chiều:
  // 1. Lưu ngay vào localStorage khi có thay đổi (0ms latency, Offline-first)
  // 2. Debounced Cloud Sync (1.2 giây) gọi Supabase upsert
  useEffect(() => {
    try {
      const email = user?.email || null;
      const tasksKey = getUserStorageKey('tasks', email);
      const habitsKey = getUserStorageKey('habits', email);
      const goalsKey = getUserStorageKey('goals', email);
      const yearlyKey = getUserStorageKey('yearly', email);
      const lifeScoresKey = getUserStorageKey('life_scores', email);
      const notifKey = getUserStorageKey('notification_settings', email);
      const themeKey = getUserStorageKey('theme', email);

      localStorage.setItem(tasksKey, JSON.stringify(tasks));
      localStorage.setItem(habitsKey, JSON.stringify(habits));
      localStorage.setItem(goalsKey, JSON.stringify(goals));
      localStorage.setItem(yearlyKey, JSON.stringify(yearly));
      localStorage.setItem(lifeScoresKey, JSON.stringify(lifeScores));
      localStorage.setItem(notifKey, JSON.stringify(notificationSettings));
      localStorage.setItem(themeKey, themeId);
      if (youtubeVideoId) localStorage.setItem('planner_youtube_id', youtubeVideoId);

      // Nếu là khách (chưa đăng nhập), cập nhật key mặc định
      if (!email) {
        localStorage.setItem('planner_tasks', JSON.stringify(tasks));
        localStorage.setItem('planner_habits', JSON.stringify(habits));
        localStorage.setItem('planner_goals', JSON.stringify(goals));
        localStorage.setItem('planner_yearly', JSON.stringify(yearly));
        localStorage.setItem('planner_life_scores', JSON.stringify(lifeScores));
        localStorage.setItem('planner_notification_settings', JSON.stringify(notificationSettings));
        localStorage.setItem('planner_theme', themeId);
      }
    } catch {
      // Ignore write errors in private browsing
    }

    // Nếu chưa đăng nhập hoặc không có supabase, không lên lịch sync cloud
    if (!user || !user.id || !supabase) {
      return;
    }

    // Nếu vừa nạp từ Cloud, bỏ qua lần đồng bộ này để tránh ghi đè ngược
    if (isHydratingRef.current) {
      isHydratingRef.current = false;
      return;
    }

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(async () => {
      if (!supabase || !user?.id) return;
      setSyncStatus('syncing');
      try {
        const stateToSync: CloudPlannerState = {
          tasks,
          habits,
          goals,
          yearData: yearly,
          themeId,
          youtubeVideoId,
          lifeScores,
          notificationSettings,
          updatedAt: new Date().toISOString()
        };

        const { error } = await supabase.from('user_planner_data').upsert(
          {
            user_id: user.id,
            email: user.email,
            planner_state: stateToSync,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'user_id' }
        );

        if (error) {
          console.error('Lỗi đồng bộ Cloud:', error);
          setSyncStatus('error');
        } else {
          setSyncStatus('synced');
        }
      } catch (err) {
        console.error('Lỗi khi tự động lưu lên Cloud:', err);
        setSyncStatus('error');
      }
    }, 1200);

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [tasks, habits, goals, yearly, themeId, youtubeVideoId, lifeScores, notificationSettings, user]);

  // Đăng nhập người dùng cục bộ (dành cho fallback offline hoặc khi chưa có mạng)
  const login = (email: string, name: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const newUser: User = {
      email: trimmedEmail,
      name: name.trim() || trimmedEmail.split('@')[0],
      avatar: name.trim() ? name.trim().charAt(0).toUpperCase() : trimmedEmail.charAt(0).toUpperCase(),
      loggedInAt: new Date().toISOString()
    };
    setUser(newUser);

    try {
      localStorage.setItem('planner_current_user', JSON.stringify(newUser));

      const userTasksKey = getUserStorageKey('tasks', trimmedEmail);
      const userHabitsKey = getUserStorageKey('habits', trimmedEmail);
      const userGoalsKey = getUserStorageKey('goals', trimmedEmail);
      const userYearlyKey = getUserStorageKey('yearly', trimmedEmail);
      const userThemeKey = getUserStorageKey('theme', trimmedEmail);

      const savedTasks = localStorage.getItem(userTasksKey);
      const savedHabits = localStorage.getItem(userHabitsKey);
      const savedGoals = localStorage.getItem(userGoalsKey);
      const savedYearly = localStorage.getItem(userYearlyKey);
      const savedTheme = localStorage.getItem(userThemeKey);

      if (savedTasks) {
        setTasks(syncRecurringTasks(selectedDate, JSON.parse(savedTasks)));
      } else {
        localStorage.setItem(userTasksKey, JSON.stringify(tasks));
      }

      if (savedHabits) {
        setHabits(JSON.parse(savedHabits));
      } else {
        localStorage.setItem(userHabitsKey, JSON.stringify(habits));
      }

      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      } else {
        localStorage.setItem(userGoalsKey, JSON.stringify(goals));
      }

      if (savedYearly) {
        setYearly(JSON.parse(savedYearly));
      } else {
        localStorage.setItem(userYearlyKey, JSON.stringify(yearly));
      }

      if (savedTheme) {
        setThemeId(savedTheme);
      } else {
        localStorage.setItem(userThemeKey, themeId);
      }
    } catch {
      // Ignore storage errors
    }

    triggerToast(`🎉 Chào mừng ${newUser.name}! Đã kết nối dữ liệu riêng theo ${trimmedEmail}`);
  };

  // Đăng xuất tài khoản
  const logout = async () => {
    loadedUserIdRef.current = null;
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Supabase signOut error:', err);
      }
    }
    setUser(null);
    setSyncStatus('idle');
    try {
      localStorage.removeItem('planner_current_user');
      const guestTasks = localStorage.getItem('planner_tasks');
      if (guestTasks) {
        setTasks(syncRecurringTasks(selectedDate, JSON.parse(guestTasks)));
      }
    } catch {
      // Ignore storage errors
    }
    triggerToast('Đã đăng xuất tài khoản. Đang ở chế độ khách');
  };

  // Đồng bộ thủ công ngay lập tức lên Cloud
  const syncToCloudNow = async () => {
    if (!user || !user.id || !supabase) {
      triggerToast('Vui lòng đăng nhập để đồng bộ đám mây!');
      return;
    }
    setSyncStatus('syncing');
    try {
      const stateToSync: CloudPlannerState = {
        tasks,
        habits,
        goals,
        yearData: yearly,
        themeId,
        youtubeVideoId,
        lifeScores,
        notificationSettings,
        updatedAt: new Date().toISOString()
      };
      const { error } = await supabase.from('user_planner_data').upsert(
        {
          user_id: user.id,
          email: user.email,
          planner_state: stateToSync,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id' }
      );
      if (error) throw error;
      setSyncStatus('synced');
      triggerToast('☁️ Đã đồng bộ dữ liệu lên đám mây thành công!');
    } catch (err) {
      console.error('Lỗi khi đồng bộ thủ công:', err);
      setSyncStatus('error');
      triggerToast('❌ Đồng bộ thất bại, vui lòng thử lại!');
    }
  };

  // ============================================================================
  // XỬ LÝ NHẠC NỀN (YOUTUBE & WEB AUDIO SYNTH)
  // ============================================================================
  const startWebAudioSynth = (freq: number) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq / 2, ctx.currentTime);
      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscRef.current = osc;
    } catch {
      // Ignore audio error
    }
  };

  const toggleMusic = () => {
    try {
      if (isPlayingMusic) {
        if (oscRef.current) {
          oscRef.current.stop();
          oscRef.current.disconnect();
          oscRef.current = null;
        }
        setIsPlayingMusic(false);
        triggerToast('Đã dừng nhạc nền chill');
      } else {
        if (musicSourceType === 'youtube') {
          if (!youtubeVideoId) {
            setYoutubeVideoId('jfKfPfyJRdk');
            setCurrentTrackTitle('Lofi Girl - Beats to relax/study');
          }
          setIsPlayingMusic(true);
          triggerToast(`Đang phát: ${currentTrackTitle}`);
        } else {
          startWebAudioSynth(CHILL_TRACKS[currentTrackIndex]?.freq || 432);
          setIsPlayingMusic(true);
          triggerToast(`Đang phát: ${currentTrackTitle}`);
        }
      }
    } catch {
      setIsPlayingMusic(!isPlayingMusic);
    }
  };

  const playPresetTrack = (presetId: string) => {
    const preset = CHILL_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    if (preset.type === 'youtube' && preset.videoId) {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
          oscRef.current = null;
        } catch {}
      }
      setMusicSourceType('youtube');
      setYoutubeVideoId(preset.videoId);
      setCurrentTrackTitle(preset.title);
      setIsPlayingMusic(true);
      triggerToast(`Đang phát: ${preset.title}`);
    } else if (preset.type === 'synth') {
      setMusicSourceType('synth');
      setCurrentTrackTitle(preset.title);
      setYoutubeVideoId(null);
      startWebAudioSynth(preset.freq || 432);
      setIsPlayingMusic(true);
      triggerToast(`Đang phát: ${preset.title}`);
    }
  };

  const playCustomYoutubeUrl = (url: string): boolean => {
    const id = extractYouTubeVideoId(url);
    if (!id) {
      triggerToast('Link YouTube không hợp lệ, vui lòng kiểm tra lại!');
      return false;
    }
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      } catch {}
    }
    setMusicSourceType('youtube');
    setYoutubeVideoId(id);
    setCurrentTrackTitle(`YouTube Lofi (${id})`);
    setIsPlayingMusic(true);
    triggerToast(`Đang phát nhạc nền từ YouTube!`);
    return true;
  };

  useEffect(() => {
    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // ============================================================================
  // SAO LƯU & KHÔI PHỤC DỮ LIỆU (JSON EXPORT/IMPORT)
  // ============================================================================
  const exportPlannerData = () => {
    try {
      const backupData: PlannerBackupData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        themeId,
        tasks,
        habits,
        goals,
        yearly,
        youtubeVideoId,
        lifeScores,
        notificationSettings
      };
      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `planner-backup-${getTodayString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      triggerToast('Đã xuất file sao lưu planner-backup.json thành công!');
    } catch {
      triggerToast('Không thể xuất file sao lưu!');
    }
  };

  const importPlannerData = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        triggerToast('File không đúng định dạng!');
        return false;
      }
      if (Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
      if (Array.isArray(parsed.habits)) setHabits(parsed.habits);
      if (Array.isArray(parsed.goals)) setGoals(parsed.goals);
      if (parsed.yearly && Array.isArray(parsed.yearly.months)) setYearly(parsed.yearly);
      if (parsed.themeId && typeof parsed.themeId === 'string') setThemeId(parsed.themeId);
      if (parsed.youtubeVideoId) setYoutubeVideoId(parsed.youtubeVideoId);
      if (parsed.lifeScores && typeof parsed.lifeScores === 'object') setLifeScores(parsed.lifeScores);
      if (parsed.notificationSettings && typeof parsed.notificationSettings === 'object') setNotificationSettings(parsed.notificationSettings);

      triggerToast('Đã khôi phục dữ liệu từ file sao lưu thành công!');
      return true;
    } catch {
      triggerToast('Lỗi: File sao lưu JSON không hợp lệ!');
      return false;
    }
  };

  const resetToDefaultData = () => {
    const today = getTodayString();
    const newTasks = createInitialTasks(today);
    const newHabits = createInitialHabits(new Date().getDate());
    setTasks(newTasks);
    setHabits(newHabits);
    setGoals(INITIAL_GOALS);
    setYearly(INITIAL_YEAR_DATA);
    setLifeScores(DEFAULT_LIFE_SCORES);
    setNotificationSettings(DEFAULT_NOTIFICATION_SETTINGS);
    setSelectedDate(today);
    triggerToast('Đã khôi phục toàn bộ dữ liệu mẫu ban đầu!');
  };

  const clearAllData = () => {
    setTasks([]);
    setHabits([]);
    setGoals([]);
    setLifeScores(DEFAULT_LIFE_SCORES);
    setNotificationSettings(DEFAULT_NOTIFICATION_SETTINGS);
    setYearly({
      keyword: 'Mục tiêu mới',
      vision: 'Bắt đầu ghi chép kế hoạch cá nhân của bạn...',
      months: INITIAL_YEAR_DATA.months.map((m) => ({
        ...m,
        done: 0,
        total: 0,
        items: []
      }))
    });
    triggerToast('Đã xóa trắng toàn bộ dữ liệu mẫu! Sổ tay đã sẵn sàng cho kế hoạch của bạn.');
  };

  // ============================================================================
  // DERIVED VALUES: TÍNH TOÁN STREAK & THỐNG KÊ TIẾN ĐỘ THỰC TẾ
  // ============================================================================
  const todaysTasks = useMemo(() => {
    return tasks
      .filter((t) => t.date === selectedDate)
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const weightA = priorityWeight[a.priority] || 3;
        const weightB = priorityWeight[b.priority] || 3;
        return weightA - weightB;
      });
  }, [tasks, selectedDate]);

  const overdueTasks = useMemo(() => {
    return tasks.filter((t) => t.date < selectedDate && !t.completed);
  }, [tasks, selectedDate]);

  const selectedDayNumber = parseInt(selectedDate.split('-')[2], 10) || 23;

  const todayCompletionStats = useMemo(() => {
    const totalTasks = todaysTasks.length;
    const doneTasks = todaysTasks.filter((t) => t.completed).length;
    const doneHabits = habits.filter((h) => h.daysDone.includes(selectedDayNumber)).length;
    const totalItems = totalTasks + habits.length;
    const doneItems = doneTasks + doneHabits;
    const percent = totalItems === 0 ? 0 : Math.round((doneItems / totalItems) * 100);
    return { totalTasks, doneTasks, doneHabits, totalHabits: habits.length, percent };
  }, [todaysTasks, habits, selectedDayNumber]);

  // Tính Streak tự động dựa trên lịch sử thực tế của tasks và habits
  const currentStreak = useMemo(() => {
    return calculateStreak(tasks, habits, selectedDate);
  }, [tasks, habits, selectedDate]);

  // Tỉ lệ hoàn thành thói quen trung bình tháng
  const monthProgressRate = useMemo(() => {
    if (habits.length === 0) return 0;
    const sum = habits.reduce((acc, h) => acc + h.rate, 0);
    return Math.round(sum / habits.length);
  }, [habits]);

  // Tên thứ tiếng Việt đầy đủ (Thứ Hai, Thứ Ba... Chủ Nhật)
  const fullDayOfWeek = useMemo(() => {
    return getFullDayOfWeekLabel(selectedDate);
  }, [selectedDate]);

  // ============================================================================
  // HANDLERS CÔNG VIỆC VÀ THÓI QUEN
  // ============================================================================
  const addTask = (title?: string, priority?: string, recurrence?: string[], targetDate?: string) => {
    const finalTitle = title !== undefined ? title : newTaskTitle;
    const finalPriority = priority !== undefined ? priority : newTaskPriority;
    const finalRecurrence = recurrence !== undefined ? recurrence : newTaskRecurrence;
    const finalDate = targetDate !== undefined ? targetDate : selectedDate;

    if (!finalTitle.trim()) return;
    const newTask: Task = {
      id: 't_' + Date.now(),
      title: finalTitle.trim(),
      date: finalDate,
      completed: false,
      priority: finalPriority,
      recurrence: finalRecurrence,
      subtasks: []
    };
    setTasks((prev) => [newTask, ...prev]);
    if (title === undefined) {
      setNewTaskTitle('');
      setNewTaskPriority('normal');
      setNewTaskRecurrence([]);
    }
    triggerToast('Đã thêm việc mới vào danh sách!');
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    addTask();
  };

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const nextStatus = !t.completed;
        if (nextStatus) {
          playCelebrationSound();
          const remaining = todaysTasks.filter((item) => item.id !== taskId && !item.completed);
          if (remaining.length === 0) {
            setShowConfetti(true);
            triggerToast('🎉 Tuyệt vời! Bạn đã hoàn thành 100% công việc hôm nay!');
            setTimeout(() => setShowConfetti(false), 4000);
          }
        }
        return {
          ...t,
          completed: nextStatus,
          subtasks: t.subtasks.map((s) => ({ ...s, done: nextStatus }))
        };
      })
    );
  };

  const handleToggleTask = toggleTask;

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    triggerToast('Đã xóa công việc!');
  };

  const toggleSubtask = (taskId: string, subId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubs = t.subtasks.map((s) =>
          s.id === subId ? { ...s, done: !s.done } : s
        );
        const allSubDone = updatedSubs.length > 0 && updatedSubs.every((s) => s.done);
        if (allSubDone && !t.completed) {
          playCelebrationSound();
          triggerToast(`Đã hoàn thành toàn bộ bước nhỏ của "${t.title}"!`);
        }
        return {
          ...t,
          subtasks: updatedSubs,
          completed: allSubDone ? true : t.completed
        };
      })
    );
  };

  const handleToggleSubtask = toggleSubtask;

  const addSubtask = (taskId: string, subtaskTitle?: string) => {
    const finalTitle = subtaskTitle !== undefined ? subtaskTitle : newSubtaskText;
    if (!finalTitle.trim()) return;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        if (t.subtasks.length >= 6) {
          triggerToast('Mỗi việc lớn chia thành tối đa 6 việc con!');
          return t;
        }
        const updatedSubs = [
          ...t.subtasks,
          { id: 's_' + Date.now(), title: finalTitle.trim(), done: false }
        ];
        return { ...t, subtasks: updatedSubs, completed: false };
      })
    );
    setNewSubtaskText('');
  };

  const handleAddSubtask = (taskId: string) => {
    addSubtask(taskId);
  };

  // Dời việc sang ngày mai dùng hàm tính ngày addDaysToDate
  const moveToTomorrow = (taskId: string) => {
    const nextDate = addDaysToDate(selectedDate, 1);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, date: nextDate } : t))
    );
    triggerToast('Đã dời công việc sang ngày mai!');
  };

  const handleMoveToTomorrow = moveToTomorrow;

  const rolloverOverdueTasks = () => {
    if (overdueTasks.length === 0) return;
    const count = overdueTasks.length;
    setTasks((prev) =>
      prev.map((t) =>
        t.date < selectedDate && !t.completed ? { ...t, date: selectedDate } : t
      )
    );
    playCelebrationSound();
    triggerToast(`Đã chuyển ${count} việc còn tồn vào hôm nay!`);
  };

  const handleRolloverOverdue = rolloverOverdueTasks;

  const toggleHabitDate = (habitId: string, dayNum: number) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const exists = h.daysDone.includes(dayNum);
        const updatedDays = exists
          ? h.daysDone.filter((d) => d !== dayNum)
          : [...h.daysDone, dayNum];
        // Tính rate trên số ngày trong tháng (chuẩn 30-31 ngày)
        const daysInMonth = 31;
        const newRate = Math.min(100, Math.round((updatedDays.length / daysInMonth) * 100));
        return { ...h, daysDone: updatedDays, rate: newRate };
      })
    );
  };

  const handleToggleHabitDay = toggleHabitDate;

  const addHabit = (title: string) => {
    if (!title.trim()) return;
    setHabits((prev) => [
      ...prev,
      {
        id: 'h_' + Date.now(),
        title: title.trim(),
        rate: 10,
        daysDone: [selectedDayNumber]
      }
    ]);
    setNewHabitTitle('');
    triggerToast('Đã thêm thói quen mới!');
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    addHabit(newHabitTitle);
  };

  const deleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    triggerToast('Đã xóa thói quen!');
  };

  const updateHabit = (habitId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, title: newTitle.trim() } : h))
    );
    triggerToast('Đã đổi tên thói quen!');
  };

  // ============================================================================
  // HANDLERS MỤC TIÊU (GOALS) & BƯỚC NHỎ (STEPS) & RADAR CHÂM ĐIỂM
  // ============================================================================
  const updateLifeScore = (subject: string, score: number) => {
    setLifeScores((prev) => ({
      ...prev,
      [subject]: Math.max(0, Math.min(100, score))
    }));
  };

  const addGoal = (goalData: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: 'g_' + Date.now(),
      steps: goalData.steps || []
    };
    setGoals((prev) => [newGoal, ...prev]);
    triggerToast('Đã thêm mục tiêu mới!');
  };

  const updateGoal = (goalId: string, updated: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, ...updated } : g))
    );
    triggerToast('Đã cập nhật mục tiêu!');
  };

  const deleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
    triggerToast('Đã xóa mục tiêu!');
  };

  const toggleGoalStep = (goalId: string, stepId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updatedSteps = g.steps.map((s) =>
          s.id === stepId ? { ...s, done: !s.done } : s
        );
        const allDone = updatedSteps.length > 0 && updatedSteps.every((s) => s.done);
        if (allDone && g.status !== 'Đã hoàn thành') {
          playCelebrationSound();
          triggerToast(`🎉 Chúc mừng bạn đã hoàn thành mục tiêu "${g.title}"!`);
        }
        return {
          ...g,
          steps: updatedSteps,
          status: allDone ? 'Đã hoàn thành' : 'Đang thực hiện'
        };
      })
    );
  };

  const addGoalStep = (goalId: string, stepText: string) => {
    if (!stepText.trim()) return;
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const newStep: GoalStep = {
          id: 'gs_' + Date.now(),
          text: stepText.trim(),
          done: false
        };
        const updatedSteps = [...g.steps, newStep];
        return {
          ...g,
          steps: updatedSteps,
          status: 'Đang thực hiện'
        };
      })
    );
    triggerToast('Đã thêm bước nhỏ mới!');
  };

  const deleteGoalStep = (goalId: string, stepId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updatedSteps = g.steps.filter((s) => s.id !== stepId);
        const allDone = updatedSteps.length > 0 && updatedSteps.every((s) => s.done);
        return {
          ...g,
          steps: updatedSteps,
          status: allDone ? 'Đã hoàn thành' : (updatedSteps.length === 0 ? g.status : 'Đang thực hiện')
        };
      })
    );
    triggerToast('Đã xóa bước nhỏ!');
  };

  // ============================================================================
  // HANDLERS KẾ HOẠCH NĂM (YEARLY)
  // ============================================================================
  const addYearlyItem = (monthNum: number, text: string) => {
    if (!text.trim()) return;
    setYearly((prev) => {
      const updatedMonths = prev.months.map((m) => {
        if (m.month !== monthNum) return m;
        const newItems = [...m.items, { id: 'yi_' + Date.now(), text: text.trim(), done: false }];
        return {
          ...m,
          items: newItems,
          total: newItems.length
        };
      });
      return { ...prev, months: updatedMonths };
    });
    triggerToast(`Đã thêm mục tiêu Tháng ${monthNum}!`);
  };

  const deleteYearlyItem = (monthNum: number, itemId: string) => {
    setYearly((prev) => {
      const updatedMonths = prev.months.map((m) => {
        if (m.month !== monthNum) return m;
        const newItems = m.items.filter((it) => it.id !== itemId);
        const doneCount = newItems.filter((it) => it.done).length;
        return {
          ...m,
          items: newItems,
          total: newItems.length,
          done: doneCount
        };
      });
      return { ...prev, months: updatedMonths };
    });
    triggerToast('Đã xóa mục tiêu tháng!');
  };

  const toggleYearlyItem = (monthNum: number, itemId: string) => {
    setYearly((prev) => {
      const updatedMonths = prev.months.map((m) => {
        if (m.month !== monthNum) return m;
        const newItems = m.items.map((it) => (it.id === itemId ? { ...it, done: !it.done } : it));
        const doneCount = newItems.filter((it) => it.done).length;
        return {
          ...m,
          items: newItems,
          done: doneCount
        };
      });
      return { ...prev, months: updatedMonths };
    });
  };

  const updateYearlyMeta = (keyword: string, vision: string) => {
    setYearly((prev) => ({ ...prev, keyword, vision }));
  };

  // ============================================================================
  // HỆ THỐNG THÔNG BÁO & NHẮC NHỞ WEB (NOTIFICATIONS & PWA)
  // ============================================================================
  const triggerSystemNotification = async (title: string, options: NotificationOptions) => {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    if (Notification.permission !== 'granted') return false;

    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        if (reg && reg.showNotification) {
          await reg.showNotification(title, {
            icon: '/icon.svg',
            badge: '/icon.svg',
            ...options
          });
          return true;
        }
      }
    } catch (err) {
      console.warn('SW showNotification error:', err);
    }

    try {
      new Notification(title, {
        icon: '/icon.svg',
        badge: '/icon.svg',
        ...options
      });
      return true;
    } catch (err) {
      console.warn('Notification constructor error:', err);
      return false;
    }
  };

  const updateNotificationSettings = async (partial: Partial<NotificationSettings>) => {
    if (partial.enabled && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          triggerToast('Bạn chưa cấp quyền thông báo cho trình duyệt.');
          setNotificationSettings((prev) => ({ ...prev, enabled: false }));
          return;
        }
      }
    }
    setNotificationSettings((prev) => ({ ...prev, ...partial }));
    triggerToast('Đã lưu cài đặt thông báo!');
  };

  const sendTestNotification = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      triggerToast('Trình duyệt không hỗ trợ thông báo hệ thống.');
      return false;
    }

    let permission = Notification.permission;
    if (permission !== 'granted') {
      permission = await Notification.requestPermission();
    }

    if (permission !== 'granted') {
      triggerToast('Bạn chưa cấp quyền thông báo cho trình duyệt.');
      return false;
    }

    const remainingTasksCount = todaysTasks.filter((t) => !t.completed).length;
    const doneHabitsCount = habits.filter((h) => h.daysDone.includes(selectedDayNumber)).length;

    const success = await triggerSystemNotification('🔔 Nhắc nhở Planner (Thông báo thử)', {
      body: `Hôm nay bạn còn ${remainingTasksCount} việc chưa xong và đã hoàn thành ${doneHabitsCount}/${habits.length} thói quen!`,
      tag: 'planner-test-reminder'
    });

    if (success) {
      triggerToast('Đã gửi thông báo thử nghiệm thành công!');
    } else {
      triggerToast('Không thể gửi thông báo, vui lòng kiểm tra quyền trình duyệt.');
    }
    return success;
  };

  const installPwa = async () => {
    if (!deferredPromptRef.current) return;
    deferredPromptRef.current.prompt();
    const { outcome } = await deferredPromptRef.current.userChoice;
    if (outcome === 'accepted') {
      setIsPwaInstalled(true);
      setCanInstallPwa(false);
      triggerToast('Cài đặt ứng dụng Planner thành công!');
    }
    deferredPromptRef.current = null;
  };

  // Bộ đếm kiểm tra mỗi 30 giây để tự động nhắc sáng / tối
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkInterval = setInterval(async () => {
      if (!notificationSettings.enabled) return;
      if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;
      const todayStr = getTodayString();

      // 1. Nhắc buổi sáng
      if (
        currentTime === notificationSettings.morningTime &&
        notificationSettings.lastMorningNotifiedDate !== todayStr
      ) {
        setNotificationSettings((prev) => ({
          ...prev,
          lastMorningNotifiedDate: todayStr
        }));
        const remainingTasks = todaysTasks.filter((t) => !t.completed).length;
        await triggerSystemNotification('☀️ Chào buổi sáng từ Planner!', {
          body: `Hôm nay bạn có ${remainingTasks} việc cần hoàn thành trong sổ tay. Chúc bạn một ngày năng suất!`,
          tag: `planner-morning-${todayStr}`
        });
      }

      // 2. Nhắc buổi tối
      if (
        currentTime === notificationSettings.eveningTime &&
        notificationSettings.lastEveningNotifiedDate !== todayStr
      ) {
        setNotificationSettings((prev) => ({
          ...prev,
          lastEveningNotifiedDate: todayStr
        }));
        const doneHabits = habits.filter((h) => h.daysDone.includes(selectedDayNumber)).length;
        await triggerSystemNotification('🌙 Đừng quên tổng kết ngày nhé!', {
          body: `Đừng quên tổng kết ngày và tích ${doneHabits}/${habits.length} thói quen hôm nay nhé!`,
          tag: `planner-evening-${todayStr}`
        });
      }
    }, 30000);

    return () => clearInterval(checkInterval);
  }, [notificationSettings, todaysTasks, habits, selectedDayNumber]);

  const value: PlannerContextType = {
    themeId,
    setThemeId,
    currentTheme,
    activeTab,
    setActiveTab,
    selectedDate,
    setSelectedDate,
    mobileMenuOpen,
    setMobileMenuOpen,
    showFloatingPalette,
    setShowFloatingPalette,
    toastMessage,
    triggerToast,
    showConfetti,
    setShowConfetti,
    user,
    setUser,
    showAuthModal,
    setShowAuthModal,
    login,
    logout,
    syncStatus,
    setSyncStatus,
    syncToCloudNow,
    isCloudConfigured,
    isPlayingMusic,
    setIsPlayingMusic,
    currentTrackIndex,
    setCurrentTrackIndex,
    toggleMusic,
    youtubeVideoId,
    setYoutubeVideoId,
    musicSourceType,
    setMusicSourceType,
    currentTrackTitle,
    setCurrentTrackTitle,
    showMusicPopover,
    setShowMusicPopover,
    playPresetTrack,
    playCustomYoutubeUrl,
    tasks,
    setTasks,
    habits,
    setHabits,
    goals,
    setGoals,
    yearData: yearly,
    setYearData: setYearly,
    yearly,
    setYearly,
    lifeScores,
    setLifeScores,
    updateLifeScore,
    showDataModal,
    setShowDataModal,
    exportPlannerData,
    importPlannerData,
    resetToDefaultData,
    clearAllData,
    newTaskTitle,
    setNewTaskTitle,
    newTaskPriority,
    setNewTaskPriority,
    newTaskRecurrence,
    setNewTaskRecurrence,
    expandedTaskId,
    setExpandedTaskId,
    newSubtaskText,
    setNewSubtaskText,
    newHabitTitle,
    setNewHabitTitle,
    calendarMode,
    setCalendarMode,
    statsPeriod,
    setStatsPeriod,
    chartType,
    setChartType,
    todaysTasks,
    overdueTasks,
    todayCompletionStats,
    selectedDayNumber,
    currentStreak,
    monthProgressRate,
    fullDayOfWeek,
    addTask,
    handleAddTask,
    toggleTask,
    handleToggleTask,
    deleteTask,
    addSubtask,
    handleAddSubtask,
    toggleSubtask,
    handleToggleSubtask,
    moveToTomorrow,
    handleMoveToTomorrow,
    rolloverOverdueTasks,
    handleRolloverOverdue,
    toggleHabitDate,
    handleToggleHabitDay,
    addHabit,
    handleAddHabit,
    deleteHabit,
    updateHabit,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleGoalStep,
    addGoalStep,
    deleteGoalStep,
    addYearlyItem,
    deleteYearlyItem,
    toggleYearlyItem,
    updateYearlyMeta,
    showNotificationModal,
    setShowNotificationModal,
    notificationSettings,
    setNotificationSettings,
    updateNotificationSettings,
    sendTestNotification,
    canInstallPwa,
    installPwa,
    isPwaInstalled,
    isIOSDevice
  };

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner(): PlannerContextType {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
}
