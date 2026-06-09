import type { Metadata } from 'next';
import { ArticleDetailPage } from '@/modules/cinema-corner/components/ArticleDetailPage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Bài Viết — Góc Điện Ảnh CineDot`,
    description: `Đọc bài viết điện ảnh ${slug} từ CineDot.`,
  };
}

export default async function ArticleDetailRoutePage({ params }: PageProps) {
  const { slug } = await params;
  return <ArticleDetailPage slug={slug} />;
}
