"use client";

import React from 'react';
import { Info, Plus } from 'lucide-react';
import {
  ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { usePlanner } from '@/context/PlannerContext';

export default function GoalsTab() {
  const { currentTheme, goals, triggerToast } = usePlanner();

  return (
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
                  { subject: 'Sự nghiệp', score: 80 },
                  { subject: 'Phát triển', score: 70 },
                  { subject: 'Quan hệ', score: 45 },
                  { subject: 'Học tập', score: 75 }
                ]}
              >
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar
                  name="Điểm"
                  dataKey="score"
                  stroke={currentTheme.primary}
                  fill={currentTheme.primaryLight}
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Danh sách mục tiêu chi tiết 6 thẻ giống hệt ảnh 4 */}
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
  );
}
