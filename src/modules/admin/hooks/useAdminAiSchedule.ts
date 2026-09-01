'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminAiScheduleService } from '../services/adminAiSchedule.service';
import {
  AiScheduleConfigDTO,
  UpdateAiScheduleConfigRequest,
  AiTestConnectionRequest,
  AiTestConnectionResponse,
  AiStrategyOption,
  GenerateAiDraftRequest,
  GenerateAiDraftResponse,
  AiDraftShowtimeItem,
  ApplyAiDraftResponse,
  AiChatMessage,
} from '../types/adminAiSchedule.types';

export function useAdminAiSchedule(selectedCinemaId?: number, selectedDateKey?: string) {
  // Config State
  const [config, setConfig] = useState<AiScheduleConfigDTO | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);

  // Strategies List State
  const [strategies, setStrategies] = useState<AiStrategyOption[]>([]);
  const [isLoadingStrategies, setIsLoadingStrategies] = useState(false);

  // Draft State
  const [draftData, setDraftData] = useState<GenerateAiDraftResponse | null>(null);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [isApplyingDraft, setIsApplyingDraft] = useState(false);

  // Multi-Turn Copilot Chat History
  const [chatHistory, setChatHistory] = useState<AiChatMessage[]>([]);

  // Test Connection State
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<AiTestConnectionResponse | null>(null);

  // Fetch Config
  const fetchConfig = useCallback(async (cinemaId?: number) => {
    setIsLoadingConfig(true);
    try {
      const data = await adminAiScheduleService.getConfig(cinemaId);
      setConfig(data);
    } catch (err) {
      console.error('Lỗi tải cấu hình AI:', err);
    } finally {
      setIsLoadingConfig(false);
    }
  }, []);

  // Fetch Strategies
  const fetchStrategies = useCallback(async () => {
    setIsLoadingStrategies(true);
    try {
      const data = await adminAiScheduleService.getStrategies();
      setStrategies(data);
    } catch (err) {
      console.error('Lỗi tải danh sách chiến lược AI:', err);
    } finally {
      setIsLoadingStrategies(false);
    }
  }, []);

  // Auto fetch config when cinema changes
  useEffect(() => {
    fetchConfig(selectedCinemaId);
    fetchStrategies();
  }, [selectedCinemaId, fetchConfig, fetchStrategies]);

  // Clear chat history & draft when date or cinema changes
  useEffect(() => {
    setChatHistory([]);
  }, [selectedDateKey, selectedCinemaId]);

  // Update Config Action
  const updateConfig = async (params: UpdateAiScheduleConfigRequest): Promise<AiScheduleConfigDTO> => {
    const updated = await adminAiScheduleService.updateConfig(params);
    setConfig(updated);
    return updated;
  };

  // Test Connection Action
  const testConnection = async (params: AiTestConnectionRequest): Promise<AiTestConnectionResponse> => {
    setIsTestingConnection(true);
    setTestResult(null);
    try {
      const res = await adminAiScheduleService.testConnection(params);
      setTestResult(res);
      return res;
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Generate / Refine Draft Action
  const generateDraft = async (params: GenerateAiDraftRequest): Promise<GenerateAiDraftResponse> => {
    setIsGeneratingDraft(true);

    const userMessageContent = params.prompt || (params.strategy_id ? `Chiến lược: ${params.strategy_id}` : 'Sinh lịch chiếu');
    const userMsg: AiChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: userMessageContent,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);

    try {
      const payload: GenerateAiDraftRequest = {
        ...params,
        current_draft_showtimes: params.current_draft_showtimes || (draftData ? draftData.draft_showtimes : undefined),
        chat_history: chatHistory.map((m) => ({ role: m.role, content: m.content })),
      };

      const res = await adminAiScheduleService.generateDraft(payload);
      setDraftData(res);

      const suggestedFollowups: string[] = [];
      if (res.validation?.conflicts && res.validation.conflicts.length > 0) {
        suggestedFollowups.push('Khắc phục xung đột thời gian');
      }
      if (res.summary?.prime_time_coverage_percent && res.summary.prime_time_coverage_percent < 70) {
        suggestedFollowups.push('Tăng thêm suất chiếu vào Khung Giờ Vàng (18:00 - 22:30)');
      }
      suggestedFollowups.push('Dời các suất phòng 1 lùi 15 phút');
      suggestedFollowups.push('Thêm 1 suất chiếu đêm muộn sau 22:30');

      const assistantMsg: AiChatMessage = {
        id: `msg_assistant_${Date.now()}`,
        role: 'assistant',
        content: res.summary.strategy_explanation || 'Đã cập nhật bản nháp lịch chiếu thành công.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        draftCount: res.draft_showtimes.length,
        draftSummary: res.summary,
        showtimes: res.draft_showtimes,
        validation: res.validation,
        suggestedFollowups: suggestedFollowups.slice(0, 3),
      };

      setChatHistory((prev) => [...prev, assistantMsg]);
      return res;
    } catch (err) {
      const errorMsg: AiChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content: 'Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng kiểm tra lại kết nối hoặc câu lệnh.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory((prev) => [...prev, errorMsg]);
      throw err;
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  // Move or Edit a Single Draft Showtime
  const updateDraftShowtime = (tempId: string, updates: Partial<AiDraftShowtimeItem>) => {
    if (!draftData) return;

    const updatedList = draftData.draft_showtimes.map((st) => {
      if (st.temp_id === tempId) {
        return { ...st, ...updates };
      }
      return st;
    });

    setDraftData({
      ...draftData,
      draft_showtimes: updatedList,
    });
  };

  // Remove a Single Draft Showtime
  const removeDraftShowtime = (tempId: string) => {
    if (!draftData) return;

    const updatedList = draftData.draft_showtimes.filter((st) => st.temp_id !== tempId);
    setDraftData({
      ...draftData,
      draft_showtimes: updatedList,
      summary: {
        ...draftData.summary,
        total_showtimes: updatedList.length,
      },
    });
  };

  // Clear / Discard Draft
  const clearDraft = () => {
    setDraftData(null);
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  // Apply Draft Action
  const applyDraft = async (cleanExistingDate: boolean = false): Promise<ApplyAiDraftResponse> => {
    if (!draftData || !selectedCinemaId || !selectedDateKey) {
      throw new Error('Không có bản nháp nào để áp dụng.');
    }

    setIsApplyingDraft(true);
    try {
      const res = await adminAiScheduleService.applyDraft({
        cinema_id: selectedCinemaId,
        target_date: selectedDateKey,
        draft_showtimes: draftData.draft_showtimes,
        clean_existing_date: cleanExistingDate,
      });

      // Clear draft upon successful apply
      setDraftData(null);
      return res;
    } finally {
      setIsApplyingDraft(false);
    }
  };

  return {
    config,
    isLoadingConfig,
    refetchConfig: () => fetchConfig(selectedCinemaId),
    updateConfig,

    strategies,
    isLoadingStrategies,

    draftData,
    hasDraft: !!draftData && draftData.draft_showtimes.length > 0,
    isGeneratingDraft,
    isApplyingDraft,
    generateDraft,
    updateDraftShowtime,
    removeDraftShowtime,
    clearDraft,
    applyDraft,

    chatHistory,
    clearChat,

    isTestingConnection,
    testResult,
    testConnection,
  };
}

