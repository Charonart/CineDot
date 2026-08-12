'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Clock, ArrowRight } from 'lucide-react';
import { CinemaCornerArticle } from '../types/cinema-corner.types';

interface CinemaCornerHeroBannerProps {
  article: CinemaCornerArticle;
}

export const CinemaCornerHeroBanner: React.FC<CinemaCornerHeroBannerProps> = ({ article }) => {
  return (
    <Link href={`/cinema-corner/${article.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md mb-10 grid grid-cols-1 lg:grid-cols-12 items-center group cursor-pointer max-h-none lg:max-h-[320px]"
      >
        {/* Left Column: Image Box 16:9 (lg:col-span-6) */}
        <div className="lg:col-span-6 relative aspect-video lg:aspect-auto w-full lg:h-[320px] overflow-hidden bg-slate-900 shrink-0">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="px-3 py-1 rounded-full bg-[#7C6FE8] text-white font-extrabold text-[11px] uppercase tracking-wider shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              <span>BÀI VIẾT NỔI BẬT</span>
            </span>
          </div>
        </div>

        {/* Right Column: Article Details Info (lg:col-span-6) */}
        <div className="lg:col-span-6 p-5 sm:p-6 lg:p-7 flex flex-col justify-between gap-4 bg-white h-full">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-extrabold text-[#7C6FE8] uppercase tracking-wider">
              {article.categoryName}
            </span>

            <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-slate-900 group-hover:text-[#7C6FE8] transition-colors leading-tight">
              {article.title}
            </h2>

            <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
              {article.summary}
            </p>
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 mt-auto">
            {/* Author info & Meta stats bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={article.authorAvatar}
                  alt={article.authorName}
                  className="w-8 h-8 rounded-full object-cover border border-purple-200"
                />
                <div className="flex flex-col">
                  <span className="font-extrabold text-xs text-slate-800">{article.authorName}</span>
                  <span className="text-[10px] font-semibold text-slate-400">{article.authorRole}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-400 font-semibold text-[11px]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#7C6FE8]" />
                  <span>{article.publishedAt}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#7C6FE8]" />
                  <span>{article.readTime}</span>
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <span className="text-[#7C6FE8] font-extrabold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Đọc bài phân tích</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
