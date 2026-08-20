import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import {
  CampaignItemDTO,
  CampaignStatsDTO,
  CreateCampaignPayload,
  UpdateCampaignPayload,
  AdminVoucherDTO,
  AdminVoucherStatsDTO,
  CreateVoucherPayload,
  UpdateVoucherPayload,
  AdminBannerDTO,
  CreateBannerPayload,
  UpdateBannerPayload,
} from '../dto/adminCampaign.dto';
import {
  CampaignFilterParams,
  VoucherFilterParams,
  BannerFilterParams,
} from '../types/adminCampaign.types';

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  totalPages: number;
  totalResults: number;
}

export const adminCampaignService = {
  // ── 1. Campaigns ──
  async getCampaigns(params?: CampaignFilterParams): Promise<PaginatedResponse<CampaignItemDTO>> {
    const res = await apiClient.get<{ success: boolean; data: PaginatedResponse<CampaignItemDTO> }>(
      ENDPOINTS.ADMIN.CAMPAIGNS,
      { params }
    );
    return res.data.data;
  },

  async getCampaignStats(): Promise<CampaignStatsDTO> {
    const res = await apiClient.get<{ success: boolean; data: CampaignStatsDTO }>(
      ENDPOINTS.ADMIN.CAMPAIGNS_STATS
    );
    return res.data.data;
  },

  async getCampaignDetail(id: number | string): Promise<any> {
    const res = await apiClient.get<{ success: boolean; data: any }>(
      ENDPOINTS.ADMIN.CAMPAIGN_DETAIL(id)
    );
    return res.data.data;
  },

  async getCampaignRoi(id: number | string): Promise<any> {
    const res = await apiClient.get<{ success: boolean; data: any }>(
      ENDPOINTS.ADMIN.CAMPAIGN_ROI(id)
    );
    return res.data.data;
  },

  async createCampaign(payload: CreateCampaignPayload): Promise<CampaignItemDTO> {
    const res = await apiClient.post<{ success: boolean; message: string; data: CampaignItemDTO }>(
      ENDPOINTS.ADMIN.CAMPAIGNS,
      payload
    );
    return res.data.data;
  },

  async updateCampaign(id: number | string, payload: UpdateCampaignPayload): Promise<CampaignItemDTO> {
    const res = await apiClient.put<{ success: boolean; message: string; data: CampaignItemDTO }>(
      ENDPOINTS.ADMIN.CAMPAIGN_DETAIL(id),
      payload
    );
    return res.data.data;
  },

  async toggleCampaignStatus(id: number | string): Promise<any> {
    const res = await apiClient.patch<{ success: boolean; message: string; data: any }>(
      ENDPOINTS.ADMIN.CAMPAIGN_TOGGLE(id)
    );
    return res.data.data;
  },

  async deleteCampaign(id: number | string): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.delete<{ success: boolean; message: string }>(
      ENDPOINTS.ADMIN.CAMPAIGN_DETAIL(id)
    );
    return res.data;
  },

  // ── 2. Vouchers ──
  async getVouchers(params?: VoucherFilterParams): Promise<PaginatedResponse<AdminVoucherDTO>> {
    const res = await apiClient.get<{ success: boolean; data: PaginatedResponse<AdminVoucherDTO> }>(
      ENDPOINTS.ADMIN.VOUCHERS,
      { params }
    );
    return res.data.data;
  },

  async getVoucherStats(): Promise<AdminVoucherStatsDTO> {
    const res = await apiClient.get<{ success: boolean; data: AdminVoucherStatsDTO }>(
      ENDPOINTS.ADMIN.VOUCHERS_STATS
    );
    return res.data.data;
  },

  async getVoucherDetail(id: number | string): Promise<AdminVoucherDTO> {
    const res = await apiClient.get<{ success: boolean; data: AdminVoucherDTO }>(
      ENDPOINTS.ADMIN.VOUCHER_DETAIL(id)
    );
    return res.data.data;
  },

  async createVoucher(payload: CreateVoucherPayload): Promise<AdminVoucherDTO> {
    const res = await apiClient.post<{ success: boolean; message: string; data: AdminVoucherDTO }>(
      ENDPOINTS.ADMIN.VOUCHERS,
      payload
    );
    return res.data.data;
  },

  async updateVoucher(id: number | string, payload: UpdateVoucherPayload): Promise<AdminVoucherDTO> {
    const res = await apiClient.put<{ success: boolean; message: string; data: AdminVoucherDTO }>(
      ENDPOINTS.ADMIN.VOUCHER_DETAIL(id),
      payload
    );
    return res.data.data;
  },

  async toggleVoucherStatus(id: number | string): Promise<AdminVoucherDTO> {
    const res = await apiClient.patch<{ success: boolean; message: string; data: AdminVoucherDTO }>(
      ENDPOINTS.ADMIN.VOUCHER_TOGGLE(id)
    );
    return res.data.data;
  },

  async deleteVoucher(id: number | string): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.delete<{ success: boolean; message: string }>(
      ENDPOINTS.ADMIN.VOUCHER_DETAIL(id)
    );
    return res.data;
  },

  // ── 3. Banners ──
  async getBanners(params?: BannerFilterParams): Promise<PaginatedResponse<AdminBannerDTO>> {
    const res = await apiClient.get<{ success: boolean; data: PaginatedResponse<AdminBannerDTO> }>(
      ENDPOINTS.ADMIN.BANNERS,
      { params }
    );
    return res.data.data;
  },

  async createBanner(payload: CreateBannerPayload): Promise<AdminBannerDTO> {
    const res = await apiClient.post<{ success: boolean; message: string; data: AdminBannerDTO }>(
      ENDPOINTS.ADMIN.BANNERS,
      payload
    );
    return res.data.data;
  },

  async updateBanner(id: number | string, payload: UpdateBannerPayload): Promise<AdminBannerDTO> {
    const res = await apiClient.put<{ success: boolean; message: string; data: AdminBannerDTO }>(
      ENDPOINTS.ADMIN.BANNER_DETAIL(id),
      payload
    );
    return res.data.data;
  },

  async toggleBannerStatus(id: number | string): Promise<AdminBannerDTO> {
    const res = await apiClient.patch<{ success: boolean; message: string; data: AdminBannerDTO }>(
      ENDPOINTS.ADMIN.BANNER_TOGGLE(id)
    );
    return res.data.data;
  },

  async deleteBanner(id: number | string): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.delete<{ success: boolean; message: string }>(
      ENDPOINTS.ADMIN.BANNER_DETAIL(id)
    );
    return res.data;
  },
};
