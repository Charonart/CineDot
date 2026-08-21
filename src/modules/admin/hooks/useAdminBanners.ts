import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCampaignService } from '../services/adminCampaign.service';
import {
  CreateBannerPayload,
  UpdateBannerPayload,
} from '../dto/adminCampaign.dto';
import { AdminBanner, BannerFilterParams } from '../types/adminCampaign.types';

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

  const rawList = (bannersData as any)?.results || (bannersData as any)?.data || [];
  const normalizedBanners: AdminBanner[] = (
    Array.isArray(rawList) ? rawList : []
  ).map((b: any) => ({
    id: Number(b.id || b.banner_id) || 1,
    campaignId: b.campaignId || b.campaign_id || null,
    campaignName: b.campaignName || b.campaign_name || b.campaign?.name || null,
    title: b.title || '',
    imageUrl: b.imageUrl || b.image_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80',
    linkUrl: b.linkUrl || b.link_url || '',
    order: Number(b.order) || 0,
    isActive: Boolean(b.isActive ?? b.is_active),
    createdAt: b.createdAt || b.created_at || '',
    updatedAt: b.updatedAt || b.updated_at || '',
  }));

  return {
    banners: normalizedBanners,
    pagination: {
      page: bannersData?.page || 1,
      totalPages: bannersData?.totalPages || 1,
      totalResults: bannersData?.totalResults || normalizedBanners.length,
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
