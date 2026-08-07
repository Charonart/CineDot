'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Flame } from 'lucide-react';
import { CinemaCornerArticle } from '../types/cinema-corner.types';

interface CinemaCornerTrendingSidebarProps {
  articles: CinemaCornerArticle[];
}

export const CinemaCornerTrendingSidebar: React.FC<CinemaCornerTrendingSidebarProps> = ({ articles }) => {
  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-5 sticky top-28">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-500 fill-amber-400" />
          <h3 className="font-extrabold text-base text-slate-900">
            Top Đọc Nhiều Nhất Tuần
          </h3>
        </div>
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
          TRENDING
        </span>
      </div>

      {/* Trending List */}
      <div className="flex flex-col gap-4">
        {articles.map((item, index) => (
          <Link key={item.id} href={`/cinema-corner/${item.slug}`}>
            <div className="flex items-start gap-3.5 group cursor-pointer pb-3 border-b border-gray-50 last:border-none last:pb-0">
              {/* Rank badge number */}
              <span
                className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-xs ${
                  index === 0
                    ? 'bg-amber-500 text-white'
                    : index === 1
                    ? 'bg-[#7C6FE8] text-white'
                    : index === 2
                    ? 'bg-purple-400 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                #{index + 1}
              </span>

              {/* Content info */}
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="text-[10px] font-extrabold text-[#7C6FE8] uppercase tracking-wider">
                  {item.categoryName}
                </span>
                <h4 className="font-extrabold text-xs text-slate-800 group-hover:text-[#7C6FE8] transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400 mt-0.5">
                  <span>{item.publishedAt}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <Eye className="w-3 h-3 text-slate-400" />
                    <span>{(item.views / 1000).toFixed(1)}k đọc</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
