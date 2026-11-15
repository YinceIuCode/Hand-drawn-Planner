"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Target, CheckCircle2, Calendar, Mountain, BarChart3,
  Music, Volume2, Play, Pause, Menu, X, Palette,
  Database, SlidersHorizontal, Radio, UserCheck, LogOut, User as UserIcon
} from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';
import { THEMES, CHILL_PRESETS } from '@/lib/constants';
import DataManagementModal from '@/components/layout/DataManagementModal';
import AuthModal from '@/components/layout/AuthModal';

const YouTubeIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const NAV_ITEMS = [
  { id: 'today', label: 'Hôm nay', shortLabel: 'Hôm nay', icon: Sparkles },
  { id: 'goals', label: 'Mục tiêu & tầm nhìn', shortLabel: 'Mục tiêu', icon: Target },
  { id: 'habits', label: 'Theo dõi thói quen', shortLabel: 'Thói quen', icon: CheckCircle2 },
  { id: 'weekly', label: 'Kế hoạch tuần', shortLabel: 'Tuần', icon: Calendar },
  { id: 'yearly', label: 'Kế hoạch năm', shortLabel: 'Năm', icon: Mountain },
  { id: 'stats', label: 'Thống kê', shortLabel: 'Thống kê', icon: BarChart3 }
] as const;

export default function Sidebar() {
  const {
    themeId,
    setThemeId,
    currentTheme,
    activeTab,
    setActiveTab,
    mobileMenuOpen,
    setMobileMenuOpen,
    showFloatingPalette,
    setShowFloatingPalette,
    isPlayingMusic,
    toggleMusic,
    youtubeVideoId,
    musicSourceType,
    currentTrackTitle,
    showMusicPopover,
    setShowMusicPopover,
    playPresetTrack,
    playCustomYoutubeUrl,
    showDataModal,
    setShowDataModal,
    user,
    showAuthModal,
    setShowAuthModal,
    logout,
    syncStatus,
    triggerToast
  } = usePlanner();

  const [youtubeInput, setYoutubeInput] = useState<string>('');
  const desktopAsideRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Đóng Popover khi bấm chuột ra ngoài Sidebar (Desktop) hoặc vùng menu (Mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideDesktopAside = desktopAsideRef.current?.contains(target);
      const insideMobileMenu = mobileMenuRef.current?.contains(target);
      if (!insideDesktopAside && !insideMobileMenu) {
        setShowMusicPopover(false);
        setShowFloatingPalette(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowMusicPopover, setShowFloatingPalette]);

  const handleCustomYoutubeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeInput.trim()) return;
    const success = playCustomYoutubeUrl(youtubeInput);
    if (success) {
      setYoutubeInput('');
      setShowMusicPopover(false);
    }
  };

  const handleToggleMusicPopover = () => {
    if (!showMusicPopover) {
      setShowFloatingPalette(false);
      setShowMusicPopover(true);
    } else {
      setShowMusicPopover(false);
    }
  };

  const handleTogglePalette = () => {
    if (!showFloatingPalette) {
      setShowMusicPopover(false);
      setShowFloatingPalette(true);
    } else {
      setShowFloatingPalette(false);
    }
  };

  // Nội dung Popover Nhạc nền Lofi & YouTube
  const renderMusicPopoverContent = (onClose: () => void) => (
    <>
      <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-gray-200">
        <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 opacity-80">
          <YouTubeIcon className="w-4 h-4 text-red-600 shrink-0" />
          Nhạc nền Lofi & YouTube
        </span>
        <button
          onClick={onClose}
          className="p-1 opacity-60 hover:opacity-100 rounded text-xs"
          title="Đóng"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form dán link YouTube */}
      <form onSubmit={handleCustomYoutubeSubmit} className="space-y-1.5 pt-3">
        <label className="text-[11px] font-bold block opacity-75">
          Dán link YouTube bất kỳ:
        </label>
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={youtubeInput}
            onChange={(e) => setYoutubeInput(e.target.value)}
            placeholder="https://youtu.be/..."
            className="sketch-input flex-1 px-2.5 py-1.5 text-xs bg-gray-50 focus:outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="sketch-btn px-3 py-1.5 text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: currentTheme.primary }}
          >
            Phát
          </button>
        </div>
      </form>

      {/* 5 kênh gợi ý trực tiếp */}
      <div className="space-y-1.5 pt-2.5 mt-2.5 border-t-2 border-dashed border-gray-200">
        <span className="text-[11px] font-bold block opacity-70 mb-1">
          Gợi ý Lofi Chill tuyển chọn:
        </span>
        <div className="space-y-1.5">
          {CHILL_PRESETS.map((preset) => {
            const isCurrent =
              (preset.type === 'youtube' &&
                musicSourceType === 'youtube' &&
                youtubeVideoId === preset.videoId) ||
              (preset.type === 'synth' &&
                musicSourceType === 'synth' &&
                currentTrackTitle === preset.title);

            return (
              <button
                key={preset.id}
                onClick={() => {
                  playPresetTrack(preset.id);
                  onClose();
                }}
                className={`w-full text-left p-2 rounded-xl border text-xs flex items-center justify-between transition-all ${
                  isCurrent
                    ? 'border-black font-extrabold bg-gray-100 shadow-xs'
                    : 'border-gray-200 hover:border-gray-400 bg-white hover:bg-gray-50 opacity-80 hover:opacity-100'
                }`}
              >
                <span className="truncate flex items-center gap-2 max-w-[260px] whitespace-nowrap">
                  {preset.type === 'youtube' ? (
                    <YouTubeIcon className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  ) : (
                    <Radio className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                  <span>{preset.title}</span>
                </span>
                {isCurrent && isPlayingMusic && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );

  // Nội dung Popover 9 Bộ màu vẽ tay
  const renderPalettePopoverContent = (onClose: () => void) => (
    <>
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b-2 border-dashed border-gray-200">
        <span className="text-xs font-black uppercase tracking-wider opacity-80">
          9 Bộ màu vẽ tay
        </span>
        <button
          onClick={onClose}
          className="p-1 opacity-60 hover:opacity-100 rounded text-xs"
          title="Đóng"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {THEMES.map((t) => {
          const isSelected = t.id === themeId;
          return (
            <button
              key={t.id}
              onClick={() => {
                setThemeId(t.id);
                triggerToast(`Đã đổi bộ màu: ${t.name}`);
              }}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all ${
                isSelected
                  ? 'border-black ring-2 ring-black/20 bg-gray-50 scale-102 font-black shadow-xs'
                  : 'border-gray-200 hover:border-gray-400 bg-white hover:scale-102'
              }`}
              title={t.name}
            >
              <div className="w-6 h-6 rounded-full relative overflow-hidden border border-black/30 shadow-xs shrink-0">
                <span
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${t.swatches[0]} 50%, ${t.swatches[2]} 50%)`
                  }}
                />
              </div>
              <span className="text-xs font-bold text-center whitespace-nowrap leading-tight">
                {t.name}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );

  return (
    <>
      {/* ====================================================================
          HEADER MOBILE (Cố định trên đỉnh màn hình điện thoại)
         ==================================================================== */}
      <div className="md:hidden sketch-card px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-extrabold text-lg sketch-btn"
            style={{ backgroundColor: currentTheme.primary }}
          >
            P
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-lg block leading-none">
              PLANNER
            </span>
            <span className="text-[10px] font-bold tracking-widest opacity-60">
              HAND-DRAWN EDITION
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Nút Tài khoản Mobile */}
          <button
            onClick={() => setShowAuthModal(true)}
            className="sketch-btn p-2 bg-white flex items-center justify-center"
            title={user ? user.name : "Đăng nhập / Đồng bộ"}
          >
            {user ? (
              <span
                className="w-4 h-4 rounded-full text-white text-[10px] font-black flex items-center justify-center"
                style={{ backgroundColor: currentTheme.primary }}
              >
                {user.avatar || user.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <UserIcon className="w-4 h-4" />
            )}
          </button>

          {/* Nút bật/tắt nhạc nền trên Mobile */}
          <button
            onClick={toggleMusic}
            className="sketch-btn p-2 bg-white"
            title="Nhạc nền chill"
          >
            {isPlayingMusic ? (
              <Volume2 className="w-4 h-4" style={{ color: currentTheme.primary }} />
            ) : (
              <Music className="w-4 h-4 opacity-70" />
            )}
          </button>

          {/* Menu Drawer Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sketch-btn p-2 bg-white"
            title="Mở menu tiện ích"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ====================================================================
          MENU TIỆN ÍCH TRÊN MOBILE (Khi bấm nút ☰ ở Header)
         ==================================================================== */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden sketch-card p-4 bg-white shadow-xl space-y-3.5 my-2 animate-fadeIn border-2"
          style={{ borderColor: currentTheme.border }}
        >
          {/* 1. Thẻ Tài khoản Người dùng */}
          <div
            className="p-3 rounded-xl border border-gray-200"
            style={{ backgroundColor: currentTheme.accent }}
          >
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {user.avatar && (user.avatar.startsWith('http://') || user.avatar.startsWith('https://')) ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={user.avatar}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border border-black/80 shrink-0 shadow-xs"
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs overflow-hidden select-none"
                        style={{ backgroundColor: currentTheme.primary }}
                      >
                        {((user.name || user.email || 'U').trim().charAt(0) || 'U').toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="font-extrabold text-xs block truncate leading-tight">
                        {user.name}
                      </span>
                      <span className="text-[10px] opacity-70 block truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setShowAuthModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="sketch-btn px-2 py-1 bg-white text-[11px] font-bold"
                    >
                      Quản lý
                    </button>
                    <button
                      onClick={logout}
                      className="sketch-btn px-2 py-1 bg-white text-[11px] font-bold text-rose-600 flex items-center gap-1"
                      title="Đăng xuất"
                    >
                      <LogOut className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Dòng trạng thái đồng bộ trên Mobile */}
                <div className="pt-1.5 border-t border-dashed border-gray-300 flex items-center justify-between text-[11px] font-bold">
                  <div className="flex items-center gap-1.5">
                    {syncStatus === 'syncing' && (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                        <span className="text-amber-800">Đang lưu đám mây...</span>
                      </>
                    )}
                    {syncStatus === 'synced' && (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-emerald-800">Đã đồng bộ đám mây</span>
                      </>
                    )}
                    {syncStatus === 'error' && (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span className="text-rose-700">Lỗi lưu Cloud</span>
                      </>
                    )}
                    {syncStatus === 'idle' && (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        <span className="opacity-75">Đã lưu cục bộ</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" style={{ color: currentTheme.primary }} />
                  <div>
                    <span className="text-xs font-bold block">Tài khoản & Đồng bộ</span>
                    <span className="text-[10px] opacity-60 block">Lưu dữ liệu theo Email</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="sketch-btn px-3 py-1 text-white text-xs font-bold"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  Đăng nhập
                </button>
              </div>
            )}
          </div>

          {/* 2. Tiện ích Nhạc nền Chill & Bộ màu */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                handleToggleMusicPopover();
                setMobileMenuOpen(false);
              }}
              className="sketch-btn p-2.5 bg-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <Music className="w-4 h-4" style={{ color: currentTheme.primary }} />
              <span>Nhạc nền chill</span>
            </button>

            <button
              onClick={() => {
                handleTogglePalette();
                setMobileMenuOpen(false);
              }}
              className="sketch-btn p-2.5 bg-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <Palette className="w-4 h-4" style={{ color: currentTheme.primary }} />
              <span>Bộ màu ({currentTheme.name})</span>
            </button>
          </div>

          {/* 3. Nút Sao lưu & Khôi phục dữ liệu */}
          <button
            onClick={() => {
              setShowDataModal(true);
              setMobileMenuOpen(false);
            }}
            className="w-full sketch-btn p-2.5 bg-white hover:bg-gray-50 text-xs font-bold flex items-center justify-center gap-2"
          >
            <Database className="w-4 h-4" style={{ color: currentTheme.primary }} />
            <span>Sao lưu / Khôi phục dữ liệu (.json)</span>
          </button>
        </div>
      )}

      {/* ====================================================================
          POPOVER TRÊN MOBILE (CENTERED SHEET & BACKDROP RIÊNG BIỆT)
         ==================================================================== */}
      <div className="md:hidden">
        {(showMusicPopover || showFloatingPalette) && (
          <div
            className="fixed inset-0 bg-black/35 backdrop-blur-xs z-[9998] animate-fadeIn"
            onClick={() => {
              setShowMusicPopover(false);
              setShowFloatingPalette(false);
            }}
          />
        )}

        {showMusicPopover && (
          <div
            className="fixed inset-x-4 bottom-24 z-[9999] max-w-sm mx-auto sketch-card p-4 shadow-2xl animate-fadeIn"
            style={{
              backgroundColor: 'var(--card-bg, #ffffff)',
              borderColor: currentTheme.border
            }}
          >
            {renderMusicPopoverContent(() => setShowMusicPopover(false))}
          </div>
        )}

        {showFloatingPalette && (
          <div
            className="fixed inset-x-4 bottom-24 z-[9999] max-w-sm mx-auto sketch-card p-4 shadow-2xl animate-fadeIn"
            style={{
              backgroundColor: 'var(--card-bg, #ffffff)',
              borderColor: currentTheme.border
            }}
          >
            {renderPalettePopoverContent(() => setShowFloatingPalette(false))}
          </div>
        )}
      </div>

      {/* ====================================================================
          DESKTOP SIDEBAR (<aside> CỐ ĐỊNH, KHÔNG BỊ CO GIÃN)
         ==================================================================== */}
      <aside
        ref={desktopAsideRef}
        className="hidden md:flex flex-col justify-between w-64 shrink-0 h-full sketch-card p-4 overflow-visible relative"
      >
        {/* KHỐI TRÊN: Logo + 6 Tab Điều hướng */}
        <div>
          {/* Logo & Nút Cài đặt Dữ liệu */}
          <div className="flex items-center justify-between px-1 pt-1 pb-5">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-xl sketch-btn"
                style={{ backgroundColor: currentTheme.primary }}
              >
                P
              </div>
              <div>
                <h1
                  className="font-black text-xl tracking-wide leading-none"
                  style={{ color: currentTheme.primary }}
                >
                  PLANNER
                </h1>
                <p className="text-[10px] font-bold tracking-widest opacity-60 mt-0.5">
                  DIGITAL NOTEBOOK
                </p>
              </div>
            </div>

            {/* Nút Cài đặt & Quản lý dữ liệu (Modal Export/Import JSON) */}
            <button
              onClick={() => setShowDataModal(true)}
              className="sketch-btn p-1.5 bg-white text-xs hover:bg-gray-50 opacity-75 hover:opacity-100 transition-all"
              title="Cài đặt & Quản lý dữ liệu (Export/Import/Reset)"
            >
              <Database className="w-4 h-4" style={{ color: currentTheme.primary }} />
            </button>
          </div>

          {/* 6 Mục điều hướng chính trên Desktop */}
          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    backgroundColor: isActive ? currentTheme.primaryLight : 'transparent'
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-bold transition-all ${
                    isActive ? 'sketch-btn' : 'hover:opacity-80 rounded-xl'
                  }`}
                >
                  <Icon
                    className="w-4 h-4 shrink-0"
                    style={{ color: isActive ? currentTheme.primary : currentTheme.textMuted }}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ====================================================================
            KHỐI TIỆN ÍCH DƯỚI ĐÁY SIDEBAR (BÊN DƯỚI ĐƯỜNG KẺ NÉT ĐỨT)
            LUÔN HIỂN THỊ 100% CẢ 3 THẺ: TÀI KHOẢN + NHẠC NỀN CHILL + BỘ MÀU
           ==================================================================== */}
        <div className="pt-3 mt-3 border-t-2 border-dashed space-y-2.5">
          {/* 1. THẺ TÀI KHOẢN (LUÔN HIỂN THỊ 100%) */}
          {user ? (
            <div
              className="sketch-card-alt p-2.5 text-xs space-y-1.5"
              style={{ backgroundColor: currentTheme.accent }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  {user.avatar && (user.avatar.startsWith('http://') || user.avatar.startsWith('https://')) ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover border border-black/80 shrink-0 shadow-xs"
                    />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-full text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs overflow-hidden select-none"
                      style={{ backgroundColor: currentTheme.primary }}
                    >
                      {((user.name || user.email || 'U').trim().charAt(0) || 'U').toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="font-extrabold text-xs block truncate leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] opacity-65 block truncate">
                      {user.email}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="p-1 hover:text-black opacity-60 hover:opacity-100 transition-colors"
                    title="Cài đặt tài khoản & Đồng bộ"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={logout}
                    className="p-1 hover:text-rose-600 opacity-60 hover:opacity-100 transition-colors"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div
                onClick={() => setShowAuthModal(true)}
                className="flex items-center justify-between text-[10px] font-bold pt-1.5 border-t border-dashed border-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
                title="Bấm để xem chi tiết đồng bộ"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {syncStatus === 'syncing' && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping shrink-0" />
                      <span className="text-amber-800 truncate">Đang lưu đám mây...</span>
                    </>
                  )}
                  {syncStatus === 'synced' && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-emerald-800 truncate">Đã đồng bộ đám mây</span>
                    </>
                  )}
                  {syncStatus === 'error' && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span className="text-rose-700 truncate">Lỗi lưu Cloud</span>
                    </>
                  )}
                  {syncStatus === 'idle' && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                      <span className="opacity-75 truncate">Đã lưu cục bộ</span>
                    </>
                  )}
                </div>
                <span className="text-[9px] opacity-60 underline shrink-0 ml-1">Chi tiết</span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full sketch-btn p-2 bg-white hover:bg-gray-50 flex items-center justify-between text-xs font-bold transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-100 border border-black/20 flex items-center justify-center">
                  <UserCheck className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
                </div>
                <div className="text-left">
                  <span className="block text-[11px] font-black leading-tight">Đăng nhập</span>
                  <span className="block text-[9px] opacity-60 font-medium">Đồng bộ riêng tư</span>
                </div>
              </div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full border border-dashed font-bold"
                style={{ borderColor: currentTheme.primary, color: currentTheme.primary }}
              >
                Đồng bộ
              </span>
            </button>
          )}

          {/* 2. THẺ NHẠC NỀN CHILL (LUÔN HIỂN THỊ 100%) */}
          <div
            className={`sketch-card-alt p-2.5 text-xs transition-all ${
              showMusicPopover ? 'ring-2 ring-black/30 border-black shadow-sm' : ''
            }`}
            style={{ backgroundColor: currentTheme.accent }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
                Nhạc nền chill
              </span>
              <div className="flex items-center gap-1">
                {/* Nút mở Popover cấu hình YouTube / Preset */}
                <button
                  onClick={handleToggleMusicPopover}
                  className={`sketch-btn p-1 transition-colors ${
                    showMusicPopover ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'
                  }`}
                  title="Dán link YouTube hoặc chọn bài"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                </button>

                {/* Nút Bật / Tắt nhạc */}
                <button
                  onClick={toggleMusic}
                  className="sketch-btn px-2 py-0.5 bg-white text-[11px] font-bold flex items-center gap-1"
                >
                  {isPlayingMusic ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  {isPlayingMusic ? 'Dừng' : 'Phát'}
                </button>
              </div>
            </div>

            {/* Tên bài đang chọn / phát */}
            <div className="flex items-center justify-between gap-1">
              <p className="truncate text-[11px] opacity-75 flex items-center gap-1">
                {musicSourceType === 'youtube' ? (
                  <YouTubeIcon className="w-3 h-3 text-red-500 shrink-0" />
                ) : (
                  <Radio className="w-3 h-3 text-emerald-600 shrink-0" />
                )}
                <span className="truncate">{currentTrackTitle}</span>
              </p>
              {isPlayingMusic && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
              )}
            </div>
          </div>

          {/* 3. THẺ BỘ MÀU VẼ TAY (LUÔN HIỂN THỊ 100%) */}
          <button
            onClick={handleTogglePalette}
            className={`w-full sketch-btn p-2.5 flex items-center justify-between text-xs transition-all ${
              showFloatingPalette
                ? 'ring-2 ring-black/30 bg-gray-50 border-black shadow-sm'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" style={{ color: currentTheme.primary }} />
              <div className="text-left">
                <span className="block text-[10px] opacity-60 leading-none">Bộ màu</span>
                <span className="font-bold">{currentTheme.name}</span>
              </div>
            </div>
            <div className="flex -space-x-1">
              {currentTheme.swatches.map((hex, i) => (
                <span
                  key={i}
                  className="w-3.5 h-3.5 rounded-full border border-black/30"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </button>
        </div>

        {/* ====================================================================
            DESKTOP FLOATING POPOVER: NHẠC NỀN (LÀ CON TRỰC TIẾP CỦA <aside>)
            Neo cố định: left: calc(100% + 20px), bottom: 0px, top: auto
           ==================================================================== */}
        {showMusicPopover && (
          <div
            className="sketch-card p-4 shadow-xl animate-fadeIn hidden md:block"
            style={{
              position: 'absolute',
              left: 'calc(100% + 20px)',
              bottom: '0px',
              top: 'auto',
              width: '340px',
              zIndex: 9999,
              backgroundColor: 'var(--card-bg, #ffffff)',
              borderColor: currentTheme.border
            }}
          >
            {renderMusicPopoverContent(() => setShowMusicPopover(false))}
          </div>
        )}

        {/* ====================================================================
            DESKTOP FLOATING POPOVER: 9 BỘ MÀU (LÀ CON TRỰC TIẾP CỦA <aside>)
            Neo cố định: left: calc(100% + 20px), bottom: 0px, top: auto
           ==================================================================== */}
        {showFloatingPalette && (
          <div
            className="sketch-card p-4 shadow-xl animate-fadeIn hidden md:block"
            style={{
              position: 'absolute',
              left: 'calc(100% + 20px)',
              bottom: '0px',
              top: 'auto',
              width: '340px',
              zIndex: 9999,
              backgroundColor: 'var(--card-bg, #ffffff)',
              borderColor: currentTheme.border
            }}
          >
            {renderPalettePopoverContent(() => setShowFloatingPalette(false))}
          </div>
        )}
      </aside>

      {/* ====================================================================
          BOTTOM NAVIGATION (Mobile bar cố định đáy màn hình)
         ==================================================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t-2 border-black/80 flex items-center justify-around py-1.5 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-lg transition-all ${
                isActive ? 'scale-105' : 'opacity-65'
              }`}
            >
              <Icon
                className="w-4 h-4"
                style={{ color: isActive ? currentTheme.primary : 'currentColor' }}
              />
              <span
                className="text-[10px] font-bold mt-0.5 whitespace-nowrap leading-tight"
                style={{ color: isActive ? currentTheme.primary : 'currentColor' }}
              >
                {item.shortLabel}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Modal Quản lý & Cài đặt dữ liệu (Export / Import JSON / Reset) */}
      <DataManagementModal
        isOpen={showDataModal}
        onClose={() => setShowDataModal(false)}
      />

      {/* Modal Đăng nhập & Đồng bộ Tài khoản */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
