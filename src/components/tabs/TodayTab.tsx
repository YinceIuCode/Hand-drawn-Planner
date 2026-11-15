"use client";

import React from 'react';
import {
  RotateCcw, Check, ChevronRight, ChevronLeft,
  Flame, Plus, X
} from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';

export default function TodayTab() {
  const {
    currentTheme,
    selectedDate,
    setSelectedDate,
    tasks,
    habits,
    todaysTasks,
    overdueTasks,
    todayCompletionStats,
    selectedDayNumber,
    currentStreak,
    monthProgressRate,
    fullDayOfWeek,
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
    calendarMode,
    setCalendarMode,
    handleAddTask,
    handleToggleTask,
    deleteTask,
    handleAddSubtask,
    handleToggleSubtask,
    handleMoveToTomorrow,
    handleRolloverOverdue,
    handleToggleHabitDay,
    setActiveTab
  } = usePlanner();

  return (
    <div className="space-y-6">
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
                {fullDayOfWeek}
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* KHUNG TRÁI: VIỆC HÔM NAY */}
        <div className="lg:col-span-7 sketch-card p-4 sm:p-5 flex flex-col justify-between h-full">
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
                        {task.recurrence && task.recurrence.length > 0 && (
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
                          onClick={() => deleteTask(task.id)}
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
                      setNewTaskRecurrence(
                        active
                          ? newTaskRecurrence.filter((x) => x !== d)
                          : [...newTaskRecurrence, d]
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
        <div className="lg:col-span-5 sketch-card p-4 sm:p-5 flex flex-col justify-between h-full">
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
                Chuỗi duy trì hiện tại: <strong>{currentStreak} ngày liên tiếp</strong>
              </span>
            </div>
            <span className="font-extrabold" style={{ color: currentTheme.primary }}>
              {monthProgressRate}% tháng
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

        {(() => {
          const [calYear, calMonth] = selectedDate.split('-').map(Number);
          const daysInCalMonth = new Date(calYear, calMonth, 0).getDate();

          const handlePrevMonth = () => {
            const prev = new Date(calYear, calMonth - 2, 1);
            const y = prev.getFullYear();
            const m = String(prev.getMonth() + 1).padStart(2, '0');
            setSelectedDate(`${y}-${m}-01`);
          };

          const handleNextMonth = () => {
            const next = new Date(calYear, calMonth, 1);
            const y = next.getFullYear();
            const m = String(next.getMonth() + 1).padStart(2, '0');
            setSelectedDate(`${y}-${m}-01`);
          };

          return (
            <>
              <div className="flex items-center justify-between max-w-xs mx-auto mb-3 text-sm font-extrabold">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 opacity-60 hover:opacity-100 rounded"
                  title="Tháng trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span>Tháng {calMonth}/{calYear}</span>
                <button
                  onClick={handleNextMonth}
                  className="p-1 opacity-60 hover:opacity-100 rounded"
                  title="Tháng sau"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Lưới lịch 7 cột tự động theo số ngày của tháng */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((dow) => (
                  <div key={dow} className="text-xs font-bold opacity-50 py-1">
                    {dow}
                  </div>
                ))}

                {Array.from({ length: daysInCalMonth }, (_, idx) => idx + 1).map((day) => {
                  const dateStr = `${calYear}-${String(calMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
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
                        {Array.from({ length: Math.min(3, dayTasks.length || 0) }).map(
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
                        {dayTasks.length > 0 && (
                          <span className="text-[9px] opacity-70 ml-0.5">
                            +{dayTasks.length}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
