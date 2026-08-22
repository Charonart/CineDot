import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCampaignService } from '../services/adminCampaign.service';
import {
  CreateVoucherPayload,
  UpdateVoucherPayload,
} from '../dto/adminCampaign.dto';
import { AdminVoucher, VoucherFilterParams } from '../types/adminCampaign.types';

export const ADMIN_VOUCHER_KEYS = {
  all: ['admin', 'vouchers'] as const,
  list: (params: VoucherFilterParams) => [...ADMIN_VOUCHER_KEYS.all, 'list', params] as const,
  stats: () => [...ADMIN_VOUCHER_KEYS.all, 'stats'] as const,
  detail: (id: number | string) => [...ADMIN_VOUCHER_KEYS.all, 'detail', id] as const,
};

export function useAdminVouchers(initialFilters: VoucherFilterParams = {}) {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<VoucherFilterParams>({
    page: 1,
    limit: 15,
    ...initialFilters,
  });

  // Query: Vouchers List
  const {
    data: vouchersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ADMIN_VOUCHER_KEYS.list(filters),
    queryFn: () => adminCampaignService.getVouchers(filters),
    placeholderData: (previousData) => previousData,
  });

  // Query: Voucher KPI Stats
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ADMIN_VOUCHER_KEYS.stats(),
    queryFn: () => adminCampaignService.getVoucherStats(),
  });

  // Mutation: Create Voucher
  const createMutation = useMutation({
    mutationFn: (payload: CreateVoucherPayload) => adminCampaignService.createVoucher(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_VOUCHER_KEYS.all });
    },
  });

  // Mutation: Update Voucher
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateVoucherPayload }) =>
      adminCampaignService.updateVoucher(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_VOUCHER_KEYS.all });
    },
  });

  // Mutation: Toggle Voucher Status
  const toggleStatusMutation = useMutation({
    mutationFn: (id: number | string) => adminCampaignService.toggleVoucherStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_VOUCHER_KEYS.all });
    },
  });

  // Mutation: Delete Voucher
  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => adminCampaignService.deleteVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_VOUCHER_KEYS.all });
    },
  });

  const rawList = (vouchersData as any)?.results || (vouchersData as any)?.data || [];
  const normalizedVouchers: AdminVoucher[] = (
    Array.isArray(rawList) ? rawList : []
  ).map((v: any) => ({
    id: Number(v.id || v.voucher_id) || 1,
    campaignId: v.campaignId || v.campaign_id || null,
    campaignName: v.campaignName || v.campaign_name || v.campaign?.name || null,
    code: v.code || '',
    title: v.title || '',
    description: v.description || '',
    voucherType: v.voucherType || v.voucher_type || 'discount',
    discountType: v.discountType || v.discount_type || 'percentage',
    discountValue: Number(v.discountValue ?? v.discount_value) || 0,
    minOrderValue: Number(v.minOrderValue ?? v.min_order_value) || 0,
    maxDiscountValue: v.maxDiscountValue !== undefined ? v.maxDiscountValue : (v.max_discount_value ? Number(v.max_discount_value) : null),
    validFrom: v.validFrom || v.valid_from || null,
    validUntil: v.validUntil || v.valid_until || null,
    systemLimit: v.systemLimit !== undefined ? v.systemLimit : (v.system_limit ? Number(v.system_limit) : null),
    usageLimit: v.usageLimit !== undefined ? v.usageLimit : (v.usage_limit ? Number(v.usage_limit) : null),
    limitPerUser: Number(v.limitPerUser ?? v.limit_per_user) || 1,
    usedCount: Number(v.usedCount ?? v.used_count) || 0,
    isActive: Boolean(v.isActive ?? v.is_active),
    createdAt: v.createdAt || v.created_at || '',
    updatedAt: v.updatedAt || v.updated_at || '',
  }));

  return {
    vouchers: normalizedVouchers,
    pagination: {
      page: vouchersData?.page || 1,
      totalPages: vouchersData?.totalPages || 1,
      totalResults: vouchersData?.totalResults || normalizedVouchers.length,
    },
    stats: statsData,
    filters,
    setFilters,
    isLoading,
    isStatsLoading,
    isError,
    error,
    refetch,
    createVoucher: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateVoucher: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    toggleVoucherStatus: toggleStatusMutation.mutateAsync,
    isToggling: toggleStatusMutation.isPending,
    deleteVoucher: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
