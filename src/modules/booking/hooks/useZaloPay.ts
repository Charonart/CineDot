import { useMutation, useQuery } from '@tanstack/react-query';
import { paymentService, CreateZaloPayOrderRequest, CheckZaloPayStatusRequest } from '../services/payment.service';

// Key factory for ZaloPay
export const zaloPayKeys = {
  all: ['zaloPay'] as const,
  status: (appTransId: string) => [...zaloPayKeys.all, 'status', appTransId] as const,
};

export const useCreateZaloPayOrder = () => {
  return useMutation({
    mutationFn: (data: CreateZaloPayOrderRequest) => paymentService.createZaloPayOrder(data),
  });
};

export const useCheckZaloPayStatus = (request: CheckZaloPayStatusRequest, options?: { enabled?: boolean; refetchInterval?: number }) => {
  return useQuery({
    queryKey: zaloPayKeys.status(request.app_trans_id),
    queryFn: () => paymentService.checkZaloPayStatus(request),
    enabled: options?.enabled ?? !!request.app_trans_id,
    refetchInterval: options?.refetchInterval,
  });
};
