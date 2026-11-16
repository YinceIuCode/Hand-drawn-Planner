import { Theme, TrendItem, ChillTrack, MusicTrackPreset } from '@/types/planner';

// ============================================================================
// 1. CẤU HÌNH 9 BỘ MÀU (THEMES) CHUẨN THEO ẢNH THAM CHIẾU
// ============================================================================
export const THEMES: Theme[] = [
  {
    id: 'bamboo',
    name: 'Xanh tre',
    bgGrid: '#f1f6f0',
    gridLine: '#dce6d9',
    cardBg: '#ffffff',
    textMain: '#143628',
    textMuted: '#5c7467',
    primary: '#0f6848',
    primaryLight: '#d3f3e4',
    accent: '#e8f5e9',
    border: '#1c2b24',
    swatches: ['#0f6848', '#80cfa9', '#d3f3e4']
  },
  {
    id: 'neon-night',
    name: 'Đêm neon',
    bgGrid: '#f3f1f8',
    gridLine: '#e4dff0',
    cardBg: '#ffffff',
    textMain: '#231942',
    textMuted: '#6c608a',
    primary: '#432399',
    primaryLight: '#f3c4dc',
    accent: '#ebe5fc',
    border: '#231942',
    swatches: ['#432399', '#e07a9b', '#f3c4dc']
  },
  {
    id: 'pastel-pink',
    name: 'Hồng phấn',
    bgGrid: '#fdf4f5',
    gridLine: '#f3e1e4',
    cardBg: '#ffffff',
    textMain: '#4a2531',
    textMuted: '#8e6370',
    primary: '#d65780',
    primaryLight: '#fce1e9',
    accent: '#fdf0f4',
    border: '#3b1d26',
    swatches: ['#d65780', '#f49cbb', '#fce1e9']
  },
  {
    id: 'lavender',
    name: 'Tím oải hương',
    bgGrid: '#f6f4fb',
    gridLine: '#e7e2f3',
    cardBg: '#ffffff',
    textMain: '#2d2346',
    textMuted: '#736694',
    primary: '#7c5cbf',
    primaryLight: '#e5dcf9',
    accent: '#f2effc',
    border: '#2d2346',
    swatches: ['#7c5cbf', '#b39ddb', '#e5dcf9']
  },
  {
    id: 'sunny-amber',
    name: 'Nắng sớm',
    bgGrid: '#fdf9f0',
    gridLine: '#f2e8d5',
    cardBg: '#ffffff',
    textMain: '#3d2c19',
    textMuted: '#856d52',
    primary: '#d97724',
    primaryLight: '#fde6ce',
    accent: '#fef5eb',
    border: '#362614',
    swatches: ['#d97724', '#f6ad55', '#fde6ce']
  },
  {
    id: 'ocean',
    name: 'Xanh biển',
    bgGrid: '#f0f7fa',
    gridLine: '#d9eaf2',
    cardBg: '#ffffff',
    textMain: '#163242',
    textMuted: '#58788a',
    primary: '#1d70a2',
    primaryLight: '#d2eaf7',
    accent: '#ebf5fb',
    border: '#163242',
    swatches: ['#1d70a2', '#63b3ed', '#d2eaf7']
  },
  {
    id: 'matcha',
    name: 'Matcha',
    bgGrid: '#f5f7ee',
    gridLine: '#e3e8d3',
    cardBg: '#ffffff',
    textMain: '#2b3618',
    textMuted: '#687550',
    primary: '#5c7c29',
    primaryLight: '#e2f0cb',
    accent: '#f1f7e6',
    border: '#2b3618',
    swatches: ['#5c7c29', '#9ccc65', '#e2f0cb']
  },
  {
    id: 'rose-quartz',
    name: 'Thạch anh',
    bgGrid: '#f9f5f3',
    gridLine: '#ebe2de',
    cardBg: '#ffffff',
    textMain: '#382a27',
    textMuted: '#7d6863',
    primary: '#a8645b',
    primaryLight: '#f2dcd9',
    accent: '#f9efed',
    border: '#382a27',
    swatches: ['#a8645b', '#cfa19b', '#f2dcd9']
  },
  {
    id: 'monochrome',
    name: 'Đen trắng',
    bgGrid: '#f5f5f5',
    gridLine: '#e5e5e5',
    cardBg: '#ffffff',
    textMain: '#171717',
    textMuted: '#666666',
    primary: '#262626',
    primaryLight: '#e5e5e5',
    accent: '#f0f0f0',
    border: '#171717',
    swatches: ['#262626', '#737373', '#e5e5e5']
  }
];

export const GOAL_CATEGORIES = [
  'Học tập',
  'Sức khỏe',
  'Tài chính',
  'Phát triển',
  'Sự nghiệp',
  'Gia đình',
  'Quan hệ',
  'Sở thích'
] as const;

export const DEFAULT_LIFE_SCORES: Record<string, number> = {
  'Sức khỏe': 65,
  'Tài chính': 55,
  'Sự nghiệp': 80,
  'Phát triển': 70,
  'Quan hệ': 45,
  'Học tập': 75,
  'Gia đình': 60,
  'Sở thích': 50
};

export const LIFE_AREAS = [
  'Sức khỏe',
  'Tài chính',
  'Sự nghiệp',
  'Phát triển',
  'Quan hệ',
  'Học tập',
  'Gia đình',
  'Sở thích'
] as const;

export const DAYS_OF_WEEK_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] as const;

// ============================================================================
// HÀM XỬ LÝ LỊCH VÀ THỜI GIAN THỰC (REAL-TIME CALENDAR)
// ============================================================================

/** Lấy ngày hôm nay thực tế theo múi giờ địa phương (định dạng YYYY-MM-DD) */
export const getTodayString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const DEFAULT_DATE_STR = '2026-10-23';
export const DEFAULT_STATIC_DATE = DEFAULT_DATE_STR;
export const TODAY_STR = DEFAULT_DATE_STR;

/** Cộng/trừ số ngày vào một ngày cụ thể (YYYY-MM-DD) */
export const addDaysToDate = (dateStr: string, days: number): string => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  const nextYear = date.getFullYear();
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0');
  const nextDay = String(date.getDate()).padStart(2, '0');
  return `${nextYear}-${nextMonth}-${nextDay}`;
};

/** Lấy mã thứ lặp lại (T2, T3, T4, T5, T6, T7, CN) từ chuỗi ngày YYYY-MM-DD */
export const getDayOfWeekTag = (dateStr: string): string => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const day = date.getDay(); // 0: CN, 1: T2, ...
  const map: Record<number, string> = {
    0: 'CN',
    1: 'T2',
    2: 'T3',
    3: 'T4',
    4: 'T5',
    5: 'T6',
    6: 'T7'
  };
  return map[day] || 'T2';
};

/** Lấy tên thứ đầy đủ tiếng Việt (Thứ Hai, Thứ Ba... Chủ Nhật) */
export const getFullDayOfWeekLabel = (dateStr: string): string => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const day = date.getDay();
  const map: Record<number, string> = {
    0: 'Chủ Nhật',
    1: 'Thứ Hai',
    2: 'Thứ Ba',
    3: 'Thứ Tư',
    4: 'Thứ Năm',
    5: 'Thứ Sáu',
    6: 'Thứ Bảy'
  };
  return map[day] || 'Thứ Hai';
};

/** Tách videoId từ URL YouTube bất kỳ hoặc mã 11 ký tự */
export const extractYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : null;
};

/** Tính chuỗi ngày liên tục (Streak) dựa trên lịch sử tasks và habits */
export const calculateStreak = (
  tasks: { date: string; completed: boolean }[],
  habits: { daysDone: number[] }[],
  currentDateStr: string
): number => {
  if (!currentDateStr) return 0;
  const checkDayActivity = (targetDate: string): boolean => {
    const hasTaskDone = tasks.some((t) => t.date === targetDate && t.completed);
    const dayNum = parseInt(targetDate.split('-')[2], 10);
    const hasHabitDone = habits.some((h) => h.daysDone.includes(dayNum));
    return hasTaskDone || hasHabitDone;
  };

  let streak = 0;
  const isTodayActive = checkDayActivity(currentDateStr);

  let checkDate = currentDateStr;
  if (isTodayActive) {
    streak = 1;
    checkDate = addDaysToDate(checkDate, -1);
  } else {
    // Nếu hôm nay chưa làm việc nào, kiểm tra hôm qua để bảo toàn streak đang có
    const yesterday = addDaysToDate(currentDateStr, -1);
    if (checkDayActivity(yesterday)) {
      streak = 1;
      checkDate = addDaysToDate(yesterday, -1);
    } else {
      return 0;
    }
  }

  // Đếm lùi các ngày liên tục trước đó (tối đa 365 ngày)
  for (let i = 0; i < 365; i++) {
    if (checkDayActivity(checkDate)) {
      streak++;
      checkDate = addDaysToDate(checkDate, -1);
    } else {
      break;
    }
  }

  return streak;
};

export const TREND_DATA: TrendItem[] = [
  { label: '31/08', rate: 74, tasks: 22 },
  { label: '07/09', rate: 70, tasks: 20 },
  { label: '14/09', rate: 81, tasks: 25 },
  { label: '21/09', rate: 82, tasks: 26 },
  { label: '28/09', rate: 68, tasks: 19 },
  { label: '05/10', rate: 56, tasks: 16 },
  { label: '12/10', rate: 89, tasks: 29 },
  { label: '19/10', rate: 66, tasks: 21 }
];

export const CHILL_TRACKS: ChillTrack[] = [
  { id: 1, title: 'Mưa rơi bên hiên nhà (Lofi Chill)', freq: 432 },
  { id: 2, title: 'Góc bàn học đêm khuya (Piano nhẹ)', freq: 528 },
  { id: 3, title: 'Sáng Chủ nhật tại quán quen (Acoustic)', freq: 396 }
];

export const CHILL_PRESETS: MusicTrackPreset[] = [
  {
    id: 'lofi-girl',
    title: 'Lofi Girl - Beats to relax/study',
    type: 'youtube',
    videoId: 'jfKfPfyJRdk'
  },
  {
    id: 'chillhop',
    title: 'Chillhop Radio - Jazzy Lofi',
    type: 'youtube',
    videoId: '5yx6BWlEVcY'
  },
  {
    id: 'synthwave',
    title: 'Synthwave Chill - Retro Beats',
    type: 'youtube',
    videoId: '4xDzrJKXOOY'
  },
  {
    id: 'rain-synth',
    title: 'Mưa rơi hiên nhà (Lofi WebSynth)',
    type: 'synth',
    freq: 432
  },
  {
    id: 'night-piano',
    title: 'Góc học đêm khuya (Piano Synth)',
    type: 'synth',
    freq: 528
  }
];

// ============================================================================
// HÀM TIỆN ÍCH ÂM THANH WEB AUDIO API
// ============================================================================
export const playCelebrationSound = () => {
  try {
    if (typeof window === 'undefined') return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.35);
    });
  } catch {
    // Ignore audio errors if blocked by browser
  }
};

export const playLofiChord = () => {
  try {
    if (typeof window === 'undefined') return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const chord = [261.63, 329.63, 392.0, 523.25];
    chord.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    });
  } catch {
    // Ignore audio error
  }
};

export const DEFAULT_NOTIFICATION_SETTINGS = {
  enabled: false,
  morningTime: '08:00',
  eveningTime: '21:30'
};
