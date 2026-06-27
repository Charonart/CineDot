// ─── Star Shop DTOs ────────────────────────────────────────────────────────

export interface ProductDTO {
  id: string;
  slug: string;
  name: string;
  category: 'movie-verse' | 'fan-wibu' | 'inner-child';
  price: number;
  originalPrice: number | null;
  imageUrl: string;
  badge: string | null;
  description: string;
  stock: number;
  tags: string[];
}

export interface ProductListResponseDTO {
  page: number;
  totalPages: number;
  totalResults: number;
  results: ProductDTO[];
}
