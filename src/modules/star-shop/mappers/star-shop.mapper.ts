import { ProductDTO, ProductListResponseDTO } from '../dto/star-shop.dto';
import { Product, ProductList } from '../types/star-shop.type';

export const productMapper = {
  toProductModel: (dto: ProductDTO): Product => {
    const discountPercent =
      dto.originalPrice && dto.originalPrice > dto.price
        ? Math.round(((dto.originalPrice - dto.price) / dto.originalPrice) * 100)
        : null;

    return {
      id: dto.id,
      slug: dto.slug,
      name: dto.name,
      category: dto.category,
      price: dto.price,
      originalPrice: dto.originalPrice,
      imageUrl: dto.imageUrl,
      badge: dto.badge,
      description: dto.description,
      stock: dto.stock,
      tags: dto.tags,
      discountPercent,
      isInStock: dto.stock > 0,
    };
  },

  toProductListModel: (dto: ProductListResponseDTO): ProductList => ({
    items: (dto.results || []).map(productMapper.toProductModel),
    currentPage: dto.page || 1,
    totalPages: dto.totalPages || 1,
    totalItems: dto.totalResults || 0,
    hasNext: (dto.page || 1) < (dto.totalPages || 1),
  }),
};
