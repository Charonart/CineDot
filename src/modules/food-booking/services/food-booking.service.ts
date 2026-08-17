import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { FoodItem } from '../types/food-booking.types';

export async function fetchFoodItems(): Promise<FoodItem[]> {
  try {
    const res = await apiClient.get(ENDPOINTS.MASTER.COMBOS);
    if (res.data?.success && Array.isArray(res.data?.data)) {
      return res.data.data.map((c: any) => {
        const name = c.name || 'Combo Bắp Nước';
        const nameLower = name.toLowerCase();
        
        let cat = 'COMBO';
        if (nameLower.includes('bắp') || nameLower.includes('popcorn')) cat = 'POPCORN';
        else if (nameLower.includes('nước') || nameLower.includes('drink') || nameLower.includes('coke')) cat = 'DRINK';
        else if (nameLower.includes('snack') || nameLower.includes('khoai tây')) cat = 'SNACK';
        if (nameLower.includes('combo')) cat = 'COMBO';

        return {
          id: String(c.combo_id || c.id),
          name: name,
          description: c.description || '1 Bắp Lớn + 2 Nước ngọt',
          price: Number(c.price || 109000),
          originalPrice: c.original_price ? Number(c.original_price) : undefined,
          imageUrl: c.image_url || c.imageUrl || 'https://images.unsplash.com/photo-1572177812156-58036aae439c?w=500&auto=format&fit=crop&q=80',
          category: cat as any,
          badge: c.badge || (c.combo_id % 2 === 0 ? 'HOT' : undefined),
        };
      });
    }
    return [];
  } catch {
    return [];
  }
}
