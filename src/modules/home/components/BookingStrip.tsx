'use client';

import React, { useState } from 'react';

interface BookingStripProps {
  onQuickBook?: (selection: { movieId: string; cinemaId: string; date: string; time: string }) => void;
}

export const BookingStrip: React.FC<BookingStripProps> = ({ onQuickBook }) => {
  const [movieId, setMovieId] = useState('');
  const [cinemaId, setCinemaId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onQuickBook) {
      onQuickBook({ movieId, cinemaId, date, time });
    }
  };

  return (
    <section className="relative z-20 max-w-[1240px] mx-auto px-8 -mt-24 mb-24">
      <form
        onSubmit={handleSubmit}
        className="glass-card rounded-full p-4 flex flex-col md:flex-row items-center justify-between shadow-glass border border-white/50 gap-4 md:gap-0"
      >
        <div className="flex-1 flex items-center px-4 w-full">
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1">
              CHỌN PHIM
            </span>
            <select
              value={movieId}
              onChange={(e) => setMovieId(e.target.value)}
              className="bg-transparent border-none p-0 text-sm font-medium text-[var(--text)] focus:ring-0 appearance-none cursor-pointer outline-none w-full"
            >
              <option value="">Venom: Ký Sinh...</option>
              <option value="dune-2">Dune: Hành tinh cát 2</option>
              <option value="avatar-2">Avatar: Dòng chảy nước</option>
            </select>
          </div>
          <svg className="w-4 h-4 text-[var(--muted)] ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>

        <div className="hidden md:block w-[1px] h-10 bg-slate-800/10 mx-2" />

        <div className="flex-1 flex items-center px-4 w-full">
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1">
              CHỌN RẠP
            </span>
            <select
              value={cinemaId}
              onChange={(e) => setCinemaId(e.target.value)}
              className="bg-transparent border-none p-0 text-sm font-medium text-[var(--text)] focus:ring-0 appearance-none cursor-pointer outline-none w-full"
            >
              <option value="">Chọn rạp</option>
              <option value="c-1">CineDot Landmark 81</option>
              <option value="c-2">CineDot Quận 1</option>
            </select>
          </div>
          <svg className="w-4 h-4 text-[var(--muted)] ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>

        <div className="hidden md:block w-[1px] h-10 bg-slate-800/10 mx-2" />

        <div className="flex-1 flex items-center px-4 w-full">
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1">
              NGÀY XEM
            </span>
            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent border-none p-0 text-sm font-medium text-[var(--text)] focus:ring-0 appearance-none cursor-pointer outline-none w-full"
            >
              <option value="">Chọn ngày</option>
              <option value="today">Hôm nay</option>
              <option value="tomorrow">Ngày mai</option>
            </select>
          </div>
          <svg className="w-4 h-4 text-[var(--muted)] ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>

        <div className="hidden md:block w-[1px] h-10 bg-slate-800/10 mx-2" />

        <div className="flex-1 flex items-center px-4 w-full">
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1">
              SUẤT CHIẾU
            </span>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-transparent border-none p-0 text-sm font-medium text-[var(--text)] focus:ring-0 appearance-none cursor-pointer outline-none w-full"
            >
              <option value="">Chọn giờ</option>
              <option value="19:00">19:00 - IMAX</option>
              <option value="21:15">21:15 - 2D</option>
            </select>
          </div>
          <svg className="w-4 h-4 text-[var(--muted)] ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>

        <button
          type="submit"
          className="w-full md:w-auto ml-0 md:ml-4 bg-[#7C6FE8] text-white px-8 py-4 rounded-full text-sm font-bold tracking-wide hover:bg-[#685bc7] transition-colors shrink-0"
        >
          MUA VÉ
        </button>
      </form>
    </section>
  );
};
