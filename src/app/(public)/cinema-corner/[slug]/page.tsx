import React from 'react';
import { ArticleDetailClientPage } from '@/modules/cinema-corner/components/ArticleDetailClientPage';
import { fetchArticleBySlug } from '@/modules/cinema-corner/services/cinema-corner.service';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  return {
    title: article ? `${article.title} - CineDot Rạp Phim IMAX` : 'Bài Viết Điện Ảnh - CineDot',
    description: article?.summary || 'Đọc bài phân tích và review phim chuyên sâu tại CineDot.',
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <ArticleDetailClientPage slug={slug} />;
}
