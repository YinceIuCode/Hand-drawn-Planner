"use client";

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip
} from 'recharts';
import { Plus, X, Check } from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';

export default function YearlyTab() {
  const {
    currentTheme,
    yearly,
    setYearly,
    addYearlyItem,
    deleteYearlyItem,
    toggleYearlyItem
  } = usePlanner();

  // State thêm mục tiêu theo tháng: { [monthNum]: string }
  const [addingMonth, setAddingMonth] = useState<number | null>(null);
  const [monthInputText, setMonthInputText] = useState<string>('');

  // Biểu đồ diện tích 12 tháng tính trực tiếp từ số lượng việc xong thực tế của từng tháng
  const chartData = useMemo(() => {
    return yearly.months.map((m) => ({
      m: `T${m.month}`,
      v: m.done,
      total: m.total
    }));
  }, [yearly.months]);

  const handleAddItem = (monthNum: number) => {
    if (!monthInputText.trim()) {
      setAddingMonth(null);
      return;
    }
    addYearlyItem(monthNum, monthInputText.trim());
    setMonthInputText('');
    setAddingMonth(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-extrabold">Kế hoạch năm 2026</h2>
        <span className="text-xs opacity-70">Tổng kết 12 tháng</span>
      </div>

      {/* Từ khóa của năm & Tầm nhìn & Biểu đồ tiến độ */}
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
              placeholder="Ví dụ: Bứt phá, Kiên trì, Tự do..."
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
              placeholder="Mục tiêu lớn và tầm nhìn truyền cảm hứng cho bạn trong năm nay..."
              className="sketch-input w-full px-3 py-2 text-xs bg-white"
            />
          </div>
        </div>

        <div className="lg:col-span-6 sketch-card p-4 sm:p-5">
          <h3 className="font-extrabold text-sm mb-2">Tiến độ 12 tháng</h3>
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="m" tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="v"
                  name="Hoàn thành"
                  stroke={currentTheme.primary}
                  fill={currentTheme.primaryLight}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 12 Ô tương ứng với 12 Tháng */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {yearly.months.map((m) => {
          const pct = m.total === 0 ? 0 : Math.round((m.done / m.total) * 100);

          return (
            <div
              key={m.month}
              className={`sketch-card p-3 flex flex-col justify-between transition-all ${
                m.isCurrent ? 'ring-2 ring-offset-1 ring-emerald-600 bg-white/95' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-extrabold mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span>Tháng {m.month}</span>
                    {m.isCurrent && (
                      <span
                        style={{ backgroundColor: currentTheme.primary }}
                        className="text-[9px] font-bold text-white px-1.5 py-0.2 rounded-full"
                      >
                        Hiện tại
                      </span>
                    )}
                  </span>
                  <span className="opacity-60">
                    {m.done}/{m.total}
                  </span>
                </div>

                {/* Thanh tiến độ tháng */}
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2 border border-black/10">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: currentTheme.primary
                    }}
                  />
                </div>

                {/* Danh sách mục tiêu của tháng */}
                <div className="space-y-1.5 min-h-[60px]">
                  {m.items.length === 0 ? (
                    <p className="text-[11px] opacity-40 italic py-1">Chưa có mục tiêu</p>
                  ) : (
                    m.items.map((it) => (
                      <div
                        key={it.id}
                        className="group flex items-center justify-between gap-1 text-[11px] py-0.5 px-1 rounded hover:bg-black/5 transition-colors"
                      >
                        <div
                          onClick={() => toggleYearlyItem(m.month, it.id)}
                          className="flex items-center gap-1.5 cursor-pointer flex-1 min-w-0"
                        >
                          <div
                            style={{
                              backgroundColor: it.done ? currentTheme.primary : 'transparent',
                              borderColor: it.done ? currentTheme.primary : '#9ca3af'
                            }}
                            className="w-3.5 h-3.5 rounded-xs border flex items-center justify-center shrink-0"
                          >
                            {it.done && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span
                            className={`truncate ${
                              it.done ? 'line-through opacity-50 text-gray-500' : 'font-medium'
                            }`}
                          >
                            {it.text}
                          </span>
                        </div>

                        <button
                          onClick={() => deleteYearlyItem(m.month, it.id)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-rose-600 rounded transition-opacity shrink-0"
                          title="Xóa mục tiêu này"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Form thêm mục tiêu vào tháng */}
              <div className="mt-2 pt-1.5 border-t border-dashed border-gray-100">
                {addingMonth === m.month ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddItem(m.month);
                    }}
                    className="space-y-1"
                  >
                    <input
                      type="text"
                      autoFocus
                      value={monthInputText}
                      onChange={(e) => setMonthInputText(e.target.value)}
                      placeholder="Mục tiêu tháng..."
                      className="sketch-input w-full px-2 py-0.5 text-[11px] bg-white"
                    />
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setAddingMonth(null);
                          setMonthInputText('');
                        }}
                        className="px-1.5 py-0.2 text-[9px] text-gray-500 hover:bg-gray-100 rounded"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        style={{ backgroundColor: currentTheme.primary }}
                        className="sketch-btn px-2 py-0.2 text-[9px] font-bold text-white"
                      >
                        Thêm
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => {
                      setAddingMonth(m.month);
                      setMonthInputText('');
                    }}
                    className="text-[10px] font-bold opacity-60 hover:opacity-100 text-left flex items-center gap-1 transition-opacity w-full"
                  >
                    <Plus className="w-3 h-3" /> Thêm mục tiêu
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
