import type { Metadata } from 'next';
import { CinemaDetailPage } from '@/modules/cinemas/components/CinemaDetailPage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Chi Tiết Rạp — CineDot`,
    description: `Xem thông tin chi tiết rạp ${slug} CineDot.`,
  };
}

export default async function CinemaDetailRoutePage({ params }: PageProps) {
  const { slug } = await params;
  return <CinemaDetailPage slug={slug} />;
}
