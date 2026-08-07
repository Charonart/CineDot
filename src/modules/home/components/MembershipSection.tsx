'use client';

import React from 'react';

export const MembershipSection: React.FC = () => {
  return (
    <section className="max-w-[1240px] mx-auto px-8 mb-32">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 relative w-full">
          <div className="relative aspect-[1.6/1] rounded-[40px] overflow-hidden shadow-2xl">
            <img
              alt="Cinema Experience"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[#7C6FE8] text-xs font-bold tracking-widest uppercase mb-4">TRAILER NỔI BẬT</p>
          <h2 className="text-[var(--text)] font-sans font-bold text-4xl lg:text-5xl mb-6 leading-tight">
            Trải nghiệm<br />Điện ảnh<br />đỉnh cao
          </h2>
          <p className="text-[var(--text2)] mb-10 leading-relaxed">
            Đắm chìm vào thế giới tráng lệ của Arrakis. Chiêm ngưỡng toàn bộ sự kỳ vĩ trong kiệt tác điện ảnh đỉnh cao — hiện đang chiếu tại các phòng chiếu IMAX và Dolby Cinema trên toàn hệ thống CINE.
          </p>
          <div className="grid grid-cols-3 gap-8 mb-10">
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text)]">166</p>
              <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider">Phút</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text)]">8.7</p>
              <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider">Điểm IMDb</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text)]">97%</p>
              <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider">Rotten Tomatoes</p>
            </div>
          </div>
          <button className="bg-[#7C6FE8] text-white px-10 py-4 rounded-full text-sm font-bold hover:bg-[#6a5cd6] transition-colors">
            Đặt vé ngay
          </button>
        </div>
      </div>
    </section>
  );
};
