/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · genre: modern-minimal · theme: White Minimal · component: NotFound */
import React from 'react';
import Link from 'next/link';
import { Film, Home, Clapperboard, Compass, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center select-none bg-[#FAFAFB]">
      <div className="max-w-lg w-full flex flex-col items-center gap-6">
        {/* Animated Badge & Stylized 404 */}
        <div className="relative flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-[#EEECFB] border border-[#7C6FE8]/20 flex items-center justify-center text-[#7C6FE8] shadow-sm mb-4">
            <Film className="w-10 h-10 stroke-[1.5]" />
          </div>

          <span className="text-6xl sm:text-7xl font-black text-gray-950 tracking-tighter font-mono">
            4<span className="text-[#7C6FE8]">0</span>4
          </span>

          <div className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-black uppercase tracking-wider mt-2 border border-gray-200">
            Trang Không Tồn Tại
          </div>
        </div>

        {/* Messaging */}
        <div className="flex flex-col gap-2 max-w-md">
          <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight leading-snug">
            Suất Chiếu Này Chưa Được Khởi Chiếu
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
            Đường dẫn bạn đang tìm kiếm có thể đã bị dời đi, rạp đã thay đổi lịch chiếu hoặc liên kết không chính xác.
          </p>
        </div>

        {/* Quick Navigation Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm pt-2">
          <Link href="/" className="w-full sm:flex-1">
            <button
              type="button"
              className="w-full py-3 px-5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(124,111,232,0.3)] cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Về Trang Chủ</span>
            </button>
          </Link>

          <Link href="/movies" className="w-full sm:flex-1">
            <button
              type="button"
              className="w-full py-3 px-5 rounded-full bg-white border border-gray-200 hover:border-gray-300 text-gray-800 hover:text-gray-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Clapperboard className="w-4 h-4 text-[#7C6FE8]" />
              <span>Xem Phim Chiếu</span>
            </button>
          </Link>
        </div>

        {/* Popular Quick Links */}
        <div className="pt-6 border-t border-gray-200/70 w-full flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-gray-500">
          <Link href="/cinemas" className="hover:text-[#7C6FE8] transition-colors flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Hệ thống rạp</span>
          </Link>
          <span className="text-gray-300">•</span>
          <Link href="/events" className="hover:text-[#7C6FE8] transition-colors">
            Ưu đãi sự kiện
          </Link>
          <span className="text-gray-300">•</span>
          <Link href="/cinema-corner" className="hover:text-[#7C6FE8] transition-colors">
            Góc điện ảnh
          </Link>
        </div>
      </div>
    </div>
  );
}

