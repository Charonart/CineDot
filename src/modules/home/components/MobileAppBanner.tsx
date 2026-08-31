'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Zap, Gift, Bell, Download, QrCode } from 'lucide-react';
import { QRCodeImage } from '@/shared/ui/QRCodeImage';

export const MobileAppBanner: React.FC = () => {
  return (
    <section className="relative w-full py-16 sm:py-20 bg-[#FAFAFB] overflow-hidden">
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="w-full rounded-[32px] bg-gradient-to-br from-[#1E1B4B] via-[#17153B] to-[#0F1026] border border-indigo-950 p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl flex flex-col lg:flex-row items-center justify-between gap-12 text-white">
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

          {/* Left Column: Content */}
          <div className="relative z-10 flex flex-col gap-6 max-w-xl text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <span className="px-3 py-1 rounded-full bg-[#7C6FE8]/20 border border-[#7C6FE8]/40 text-[#7C6FE8] text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                Ứng dụng di động CineDot
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Điện Ảnh Trong Tầm Tay, <br className="hidden sm:inline" />
              <span className="text-[#7C6FE8]">Đặt Vé Trong 30 Giây</span>
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Trải nghiệm ứng dụng đặt vé tiện lợi nhất: giữ chỗ đẹp tức thì, tích lũy điểm thưởng thành viên CineDot Star và nhận thông báo suất chiếu đặc biệt sớm nhất.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-left">
                <div className="w-8 h-8 rounded-xl bg-[#7C6FE8]/20 text-[#7C6FE8] flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">1 Chạm</h4>
                  <p className="text-[10px] text-gray-400">Chọn ghế siêu tốc</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-left">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Tích Điểm</h4>
                  <p className="text-[10px] text-gray-400">Đổi bắp nước 0Đ</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-left">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Nhắc Lịch</h4>
                  <p className="text-[10px] text-gray-400">Không lo trễ giờ</p>
                </div>
              </div>
            </div>

            {/* QR Code & Store Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 pt-4">
              {/* QR Container */}
              <div className="p-3 rounded-2xl bg-white text-slate-900 flex items-center gap-3 shadow-xl shrink-0">
                <div className="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center">
                  <QRCodeImage
                    value="https://cinedot.vn/app"
                    size={64}
                    alt="CineDot App Download QR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <QrCode className="w-3 h-3 text-[#7C6FE8]" /> Quét Mã QR
                  </p>
                  <p className="text-[10px] text-slate-500">Tải app iOS / Android</p>
                </div>
              </div>

              {/* Store Buttons */}
              <div className="flex sm:flex-col gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center gap-3 transition-all hover:scale-105 active:scale-95 cursor-pointer text-left"
                >
                  <Download className="w-4 h-4 text-[#7C6FE8]" />
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-gray-400">Tải trên</span>
                    <span className="block text-xs font-bold text-white">App Store</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center gap-3 transition-all hover:scale-105 active:scale-95 cursor-pointer text-left"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-gray-400">Có trên</span>
                    <span className="block text-xs font-bold text-white">Google Play</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Mockup */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
            className="relative z-10 shrink-0 flex justify-center items-center"
          >
            <div className="w-64 sm:w-72 aspect-[1/2] rounded-[44px] bg-gradient-to-b from-[#2B2748] to-[#12111E] p-3 border-4 border-white/15 shadow-[0_20px_60px_rgba(124,111,232,0.4)]">
              <div className="w-full h-full rounded-[34px] bg-[#0A0A10] p-4 flex flex-col justify-between overflow-hidden relative border border-white/10">
                <div className="w-24 h-4 bg-black rounded-b-xl mx-auto mb-2" />

                <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#7C6FE8] flex items-center justify-center font-extrabold text-2xl text-white shadow-[0_0_20px_rgba(124,111,232,0.8)]">
                    CD
                  </div>
                  <h4 className="font-extrabold text-base text-white">CineDot Mobile</h4>
                  <p className="text-[11px] text-gray-400">Trải nghiệm rạp chiếu chuẩn 5 sao</p>
                  <span className="px-3 py-1 rounded-full bg-[#7C6FE8]/20 border border-[#7C6FE8]/50 text-[#7C6FE8] text-[11px] font-bold">
                    GIẢM 20% VÉ ĐẦU TIÊN
                  </span>
                </div>

                <div className="w-full py-2.5 bg-[#7C6FE8] text-white text-xs font-bold rounded-xl text-center shadow-md">
                  MUA VÉ NGAY
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
