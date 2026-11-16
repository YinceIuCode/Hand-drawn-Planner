"use client";

import React from 'react';
import {
  X,
  Bell,
  Clock,
  Send,
  Smartphone,
  Download,
  CheckCircle2,
  AlertCircle,
  Share2
} from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const {
    currentTheme,
    notificationSettings,
    updateNotificationSettings,
    sendTestNotification,
    canInstallPwa,
    installPwa,
    isPwaInstalled,
    isIOSDevice,
    todaysTasks,
    habits,
    selectedDayNumber
  } = usePlanner();

  if (!isOpen) return null;

  const remainingTasksCount = todaysTasks.filter((t) => !t.completed).length;
  const doneHabitsCount = habits.filter((h) => h.daysDone.includes(selectedDayNumber)).length;

  const hasNotificationSupport =
    typeof window !== 'undefined' && 'Notification' in window;
  const permissionStatus = hasNotificationSupport ? Notification.permission : 'unsupported';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div
        className="sketch-card w-full max-w-lg bg-white p-5 sm:p-6 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto"
        style={{ borderColor: currentTheme.border }}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-gray-200">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white sketch-btn"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg leading-tight">
                Nhắc nhở & Cài đặt App (PWA)
              </h3>
              <p className="text-[11px] font-medium opacity-65">
                Thiết lập thông báo hằng ngày và cài đặt sổ tay lên màn hình chính
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors opacity-70 hover:opacity-100"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PHẦN 1: NHẮC NHỞ MỖI NGÀY (WEB NOTIFICATIONS) */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" style={{ color: currentTheme.primary }} />
              <h4 className="font-extrabold text-sm">1. Nhắc nhở mỗi ngày (Web Notifications)</h4>
            </div>

            {/* Công tắc Bật/Tắt nhắc nhở */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.enabled}
                onChange={(e) => updateNotificationSettings({ enabled: e.target.value === 'true' || e.target.checked })}
                className="sr-only peer"
              />
              <div
                className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border border-black/20"
                style={{
                  backgroundColor: notificationSettings.enabled ? currentTheme.primary : undefined
                }}
              />
            </label>
          </div>

          {/* Trạng thái quyền thông báo */}
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-[11px]">
            <span className="opacity-75 font-medium">Quyền thông báo hệ thống:</span>
            <span className="font-bold flex items-center gap-1">
              {permissionStatus === 'granted' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Đã cấp quyền</span>
                </>
              ) : permissionStatus === 'denied' ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span className="text-rose-600">Đang bị chặn trong cài đặt</span>
                </>
              ) : (
                <span className="text-amber-600">Chưa cấp quyền</span>
              )}
            </span>
          </div>

          {/* 2 Khung giờ nhắc nhở */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Nhắc buổi sáng */}
            <div
              className={`p-3 rounded-xl border border-dashed transition-all space-y-2 ${
                notificationSettings.enabled ? 'bg-amber-50/50 border-amber-300' : 'bg-gray-50/60 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black">☀️ Nhắc buổi sáng</span>
                <input
                  type="time"
                  disabled={!notificationSettings.enabled}
                  value={notificationSettings.morningTime}
                  onChange={(e) => updateNotificationSettings({ morningTime: e.target.value })}
                  className="sketch-input px-2 py-0.5 text-xs font-bold bg-white"
                />
              </div>
              <p className="text-[11px] opacity-75 italic leading-snug">
                &ldquo;☀️ Chào buổi sáng! Hôm nay bạn có {remainingTasksCount} việc cần hoàn thành trong sổ tay.&rdquo;
              </p>
            </div>

            {/* Nhắc buổi tối */}
            <div
              className={`p-3 rounded-xl border border-dashed transition-all space-y-2 ${
                notificationSettings.enabled ? 'bg-indigo-50/50 border-indigo-300' : 'bg-gray-50/60 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black">🌙 Nhắc buổi tối</span>
                <input
                  type="time"
                  disabled={!notificationSettings.enabled}
                  value={notificationSettings.eveningTime}
                  onChange={(e) => updateNotificationSettings({ eveningTime: e.target.value })}
                  className="sketch-input px-2 py-0.5 text-xs font-bold bg-white"
                />
              </div>
              <p className="text-[11px] opacity-75 italic leading-snug">
                &ldquo;🌙 Đừng quên tổng kết ngày và tích {doneHabitsCount}/{habits.length} thói quen hôm nay nhé!&rdquo;
              </p>
            </div>
          </div>

          {/* Nút Bắn thử thông báo ngay */}
          <button
            onClick={() => sendTestNotification()}
            className="w-full sketch-btn py-2 px-3 bg-white hover:bg-gray-50 text-xs font-bold flex items-center justify-center gap-2 border border-black/20 transition-all active:scale-98"
          >
            <Send className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
            <span>🔔 Bắn thử thông báo ngay lên thiết bị</span>
          </button>
        </div>

        {/* PHẦN 2: CÀI ĐẶT ỨNG DỤNG LÊN THIẾT BỊ (PWA) */}
        <div className="pt-3 border-t-2 border-dashed border-gray-200 space-y-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-700" style={{ color: currentTheme.primary }} />
            <h4 className="font-extrabold text-sm">2. Cài đặt ứng dụng lên thiết bị (Install PWA)</h4>
          </div>

          {isPwaInstalled ? (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Tuyệt vời!</strong> Bạn đang sử dụng Planner ở chế độ Ứng dụng độc lập (PWA).
              </span>
            </div>
          ) : canInstallPwa ? (
            <div className="space-y-2">
              <p className="text-[11px] opacity-70">
                Cài đặt sổ tay thành ứng dụng riêng trên máy tính (Chrome/Edge) hoặc màn hình chính điện thoại (Android):
              </p>
              <button
                onClick={() => installPwa()}
                style={{ backgroundColor: currentTheme.primary }}
                className="w-full sketch-btn py-2.5 px-4 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Download className="w-4 h-4" />
                <span>📲 Cài đặt ứng dụng Planner lên máy</span>
              </button>
            </div>
          ) : isIOSDevice ? (
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <div className="flex items-center gap-2 font-bold">
                <Share2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Hướng dẫn cài đặt trên iPhone / iPad:</span>
              </div>
              <p className="text-[11px] opacity-85 leading-relaxed">
                Trên Safari: Bấm nút <strong>Chia sẻ (Share ⎋)</strong> ở thanh công cụ dưới màn hình ➔ cuộn xuống chọn <strong>&ldquo;Thêm vào Màn hình chính&rdquo; (Add to Home Screen)</strong>.
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1">
              <p className="font-bold text-gray-800">
                📲 Sẵn sàng cài đặt như ứng dụng (PWA)
              </p>
              <p className="text-[11px] opacity-70 leading-relaxed">
                Trên máy tính, bấm biểu tượng <strong>Cài đặt</strong> (hoặc icon máy tính/mũi tên tải xuống) trên thanh địa chỉ trình duyệt Chrome/Edge để ghim Planner vào Taskbar / Desktop.
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[10px] opacity-50 pt-2 border-t border-gray-100">
          <span>Hỗ trợ Service Worker & Web Notifications API</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Sẵn sàng offline
          </span>
        </div>
      </div>
    </div>
  );
}
