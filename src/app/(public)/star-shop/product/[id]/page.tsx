import React from 'react';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/modules/star-shop/components/ProductDetail';
import { starShopService } from '@/modules/star-shop/services/star-shop.service';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const product = await starShopService.getProduct(resolvedParams.id);
    return {
      title: `${product.name} | CineDot Star Shop`,
      description: product.description,
    };
  } catch (error) {
    return {
      title: 'Sản phẩm không tồn tại | CineDot',
    };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  try {
    const product = await starShopService.getProduct(resolvedParams.id);
    return <ProductDetail product={product} />;
  } catch (error) {
    console.error("Failed to fetch product detail:", error);
    return notFound();
  }
}
