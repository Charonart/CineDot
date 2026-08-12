'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CinemaCornerArticle, ArticleCategory } from '../types/cinema-corner.types';
import {
  fetchArticles,
  fetchFeaturedArticle,
  fetchTrendingArticles,
} from '../services/cinema-corner.service';
import { CinemaCornerHeroBanner } from './CinemaCornerHeroBanner';
import { CinemaCornerCategoryTabs } from './CinemaCornerCategoryTabs';
import { CinemaCornerArticleCard } from './CinemaCornerArticleCard';
import { CinemaCornerTrendingSidebar } from './CinemaCornerTrendingSidebar';
import { CinemaCornerNewsletter } from './CinemaCornerNewsletter';
import { Skeleton } from '@/shared/ui/Skeleton';

export function CinemaCornerClientPage() {
  const [activeCategory, setActiveCategory] = useState<ArticleCategory>('ALL');
  const [featuredArticle, setFeaturedArticle] = useState<CinemaCornerArticle | null>(null);
  const [articles, setArticles] = useState<CinemaCornerArticle[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<CinemaCornerArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      try {
        const [feat, trend, list] = await Promise.all([
          fetchFeaturedArticle(),
          fetchTrendingArticles(),
          fetchArticles('ALL'),
        ]);
        setFeaturedArticle(feat);
        setTrendingArticles(trend);
        setArticles(list);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Filter articles based on active category
  const filteredArticles = useMemo(() => {
    if (activeCategory === 'ALL') return articles;
    return articles.filter((art) => art.category === activeCategory);
  }, [articles, activeCategory]);

  return (
    <div className="w-full flex flex-col font-sans bg-[#FEFEFE] text-[#131413] min-h-screen pt-28 pb-20 selection:bg-[#7C6FE8] selection:text-white">
      <main className="w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
          {/* Header Title Section */}
          <div className="flex flex-col gap-2 mb-8">
            <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#7C6FE8] rounded-full inline-block" />
              <span>Góc Điện Ảnh & Blog Tin Phim</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Khám Phá Vũ Trụ Điện Ảnh
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl">
              Tổng hợp những bài phân tích chuyên sâu, góc nhìn đạo diễn, tin tức hậu trường rạp phim và những góc khuất nghệ thuật hấp dẫn nhất.
            </p>
          </div>

          {/* 1. Featured Hero Spotlight Banner */}
          {loading ? (
            <Skeleton variant="card" className="w-full h-96 rounded-3xl mb-12" />
          ) : (
            featuredArticle && <CinemaCornerHeroBanner article={featuredArticle} />
          )}

          {/* 2. Category Filter Tabs */}
          <CinemaCornerCategoryTabs
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          {/* 3. Main Content 2-Column Grid (Grid 8 cols + Sidebar 4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Main Editorial Grid (lg:col-span-8) */}
            <div className="lg:col-span-8">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} variant="card" className="h-72 rounded-3xl" />
                  ))}
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="p-12 text-center bg-slate-50 rounded-3xl border border-gray-100 flex flex-col items-center gap-3">
                  <span className="text-lg font-extrabold text-slate-700">Chưa có bài viết nào trong chuyên mục này</span>
                  <button
                    onClick={() => setActiveCategory('ALL')}
                    className="px-5 py-2 rounded-full bg-[#7C6FE8] text-white font-extrabold text-xs"
                  >
                    Xem tất cả bài viết
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredArticles.map((article) => (
                    <CinemaCornerArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </div>

            {/* Right Trending Sidebar (lg:col-span-4) */}
            <div className="lg:col-span-4">
              {loading ? (
                <Skeleton variant="card" className="w-full h-80 rounded-3xl" />
              ) : (
                <CinemaCornerTrendingSidebar articles={trendingArticles} />
              )}
            </div>
          </div>

          {/* 4. Weekly Newsletter Subscription Bar */}
          <CinemaCornerNewsletter />
        </div>
      </main>
    </div>
  );
}
