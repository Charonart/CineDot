'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, Tv, ArrowRight, Award } from 'lucide-react';

export const SeoContentSection: React.FC = () => {
  return (
    <section className="relative w-full py-16 sm:py-20 bg-[#FAFAFB] border-t border-gray-200/80">
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-white border border-gray-200 shadow-sm text-gray-700">
          {/* Statement Header */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-[#7C6FE8] rounded-full" />
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-gray-950 uppercase">
                CineDot — Hệ Thống Đặt Vé & Trải Nghiệm Điện Ảnh Đỉnh Cao
              </h2>
            </div>
            <span className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-[#7C6FE8] uppercase bg-purple-50 border border-purple-100 px-3.5 py-1.5 rounded-full">
              Chuẩn Quốc Tế
            </span>
          </div>

          {/* Content Narrative */}
          <div className="relative z-10 flex flex-col gap-4 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
            <p>
              <strong className="text-gray-900 font-bold">CineDot</strong> là hệ thống rạp chiếu phim hiện đại hàng đầu Việt Nam, mang tới trải nghiệm giải trí điện ảnh đỉnh cao với các phòng chiếu tiêu chuẩn <strong className="text-[#7C6FE8]">IMAX 3D Laser</strong>, <strong className="text-[#7C6FE8]">4DX Dynamic</strong> và âm thanh vòm sống động <strong className="text-[#7C6FE8]">Dolby Atmos</strong>.
            </p>
            <p>
              Với giao diện đặt vé trực tuyến mượt mà và ứng dụng di động thông minh, khán giả có thể dễ dàng tra cứu lịch chiếu, xem trailer chất lượng cao, chọn ghế đẹp trong thời gian thực và thanh toán bảo mật chỉ trong tích tắc qua Ví MoMo, ZaloPay, VNPAY hoặc thẻ ngân hàng.
            </p>
            <p>
              Đăng ký tài khoản hội viên <strong className="text-gray-900 font-bold">CineDot Star</strong> ngay hôm nay để tích điểm đổi bắp nước miễn phí và nhận vé xem phim sinh nhật đặc biệt!
            </p>
          </div>

          {/* Proof Grid & Link to About */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-gray-100 mt-8">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200/70">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#7C6FE8] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-lg font-extrabold text-gray-900">50+</span>
                <span className="block text-[11px] text-gray-500">Cụm rạp toàn quốc</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200/70">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-lg font-extrabold text-gray-900">100%</span>
                <span className="block text-[11px] text-gray-500">Chuẩn Hollywood</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200/70">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-lg font-extrabold text-gray-900">4K Laser</span>
                <span className="block text-[11px] text-gray-500">Âm thanh Dolby 360°</span>
              </div>
            </div>

            <div className="flex items-center justify-center p-4 rounded-2xl bg-purple-50 border border-purple-200/80 hover:bg-purple-100 transition-all">
              <Link href="/about" className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#7C6FE8] hover:text-[#5d52c7] transition-colors">
                <span>Tìm hiểu thêm về CineDot</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
