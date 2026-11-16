"use client";

import React, { useState, useMemo } from 'react';
import {
  Info,
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  SlidersHorizontal,
  Target
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { usePlanner } from '@/context/PlannerContext';
import { GOAL_CATEGORIES, LIFE_AREAS } from '@/lib/constants';
import { Goal } from '@/types/planner';

export default function GoalsTab() {
  const {
    currentTheme,
    goals,
    lifeScores,
    updateLifeScore,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleGoalStep,
    addGoalStep,
    deleteGoalStep
  } = usePlanner();

  // State mở rộng các bước nhỏ của thẻ mục tiêu (mặc định mở thẻ đầu tiên nếu có)
  const [expandedGoalIds, setExpandedGoalIds] = useState<Set<string>>(() => {
    return goals.length > 0 ? new Set([goals[0].id]) : new Set();
  });

  // State input thêm bước con cho từng mục tiêu: { [goalId]: text }
  const [stepInputs, setStepInputs] = useState<Record<string, string>>({});

  // Chuyển đổi giữa Biểu đồ Radar và Bảng trượt chấm điểm 8 lĩnh vực
  const [showSliders, setShowSliders] = useState<boolean>(false);

  // Modal Thêm / Sửa mục tiêu
  const [isAddingGoal, setIsAddingGoal] = useState<boolean>(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Form states cho thêm / sửa
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<string>(GOAL_CATEGORIES[0]);
  const [formDeadline, setFormDeadline] = useState('');
  const [formReward, setFormReward] = useState('');

  const toggleExpand = (goalId: string) => {
    setExpandedGoalIds((prev) => {
      const next = new Set(prev);
      if (next.has(goalId)) {
        next.delete(goalId);
      } else {
        next.add(goalId);
      }
      return next;
    });
  };

  const openAddModal = () => {
    setFormTitle('');
    setFormCategory(GOAL_CATEGORIES[0]);
    setFormDeadline('');
    setFormReward('');
    setIsAddingGoal(true);
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setFormTitle(goal.title);
    setFormCategory(goal.category);
    setFormDeadline(goal.deadline);
    setFormReward(goal.reward);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingGoal) {
      updateGoal(editingGoal.id, {
        title: formTitle.trim(),
        category: formCategory,
        deadline: formDeadline.trim() || 'Chưa đặt hạn',
        reward: formReward.trim() || 'Tự thưởng một ly trà sữa'
      });
      setEditingGoal(null);
    } else {
      addGoal({
        title: formTitle.trim(),
        category: formCategory,
        deadline: formDeadline.trim() || 'Chưa đặt hạn',
        reward: formReward.trim() || 'Tự thưởng một ly trà sữa',
        status: 'Đang thực hiện',
        steps: []
      });
      setIsAddingGoal(false);
    }
  };

  // Thống kê tổng quan mục tiêu
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.status === 'Đã hoàn thành').length;
  const overallGoalPct =
    totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100);

  // Đếm số mục tiêu theo lĩnh vực
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const g of goals) {
      counts[g.category] = (counts[g.category] || 0) + 1;
    }
    return counts;
  }, [goals]);

  // Dữ liệu biểu đồ Radar lấy từ lifeScores thực tế
  const radarData = useMemo(() => {
    return LIFE_AREAS.map((area) => ({
      subject: area,
      score: lifeScores[area] ?? 50
    }));
  }, [lifeScores]);

  return (
    <div className="space-y-4">
      {/* Tiêu đề & Nút Thêm mục tiêu */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
          <span>Mục tiêu & tầm nhìn</span>
          <Info className="w-4 h-4 opacity-50" />
        </h2>
        <button
          onClick={openAddModal}
          style={{ backgroundColor: currentTheme.primary }}
          className="sketch-btn px-4 py-2 text-xs font-bold text-white flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Thêm mục tiêu
        </button>
      </div>

      {/* 2 Khung tổng quan: Vòng tròn mục tiêu & Biểu đồ Radar Cân bằng các lĩnh vực */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Vòng tròn mục tiêu & Huy hiệu lĩnh vực */}
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
                  strokeDashoffset={
                    2 * Math.PI * 26 * (1 - overallGoalPct / 100)
                  }
                  className="transition-all duration-500"
                />
              </svg>
              <span className="absolute text-sm font-black">{overallGoalPct}%</span>
            </div>
            <div>
              <span className="text-2xl font-black">
                {completedGoals}/{totalGoals}
              </span>{' '}
              <span className="text-base opacity-70 font-semibold">mục tiêu xong</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {LIFE_AREAS.map((badge) => {
              const count = categoryCounts[badge] || 0;
              return (
                <span
                  key={badge}
                  style={{
                    backgroundColor: count > 0 ? currentTheme.accent : '#f3f4f6',
                    opacity: count > 0 ? 1 : 0.6
                  }}
                  className="px-3 py-1 rounded-full text-xs font-bold border border-black/10 transition-colors"
                >
                  {badge} {count}
                </span>
              );
            })}
          </div>
        </div>

        {/* Cân bằng các lĩnh vực (Chuyển đổi giữa Radar Chart & Bảng trượt 8 thanh trượt) */}
        <div className="lg:col-span-6 sketch-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm">Cân bằng các lĩnh vực</h3>
              <span className="text-[11px] opacity-60">
                {showSliders ? '(Thanh trượt 0-100)' : '(Biểu đồ Radar)'}
              </span>
            </div>
            <button
              onClick={() => setShowSliders(!showSliders)}
              style={{
                backgroundColor: showSliders ? currentTheme.primary : currentTheme.accent,
                color: showSliders ? '#ffffff' : currentTheme.textMain
              }}
              className="sketch-btn px-2.5 py-1 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showSliders ? 'Xem biểu đồ' : 'Bảng chấm điểm'}</span>
            </button>
          </div>

          {showSliders ? (
            <div className="space-y-2 py-1 max-h-56 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {LIFE_AREAS.map((area) => {
                  const score = lifeScores[area] ?? 50;
                  return (
                    <div key={area} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span>{area}</span>
                        <span style={{ color: currentTheme.primary }}>{score}/100</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={score}
                        onChange={(e) => updateLifeScore(area, Number(e.target.value))}
                        className="w-full accent-emerald-600 h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                        style={{ accentColor: currentTheme.primary }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
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
          )}
        </div>
      </div>

      {/* Danh sách mục tiêu chi tiết */}
      {goals.length === 0 ? (
        <div className="sketch-card p-10 text-center space-y-3">
          <Target className="w-10 h-10 mx-auto opacity-30" />
          <h4 className="font-bold text-sm">Chưa có mục tiêu nào</h4>
          <p className="text-xs opacity-60 max-w-sm mx-auto">
            Hãy bắt đầu đặt mục tiêu lớn cho bản thân và chia nhỏ thành các bước thực hiện hằng ngày.
          </p>
          <button
            onClick={openAddModal}
            style={{ backgroundColor: currentTheme.primary }}
            className="sketch-btn px-4 py-2 text-xs font-bold text-white inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Thêm mục tiêu đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          {goals.map((g) => {
            const isExpanded = expandedGoalIds.has(g.id);
            const totalSteps = g.steps.length;
            const doneSteps = g.steps.filter((s) => s.done).length;
            const pct = totalSteps === 0 ? 0 : Math.round((doneSteps / totalSteps) * 100);

            return (
              <div
                key={g.id}
                className="sketch-card p-4 flex flex-col justify-between transition-all"
              >
                <div>
                  {/* Hàng trên cùng: Tiêu đề + Nút Sửa, Xóa + Trạng thái */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-extrabold text-sm leading-snug">{g.title}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(g);
                        }}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-black transition-colors"
                        title="Sửa mục tiêu"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteGoal(g.id);
                        }}
                        className="p-1 hover:bg-rose-50 rounded text-gray-400 hover:text-rose-600 transition-colors"
                        title="Xóa mục tiêu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Danh mục, Hạn chót & Phần thưởng */}
                  <div className="flex items-center justify-between text-[11px] opacity-75 mb-1.5">
                    <span>📂 {g.category}</span>
                    <span
                      style={{
                        backgroundColor:
                          g.status === 'Đã hoàn thành'
                            ? currentTheme.primary
                            : currentTheme.primaryLight,
                        color:
                          g.status === 'Đã hoàn thành' ? '#ffffff' : currentTheme.primary
                      }}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    >
                      {g.status}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-70 mb-1">🕒 {g.deadline}</p>
                  <p className="text-[11px] opacity-80 mb-3">🎁 {g.reward}</p>
                </div>

                {/* Thanh tiến độ bước nhỏ */}
                <div className="pt-2 border-t border-dashed border-gray-200">
                  <button
                    onClick={() => toggleExpand(g.id)}
                    className="w-full flex items-center justify-between text-[11px] font-bold mb-1 hover:opacity-80"
                  >
                    <span className="flex items-center gap-1">
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                      <span>Các bước nhỏ</span>
                    </span>
                    <span>
                      {doneSteps}/{totalSteps} bước ({pct}%)
                    </span>
                  </button>

                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden border border-black/20 mb-2">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: currentTheme.primary
                      }}
                    />
                  </div>

                  {/* Danh sách các bước nhỏ mở rộng */}
                  {isExpanded && (
                    <div className="space-y-2 mt-3 pt-2 border-t border-gray-100">
                      {g.steps.length === 0 ? (
                        <p className="text-[11px] opacity-50 italic">
                          Chưa có bước nhỏ nào. Hãy chia nhỏ mục tiêu bên dưới!
                        </p>
                      ) : (
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {g.steps.map((s) => (
                            <div
                              key={s.id}
                              className="group flex items-center justify-between gap-2 p-1.5 rounded hover:bg-black/5 text-xs"
                            >
                              <div
                                onClick={() => toggleGoalStep(g.id, s.id)}
                                className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                              >
                                <div
                                  style={{
                                    backgroundColor: s.done ? currentTheme.primary : 'transparent',
                                    borderColor: s.done ? currentTheme.primary : '#9ca3af'
                                  }}
                                  className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
                                >
                                  {s.done && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span
                                  className={`truncate ${
                                    s.done ? 'line-through opacity-50 text-gray-500' : 'font-medium'
                                  }`}
                                >
                                  {s.text}
                                </span>
                              </div>

                              <button
                                onClick={() => deleteGoalStep(g.id, s.id)}
                                className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-rose-600 rounded transition-opacity shrink-0"
                                title="Xóa bước nhỏ"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Input thêm bước nhỏ mới */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const val = stepInputs[g.id] || '';
                          if (!val.trim()) return;
                          addGoalStep(g.id, val);
                          setStepInputs((prev) => ({ ...prev, [g.id]: '' }));
                        }}
                        className="flex gap-1.5 mt-2"
                      >
                        <input
                          type="text"
                          value={stepInputs[g.id] || ''}
                          onChange={(e) =>
                            setStepInputs((prev) => ({ ...prev, [g.id]: e.target.value }))
                          }
                          placeholder="+ Thêm bước thực hiện..."
                          className="sketch-input flex-1 px-2.5 py-1 text-xs bg-white"
                        />
                        <button
                          type="submit"
                          style={{ backgroundColor: currentTheme.primary }}
                          className="sketch-btn px-3 py-1 text-xs font-bold text-white shrink-0"
                        >
                          Thêm
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Thêm / Sửa mục tiêu */}
      {(isAddingGoal || editingGoal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="sketch-card w-full max-w-md bg-white p-5 sm:p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-gray-200">
              <h3 className="font-black text-base sm:text-lg">
                {editingGoal ? 'Chỉnh sửa mục tiêu' : 'Thêm mục tiêu mới'}
              </h3>
              <button
                onClick={() => {
                  setIsAddingGoal(false);
                  setEditingGoal(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold opacity-70 block mb-1">TÊN MỤC TIÊU *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ví dụ: Thi đỗ chứng chỉ HSK 4, Chạy 5km..."
                  className="sketch-input w-full px-3 py-2 text-xs bg-white"
                />
              </div>

              <div>
                <label className="font-bold opacity-70 block mb-1">LĨNH VỰC</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="sketch-input w-full px-3 py-2 text-xs bg-white"
                >
                  {GOAL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold opacity-70 block mb-1">HẠN CHÓT</label>
                <input
                  type="text"
                  value={formDeadline}
                  onChange={(e) => setFormDeadline(e.target.value)}
                  placeholder="Ví dụ: 31/12/2026 · còn 60 ngày"
                  className="sketch-input w-full px-3 py-2 text-xs bg-white"
                />
              </div>

              <div>
                <label className="font-bold opacity-70 block mb-1">PHẦN THƯỞNG CHO BẢN THÂN</label>
                <input
                  type="text"
                  value={formReward}
                  onChange={(e) => setFormReward(e.target.value)}
                  placeholder="Ví dụ: Một chuyến du lịch, đôi giày mới..."
                  className="sketch-input w-full px-3 py-2 text-xs bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingGoal(false);
                    setEditingGoal(null);
                  }}
                  className="sketch-btn px-4 py-2 bg-gray-100 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: currentTheme.primary }}
                  className="sketch-btn px-4 py-2 font-bold text-white"
                >
                  {editingGoal ? 'Lưu thay đổi' : 'Tạo mục tiêu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
