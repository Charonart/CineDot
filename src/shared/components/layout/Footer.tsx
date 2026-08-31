'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import {
  Film,
  Sparkles,
  ShieldCheck,
  Headphones,
  Mail,
  ArrowRight,
  CheckCircle2,
  Smartphone,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="bg-[#0A0B10] text-slate-400 pt-16 pb-12 border-t border-white/10 text-xs selection:bg-[#7C6FE8] selection:text-white relative overflow-hidden">
      {/* Subtle atmospheric gradient orb in background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#7C6FE8]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 1. Hallmark Ft5 Statement Header + VIP Newsletter */}
        <div className="pb-12 border-b border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <Logo height={52} variant="light" />

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-2xl font-sans">
              Điện ảnh chạm cảm xúc — Từng khoảnh khắc thăng hoa tại CineDot.
            </h2>

            <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
              Hệ thống rạp chiếu phim hiện đại chuẩn quốc tế với phòng chiếu IMAX Laser, âm thanh Dolby Atmos và dịch vụ thành viên StarClub độc quyền.
            </p>
          </div>

          {/* VIP Screening Newsletter Box */}
          <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-3xl p-5 border border-white/10 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-xs">
              <Sparkles className="w-4 h-4 text-[#7C6FE8]" />
              <span>Đăng Ký Nhận Bản Tin Suất Chiếu Sớm</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Nhận thông báo lịch chiếu sớm, ưu đãi thành viên và các sự kiện điện ảnh độc quyền.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Đã đăng ký thành công! Thông tin sẽ gửi tới email của bạn.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn..."
                    className="w-full pl-10 pr-3 py-2.5 bg-black/40 border border-white/15 focus:border-[#7C6FE8] text-xs text-white placeholder:text-slate-500 rounded-2xl outline-none transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-[#7C6FE8]/30 shrink-0 hover:scale-105 active:scale-95"
                >
                  <span>Đăng Ký</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 2. Cinema Assurance Trust Strip (4 items) */}
        <div className="py-8 border-b border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-[#7C6FE8] flex items-center justify-center shrink-0 border border-purple-500/20">
              <Film className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xs text-white">24+ Cụm Rạp</span>
              <span className="text-[11px] text-slate-400">Chuẩn Laser & IMAX</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xs text-white">Dolby Atmos</span>
              <span className="text-[11px] text-slate-400">Âm thanh đa chiều 360°</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xs text-white">Đổi Vé Linh Hoạt</span>
              <span className="text-[11px] text-slate-400">Trước giờ chiếu 60 phút</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xs text-white">Hotline 24/7</span>
              <span className="text-[11px] text-slate-400">1900 6868 · CSKH</span>
            </div>
          </div>
        </div>

        {/* 3. Navigation Link Columns */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 border-b border-white/10">
          {/* Col 1: Khám Phá Phim */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Khám Phá Phim
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400">
              <li>
                <Link href="/movies?category=now-showing" className="hover:text-white transition-colors">
                  Phim đang chiếu tại rạp
                </Link>
              </li>
              <li>
                <Link href="/movies?category=coming-soon" className="hover:text-white transition-colors">
                  Phim sắp khởi chiếu
                </Link>
              </li>
              <li>
                <Link href="/star-shop" className="hover:text-white transition-colors">
                  Star Shop Merchandise
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Sự kiện & Khuyến mãi
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Hệ Thống Rạp & Phòng Chiếu */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Hệ Thống Rạp
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400">
              <li>
                <Link href="/cinemas" className="hover:text-white transition-colors">
                  Tất cả các rạp toàn quốc
                </Link>
              </li>
              <li>
                <Link href="/special-theaters" className="hover:text-white transition-colors">
                  Phòng chiếu IMAX Laser
                </Link>
              </li>
              <li>
                <Link href="/special-theaters" className="hover:text-white transition-colors">
                  Phòng VIP Gold Class
                </Link>
              </li>
              <li>
                <Link href="/cinemas" className="hover:text-white transition-colors">
                  Bảng giá vé & Combo bắp nước
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Thành Viên StarClub */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Thành Viên StarClub
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400">
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Trang cá nhân & Vé của tôi
                </Link>
              </li>
              <li>
                <Link href="/profile?tab=rewards" className="hover:text-white transition-colors">
                  Đổi điểm thưởng StarPoint
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Quyền lợi hạng Diamond / Gold
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Thẻ quà tặng CineVoucher
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Hỗ Trợ & Chính Sách */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Hỗ Trợ & Pháp Lý
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Về CineDot Vietnam
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Câu hỏi thường gặp (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Chính sách bảo mật thông tin
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Điều khoản giao dịch chung
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Tải App & Chứng Nhận Bộ Công Thương */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 flex flex-col gap-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">TẢI ỨNG DỤNG</h4>
            <div className="flex sm:flex-col gap-2">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2.5 transition-all group"
              >
                <Smartphone className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase text-slate-400 leading-none">Download on</span>
                  <span className="text-xs font-extrabold text-white leading-tight">App Store</span>
                </div>
              </a>

              <a
                href="https://play.google.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2.5 transition-all group"
              >
                <Smartphone className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase text-slate-400 leading-none">Get it on</span>
                  <span className="text-xs font-extrabold text-white leading-tight">Google Play</span>
                </div>
              </a>
            </div>

            {/* Ministry of Industry and Trade Certified Seal */}
            <div className="pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-950/40 border border-blue-500/40 text-blue-300 text-[10px] font-extrabold rounded-xl uppercase tracking-wider">
                <span>Đã Thông Báo Bộ Công Thương</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Payment Partners Strip */}
        <div className="py-6 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span>Đối tác thanh toán an toàn:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="px-3 py-1 rounded-lg bg-pink-600/20 border border-pink-500/30 text-pink-300 text-[11px] font-black">
              MoMo
            </span>
            <span className="px-3 py-1 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 text-[11px] font-black">
              VNPAY-QR
            </span>
            <span className="px-3 py-1 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-black">
              ZaloPay
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-white text-[11px] font-bold">
              Visa / Mastercard
            </span>
            <span className="px-3 py-1 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-black">
              Napas 247
            </span>
          </div>
        </div>

        {/* 5. Bottom Copyright & System Status */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-slate-400 font-medium">
              Hệ thống rạp hoạt động 08:00 - 02:00 hàng ngày · Bản quyền © 2026 CineDot Vietnam.
            </span>
          </div>

          <div className="flex items-center gap-5">
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              Về CineDot
            </Link>
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              Bảo mật
            </Link>
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              Điều khoản
            </Link>
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              Liên hệ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
