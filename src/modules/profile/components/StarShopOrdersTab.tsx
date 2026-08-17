'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, QrCode, MapPin, Clock, CheckCircle2, X, Copy } from 'lucide-react';
import { StarShopOrderItem } from '../types/profile.types';

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
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-[#7C6FE8]" />
          <h2 className="text-xl font-extrabold text-slate-900">
            Đơn Hàng Của Bạn ({orders.length})
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              filter === 'ALL'
                ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/30'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất Cả
          </button>
          <button
            onClick={() => setFilter('WAITING_PICKUP')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              filter === 'WAITING_PICKUP'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🟢 Chờ Nhận Tại Rạp
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              filter === 'COMPLETED'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ✅ Đã Nhận
          </button>
        </div>
      </div>

      {/* Orders List Grid */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-3xl border border-gray-100 flex flex-col items-center justify-center gap-2">
          <ShoppingBag className="w-10 h-10 stroke-[1.5] text-slate-300" />
          <p className="text-sm font-semibold">Chưa có đơn hàng nào trong mục này</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.orderId}
              className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col gap-4 hover:border-purple-200 transition-colors"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-sm text-[#7C6FE8] font-mono">
                    Mã đơn: #{order.orderId}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">| {order.orderDate}</span>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase w-fit ${
                    order.status === 'WAITING_PICKUP'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {order.status === 'WAITING_PICKUP' ? '🟢 Chờ nhận tại quầy rạp' : '✅ Đã hoàn tất'}
                </span>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-100"
                    />
                    <div className="flex flex-col flex-1">
                      <h4 className="font-extrabold text-xs text-slate-800 line-clamp-1">
                        {item.name}
                      </h4>
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

              {/* Order Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <MapPin className="w-4 h-4 text-[#7C6FE8] shrink-0" />
                  <span>Nhận tại: <strong>{order.cinemaName}</strong></span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-slate-400 font-bold uppercase">Tổng tiền:</span>
                    <span className="text-lg font-extrabold text-[#7C6FE8]">
                      {order.totalAmount.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  {order.status === 'WAITING_PICKUP' && (
                    <button
                      onClick={() => setSelectedQrOrder(order)}
                      className="px-4 py-2 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>XEM MÃ QR CODE</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Modal */}
      <AnimatePresence>
        {selectedQrOrder && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedQrOrder(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 border border-gray-100 flex flex-col items-center gap-4 text-center"
            >
              <button
                onClick={() => setSelectedQrOrder(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider">
                Mã Đơn Hàng #{selectedQrOrder.orderId}
              </span>

              <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-md">
                <img
                  src={selectedQrOrder.qrCodeUrl}
                  alt="QR Code nhận hàng"
                  className="w-44 h-44 object-contain"
                />
              </div>

              <div className="flex flex-col gap-1 text-slate-700 text-xs">
                <span className="font-extrabold text-slate-900">{selectedQrOrder.cinemaName}</span>
                <span className="text-slate-500">Đưa mã QR này cho nhân viên quầy rạp để quét nhận vật phẩm</span>
              </div>

              <button
                onClick={() => handleCopyCode(selectedQrOrder.orderId)}
                className="w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#7C6FE8] font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Đã sao chép mã đơn!' : 'Sao chép mã đơn hàng'}</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
