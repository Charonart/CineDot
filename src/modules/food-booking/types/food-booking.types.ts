export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category?: string;
  badge?: string;
}

export interface SelectedFoodItem {
  food: FoodItem;
  quantity: number;
}

