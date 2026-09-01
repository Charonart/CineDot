'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Flame,
  Scale,
  Settings,
  Bot,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Layers,
  RefreshCw,
  X,
  Sliders,
  DollarSign,
  TrendingUp,
  Globe,
} from 'lucide-react';
import {
  AiScheduleConfigDTO,
  AiStrategyOption,
  GenerateAiDraftRequest,
  UpdateAiScheduleConfigRequest,
} from '../../types/adminAiSchedule.types';
import { AdminCinemaOption, AdminMovieOption, AdminRoomOption } from '../../types/adminShowtime.types';

interface AiScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCinemaId?: number;
  cinemas: AdminCinemaOption[];
  selectedDateKey: string;
  movies: AdminMovieOption[];
  rooms: AdminRoomOption[];
  config: AiScheduleConfigDTO | null;
  strategies: AiStrategyOption[];
  isLoadingStrategies: boolean;
  isGeneratingDraft: boolean;
  onGenerateDraft: (params: GenerateAiDraftRequest) => Promise<any>;
  onUpdateConfig: (params: UpdateAiScheduleConfigRequest) => Promise<any>;
  onTestConnection: (params: any) => Promise<any>;
  isTestingConnection: boolean;
  testResult: any;
}

const QUICK_PROMPTS = [
  '🔥 Ưu tiên phim bom tấn hot nhất vào phòng lớn và khung giờ vàng 18h - 22h30',
  '🍿 Giãn cách giờ bắt đầu giữa các phòng 15 phút để chống kẹt sảnh và quầy bắp nước',
  '👶 Đẩy các phim hoạt hình (Doraemon, thiếu nhi) lên các suất sáng và đầu giờ chiều',
  '🌙 Xếp các phim kinh dị và hành động 18+ vào các suất đêm muộn sau 21h00',
  '🎬 Phim bom tấn thời lượng dài chỉ xếp tối đa 3-4 suất/phòng để tối ưu trải nghiệm',
];

const POPULAR_ENDPOINTS = [
  {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
  },
  {
    name: 'Google Gemini (OpenAI Endpoint)',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    defaultModel: 'gemini-2.0-flash',
  },
  {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
  },
  {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'google/gemini-2.0-flash-exp:free',
  },
  {
    name: 'Ollama Local',
    baseUrl: 'http://localhost:11434/v1',
    defaultModel: 'qwen2.5:7b',
  },
];

export function AiScheduleModal({
  isOpen,
  onClose,
  selectedCinemaId,
  cinemas,
  selectedDateKey,
  movies,
  rooms,
  config,
  strategies,
  isLoadingStrategies,
  isGeneratingDraft,
  onGenerateDraft,
  onUpdateConfig,
  onTestConnection,
  isTestingConnection,
  testResult,
}: AiScheduleModalProps) {
  const [activeTab, setActiveTab] = useState<'presets' | 'prompt' | 'config'>('presets');

  // Fast Presets Tab State
  const [selectedStrategyId, setSelectedStrategyId] = useState('prime_time_boost');
  const [targetDate, setTargetDate] = useState(selectedDateKey);
  const [scheduleMode, setScheduleMode] = useState<'smart_fill' | 'optimize' | 'replace_all'>('smart_fill');

  // Prompt Tab State
  const [userPrompt, setUserPrompt] = useState('');

  // Settings Tab State (Custom Endpoint)
  const [baseUrlInput, setBaseUrlInput] = useState('https://api.openai.com/v1');
  const [modelName, setModelName] = useState('gpt-4o-mini');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [aiTimeoutSeconds, setAiTimeoutSeconds] = useState(60);
  const [openingTime, setOpeningTime] = useState('08:30');
  const [closingTime, setClosingTime] = useState('23:30');
  const [bufferMinutes, setBufferMinutes] = useState(15);
  const [staggeringGap, setStaggeringGap] = useState(15);
  const [defaultBasePrice, setDefaultBasePrice] = useState(100000);
  const [syncPrimeTime, setSyncPrimeTime] = useState(true);
  const [customPrimeStart, setCustomPrimeStart] = useState('18:00');
  const [customPrimeEnd, setCustomPrimeEnd] = useState('22:30');

  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Sync state from config prop when loaded
  useEffect(() => {
    if (config) {
      setBaseUrlInput(config.ai_base_url || 'https://api.openai.com/v1');
      setModelName(config.ai_model_name || 'gpt-4o-mini');
      setAiTimeoutSeconds(config.ai_timeout_seconds || 60);
      setOpeningTime(config.opening_time || '08:30');
      setClosingTime(config.closing_time || '23:30');
      setBufferMinutes(config.default_buffer_minutes || 15);
      setStaggeringGap(config.staggering_gap_minutes || 15);
      setDefaultBasePrice(Number(config.default_base_price) || 100000);
      setSyncPrimeTime(config.sync_prime_time_from_pricing_rules ?? true);
      setCustomPrimeStart(config.custom_prime_time_start || '18:00');
      setCustomPrimeEnd(config.custom_prime_time_end || '22:30');
      if (config.masked_api_key) {
        setApiKeyInput(config.masked_api_key);
      }
    }
  }, [config]);

  useEffect(() => {
    setTargetDate(selectedDateKey);
  }, [selectedDateKey]);

  if (!isOpen) return null;

  const currentCinema = cinemas.find((c) => c.id === selectedCinemaId) || cinemas[0];

  // Helper to build current active override config
  const getActiveOverrideConfig = () => ({
    ai_api_key: apiKeyInput && !apiKeyInput.includes('••••') ? apiKeyInput : undefined,
    ai_base_url: baseUrlInput || undefined,
    ai_model_name: modelName || undefined,
    ai_timeout_seconds: Number(aiTimeoutSeconds) || undefined,
    default_base_price: Number(defaultBasePrice) || undefined,
    buffer_minutes: Number(bufferMinutes) || undefined,
    staggering_gap_minutes: Number(staggeringGap) || undefined,
    opening_time: openingTime || undefined,
    closing_time: closingTime || undefined,
  });

  // Handle Preset Submit
  const handleGeneratePreset = async () => {
    if (!selectedCinemaId) return;
    try {
      await onGenerateDraft({
        cinema_id: selectedCinemaId,
        target_date: targetDate,
        mode: 'preset',
        strategy_id: selectedStrategyId,
        schedule_mode: scheduleMode,
        clean_existing_date: scheduleMode === 'replace_all',
        override_config: getActiveOverrideConfig(),
      });
      onClose();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi sinh lịch chiếu.');
    }
  };

  // Handle Prompt Submit
  const handleGeneratePrompt = async () => {
    if (!selectedCinemaId) return;
    if (!userPrompt.trim()) {
      alert('Vui lòng nhập nội dung yêu cầu cho AI.');
      return;
    }

    try {
      await onGenerateDraft({
        cinema_id: selectedCinemaId,
        target_date: targetDate,
        mode: 'prompt',
        prompt: userPrompt,
        schedule_mode: scheduleMode,
        clean_existing_date: scheduleMode === 'replace_all',
        override_config: getActiveOverrideConfig(),
      });
      onClose();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi sinh lịch chiếu AI.');
    }
  };

  // Handle Test Connection
  const handleTestConnection = async () => {
    await onTestConnection({
      ai_provider: 'custom',
      ai_api_key: apiKeyInput,
      ai_model_name: modelName,
      ai_base_url: baseUrlInput || undefined,
      ai_timeout_seconds: Number(aiTimeoutSeconds),
    });
  };

  // Handle Save Config
  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    setSaveSuccessMsg('');
    try {
      await onUpdateConfig({
        cinema_id: selectedCinemaId,
        opening_time: openingTime,
        closing_time: closingTime,
        default_buffer_minutes: Number(bufferMinutes),
        staggering_gap_minutes: Number(staggeringGap),
        default_base_price: Number(defaultBasePrice),
        sync_prime_time_from_pricing_rules: syncPrimeTime,
        custom_prime_time_start: customPrimeStart,
        custom_prime_time_end: customPrimeEnd,
        ai_provider: 'custom',
        ai_model_name: modelName,
        ai_api_key: apiKeyInput,
        ai_base_url: baseUrlInput || 'https://api.openai.com/v1',
        ai_timeout_seconds: Number(aiTimeoutSeconds),
      });
      setSaveSuccessMsg('Đã lưu cấu hình rạp và thông số AI thành công!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu cấu hình.');
    } finally {
      setIsSavingConfig(false);
    }
  };

  const getStrategyIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-500" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-cyan-500" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-500" />;
      default:
        return <Scale className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>AI Tạo Lịch Chiếu Tự Động</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30">
                  Custom AI Endpoint
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                {currentCinema?.name} &bull; Ngày áp dụng:{' '}
                <span className="text-slate-200 font-medium">{targetDate}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs Navigation */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50/80 shrink-0">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'presets'
                ? 'border-[#7C6FE8] text-[#7C6FE8] bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>⚡ Chiến Lược Mẫu (Nhanh)</span>
          </button>

          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'prompt'
                ? 'border-[#7C6FE8] text-[#7C6FE8] bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>🤖 Trợ Lý AI Prompt</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ml-auto ${
              activeTab === 'config'
                ? 'border-[#7C6FE8] text-[#7C6FE8] bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>⚙️ Cài Đặt Rạp & AI Endpoint</span>
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800 text-xs">
          {/* TAB 1: FAST PRESETS */}
          {activeTab === 'presets' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between bg-purple-50/60 p-3 rounded-xl border border-purple-100">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-purple-950">
                    Khung Giờ Vàng đang liên kết:
                  </span>
                  <span className="text-purple-700 font-medium">
                    {config?.effective_prime_time?.display_text || '18:00 - 23:00 (Quy tắc giá)'}
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('config')}
                  className="text-purple-600 font-semibold hover:underline cursor-pointer text-[11px]"
                >
                  Đổi tham số
                </button>
              </div>

              {/* Strategy Selector Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {strategies.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStrategyId(st.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      selectedStrategyId === st.id
                        ? 'border-[#7C6FE8] bg-purple-50/40 shadow-xs ring-2 ring-[#7C6FE8]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2 font-bold text-slate-900">
                          {getStrategyIcon(st.icon)}
                          <span>{st.name}</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {st.badge}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed mb-2">
                        {st.description}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
                      <span>Phù hợp: {st.recommended_for}</span>
                      <input
                        type="radio"
                        checked={selectedStrategyId === st.id}
                        onChange={() => setSelectedStrategyId(st.id)}
                        className="accent-[#7C6FE8] cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Schedule Mode Selector & Date Row */}
              <div className="flex flex-col gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#7C6FE8]" />
                    <span className="font-bold text-slate-800">Ngày áp dụng:</span>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="px-2.5 py-1 bg-white border border-slate-300 rounded-md font-semibold text-slate-900 text-xs shadow-2xs"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Chọn chế độ xếp lịch:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setScheduleMode('smart_fill')}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      scheduleMode === 'smart_fill'
                        ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-2xs'
                        : 'bg-white border-slate-200 hover:bg-slate-100/60 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Chèn Giờ Trống
                      </span>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Smart Fill
                      </span>
                    </div>
                    <p className="text-[10.5px] leading-relaxed text-slate-600">
                      Bảo toàn 100% suất đã có, chỉ chèn thêm phim vào khoảng trống.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScheduleMode('optimize')}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      scheduleMode === 'optimize'
                        ? 'bg-amber-50/90 border-amber-500 text-amber-950 ring-2 ring-amber-500/20'
                        : 'bg-white border-slate-200 hover:bg-slate-100/60 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Tối Ưu Lịch
                      </span>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                        Optimize
                      </span>
                    </div>
                    <p className="text-[10.5px] leading-relaxed text-slate-600">
                      Khóa suất có vé bán, tinh chỉnh dời giờ các suất chưa có vé.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScheduleMode('replace_all')}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      scheduleMode === 'replace_all'
                        ? 'bg-rose-50/90 border-rose-500 text-rose-950 ring-2 ring-rose-500/20'
                        : 'bg-white border-slate-200 hover:bg-slate-100/60 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        Xếp Mới 100%
                      </span>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                        Replace All
                      </span>
                    </div>
                    <p className="text-[10.5px] leading-relaxed text-slate-600">
                      Xóa toàn bộ suất cũ chưa bán vé để tạo lại lịch mới hoàn toàn.
                    </p>
                  </button>
                </div>
              </div>

              {/* Action CTA */}
              <button
                onClick={handleGeneratePreset}
                disabled={isGeneratingDraft}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C6FE8] to-purple-600 hover:from-[#6b5edb] hover:to-purple-700 text-white font-bold text-sm shadow-md shadow-purple-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isGeneratingDraft ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang tính toán ma trận xếp lịch...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>✨ Tự Động Sinh Bản Nháp Ngay (&lt; 0.5s)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: AI COPILOT PROMPT */}
          {activeTab === 'prompt' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between bg-slate-900 text-white p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-300">Model:</span>
                  <span className="font-bold text-white uppercase bg-purple-950 px-2 py-0.5 rounded border border-purple-700/50">
                    {modelName || config?.ai_model_name || 'gpt-4o-mini'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline truncate max-w-xs">
                    ({baseUrlInput || config?.ai_base_url || 'https://api.openai.com/v1'})
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('config')}
                  className="text-purple-400 hover:text-purple-300 font-semibold cursor-pointer text-[11px] shrink-0 ml-2"
                >
                  Cấu hình Endpoint / Key
                </button>
              </div>

              {/* Prompt Textarea */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-800">
                  Nhập yêu cầu xếp lịch bằng tiếng Việt tự nhiên:
                </label>
                <textarea
                  rows={4}
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="Ví dụ: Xếp phim Dune 2 vào phòng IMAX từ 14h trở đi; Doraemon xếp 3 suất buổi sáng cho trẻ em; Buổi tối ưu tiên phim kinh dị; Giãn cách sảnh 15 phút giữa các phòng..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:border-[#7C6FE8] focus:ring-2 focus:ring-[#7C6FE8]/20 text-xs font-medium text-slate-800 resize-none outline-none leading-relaxed"
                />
              </div>

              {/* Quick Prompt Suggestion Chips */}
              <div className="flex flex-col gap-1.5">
                <span className="font-semibold text-slate-500 text-[11px]">
                  Gợi ý prompt nhanh (click để thêm):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((qp, idx) => (
                    <button
                      key={idx}
                      onClick={() => setUserPrompt((prev) => (prev ? `${prev}. ${qp}` : qp))}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-purple-800 text-slate-700 text-[11px] font-medium transition-colors text-left cursor-pointer border border-slate-200/80"
                    >
                      {qp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule Mode Selector & Date Row */}
              <div className="flex flex-col gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#7C6FE8]" />
                    <span className="font-bold text-slate-800">Ngày xếp:</span>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="px-2.5 py-1 bg-white border border-slate-300 rounded-md font-semibold text-slate-900 text-xs shadow-2xs"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Chế độ AI xử lý:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setScheduleMode('smart_fill')}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      scheduleMode === 'smart_fill'
                        ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-2xs'
                        : 'bg-white border-slate-200 hover:bg-slate-100/60 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Chèn Giờ Trống
                      </span>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Smart Fill
                      </span>
                    </div>
                    <p className="text-[10.5px] leading-relaxed text-slate-600">
                      Bảo toàn 100% suất đã có, chỉ chèn thêm phim vào khoảng trống.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScheduleMode('optimize')}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      scheduleMode === 'optimize'
                        ? 'bg-amber-50/90 border-amber-500 text-amber-950 ring-2 ring-amber-500/20'
                        : 'bg-white border-slate-200 hover:bg-slate-100/60 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Tối Ưu Lịch
                      </span>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                        Optimize
                      </span>
                    </div>
                    <p className="text-[10.5px] leading-relaxed text-slate-600">
                      Khóa suất có vé bán, tinh chỉnh dời giờ các suất chưa có vé.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScheduleMode('replace_all')}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      scheduleMode === 'replace_all'
                        ? 'bg-rose-50/90 border-rose-500 text-rose-950 ring-2 ring-rose-500/20'
                        : 'bg-white border-slate-200 hover:bg-slate-100/60 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        Xếp Mới 100%
                      </span>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                        Replace All
                      </span>
                    </div>
                    <p className="text-[10.5px] leading-relaxed text-slate-600">
                      Xóa toàn bộ suất cũ chưa bán vé để tạo lại lịch mới hoàn toàn.
                    </p>
                  </button>
                </div>
              </div>

              {/* Action CTA */}
              <button
                onClick={handleGeneratePrompt}
                disabled={isGeneratingDraft || !userPrompt.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-purple-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isGeneratingDraft ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI đang phân tích ý định và xếp lịch...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" />
                    <span>🚀 Yêu Cầu AI Phân Tích & Sinh Lịch</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 3: SETTINGS & CUSTOM AI ENDPOINT CONFIG */}
          {activeTab === 'config' && (
            <div className="flex flex-col gap-4">
              {saveSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* 1. Custom AI Connection Section */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-[#7C6FE8]" />
                    1. Kết Nối AI Custom Endpoint (OpenAI-Compatible)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Tùy chọn kết nối không cố định nhà cung cấp
                  </span>
                </div>

                {/* Base URL Input */}
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-slate-700 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-[#7C6FE8]" />
                    Base URL Endpoint:
                  </label>
                  <input
                    type="text"
                    value={baseUrlInput}
                    onChange={(e) => setBaseUrlInput(e.target.value)}
                    placeholder="https://api.openai.com/v1"
                    className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 outline-none focus:border-[#7C6FE8]"
                  />
                </div>

                {/* Quick Endpoint Chips */}
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[11px] text-slate-500 font-medium">Gợi ý endpoint nhanh:</span>
                  {POPULAR_ENDPOINTS.map((ep) => (
                    <button
                      key={ep.name}
                      type="button"
                      onClick={() => {
                        setBaseUrlInput(ep.baseUrl);
                        setModelName(ep.defaultModel);
                      }}
                      className="px-2.5 py-0.5 rounded-md bg-slate-100 hover:bg-purple-100 hover:text-purple-800 text-slate-700 text-[11px] font-medium transition-colors border border-slate-200 cursor-pointer"
                    >
                      {ep.name}
                    </button>
                  ))}
                </div>

                {/* API Key & Test Connection Row */}
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-slate-700">API Key:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="Dán API Key (để trống nếu dùng mặc định của server)"
                      className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 outline-none focus:border-[#7C6FE8]"
                    />
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={isTestingConnection}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      {isTestingConnection ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <span>Kiểm tra kết nối</span>
                    </button>
                  </div>
                  {testResult && (
                    <div
                      className={`text-[11px] mt-1 font-medium flex items-center gap-1 ${
                        testResult.success ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {testResult.success ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{testResult.message}</span>
                    </div>
                  )}
                </div>

                {/* Model Name & Timeout Input (Custom numeric input in seconds) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-medium text-slate-700">Model Name:</label>
                    <input
                      type="text"
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                      placeholder="vd: gpt-4o-mini, gemini-2.0-flash, deepseek-chat"
                      className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-[#7C6FE8]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-medium text-slate-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#7C6FE8]" />
                      Timeout phản hồi:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={5}
                        max={600}
                        step={5}
                        value={aiTimeoutSeconds}
                        onChange={(e) => setAiTimeoutSeconds(Math.max(5, Number(e.target.value)))}
                        className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 outline-none focus:border-[#7C6FE8]"
                      />
                      <span className="font-semibold text-slate-500 text-xs shrink-0">giây</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Pricing Rule & Prime Time Sync */}
              <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-950 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    2. Liên Kết Khung Giờ Vàng & Quy Tắc Định Giá
                  </span>
                </div>

                <label className="flex items-center gap-2 text-purple-900 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={syncPrimeTime}
                    onChange={(e) => setSyncPrimeTime(e.target.checked)}
                    className="rounded text-[#7C6FE8] focus:ring-0 cursor-pointer"
                  />
                  <span>Tự động đồng bộ Khung Giờ Vàng từ bảng Quy Tắc Giá (Pricing Rules)</span>
                </label>

                {syncPrimeTime ? (
                  <div className="p-2.5 bg-white rounded-lg border border-purple-200 text-purple-800 text-[11px]">
                    <strong>Quy tắc đang áp dụng:</strong>{' '}
                    {config?.effective_prime_time?.rule_name || 'Phụ thu Giờ Vàng (Prime Time)'} &bull;{' '}
                    Khung giờ:{' '}
                    <span className="font-bold font-mono">
                      {config?.effective_prime_time?.time_from || '18:00'} -{' '}
                      {config?.effective_prime_time?.time_to || '23:00'}
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-600">Bắt đầu giờ vàng:</span>
                      <input
                        type="time"
                        value={customPrimeStart}
                        onChange={(e) => setCustomPrimeStart(e.target.value)}
                        className="px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-600">Kết thúc giờ vàng:</span>
                      <input
                        type="time"
                        value={customPrimeEnd}
                        onChange={(e) => setCustomPrimeEnd(e.target.value)}
                        className="px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Operating & Constraint Rules */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col gap-3">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[#7C6FE8]" />
                  3. Quy Tắc Vận Hành Rạp & Giá Vé Cơ Sở
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-slate-600">Giờ mở cửa:</label>
                    <input
                      type="time"
                      value={openingTime}
                      onChange={(e) => setOpeningTime(e.target.value)}
                      className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-semibold"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-slate-600">Giờ đóng cửa:</label>
                    <input
                      type="time"
                      value={closingTime}
                      onChange={(e) => setClosingTime(e.target.value)}
                      className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-semibold"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-slate-600">Dọn phòng (Buffer):</label>
                    <select
                      value={bufferMinutes}
                      onChange={(e) => setBufferMinutes(Number(e.target.value))}
                      className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold"
                    >
                      <option value={10}>10 phút</option>
                      <option value={15}>15 phút (Chuẩn)</option>
                      <option value={20}>20 phút</option>
                      <option value={30}>30 phút</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-slate-600">Giãn cách sảnh:</label>
                    <select
                      value={staggeringGap}
                      onChange={(e) => setStaggeringGap(Number(e.target.value))}
                      className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold"
                    >
                      <option value={10}>10 phút</option>
                      <option value={15}>15 phút (Chuẩn)</option>
                      <option value={20}>20 phút</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-slate-700">Giá vé cơ sở mặc định:</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step={5000}
                      value={defaultBasePrice}
                      onChange={(e) => setDefaultBasePrice(Number(e.target.value))}
                      className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900 w-28 text-right font-mono"
                    />
                    <span className="font-bold text-slate-500">VNĐ</span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  disabled={isSavingConfig}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSavingConfig ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>💾 Lưu Cấu Hình Rạp & AI Endpoint</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
