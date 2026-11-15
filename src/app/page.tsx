"use client"

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles, Target, CheckCircle2, Calendar, Mountain, BarChart3,
  Plus, Trash2, ChevronRight, ChevronLeft, Flame, Music, Volume2,
  VolumeX, Palette, RotateCcw, AlertCircle, Star, Check, ListTodo,
  Clock, Award, TrendingUp, Layers, Info, Play, Pause, SkipForward,
  Menu, X, Bell, ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, Cell
} from 'recharts';

// ============================================================================
// 1. CẤU HÌNH 9 BỘ MÀU (THEMES) CHUẨN THEO ẢNH THAM CHIẾU
// ============================================================================
const THEMES = [
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
    name: 'Trà xanh Matcha',
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
    name: 'Hồng thạch anh',
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
    name: 'Đen trắng tối giản',
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

// ============================================================================
// 2. DỮ LIỆU MẪU CHUẨN THEO ẢNH SCREENSHOT CỦA NGƯỜI DÙNG
// ============================================================================
const INITIAL_TASKS = [
  {
    id: 't1',
    title: 'Ôn 20 từ vựng HSK 3',
    date: '2026-10-23',
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
    date: '2026-10-23',
    completed: true,
    priority: 'important',
    recurrence: [],
    subtasks: []
  },
  {
    id: 't3',
    title: 'Trả lời email khách hàng',
    date: '2026-10-23',
    completed: true,
    priority: 'urgent',
    recurrence: [],
    subtasks: []
  },
  {
    id: 't4',
    title: 'Họp nhóm lúc 9 giờ',
    date: '2026-10-23',
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
    date: '2026-10-23',
    completed: false,
    priority: 'important',
    recurrence: ['T3', 'T5', 'T7'],
    subtasks: []
  },
  {
    id: 't6',
    title: 'Viết 5 câu với ngữ pháp mới',
    date: '2026-10-23',
    completed: false,
    priority: 'normal',
    recurrence: [],
    subtasks: []
  },
  {
    id: 't7',
    title: 'Gọi điện cho gia đình',
    date: '2026-10-23',
    completed: false,
    priority: 'normal',
    recurrence: ['CN'],
    subtasks: []
  },
  // Việc còn tồn từ những ngày trước để test nút "Chuyển việc tồn"
  {
    id: 't8',
    title: 'Chỉnh sửa slide thuyết trình',
    date: '2026-10-21',
    completed: false,
    priority: 'urgent',
    recurrence: [],
    subtasks: []
  },
  {
    id: 't9',
    title: 'Thanh toán hóa đơn điện nước',
    date: '2026-10-22',
    completed: false,
    priority: 'important',
    recurrence: [],
    subtasks: []
  }
];

const INITIAL_HABITS = [
  {
    id: 'h1',
    title: 'Uống đủ 2 lít nước',
    rate: 96,
    daysDone: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
  },
  {
    id: 'h2',
    title: 'Học từ vựng 20 phút',
    rate: 70,
    daysDone: [2, 3, 4, 6, 7, 8, 10, 12, 13, 15, 16, 17, 19, 20, 21, 23]
  },
  {
    id: 'h3',
    title: 'Đọc sách 15 phút',
    rate: 74,
    daysDone: [1, 2, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 16, 18, 19, 21, 23]
  },
  {
    id: 'h4',
    title: 'Tập thể dục',
    rate: 48,
    daysDone: [2, 4, 6, 9, 11, 13, 15, 17, 19, 21, 22]
  },
  {
    id: 'h5',
    title: 'Thiền 10 phút',
    rate: 30,
    daysDone: [3, 6, 7, 10, 14, 18, 20]
  },
  {
    id: 'h6',
    title: 'Đi ngủ trước 23 giờ',
    rate: 74,
    daysDone: [1, 2, 3, 5, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 19, 20, 22]
  }
];

const INITIAL_GOALS = [
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

const INITIAL_YEARLY = {
  keyword: 'Bứt phá',
  vision: 'Cuối năm nay, mình tự tin giao tiếp tiếng Trung, đạt HSK 4, khỏe mạnh hơn và có quỹ dự phòng vững vàng.',
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
    { month: 12, done: 0, total: 4, items: [{ id: 'm12', text: 'Tổng kết năm 2026 & đón Tết', done: false }] }
  ]
};

const TREND_DATA = [
  { label: '31/08', rate: 74, tasks: 22 },
  { label: '07/09', rate: 70, tasks: 20 },
  { label: '14/09', rate: 81, tasks: 25 },
  { label: '21/09', rate: 82, tasks: 26 },
  { label: '28/09', rate: 68, tasks: 19 },
  { label: '05/10', rate: 56, tasks: 16 },
  { label: '12/10', rate: 89, tasks: 29 },
  { label: '19/10', rate: 66, tasks: 21 }
];

const CHILL_TRACKS = [
  { id: 1, title: 'Mưa rơi bên hiên nhà (Lofi Chill)', freq: 432 },
  { id: 2, title: 'Góc bàn học đêm khuya (Piano nhẹ)', freq: 528 },
  { id: 3, title: 'Sáng Chủ nhật tại quán quen (Acoustic)', freq: 396 }
];

// ============================================================================
// 3. MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // State quản lý Theme, Tab đang mở & ngày đang chọn
  const [themeId, setThemeId] = useState('bamboo');
  const [activeTab, setActiveTab] = useState('today');
  const [selectedDate, setSelectedDate] = useState('2026-10-23');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFloatingPalette, setShowFloatingPalette] = useState(true);

  // State dữ liệu chính
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [habits, setHabits] = useState(INITIAL_HABITS);
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [yearly, setYearly] = useState(INITIAL_YEARLY);

  // State form thêm việc ở tab Hôm nay
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('normal');
  const [newTaskRecurrence, setNewTaskRecurrence] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState('t4');
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [calendarMode, setCalendarMode] = useState('month');
  const [statsPeriod, setStatsPeriod] = useState('8w');
  const [chartType, setChartType] = useState('line');

  // State hiệu ứng pháo hoa & thông báo
  const [toastMessage, setToastMessage] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // State trình phát nhạc Lofi Web Audio synthesizer (chạy offline không lỗi bản quyền)
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);

  const currentTheme = useMemo(
    () => THEMES.find((t) => t.id === themeId) || THEMES[0],
    [themeId]
  );

  // Hiển thị thông báo ngắn (thay thế hoàn toàn alert)
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Trình tạo âm thanh chúc mừng hoặc Lofi Ambient nhẹ nhàng bằng Web Audio API
  const playCelebrationSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
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
    } catch (e) {
      // Ignore audio errors if blocked by browser
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
      } else {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(CHILL_TRACKS[currentTrackIndex].freq / 2, ctx.currentTime);
        gain.gain.setValueAtTime(0.025, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscRef.current = osc;
        setIsPlayingMusic(true);
        triggerToast(`Đang phát: ${CHILL_TRACKS[currentTrackIndex].title}`);
      }
    } catch (e) {
      setIsPlayingMusic(!isPlayingMusic);
    }
  };

  useEffect(() => {
    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  // ============================================================================
  // 4. LOGIC NGHIỆP VỤ CỐT LÕI TAB "HÔM NAY"
  // ============================================================================
  const priorityWeight = { urgent: 1, important: 2, normal: 3 };

  const todaysTasks = useMemo(() => {
    return tasks
      .filter((t) => t.date === selectedDate)
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return priorityWeight[a.priority] - priorityWeight[b.priority];
      });
  }, [tasks, selectedDate]);

  const overdueTasks = useMemo(() => {
    return tasks.filter((t) => t.date < selectedDate && !t.completed);
  }, [tasks, selectedDate]);

  const todayCompletionStats = useMemo(() => {
    const totalTasks = todaysTasks.length;
    const doneTasks = todaysTasks.filter((t) => t.completed).length;
    const dayNum = parseInt(selectedDate.split('-')[2], 10) || 23;
    const doneHabits = habits.filter((h) => h.daysDone.includes(dayNum)).length;
    const totalItems = totalTasks + habits.length;
    const doneItems = doneTasks + doneHabits;
    const percent = totalItems === 0 ? 0 : Math.round((doneItems / totalItems) * 100);
    return { totalTasks, doneTasks, doneHabits, totalHabits: habits.length, percent };
  }, [todaysTasks, habits, selectedDate]);

  // Thêm công việc mới
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: 't_' + Date.now(),
      title: newTaskTitle.trim(),
      date: selectedDate,
      completed: false,
      priority: newTaskPriority,
      recurrence: newTaskRecurrence,
      subtasks: []
    };
    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
    setNewTaskPriority('normal');
    setNewTaskRecurrence([]);
    triggerToast('Đã thêm việc mới vào danh sách!');
  };

  // Tích chọn hoàn thành công việc
  const handleToggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const nextStatus = !t.completed;
        if (nextStatus) {
          playCelebrationSound();
          // Kiểm tra nếu đây là việc cuối cùng trong ngày
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

  // Tích chọn việc con (Subtask) -> Xong hết tự động xong việc lớn
  const handleToggleSubtask = (taskId, subId) => {
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

  // Thêm việc con (Tối đa 6 việc con theo đúng đặc tả)
  const handleAddSubtask = (taskId) => {
    if (!newSubtaskText.trim()) return;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        if (t.subtasks.length >= 6) {
          triggerToast('Mỗi việc lớn chia thành tối đa 6 việc con!');
          return t;
        }
        const updatedSubs = [
          ...t.subtasks,
          { id: 's_' + Date.now(), title: newSubtaskText.trim(), done: false }
        ];
        return { ...t, subtasks: updatedSubs, completed: false };
      })
    );
    setNewSubtaskText('');
  };

  // Chuyển việc sang ngày mai ("Mai >")
  const handleMoveToTomorrow = (taskId) => {
    const parts = selectedDate.split('-');
    const day = parseInt(parts[2], 10);
    const nextDay = day < 31 ? day + 1 : 1;
    const nextDate = `2026-10-${String(nextDay).padStart(2, '0')}`;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, date: nextDate } : t))
    );
    triggerToast('Đã dời công việc sang ngày mai!');
  };

  // Chuyển toàn bộ việc còn tồn của các ngày trước vào hôm nay chỉ bằng 1 nút
  const handleRolloverOverdue = () => {
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

  // Tích chọn thói quen theo ngày
  const handleToggleHabitDay = (habitId, dayNum) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const exists = h.daysDone.includes(dayNum);
        const updatedDays = exists
          ? h.daysDone.filter((d) => d !== dayNum)
          : [...h.daysDone, dayNum];
        const newRate = Math.min(100, Math.round((updatedDays.length / 23) * 100));
        return { ...h, daysDone: updatedDays, rate: newRate };
      })
    );
  };

  const selectedDayNumber = parseInt(selectedDate.split('-')[2], 10) || 23;

  // ============================================================================
  // 5. NAVIGATION ITEMS
  // ============================================================================
  const NAV_ITEMS = [
    { id: 'today', label: 'Hôm nay', icon: Sparkles },
    { id: 'goals', label: 'Mục tiêu & tầm nhìn', icon: Target },
    { id: 'habits', label: 'Theo dõi thói quen', icon: CheckCircle2 },
    { id: 'weekly', label: 'Kế hoạch tuần', icon: Calendar },
    { id: 'yearly', label: 'Kế hoạch năm', icon: Mountain },
    { id: 'stats', label: 'Thống kê', icon: BarChart3 }
  ];

  return (
    <div
      style={{
        '--bg-grid': currentTheme.bgGrid,
        '--grid-line': currentTheme.gridLine,
        '--card-bg': currentTheme.cardBg,
        '--text-main': currentTheme.textMain,
        '--text-muted': currentTheme.textMuted,
        '--primary': currentTheme.primary,
        '--primary-light': currentTheme.primaryLight,
        '--accent': currentTheme.accent,
        '--border-color': currentTheme.border
      }}
      className="min-h-screen w-full font-sans transition-colors duration-300 relative overflow-x-hidden"
    >
      {/* Import Google Fonts & Custom CSS cho phong cách Vẽ Tay (Hand-drawn Sketchy UI) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .planner-grid-bg {
          background-color: var(--bg-grid);
          background-image:
            linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px);
          background-size: 24px 24px;
          color: var(--text-main);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .font-hand {
          font-family: 'Patrick Hand', cursive, sans-serif;
          letter-spacing: 0.02em;
        }

        /* Viền khung nét vẽ tay đặc trưng */
        .sketch-card {
          background-color: var(--card-bg);
          border: 2px solid var(--border-color);
          border-radius: 18px 255px 15px 255px / 255px 15px 225px 18px;
          box-shadow: 2px 3px 0px var(--border-color);
          position: relative;
        }

        .sketch-card-alt {
          background-color: var(--card-bg);
          border: 2px solid var(--border-color);
          border-radius: 255px 16px 225px 16px / 16px 225px 16px 255px;
          box-shadow: 2px 3px 0px var(--border-color);
        }

        .sketch-btn {
          border: 1.8px solid var(--border-color);
          border-radius: 255px 20px 225px 20px / 20px 225px 20px 255px;
          box-shadow: 1.5px 2px 0px var(--border-color);
          transition: all 0.15s ease;
        }
        .sketch-btn:hover {
          transform: translate(-1px, -1px);
          box-shadow: 2.5px 3px 0px var(--border-color);
        }
        .sketch-btn:active {
          transform: translate(1px, 1px);
          box-shadow: 0px 0px 0px var(--border-color);
        }

        .sketch-input {
          border: 1.8px solid var(--border-color);
          border-radius: 25px 255px 25px 225px / 225px 25px 255px 25px;
        }

        @keyframes floatConfetti {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti-piece {
          position: fixed;
          top: 0;
          width: 10px;
          height: 16px;
          z-index: 9999;
          animation: floatConfetti 2.8s ease-out forwards;
        }
      `}</style>

      <div className="planner-grid-bg min-h-screen flex flex-col lg:flex-row p-2 sm:p-4 gap-4">
        {/* Hiệu ứng Pháo Hoa khi hoàn thành 100% công việc ngày */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: 45 }).map((_, i) => (
              <div
                key={i}
                className="confetti-piece rounded-sm"
                style={{
                  left: `${(i * 100) / 45}%`,
                  backgroundColor: ['#0f6848', '#f59e0b', '#ec4899', '#6366f1', '#10b981'][i % 5],
                  animationDelay: `${(i % 7) * 0.12}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Thông báo Toast góc trên */}
        {toastMessage && (
          <div className="fixed top-4 right-4 z-50 sketch-card px-4 py-2.5 flex items-center gap-2 bg-white text-sm font-semibold animate-bounce">
            <Sparkles className="w-4 h-4" style={{ color: currentTheme.primary }} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ====================================================================
            HEADER MOBILE (Chỉ hiện trên màn hình điện thoại)
           ==================================================================== */}
        <div className="lg:hidden sketch-card px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-extrabold text-lg sketch-btn"
              style={{ backgroundColor: currentTheme.primary }}
            >
              P
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-lg block leading-none">
                PLANNER
              </span>
              <span className="text-[10px] font-bold tracking-widest opacity-60">
                HAND-DRAWN EDITION
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMusic}
              className="sketch-btn p-2 bg-white"
              title="Nhạc nền chill"
            >
              {isPlayingMusic ? (
                <Volume2 className="w-4 h-4" style={{ color: currentTheme.primary }} />
              ) : (
                <Music className="w-4 h-4 opacity-70" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sketch-btn p-2 bg-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ====================================================================
            SIDEBAR ĐIỀU HƯỚNG BÊN TRÁI (Chuẩn theo ảnh 1)
           ==================================================================== */}
        <aside
          className={`${
            mobileMenuOpen ? 'flex' : 'hidden'
          } lg:flex flex-col justify-between w-full lg:w-64 shrink-0 sketch-card p-4 lg:min-h-[calc(100vh-2rem)]`}
        >
          <div>
            {/* Logo */}
            <div className="hidden lg:flex items-center gap-3 px-2 pt-1 pb-6">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-xl sketch-btn"
                style={{ backgroundColor: currentTheme.primary }}
              >
                P
              </div>
              <div>
                <h1
                  className="font-black text-xl tracking-wide leading-none"
                  style={{ color: currentTheme.primary }}
                >
                  PLANNER
                </h1>
                <p className="text-[10px] font-bold tracking-widest opacity-60 mt-0.5">
                  DIGITAL NOTEBOOK
                </p>
              </div>
            </div>

            {/* 6 Mục điều hướng chính */}
            <nav className="space-y-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      backgroundColor: isActive ? currentTheme.primaryLight : 'transparent'
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-bold transition-all ${
                      isActive ? 'sketch-btn' : 'hover:opacity-80 rounded-xl'
                    }`}
                  >
                    <Icon
                      className="w-4 h-4 shrink-0"
                      style={{ color: isActive ? currentTheme.primary : currentTheme.textMuted }}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tiện ích góc dưới Sidebar: Nhạc nền chill + Đổi bộ màu */}
          <div className="pt-6 space-y-3 border-t border-dashed border-gray-200 mt-6">
            {/* Widget Nhạc nền Chill */}
            <div
              className="sketch-card-alt p-2.5 text-xs"
              style={{ backgroundColor: currentTheme.accent }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
                  Nhạc nền chill
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleMusic}
                    className="sketch-btn px-2 py-0.5 bg-white text-[11px] font-bold flex items-center gap-1"
                  >
                    {isPlayingMusic ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    {isPlayingMusic ? 'Dừng' : 'Phát'}
                  </button>
                  <button
                    onClick={() => {
                      const nextIdx = (currentTrackIndex + 1) % CHILL_TRACKS.length;
                      setCurrentTrackIndex(nextIdx);
                      triggerToast(`Chuyển bài: ${CHILL_TRACKS[nextIdx].title}`);
                    }}
                    className="sketch-btn p-1 bg-white"
                    title="Đổi bài"
                  >
                    <SkipForward className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <p className="truncate text-[11px] opacity-75">
                {CHILL_TRACKS[currentTrackIndex].title}
              </p>
            </div>

            {/* Nút Bộ màu */}
            <button
              onClick={() => setShowFloatingPalette(!showFloatingPalette)}
              className="w-full sketch-btn p-2.5 bg-white flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4" style={{ color: currentTheme.primary }} />
                <div className="text-left">
                  <span className="block text-[10px] opacity-60 leading-none">Bộ màu</span>
                  <span className="font-bold">{currentTheme.name}</span>
                </div>
              </div>
              <div className="flex -space-x-1">
                {currentTheme.swatches.map((hex, i) => (
                  <span
                    key={i}
                    className="w-3.5 h-3.5 rounded-full border border-black/30"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </button>
          </div>
        </aside>

        {/* ====================================================================
            VÙNG NỘI DUNG CHÍNH BÊN PHẢI (6 PHÂN HỆ)
           ==================================================================== */}
        <main className="flex-1 min-w-0 space-y-4 pb-16">
          {/* ==================================================================
              TAB 1: HÔM NAY (SPRINT 1 CORE MVP)
             ================================================================== */}
          {activeTab === 'today' && (
            <div className="space-y-4">
              {/* Thanh tiêu đề & Vòng phần trăm tiến độ của ngày */}
              <div className="sketch-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Vòng tròn % tiến độ */}
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        fill="none"
                        stroke={currentTheme.gridLine}
                        strokeWidth="6"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        fill="none"
                        stroke={currentTheme.primary}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 26}
                        strokeDashoffset={
                          2 * Math.PI * 26 * (1 - todayCompletionStats.percent / 100)
                        }
                        className="transition-all duration-500"
                      />
                    </svg>
                    <span className="absolute text-sm font-black">
                      {todayCompletionStats.percent}%
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl sm:text-2xl font-extrabold">
                        Hôm nay · {selectedDate.split('-').reverse().slice(0, 2).join('/')}
                      </h2>
                      <span
                        className="text-xs font-bold px-2.5 py-0.5 rounded-full border border-current"
                        style={{
                          backgroundColor: currentTheme.primaryLight,
                          color: currentTheme.primary
                        }}
                      >
                        Thứ Sáu
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm opacity-75 mt-0.5">
                      Đã xong{' '}
                      <strong>
                        {todayCompletionStats.doneTasks}/{todayCompletionStats.totalTasks}
                      </strong>{' '}
                      việc hôm nay ·{' '}
                      <strong>
                        {todayCompletionStats.doneHabits}/{todayCompletionStats.totalHabits}
                      </strong>{' '}
                      thói quen
                    </p>
                  </div>
                </div>

                {/* Nút "Chuyển việc còn tồn vào hôm nay" */}
                <div className="flex items-center gap-2 flex-wrap">
                  {overdueTasks.length > 0 ? (
                    <button
                      onClick={handleRolloverOverdue}
                      className="sketch-btn px-3.5 py-2 text-xs font-bold flex items-center gap-2"
                      style={{
                        backgroundColor: '#fef3c7',
                        color: '#92400e'
                      }}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Chuyển {overdueTasks.length} việc còn tồn vào hôm nay
                    </button>
                  ) : (
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Không có việc tồn đọng
                    </span>
                  )}
                </div>
              </div>

              {/* Hai khung tách biệt: Việc hôm nay (Trái) & Thói quen hôm nay (Phải) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* KHUNG TRÁI: VIỆC HÔM NAY */}
                <div className="lg:col-span-7 sketch-card p-4 sm:p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
                        <span>Việc hôm nay</span>
                        <span className="text-xs font-bold opacity-60">
                          ({todayCompletionStats.doneTasks}/{todayCompletionStats.totalTasks})
                        </span>
                      </h3>
                      <span className="text-[11px] opacity-60">
                        Tự động ưu tiên: Gấp → Quan trọng
                      </span>
                    </div>

                    {/* Danh sách công việc */}
                    <div className="divide-y divide-dashed divide-gray-200">
                      {todaysTasks.map((task) => {
                        const isExpanded = expandedTaskId === task.id;
                        return (
                          <div key={task.id} className="py-2.5 group">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <button
                                  onClick={() => handleToggleTask(task.id)}
                                  style={{
                                    backgroundColor: task.completed
                                      ? currentTheme.primary
                                      : '#ffffff',
                                    borderColor: task.completed
                                      ? currentTheme.primary
                                      : currentTheme.border
                                  }}
                                  className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-transform active:scale-90"
                                >
                                  {task.completed && <Check className="w-3.5 h-3.5 text-white" />}
                                </button>

                                <span
                                  onClick={() =>
                                    setExpandedTaskId(isExpanded ? null : task.id)
                                  }
                                  className={`text-sm font-medium cursor-pointer truncate ${
                                    task.completed ? 'line-through opacity-45' : ''
                                  }`}
                                >
                                  {task.title}
                                </span>

                                {/* Nhãn mức độ ưu tiên */}
                                {task.priority === 'urgent' && !task.completed && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-300 shrink-0">
                                    Gấp
                                  </span>
                                )}
                                {task.priority === 'important' && !task.completed && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                                    Quan trọng
                                  </span>
                                )}

                                {/* Nhãn lặp lại */}
                                {task.recurrence?.length > 0 && (
                                  <span className="hidden sm:inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 shrink-0">
                                    ↻ {task.recurrence.join(', ')}
                                  </span>
                                )}

                                {/* Chỉ báo số việc con */}
                                {task.subtasks.length > 0 && (
                                  <button
                                    onClick={() =>
                                      setExpandedTaskId(isExpanded ? null : task.id)
                                    }
                                    className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-gray-100 hover:bg-gray-200 shrink-0"
                                  >
                                    {task.subtasks.filter((s) => s.done).length}/
                                    {task.subtasks.length} bước
                                  </button>
                                )}
                              </div>

                              {/* Nút "Mai >" và Xóa giống hệt thiết kế gốc */}
                              <div className="flex items-center gap-2 shrink-0">
                                {!task.completed && (
                                  <button
                                    onClick={() => handleMoveToTomorrow(task.id)}
                                    className="text-xs font-semibold opacity-60 hover:opacity-100 flex items-center"
                                    title="Chuyển sang ngày mai"
                                  >
                                    Mai <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={() =>
                                    setExpandedTaskId(isExpanded ? null : task.id)
                                  }
                                  className="text-xs opacity-50 hover:opacity-100 px-1"
                                  title="Chia việc nhỏ (tối đa 6 bước)"
                                >
                                  +Bước
                                </button>
                                <button
                                  onClick={() =>
                                    setTasks((prev) => prev.filter((t) => t.id !== task.id))
                                  }
                                  className="opacity-40 hover:opacity-100 hover:text-rose-600 p-0.5"
                                  title="Xóa việc"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Danh sách việc con (Subtasks tối đa 6 phần) */}
                            {isExpanded && (
                              <div className="mt-2 ml-7 pl-3 border-l-2 border-dashed border-gray-300 space-y-1.5">
                                {task.subtasks.map((sub) => (
                                  <div
                                    key={sub.id}
                                    onClick={() => handleToggleSubtask(task.id, sub.id)}
                                    className="flex items-center gap-2 text-xs cursor-pointer py-0.5"
                                  >
                                    <div
                                      style={{
                                        backgroundColor: sub.done
                                          ? currentTheme.primary
                                          : 'transparent',
                                        borderColor: currentTheme.border
                                      }}
                                      className="w-3.5 h-3.5 rounded border flex items-center justify-center"
                                    >
                                      {sub.done && <Check className="w-2.5 h-2.5 text-white" />}
                                    </div>
                                    <span className={sub.done ? 'line-through opacity-50' : ''}>
                                      {sub.title}
                                    </span>
                                  </div>
                                ))}

                                {task.subtasks.length < 6 && (
                                  <div className="flex items-center gap-1.5 pt-1">
                                    <input
                                      type="text"
                                      value={newSubtaskText}
                                      onChange={(e) => setNewSubtaskText(e.target.value)}
                                      onKeyDown={(e) =>
                                        e.key === 'Enter' && handleAddSubtask(task.id)
                                      }
                                      placeholder="Thêm bước nhỏ (tối đa 6)..."
                                      className="text-xs px-2 py-1 border rounded bg-gray-50 flex-1 focus:outline-none"
                                    />
                                    <button
                                      onClick={() => handleAddSubtask(task.id)}
                                      className="text-xs font-bold px-2 py-1 rounded text-white"
                                      style={{ backgroundColor: currentTheme.primary }}
                                    >
                                      Thêm
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ô nhập nhanh "Thêm việc cho hôm nay..." */}
                  <form onSubmit={handleAddTask} className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[11px] font-bold opacity-60">Ưu tiên:</span>
                      {[
                        { id: 'normal', label: 'Bình thường' },
                        { id: 'important', label: 'Quan trọng' },
                        { id: 'urgent', label: 'Gấp' }
                      ].map((p) => (
                        <button
                          type="button"
                          key={p.id}
                          onClick={() => setNewTaskPriority(p.id)}
                          className={`text-[11px] px-2 py-0.5 rounded-full font-bold border transition-all ${
                            newTaskPriority === p.id
                              ? 'border-black bg-gray-900 text-white'
                              : 'border-gray-300 opacity-65'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}

                      <span className="text-[11px] font-bold opacity-60 ml-auto">Lặp lại:</span>
                      {['T2', 'T4', 'T6'].map((d) => {
                        const active = newTaskRecurrence.includes(d);
                        return (
                          <button
                            type="button"
                            key={d}
                            onClick={() =>
                              setNewTaskRecurrence((prev) =>
                                active ? prev.filter((x) => x !== d) : [...prev, d]
                              )
                            }
                            className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${
                              active
                                ? 'bg-emerald-600 text-white border-emerald-700'
                                : 'border-gray-300 opacity-60'
                            }`}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>

                    <div className="sketch-input flex items-center px-3 py-1.5 bg-white">
                      <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Thêm việc cho hôm nay..."
                        className="w-full text-sm bg-transparent focus:outline-none"
                      />
                      <button
                        type="submit"
                        style={{ backgroundColor: currentTheme.primary }}
                        className="w-7 h-7 rounded-full text-white flex items-center justify-center shrink-0 hover:opacity-90"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>

                {/* KHUNG PHẢI: THÓI QUEN HÔM NAY */}
                <div className="lg:col-span-5 sketch-card p-4 sm:p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-extrabold text-base sm:text-lg">Thói quen hôm nay</h3>
                      <button
                        onClick={() => setActiveTab('habits')}
                        className="text-xs font-bold opacity-70 hover:opacity-100 flex items-center gap-1"
                      >
                        Quản lý <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="divide-y divide-dashed divide-gray-200">
                      {habits.map((habit) => {
                        const isDoneToday = habit.daysDone.includes(selectedDayNumber);
                        return (
                          <div
                            key={habit.id}
                            onClick={() => handleToggleHabitDay(habit.id, selectedDayNumber)}
                            className="py-2.5 flex items-center justify-between gap-2 cursor-pointer group"
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                style={{
                                  backgroundColor: isDoneToday
                                    ? currentTheme.primary
                                    : '#ffffff',
                                  borderColor: isDoneToday
                                    ? currentTheme.primary
                                    : currentTheme.border
                                }}
                                className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-transform group-active:scale-90"
                              >
                                {isDoneToday && <Check className="w-3.5 h-3.5 text-white" />}
                              </div>
                              <span
                                className={`text-sm font-medium ${
                                  isDoneToday ? 'font-semibold' : ''
                                }`}
                              >
                                {habit.title}
                              </span>
                            </div>

                            <span className="text-xs font-bold opacity-60">
                              {habit.rate}% tháng
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div
                    className="mt-4 p-3 rounded-xl border border-dashed text-xs flex items-center justify-between"
                    style={{
                      backgroundColor: currentTheme.accent,
                      borderColor: currentTheme.primary
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>
                        Chuỗi duy trì hiện tại: <strong>13 ngày liên tiếp</strong>
                      </span>
                    </div>
                    <span className="font-extrabold" style={{ color: currentTheme.primary }}>
                      65% tháng
                    </span>
                  </div>
                </div>
              </div>

              {/* KHUNG DƯỚI: LÊN KẾ HOẠCH (LỊCH THÁNG / TUẦN) */}
              <div className="sketch-card p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-base sm:text-lg">Lên kế hoạch</h3>
                  <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-black/20">
                    <button
                      onClick={() => setCalendarMode('month')}
                      style={{
                        backgroundColor:
                          calendarMode === 'month' ? currentTheme.primary : 'transparent',
                        color: calendarMode === 'month' ? '#ffffff' : currentTheme.textMain
                      }}
                      className="px-3 py-1 rounded text-xs font-bold transition-all"
                    >
                      Tháng
                    </button>
                    <button
                      onClick={() => setCalendarMode('week')}
                      style={{
                        backgroundColor:
                          calendarMode === 'week' ? currentTheme.primary : 'transparent',
                        color: calendarMode === 'week' ? '#ffffff' : currentTheme.textMain
                      }}
                      className="px-3 py-1 rounded text-xs font-bold transition-all"
                    >
                      Tuần
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between max-w-xs mx-auto mb-3 text-sm font-extrabold">
                  <button className="p-1 opacity-60 hover:opacity-100">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span>Tháng 10/2026</span>
                  <button className="p-1 opacity-60 hover:opacity-100">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Lưới lịch 7 cột giống hệt ảnh 2 */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
                  {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((dow) => (
                    <div key={dow} className="text-xs font-bold opacity-50 py-1">
                      {dow}
                    </div>
                  ))}

                  {Array.from({ length: 31 }, (_, idx) => idx + 1).map((day) => {
                    const dateStr = `2026-10-${String(day).padStart(2, '0')}`;
                    const isSelected = selectedDate === dateStr;
                    const dayTasks = tasks.filter((t) => t.date === dateStr);
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(dateStr)}
                        style={{
                          backgroundColor: isSelected ? currentTheme.primary : 'transparent',
                          color: isSelected ? '#ffffff' : currentTheme.textMain
                        }}
                        className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all border ${
                          isSelected
                            ? 'font-black shadow-sm border-black'
                            : 'border-transparent hover:bg-black/5'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-bold">{day}</span>
                        <div className="flex items-center gap-0.5 mt-1 h-2">
                          {Array.from({ length: Math.min(3, dayTasks.length || (day % 3) + 1) }).map(
                            (_, dotIdx) => (
                              <span
                                key={dotIdx}
                                className="w-1 h-1 rounded-full"
                                style={{
                                  backgroundColor: isSelected
                                    ? '#ffffff'
                                    : currentTheme.primary
                                }}
                              />
                            )
                          )}
                          <span className="text-[9px] opacity-70 ml-0.5">
                            +{dayTasks.length || (day % 4) + 1}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================================
              TAB 2: MỤC TIÊU & TẦM NHÌN (6 Lĩnh Vực + Biểu Đồ Radar)
             ================================================================== */}
          {activeTab === 'goals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
                  <span>Mục tiêu & tầm nhìn</span>
                  <Info className="w-4 h-4 opacity-50" />
                </h2>
                <button
                  onClick={() =>
                    triggerToast('Tính năng thêm mục tiêu mới đã sẵn sàng cho tài khoản của bạn!')
                  }
                  style={{ backgroundColor: currentTheme.primary }}
                  className="sketch-btn px-4 py-2 text-xs font-bold text-white flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Thêm mục tiêu
                </button>
              </div>

              {/* 2 Khung tổng quan: Vòng tròn mục tiêu & Biểu đồ Radar Cân bằng các lĩnh vực */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-6 sketch-card p-5 flex flex-col justify-center items-center">
                  <div className="flex items-center gap-6 mb-5">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          fill="none"
                          stroke={currentTheme.gridLine}
                          strokeWidth="6"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          fill="none"
                          stroke={currentTheme.primary}
                          strokeWidth="6"
                          strokeDasharray={2 * Math.PI * 26}
                          strokeDashoffset={2 * Math.PI * 26 * 0.83}
                        />
                      </svg>
                      <span className="absolute text-sm font-black">17%</span>
                    </div>
                    <div>
                      <span className="text-2xl font-black">2/12</span>{' '}
                      <span className="text-base opacity-70 font-semibold">mục tiêu</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      'Sức khỏe 2',
                      'Tài chính 2',
                      'Sự nghiệp 2',
                      'Phát triển 1',
                      'Quan hệ 1',
                      'Học tập 2',
                      'Gia đình 1',
                      'Sở thích 1'
                    ].map((badge) => (
                      <span
                        key={badge}
                        style={{ backgroundColor: currentTheme.accent }}
                        className="px-3 py-1 rounded-full text-xs font-bold border border-black/10"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-6 sketch-card p-5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-extrabold text-sm">Cân bằng các lĩnh vực</h3>
                    <span className="text-xs opacity-60">Bảng</span>
                  </div>
                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        data={[
                          { subject: 'Sức khỏe', score: 65 },
                          { subject: 'Tài chính', score: 55 },
                          { subject: 'Sự nghiệp', score: 50 },
                          { subject: 'Phát triển', score: 90 },
                          { subject: 'Quan hệ', score: 45 },
                          { subject: 'Học tập', score: 75 },
                          { subject: 'Gia đình', score: 40 },
                          { subject: 'Sở thích', score: 85 }
                        ]}
                      >
                        <PolarGrid stroke={currentTheme.gridLine} />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{ fontSize: 11, fill: currentTheme.textMain, fontWeight: 600 }}
                        />
                        <PolarRadiusAxis tick={false} axisLine={false} />
                        <Radar
                          name="Cân bằng"
                          dataKey="score"
                          stroke={currentTheme.primary}
                          fill={currentTheme.primary}
                          fillOpacity={0.35}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Lưới các thẻ mục tiêu kèm thanh tiến độ từng bước */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {goals.map((g) => {
                  const doneSteps = g.steps.filter((s) => s.done).length;
                  const pct = Math.round((doneSteps / g.steps.length) * 100);
                  return (
                    <div key={g.id} className="sketch-card p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="font-extrabold text-sm">{g.title}</span>
                          <span
                            style={{
                              backgroundColor:
                                g.status === 'Đã hoàn thành'
                                  ? currentTheme.primary
                                  : currentTheme.primaryLight,
                              color:
                                g.status === 'Đã hoàn thành' ? '#ffffff' : currentTheme.primary
                            }}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                          >
                            {g.status}
                          </span>
                        </div>
                        <p className="text-[11px] opacity-70 mb-1">
                          📂 {g.category} · 🕒 {g.deadline}
                        </p>
                        <p className="text-[11px] opacity-75 mb-3">🎁 {g.reward}</p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                          <span>Tiến độ bước nhỏ</span>
                          <span>
                            {doneSteps}/{g.steps.length} bước
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden border border-black/20">
                          <div
                            className="h-full transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: currentTheme.primary
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================================================================
              TAB 3: THEO DÕI THÓI QUEN (Bảng Tích Cả Tháng 31 Ngày)
             ================================================================== */}
          {activeTab === 'habits' && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold">Theo dõi thói quen</h2>
                  <p className="text-xs opacity-70">Tháng 10/2026</p>
                </div>

                <div className="sketch-card px-4 py-2.5 flex items-center gap-6">
                  <div>
                    <span className="text-[10px] font-bold opacity-60 block">CẢ THÁNG</span>
                    <span className="text-lg font-black" style={{ color: currentTheme.primary }}>
                      65%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold opacity-60 block">CHUỖI DÀI NHẤT</span>
                    <span className="text-lg font-black">13 ngày</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold opacity-60 block">ĐỀU ĐẶN NHẤT</span>
                    <span className="text-xs font-extrabold block">Uống đủ 2 lít nước (96%)</span>
                  </div>
                </div>
              </div>

              {/* Biểu đồ mức hoàn thành theo ngày */}
              <div className="sketch-card p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-extrabold text-sm">Mức hoàn thành theo ngày</h3>
                  <span
                    className="px-2.5 py-0.5 rounded text-xs font-bold text-white"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    Đường
                  </span>
                </div>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { day: '1', done: 4 },
                        { day: '6', done: 4 },
                        { day: '11', done: 5 },
                        { day: '16', done: 5 },
                        { day: '21', done: 4 },
                        { day: '23', done: 3 }
                      ]}
                    >
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 6]} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="done"
                        stroke={currentTheme.primary}
                        strokeWidth={2.5}
                        fill={currentTheme.primaryLight}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bảng ma trận theo dõi 31 ngày */}
              <div className="sketch-card p-4 sm:p-5 overflow-x-auto">
                <h3 className="font-extrabold text-sm mb-3">
                  Bảng theo dõi (Nhấn vào từng ô ngày để tích chọn)
                </h3>
                <table className="w-full text-left border-collapse min-w-[760px]">
                  <thead>
                    <tr className="border-b border-gray-200 text-[10px] opacity-65">
                      <th className="py-2 pr-4 w-48">Thói quen</th>
                      {Array.from({ length: 25 }, (_, i) => i + 1).map((d) => (
                        <th
                          key={d}
                          className={`text-center px-1 py-1 ${
                            d === selectedDayNumber ? 'font-black underline' : ''
                          }`}
                        >
                          {d}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dashed divide-gray-200 text-xs">
                    {habits.map((h) => (
                      <tr key={h.id}>
                        <td className="py-2.5 pr-4">
                          <div className="flex items-center justify-between font-bold mb-1">
                            <span>{h.title}</span>
                            <span className="text-[11px] opacity-65">{h.rate}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full"
                              style={{
                                width: `${h.rate}%`,
                                backgroundColor: currentTheme.primary
                              }}
                            />
                          </div>
                        </td>
                        {Array.from({ length: 25 }, (_, i) => i + 1).map((d) => {
                          const checked = h.daysDone.includes(d);
                          return (
                            <td key={d} className="text-center px-0.5 py-2">
                              <button
                                onClick={() => handleToggleHabitDay(h.id, d)}
                                style={{
                                  backgroundColor: checked ? currentTheme.primary : '#ffffff',
                                  borderColor: checked
                                    ? currentTheme.primary
                                    : currentTheme.border
                                }}
                                className="w-4 h-4 rounded border inline-flex items-center justify-center transition-transform active:scale-90"
                              >
                                {checked && <Check className="w-3 h-3 text-white" />}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Thêm thói quen mới */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newHabitTitle.trim()) return;
                    setHabits((prev) => [
                      ...prev,
                      {
                        id: 'h_' + Date.now(),
                        title: newHabitTitle.trim(),
                        rate: 10,
                        daysDone: [selectedDayNumber]
                      }
                    ]);
                    setNewHabitTitle('');
                    triggerToast('Đã thêm thói quen mới!');
                  }}
                  className="mt-4 flex gap-2"
                >
                  <input
                    type="text"
                    value={newHabitTitle}
                    onChange={(e) => setNewHabitTitle(e.target.value)}
                    placeholder="Thêm thói quen mới, ví dụ: Thiền 10 phút..."
                    className="sketch-input px-3 py-1.5 text-xs flex-1 bg-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    style={{ backgroundColor: currentTheme.primary }}
                    className="sketch-btn px-4 py-1.5 text-xs font-bold text-white"
                  >
                    + Thêm
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ==================================================================
              TAB 4: KẾ HOẠCH TUẦN (Cột công việc theo từng thứ + Nhận xét)
             ================================================================== */}
          {activeTab === 'weekly' && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold">Kế hoạch tuần</h2>
                  <p className="text-xs opacity-70">Tuần 43 · 19/10 – 25/10/2026</p>
                </div>

                <div className="sketch-card p-3.5 max-w-md text-xs space-y-1">
                  <div className="flex items-center justify-between font-extrabold border-b pb-1.5 mb-1">
                    <span>ĐÃ XONG: 19/35</span>
                    <span>THÓI QUEN: 43%</span>
                    <span>HÔM NAY: 4 việc</span>
                  </div>
                  <p className="font-bold" style={{ color: currentTheme.primary }}>
                    Khá tốt, giữ nhịp này nhé.
                  </p>
                  <p className="opacity-75">
                    Ngày hiệu quả nhất: <strong>Thứ 2 (6 việc xong)</strong>.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    day: 'Thứ 2',
                    date: '19/10',
                    items: ['Chạy bộ 30 phút', 'Gặp bạn cà phê', 'Viết nhật ký 5 phút', 'Đọc 20 trang sách']
                  },
                  {
                    day: 'Thứ 3',
                    date: '20/10',
                    items: ['Dọn tủ quần áo', 'Xem lại ghi chú tuần trước', 'Đạp xe buổi sáng', 'Tập gym 45 phút']
                  },
                  {
                    day: 'Thứ 4',
                    date: '21/10',
                    items: ['Đọc một chương sách kỹ năng', 'Thanh toán hóa đơn điện nước', 'Đặt lịch khám răng']
                  },
                  {
                    day: 'Thứ 5',
                    date: '22/10',
                    items: ['Viết nhật ký 5 phút', 'Họp 1:1 với trưởng nhóm', 'Ôn 20 từ vựng HSK 3', 'Gửi báo giá cho khách']
                  }
                ].map((col, idx) => (
                  <div key={col.day} className="sketch-card p-4">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                      <span className="font-extrabold text-sm">{col.day}</span>
                      <span
                        style={{ backgroundColor: currentTheme.primaryLight }}
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                      >
                        {col.date}
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {col.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <div
                            style={{
                              backgroundColor: i < 2 ? currentTheme.primary : '#ffffff',
                              borderColor: currentTheme.border
                            }}
                            className="w-4 h-4 rounded border flex items-center justify-center shrink-0"
                          >
                            {i < 2 && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className={i < 2 ? 'line-through opacity-55' : ''}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================================
              TAB 5: KẾ HOẠCH NĂM (Từ khóa của năm + 12 Tháng)
             ================================================================== */}
          {activeTab === 'yearly' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold">Kế hoạch năm</h2>
                  <p className="text-xs opacity-70">Năm 2026 · 35/52 kế hoạch đã xong (67%)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-6 sketch-card p-4 sm:p-5 space-y-3">
                  <div>
                    <label className="text-[11px] font-bold opacity-60 block mb-1">
                      TỪ KHÓA CỦA NĂM
                    </label>
                    <input
                      type="text"
                      value={yearly.keyword}
                      onChange={(e) => setYearly({ ...yearly, keyword: e.target.value })}
                      className="sketch-input w-full px-3 py-2 text-sm font-extrabold bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold opacity-60 block mb-1">
                      TẦM NHÌN NĂM NAY
                    </label>
                    <textarea
                      rows={2}
                      value={yearly.vision}
                      onChange={(e) => setYearly({ ...yearly, vision: e.target.value })}
                      className="sketch-input w-full px-3 py-2 text-xs bg-white"
                    />
                  </div>
                </div>

                <div className="lg:col-span-6 sketch-card p-4 sm:p-5">
                  <h3 className="font-extrabold text-sm mb-2">Tiến độ 12 tháng</h3>
                  <div className="h-36 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={[
                          { m: 'T1', v: 5 },
                          { m: 'T2', v: 4 },
                          { m: 'T3', v: 4 },
                          { m: 'T4', v: 3 },
                          { m: 'T5', v: 5 },
                          { m: 'T6', v: 3 },
                          { m: 'T7', v: 3 },
                          { m: 'T8', v: 4 },
                          { m: 'T9', v: 3 },
                          { m: 'T10', v: 1 }
                        ]}
                      >
                        <XAxis dataKey="m" tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="v"
                          stroke={currentTheme.primary}
                          fill={currentTheme.primaryLight}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {yearly.months.map((m) => (
                  <div
                    key={m.month}
                    className={`sketch-card p-3 ${
                      m.isCurrent ? 'ring-2 ring-offset-1' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-extrabold mb-1.5">
                      <span>Tháng {m.month}</span>
                      <span className="opacity-60">
                        {m.done}/{m.total}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full"
                        style={{
                          width: `${(m.done / m.total) * 100}%`,
                          backgroundColor: currentTheme.primary
                        }}
                      />
                    </div>
                    {m.items.map((it) => (
                      <div key={it.id} className="text-[11px] truncate opacity-80 py-0.5">
                        {it.done ? '☑' : '☐'} {it.text}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================================
              TAB 6: THỐNG KÊ (Chuẩn theo màn hình Laptop ở ảnh 1 & ảnh 7)
             ================================================================== */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
                  <span>Thống kê</span>
                  <Info className="w-4 h-4 opacity-50" />
                </h2>

                <div className="sketch-card px-1.5 py-1 flex items-center gap-1">
                  {[
                    { id: '4w', label: '4 tuần' },
                    { id: '8w', label: '8 tuần' },
                    { id: '12w', label: '12 tuần' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setStatsPeriod(p.id)}
                      style={{
                        backgroundColor:
                          statsPeriod === p.id ? currentTheme.primary : 'transparent',
                        color: statsPeriod === p.id ? '#ffffff' : currentTheme.textMain
                      }}
                      className="px-3 py-1 rounded-lg text-xs font-bold transition-all"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Khung lớn: TỈ LỆ HOÀN THÀNH VIỆC - 8 TUẦN QUA */}
              <div className="sketch-card p-5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold opacity-60 uppercase tracking-wider">
                    TỈ LỆ HOÀN THÀNH VIỆC · {statsPeriod === '4w' ? '4' : statsPeriod === '8w' ? '8' : '12'} TUẦN QUA
                  </span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-4xl sm:text-5xl font-black">
                      {statsPeriod === '4w' ? '78%' : statsPeriod === '8w' ? '73%' : '76%'}
                    </span>
                    <span className="text-xs font-bold text-rose-600">
                      ▼ -1 điểm <span className="text-gray-500 font-normal">so với giai đoạn trước</span>
                    </span>
                  </div>
                  <p className="text-xs mt-2 opacity-80">
                    <strong>208</strong>/284 việc · hiệu quả nhất <strong>Chủ nhật</strong>
                  </p>
                </div>
              </div>

              {/* 3 Thẻ chỉ số ngang */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="sketch-card p-4">
                  <span className="text-[10px] font-bold opacity-60 uppercase">✓ VIỆC ĐÃ XONG</span>
                  <p className="text-2xl font-black mt-1">208</p>
                  <span className="text-xs opacity-60">Không đổi</span>
                </div>
                <div className="sketch-card p-4">
                  <span className="text-[10px] font-bold opacity-60 uppercase">🔥 CHUỖI HOẠT ĐỘNG</span>
                  <p className="text-2xl font-black mt-1">166 ngày</p>
                  <span className="text-xs opacity-60">Dài nhất 166 ngày</span>
                </div>
                <div className="sketch-card p-4">
                  <span className="text-[10px] font-bold opacity-60 uppercase">🎯 THÓI QUEN</span>
                  <p className="text-2xl font-black mt-1">65%</p>
                  <span className="text-xs font-bold text-emerald-700">▲ +5 điểm</span>
                </div>
              </div>

              {/* Biểu đồ Xu hướng hoàn thành */}
              <div className="sketch-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base">Xu hướng hoàn thành</h3>
                    <span className="text-xs opacity-60">TB 73%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {['line', 'bar'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setChartType(t)}
                        style={{
                          backgroundColor:
                            chartType === t ? currentTheme.primary : currentTheme.accent,
                          color: chartType === t ? '#ffffff' : currentTheme.textMain
                        }}
                        className="px-3 py-1 rounded text-xs font-bold"
                      >
                        {t === 'line' ? 'Đường' : 'Cột'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'line' ? (
                      <AreaChart data={TREND_DATA}>
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="rate"
                          stroke={currentTheme.primary}
                          strokeWidth={2.5}
                          fill={currentTheme.primaryLight}
                        />
                      </AreaChart>
                    ) : (
                      <BarChart data={TREND_DATA}>
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="rate" fill={currentTheme.primary} radius={[6, 6, 0, 0]} />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Hàng dưới: Heatmap Nhịp làm việc hằng ngày & Năng suất theo thứ */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="sketch-card p-5">
                  <h3 className="font-extrabold text-base mb-3">Nhịp làm việc hằng ngày</h3>
                  <div className="grid grid-cols-8 gap-2">
                    {Array.from({ length: 32 }).map((_, idx) => {
                      const opacities = [0.2, 0.45, 0.75, 1];
                      const op = opacities[(idx * 3) % 4];
                      return (
                        <div
                          key={idx}
                          className="h-7 rounded-md border border-black/10"
                          style={{
                            backgroundColor: currentTheme.primary,
                            opacity: op
                          }}
                          title={`Ngày ${idx + 1}: ${(idx % 5) + 2} việc hoàn thành`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="sketch-card p-5">
                  <h3 className="font-extrabold text-base mb-3">Năng suất theo thứ</h3>
                  <div className="space-y-2.5 text-xs">
                    {[
                      { d: 'Thứ 2', val: 4.3, pct: 86 },
                      { d: 'Thứ 3', val: 3.8, pct: 76 },
                      { d: 'Thứ 4', val: 3.4, pct: 68 },
                      { d: 'Thứ 5', val: 4.4, pct: 88 },
                      { d: 'Thứ 6', val: 4.1, pct: 82 }
                    ].map((row) => (
                      <div key={row.d} className="flex items-center gap-3">
                        <span className="w-12 font-bold">{row.d}</span>
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${row.pct}%`,
                              backgroundColor: currentTheme.primary
                            }}
                          />
                        </div>
                        <span className="font-extrabold w-8 text-right">{row.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ====================================================================
            THANH CHỌN NHANH 9 BỘ MÀU NỔI Ở DƯỚI MÀN HÌNH (Chuẩn theo ảnh 1)
           ==================================================================== */}
        {showFloatingPalette && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md px-3 py-2 rounded-full shadow-lg border-2 border-black/80 flex items-center gap-2">
            {THEMES.map((t) => {
              const isSelected = t.id === themeId;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setThemeId(t.id);
                    triggerToast(`Đã đổi bộ màu: ${t.name}`);
                  }}
                  title={t.name}
                  className={`w-7 h-7 rounded-full relative overflow-hidden border-2 transition-transform ${
                    isSelected ? 'scale-115 border-black ring-2 ring-black/20' : 'border-gray-300 hover:scale-105'
                  }`}
                >
                  <span
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${t.swatches[0]} 50%, ${t.swatches[2]} 50%)`
                    }}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}