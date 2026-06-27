import { NextResponse } from 'next/server';
import crypto from 'crypto';

const config = {
  app_id: '2553',
  key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
  key2: 'kLtgPl8YESVjq4kjk11wSN0EKxjkBszV',
  endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, app_user = 'CineDotUser', description = 'Thanh toán đặt vé CineDot' } = body;

    const embed_data = {
      preferred_payment_method: [],
      // Optional: Add redirecturl so ZaloPay redirects back after payment
      redirecturl: 'http://localhost:3000/booking/payment/zalopay-return'
    };

    const items: any[] = [];

    const transID = Math.floor(Math.random() * 1000000);
    const date = new Date();
    const yy = String(date.getFullYear()).slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const app_trans_id = `${yy}${mm}${dd}_${transID}`;
    const app_time = date.getTime();

    const order = {
      app_id: config.app_id,
      app_trans_id: app_trans_id,
      app_user: app_user,
      app_time: app_time,
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: amount,
      description: description,
      bank_code: '',
      mac: '',
    };

    // app_id|app_trans_id|app_user|amount|app_time|embed_data|item
    const data =
      config.app_id +
      '|' +
      order.app_trans_id +
      '|' +
      order.app_user +
      '|' +
      order.amount +
      '|' +
      order.app_time +
      '|' +
      order.embed_data +
      '|' +
      order.item;

    order.mac = crypto.createHmac('sha256', config.key1).update(data).digest('hex');

    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(
        Object.entries(order).map(([key, value]) => [key, String(value)])
      ).toString(),
    });

    const result = await response.json();
    console.log('ZaloPay Result:', result);
    
    return NextResponse.json({
      success: result.return_code === 1,
      order_url: result.order_url,
      app_trans_id: order.app_trans_id,
      message: result.return_message,
      ...result
    });
  } catch (error: any) {
    console.error('ZaloPay Create Order Error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
