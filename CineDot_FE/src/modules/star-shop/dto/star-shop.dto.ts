// ─── Star Shop DTOs ────────────────────────────────────────────────────────

export interface ProductDTO {
  id: string;
  slug: string;
  name: string;
  category: 'movie-verse' | 'fan-wibu' | 'inner-child';
  price: number;
  originalPrice: number | null;
  imageUrl: string; // Primary image for list view
  images?: string[]; // Multiple images for detail view
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
