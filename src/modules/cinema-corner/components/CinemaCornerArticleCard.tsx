'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { CinemaCornerArticle } from '../types/cinema-corner.types';

interface CinemaCornerArticleCardProps {
  article: CinemaCornerArticle;
}

export const CinemaCornerArticleCard: React.FC<CinemaCornerArticleCardProps> = ({ article }) => {
  return (
    <Link href={`/cinema-corner/${article.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-white rounded-3xl p-4 border border-gray-100 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between gap-4 group cursor-pointer h-full"
      >
        {/* Image thumbnail */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 shadow-xs">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold uppercase">
              {article.categoryName}
            </span>
          </div>

          {/* Article title & summary */}
          <div className="flex flex-col gap-1.5 px-1">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-[#7C6FE8] transition-colors line-clamp-2 leading-snug">
              {article.title}
            </h3>

            <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
              {article.summary}
            </p>
          </div>
        </div>

        {/* Author & Meta footer */}
        <div className="flex flex-col gap-3 pt-3 border-t border-gray-100 px-1 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={article.authorAvatar}
                alt={article.authorName}
                className="w-7 h-7 rounded-full object-cover border border-gray-200"
              />
              <span className="font-extrabold text-xs text-slate-800">{article.authorName}</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
              <Clock className="w-3 h-3 text-[#7C6FE8]" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
