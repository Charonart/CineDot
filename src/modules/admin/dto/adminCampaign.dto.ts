/**
 * DTOs for Admin Marketing Suite (Campaigns, Vouchers, Banners & ROI)
 */

export interface CampaignItemDTO {
  id: number;
  name: string;
  budget: number;
  usedBudget: number;
  revenueGenerated: number;
  roiPercentage: number;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  vouchersCount: number;
  bannersCount: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CampaignStatsDTO {
  total_campaigns: number;
  active_campaigns: number;
  total_budget: number;
  total_revenue_generated: number;
  total_discount_given: number;
  overall_roi_percentage: number;
}

export interface CreateCampaignPayload {
  name: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

export interface UpdateCampaignPayload {
  name?: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

// ── Vouchers ──
export interface AdminVoucherDTO {
  id: number;
  campaignId: number | null;
  campaignName: string | null;
  code: string;
  title: string | null;
  description: string | null;
  voucherType: 'ticket' | 'combo' | 'order' | 'all';
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  minOrderValue: number;
  maxDiscountValue: number | null;
  validFrom: string | null;
  validUntil: string | null;
  systemLimit: number | null;
  usageLimit?: number | null;
  limitPerUser: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AdminVoucherStatsDTO {
  total_vouchers: number;
  active_vouchers: number;
  total_used_count: number;
  expiring_soon_count: number;
}

export interface CreateVoucherPayload {
  campaign_id?: number | null;
  code: string;
  title?: string;
  description?: string;
  voucher_type?: 'ticket' | 'combo' | 'order' | 'all';
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  min_order_value?: number;
  max_discount_value?: number | null;
  system_limit?: number | null;
  limit_per_user?: number;
  valid_from?: string | null;
  valid_until?: string | null;
  is_active?: boolean;
}

export interface UpdateVoucherPayload {
  campaign_id?: number | null;
  code?: string;
  title?: string;
  description?: string;
  voucher_type?: 'ticket' | 'combo' | 'order' | 'all';
  discount_type?: 'percentage' | 'fixed_amount';
  discount_value?: number;
  min_order_value?: number;
  max_discount_value?: number | null;
  system_limit?: number | null;
  limit_per_user?: number;
  valid_from?: string | null;
  valid_until?: string | null;
  is_active?: boolean;
}

// ── Banners ──
export interface AdminBannerDTO {
  id: number;
  campaignId: number | null;
  campaignName: string | null;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  order: number;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateBannerPayload {
  campaign_id?: number | null;
  title: string;
  image_url: string;
  link_url?: string | null;
  order?: number;
  is_active?: boolean;
}

export interface UpdateBannerPayload {
  campaign_id?: number | null;
  title?: string;
  image_url?: string;
  link_url?: string | null;
  order?: number;
  is_active?: boolean;
}
