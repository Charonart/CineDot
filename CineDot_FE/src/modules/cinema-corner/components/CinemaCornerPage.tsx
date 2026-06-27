'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useArticles } from '../hooks/useCinemaCorner';
import { ArticleCategory, ARTICLE_CATEGORY_LABELS, Article } from '../types/cinema-corner.type';
import { appRoutes } from '@/shared/routes/appRoutes';

const CATEGORIES: { value: ArticleCategory | undefined; label: string }[] = [
  { value: undefined, label: 'Tất Cả' },
  { value: 'reviews', label: 'Bình Luận Phim' },
  { value: 'blog', label: 'Blog Điện Ảnh' },
  { value: 'backstage', label: 'Hậu Trường' },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  if (featured) {
    return (
      <div className="cc-featured-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.imageUrl} alt={article.title} className="cc-featured-image" loading="eager" />
        <div className="cc-featured-overlay">
          <div className="cc-featured-meta">
            <span className="cc-category-badge">{article.categoryLabel}</span>
            <span className="cc-read-time">⏱ {article.readTime} phút đọc</span>
          </div>
          <Link href={article.href} className="cc-featured-title">{article.title}</Link>
          <p className="cc-featured-excerpt">{article.excerpt}</p>
          <div className="cc-featured-author">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.authorAvatar} alt={article.author} className="cc-author-avatar" />
            <span>{article.author}</span>
            <span className="cc-date">{formatDate(article.publishedAt)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cc-article-card">
      <Link href={article.href} className="cc-card-image-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.imageUrl} alt={article.title} className="cc-card-image" loading="lazy" />
        <span className="cc-category-badge cc-category-badge--over">{article.categoryLabel}</span>
      </Link>
      <div className="cc-card-body">
        <Link href={article.href} className="cc-card-title">{article.title}</Link>
        <p className="cc-card-excerpt">{article.excerpt}</p>
        <div className="cc-card-footer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.authorAvatar} alt={article.author} className="cc-author-avatar cc-author-avatar--sm" />
          <span className="cc-author-name">{article.author}</span>
          <span className="cc-dot" aria-hidden="true">·</span>
          <span className="cc-date">{formatDate(article.publishedAt)}</span>
          <span className="cc-dot" aria-hidden="true">·</span>
          <span className="cc-read-time">{article.readTime} phút</span>
        </div>
      </div>
    </div>
  );
}

function ArticleSkeleton() {
  return (
    <div className="cc-article-card cc-article-card--skeleton">
      <div className="skeleton-image skeleton-image--card" />
      <div className="cc-card-body">
        <div className="skeleton-line" />
        <div className="skeleton-line skeleton-line--medium" />
        <div className="skeleton-line skeleton-line--short" />
      </div>
    </div>
  );
}

interface CinemaCornerPageProps {
  initialCategory?: ArticleCategory;
}

export function CinemaCornerPage({ initialCategory }: CinemaCornerPageProps) {
  const [activeCategory, setActiveCategory] = useState<ArticleCategory | undefined>(initialCategory);
  const { data, isLoading, isError } = useArticles(activeCategory);

  const articles = data?.items || [];
  const featuredArticle = articles.find((a) => a.isFeatured) || articles[0];
  const gridArticles = articles.filter((a) => a.id !== featuredArticle?.id);

  return (
    <div className="cc-page">
      {/* Hero */}
      <section className="cc-hero">
        <div className="cc-hero-bg" aria-hidden="true" />
        <div className="container cc-hero-content">
          <div className="cc-hero-badge">🎬 Điện Ảnh & Nghệ Thuật</div>
          <h1 className="cc-hero-title">Góc Điện Ảnh</h1>
          <p className="cc-hero-subtitle">
            Bình luận chuyên sâu, blog điện ảnh và hậu trường độc quyền từ đội ngũ CineDot
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="cc-categories">
        <div className="container">
          <div className="cc-tabs" role="tablist">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value ?? 'all'}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.value}
                className={`cc-tab ${activeCategory === cat.value ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="cc-category-nav">
            {(['reviews', 'blog', 'backstage'] as ArticleCategory[]).map((cat) => (
              <Link
                key={cat}
                href={appRoutes.cinemaCornerCategory(cat)}
                className={`cc-cat-link ${initialCategory === cat ? 'active' : ''}`}
              >
                {ARTICLE_CATEGORY_LABELS[cat]}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="cc-content">
        <div className="container">
          {isError && (
            <div className="cc-error-state">
              <span className="state-icon">⚠️</span>
              <p>Không thể tải bài viết. Vui lòng thử lại sau.</p>
            </div>
          )}

          {isLoading ? (
            <>
              <div className="cc-featured-skeleton skeleton-image skeleton-image--featured" />
              <div className="cc-grid">
                {Array.from({ length: 6 }).map((_, i) => <ArticleSkeleton key={i} />)}
              </div>
            </>
          ) : articles.length === 0 ? (
            <div className="cc-empty-state">
              <span className="state-icon">📰</span>
              <p>Chưa có bài viết nào trong mục này.</p>
            </div>
          ) : (
            <>
              {featuredArticle && <ArticleCard article={featuredArticle} featured />}
              <div className="cc-grid">
                {gridArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
