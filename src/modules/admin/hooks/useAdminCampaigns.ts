import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCampaignService } from '../services/adminCampaign.service';
import {
  CreateCampaignPayload,
  UpdateCampaignPayload,
} from '../dto/adminCampaign.dto';
import { AdminCampaign, CampaignFilterParams } from '../types/adminCampaign.types';

export const ADMIN_CAMPAIGN_KEYS = {
  all: ['admin', 'campaigns'] as const,
  list: (params: CampaignFilterParams) => [...ADMIN_CAMPAIGN_KEYS.all, 'list', params] as const,
  stats: () => [...ADMIN_CAMPAIGN_KEYS.all, 'stats'] as const,
  detail: (id: number | string) => [...ADMIN_CAMPAIGN_KEYS.all, 'detail', id] as const,
  roi: (id: number | string) => [...ADMIN_CAMPAIGN_KEYS.all, 'roi', id] as const,
};

export function useAdminCampaigns(initialFilters: CampaignFilterParams = {}) {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<CampaignFilterParams>({
    page: 1,
    limit: 15,
    ...initialFilters,
  });

  // Query: Campaigns List
  const {
    data: campaignsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ADMIN_CAMPAIGN_KEYS.list(filters),
    queryFn: () => adminCampaignService.getCampaigns(filters),
    placeholderData: (previousData) => previousData,
  });

  // Query: Campaign KPI Stats
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ADMIN_CAMPAIGN_KEYS.stats(),
    queryFn: () => adminCampaignService.getCampaignStats(),
  });

  // Mutation: Create Campaign
  const createMutation = useMutation({
    mutationFn: (payload: CreateCampaignPayload) => adminCampaignService.createCampaign(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CAMPAIGN_KEYS.all });
    },
  });

  // Mutation: Update Campaign
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateCampaignPayload }) =>
      adminCampaignService.updateCampaign(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CAMPAIGN_KEYS.all });
    },
  });

  // Mutation: Toggle Campaign Status
  const toggleStatusMutation = useMutation({
    mutationFn: (id: number | string) => adminCampaignService.toggleCampaignStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CAMPAIGN_KEYS.all });
    },
  });

  // Mutation: Delete Campaign
  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => adminCampaignService.deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CAMPAIGN_KEYS.all });
    },
  });

  const rawList = (campaignsData as any)?.results || (campaignsData as any)?.data || [];
  const normalizedCampaigns: AdminCampaign[] = (
    Array.isArray(rawList) ? rawList : []
  ).map((c: any) => ({
    id: Number(c.id || c.campaign_id) || 1,
    name: c.name || '',
    description: c.description || '',
    budget: Number(c.budget ?? c.budget_amount) || 0,
    usedBudget: Number(c.usedBudget ?? c.used_budget) || 0,
    revenueGenerated: Number(c.revenueGenerated ?? c.revenue_generated) || 0,
    roiPercentage: Number(c.roiPercentage ?? c.roi_percentage) || 0,
    startDate: c.startDate || c.start_date || null,
    endDate: c.endDate || c.end_date || null,
    isActive: Boolean(c.isActive ?? c.is_active),
    vouchersCount: Number(c.vouchersCount ?? c.vouchers_count ?? c.vouchers?.length) || 0,
    bannersCount: Number(c.bannersCount ?? c.banners_count ?? c.banners?.length) || 0,
    createdAt: c.createdAt || c.created_at || '',
    updatedAt: c.updatedAt || c.updated_at || '',
  }));

  return {
    campaigns: normalizedCampaigns,
    pagination: {
      page: campaignsData?.page || 1,
      totalPages: campaignsData?.totalPages || 1,
      totalResults: campaignsData?.totalResults || normalizedCampaigns.length,
    },
    stats: statsData,
    filters,
    setFilters,
    isLoading,
    isStatsLoading,
    isError,
    error,
    refetch,
    createCampaign: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateCampaign: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    toggleCampaignStatus: toggleStatusMutation.mutateAsync,
    isToggling: toggleStatusMutation.isPending,
    deleteCampaign: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
