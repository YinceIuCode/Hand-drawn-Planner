"use client";

import React from 'react';
import { Award, Plus } from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';

export default function WeeklyTab() {
  const { currentTheme } = usePlanner();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold">Kế hoạch tuần</h2>
          <p className="text-xs opacity-70">Tuần 43: 19/10 - 25/10/2026</p>
        </div>
        <div className="sketch-card px-4 py-2 flex items-center gap-4">
          <span className="text-xs font-bold">
            Tiến độ tuần: <strong>21/30 việc</strong> (70%)
          </span>
        </div>
      </div>

      {/* Nhận xét tuần */}
      <div
        className="sketch-card p-3.5 text-xs flex items-center gap-3"
        style={{ backgroundColor: currentTheme.accent }}
      >
        <Award className="w-5 h-5 shrink-0" style={{ color: currentTheme.primary }} />
        <span>
          Ngày hiệu quả nhất: <strong>Thứ 2 (6 việc xong)</strong>. Thứ 5 hoàn thành 100% mục tiêu!
        </span>
      </div>

      {/* 7 Cột từ Thứ 2 đến Chủ nhật theo ảnh 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            day: 'Thứ 2',
            date: '19/10',
            items: ['Họp dự án 9h', 'Soạn hợp đồng', 'Chạy bộ 3km', 'Học 20 từ HSK']
          },
          {
            day: 'Thứ 3',
            date: '20/10',
            items: ['Review thiết kế', 'Gặp đối tác café', 'Đọc sách 30p']
          },
          {
            day: 'Thứ 4',
            date: '21/10',
            items: ['Viết báo cáo quý', 'Gửi báo giá', 'Học ngữ pháp']
          },
          {
            day: 'Thứ 5',
            date: '22/10',
            items: ['Chốt danh sách ứng viên', 'Tập yoga 40p', 'Dọn phòng']
          },
          {
            day: 'Thứ 6',
            date: '23/10',
            isToday: true,
            items: ['Ôn từ vựng HSK 3', 'Trả lời email', 'Họp nhóm sprint', 'Chạy bộ 30p']
          },
          {
            day: 'Thứ 7',
            date: '24/10',
            items: ['Mua sắm cuối tuần', 'Nấu ăn tại nhà', 'Xem phim tài liệu']
          },
          {
            day: 'Chủ nhật',
            date: '25/10',
            items: ['Ăn tối cùng gia đình', 'Lên kế hoạch tuần mới', 'Ngủ sớm']
          }
        ].map((col) => (
          <div
            key={col.day}
            className={`sketch-card p-3.5 flex flex-col justify-between ${
              col.isToday ? 'ring-2 ring-offset-2 ring-emerald-600' : ''
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                <div>
                  <span className="font-extrabold text-sm block">{col.day}</span>
                  <span className="text-[10px] opacity-60">{col.date}</span>
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

              <div className="space-y-1.5">
                {col.items.map((it, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs py-0.5">
                    <span className="opacity-50">•</span>
                    <span className="line-clamp-2">{it}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="mt-3 text-[11px] font-bold opacity-60 hover:opacity-100 text-left flex items-center gap-1">
              <Plus className="w-3 h-3" /> Thêm việc
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
