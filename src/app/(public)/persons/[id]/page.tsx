import React from 'react';
import { PersonDetailPageClient } from '@/modules/person/components/PersonDetailPageClient';

interface PersonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PersonPageProps) {
  try {
    const resolved = await params;
    return {
      title: `Hồ Sơ Nghệ Sĩ #${resolved.id} - CineDot Rạp Phim IMAX`,
      description: `Khám phá tiểu sử, thông tin chi tiết và danh sách các bộ phim bom tấn của nghệ sĩ tại hệ thống rạp CineDot.`,
    };
  } catch {
    return {
      title: 'Hồ Sơ Nghệ Sĩ - CineDot',
    };
  }
}

export default async function PersonPage({ params }: PersonPageProps) {
  const resolved = await params;
  const id = resolved?.id || '1';

  return <PersonDetailPageClient id={id} />;
}
