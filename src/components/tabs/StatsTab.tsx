"use client";

import React from 'react';
import { Info } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar
} from 'recharts';
import { usePlanner } from '@/context/PlannerContext';
import { TREND_DATA } from '@/lib/constants';

export default function StatsTab() {
  const {
    currentTheme,
    statsPeriod,
    setStatsPeriod,
    chartType,
    setChartType
  } = usePlanner();

  return (
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
  );
}
