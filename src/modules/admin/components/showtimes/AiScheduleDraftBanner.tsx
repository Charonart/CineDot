'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  X,
  AlertTriangle,
  Info,
  DollarSign,
  Flame,
  Layers,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Bot,
  Building2,
  Calendar,
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
  const [cleanExisting, setCleanExisting] = useState(true);

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
    <div className="bg-slate-900 text-white border-b border-[#7C6FE8]/30 px-4 py-3 shrink-0 shadow-lg font-sans animate-in slide-in-from-top duration-200 select-none">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        {/* Left: Status Pill & Key Financial Indicators */}
        <div className="flex items-center gap-3.5 flex-wrap">
          <div className="w-9 h-9 rounded-xl bg-[#7C6FE8]/20 border border-[#7C6FE8]/40 flex items-center justify-center text-[#7C6FE8] shadow-xs shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-xs sm:text-sm tracking-tight text-white flex items-center gap-1.5">
                Bản Nháp Lịch Chiếu AI
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7C6FE8]/20 text-[#D8D4F7] border border-[#7C6FE8]/40">
                {draft_showtimes.length} suất chiếu
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {summary.mode === 'prompt' ? '🤖 AI Copilot' : '⚡ Chiến Lược Mẫu'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Ngày: <strong className="text-slate-200">{summary.target_date}</strong>
              </span>
            </div>

            {/* Quick Metrics Strip */}
            <div className="flex items-center gap-2.5 text-xs text-slate-300 mt-1 flex-wrap font-medium">
              <span className="flex items-center gap-1 text-slate-300">
                <Layers className="w-3.5 h-3.5 text-[#7C6FE8]" />
                <span>{summary.total_rooms_used} phòng chiếu</span>
              </span>

              <span className="text-slate-600">&bull;</span>

              <span className="flex items-center gap-1 text-amber-300">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {summary.prime_time_showtimes_count} suất Giờ Vàng ({summary.prime_time_coverage_percent}%)
                </span>
              </span>

              <span className="text-slate-600">&bull;</span>

              <span className="flex items-center gap-1 text-emerald-400 font-bold font-mono">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ước tính doanh thu: ~{summary.estimated_expected_revenue?.toLocaleString('vi-VN')} đ</span>
              </span>

              {conflictsCount > 0 && (
                <>
                  <span className="text-slate-600">&bull;</span>
                  <span className="flex items-center gap-1 text-rose-400 font-bold bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-800/60 text-[11px]">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{conflictsCount} xung đột</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions Container */}
        <div className="flex items-center gap-2 self-end lg:self-center shrink-0 flex-wrap">
          {/* Explanation Button */}
          <button
            type="button"
            onClick={() => setShowExplanation(!showExplanation)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700 shadow-2xs"
          >
            <Info className="w-3.5 h-3.5 text-[#7C6FE8]" />
            <span>{showExplanation ? 'Ẩn giải thích' : 'Chi tiết chiến lược'}</span>
            {showExplanation ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* Discard Draft Button */}
          <button
            type="button"
            onClick={onClearDraft}
            disabled={isApplying}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950/50 hover:text-rose-300 hover:border-rose-700/50 text-slate-400 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700 disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5" />
            <span>Hủy nháp</span>
          </button>

          {/* Apply Draft Action Button */}
          <button
            type="button"
            onClick={handleApply}
            disabled={isApplying}
            className="px-4 py-1.5 rounded-lg bg-[#7C6FE8] hover:bg-[#685bc7] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#7C6FE8]/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isApplying ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Đang lưu vào hệ thống...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Áp Dụng Lịch Chiếu (Lưu DB)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Strategy Explanation Expandable Drawer */}
      {showExplanation && (
        <div className="mt-3 p-4 rounded-xl bg-slate-950/80 border border-[#7C6FE8]/30 text-xs text-slate-300 flex flex-col gap-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <div className="flex items-center gap-2 font-bold text-white">
              <Sparkles className="w-4 h-4 text-[#7C6FE8]" />
              <span>Phân tích & Lý do xếp lịch từ AI:</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Ma trận tự động tối ưu hóa công suất phòng & khung giờ vàng
            </span>
          </div>

          <p className="text-slate-300 leading-relaxed font-sans text-xs">
            {summary.strategy_explanation ||
              'Đã áp dụng các quy tắc ưu tiên phim bom tấn vào phòng lớn, tối ưu hóa khung giờ vàng 18:00 - 22:30 và giãn cách sảnh chờ 15 phút giữa các phòng.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <div className="p-2 bg-slate-900/90 rounded-lg border border-slate-800 flex flex-col">
              <span className="text-[10px] text-slate-400">Khung giờ vàng</span>
              <strong className="text-amber-300 font-mono text-xs">
                {summary.prime_time_info?.display_text || '18:00 – 22:30'}
              </strong>
            </div>
            <div className="p-2 bg-slate-900/90 rounded-lg border border-slate-800 flex flex-col">
              <span className="text-[10px] text-slate-400">Độ phủ giờ vàng</span>
              <strong className="text-white font-mono text-xs">
                {summary.prime_time_coverage_percent}% công suất
              </strong>
            </div>
            <div className="p-2 bg-slate-900/90 rounded-lg border border-slate-800 flex flex-col">
              <span className="text-[10px] text-slate-400">Tổng ghế dự kiến</span>
              <strong className="text-emerald-400 font-mono text-xs">
                {summary.estimated_total_capacity?.toLocaleString('vi-VN') || 0} ghế
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
