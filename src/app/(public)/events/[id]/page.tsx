import React from 'react';
import { EventDetailClientPage } from '@/modules/events/components/EventDetailClientPage';
import { fetchEventByIdOrSlug } from '@/modules/events/services/events.service';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const event = await fetchEventByIdOrSlug(id);
  return {
    title: event ? `${event.title} - CineDot Rạp Phim IMAX` : 'Sự Kiện & Ưu Đãi - CineDot',
    description: event?.summary || 'Xem thông tin chi tiết khuyến mãi và nhận mã voucher xem phim CineDot.',
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <EventDetailClientPage idOrSlug={id} />;
}
