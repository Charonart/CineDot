'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArticleItem } from '../types/home.types';

interface CinemaCornerSectionProps {
  articles: ArticleItem[];
}

export const CinemaCornerSection: React.FC<CinemaCornerSectionProps> = ({ articles }) => {
  const [activeTab, setActiveTab] = useState<'review' | 'blog'>('review');

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 4);

  return (
    <section className="w-full py-20 bg-[var(--bg2)]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        {/* Header with Title & Sub-tabs */}
        <div className="flex items-center justify-between mb-10 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 bg-[#7C6FE8] rounded-full shadow-[0_0_12px_rgba(124,111,232,0.6)]" />
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text)] uppercase">
              GÓC ĐIỆN ẢNH
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <button
              onClick={() => setActiveTab('review')}
              className={`transition-colors ${
                activeTab === 'review'
                  ? 'text-[#7C6FE8] underline underline-offset-4'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              Bình luận phim
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`transition-colors ${
                activeTab === 'blog'
                  ? 'text-[#7C6FE8] underline underline-offset-4'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              Blog điện ảnh
            </button>
          </div>
        </div>

        {/* 50/50 Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: 1 Featured Large Article */}
          {mainArticle && (
            <div className="group flex flex-col gap-3 cursor-pointer p-3 rounded-3xl transition-all duration-300 hover:bg-white/60 dark:hover:bg-white/5 hover:shadow-[0_12px_30px_rgba(124,111,232,0.18)] border border-transparent hover:border-[#7C6FE8]/20">
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[var(--bg)] shadow-md">
                <img
                  src={mainArticle.imageUrl}
                  alt={mainArticle.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {mainArticle.ratingScore && (
                  <div className="absolute top-3 left-3 bg-[#7C6FE8] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    ★ {mainArticle.ratingScore}
                  </div>
                )}
              </div>

              <Link href={`/cinema-corner/${mainArticle.slug}`}>
                <h3 className="text-lg font-bold text-[var(--text)] group-hover:text-[#7C6FE8] transition-colors leading-snug line-clamp-2">
                  {mainArticle.title}
                </h3>
              </Link>

              <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
                {mainArticle.summary}
              </p>

              <div className="flex items-center gap-3 text-[11px] text-[var(--muted)] pt-1">
                <span className="bg-[#7C6FE8]/10 text-[#7C6FE8] px-2 py-0.5 rounded font-semibold">Review</span>
                <span>{mainArticle.publishDate}</span>
                {mainArticle.likeCount && <span>♥ {mainArticle.likeCount} lượt thích</span>}
              </div>
            </div>
          )}

          {/* Right Column: 3 Horizontal Small Articles */}
          <div className="flex flex-col gap-4 justify-between">
            {sideArticles.map((article) => (
              <div
                key={article.id}
                className="group flex items-start gap-4 cursor-pointer p-3 rounded-2xl transition-all duration-300 hover:bg-white/60 dark:hover:bg-white/5 hover:shadow-[0_8px_24px_rgba(124,111,232,0.15)] border border-transparent hover:border-[#7C6FE8]/20"
              >
                <div className="relative w-36 sm:w-44 aspect-[16/10] rounded-xl overflow-hidden bg-[var(--bg)] shrink-0 shadow-sm">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-col gap-1.5 flex-1">
                  <Link href={`/cinema-corner/${article.slug}`}>
                    <h4 className="text-sm font-bold text-[var(--text)] group-hover:text-[#7C6FE8] transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h4>
                  </Link>
                  <p className="text-xs text-[var(--muted)] line-clamp-1">
                    {article.summary}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-[var(--muted)] pt-1">
                    <span className="bg-[#7C6FE8]/10 text-[#7C6FE8] px-2 py-0.5 rounded font-semibold">Review</span>
                    <span>{article.publishDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View More Button */}
        <div className="mt-12 text-center">
          <Link href="/cinema-corner">
            <button className="group inline-flex items-center gap-2 px-8 py-3 bg-[#7C6FE8]/10 border border-[#7C6FE8]/40 text-[#7C6FE8] hover:bg-[#7C6FE8] hover:text-white rounded-full text-xs font-bold transition-all duration-300 shadow-sm hover:shadow-[0_8px_24px_rgba(124,111,232,0.3)]">
              <span>Xem thêm bài viết</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">&gt;</span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};
