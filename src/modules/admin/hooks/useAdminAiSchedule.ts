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

  // Generate Draft Action
  const generateDraft = async (params: GenerateAiDraftRequest): Promise<GenerateAiDraftResponse> => {
    setIsGeneratingDraft(true);
    try {
      const res = await adminAiScheduleService.generateDraft(params);
      setDraftData(res);
      return res;
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

    isTestingConnection,
    testResult,
    testConnection,
  };
}
