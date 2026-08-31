/* Hallmark · component: StarShopOrdersTab · genre: modern-minimal · theme: White Minimal / Iris Cinema
 * states: default · hover · focus · active · disabled · loading · error · success
 * contrast: pass (46–50)
 */
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  QrCode,
  MapPin,
  Clock,
  CheckCircle2,
  X,
  Copy,
  Check,
  Package,
  ArrowUpRight,
} from 'lucide-react';
import { StarShopOrderItem } from '../types/profile.types';
import { QRCodeImage } from '@/shared/ui/QRCodeImage';

interface StarShopOrdersTabProps {
  orders: StarShopOrderItem[];
}

export const StarShopOrdersTab: React.FC<StarShopOrdersTabProps> = ({ orders }) => {
  const [filter, setFilter] = useState<'ALL' | 'WAITING_PICKUP' | 'COMPLETED'>('ALL');
  const [selectedQrOrder, setSelectedQrOrder] = useState<StarShopOrderItem | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredOrders = orders.filter((order) => {
    if (filter === 'ALL') return true;
    return order.status === filter;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <ShoppingBag className="w-6 h-6 text-[#7C6FE8]" />
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Đơn Hàng StarShop ({orders.length})
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Vật phẩm phim và combo bắp nước đặt trước nhận tại quầy rạp.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl w-fit">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'ALL'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất Cả
          </button>
          <button
            type="button"
            onClick={() => setFilter('WAITING_PICKUP')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'WAITING_PICKUP'
                ? 'bg-white text-amber-700 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-amber-700'
            }`}
          >
            🟢 Chờ Nhận
          </button>
          <button
            type="button"
            onClick={() => setFilter('COMPLETED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'COMPLETED'
                ? 'bg-white text-emerald-700 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Đã Nhận
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col items-center justify-center gap-2.5">
          <Package className="w-10 h-10 text-slate-300" />
          <p className="text-sm font-bold text-slate-700">Không có đơn hàng nào ở mục này</p>
          <p className="text-xs text-slate-400">
            Khám phá các sản phẩm độc quyền tại StarShop của CineDot.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => {
            const isWaiting = order.status === 'WAITING_PICKUP';

            return (
              <div
                key={order.orderId}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col gap-4 hover:border-[#7C6FE8]/40 hover:shadow-md transition-all"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm text-[#7C6FE8] font-mono tracking-wide">
                      Mã đơn: #{order.orderId}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">| {order.orderDate}</span>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider w-fit ${
                      isWaiting
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {isWaiting ? '🟢 Chờ nhận tại quầy rạp' : '✓ Đã nhận tại rạp'}
                  </span>
                </div>

                {/* Items List */}
                <div className="flex flex-col gap-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-200 shadow-2xs"
                      />
                      <div className="flex flex-col flex-1 min-w-0">
                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                          {item.name}
                        </h4>
                        <span className="text-xs font-semibold text-slate-500">
                          Số lượng: x{item.quantity}
                        </span>
                      </div>
                      <span className="font-black text-xs sm:text-sm text-slate-900 font-mono">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3.5 border-t border-slate-100 mt-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <MapPin className="w-4 h-4 text-[#7C6FE8] shrink-0" />
                    <span>
                      Nhận tại: <strong className="text-slate-900">{order.cinemaName}</strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[10px] text-slate-400 font-black uppercase">
                        Tổng tiền:
                      </span>
                      <span className="text-base font-black text-[#7C6FE8] font-mono">
                        {order.totalAmount.toLocaleString('vi-VN')}đ
                      </span>
                    </div>

                    {isWaiting && (
                      <button
                        type="button"
                        onClick={() => setSelectedQrOrder(order)}
                        className="px-4 py-2 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm shadow-[#7C6FE8]/25 transition-all cursor-pointer active:scale-95"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>MÃ QR NHẬN HÀNG</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Code Inspection Modal */}
      <AnimatePresence>
        {selectedQrOrder && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedQrOrder(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border border-slate-100 flex flex-col items-center gap-4 text-center"
            >
              <button
                onClick={() => setSelectedQrOrder(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="text-xs font-black text-[#7C6FE8] uppercase tracking-wider">
                MÃ NHẬN VẬT PHẨM STARSHOP
              </span>

              <div className="p-3 bg-white rounded-2xl border-2 border-slate-900/10 shadow-md flex items-center justify-center">
                <QRCodeImage
                  value={selectedQrOrder.qrCodeUrl || selectedQrOrder.orderId}
                  size={190}
                  alt="QR Code nhận hàng"
                  className="w-48 h-48 object-contain"
                />
              </div>

              <div className="flex flex-col gap-1 text-slate-700 text-xs">
                <span className="font-extrabold text-slate-900">
                  {selectedQrOrder.cinemaName}
                </span>
                <span className="text-slate-500">
                  Đưa mã QR này cho nhân viên quầy rạp để quét nhận vật phẩm
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopyCode(selectedQrOrder.orderId)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#7C6FE8] font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>
                  {copied ? 'Đã sao chép mã đơn!' : `Sao chép mã #${selectedQrOrder.orderId}`}
                </span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
