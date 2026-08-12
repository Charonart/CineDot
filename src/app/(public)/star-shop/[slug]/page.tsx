import React from 'react';
import { ProductDetailClientPage } from '@/modules/star-shop/components/ProductDetailClientPage';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const metadata = {
  title: 'Chi Tiết Vật Phẩm Điện Ảnh - CineDot Star Shop',
  description: 'Chi tiết thông số kỹ thuật, hình ảnh 3D và chính sách bảo hành chính hãng vật phẩm điện ảnh tại CineDot Star Shop.',
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  return <ProductDetailClientPage slug={slug} />;
}
