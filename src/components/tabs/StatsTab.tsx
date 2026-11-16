"use client";

import React, { useMemo } from 'react';
import { Info } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar
} from 'recharts';
import { usePlanner } from '@/context/PlannerContext';
import { addDaysToDate, getDayOfWeekTag } from '@/lib/constants';

const DOW_ORDER = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const DOW_LABELS: Record<string, string> = {
  T2: 'Thứ 2',
  T3: 'Thứ 3',
  T4: 'Thứ 4',
  T5: 'Thứ 5',
  T6: 'Thứ 6',
  T7: 'Thứ 7',
  CN: 'Chủ nhật'
};

export default function StatsTab() {
  const {
    currentTheme,
    tasks,
    habits,
    currentStreak,
    monthProgressRate,
    selectedDate,
    statsPeriod,
    setStatsPeriod,
    chartType,
    setChartType
  } = usePlanner();

  // 1. Thống kê tổng số việc
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.completed).length;
  const taskCompletionRate =
    totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  // 2. Tìm ngày trong tuần hiệu quả nhất (nhiều việc hoàn thành nhất)
  const bestDayOfWeek = useMemo(() => {
    const completedTasks = tasks.filter((t) => t.completed);
    if (completedTasks.length === 0) return 'Chưa có';

    const countByTag: Record<string, number> = {};
    for (const t of completedTasks) {
      const tag = getDayOfWeekTag(t.date);
      countByTag[tag] = (countByTag[tag] || 0) + 1;
    }

    let maxCnt = 0;
    let bestTag = '';
    for (const [tag, cnt] of Object.entries(countByTag)) {
      if (cnt > maxCnt) {
        maxCnt = cnt;
        bestTag = tag;
      }
    }
    return bestTag ? DOW_LABELS[bestTag] || bestTag : 'Chưa có';
  }, [tasks]);

  // 3. Tính toán dữ liệu xu hướng động theo số tuần được chọn (4, 8, hoặc 12 tuần)
  const dynamicTrendData = useMemo(() => {
    const numWeeks = statsPeriod === '4w' ? 4 : statsPeriod === '8w' ? 8 : 12;
    const result = [];

    for (let i = numWeeks - 1; i >= 0; i--) {
      // Ngày đầu tuần và ngày cuối tuần
      const startOfWeek = addDaysToDate(selectedDate, -i * 7 - 6);
      const endOfWeek = addDaysToDate(selectedDate, -i * 7);

      const weekTasks = tasks.filter((t) => t.date >= startOfWeek && t.date <= endOfWeek);
      const weekDone = weekTasks.filter((t) => t.completed).length;
      const rate =
        weekTasks.length === 0 ? 0 : Math.round((weekDone / weekTasks.length) * 100);

      const [, m, d] = endOfWeek.split('-');
      result.push({
        label: `${d}/${m}`,
        rate,
        tasks: weekTasks.length
      });
    }

    return result;
  }, [tasks, selectedDate, statsPeriod]);

  // Tỉ lệ hoàn thành trung bình của các tuần đang hiển thị
  const averageRate = useMemo(() => {
    if (dynamicTrendData.length === 0) return 0;
    const total = dynamicTrendData.reduce((acc, it) => acc + it.rate, 0);
    return Math.round(total / dynamicTrendData.length);
  }, [dynamicTrendData]);

  // 4. Heatmap nhịp làm việc 31 ngày trong tháng
  const [calYear, calMonth] = selectedDate.split('-').map(Number);
  const daysInMonth = new Date(calYear, calMonth, 0).getDate();

  const dailyActivity = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, idx) => {
      const dayNum = idx + 1;
      const dayStr = `${calYear}-${String(calMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const dayTasksDone = tasks.filter((t) => t.date === dayStr && t.completed).length;
      const dayHabitsDone = habits.filter((h) => h.daysDone.includes(dayNum)).length;
      const totalActivities = dayTasksDone + dayHabitsDone;

      let opacity = 0.1;
      if (totalActivities === 1) opacity = 0.35;
      else if (totalActivities === 2 || totalActivities === 3) opacity = 0.65;
      else if (totalActivities >= 4) opacity = 1.0;

      return {
        day: dayNum,
        count: totalActivities,
        opacity
      };
    });
  }, [calYear, calMonth, daysInMonth, tasks, habits]);

  // 5. Năng suất theo thứ (Thứ 2 đến Chủ nhật)
  const dayOfWeekStats = useMemo(() => {
    const counts: Record<string, { total: number; done: number }> = {};
    for (const tag of DOW_ORDER) {
      counts[tag] = { total: 0, done: 0 };
    }

    for (const t of tasks) {
      const tag = getDayOfWeekTag(t.date);
      if (counts[tag]) {
        counts[tag].total += 1;
        if (t.completed) counts[tag].done += 1;
      }
    }

    return DOW_ORDER.map((tag) => {
      const c = counts[tag];
      const pct = c.total === 0 ? 0 : Math.round((c.done / c.total) * 100);
      return {
        tag,
        label: DOW_LABELS[tag],
        count: c.done,
        total: c.total,
        pct
      };
    });
  }, [tasks]);

  return (
    <div className="space-y-4">
      {/* Tiêu đề & Chọn thời gian */}
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

      {/* Khung lớn: TỈ LỆ HOÀN THÀNH VIỆC THEO THỜI GIAN */}
      <div className="sketch-card p-5 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold opacity-60 uppercase tracking-wider">
            TỈ LỆ HOÀN THÀNH VIỆC · {statsPeriod === '4w' ? '4' : statsPeriod === '8w' ? '8' : '12'} TUẦN QUA
          </span>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-4xl sm:text-5xl font-black">
              {taskCompletionRate}%
            </span>
            <span className="text-xs font-bold" style={{ color: currentTheme.primary }}>
              {taskCompletionRate >= 70 ? '▲ Năng suất tốt' : '▼ Cần nỗ lực hơn'}
            </span>
          </div>
          <p className="text-xs mt-2 opacity-80">
            <strong>{doneTasks}</strong>/{totalTasks} việc hoàn thành · hiệu quả nhất{' '}
            <strong>{bestDayOfWeek}</strong>
          </p>
        </div>
      </div>

      {/* 3 Thẻ chỉ số ngang */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="sketch-card p-4">
          <span className="text-[10px] font-bold opacity-60 uppercase">✓ VIỆC ĐÃ XONG</span>
          <p className="text-2xl font-black mt-1">{doneTasks}</p>
          <span className="text-xs opacity-60">
            {totalTasks > 0 ? `Chiếm ${taskCompletionRate}% tổng việc` : 'Chưa có việc'}
          </span>
        </div>
        <div className="sketch-card p-4">
          <span className="text-[10px] font-bold opacity-60 uppercase">🔥 CHUỖI HOẠT ĐỘNG</span>
          <p className="text-2xl font-black mt-1">{currentStreak} ngày</p>
          <span className="text-xs opacity-60">
            {currentStreak > 0 ? 'Duy trì đều đặn' : 'Bắt đầu tích chuỗi ngay'}
          </span>
        </div>
        <div className="sketch-card p-4">
          <span className="text-[10px] font-bold opacity-60 uppercase">🎯 THÓI QUEN</span>
          <p className="text-2xl font-black mt-1">{monthProgressRate}%</p>
          <span className="text-xs font-bold text-emerald-700">
            {habits.length > 0 ? `${habits.length} thói quen đang theo dõi` : 'Chưa có thói quen'}
          </span>
        </div>
      </div>

      {/* Biểu đồ Xu hướng hoàn thành */}
      <div className="sketch-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base">Xu hướng hoàn thành</h3>
            <span className="text-xs opacity-60">TB {averageRate}%</span>
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
                className="px-3 py-1 rounded text-xs font-bold transition-all"
              >
                {t === 'line' ? 'Đường' : 'Cột'}
              </button>
            ))}
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <AreaChart data={dynamicTrendData}>
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="rate"
                  name="Tỉ lệ %"
                  stroke={currentTheme.primary}
                  strokeWidth={2.5}
                  fill={currentTheme.primaryLight}
                />
              </AreaChart>
            ) : (
              <BarChart data={dynamicTrendData}>
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar
                  dataKey="rate"
                  name="Tỉ lệ %"
                  fill={currentTheme.primary}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hàng dưới: Heatmap Nhịp làm việc hằng ngày & Năng suất theo thứ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="sketch-card p-5">
          <h3 className="font-extrabold text-base mb-1">Nhịp làm việc hằng ngày</h3>
          <p className="text-xs opacity-60 mb-3">
            Mật độ hoàn thành công việc và thói quen trong Tháng {calMonth}/{calYear}
          </p>
          <div className="grid grid-cols-7 sm:grid-cols-8 gap-2">
            {dailyActivity.map((d) => (
              <div
                key={d.day}
                className="h-8 rounded-md border border-black/10 flex items-center justify-center text-[10px] font-bold transition-all cursor-default"
                style={{
                  backgroundColor: currentTheme.primary,
                  opacity: d.count === 0 ? 0.08 : d.opacity,
                  color: d.count >= 2 ? '#ffffff' : '#000000'
                }}
                title={`Ngày ${d.day}: ${d.count} hoạt động hoàn thành`}
              >
                {d.day}
              </div>
            ))}
          </div>
        </div>

        <div className="sketch-card p-5">
          <h3 className="font-extrabold text-base mb-3">Năng suất theo thứ</h3>
          <div className="space-y-2.5 text-xs">
            {dayOfWeekStats.map((row) => (
              <div key={row.tag} className="flex items-center gap-3">
                <span className="w-16 font-bold">{row.label}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden border border-black/10">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${row.pct}%`,
                      backgroundColor: currentTheme.primary
                    }}
                  />
                </div>
                <span className="font-extrabold w-16 text-right">
                  {row.count}/{row.total} việc
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
