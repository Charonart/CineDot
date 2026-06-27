import { useQuery } from '@tanstack/react-query';
import { cinemasService } from '../services/cinemas.service';

export const cinemasKeys = {
  all: ['cinemas'] as const,
  lists: () => [...cinemasKeys.all, 'list'] as const,
  listParams: (params: Record<string, unknown>) => [...cinemasKeys.lists(), params] as const,
  detail: (slug: string) => [...cinemasKeys.all, 'detail', slug] as const,
  pricing: () => [...cinemasKeys.all, 'pricing'] as const,
};

export const useCinemas = (params?: { city?: string }) => {
  return useQuery({
    queryKey: cinemasKeys.listParams(params ?? {}),
    queryFn: () => cinemasService.getCinemas(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useCinema = (slug: string) => {
  return useQuery({
    queryKey: cinemasKeys.detail(slug),
    queryFn: () => cinemasService.getCinema(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const usePricing = () => {
  return useQuery({
    queryKey: cinemasKeys.pricing(),
    queryFn: () => cinemasService.getPricing(),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};
