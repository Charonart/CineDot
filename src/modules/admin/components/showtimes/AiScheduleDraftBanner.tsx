'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  X,
  AlertTriangle,
  Info,
  DollarSign,
  TrendingUp,
  Flame,
  Layers,
  RefreshCw,
} from 'lucide-react';
import { GenerateAiDraftResponse } from '../../types/adminAiSchedule.types';

interface AiScheduleDraftBannerProps {
  draftData: GenerateAiDraftResponse;
  onClearDraft: () => void;
  onApplyDraft: (cleanExistingDate?: boolean) => Promise<any>;
  isApplying: boolean;
}

export function AiScheduleDraftBanner({
  draftData,
  onClearDraft,
  onApplyDraft,
  isApplying,
}: AiScheduleDraftBannerProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [cleanExisting, setCleanExisting] = useState(false);

  const { summary, draft_showtimes, validation } = draftData;
  const conflictsCount = validation?.conflicts?.length || 0;

  const handleApply = async () => {
    if (conflictsCount > 0) {
      const confirmProceed = confirm(
        `Phát hiện có ${conflictsCount} xung đột thời gian trong bản nháp. Bạn có chắc chắn muốn áp dụng không?`
      );
      if (!confirmProceed) return;
    }
    await onApplyDraft(cleanExisting);
  };

  return (
    <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white border-b border-purple-800/50 px-4 py-3 shrink-0 shadow-lg font-sans animate-in slide-in-from-top duration-300">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        {/* Left: Status & Key Financial Indicators */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-md shadow-purple-500/30 shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                Bản Nháp Lịch Chiếu AI ({draft_showtimes.length} suất)
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                {summary.mode === 'prompt' ? '🤖 AI Copilot' : '⚡ Chiến Lược Mẫu'}
              </span>
              <span className="text-[11px] text-slate-400">
                Ngày: <strong className="text-slate-200">{summary.target_date}</strong>
              </span>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-3 text-xs text-slate-300 mt-0.5 flex-wrap">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>{summary.total_rooms_used} phòng</span>
              </span>

              <span className="text-slate-600">&bull;</span>

              <span className="flex items-center gap-1 text-amber-300">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{summary.prime_time_showtimes_count} suất Giờ Vàng ({summary.prime_time_coverage_percent}%)</span>
              </span>

              <span className="text-slate-600">&bull;</span>

              <span className="flex items-center gap-1 text-emerald-300 font-semibold">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ước tính doanh thu: ~{summary.estimated_expected_revenue?.toLocaleString('vi-VN')} đ</span>
              </span>

              {conflictsCount > 0 && (
                <>
                  <span className="text-slate-600">&bull;</span>
                  <span className="flex items-center gap-1 text-rose-400 font-bold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/60">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{conflictsCount} xung đột</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end lg:self-center shrink-0 flex-wrap">
          {/* View Explanation Button */}
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700 shadow-2xs"
          >
            <Info className="w-3.5 h-3.5 text-purple-400" />
            <span>{showExplanation ? 'Ẩn giải thích' : 'Giải thích AI'}</span>
          </button>

          {/* Discard Draft Button */}
          <button
            onClick={onClearDraft}
            disabled={isApplying}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700 disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5" />
            <span>Hủy nháp</span>
          </button>

          {/* Primary Apply Action Button */}
          <button
            onClick={handleApply}
            disabled={isApplying}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-900/40 transition-all cursor-pointer disabled:opacity-50"
          >
            {isApplying ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Đang lưu vào DB...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>✅ Áp Dụng Lịch Chiếu (Lưu DB)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Strategy Explanation Expandable Box */}
      {showExplanation && (
        <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-purple-700/50 text-xs text-slate-200 flex flex-col gap-1.5 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold text-purple-300">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Chiến lược xếp lịch của AI:</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-sans">
            {summary.strategy_explanation || 'Đã áp dụng các quy tắc tối ưu hóa phòng chiếu và khung giờ vàng.'}
          </p>
        </div>
      )}
    </div>
  );
}
