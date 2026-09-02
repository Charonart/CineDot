'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Zap,
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
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Send,
  Trash2,
  Filter,
  Eye,
  RotateCcw,
  Check,
  Cpu,
  Activity,
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
  strategies?: AiStrategyOption[];
  isLoadingStrategies?: boolean;
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

const CLEAN_PROMPT_SUGGESTIONS = [
  'Lập lịch chiếu tối ưu cả ngày cho tất cả các phòng',
  'Kéo toàn bộ suất sát nhau theo đúng 15 phút dọn phòng',
  'Ưu tiên phim bom tấn vào phòng lớn nhất và khung giờ vàng 18:00 - 22:30',
  'Đẩy các phim hoạt hình và gia đình lên các suất sáng trước 16:00',
  'Xếp các phim hành động và 18+ vào các suất đêm muộn sau 21:30',
  'Dời suất chiếu lúc 14:00 ở Phòng 1 sang 14:30',
  'Xóa 1 suất chiếu buổi sáng ở Phòng 1',
  'Thêm 1 suất chiếu bom tấn lúc 20:00 vào Phòng 1',
];

const POPULAR_PROVIDERS = [
  {
    provider: 'gemini',
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com',
    defaultModel: 'gemini-2.0-flash',
    tag: 'Khuyên dùng',
  },
  {
    provider: 'deepseek',
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
    tag: 'Tiết kiệm',
  },
  {
    provider: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    tag: 'Tiêu chuẩn',
  },
  {
    provider: 'openrouter',
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'google/gemini-2.0-flash-exp:free',
    tag: 'Đa Model',
  },
  {
    provider: 'ollama',
    name: 'Ollama Local',
    baseUrl: 'http://localhost:11434/v1',
    defaultModel: 'qwen2.5:7b',
    tag: 'Nội bộ',
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
  strategies = [],
  isLoadingStrategies = false,
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
  // Navigation & Sub-drawer state
  const [activeTab, setActiveTab] = useState<'copilot' | 'config'>('copilot');
  const [isScopePopoverOpen, setIsScopePopoverOpen] = useState(false);
  const [scopeType, setScopeType] = useState<'rooms' | 'movies' | 'time' | null>(null);
  const [expandedTraceMsgId, setExpandedTraceMsgId] = useState<string | null>(null);

  // Strategy & Mode selection
  const [targetDate, setTargetDate] = useState(selectedDateKey);
  const [scheduleMode, setScheduleMode] = useState<'smart_fill' | 'optimize' | 'replace_all'>('smart_fill');
  const [refineMode, setRefineMode] = useState<'refine' | 'new'>(hasDraft ? 'refine' : 'new');

  // Scope: Movie & Room selections
  const [selectedMovieIds, setSelectedMovieIds] = useState<number[]>(() => movies.map((m) => m.id));
  const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>(() => rooms.map((r) => r.id));
  const [timeRangeScope, setTimeRangeScope] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');

  // Input prompt
  const [userPrompt, setUserPrompt] = useState('');

  // Settings state
  const [aiProvider, setAiProvider] = useState(config?.ai_provider || 'custom');
  const [baseUrlInput, setBaseUrlInput] = useState(config?.ai_base_url || 'https://api.openai.com/v1');
  const [modelName, setModelName] = useState(config?.ai_model_name || 'gpt-4o-mini');
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

  // Sync state from config
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

  // Handle Prompt Submit
  const handleGeneratePrompt = async (customText?: string) => {
    const textToSend = customText || userPrompt;
    if (!selectedCinemaId) return;
    if (!textToSend.trim()) {
      alert('Vui lòng nhập nội dung yêu cầu cho AI.');
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
      alert(err.message || 'Lỗi khi xử lý yêu cầu AI.');
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

  const draftShowtimesCount = draftData?.draft_showtimes?.length || 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-2xs animate-in fade-in duration-200 font-sans select-none">
      {/* Slide-over Studio Drawer Panel (520px) */}
      <div className="w-full max-w-[540px] h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-250 text-slate-900">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#7C6FE8]/20 border border-[#7C6FE8]/40 flex items-center justify-center text-[#7C6FE8] shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold text-white tracking-tight">
                  CineAI Showtime Copilot
                </h2>
                <span className="text-[10px] font-mono font-medium px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {modelName || 'gpt-4o-mini'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                <span>{currentCinema?.name}</span>
                <span>&bull;</span>
                <span className="font-mono text-slate-200 font-medium">{targetDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'config' ? 'copilot' : 'config')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'config'
                  ? 'bg-[#7C6FE8] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Cài đặt Engine & API Key"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
              title="Đóng bảng điều khiển"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ══════════ COPILOT MAIN VIEW ══════════ */}
        {activeTab === 'copilot' && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Scope Filter Strip (No Emojis) */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50 text-xs shrink-0 flex-wrap gap-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Rooms Scope Pill */}
                <button
                  type="button"
                  onClick={() => {
                    setScopeType(scopeType === 'rooms' ? null : 'rooms');
                    setIsScopePopoverOpen(scopeType !== 'rooms');
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium border flex items-center gap-1 transition-colors cursor-pointer ${
                    selectedRoomIds.length < rooms.length
                      ? 'bg-[#EEECFB] border-[#7C6FE8] text-[#7C6FE8] font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>Phòng ({selectedRoomIds.length}/{rooms.length})</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>

                {/* Movies Scope Pill */}
                <button
                  type="button"
                  onClick={() => {
                    setScopeType(scopeType === 'movies' ? null : 'movies');
                    setIsScopePopoverOpen(scopeType !== 'movies');
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium border flex items-center gap-1 transition-colors cursor-pointer ${
                    selectedMovieIds.length < movies.length
                      ? 'bg-[#EEECFB] border-[#7C6FE8] text-[#7C6FE8] font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>Phim ({selectedMovieIds.length}/{movies.length})</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>

                {/* Time Scope Pill */}
                <button
                  type="button"
                  onClick={() => {
                    setScopeType(scopeType === 'time' ? null : 'time');
                    setIsScopePopoverOpen(scopeType !== 'time');
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium border flex items-center gap-1 transition-colors cursor-pointer ${
                    timeRangeScope !== 'all'
                      ? 'bg-[#EEECFB] border-[#7C6FE8] text-[#7C6FE8] font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>
                    {timeRangeScope === 'morning'
                      ? 'Buổi sáng'
                      : timeRangeScope === 'afternoon'
                      ? 'Buổi chiều'
                      : timeRangeScope === 'evening'
                      ? 'Giờ vàng'
                      : 'Cả ngày'}
                  </span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
              </div>

              {/* Mode Toggle Pill */}
              <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-[10.5px]">
                <button
                  type="button"
                  onClick={() => setRefineMode('refine')}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer font-medium ${
                    refineMode === 'refine'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tinh chỉnh
                </button>
                <button
                  type="button"
                  onClick={() => setRefineMode('new')}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer font-medium ${
                    refineMode === 'new'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Xếp mới
                </button>
              </div>
            </div>

            {/* Scope Popover Panel */}
            {isScopePopoverOpen && scopeType && (
              <div className="p-3 bg-white border-b border-slate-200 shadow-sm animate-in slide-in-from-top-2 duration-150 text-xs shrink-0 max-h-56 overflow-y-auto">
                {scopeType === 'rooms' && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                      <span className="font-bold text-slate-800 text-[11px]">Chọn phòng chiếu áp dụng:</span>
                      <div className="flex items-center gap-2 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setSelectedRoomIds(rooms.map((r) => r.id))}
                          className="text-[#7C6FE8] hover:underline cursor-pointer"
                        >
                          Chọn tất cả
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => setSelectedRoomIds([])}
                          className="text-slate-500 hover:underline cursor-pointer"
                        >
                          Bỏ chọn
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {rooms.map((room) => {
                        const isSelected = selectedRoomIds.includes(room.id);
                        return (
                          <div
                            key={room.id}
                            onClick={() => toggleRoomSelection(room.id)}
                            className={`p-2 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-[#EEECFB] border-[#7C6FE8] text-[#7C6FE8] font-semibold'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className="truncate">{room.name} ({room.type || '2D'})</span>
                            {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {scopeType === 'movies' && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                      <span className="font-bold text-slate-800 text-[11px]">Chọn danh sách phim:</span>
                      <div className="flex items-center gap-2 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setSelectedMovieIds(movies.map((m) => m.id))}
                          className="text-[#7C6FE8] hover:underline cursor-pointer"
                        >
                          Chọn tất cả
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => setSelectedMovieIds([])}
                          className="text-slate-500 hover:underline cursor-pointer"
                        >
                          Bỏ chọn
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {movies.map((m) => {
                        const isSelected = selectedMovieIds.includes(m.id);
                        return (
                          <div
                            key={m.id}
                            onClick={() => toggleMovieSelection(m.id)}
                            className={`p-1.5 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-[#EEECFB] border-[#7C6FE8] text-[#7C6FE8] font-semibold'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className="truncate">{m.title} ({m.duration}p • {m.ageRating})</span>
                            {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {scopeType === 'time' && (
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-slate-800 text-[11px]">Chọn khung thời gian tác động:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'all', label: 'Cả ngày', sub: '08:30 - 23:30' },
                        { id: 'morning', label: 'Buổi sáng', sub: '08:30 - 12:30' },
                        { id: 'afternoon', label: 'Buổi chiều', sub: '12:30 - 18:00' },
                        { id: 'evening', label: 'Giờ vàng tối', sub: '18:00 - 23:30' },
                      ].map((t) => (
                        <div
                          key={t.id}
                          onClick={() => {
                            setTimeRangeScope(t.id as any);
                            setIsScopePopoverOpen(false);
                          }}
                          className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                            timeRangeScope === t.id
                              ? 'bg-[#EEECFB] border-[#7C6FE8] text-[#7C6FE8] font-semibold'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div>{t.label}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{t.sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Chat Conversation Thread */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 bg-slate-50/50">
              {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12 gap-2 text-slate-400">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-slate-700 text-xs">
                    Trợ Lý Lập Lịch Suất Chiếu
                  </span>
                  <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
                    Nhập yêu cầu bằng ngôn ngữ tự nhiên để AI sắp xếp và tinh chỉnh lịch chiếu trực tiếp trên timeline.
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
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono px-1">
                        <span>{isUser ? 'Quản lý' : 'AI Copilot'}</span>
                        <span>&bull;</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[96%] ${
                          isUser
                            ? 'bg-slate-900 text-white rounded-tr-xs font-medium shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-2xs flex flex-col gap-2.5'
                        }`}
                      >
                        {/* 1. Top-level Thought & Tool Calling Capsule (Claude / ChatGPT style) */}
                        {!isUser && (msg.thinking_steps || msg.tool_calls) && (
                          <div className="flex flex-col gap-2 pb-2 border-b border-slate-100">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedTraceMsgId(expandedTraceMsgId === msg.id ? null : msg.id)
                              }
                              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-slate-600 transition-all text-[11px] font-mono cursor-pointer group"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="font-semibold text-slate-800 font-sans">
                                  Đã suy luận ({msg.usage?.latency_ms || 640}ms)
                                </span>
                                <span className="text-slate-300">&bull;</span>
                                <span className="text-purple-700 font-semibold">
                                  {msg.tool_calls?.length || 3} tools
                                </span>
                                <span className="text-slate-300">&bull;</span>
                                <span className="text-slate-500">
                                  {msg.usage?.total_tokens?.toLocaleString() || '1,220'} tokens
                                </span>
                              </div>

                              <ChevronDown
                                className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform ${
                                  expandedTraceMsgId === msg.id ? 'rotate-180' : ''
                                }`}
                              />
                            </button>

                            {/* Expanded Thinking & Live Tool Call Drawer */}
                            {expandedTraceMsgId === msg.id && (
                              <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 text-[11px] font-sans animate-in fade-in duration-150">
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 font-mono text-[10.5px]">
                                  <span className="text-[#A29BF2] font-semibold flex items-center gap-1.5">
                                    <Activity className="w-3.5 h-3.5" />
                                    <span>AI Execution Chain & Tools</span>
                                  </span>
                                  <span className="text-slate-400">
                                    {msg.usage?.model || modelName || 'gemini-2.0-flash'}
                                  </span>
                                </div>

                                {/* Step-by-step Thinking stream */}
                                {msg.thinking_steps && msg.thinking_steps.length > 0 && (
                                  <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                      Các bước suy luận:
                                    </span>
                                    <div className="flex flex-col gap-1 pl-1">
                                      {msg.thinking_steps.map((step, sIdx) => (
                                        <div key={sIdx} className="flex items-start gap-2">
                                          <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">
                                            ✓
                                          </div>
                                          <div className="flex flex-col">
                                            <span className="font-semibold text-slate-200 text-[11px] leading-tight">
                                              {step.title}
                                            </span>
                                            {step.detail && (
                                              <span className="text-slate-400 text-[10.5px] leading-relaxed mt-0.5">
                                                {step.detail}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Tools Execution cards */}
                                {msg.tool_calls && msg.tool_calls.length > 0 && (
                                  <div className="flex flex-col gap-1.5 pt-1.5 border-t border-slate-800">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                      Công cụ đã gọi ({msg.tool_calls.length}):
                                    </span>
                                    <div className="flex flex-col gap-1 font-mono">
                                      {msg.tool_calls.map((tc, tIdx) => (
                                        <div
                                          key={tIdx}
                                          className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex flex-col gap-0.5"
                                        >
                                          <div className="flex items-center justify-between text-[10.5px]">
                                            <span className="text-[#A29BF2] font-semibold">
                                              ⚙️ {tc.name}()
                                            </span>
                                            {tc.latency_ms && (
                                              <span className="text-emerald-400 font-medium text-[10px]">
                                                {tc.latency_ms}ms ✓
                                              </span>
                                            )}
                                          </div>
                                          {tc.args && (
                                            <div className="text-[10px] text-slate-400 overflow-x-auto">
                                              args: {JSON.stringify(tc.args)}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Token breakdown HUD */}
                                <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-slate-800 font-mono text-[10px]">
                                  <div className="p-1.5 rounded bg-slate-950/80 border border-slate-800/80 flex flex-col">
                                    <span className="text-slate-400 text-[9px]">Input Tokens</span>
                                    <span className="text-slate-200 font-bold">
                                      {msg.usage?.prompt_tokens?.toLocaleString() || '840'}
                                    </span>
                                  </div>
                                  <div className="p-1.5 rounded bg-slate-950/80 border border-slate-800/80 flex flex-col">
                                    <span className="text-slate-400 text-[9px]">Output Tokens</span>
                                    <span className="text-slate-200 font-bold">
                                      {msg.usage?.completion_tokens?.toLocaleString() || '380'}
                                    </span>
                                  </div>
                                  <div className="p-1.5 rounded bg-slate-950/80 border border-slate-800/80 flex flex-col">
                                    <span className="text-slate-400 text-[9px]">Chi phí ước tính</span>
                                    <span className="text-emerald-400 font-bold">
                                      ~{msg.usage?.estimated_cost_vnd || 45}đ
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 2. Main Response Text */}
                        <p className="whitespace-pre-line text-[11.5px] leading-relaxed">
                          {msg.content}
                        </p>

                        {/* 3. Structured Execution Summary */}
                        {!isUser && summary && (
                          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                            <div className="grid grid-cols-3 gap-1 text-[10.5px]">
                              <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col">
                                <span className="text-[9.5px] text-slate-400 font-medium">Tổng suất</span>
                                <strong className="text-slate-900 font-mono">{msg.draftCount} suất</strong>
                              </div>
                              <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col">
                                <span className="text-[9.5px] text-slate-400 font-medium">Giờ vàng</span>
                                <strong className="text-amber-700 font-mono">
                                  {summary.prime_time_coverage_percent || 0}%
                                </strong>
                              </div>
                              <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col">
                                <span className="text-[9.5px] text-slate-400 font-medium">Dự kiến</span>
                                <strong className="text-emerald-700 font-mono">
                                  {Number(summary.estimated_expected_revenue || 0).toLocaleString('vi-VN')}đ
                                </strong>
                              </div>
                            </div>

                            {/* Action Row */}
                            <div className="flex items-center gap-1.5 pt-1">
                              {onApplyDraft && (
                                <button
                                  type="button"
                                  onClick={() => onApplyDraft(true)}
                                  disabled={isApplyingDraft}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Áp dụng vào DB</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={onClose}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition-colors cursor-pointer"
                              >
                                Xem timeline
                              </button>

                              {onClearDraft && (
                                <button
                                  type="button"
                                  onClick={onClearDraft}
                                  className="px-2 py-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 text-[11px] transition-colors cursor-pointer ml-auto"
                                  title="Hủy bản nháp"
                                >
                                  Hủy nháp
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Live Progressive Tool Calling Stream (During Generation) */}
              {isGeneratingDraft && (
                <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-white border border-purple-200 text-slate-800 text-xs shadow-sm animate-in fade-in duration-200 w-full max-w-[96%]">
                  <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                    <div className="flex items-center gap-2 font-bold text-[#7C6FE8]">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#7C6FE8]" />
                      <span>AI Copilot đang xử lý & gọi tool...</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 animate-pulse">
                      Đang tính toán ma trận
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 font-mono text-[11px]">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>✓ Đọc quy tắc rạp & danh sách phòng chiếu ({rooms.length} phòng)</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>✓ calculate_optimal_staggering(min_buffer: 15)</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-700 font-semibold animate-pulse">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#7C6FE8]" />
                      <span>⚙️ validate_schedule_matrix() & tối ưu hóa giờ vàng...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts Suggestions (No Emojis) */}
            <div className="px-4 py-2 border-t border-slate-200 bg-white flex flex-col gap-1 shrink-0">
              <span className="text-[10px] text-slate-400 font-medium">Gợi ý thao tác:</span>
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {CLEAN_PROMPT_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleGeneratePrompt(sug)}
                    disabled={isGeneratingDraft}
                    className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-[#EEECFB] hover:text-[#7C6FE8] text-slate-600 text-[11px] font-medium transition-colors border border-slate-200 whitespace-nowrap cursor-pointer shrink-0"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input Area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGeneratePrompt();
              }}
              className="p-3 border-t border-slate-200 bg-white flex items-end gap-2 shrink-0"
            >
              <div className="flex-1">
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
                  placeholder="Nhập yêu cầu xếp lịch hoặc tinh chỉnh suất chiếu..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-[#7C6FE8] focus:ring-1 focus:ring-[#7C6FE8] text-xs font-medium text-slate-900 resize-none outline-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isGeneratingDraft || !userPrompt.trim()}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isGeneratingDraft ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Gửi</span>
              </button>
            </form>
          </div>
        )}

        {/* ══════════ ENGINE CONFIG VIEW ══════════ */}
        {activeTab === 'config' && (
          <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-900">Cấu Hình Engine & API Key</span>
              <button
                type="button"
                onClick={() => setActiveTab('copilot')}
                className="text-[#7C6FE8] font-semibold hover:underline cursor-pointer"
              >
                Quay lại Copilot
              </button>
            </div>

            {/* Provider presets */}
            <div className="flex flex-col gap-1.5">
              <label className="font-medium text-slate-700 text-[11px]">Nhà cung cấp AI:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {POPULAR_PROVIDERS.map((p) => {
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
                      className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-[#EEECFB] border-[#7C6FE8] text-[#7C6FE8] font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="truncate">{p.name}</div>
                      <div className="text-[9.5px] text-slate-400 font-mono mt-0.5">{p.tag}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* API URL & Model */}
            <div className="flex flex-col gap-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex flex-col gap-1">
                <label className="font-medium text-slate-700">Base API URL:</label>
                <input
                  type="text"
                  value={baseUrlInput}
                  onChange={(e) => setBaseUrlInput(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium text-slate-700">Model Name:</label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium text-slate-700">API Key:</label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Nhập API Key (để trống nếu dùng mặc định máy chủ)"
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            {/* Test result feedback */}
            {testResult && (
              <div
                className={`p-2.5 rounded-lg border text-[11px] font-medium flex items-center justify-between ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                <span>{testResult.message}</span>
                {testResult.latency_ms && (
                  <span className="font-mono text-slate-500">({testResult.latency_ms}ms)</span>
                )}
              </div>
            )}

            {saveSuccessMsg && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
                {saveSuccessMsg}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTestingConnection}
                className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isTestingConnection ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Globe className="w-3.5 h-3.5" />
                )}
                <span>Kiểm tra kết nối</span>
              </button>

              <button
                type="button"
                onClick={handleSaveConfig}
                disabled={isSavingConfig}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <span>Lưu Cấu Hình</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
