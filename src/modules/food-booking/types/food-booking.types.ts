export type FoodCategory = 'ALL' | 'COMBO' | 'POPCORN' | 'DRINK' | 'SNACK';

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: FoodCategory;
  badge?: string;
}

export interface SelectedFoodItem {
  food: FoodItem;
  quantity: number;
}
