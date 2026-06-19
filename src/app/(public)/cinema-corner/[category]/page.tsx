import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CinemaCornerPage } from '@/modules/cinema-corner/components/CinemaCornerPage';
import { ArticleCategory, ARTICLE_CATEGORY_LABELS } from '@/modules/cinema-corner/types/cinema-corner.type';

const VALID_CATEGORIES: ArticleCategory[] = ['reviews', 'blog', 'backstage'];

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  if (!VALID_CATEGORIES.includes(category as ArticleCategory)) return { title: 'Góc Điện Ảnh' };
  const label = ARTICLE_CATEGORY_LABELS[category as ArticleCategory];
  return {
    title: `${label} — Góc Điện Ảnh CineDot`,
    description: `Khám phá ${label.toLowerCase()} mới nhất từ đội ngũ CineDot.`,
  };
}

export function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }));
}

export default async function CinemaCornerCategoryPage({ params }: PageProps) {
  const { category } = await params;
  if (!VALID_CATEGORIES.includes(category as ArticleCategory)) notFound();
  return <CinemaCornerPage initialCategory={category as ArticleCategory} />;
}
