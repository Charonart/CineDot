'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const MobileAppBanner: React.FC = () => {
  return (
    <section className="w-full py-16 bg-[var(--bg2)]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        <div className="w-full rounded-3xl bg-[#181825] text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Background Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Left Column: 3D Mobile Phone Mockup with Continuous Floating Animation */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="relative z-10 flex justify-center items-center shrink-0"
          >
            <div className="w-64 sm:w-72 aspect-[1/2] rounded-[40px] bg-gradient-to-b from-[#26213D] to-[#0F0F1A] p-3 border-4 border-white/20 shadow-[0_20px_50px_rgba(124,111,232,0.35)] transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-full rounded-[30px] bg-[#0B0C0B] p-4 flex flex-col justify-between overflow-hidden relative border border-white/10">
                {/* Phone Notch */}
                <div className="w-20 h-4 bg-black rounded-b-xl mx-auto mb-2" />

                <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#7C6FE8] flex items-center justify-center font-bold text-xl text-white shadow-lg">
                    CD
                  </div>
                  <h4 className="font-bold text-base text-white">CineDot App</h4>
                  <p className="text-[11px] text-gray-400">Đặt vé 1 chạm • Tích điểm nhận quà</p>
                  <span className="px-4 py-1.5 rounded-full bg-[#7C6FE8]/20 border border-[#7C6FE8]/40 text-[#7C6FE8] text-xs font-bold">
                    GIẢM 20% ĐƠN ĐẦU
                  </span>
                </div>

                <div className="w-full py-2 bg-[#7C6FE8] text-white text-xs font-bold rounded-xl text-center">
                  MUA VÉ NGAY
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: App Information & QR Code */}
          <div className="relative z-10 flex flex-col gap-6 max-w-xl text-center lg:text-left">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#7C6FE8] uppercase mb-2 block">
                ỨNG DỤNG DI ĐỘNG CINEDOT
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Đặt Vé Online - Không Lo Trễ Nải
              </h2>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">
              Trải nghiệm đặt vé nhanh chóng dưới 30 giây, chọn ghế đẹp tức thì, tích điểm đổi bắp nước miễn phí và nhận thông báo lịch chiếu phim hot sớm nhất.
            </p>

            {/* QR Code & Store Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
              {/* QR Code Box */}
              <div className="bg-white p-3 rounded-2xl flex items-center gap-3 shrink-0 shadow-lg text-slate-900">
                <div className="w-16 h-16 bg-slate-900 p-1.5 rounded-lg flex items-center justify-center">
                  <svg className="w-full h-full text-white fill-current" viewBox="0 0 24 24">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm8-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm13-2h3v2h-3v-2zm-3 3h2v3h-2v-3zm3 2h2v3h-2v-3z" />
                  </svg>
                </div>
                <div className="text-left text-xs font-medium">
                  <p className="font-bold text-slate-900">Quét mã QR</p>
                  <p className="text-gray-500 text-[10px]">Tải App iOS / Android</p>
                </div>
              </div>

              {/* Store Buttons */}
              <div className="flex sm:flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-xl flex items-center gap-3 transition-colors text-left"
                >
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-300">Download on</p>
                    <p className="text-xs font-bold text-white">App Store</p>
                  </div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-xl flex items-center gap-3 transition-colors text-left"
                >
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-300">Get it on</p>
                    <p className="text-xs font-bold text-white">Google Play</p>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
