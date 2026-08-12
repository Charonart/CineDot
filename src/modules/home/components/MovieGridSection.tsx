'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MovieCardItem } from '../types/home.types';

interface MovieGridSectionProps {
  movies: MovieCardItem[];
  isLoading?: boolean;
}

export const MovieGridSection: React.FC<MovieGridSectionProps> = ({ movies, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'now-showing' | 'coming-soon'>('now-showing');

  const filteredMovies = movies.filter((m) => m.status === activeTab);

  return (
    <section className="max-w-[1240px] mx-auto px-8 mb-24">
      {/* Header */}
      <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="text-[#7C6FE8] text-xs font-bold tracking-widest uppercase mb-2">KHÁM PHÁ</p>
          <h2 className="text-[var(--text)] font-sans font-bold text-4xl">Phim Thịnh Hành</h2>
        </div>
        <div className="flex items-center space-x-2 bg-[var(--surface-muted)] p-1 rounded-full">
          <button
            onClick={() => setActiveTab('now-showing')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              activeTab === 'now-showing'
                ? 'bg-[#7C6FE8] text-white shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            ĐANG CHIẾU
          </button>
          <button
            onClick={() => setActiveTab('coming-soon')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              activeTab === 'coming-soon'
                ? 'bg-[#7C6FE8] text-white shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            SẮP CHIẾU
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="group cursor-pointer">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 shadow-sm bg-[var(--bg2)]">
              <img
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={movie.posterUrl}
              />
              <div className="absolute top-4 right-4 px-2.5 py-1 bg-[#7C6FE8]/90 backdrop-blur-md text-white text-[10px] font-bold rounded">
                {movie.ageRating || 'IMAX'}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <Link href={`/movies/${movie.slug}`} className="w-full">
                  <button className="w-full py-3 bg-[#7C6FE8] text-white rounded-xl font-bold text-sm hover:bg-[#685bc7] transition-colors">
                    ĐẶT VÉ NGAY
                  </button>
                </Link>
              </div>
            </div>
            <h3 className="font-bold text-[var(--text)] mb-1 group-hover:text-[#7C6FE8] transition-colors line-clamp-1">
              {movie.title}
            </h3>
            <div className="flex items-center text-xs text-[var(--muted)] justify-between">
              <span className="flex items-center text-[#7C6FE8]">
                <svg className="w-3 h-3 fill-current mr-1 text-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {movie.rating}
              </span>
              <span>{movie.genre}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button className="px-8 py-3 border border-[var(--border)] rounded-full text-sm font-bold text-[var(--text2)] hover:bg-[var(--surface-muted)] transition-colors">
          Xem thêm phim
        </button>
      </div>
    </section>
  );
};
