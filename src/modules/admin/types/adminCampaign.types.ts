/**
 * Domain Types & Filter Interfaces for Admin Marketing Suite
 */

import {
  CampaignItemDTO,
  CampaignStatsDTO,
  AdminVoucherDTO,
  AdminVoucherStatsDTO,
  AdminBannerDTO,
} from '../dto/adminCampaign.dto';

export type AdminCampaign = CampaignItemDTO;
export type CampaignStats = CampaignStatsDTO;

export interface CampaignFilterParams {
  search?: string;
  is_active?: boolean | string;
  page?: number;
  limit?: number;
}

export type AdminVoucher = AdminVoucherDTO;
export type VoucherStats = AdminVoucherStatsDTO;

export interface VoucherFilterParams {
  search?: string;
  campaign_id?: number | string;
  voucher_type?: 'ticket' | 'combo' | 'order' | 'all' | string;
  discount_type?: 'percentage' | 'fixed_amount' | string;
  is_active?: boolean | string;
  status?: 'active' | 'expired' | 'depleted' | 'inactive' | string;
  page?: number;
  limit?: number;
}

export type AdminBanner = AdminBannerDTO;

export interface BannerFilterParams {
  search?: string;
  campaign_id?: number | string;
  is_active?: boolean | string;
  page?: number;
  limit?: number;
}
