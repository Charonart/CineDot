import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StarShopPage } from '@/modules/star-shop/components/StarShopPage';
import { ProductCategory } from '@/modules/star-shop/types/star-shop.type';

const VALID_CATEGORIES: ProductCategory[] = ['movie-verse', 'fan-wibu', 'inner-child'];

const CATEGORY_META: Record<ProductCategory, { title: string; description: string }> = {
  'movie-verse': {
    title: 'Movie-verse — Star Shop CineDot',
    description: 'Bộ sưu tập merchandise phim, steelbook, mô hình và quà tặng điện ảnh cao cấp.',
  },
  'fan-wibu': {
    title: 'Fan Wibu — Star Shop CineDot',
    description: 'Merchandise anime chính hãng: cosplay, figure, poster và nhiều hơn nữa.',
  },
  'inner-child': {
    title: 'Inner Child — Star Shop CineDot',
    description: 'Gấu bông, puzzle, sách nghệ thuật và quà tặng dành cho trẻ em và người lớn mang trái tim trẻ thơ.',
  },
};

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  if (!VALID_CATEGORIES.includes(category as ProductCategory)) {
    return { title: 'Star Shop — CineDot' };
  }
  const meta = CATEGORY_META[category as ProductCategory];
  return { title: meta.title, description: meta.description };
}

export function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }));
}

export default async function StarShopCategoryPage({ params }: PageProps) {
  const { category } = await params;
  if (!VALID_CATEGORIES.includes(category as ProductCategory)) {
    notFound();
  }
  return <StarShopPage initialCategory={category as ProductCategory} />;
}
