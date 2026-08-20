import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCampaignService } from '../services/adminCampaign.service';
import {
  CreateVoucherPayload,
  UpdateVoucherPayload,
} from '../dto/adminCampaign.dto';
import { VoucherFilterParams } from '../types/adminCampaign.types';

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

  return {
    vouchers: vouchersData?.results || [],
    pagination: {
      page: vouchersData?.page || 1,
      totalPages: vouchersData?.totalPages || 1,
      totalResults: vouchersData?.totalResults || 0,
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
