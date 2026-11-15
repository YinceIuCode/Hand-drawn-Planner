"use client";

import React from 'react';
import { Check } from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';

export default function HabitsTab() {
  const {
    currentTheme,
    selectedDate,
    habits,
    setHabits,
    selectedDayNumber,
    currentStreak,
    monthProgressRate,
    newHabitTitle,
    setNewHabitTitle,
    handleToggleHabitDay,
    triggerToast
  } = usePlanner();

  const [calYear, calMonth] = selectedDate.split('-').map(Number);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold">Theo dõi thói quen</h2>
          <p className="text-xs opacity-70">Tháng {calMonth}/{calYear}</p>
        </div>

        <div className="sketch-card px-4 py-2.5 flex items-center gap-6">
          <div>
            <span className="text-[10px] font-bold opacity-60 block">CẢ THÁNG</span>
            <span className="text-xl font-black">{monthProgressRate}%</span>
          </div>
          <div>
            <span className="text-[10px] font-bold opacity-60 block">HÔM NAY</span>
            <span className="text-xl font-black">
              {habits.filter((h) => h.daysDone.includes(selectedDayNumber)).length}/
              {habits.length}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold opacity-60 block">CHUỖI HIỆN TẠI</span>
            <span className="text-xl font-black text-orange-600">{currentStreak} ngày</span>
          </div>
        </div>
      </div>

      {/* Bảng chấm công thói quen (Matrix 31 ngày) */}
      <div className="sketch-card p-4 overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-center">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-2 text-xs font-bold w-48">Thói quen</th>
              <th className="py-2 px-2 text-xs font-bold w-14">Tỉ lệ</th>
              {Array.from({ length: 31 }, (_, idx) => idx + 1).map((day) => (
                <th
                  key={day}
                  className={`py-2 px-1 text-[11px] font-bold ${
                    day === selectedDayNumber ? 'bg-black/10 rounded-t' : ''
                  }`}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {habits.map((habit) => (
              <tr key={habit.id} className="hover:bg-black/5">
                <td className="text-left py-2.5 px-2 font-medium truncate max-w-[180px]">
                  {habit.title}
                </td>
                <td className="py-2.5 px-2 font-bold" style={{ color: currentTheme.primary }}>
                  {habit.rate}%
                </td>
                {Array.from({ length: 31 }, (_, idx) => idx + 1).map((day) => {
                  const isDone = habit.daysDone.includes(day);
                  const isToday = day === selectedDayNumber;
                  return (
                    <td
                      key={day}
                      onClick={() => handleToggleHabitDay(habit.id, day)}
                      className={`py-2 px-1 cursor-pointer ${
                        isToday ? 'bg-black/5' : ''
                      }`}
                    >
                      <div
                        style={{
                          backgroundColor: isDone ? currentTheme.primary : 'transparent',
                          borderColor: isDone ? currentTheme.primary : '#d1d5db'
                        }}
                        className={`w-4 h-4 mx-auto rounded-sm border flex items-center justify-center transition-transform active:scale-75 ${
                          isDone ? 'text-white' : ''
                        }`}
                      >
                        {isDone && <Check className="w-3 h-3" />}
                      </div>
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
            placeholder="Tên thói quen mới..."
            className="sketch-input flex-1 px-3 py-2 text-xs bg-white focus:outline-none"
          />
          <button
            type="submit"
            style={{ backgroundColor: currentTheme.primary }}
            className="sketch-btn px-4 py-2 text-xs font-bold text-white shrink-0"
          >
            Thêm
          </button>
        </form>
      </div>
    </div>
  );
}
