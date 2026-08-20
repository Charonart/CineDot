import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCampaignService } from '../services/adminCampaign.service';
import {
  CreateBannerPayload,
  UpdateBannerPayload,
} from '../dto/adminCampaign.dto';
import { BannerFilterParams } from '../types/adminCampaign.types';

export const ADMIN_BANNER_KEYS = {
  all: ['admin', 'banners'] as const,
  list: (params: BannerFilterParams) => [...ADMIN_BANNER_KEYS.all, 'list', params] as const,
  detail: (id: number | string) => [...ADMIN_BANNER_KEYS.all, 'detail', id] as const,
};

export function useAdminBanners(initialFilters: BannerFilterParams = {}) {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<BannerFilterParams>({
    page: 1,
    limit: 15,
    ...initialFilters,
  });

  // Query: Banners List
  const {
    data: bannersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ADMIN_BANNER_KEYS.list(filters),
    queryFn: () => adminCampaignService.getBanners(filters),
    placeholderData: (previousData) => previousData,
  });

  // Mutation: Create Banner
  const createMutation = useMutation({
    mutationFn: (payload: CreateBannerPayload) => adminCampaignService.createBanner(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BANNER_KEYS.all });
    },
  });

  // Mutation: Update Banner
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateBannerPayload }) =>
      adminCampaignService.updateBanner(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BANNER_KEYS.all });
    },
  });

  // Mutation: Toggle Banner Status
  const toggleStatusMutation = useMutation({
    mutationFn: (id: number | string) => adminCampaignService.toggleBannerStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BANNER_KEYS.all });
    },
  });

  // Mutation: Delete Banner
  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => adminCampaignService.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BANNER_KEYS.all });
    },
  });

  return {
    banners: bannersData?.results || [],
    pagination: {
      page: bannersData?.page || 1,
      totalPages: bannersData?.totalPages || 1,
      totalResults: bannersData?.totalResults || 0,
    },
    filters,
    setFilters,
    isLoading,
    isError,
    error,
    refetch,
    createBanner: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateBanner: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    toggleBannerStatus: toggleStatusMutation.mutateAsync,
    isToggling: toggleStatusMutation.isPending,
    deleteBanner: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
