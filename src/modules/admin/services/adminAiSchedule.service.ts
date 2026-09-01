import { apiClient } from '@/shared/lib/apiClient';
import { ApiResponse } from '@/shared/types/api.types';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import {
  AiScheduleConfigDTO,
  UpdateAiScheduleConfigRequest,
  AiTestConnectionRequest,
  AiTestConnectionResponse,
  AiStrategyOption,
  GenerateAiDraftRequest,
  GenerateAiDraftResponse,
  AiDraftValidationResult,
  ApplyAiDraftRequest,
  ApplyAiDraftResponse,
  AiDraftShowtimeItem,
} from '../types/adminAiSchedule.types';

export const adminAiScheduleService = {
  /**
   * Lấy cấu hình rạp & thông tin kết nối AI
   */
  async getConfig(cinemaId?: number): Promise<AiScheduleConfigDTO> {
    const res = await apiClient.get<ApiResponse<AiScheduleConfigDTO>>(
      ENDPOINTS.ADMIN.SHOWTIMES_AI_CONFIG,
      { params: { cinema_id: cinemaId } }
    );
    if (!res.data?.data) {
      throw new Error(res.data?.message || 'Không thể tải cấu hình AI.');
    }
    return res.data.data;
  },

  /**
   * Cập nhật cấu hình rạp & tham số kết nối AI
   */
  async updateConfig(data: UpdateAiScheduleConfigRequest): Promise<AiScheduleConfigDTO> {
    const timeoutSeconds = Number(data.ai_timeout_seconds) || 60;
    const timeoutMs = Math.max(30000, (timeoutSeconds + 15) * 1000);

    const res = await apiClient.put<ApiResponse<AiScheduleConfigDTO>>(
      ENDPOINTS.ADMIN.SHOWTIMES_AI_CONFIG,
      data,
      { timeout: timeoutMs }
    );
    if (!res.data?.data) {
      throw new Error(res.data?.message || 'Không thể lưu cấu hình AI.');
    }
    return res.data.data;
  },

  /**
   * Kiểm tra kết nối API Key & Model
   */
  async testConnection(data: AiTestConnectionRequest): Promise<AiTestConnectionResponse> {
    try {
      const timeoutSeconds = Number(data.ai_timeout_seconds) || 60;
      const timeoutMs = Math.max(30000, (timeoutSeconds + 15) * 1000);

      const res = await apiClient.post<AiTestConnectionResponse>(
        ENDPOINTS.ADMIN.SHOWTIMES_AI_TEST_CONNECTION,
        data,
        { timeout: timeoutMs }
      );
      return res.data;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        (err.code === 'ECONNABORTED'
          ? `Hết thời gian chờ (${data.ai_timeout_seconds || 60}s). AI chưa kịp phản hồi.`
          : 'Lỗi khi kiểm tra kết nối AI.');
      return {
        success: false,
        message: errorMsg,
      };
    }
  },

  /**
   * Lấy danh sách Preset chiến lược mẫu
   */
  async getStrategies(): Promise<AiStrategyOption[]> {
    const res = await apiClient.get<ApiResponse<AiStrategyOption[]>>(
      ENDPOINTS.ADMIN.SHOWTIMES_AI_STRATEGIES
    );
    return res.data?.data || [];
  },

  /**
   * Sinh bản nháp lịch chiếu (Draft Showtimes)
   */
  async generateDraft(data: GenerateAiDraftRequest): Promise<GenerateAiDraftResponse> {
    const timeoutSeconds = Number(data.override_config?.ai_timeout_seconds) || 120;
    const timeoutMs = Math.max(60000, (timeoutSeconds + 30) * 1000);

    const res = await apiClient.post<ApiResponse<GenerateAiDraftResponse>>(
      ENDPOINTS.ADMIN.SHOWTIMES_AI_GENERATE_DRAFT,
      data,
      { timeout: timeoutMs }
    );
    if (!res.data?.data) {
      throw new Error(res.data?.message || 'Không thể sinh lịch chiếu AI.');
    }
    return res.data.data;
  },

  /**
   * Kiểm tra xung đột thời gian thực trên bản nháp
   */
  async validateDraft(
    cinemaId: number,
    targetDate: string,
    draftShowtimes: AiDraftShowtimeItem[]
  ): Promise<AiDraftValidationResult> {
    const res = await apiClient.post<ApiResponse<AiDraftValidationResult>>(
      ENDPOINTS.ADMIN.SHOWTIMES_AI_VALIDATE_DRAFT,
      {
        cinema_id: cinemaId,
        target_date: targetDate,
        draft_showtimes: draftShowtimes,
      }
    );
    return (
      res.data?.data || {
        is_valid: true,
        conflicts: [],
        warnings: [],
      }
    );
  },

  /**
   * Áp dụng lưu toàn bộ bản nháp vào Database
   */
  async applyDraft(data: ApplyAiDraftRequest): Promise<ApplyAiDraftResponse> {
    const res = await apiClient.post<ApiResponse<ApplyAiDraftResponse>>(
      ENDPOINTS.ADMIN.SHOWTIMES_AI_APPLY_DRAFT,
      data
    );
    if (!res.data?.data) {
      throw new Error(res.data?.message || 'Không thể áp dụng bản nháp lịch chiếu.');
    }
    return res.data.data;
  },
};
