'use client';

import React from 'react';
import Link from 'next/link';
import { useArticle } from '../hooks/useCinemaCorner';

interface ArticleDetailPageProps {
  slug: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function ArticleDetailPage({ slug }: ArticleDetailPageProps) {
  const { data: article, isLoading, isError } = useArticle(slug);

  if (isLoading) {
    return (
      <div className="article-page">
        <div className="container article-container">
          <div className="skeleton-line skeleton-line--hero" />
          <div className="skeleton-image skeleton-image--featured" style={{ marginBottom: '2rem' }} />
          <div className="skeleton-line" />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-line--medium" />
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="article-page">
        <div className="container article-container">
          <div className="cc-error-state">
            <span className="state-icon">⚠️</span>
            <p>Không tìm thấy bài viết này. Bài viết có thể đã được xóa.</p>
            <Link href="/cinema-corner" className="btn-primary" style={{ marginTop: '1rem' }}>
              Quay lại Góc Điện Ảnh
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="article-page">
      <div className="container article-container">
        {/* Breadcrumb */}
        <nav className="article-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span aria-hidden="true"> / </span>
          <Link href="/cinema-corner">Góc Điện Ảnh</Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">{article.categoryLabel}</span>
        </nav>

        {/* Header */}
        <header className="article-header">
          <span className="cc-category-badge">{article.categoryLabel}</span>
          <h1 className="article-title">{article.title}</h1>
          <p className="article-excerpt">{article.excerpt}</p>
          <div className="article-meta">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.authorAvatar} alt={article.author} className="cc-author-avatar" />
            <div className="article-meta-text">
              <span className="article-author">{article.author}</span>
              {article.authorBio && <span className="article-author-bio">{article.authorBio}</span>}
            </div>
            <div className="article-meta-right">
              <span className="cc-date">{formatDate(article.publishedAt)}</span>
              <span className="cc-read-time">⏱ {article.readTime} phút đọc</span>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.imageUrl} alt={article.title} className="article-hero-image" />

        {/* Content */}
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content || '<p>Nội dung đang được cập nhật.</p>' }}
        />

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="article-tags">
            {article.tags.map((tag) => (
              <span key={tag} className="article-tag">#{tag}</span>
            ))}
          </div>
        )}

        {/* Related */}
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <section className="article-related">
            <h2 className="article-related-title">Bài viết liên quan</h2>
            <div className="article-related-grid">
              {article.relatedArticles.map((rel) => (
                <Link key={rel.id} href={rel.href} className="article-related-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={rel.imageUrl} alt={rel.title} className="article-related-image" />
                  <span className="article-related-card-title">{rel.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
