'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchPersonDetail } from '../services/person.service';

export function usePersonDetail(id: number | string) {
  const { data: person, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['person', id],
    queryFn: () => fetchPersonDetail(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });

  return {
    person,
    loading: isLoading,
    isError,
    error,
    refetch,
  };
}
