"use client";

import React, { useState, useMemo } from 'react';
import { Award, Plus, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';
import { addDaysToDate } from '@/lib/constants';

const DAY_NAMES = [
  'Thứ 2',
  'Thứ 3',
  'Thứ 4',
  'Thứ 5',
  'Thứ 6',
  'Thứ 7',
  'Chủ nhật'
];

export default function WeeklyTab() {
  const { currentTheme, selectedDate, tasks, toggleTask, deleteTask, addTask } = usePlanner();

  // Điều hướng tuần: 0 là tuần của selectedDate, -1 là tuần trước, +1 là tuần sau
  const [weekOffset, setWeekOffset] = useState<number>(0);

  // State thêm việc nhanh vào từng ngày: { addingDate: string | null, newTitle: string }
  const [addingDate, setAddingDate] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');

  // Tính ngày Thứ 2 đầu tuần dựa trên selectedDate và weekOffset
  const mondayStr = useMemo(() => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const day = dateObj.getDay(); // 0: CN, 1: T2, ...
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const mondayObj = new Date(dateObj);
    mondayObj.setDate(dateObj.getDate() + diffToMonday + weekOffset * 7);

    const mY = mondayObj.getFullYear();
    const mM = String(mondayObj.getMonth() + 1).padStart(2, '0');
    const mD = String(mondayObj.getDate()).padStart(2, '0');
    return `${mY}-${mM}-${mD}`;
  }, [selectedDate, weekOffset]);

  // Danh sách 7 ngày trong tuần từ Thứ 2 đến Chủ nhật
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const dateStr = addDaysToDate(mondayStr, i);
      const [, m, d] = dateStr.split('-');
      return {
        day: DAY_NAMES[i],
        dateStr,
        displayDate: `${d}/${m}`,
        isToday: dateStr === selectedDate
      };
    });
  }, [mondayStr, selectedDate]);

  // Tất cả tasks trong tuần đang xem
  const weeklyDateStrings = useMemo(() => new Set(weekDays.map((d) => d.dateStr)), [weekDays]);

  const weeklyTasks = useMemo(() => {
    return tasks.filter((t) => weeklyDateStrings.has(t.date));
  }, [tasks, weeklyDateStrings]);

  const completedWeeklyTasks = weeklyTasks.filter((t) => t.completed);
  const totalWeeklyCount = weeklyTasks.length;
  const completedWeeklyCount = completedWeeklyTasks.length;
  const weeklyPercent =
    totalWeeklyCount === 0 ? 0 : Math.round((completedWeeklyCount / totalWeeklyCount) * 100);

  // Tìm ngày có nhiều việc hoàn thành nhất trong tuần
  const bestDaySummary = useMemo(() => {
    if (completedWeeklyCount === 0) {
      return 'Hãy tích hoàn thành các công việc đầu tiên trong tuần để tạo chuỗi bứt phá!';
    }
    const countsByDay: Record<string, number> = {};
    for (const t of completedWeeklyTasks) {
      countsByDay[t.date] = (countsByDay[t.date] || 0) + 1;
    }
    let maxDone = 0;
    let bestDayDate = '';
    for (const [dStr, cnt] of Object.entries(countsByDay)) {
      if (cnt > maxDone) {
        maxDone = cnt;
        bestDayDate = dStr;
      }
    }
    const matchedDay = weekDays.find((w) => w.dateStr === bestDayDate);
    const dayLabel = matchedDay ? matchedDay.day : 'trong tuần';
    return `Ngày hiệu quả nhất: ${dayLabel} (${maxDone} việc xong). Tiến độ đạt ${weeklyPercent}% toàn tuần!`;
  }, [completedWeeklyTasks, completedWeeklyCount, weekDays, weeklyPercent]);

  // Label khoảng ngày trong tuần
  const weekRangeLabel = useMemo(() => {
    const first = weekDays[0];
    const last = weekDays[6];
    return `${first.displayDate} - ${last.displayDate}`;
  }, [weekDays]);

  const handleAddNewTask = (targetDate: string) => {
    if (!newTitle.trim()) {
      setAddingDate(null);
      return;
    }
    addTask(newTitle.trim(), 'normal', [], targetDate);
    setNewTitle('');
    setAddingDate(null);
  };

  return (
    <div className="space-y-4">
      {/* Tiêu đề & Điều hướng tuần */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
            <span>Kế hoạch tuần</span>
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-bold opacity-75">Tuần: {weekRangeLabel}</span>
            <div className="flex items-center gap-1 bg-white/70 rounded-lg p-0.5 border border-black/10">
              <button
                onClick={() => setWeekOffset((prev) => prev - 1)}
                className="p-1 hover:bg-black/5 rounded text-gray-600 hover:text-black transition-colors"
                title="Tuần trước"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setWeekOffset(0)}
                className="px-2 py-0.5 text-[10px] font-bold hover:bg-black/5 rounded transition-colors"
              >
                Tuần hiện tại
              </button>
              <button
                onClick={() => setWeekOffset((prev) => prev + 1)}
                className="p-1 hover:bg-black/5 rounded text-gray-600 hover:text-black transition-colors"
                title="Tuần sau"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Khung tiến độ tuần */}
        <div className="sketch-card px-4 py-2 flex items-center gap-4">
          <span className="text-xs font-bold">
            Tiến độ tuần:{' '}
            <strong>
              {completedWeeklyCount}/{totalWeeklyCount} việc
            </strong>{' '}
            ({weeklyPercent}%)
          </span>
          <div className="w-20 h-2 bg-gray-100 rounded-full border border-black/20 overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${weeklyPercent}%`,
                backgroundColor: currentTheme.primary
              }}
            />
          </div>
        </div>
      </div>

      {/* Nhận xét tuần */}
      <div
        className="sketch-card p-3.5 text-xs flex items-center gap-3"
        style={{ backgroundColor: currentTheme.accent }}
      >
        <Award className="w-5 h-5 shrink-0" style={{ color: currentTheme.primary }} />
        <span>{bestDaySummary}</span>
      </div>

      {/* 7 Cột từ Thứ 2 đến Chủ nhật */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {weekDays.map((col) => {
          const dayTasks = tasks.filter((t) => t.date === col.dateStr);

          return (
            <div
              key={col.dateStr}
              className={`sketch-card p-3.5 flex flex-col justify-between transition-all ${
                col.isToday ? 'ring-2 ring-offset-2 ring-emerald-600 bg-white/95' : ''
              }`}
            >
              <div>
                {/* Header ngày */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                  <div>
                    <span className="font-extrabold text-sm block leading-tight">{col.day}</span>
                    <span className="text-[10px] opacity-60 font-medium">{col.displayDate}</span>
                  </div>
                  {col.isToday && (
                    <span
                      style={{
                        backgroundColor: currentTheme.primary,
                        color: '#ffffff'
                      }}
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    >
                      Hôm nay
                    </span>
                  )}
                </div>

                {/* Danh sách công việc của thứ */}
                <div className="space-y-1.5 min-h-[90px]">
                  {dayTasks.length === 0 ? (
                    <p className="text-[11px] opacity-40 italic py-2">Chưa có việc nào</p>
                  ) : (
                    dayTasks.map((t) => (
                      <div
                        key={t.id}
                        className="group flex items-start justify-between gap-1.5 text-xs py-1 px-1.5 rounded hover:bg-black/5 transition-colors"
                      >
                        <div
                          onClick={() => toggleTask(t.id)}
                          className="flex items-start gap-1.5 cursor-pointer flex-1 min-w-0"
                        >
                          <div
                            style={{
                              backgroundColor: t.completed ? currentTheme.primary : 'transparent',
                              borderColor: t.completed ? currentTheme.primary : '#9ca3af'
                            }}
                            className="w-3.5 h-3.5 mt-0.5 rounded-sm border flex items-center justify-center shrink-0 transition-colors"
                          >
                            {t.completed && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span
                            className={`line-clamp-2 leading-snug break-words ${
                              t.completed ? 'line-through opacity-50 text-gray-500' : 'font-medium'
                            }`}
                          >
                            {t.title}
                          </span>
                        </div>

                        <button
                          onClick={() => deleteTask(t.id)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-rose-600 rounded transition-opacity shrink-0"
                          title="Xóa việc"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Form thêm việc nhanh trực tiếp vào thứ */}
              <div className="mt-3 pt-2 border-t border-dashed border-gray-100">
                {addingDate === col.dateStr ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddNewTask(col.dateStr);
                    }}
                    className="space-y-1.5"
                  >
                    <input
                      type="text"
                      autoFocus
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Nội dung việc cần làm..."
                      className="sketch-input w-full px-2 py-1 text-xs bg-white"
                    />
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setAddingDate(null);
                          setNewTitle('');
                        }}
                        className="px-2 py-0.5 text-[10px] text-gray-500 hover:bg-gray-100 rounded"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        style={{ backgroundColor: currentTheme.primary }}
                        className="sketch-btn px-2.5 py-0.5 text-[10px] font-bold text-white"
                      >
                        Thêm
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => {
                      setAddingDate(col.dateStr);
                      setNewTitle('');
                    }}
                    className="text-[11px] font-bold opacity-60 hover:opacity-100 text-left flex items-center gap-1 transition-opacity w-full"
                  >
                    <Plus className="w-3 h-3" /> Thêm việc
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
