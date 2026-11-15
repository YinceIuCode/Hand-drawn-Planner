"use client";

import React from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, Tooltip
} from 'recharts';
import { usePlanner } from '@/context/PlannerContext';

export default function YearlyTab() {
  const { currentTheme, yearly, setYearly } = usePlanner();

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
  );
}
