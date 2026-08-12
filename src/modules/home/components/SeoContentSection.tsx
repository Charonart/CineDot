'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Building2, Users, Tv } from 'lucide-react';

export const SeoContentSection: React.FC = () => {
  return (
    <section className="w-full py-16 bg-[#FEFEFE]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        <div className="p-8 sm:p-12 rounded-[32px] bg-gradient-to-br from-[#F1EDFF] via-[#E8E3FF]/60 to-white border border-[#7C6FE8]/30 shadow-[0_20px_60px_rgba(124,111,232,0.16)] relative overflow-hidden text-slate-800">
          {/* Ambient Purple Glow Accents */}
          <div className="w-80 h-80 rounded-full bg-[#7C6FE8]/20 blur-3xl absolute -top-16 -left-16 pointer-events-none" />
          <div className="w-64 h-64 rounded-full bg-[#7C6FE8]/15 blur-3xl absolute -bottom-12 -right-12 pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between gap-4 mb-6 border-b border-[#7C6FE8]/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-[#7C6FE8] rounded-full shadow-[0_0_14px_rgba(124,111,232,0.6)]" />
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 uppercase">
                CINEDOT - HỆ THỐNG ĐẶT VÉ XEM PHIM TRỰC TUYẾN & TRẢI NGHIỆM ĐIỆN ẢNH ĐẮNG CẤP
              </h2>
            </div>
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-extrabold text-[#7C6FE8] uppercase bg-white/90 px-3.5 py-1.5 rounded-full border border-[#7C6FE8]/30 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#7C6FE8]" />
              <span>CineDot Official</span>
            </span>
          </div>

          {/* SEO Text Content */}
          <div className="relative z-10 flex flex-col gap-4 text-xs sm:text-sm text-slate-700 leading-relaxed text-justify font-medium">
            <p>
              <strong className="text-slate-900 font-extrabold">CineDot</strong> là hệ thống rạp chiếu phim hiện đại hàng đầu Việt Nam, mang tới trải nghiệm giải trí điện ảnh đẳng cấp quốc tế với các phòng chiếu tiêu chuẩn <strong className="text-[#7C6FE8] font-black">IMAX 3D</strong>, <strong className="text-[#7C6FE8] font-black">4DX</strong> và âm thanh vòm sống động <strong className="text-[#7C6FE8] font-black">Dolby Atmos</strong>.
            </p>

            <p>
              Với giao diện website và ứng dụng di động thông minh, khán giả có thể dễ dàng tra cứu lịch chiếu phim mới nhất, xem trailer chất lượng cao, chọn vị trí ghế đẹp thời gian thực và mua vé trực tuyến chỉ trong vài thao tác đơn giản. Hệ thống hỗ trợ đa dạng phương thức thanh toán an toàn như Ví MoMo, ZaloPay, VNPAY-QR và các loại thẻ ngân hàng nội địa / quốc tế.
            </p>

            <p>
              Bên cạnh dịch vụ đặt vé phim, CineDot còn mang tới chuỗi cửa hàng <strong className="text-slate-900 font-extrabold">Star Shop</strong> độc quyền với các sản phẩm quà tặng, mô hình điện ảnh chính hãng cùng menu bắp nước đa dạng phong phú. Hãy đăng ký ngay tài khoản hội viên <strong className="text-[#7C6FE8] font-black">CineDot Star</strong> để tận hưởng ưu đãi tích điểm 10%, vé xem phim miễn phí cùng nhiều quà tặng sinh nhật bất ngờ!
            </p>

            {/* Compelling Brand Story Lead */}
            <p className="pt-3 border-t border-[#7C6FE8]/20 text-slate-900 font-extrabold">
              Bạn muốn tìm hiểu thêm về hành trình sáng lập, sứ mệnh mang điện ảnh công nghệ đỉnh cao chuẩn Hollywood và khám phá hệ thống kiến trúc phòng chiếu 5 sao của chúng tôi?
            </p>
          </div>

          {/* Integrated Stat Counters & CTA Button Footer */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-[#7C6FE8]/20 mt-6">
            {/* Quick Stat Counters */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full sm:w-auto">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#7C6FE8]/25 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#7C6FE8]/15 text-[#7C6FE8] flex items-center justify-center shrink-0 font-black">
                  <Building2 className="w-5 h-5 text-[#7C6FE8]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-extrabold text-slate-900 leading-none">50+</span>
                  <span className="text-[10px] font-bold text-slate-600 mt-0.5">Cụm rạp</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#7C6FE8]/25 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#7C6FE8]/15 text-[#7C6FE8] flex items-center justify-center shrink-0 font-black">
                  <Users className="w-5 h-5 text-[#7C6FE8]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-extrabold text-slate-900 leading-none">10M+</span>
                  <span className="text-[10px] font-bold text-slate-600 mt-0.5">Khách hàng</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#7C6FE8]/25 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#7C6FE8]/15 text-[#7C6FE8] flex items-center justify-center shrink-0 font-black">
                  <Tv className="w-5 h-5 text-[#7C6FE8]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-extrabold text-slate-900 leading-none">IMAX 4K</span>
                  <span className="text-[10px] font-bold text-slate-600 mt-0.5">Dual Laser</span>
                </div>
              </div>
            </div>

            {/* Direct CTA Link Button to /about */}
            <Link href="/about" className="w-full sm:w-auto shrink-0">
              <button className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#7C6FE8]/35 transition-all cursor-pointer">
                <span>TÌM HIỂU THÊM VỀ CINEDOT & FAQ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
