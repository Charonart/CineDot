'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, ShoppingBag, ArrowRight, ArrowLeft, MapPin, Clock, QrCode, Sparkles } from 'lucide-react';
import { QRCodeImage } from '@/shared/ui/QRCodeImage';

export interface PurchasedItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface StarShopSuccessClientPageProps {
  orderId?: string;
  totalAmount?: number;
  cinemaName?: string;
  purchasedItems?: PurchasedItem[];
}

export function StarShopSuccessClientPage({
  orderId = 'ST-892104',
  totalAmount = 4790000,
  cinemaName = 'Galaxy CineX Hanoi Centre',
  purchasedItems,
}: StarShopSuccessClientPageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dynamic purchased items list or fallback defaults
  const items: PurchasedItem[] = purchasedItems && purchasedItems.length > 0 ? purchasedItems : [
    {
      name: 'Mô Hình Người Nhện Hot Toys 1:6 Limited Edition',
      quantity: 1,
      price: 4500000,
      image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Cốc Đổi Màu Venom 3D Heat-Changing Tumbler 700ml',
      quantity: 1,
      price: 290000,
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="w-full flex flex-col font-sans bg-[#F6F6F6] text-[#131413] min-h-screen pt-28 pb-20 selection:bg-[#7C6FE8] selection:text-white">
      <main className="w-full">
        <div className="max-w-[760px] mx-auto px-4 sm:px-6">
          {/* Top Success Badge Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-center gap-3 mb-8"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="flex items-center gap-1.5 text-[#7C6FE8] font-extrabold text-xs">
              <Sparkles className="w-4 h-4 fill-[#7C6FE8]" />
              <span>GIAO DỊCH STAR SHOP HOÀN TẤT</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              ĐẶT ĐƠN HÀNG THÀNH CÔNG!
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md">
              Cảm ơn bạn đã mua sắm tại CineDot Star Shop. Đơn hàng của bạn đã được xác nhận và sẵn sàng nhận tại rạp.
            </p>
          </motion.div>

          {/* Main Order Card */}
          <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col gap-6 mb-8">
            {/* Order ID & Copy Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#7C6FE8]" />
                <span className="text-xs font-extrabold">Mã Đơn Hàng:</span>
                <span className="text-sm font-extrabold text-[#7C6FE8] font-mono tracking-wider">
                  {orderId}
                </span>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-[#7C6FE8] font-extrabold text-xs border border-purple-200 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Đã sao chép!' : 'Sao chép mã'}</span>
              </button>
            </div>

            {/* QR Code Pickup Showcase */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-gray-100 gap-3 text-center">
              <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-[#7C6FE8]" />
                <span>MÃ QR CODE QUÉT NHẬN HÀNG TẠI QUẦY RẠP</span>
              </span>

              {/* Mock QR Code Display */}
              <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-md flex items-center justify-center">
                <QRCodeImage
                  value={orderId}
                  size={150}
                  alt="Mã QR nhận hàng"
                  className="w-36 h-36 object-contain"
                />
              </div>

              <p className="text-[11px] text-slate-500 font-medium">
                Vui lòng đưa màn hình mã QR này cho nhân viên quầy Star Shop tại rạp để quét nhận vật phẩm.
              </p>
            </div>

            {/* Pickup Location & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#7C6FE8] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-extrabold text-slate-900">Địa điểm nhận hàng:</span>
                  <span className="text-slate-600 font-bold">{cinemaName}</span>
                  <span className="text-slate-500 text-[11px]">Quầy Star Shop Tầng 3</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100 flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#7C6FE8] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-extrabold text-slate-900">Thời gian lấy hàng:</span>
                  <span className="text-slate-600 font-bold">Trong vòng 7 ngày</span>
                  <span className="text-slate-500 text-[11px]">Khung giờ: 08:00 - 22:00 hàng ngày</span>
                </div>
              </div>
            </div>

            {/* Itemized Purchased List */}
            <div className="flex flex-col gap-3 pt-2">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Vật Phẩm Trong Đơn Hàng ({items.length})
              </span>

              <div className="flex flex-col gap-3 divide-y divide-gray-100">
                {items.map((item, idx) => (
                  <div key={idx} className="pt-3 flex items-center gap-3.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-100"
                    />
                    <div className="flex flex-col flex-1">
                      <span className="font-extrabold text-xs text-slate-800 line-clamp-1">
                        {item.name}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        Số lượng: x{item.quantity}
                      </span>
                    </div>
                    <span className="font-extrabold text-xs text-[#7C6FE8]">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Amount Line */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                TỔNG ĐÃ THANH TOÁN
              </span>
              <span className="text-2xl font-extrabold text-[#7C6FE8]">
                {totalAmount.toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/profile?tab=my-orders">
              <button className="w-full py-4 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#7C6FE8]/30 transition-all cursor-pointer">
                <span>XEM ĐƠN HÀNG TRONG PROFILE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <Link href="/star-shop#products">
              <button className="w-full py-4 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-gray-200 transition-all cursor-pointer">
                <ArrowLeft className="w-4 h-4 text-[#7C6FE8]" />
                <span>TIẾP TỤC MUA SẮM STAR SHOP</span>
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
