"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Sparkles } from 'lucide-react';
import { usePlanner, PlannerProvider } from '@/context/PlannerContext';
import Sidebar from '@/components/layout/Sidebar';
import TodayTab from '@/components/tabs/TodayTab';
import GoalsTab from '@/components/tabs/GoalsTab';
import HabitsTab from '@/components/tabs/HabitsTab';
import WeeklyTab from '@/components/tabs/WeeklyTab';
import YearlyTab from '@/components/tabs/YearlyTab';
import StatsTab from '@/components/tabs/StatsTab';

function PlannerContent() {
  const {
    currentTheme,
    activeTab,
    toastMessage,
    showConfetti,
    isPlayingMusic,
    musicSourceType,
    youtubeVideoId
  } = usePlanner();

  return (
    <div
      style={
        {
          '--bg-grid': currentTheme.bgGrid,
          '--grid-line': currentTheme.gridLine,
          '--card-bg': currentTheme.cardBg,
          '--text-main': currentTheme.textMain,
          '--text-muted': currentTheme.textMuted,
          '--primary': currentTheme.primary,
          '--primary-light': currentTheme.primaryLight,
          '--accent': currentTheme.accent,
          '--border-color': currentTheme.border
        } as React.CSSProperties
      }
      className="planner-grid-bg min-h-screen md:h-screen md:overflow-hidden font-sans transition-colors duration-300 relative"
    >
      {/* Hidden YouTube Iframe Player cho Nhạc nền Chill & Lofi */}
      {isPlayingMusic && musicSourceType === 'youtube' && youtubeVideoId && (
        <iframe
          key={youtubeVideoId}
          src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&loop=1&playlist=${youtubeVideoId}&enablejsapi=1`}
          allow="autoplay; encrypted-media"
          className="hidden pointer-events-none w-0 h-0 opacity-0 absolute -left-[9999px]"
          title="YouTube Chill Background Music"
        />
      )}
      {/* Hiệu ứng Pháo Hoa khi hoàn thành 100% công việc ngày */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 45 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece rounded-sm"
              style={{
                left: `${(i * 100) / 45}%`,
                backgroundColor: ['#0f6848', '#f59e0b', '#ec4899', '#6366f1', '#10b981'][i % 5],
                animationDelay: `${(i % 7) * 0.12}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Floating Toast Notification độc lập hoàn toàn với Flexbox */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            width: 'max-content',
            maxWidth: '520px',
            height: 'auto',
            padding: '10px 20px',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            border: '2.5px solid var(--border-color)',
            borderRadius: '255px 20px 225px 20px / 20px 225px 20px 255px',
            boxShadow: '4px 4px 0px var(--border-color)'
          }}
          className="sketch-toast flex items-center gap-2.5 text-sm font-bold shadow-lg text-center"
        >
          <Sparkles className="w-4 h-4 shrink-0 text-amber-300" />
          <span className="whitespace-normal leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* Khung chuẩn App-Shell Layout (Cố định Sidebar, tự cuộn Main Content) */}
      <div className="h-full min-h-screen md:min-h-0 md:h-screen md:overflow-hidden bg-grid-paper flex flex-col md:flex-row gap-5 p-4 md:p-5 max-w-[1440px] mx-auto w-full">
        {/* Sidebar điều hướng (Cố định toàn chiều cao trong khung p-5) */}
        <Sidebar />

        {/* Cột nội dung bên phải (Tự cuộn độc lập) */}
        <main className="flex-1 h-full min-w-0 overflow-y-auto pr-1 pb-28 md:pb-6 space-y-6 custom-scrollbar">
          {activeTab === 'today' && <TodayTab />}
          {activeTab === 'goals' && <GoalsTab />}
          {activeTab === 'habits' && <HabitsTab />}
          {activeTab === 'weekly' && <WeeklyTab />}
          {activeTab === 'yearly' && <YearlyTab />}
          {activeTab === 'stats' && <StatsTab />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen bg-grid-paper" />;
  }

  return (
    <Suspense fallback={null}>
      <PlannerProvider>
        <PlannerContent />
      </PlannerProvider>
    </Suspense>
  );
}
