import { NextResponse } from 'next/server';
import crypto from 'crypto';
import axios from 'axios';

const config = {
  app_id: '2553',
  key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
  key2: 'kLtgPl8YESVjq4kjk11wSN0EKxjkBszV',
  endpoint: 'https://sb-openapi.zalopay.vn/v2/create'
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, description, app_user, embed_data: client_embed_data, items: client_items } = body;
    
    // Parse client embed_data if provided, then merge with redirecturl
    const parsedClientEmbed = client_embed_data ? JSON.parse(client_embed_data) : {};
    const embed_data = {
      ...parsedClientEmbed,
      redirecturl: 'http://localhost:3000/booking/payment/zalopay-return'
    };
    
    const items = client_items || [];
    const transID = Math.floor(Math.random() * 1000000);
    const date = new Date();
    const yy = String(date.getFullYear()).slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const app_trans_id = `${yy}${mm}${dd}_${transID}`;

    const order = {
      app_id: config.app_id,
      app_trans_id: app_trans_id,
      app_user: app_user || 'CineDot',
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: amount,
      description: description || `CineDot - Thanh toan don hang #${transID}`,
      bank_code: 'zalopayapp',
      mac: ''
    };

    const dataForMac = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = crypto.createHmac('sha256', config.key1).update(dataForMac).digest('hex');

    const result = await axios.post(config.endpoint, null, { params: order });

    if (result.data.return_code === 1) {
      return NextResponse.json({
        success: true,
        message: 'Order created',
        order_url: result.data.order_url,
        app_trans_id: app_trans_id
      });
    }

    return NextResponse.json(
      { success: false, message: result.data.return_message || 'ZaloPay Error' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('ZaloPay Create Error:', error.message);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
