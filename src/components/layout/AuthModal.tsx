"use client";

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  LogOut,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Send
} from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthTab = 'signin' | 'signup' | 'magiclink';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const {
    currentTheme,
    user,
    logout,
    syncStatus,
    syncToCloudNow,
    triggerToast,
    login
  } = usePlanner();

  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetFormState = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleTabChange = (tab: AuthTab) => {
    setActiveTab(tab);
    resetFormState();
  };

  // 1. Đăng nhập với Email & Mật khẩu
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!isSupabaseConfigured || !supabase) {
      // Fallback cục bộ
      const finalName = name.trim() || email.split('@')[0];
      login(email, finalName);
      onClose();
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ Email và Mật khẩu!');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrorMessage('Email hoặc mật khẩu không chính xác!');
        } else if (error.message.includes('Email not confirmed')) {
          setErrorMessage('Email chưa được xác thực. Vui lòng kiểm tra hộp thư đến của bạn!');
        } else {
          setErrorMessage(error.message);
        }
      } else if (data?.user) {
        triggerToast('Đăng nhập Supabase thành công!');
        onClose();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra khi đăng nhập.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // 2. Đăng ký tài khoản mới với Email & Mật khẩu
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!isSupabaseConfigured || !supabase) {
      const finalName = name.trim() || email.split('@')[0];
      login(email, finalName);
      onClose();
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage('Vui lòng nhập Email và Mật khẩu!');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Mật khẩu cần tối thiểu 6 ký tự!');
      return;
    }

    setLoading(true);
    try {
      const finalName = name.trim() || email.split('@')[0];
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: finalName,
            name: finalName
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          setErrorMessage('Email này đã được đăng ký. Vui lòng chuyển sang tab Đăng nhập!');
        } else {
          setErrorMessage(error.message);
        }
      } else if (data?.user) {
        if (data.session) {
          triggerToast(`🎉 Đăng ký thành công! Chào mừng ${finalName}`);
          onClose();
        } else {
          setSuccessMessage(
            'Đăng ký tài khoản thành công! Vui lòng kiểm tra hộp thư email để nhấn liên kết kích hoạt.'
          );
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra khi đăng ký.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // 3. Gửi Magic Link đăng nhập qua Email
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!isSupabaseConfigured || !supabase) {
      setErrorMessage('Chức năng Magic Link cần kết nối Supabase Cloud.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Vui lòng nhập địa chỉ Email!');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
        }
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage(
          `✉️ Đã gửi link đăng nhập một chạm tới ${email.trim()}! Hãy mở hộp thư để vào ứng dụng.`
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Có lỗi khi gửi Magic Link.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // 4. Đăng nhập qua Google OAuth
  const handleGoogleLogin = async () => {
    if (!isSupabaseConfigured || !supabase) {
      // Offline fallback
      login('hoang.planner@gmail.com', 'Hoàng Nguyễn');
      onClose();
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
        }
      });
      if (error) setErrorMessage(error.message);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối Google.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
      <div
        className="sketch-card w-full max-w-md bg-white p-5 sm:p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto"
        style={{ borderColor: currentTheme.border }}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-gray-200">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white sketch-btn"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base leading-tight">
                Tài khoản & Đồng bộ Đám mây
              </h3>
              <p className="text-[11px] font-medium opacity-65">
                Supabase Auth · Cloud Sync Offline-first
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

        {/* THÔNG BÁO CẤU HÌNH NGOẠI TUYẾN (NẾU CHƯA CÓ SUPABASE ENV) */}
        {!isSupabaseConfigured && (
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Chế độ Ngoại tuyến:</strong> Chưa tìm thấy biến môi trường{' '}
              <code className="text-[10px] bg-amber-100 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code>.{' '}
              Dữ liệu được lưu trữ an toàn trong trình duyệt của bạn.
            </div>
          </div>
        )}

        {/* GIAO DIỆN KHI NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP */}
        {user ? (
          <div className="space-y-4 py-2">
            <div
              className="sketch-card-alt p-4 space-y-3"
              style={{ backgroundColor: currentTheme.accent }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full text-white font-black text-base flex items-center justify-center shrink-0 shadow-xs"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  {user.avatar || user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-sm truncate">{user.name}</h4>
                  <p className="text-xs opacity-75 truncate">{user.email}</p>
                  <p className="text-[10px] opacity-55 mt-0.5">
                    User ID: {user.id ? `${user.id.substring(0, 12)}...` : 'Local User'}
                  </p>
                </div>
              </div>

              {/* Trạng thái đồng bộ đám mây */}
              <div className="pt-2 border-t border-dashed border-gray-300 flex items-center justify-between text-xs">
                <span className="font-bold opacity-75 flex items-center gap-1.5">
                  Trạng thái Cloud:
                </span>
                <div className="flex items-center gap-1.5 font-bold">
                  {syncStatus === 'syncing' && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      <span className="text-amber-700">Đang lưu lên Cloud...</span>
                    </>
                  )}
                  {syncStatus === 'synced' && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-emerald-700">Đã đồng bộ đám mây</span>
                    </>
                  )}
                  {syncStatus === 'error' && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span className="text-rose-700">Lỗi lưu Cloud</span>
                    </>
                  )}
                  {syncStatus === 'idle' && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-gray-400" />
                      <span className="opacity-70">Đã lưu cục bộ</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Các nút hành động khi đã đăng nhập */}
            <div className="flex gap-2">
              <button
                onClick={() => syncToCloudNow()}
                disabled={syncStatus === 'syncing'}
                className="flex-1 sketch-btn py-2 px-3 bg-white hover:bg-gray-50 text-xs font-bold flex items-center justify-center gap-2"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`}
                />
                <span>Đồng bộ ngay</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="sketch-btn py-2 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center gap-1.5 border-rose-300"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        ) : (
          /* GIAO DIỆN CHƯA ĐĂNG NHẬP: TABS ĐĂNG NHẬP / ĐĂNG KÝ / MAGIC LINK */
          <div className="space-y-3.5">
            {/* Tabs chuyển đổi */}
            <div className="flex p-1 bg-gray-100 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => handleTabChange('signin')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'signin'
                    ? 'bg-white shadow-xs font-black text-black'
                    : 'opacity-65 hover:opacity-100'
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('signup')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'signup'
                    ? 'bg-white shadow-xs font-black text-black'
                    : 'opacity-65 hover:opacity-100'
                }`}
              >
                Đăng ký
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('magiclink')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'magiclink'
                    ? 'bg-white shadow-xs font-black text-black'
                    : 'opacity-65 hover:opacity-100'
                }`}
              >
                Magic Link
              </button>
            </div>

            {/* Thông báo lỗi / thành công */}
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Nút Đăng nhập nhanh Google */}
            <button
              onClick={handleGoogleLogin}
              type="button"
              disabled={loading}
              className="w-full sketch-btn py-2 px-3 bg-white hover:bg-gray-50 text-xs font-bold flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Tiếp tục với Google</span>
            </button>

            <div className="flex items-center gap-2 my-2 opacity-50">
              <div className="flex-1 border-t border-dashed border-gray-300" />
              <span className="text-[10px] font-bold uppercase">
                {activeTab === 'signin' && 'Hoặc đăng nhập bằng Email'}
                {activeTab === 'signup' && 'Hoặc đăng ký bằng Email'}
                {activeTab === 'magiclink' && 'Hoặc gửi link vào Email'}
              </span>
              <div className="flex-1 border-t border-dashed border-gray-300" />
            </div>

            {/* FORM 1: ĐĂNG NHẬP */}
            {activeTab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold block opacity-75 mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Địa chỉ Email:
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="sketch-input w-full px-2.5 py-1.5 text-xs bg-gray-50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold block opacity-75 mb-1 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Mật khẩu:
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="sketch-input w-full px-2.5 py-1.5 text-xs bg-gray-50 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sketch-btn py-2 text-white text-xs font-bold flex items-center justify-center gap-2 mt-2"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  {loading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>{loading ? 'Đang kết nối...' : 'Đăng nhập vào sổ tay'}</span>
                </button>
              </form>
            )}

            {/* FORM 2: ĐĂNG KÝ */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold block opacity-75 mb-1 flex items-center gap-1">
                    <UserIcon className="w-3 h-3" /> Tên của bạn (Tùy chọn):
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Hoàng Nguyễn"
                    className="sketch-input w-full px-2.5 py-1.5 text-xs bg-gray-50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold block opacity-75 mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Địa chỉ Email:
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="sketch-input w-full px-2.5 py-1.5 text-xs bg-gray-50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold block opacity-75 mb-1 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Mật khẩu (tối thiểu 6 ký tự):
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="sketch-input w-full px-2.5 py-1.5 text-xs bg-gray-50 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sketch-btn py-2 text-white text-xs font-bold flex items-center justify-center gap-2 mt-2"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  {loading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <KeyRound className="w-3.5 h-3.5" />
                  )}
                  <span>{loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản & Đồng bộ Cloud'}</span>
                </button>
              </form>
            )}

            {/* FORM 3: MAGIC LINK */}
            {activeTab === 'magiclink' && (
              <form onSubmit={handleMagicLink} className="space-y-3">
                <p className="text-[11px] opacity-75 leading-relaxed">
                  Nhập email của bạn, chúng tôi sẽ gửi 1 liên kết đăng nhập trực tiếp mà không cần nhớ mật khẩu.
                </p>

                <div>
                  <label className="text-[11px] font-bold block opacity-75 mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Địa chỉ Email:
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="sketch-input w-full px-2.5 py-1.5 text-xs bg-gray-50 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sketch-btn py-2 text-white text-xs font-bold flex items-center justify-center gap-2 mt-2"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  {loading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{loading ? 'Đang gửi...' : 'Gửi liên kết Magic Link'}</span>
                </button>
              </form>
            )}

            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[11px] opacity-75 leading-relaxed">
              🔒 <strong>Offline-first:</strong> Dữ liệu luôn lưu trước vào máy để đạt tốc độ 0ms, sau đó đồng bộ ngầm an toàn lên Supabase.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
