import React from 'react';
import { EventsClientPage } from '@/modules/events/components/EventsClientPage';

export const metadata = {
  title: 'Sự Kiện & Ưu Đãi Khuyến Mãi - CineDot Rạp Phim IMAX',
  description: 'Tổng hợp mã giảm giá vé phim, voucher combo bắp nước và chương trình khuyến mãi độc quyền cho thành viên rạp CineDot.',
};

export default function EventsPage() {
  return <EventsClientPage />;
}
