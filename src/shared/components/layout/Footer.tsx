'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B0C0B] text-gray-400 py-16 border-t border-white/10 text-xs">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        {/* 5 Columns Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <Logo height={52} className="brightness-125" />
            <p className="text-xs text-gray-400 leading-relaxed">
              Hệ thống rạp chiếu phim hiện đại hàng đầu Việt Nam, mang đến trải nghiệm điện ảnh tuyệt vời nhất.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#7C6FE8] transition-colors">
                f
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#7C6FE8] transition-colors">
                ▶
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#7C6FE8] transition-colors">
                📷
              </a>
            </div>
          </div>

          {/* Col 2: Phim */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">PHIM</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/movies?category=now-showing" className="hover:text-white transition-colors">Phim đang chiếu</Link></li>
              <li><Link href="/movies?category=coming-soon" className="hover:text-white transition-colors">Phim sắp chiếu</Link></li>
              <li><Link href="/star-shop" className="hover:text-white transition-colors">Star Shop Cửa hàng</Link></li>
            </ul>
          </div>

          {/* Col 3: Hệ Thống Rạp */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">HỆ THỐNG RẠP</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/cinemas" className="hover:text-white transition-colors">Tất cả các rạp</Link></li>
              <li><Link href="/special-theaters" className="hover:text-white transition-colors">Rạp đặc biệt IMAX</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">Sự kiện & Khuyến mãi</Link></li>
            </ul>
          </div>

          {/* Col 4: Giới Thiệu & Hỗ Trợ */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">GIỚI THIỆU & HỖ TRỢ</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/about" className="hover:text-white text-[#7C6FE8] font-bold transition-colors">Về chúng tôi (About)</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Hỏi đáp & FAQ</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Liên hệ & Trụ sở</Link></li>
            </ul>
          </div>

          {/* Col 5: Tải App & Đã Thông Báo BCT */}
          <div className="flex flex-col gap-3 lg:items-end">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">TẢI ỨNG DỤNG</h4>
            <div className="flex flex-col gap-2 w-44">
              <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-left text-white transition-colors">
                <p className="text-[9px] uppercase text-gray-400">Download on</p>
                <p className="text-xs font-bold">App Store</p>
              </button>
              <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-left text-white transition-colors">
                <p className="text-[9px] uppercase text-gray-400">Get it on</p>
                <p className="text-xs font-bold">Google Play</p>
              </button>
            </div>
            {/* Ministry of Industry and Trade Badge */}
            <div className="pt-2">
              <span className="inline-block px-3 py-1 bg-blue-600/30 border border-blue-500/40 text-blue-300 text-[10px] font-bold rounded-md uppercase">
                ✓ Đã Thông Báo BCT
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-500 text-[11px]">
          <p>© 2026 CineDot. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-gray-300 transition-colors">Về CineDot</Link>
            <Link href="/about" className="hover:text-gray-300 transition-colors">Quyền riêng tư</Link>
            <Link href="/about" className="hover:text-gray-300 transition-colors">Điều khoản</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
