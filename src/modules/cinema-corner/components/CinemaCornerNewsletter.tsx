'use client';

import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2 } from 'lucide-react';

export const CinemaCornerNewsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3000);
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#7C6FE8] to-indigo-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-[#7C6FE8]/25 flex flex-col md:flex-row items-center justify-between gap-8 mt-16 relative overflow-hidden">
      {/* Decorative Blur Circles */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

      {/* Left Info Column */}
      <div className="flex flex-col gap-2 max-w-xl text-center md:text-left z-10">
        <span className="px-3 py-1 rounded-full bg-white/20 text-white font-extrabold text-[10px] uppercase tracking-wider w-fit mx-auto md:mx-0 flex items-center gap-1.5 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>BẢN TIN ĐIỆN ẢNH CINEDOT</span>
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Đăng Ký Nhận Bài Phân Tích Phim Mới Nhất
        </h3>
        <p className="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed">
          Cập nhật các bài review chuyên sâu, tin bên lề phim bom tấn và mã ưu đãi giảm giá vé xem phim gửi trực tiếp vào hòm thư mỗi sáng Thứ Hai.
        </p>
      </div>

      {/* Right Form Column */}
      <div className="w-full md:w-auto z-10 min-w-[300px] sm:min-w-[360px]">
        {subscribed ? (
          <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white font-extrabold text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span>Đã đăng ký thành công! Cảm ơn bạn.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative w-full">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn..."
                required
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-md"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer shrink-0"
            >
              Đăng Ký
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
