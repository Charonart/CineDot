import axios from 'axios';

export type CreateZaloPayOrderRequest = {
  amount: number;
  description?: string;
  app_user?: string;
  embed_data?: string;
  items?: any[];
};

export type CreateZaloPayOrderResponse = {
  success: boolean;
  order_url?: string;
  app_trans_id?: string;
  message?: string;
  [key: string]: any;
};

export type CheckZaloPayStatusRequest = {
  app_trans_id: string;
};

export type CheckZaloPayStatusResponse = {
  success: boolean;
  return_code: number;
  return_message: string;
  is_processing: boolean;
  amount: number;
  zptransid: number;
  [key: string]: any;
};

export const paymentService = {
  async createZaloPayOrder(data: CreateZaloPayOrderRequest): Promise<CreateZaloPayOrderResponse> {
    const response = await axios.post('/api/payments/zalopay/create', data);
    return response.data;
  },

  async checkZaloPayStatus(data: CheckZaloPayStatusRequest): Promise<CheckZaloPayStatusResponse> {
    const response = await axios.post('/api/payments/zalopay/check-status', data);
    return response.data;
  },
};
