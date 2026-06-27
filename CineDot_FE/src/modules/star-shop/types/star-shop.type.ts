// ─── Star Shop Domain Types ────────────────────────────────────────────────

export type ProductCategory = 'movie-verse' | 'fan-wibu' | 'inner-child';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice: number | null;
  imageUrl: string;
  badge: string | null;
  description: string;
  stock: number;
  tags: string[];
  discountPercent: number | null;
  isInStock: boolean;
}

export interface ProductList {
  items: Product[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  'movie-verse': 'Movie-verse',
  'fan-wibu': 'Fan Wibu',
  'inner-child': 'Inner Child',
};
