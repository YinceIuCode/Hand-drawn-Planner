"use client";

import React, { useRef, useState } from 'react';
import { Download, Upload, RotateCcw, Trash2, X, Database, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DataManagementModal({ isOpen, onClose }: DataManagementModalProps) {
  const {
    currentTheme,
    exportPlannerData,
    importPlannerData,
    resetToDefaultData,
    clearAllData
  } = usePlanner();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmMode, setConfirmMode] = useState<'reset' | 'clear' | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importPlannerData(content);
        if (success) {
          onClose();
        }
      }
    };
    reader.readAsText(file);
    // Reset file input value so the same file can be re-selected if needed
    e.target.value = '';
  };

  const handleConfirmAction = () => {
    if (confirmMode === 'reset') {
      resetToDefaultData();
    } else if (confirmMode === 'clear') {
      clearAllData();
    }
    setConfirmMode(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div
        className="sketch-card w-full max-w-md bg-white p-5 sm:p-6 shadow-2xl relative space-y-5"
        style={{ borderColor: currentTheme.border }}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-gray-200">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white sketch-btn"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg leading-tight">
                Cài đặt & Dữ liệu
              </h3>
              <p className="text-[11px] font-medium opacity-65">
                Sao lưu, khôi phục hoặc thiết lập lại sổ tay
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setConfirmMode(null);
              onClose();
            }}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors opacity-70 hover:opacity-100"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cảnh báo xác nhận xóa/đặt lại */}
        {confirmMode && (
          <div
            className="p-3.5 rounded-xl border-2 border-dashed text-xs space-y-2.5"
            style={{
              backgroundColor: confirmMode === 'clear' ? '#fff1f2' : '#fefce8',
              borderColor: confirmMode === 'clear' ? '#e11d48' : '#ca8a04'
            }}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              <AlertTriangle
                className="w-4 h-4 shrink-0"
                style={{ color: confirmMode === 'clear' ? '#e11d48' : '#ca8a04' }}
              />
              <span>
                {confirmMode === 'clear'
                  ? 'Xác nhận xóa trắng toàn bộ dữ liệu?'
                  : 'Xác nhận khôi phục dữ liệu mẫu ban đầu?'}
              </span>
            </div>
            <p className="text-[11px] opacity-80 leading-relaxed">
              {confirmMode === 'clear'
                ? 'Thao tác này sẽ xóa sạch danh sách việc, thói quen và mục tiêu hiện có để bạn bắt đầu ghi chép từ con số 0. Hãy xuất file sao lưu trước nếu cần!'
                : 'Thao tác này sẽ thay thế dữ liệu hiện tại bằng bộ dữ liệu mẫu đầy đủ để bạn trải nghiệm và tham khảo mẫu.'}
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setConfirmMode(null)}
                className="sketch-btn px-3 py-1 bg-white text-xs font-semibold"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmAction}
                className="sketch-btn px-3 py-1 text-white text-xs font-bold"
                style={{
                  backgroundColor: confirmMode === 'clear' ? '#e11d48' : currentTheme.primary
                }}
              >
                Tiếp tục thực hiện
              </button>
            </div>
          </div>
        )}

        {/* Các tính năng sao lưu / nhập xuất */}
        {!confirmMode && (
          <div className="space-y-4">
            {/* 1. Xuất file JSON */}
            <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-xs">Xuất file sao lưu (Export JSON)</h4>
                  <p className="text-[11px] opacity-65">
                    Lưu trữ toàn bộ công việc, thói quen, mục tiêu thành file .json về máy
                  </p>
                </div>
              </div>
              <button
                onClick={exportPlannerData}
                className="w-full sketch-btn py-2 px-3 bg-white hover:bg-gray-50 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
                <span>Tải file sao lưu (.json)</span>
              </button>
            </div>

            {/* 2. Nhập file JSON */}
            <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/70 space-y-2">
              <div>
                <h4 className="font-extrabold text-xs">Khôi phục từ file (Import JSON)</h4>
                <p className="text-[11px] opacity-65">
                  Tải lên file sao lưu đã xuất trước đó để phục hồi lại dữ liệu
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full sketch-btn py-2 px-3 bg-white hover:bg-gray-50 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
                <span>Chọn file .json từ thiết bị</span>
              </button>
            </div>

            {/* 3. Đặt lại / Xóa trắng */}
            <div className="pt-2 border-t border-dashed border-gray-200 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setConfirmMode('reset')}
                  className="flex-1 sketch-btn py-2 px-2 bg-white hover:bg-gray-50 text-[11px] font-bold flex items-center justify-center gap-1.5 opacity-80 hover:opacity-100"
                  title="Khôi phục lại bộ công việc và mục tiêu mẫu"
                >
                  <RotateCcw className="w-3 h-3 text-amber-600" />
                  <span>Dữ liệu mẫu ban đầu</span>
                </button>
                <button
                  onClick={() => setConfirmMode('clear')}
                  className="flex-1 sketch-btn py-2 px-2 bg-white hover:bg-rose-50 text-[11px] font-bold text-rose-600 flex items-center justify-center gap-1.5 hover:border-rose-400"
                  title="Xóa toàn bộ để ghi chép từ con số 0"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Xóa trắng (Bắt đầu từ 0)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="flex items-center justify-between text-[10px] opacity-50 pt-2 border-t border-gray-100">
          <span>Sổ tay tự động lưu vào trình duyệt (Local Storage)</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Sẵn sàng
          </span>
        </div>
      </div>
    </div>
  );
}
