export type StarShopCategory = 'ALL' | 'FIGURINE' | 'TUMBLER' | 'APPAREL' | 'COMBO';

export interface StarShopProduct {
  id: string;
  slug: string;
  name: string;
  category: StarShopCategory;
  categoryName: string;
  price: number;
  originalPrice?: number;
  rating: number;
  imageUrl: string;
  badge?: 'LIMITED' | 'BESTSELLER' | 'SALE';
  discountPercent?: number;
  description: string;
  stock: number;
}

export interface CartItem {
  product: StarShopProduct;
  quantity: number;
}
