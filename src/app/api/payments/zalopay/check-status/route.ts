import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { app_trans_id } = body;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Always return success for mock
    return NextResponse.json({
      success: true,
      return_code: 1,
      return_message: 'Thanh toán thành công',
      is_processing: false,
      amount: 50000,
      zptransid: Math.floor(Math.random() * 10000000)
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
