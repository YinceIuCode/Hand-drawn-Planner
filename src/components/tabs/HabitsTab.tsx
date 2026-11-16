"use client";

import React, { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Edit2, Trash2, X, Plus } from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';
import { getTodayString } from '@/lib/constants';

export default function HabitsTab() {
  const {
    currentTheme,
    selectedDate,
    habits,
    selectedDayNumber,
    currentStreak,
    monthProgressRate,
    newHabitTitle,
    setNewHabitTitle,
    handleToggleHabitDay,
    addHabit,
    updateHabit,
    deleteHabit
  } = usePlanner();

  const [calYear, calMonth] = selectedDate.split('-').map(Number);

  // Điều hướng xem tháng
  const [viewYear, setViewYear] = useState<number>(calYear || 2026);
  const [viewMonth, setViewMonth] = useState<number>(calMonth || 10);

  // State chỉnh sửa tên thói quen tại chỗ (inline edit)
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');

  // Tính số ngày của tháng đang xem (28/29/30/31 ngày)
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();

  // Kiểm tra tháng đang xem có phải là tháng của ngày hôm nay/ngày chọn không
  const isSelectedMonth = viewYear === calYear && viewMonth === calMonth;

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewYear((y) => y - 1);
      setViewMonth(12);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewYear((y) => y + 1);
      setViewMonth(1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleTodayMonth = () => {
    const today = getTodayString();
    const [y, m] = today.split('-').map(Number);
    setViewYear(y);
    setViewMonth(m);
  };

  const startEditing = (id: string, currentTitle: string) => {
    setEditingHabitId(id);
    setEditingTitle(currentTitle);
  };

  const saveEditing = (id: string) => {
    if (editingTitle.trim()) {
      updateHabit(id, editingTitle.trim());
    }
    setEditingHabitId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold">Theo dõi thói quen</h2>
          {/* Thanh điều hướng tháng */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-bold opacity-80">
              Tháng {viewMonth}/{viewYear}
            </span>
            <div className="flex items-center gap-1 bg-white/70 rounded-lg p-0.5 border border-black/10">
              <button
                onClick={handlePrevMonth}
                className="p-1 hover:bg-black/5 rounded text-gray-600 hover:text-black transition-colors"
                title="Tháng trước"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleTodayMonth}
                className="px-2 py-0.5 text-[10px] font-bold hover:bg-black/5 rounded transition-colors"
              >
                Hôm nay
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 hover:bg-black/5 rounded text-gray-600 hover:text-black transition-colors"
                title="Tháng sau"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
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

      {/* Bảng chấm công thói quen động theo số ngày trong tháng */}
      <div className="sketch-card p-4 overflow-x-auto">
        {habits.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <p className="text-sm font-bold opacity-60">Chưa có thói quen nào được theo dõi</p>
            <p className="text-xs opacity-50">Thêm thói quen đầu tiên ở ô bên dưới để bắt đầu chuỗi rèn luyện!</p>
          </div>
        ) : (
          <table className="w-full min-w-[720px] border-collapse text-center">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 text-xs font-bold w-52">Thói quen</th>
                <th className="py-2 px-2 text-xs font-bold w-14">Tỉ lệ</th>
                {Array.from({ length: daysInMonth }, (_, idx) => idx + 1).map((day) => {
                  const isTodayCol = isSelectedMonth && day === selectedDayNumber;
                  return (
                    <th
                      key={day}
                      className={`py-2 px-1 text-[11px] font-bold transition-colors ${
                        isTodayCol ? 'bg-black/10 rounded-t text-black font-black' : ''
                      }`}
                    >
                      {day}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {habits.map((habit) => (
                <tr key={habit.id} className="hover:bg-black/5 group">
                  {/* Cột tên thói quen + nút Sửa, Xóa */}
                  <td className="text-left py-2.5 px-2 font-medium max-w-[210px]">
                    {editingHabitId === habit.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEditing(habit.id);
                            if (e.key === 'Escape') setEditingHabitId(null);
                          }}
                          autoFocus
                          className="sketch-input px-2 py-0.5 text-xs w-full bg-white"
                        />
                        <button
                          onClick={() => saveEditing(habit.id)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          title="Lưu"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingHabitId(null)}
                          className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                          title="Hủy"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-1 group/row">
                        <span className="truncate flex-1" title={habit.title}>
                          {habit.title}
                        </span>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={() => startEditing(habit.id, habit.title)}
                            className="p-1 text-gray-400 hover:text-black hover:bg-black/5 rounded"
                            title="Đổi tên thói quen"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteHabit(habit.id)}
                            className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            title="Xóa thói quen này"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Tỉ lệ hoàn thành */}
                  <td className="py-2.5 px-2 font-bold" style={{ color: currentTheme.primary }}>
                    {habit.rate}%
                  </td>

                  {/* Các ô ngày trong tháng */}
                  {Array.from({ length: daysInMonth }, (_, idx) => idx + 1).map((day) => {
                    const isDone = habit.daysDone.includes(day);
                    const isTodayCol = isSelectedMonth && day === selectedDayNumber;
                    return (
                      <td
                        key={day}
                        onClick={() => handleToggleHabitDay(habit.id, day)}
                        className={`py-2 px-1 cursor-pointer transition-colors ${
                          isTodayCol ? 'bg-black/5' : ''
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
        )}

        {/* Thêm thói quen mới */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newHabitTitle.trim()) return;
            addHabit(newHabitTitle.trim());
            setNewHabitTitle('');
          }}
          className="mt-4 flex gap-2"
        >
          <input
            type="text"
            value={newHabitTitle}
            onChange={(e) => setNewHabitTitle(e.target.value)}
            placeholder="Tên thói quen mới (ví dụ: Tập thể dục 30p, Đọc sách, Uống nước...)"
            className="sketch-input flex-1 px-3 py-2 text-xs bg-white focus:outline-none"
          />
          <button
            type="submit"
            style={{ backgroundColor: currentTheme.primary }}
            className="sketch-btn px-4 py-2 text-xs font-bold text-white shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Thêm thói quen
          </button>
        </form>
      </div>
    </div>
  );
}
