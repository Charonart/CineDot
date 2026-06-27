import { NextResponse } from 'next/server';
import crypto from 'crypto';

const config = {
  app_id: '2553',
  key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
  key2: 'kLtgPl8YESVjq4kjk11wSN0EKxjkBszV',
  endpoint: 'https://sb-openapi.zalopay.vn/v2/query',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { app_trans_id } = body;

    if (!app_trans_id) {
      return NextResponse.json({ success: false, message: 'Missing app_trans_id' }, { status: 400 });
    }

    const postData = {
      app_id: config.app_id,
      app_trans_id: app_trans_id,
      mac: ''
    };

    const data = config.app_id + '|' + postData.app_trans_id + '|' + config.key1;
    postData.mac = crypto.createHmac('sha256', config.key1).update(data).digest('hex');

    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // x-www-form-urlencoded format
      body: new URLSearchParams(postData).toString(),
    });

    const result = await response.json();
    
    return NextResponse.json({
      success: result.return_code === 1,
      ...result
    });
  } catch (error: any) {
    console.error('ZaloPay Check Status Error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
