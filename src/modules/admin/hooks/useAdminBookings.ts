import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminBookingService } from '../services/adminBooking.service';
import { GetAdminBookingsParams } from '../dto/adminBooking.dto';
import { AdminBookingItem } from '../types/adminBooking.types';

export const adminBookingKeys = {
  all: ['admin', 'bookings'] as const,
  list: (params?: GetAdminBookingsParams) => [...adminBookingKeys.all, 'list', params] as const,
  stats: () => [...adminBookingKeys.all, 'stats'] as const,
  detail: (id: number | string) => [...adminBookingKeys.all, 'detail', id] as const,
};

export function useAdminBookings(params?: GetAdminBookingsParams, selectedBookingId?: number | string | null) {
  const queryClient = useQueryClient();

  // 1. Fetch Bookings List
  const bookingsQuery = useQuery({
    queryKey: adminBookingKeys.list(params),
    queryFn: () => adminBookingService.getBookings(params),
    staleTime: 30 * 1000,
  });

  const bookingsList: AdminBookingItem[] = bookingsQuery.data?.items || [];
  const pagination = bookingsQuery.data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    perPage: 15,
  };

  // 2. Fetch Stats
  const statsQuery = useQuery({
    queryKey: adminBookingKeys.stats(),
    queryFn: () => adminBookingService.getBookingStats(),
    staleTime: 60 * 1000,
  });

  const stats = statsQuery.data || {
    totalBookings: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    totalCheckedIn: 0,
    totalRefunded: 0,
    checkInRate: 0,
  };

  // 3. Fetch Detail if requested
  const bookingDetailQuery = useQuery({
    queryKey: adminBookingKeys.detail(selectedBookingId || 0),
    queryFn: () => adminBookingService.getBookingDetail(selectedBookingId!),
    enabled: Boolean(selectedBookingId),
    staleTime: 60 * 1000,
  });

  const currentBookingDetail = bookingDetailQuery.data || null;

  // 4. Refund Mutation
  const refundMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number | string; reason: string }) =>
      adminBookingService.refundBooking(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminBookingKeys.all });
      queryClient.invalidateQueries({ queryKey: adminBookingKeys.detail(variables.id) });
    },
  });

  return {
    bookingsList,
    pagination,
    isLoadingBookings: bookingsQuery.isLoading,
    isFetchingBookings: bookingsQuery.isFetching,
    refetchBookings: bookingsQuery.refetch,

    stats,
    isLoadingStats: statsQuery.isLoading,

    currentBookingDetail,
    isLoadingDetail: bookingDetailQuery.isLoading,

    refundBooking: refundMutation.mutateAsync,
    isRefunding: refundMutation.isPending,
  };
}
