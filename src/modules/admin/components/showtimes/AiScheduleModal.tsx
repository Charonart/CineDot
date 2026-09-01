'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Film,
  Building2,
  HelpCircle,
  ChevronRight,
  ArrowRight,
  Lightbulb,
  Send,
  Trash2,
  CheckSquare,
  Square,
  Tv,
  Eye,
  Filter,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  AiScheduleConfigDTO,
  AiStrategyOption,
  GenerateAiDraftRequest,
  GenerateAiDraftResponse,
  UpdateAiScheduleConfigRequest,
  AiChatMessage,
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
  chatHistory?: AiChatMessage[];
  onClearChat?: () => void;
  hasDraft?: boolean;
  draftData?: GenerateAiDraftResponse | null;
  onApplyDraft?: (cleanExisting?: boolean) => Promise<any>;
  isApplyingDraft?: boolean;
  onRemoveDraftShowtime?: (tempId: string) => void;
  onClearDraft?: () => void;
}

const QUICK_PROMPT_TAGS = [
  {
    label: '⚡ Kéo toàn bộ suất sát nhau',
    text: 'cho toàn bộ suất chiếu ngày này sát nhau theo đúng 15 phút dọn phòng',
  },
  {
    label: '🗑️ Xóa suất sáng trước 11h',
    text: 'xóa bớt các suất chiếu buổi sáng trước 11h',
  },
  {
    label: '⏱️ Dời phòng 1 lùi 30p',
    text: 'dời tất cả suất chiếu phòng 1 lùi 30 phút',
  },
  {
    label: '🎬 Ưu tiên IMAX cho bom tấn',
    text: 'Ưu tiên xếp các phim bom tấn hot nhất vào phòng chiếu lớn nhất (IMAX/ScreenX) và khung giờ vàng 18:00 - 22:30.',
  },
  {
    label: '👶 Suất sáng cho trẻ em',
    text: 'Đẩy các phim hoạt hình, gia đình (P rating) lên các suất sáng và đầu giờ chiều từ 09:00 đến 16:00.',
  },
  {
    label: '🌙 Suất đêm cho phim 18+',
    text: 'Xếp các phim kinh dị, giật gân và phim gắn nhãn 18+ vào các suất chiếu muộn sau 21:30.',
  },
];

const POPULAR_ENDPOINTS = [
  {
    provider: 'gemini',
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com',
    defaultModel: 'gemini-2.0-flash',
    badge: 'Tốc độ cao & Miễn phí',
  },
  {
    provider: 'deepseek',
    name: 'DeepSeek Chat',
    baseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
    badge: 'Thông minh & Giá rẻ',
  },
  {
    provider: 'openai',
    name: 'OpenAI (GPT-4o)',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    badge: 'Chuẩn',
  },
  {
    provider: 'openrouter',
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'google/gemini-2.0-flash-exp:free',
    badge: 'Đa Model',
  },
  {
    provider: 'ollama',
    name: 'Ollama Local',
    baseUrl: 'http://localhost:11434/v1',
    defaultModel: 'qwen2.5:7b',
    badge: 'Nội bộ Offline',
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
  chatHistory = [],
  onClearChat,
  hasDraft = false,
  draftData = null,
  onApplyDraft,
  isApplyingDraft = false,
  onRemoveDraftShowtime,
  onClearDraft,
}: AiScheduleModalProps) {
  const [activeTab, setActiveTab] = useState<'copilot' | 'scope' | 'presets' | 'config'>('copilot');

  // Fast Presets Tab State
  const [selectedStrategyId, setSelectedStrategyId] = useState('prime_time_boost');
  const [targetDate, setTargetDate] = useState(selectedDateKey);
  const [scheduleMode, setScheduleMode] = useState<'smart_fill' | 'optimize' | 'replace_all'>('smart_fill');

  // Scope: Movie & Room selections
  const [selectedMovieIds, setSelectedMovieIds] = useState<number[]>(() => movies.map((m) => m.id));
  const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>(() => rooms.map((r) => r.id));
  const [timeRangeScope, setTimeRangeScope] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');

  // Prompt / Copilot Input State
  const [userPrompt, setUserPrompt] = useState('');
  const [refineMode, setRefineMode] = useState<'refine' | 'new'>(hasDraft ? 'refine' : 'new');
  const [draftRoomFilter, setDraftRoomFilter] = useState<number | 'all'>('all');

  // Settings Tab State
  const [aiProvider, setAiProvider] = useState(config?.ai_provider || 'custom');
  const [baseUrlInput, setBaseUrlInput] = useState(config?.ai_base_url || '');
  const [modelName, setModelName] = useState(config?.ai_model_name || '');
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

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync state from config prop when loaded
  useEffect(() => {
    if (config) {
      if (config.ai_provider) setAiProvider(config.ai_provider);
      if (config.ai_base_url) setBaseUrlInput(config.ai_base_url);
      if (config.ai_model_name) setModelName(config.ai_model_name);
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

  useEffect(() => {
    if (movies.length > 0 && selectedMovieIds.length === 0) {
      setSelectedMovieIds(movies.map((m) => m.id));
    }
  }, [movies]);

  useEffect(() => {
    if (rooms.length > 0 && selectedRoomIds.length === 0) {
      setSelectedRoomIds(rooms.map((r) => r.id));
    }
  }, [rooms]);

  useEffect(() => {
    if (hasDraft) {
      setRefineMode('refine');
    }
  }, [hasDraft]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isGeneratingDraft]);

  if (!isOpen) return null;

  const currentCinema = cinemas.find((c) => c.id === selectedCinemaId) || cinemas[0];

  const getTimeRangeObject = () => {
    switch (timeRangeScope) {
      case 'morning':
        return { start: '08:30', end: '12:30' };
      case 'afternoon':
        return { start: '12:30', end: '18:00' };
      case 'evening':
        return { start: '18:00', end: '23:30' };
      default:
        return undefined;
    }
  };

  const getActiveOverrideConfig = () => ({
    ai_provider: aiProvider || undefined,
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
        selected_movie_ids: selectedMovieIds.length > 0 ? selectedMovieIds : undefined,
        selected_room_ids: selectedRoomIds.length > 0 ? selectedRoomIds : undefined,
        schedule_mode: scheduleMode,
        clean_existing_date: scheduleMode === 'replace_all',
        time_range: getTimeRangeObject(),
        override_config: getActiveOverrideConfig(),
      });
      setActiveTab('copilot');
    } catch (err: any) {
      alert(err.message || 'Lỗi khi sinh lịch chiếu.');
    }
  };

  // Handle Copilot Prompt Submit (Multi-Turn)
  const handleGeneratePrompt = async (customText?: string) => {
    const textToSend = customText || userPrompt;
    if (!selectedCinemaId) return;
    if (!textToSend.trim()) {
      alert('Vui lòng nhập nội dung yêu cầu cho AI Copilot.');
      return;
    }

    try {
      await onGenerateDraft({
        cinema_id: selectedCinemaId,
        target_date: targetDate,
        mode: 'prompt',
        prompt: textToSend.trim(),
        selected_movie_ids: selectedMovieIds.length > 0 ? selectedMovieIds : undefined,
        selected_room_ids: selectedRoomIds.length > 0 ? selectedRoomIds : undefined,
        schedule_mode: scheduleMode,
        clean_existing_date: scheduleMode === 'replace_all',
        current_draft_showtimes: refineMode === 'refine' && draftData ? draftData.draft_showtimes : undefined,
        time_range: getTimeRangeObject(),
        override_config: getActiveOverrideConfig(),
      });
      setUserPrompt('');
    } catch (err: any) {
      alert(err.message || 'Lỗi khi sinh lịch chiếu AI.');
    }
  };

  // Handle Test Connection
  const handleTestConnection = async () => {
    await onTestConnection({
      ai_provider: aiProvider,
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
        ai_provider: aiProvider,
        ai_base_url: baseUrlInput,
        ai_model_name: modelName,
        ai_api_key: apiKeyInput,
        ai_timeout_seconds: Number(aiTimeoutSeconds),
        opening_time: openingTime,
        closing_time: closingTime,
        default_buffer_minutes: Number(bufferMinutes),
        staggering_gap_minutes: Number(staggeringGap),
        default_base_price: Number(defaultBasePrice),
        sync_prime_time_from_pricing_rules: syncPrimeTime,
        custom_prime_time_start: customPrimeStart,
        custom_prime_time_end: customPrimeEnd,
      });
      setSaveSuccessMsg('Đã lưu cấu hình AI & Quy tắc rạp thành công!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu cấu hình.');
    } finally {
      setIsSavingConfig(false);
    }
  };

  const toggleMovieSelection = (movieId: number) => {
    setSelectedMovieIds((prev) =>
      prev.includes(movieId) ? prev.filter((id) => id !== movieId) : [...prev, movieId]
    );
  };

  const toggleRoomSelection = (roomId: number) => {
    setSelectedRoomIds((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    );
  };

  const getStrategyIcon = (icon: string) => {
    switch (icon) {
      case 'Flame':
        return <Flame className="w-4 h-4 text-amber-500" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-[#7C6FE8]" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-emerald-500" />;
      case 'Scale':
        return <Scale className="w-4 h-4 text-blue-500" />;
      default:
        return <Flame className="w-4 h-4 text-[#7C6FE8]" />;
    }
  };

  // Group draft showtimes by room for Live Inspector
  const displayedDraftShowtimes = draftData?.draft_showtimes || [];
  const filteredDraftShowtimes = draftRoomFilter === 'all'
    ? displayedDraftShowtimes
    : displayedDraftShowtimes.filter((st) => st.room_id === draftRoomFilter);

  const showtimesByRoom: Record<string, typeof displayedDraftShowtimes> = {};
  filteredDraftShowtimes.forEach((st) => {
    const key = `${st.room_name}___${st.room_id}`;
    if (!showtimesByRoom[key]) {
      showtimesByRoom[key] = [];
    }
    showtimesByRoom[key].push(st);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden font-sans text-slate-900 animate-in zoom-in-95 duration-200">
        {/* Studio Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#7C6FE8]/20 border border-[#7C6FE8]/40 flex items-center justify-center text-[#7C6FE8] shadow-xs shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                  CineAI Showtime Copilot Studio
                </h2>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#7C6FE8]/25 text-[#D8D4F7] border border-[#7C6FE8]/40">
                  {modelName || 'gemini-3.7-flash'}
                </span>
                {hasDraft && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Bản nháp: {displayedDraftShowtimes.length} suất</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="font-semibold text-slate-200">{currentCinema?.name}</span>
                <span>&bull;</span>
                <span>
                  Ngày: <strong className="text-slate-200 font-semibold">{targetDate}</strong>
                </span>
                <span>&bull;</span>
                <span>
                  Đang chọn: <strong>{selectedRoomIds.length}/{rooms.length} phòng</strong> &bull;{' '}
                  <strong>{selectedMovieIds.length}/{movies.length} phim</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasDraft && onApplyDraft && (
              <button
                type="button"
                onClick={() => onApplyDraft(true)}
                disabled={isApplyingDraft}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
              >
                {isApplyingDraft ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                <span>Áp Dụng Lịch Chiếu</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Segmented Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-2 bg-slate-50 shrink-0 gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('copilot')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'copilot'
                  ? 'bg-white text-[#7C6FE8] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Copilot Studio</span>
              {displayedDraftShowtimes.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#7C6FE8] text-white text-[10px] font-bold">
                  {displayedDraftShowtimes.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('scope')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'scope'
                  ? 'bg-white text-[#7C6FE8] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Chọn Lọc Phim & Phòng ({selectedMovieIds.length}/{movies.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('presets')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-white text-[#7C6FE8] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Chiến Lược Mẫu</span>
            </button>

            <button
              onClick={() => setActiveTab('config')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'config'
                  ? 'bg-white text-[#7C6FE8] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Engine & API</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-[#7C6FE8]" />
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="px-2 py-0.5 bg-white border border-slate-300 rounded font-semibold text-xs text-slate-900 shadow-2xs outline-none focus:border-[#7C6FE8]"
              />
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 text-slate-800 text-xs">
          {/* ══════════ TAB 1: AI COPILOT CHAT & LIVE DRAFT INSPECTOR (2 PANES) ══════════ */}
          {activeTab === 'copilot' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full min-h-[500px]">
              {/* LEFT PANE: Conversation & Command Center (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-3 h-full justify-between">
                {/* Mode Pill Switcher & Clean Chat */}
                <div className="flex items-center justify-between bg-slate-100 p-2 rounded-2xl flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 ml-1">Mục tiêu:</span>
                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setRefineMode('refine')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          refineMode === 'refine'
                            ? 'bg-[#7C6FE8] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        ✨ Tinh chỉnh tiếp bản nháp ({displayedDraftShowtimes.length} suất)
                      </button>
                      <button
                        type="button"
                        onClick={() => setRefineMode('new')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          refineMode === 'new'
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Tạo mới từ đầu
                      </button>
                    </div>
                  </div>

                  {chatHistory.length > 0 && onClearChat && (
                    <button
                      type="button"
                      onClick={onClearChat}
                      className="text-slate-500 hover:text-rose-600 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Xóa lịch sử</span>
                    </button>
                  )}
                </div>

                {/* Chat Message Stream */}
                <div className="min-h-[260px] max-h-[350px] overflow-y-auto p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col gap-3.5 scrollbar-thin">
                  {chatHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-6 gap-2 text-slate-400">
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#7C6FE8] flex items-center justify-center">
                        <Bot className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-slate-700 text-xs">
                        AI Copilot sẵn sàng tiếp nhận yêu cầu lập lịch
                      </span>
                      <p className="text-[11px] text-slate-500 max-w-md">
                        Bạn có thể chat tự nhiên như: <em>"Xếp lịch tối ưu cho ngày mai, ưu tiên bom tấn vào phòng IMAX và phim hoạt hình buổi sáng"</em>.
                      </p>
                    </div>
                  ) : (
                    chatHistory.map((msg) => {
                      const isUser = msg.role === 'user';
                      const summary = msg.draftSummary;
                      const hasShowtimes = msg.draftCount && msg.draftCount > 0;

                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1.5`}
                        >
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium px-1">
                            <span>{isUser ? 'Admin' : 'CineAI Copilot'}</span>
                            <span>&bull;</span>
                            <span>{msg.timestamp}</span>
                          </div>

                          <div
                            className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[92%] ${
                              isUser
                                ? 'bg-[#7C6FE8] text-white rounded-tr-xs shadow-xs font-medium'
                                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-2xs flex flex-col gap-2.5'
                            }`}
                          >
                            <p className="whitespace-pre-line">{msg.content}</p>

                            {/* Rich Summary & KPI Chips for Assistant */}
                            {!isUser && hasShowtimes && summary && (
                              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10.5px]">
                                  <div className="p-1.5 rounded-xl bg-purple-50 border border-purple-100 text-purple-900 font-bold flex flex-col">
                                    <span className="text-[9px] text-purple-600 font-medium">Tổng suất</span>
                                    <span>{msg.draftCount} suất</span>
                                  </div>
                                  <div className="p-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900 font-bold flex flex-col">
                                    <span className="text-[9px] text-emerald-600 font-medium">Doanh thu ước tính</span>
                                    <span>{Number(summary.estimated_expected_revenue || 0).toLocaleString('vi-VN')}đ</span>
                                  </div>
                                  <div className="p-1.5 rounded-xl bg-amber-50 border border-amber-100 text-amber-900 font-bold flex flex-col">
                                    <span className="text-[9px] text-amber-600 font-medium">Giờ vàng</span>
                                    <span>{summary.prime_time_coverage_percent || 0}%</span>
                                  </div>
                                  <div className="p-1.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-900 font-bold flex flex-col">
                                    <span className="text-[9px] text-blue-600 font-medium">Phòng sử dụng</span>
                                    <span>{summary.total_rooms_used || 0} phòng</span>
                                  </div>
                                </div>

                                {/* Action Buttons Inside Message */}
                                <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                                  {onApplyDraft && (
                                    <button
                                      type="button"
                                      onClick={() => onApplyDraft(true)}
                                      disabled={isApplyingDraft}
                                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>Áp Dụng Vào Database</span>
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <Eye className="w-3 h-3 text-[#7C6FE8]" />
                                    <span>Xem Trên Lưới Timeline</span>
                                  </button>

                                  {onClearDraft && (
                                    <button
                                      type="button"
                                      onClick={onClearDraft}
                                      className="px-2 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] transition-colors cursor-pointer ml-auto"
                                      title="Hủy bản nháp này"
                                    >
                                      Hủy nháp
                                    </button>
                                  )}
                                </div>

                                {/* Suggested Follow-up Chips */}
                                {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                                  <div className="pt-1.5 border-t border-slate-100 flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                      <Lightbulb className="w-3 h-3 text-amber-500" />
                                      <span>Gợi ý lệnh tiếp theo:</span>
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                      {msg.suggestedFollowups.map((sug, sIdx) => (
                                        <button
                                          key={sIdx}
                                          type="button"
                                          onClick={() => handleGeneratePrompt(sug)}
                                          disabled={isGeneratingDraft}
                                          className="px-2 py-0.5 rounded-md bg-purple-50 hover:bg-purple-100 text-[#7C6FE8] text-[10.5px] font-medium border border-purple-200/70 transition-colors cursor-pointer"
                                        >
                                          + {sug}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}

                  {isGeneratingDraft && (
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-purple-200 text-[#7C6FE8] text-xs font-bold animate-pulse w-fit">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>AI Copilot đang phân tích ngữ cảnh và sắp xếp lịch chiếu...</span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Quick Prompt Suggestions */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Tag lệnh nhanh:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_PROMPT_TAGS.map((tag, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setUserPrompt(tag.text)}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-[#7C6FE8] hover:border-purple-200 text-slate-700 text-[11px] font-medium transition-colors border border-slate-200 cursor-pointer"
                      >
                        + {tag.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Chat Field */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleGeneratePrompt();
                  }}
                  className="flex items-center gap-2 pt-1"
                >
                  <div className="relative flex-1">
                    <textarea
                      rows={2}
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleGeneratePrompt();
                        }
                      }}
                      placeholder={
                        refineMode === 'refine' && hasDraft
                          ? 'Ví dụ: Dời suất phim Conan ở phòng 2 lùi 30 phút; Thêm 1 suất phim kinh dị lúc 22h30...'
                          : 'Ví dụ: Xếp phim bom tấn vào phòng IMAX lúc 19h; Buổi sáng ưu tiên phim hoạt hình cho trẻ em...'
                      }
                      className="w-full p-2.5 rounded-2xl border border-slate-300 focus:border-[#7C6FE8] focus:ring-2 focus:ring-[#7C6FE8]/20 text-xs font-medium text-slate-900 resize-none outline-none shadow-2xs leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isGeneratingDraft || !userPrompt.trim()}
                    className="px-5 py-3 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-bold text-xs shadow-md shadow-[#7C6FE8]/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 h-full"
                  >
                    {isGeneratingDraft ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Gửi Lệnh</span>
                  </button>
                </form>
              </div>

              {/* RIGHT PANE: Live Draft Schedule Inspector (5 cols) */}
              <div className="lg:col-span-5 flex flex-col bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 max-h-[560px] overflow-hidden">
                {/* Inspector Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-[#7C6FE8]" />
                    <span className="font-extrabold text-slate-800 text-xs">
                      Bản Nháp Trực Tiếp ({displayedDraftShowtimes.length} suất)
                    </span>
                  </div>

                  {rooms.length > 0 && (
                    <select
                      value={draftRoomFilter}
                      onChange={(e) => setDraftRoomFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                      className="px-2 py-0.5 bg-white border border-slate-300 rounded-lg text-[11px] font-semibold text-slate-700 outline-none focus:border-[#7C6FE8]"
                    >
                      <option value="all">Tất cả phòng ({rooms.length})</option>
                      {rooms.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Inspector Body: Scrollable list of showtimes grouped by room */}
                <div className="flex-1 overflow-y-auto py-2.5 flex flex-col gap-3 scrollbar-thin pr-1">
                  {displayedDraftShowtimes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-12 gap-2 text-slate-400">
                      <Film className="w-8 h-8 text-slate-300" />
                      <span className="font-bold text-slate-600 text-xs">
                        Chưa có bản nháp nào
                      </span>
                      <p className="text-[11px] text-slate-400 max-w-xs">
                        Gửi lệnh cho AI ở khung bên trái hoặc chọn <strong>Chiến Lược Mẫu</strong> để xem danh sách suất chiếu trực quan tại đây.
                      </p>
                    </div>
                  ) : (
                    Object.entries(showtimesByRoom).map(([roomKey, roomShowtimes]) => {
                      const [roomName, rId] = roomKey.split('___');
                      const roomObj = rooms.find((r) => r.id === Number(rId));

                      return (
                        <div key={roomKey} className="flex flex-col gap-1.5 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                          {/* Room Header */}
                          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-slate-800 text-[11.5px]">{roomName}</span>
                              {roomObj?.type && (
                                <span className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-md ${
                                  roomObj.type.toLowerCase().includes('imax')
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : roomObj.type.toLowerCase().includes('screenx')
                                    ? 'bg-purple-100 text-[#7C6FE8] border border-purple-200'
                                    : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {roomObj.type.toUpperCase()}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {roomShowtimes.length} suất chiếu
                            </span>
                          </div>

                          {/* Showtimes list */}
                          <div className="flex flex-col gap-1.5 pt-1">
                            {roomShowtimes.map((st) => {
                              const startStr = st.showtime_start.slice(11, 16);
                              const endStr = st.showtime_end.slice(11, 16);

                              return (
                                <div
                                  key={st.temp_id}
                                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-purple-50/50 border border-slate-200/60 transition-colors group text-[11px]"
                                >
                                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                                    {st.movie_poster ? (
                                      <img
                                        src={st.movie_poster}
                                        alt={st.movie_title}
                                        className="w-7 h-9 object-cover rounded shadow-2xs shrink-0"
                                      />
                                    ) : (
                                      <div className="w-7 h-9 rounded bg-slate-200 flex items-center justify-center shrink-0">
                                        <Film className="w-3.5 h-3.5 text-slate-400" />
                                      </div>
                                    )}
                                    <div className="flex flex-col truncate">
                                      <span className="font-bold text-slate-800 truncate" title={st.movie_title}>
                                        {st.movie_title}
                                      </span>
                                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                        <span className="font-mono font-bold text-slate-700">
                                          {startStr} - {endStr}
                                        </span>
                                        <span>({st.duration}p)</span>
                                        {st.is_prime_time && (
                                          <span className="text-amber-600 font-bold">★ Giờ vàng</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0 pl-2">
                                    <span className="font-mono font-bold text-slate-700 text-[10.5px]">
                                      {Number(st.base_price).toLocaleString('vi-VN')}đ
                                    </span>

                                    {onRemoveDraftShowtime && (
                                      <button
                                        type="button"
                                        onClick={() => onRemoveDraftShowtime(st.temp_id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition-all cursor-pointer"
                                        title="Xóa suất này khỏi bản nháp"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Inspector Footer Actions */}
                {displayedDraftShowtimes.length > 0 && (
                  <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-medium">Dự kiến doanh thu:</span>
                      <span className="text-xs font-extrabold text-emerald-600">
                        {Number(draftData?.summary?.estimated_expected_revenue || 0).toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Xem Lưới
                      </button>

                      {onApplyDraft && (
                        <button
                          type="button"
                          onClick={() => onApplyDraft(true)}
                          disabled={isApplyingDraft}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition-all shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
                        >
                          {isApplyingDraft ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                          <span>Lưu Vào DB</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════ TAB 2: PHẠM VI & CHỌN LỌC PHIM / PHÒNG (SCOPE) ══════════ */}
          {activeTab === 'scope' && (
            <div className="flex flex-col gap-6">
              {/* Time Range Selector */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#7C6FE8]" />
                    Khung giờ tác động:
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    (Giữ nguyên các khung giờ còn lại nếu đã có suất)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'all', label: 'Cả Ngày', sub: '08:30 – 23:30' },
                    { id: 'morning', label: 'Buổi Sáng', sub: '08:30 – 12:30' },
                    { id: 'afternoon', label: 'Buổi Chiều', sub: '12:30 – 18:00' },
                    { id: 'evening', label: 'Giờ Vàng Tối', sub: '18:00 – 23:30' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTimeRangeScope(t.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        timeRangeScope === t.id
                          ? 'bg-[#7C6FE8] text-white border-[#7C6FE8] shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold text-xs">{t.label}</div>
                      <div
                        className={`text-[10px] ${
                          timeRangeScope === t.id ? 'text-purple-100' : 'text-slate-400'
                        }`}
                      >
                        {t.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Selection Cards */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#7C6FE8]" />
                    <span>Phòng chiếu áp dụng ({selectedRoomIds.length}/{rooms.length})</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRoomIds(rooms.map((r) => r.id))}
                      className="text-[#7C6FE8] hover:underline font-bold text-[11px] cursor-pointer"
                    >
                      Chọn tất cả
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => setSelectedRoomIds([])}
                      className="text-slate-500 hover:underline font-medium text-[11px] cursor-pointer"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {rooms.map((room) => {
                    const isSelected = selectedRoomIds.includes(room.id);
                    const isImax = room.type?.toLowerCase().includes('imax');
                    return (
                      <div
                        key={room.id}
                        onClick={() => toggleRoomSelection(room.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'border-[#7C6FE8] bg-purple-50/50 shadow-2xs'
                            : 'border-slate-200 bg-white opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                              isImax
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {room.name.replace(/[^0-9]/g, '') || 'R'}
                          </div>
                          <div>
                            <span className="font-bold text-xs text-slate-900 block truncate">
                              {room.name}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500">
                              <span className="font-semibold px-1 rounded bg-slate-100">
                                {room.type || '2D'}
                              </span>
                              <span>&bull;</span>
                              <span>{room.capacity || 100} ghế</span>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'bg-[#7C6FE8] border-[#7C6FE8] text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Movie Selection Cards */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Film className="w-4 h-4 text-[#7C6FE8]" />
                    <span>Danh sách phim ưu tiên ({selectedMovieIds.length}/{movies.length})</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMovieIds(movies.map((m) => m.id))}
                      className="text-[#7C6FE8] hover:underline font-bold text-[11px] cursor-pointer"
                    >
                      Chọn tất cả
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => setSelectedMovieIds([])}
                      className="text-slate-500 hover:underline font-medium text-[11px] cursor-pointer"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto p-1 scrollbar-thin">
                  {movies.map((movie) => {
                    const isSelected = selectedMovieIds.includes(movie.id);
                    return (
                      <div
                        key={movie.id}
                        onClick={() => toggleMovieSelection(movie.id)}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-[#7C6FE8] bg-purple-50/40 shadow-2xs'
                            : 'border-slate-200 bg-white opacity-55 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={movie.posterUrl || '/assets/images/cinedot-icon.png'}
                            alt={movie.title}
                            className="w-9 h-12 object-cover rounded-lg shrink-0 border border-slate-200"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-xs text-slate-900 truncate block">
                              {movie.title}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 mt-0.5">
                              <span className="px-1.5 py-0.2 rounded bg-slate-100 font-bold text-slate-700">
                                {movie.ageRating || 'P'}
                              </span>
                              <span>&bull;</span>
                              <span>{movie.duration || 120} phút</span>
                              {movie.genres && (
                                <>
                                  <span>&bull;</span>
                                  <span className="truncate max-w-[90px]">{movie.genres}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-all ${
                            isSelected
                              ? 'bg-[#7C6FE8] border-[#7C6FE8] text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 3: CHIẾN LƯỢC MẪU (PRESETS) ══════════ */}
          {activeTab === 'presets' && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between bg-purple-50 border border-purple-200 px-4 py-2.5 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-bold text-slate-900">Khung Giờ Vàng:</span>
                  <span className="text-[#7C6FE8] font-extrabold font-mono">
                    {config?.effective_prime_time?.display_text || '18:00 – 22:30 (Quy tắc giá)'}
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('config')}
                  className="text-[#7C6FE8] hover:text-[#685bc7] font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Chỉnh sửa quy tắc</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {strategies.map((st) => {
                  const isSelected = selectedStrategyId === st.id;
                  return (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStrategyId(st.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#7C6FE8] bg-purple-50/40 ring-2 ring-[#7C6FE8]/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 font-extrabold text-slate-900 text-xs">
                            {getStrategyIcon(st.icon)}
                            <span>{st.name}</span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isSelected
                                ? 'bg-[#7C6FE8] text-white border-[#7C6FE8]'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {st.badge}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed mb-3">
                          {st.description}
                        </p>
                      </div>

                      <div className="pt-2.5 border-t border-slate-100 text-[10.5px] text-slate-500 flex items-center justify-between">
                        <span className="truncate">Phù hợp: {st.recommended_for}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleGeneratePreset}
                disabled={isGeneratingDraft}
                className="w-full py-3.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-bold text-xs shadow-md shadow-[#7C6FE8]/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isGeneratingDraft ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang tính toán ma trận tối ưu...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Tự Động Sinh Bản Nháp Theo Chiến Lược Ngay</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* ══════════ TAB 4: ENGINE & CÀI ĐẶT API KEY ══════════ */}
          {activeTab === 'config' && (
            <div className="flex flex-col gap-5">
              {/* Popular Providers 1-Click Selectors */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-slate-900 text-xs">
                  Chọn nhà cung cấp AI nhanh (1-Click Presets):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {POPULAR_ENDPOINTS.map((p) => {
                    const isCurrent = modelName === p.defaultModel;
                    return (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => {
                          setAiProvider(p.provider);
                          setBaseUrlInput(p.baseUrl);
                          setModelName(p.defaultModel);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-[#7C6FE8] text-white border-[#7C6FE8] shadow-xs font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xs truncate">{p.name}</div>
                        <div
                          className={`text-[9.5px] truncate mt-0.5 ${
                            isCurrent ? 'text-purple-100' : 'text-slate-400'
                          }`}
                        >
                          {p.badge}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Endpoint & Key Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700 text-xs">Base API URL Endpoint:</label>
                  <input
                    type="text"
                    value={baseUrlInput}
                    onChange={(e) => setBaseUrlInput(e.target.value)}
                    className="p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-mono outline-none focus:border-[#7C6FE8]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700 text-xs">Model Name:</label>
                  <input
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-mono outline-none focus:border-[#7C6FE8]"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 text-xs">API Key:</label>
                    <span className="text-[11px] text-slate-400 font-normal">
                      (Bảo mật mã hóa lưu tại máy chủ)
                    </span>
                  </div>
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="Nhập API Key (hoặc để trống nếu dùng Gemini/Server Env)"
                    className="p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-mono outline-none focus:border-[#7C6FE8]"
                  />
                </div>
              </div>

              {/* Test Connection Results Alert */}
              {testResult && (
                <div
                  className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 ${
                    testResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{testResult.message}</span>
                  </div>
                  {testResult.latency_ms && (
                    <span className="font-mono text-[11px] px-2 py-0.5 bg-white/80 rounded-md">
                      {testResult.latency_ms}ms
                    </span>
                  )}
                </div>
              )}

              {saveSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isTestingConnection ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Globe className="w-3.5 h-3.5 text-[#7C6FE8]" />
                  )}
                  <span>Kiểm Tra Kết Nối (Ping)</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveConfig}
                  disabled={isSavingConfig}
                  className="px-5 py-2.5 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-bold text-xs shadow-md shadow-[#7C6FE8]/25 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSavingConfig ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5" />
                  )}
                  <span>Lưu Cấu Hình AI</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

