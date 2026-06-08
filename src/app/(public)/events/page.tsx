import type { Metadata } from 'next';
import { EventsPage } from '@/modules/events/components/EventsPage';

export const metadata: Metadata = {
  title: 'Sự Kiện & Ưu Đãi — CineDot',
  description: 'Khám phá sự kiện điện ảnh đặc biệt, ưu đãi độc quyền và tin tức nóng nhất từ CineDot.',
};

export default function EventsRootPage() {
  return <EventsPage />;
}
