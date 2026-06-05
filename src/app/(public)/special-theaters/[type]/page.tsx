import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SpecialTheaterPage } from '@/modules/special-theaters/components/SpecialTheaterPage';
import { TheaterType, THEATER_TYPE_LABELS } from '@/modules/special-theaters/types/special-theaters.type';

const VALID_TYPES: TheaterType[] = ['imax', '4dx', 'dolby-atmos', 'kids'];

interface PageProps {
  params: Promise<{ type: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params;
  if (!VALID_TYPES.includes(type as TheaterType)) return { title: 'Rạp Đặc Biệt — CineDot' };
  const label = THEATER_TYPE_LABELS[type as TheaterType];
  return {
    title: `${label} — Rạp Đặc Biệt CineDot`,
    description: `Trải nghiệm điện ảnh ${label} đỉnh cao tại CineDot. Xem phim với công nghệ tốt nhất.`,
  };
}

export function generateStaticParams() {
  return VALID_TYPES.map((type) => ({ type }));
}

export default async function SpecialTheaterTypePage({ params }: PageProps) {
  const { type } = await params;
  if (!VALID_TYPES.includes(type as TheaterType)) notFound();
  return <SpecialTheaterPage type={type as TheaterType} />;
}
