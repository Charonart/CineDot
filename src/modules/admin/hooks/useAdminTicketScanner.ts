import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminTicketScannerService } from '../services/adminTicketScanner.service';
import { ScannedTicketDetail } from '../types/adminTicketScanner.types';

export const adminTicketScannerKeys = {
  all: ['admin', 'ticket-scanner'] as const,
  recentScans: () => [...adminTicketScannerKeys.all, 'recent'] as const,
};

export function useAdminTicketScanner() {
  const queryClient = useQueryClient();

  // 1. Fetch Recent Scans Feed
  const recentScansQuery = useQuery({
    queryKey: adminTicketScannerKeys.recentScans(),
    queryFn: () => adminTicketScannerService.getRecentScans(15),
    staleTime: 10 * 1000,
    refetchInterval: 15 * 1000, // Tự động làm mới mỗi 15s
  });

  const recentScans = recentScansQuery.data || [];

  // 2. Mutation Lookup Ticket (Verify Only - No check-in yet)
  const lookupTicketMutation = useMutation({
    mutationFn: (codeOrQr: string) => adminTicketScannerService.lookupTicket(codeOrQr),
  });

  // 3. Mutation Confirm Customer Entered (Check-In)
  const checkInTicketMutation = useMutation({
    mutationFn: (codeOrQr: string) => adminTicketScannerService.checkInTicket(codeOrQr),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminTicketScannerKeys.recentScans() });
    },
  });

  // 4. Mutation Claim F&B Combo
  const claimFnbMutation = useMutation({
    mutationFn: (bookingComboId: number) => adminTicketScannerService.claimFnb(bookingComboId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminTicketScannerKeys.recentScans() });
    },
  });

  return {
    recentScans,
    isLoadingRecent: recentScansQuery.isLoading,
    refetchRecent: recentScansQuery.refetch,

    lookupTicket: lookupTicketMutation.mutateAsync,
    isLookingUp: lookupTicketMutation.isPending,
    lookupError: lookupTicketMutation.error,

    checkInTicket: checkInTicketMutation.mutateAsync,
    isCheckingIn: checkInTicketMutation.isPending,
    checkInError: checkInTicketMutation.error,

    scanTicket: checkInTicketMutation.mutateAsync,
    isScanning: lookupTicketMutation.isPending || checkInTicketMutation.isPending,

    claimFnb: claimFnbMutation.mutateAsync,
    isClaimingFnb: claimFnbMutation.isPending,
  };
}
