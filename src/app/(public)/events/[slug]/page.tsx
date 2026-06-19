import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EventsPage } from '@/modules/events/components/EventsPage';
import { EventDetailPage } from '@/modules/events/components/EventDetailPage';
import { EventCategory, EVENT_CATEGORY_LABELS } from '@/modules/events/types/events.type';

// These slugs are category routes, everything else is a detail
const CATEGORY_SLUGS: EventCategory[] = ['now', 'promotions', 'news'];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (CATEGORY_SLUGS.includes(slug as EventCategory)) {
    const label = EVENT_CATEGORY_LABELS[slug as EventCategory];
    return {
      title: `${label} — Sự Kiện CineDot`,
      description: `Xem ${label.toLowerCase()} từ CineDot.`,
    };
  }
  return {
    title: 'Chi Tiết Sự Kiện — CineDot',
    description: 'Xem chi tiết sự kiện và ưu đãi từ CineDot.',
  };
}

export default async function EventsSlugPage({ params }: PageProps) {
  const { slug } = await params;

  if (CATEGORY_SLUGS.includes(slug as EventCategory)) {
    return <EventsPage initialCategory={slug as EventCategory} />;
  }

  // If it's not a known category, treat as detail slug
  if (!slug || slug.trim() === '') notFound();
  return <EventDetailPage slug={slug} />;
}
