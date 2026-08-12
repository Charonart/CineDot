import { FoodItem } from '../types/food-booking.types';
import { mockFoodItems } from '../mocks/mockFoodData';

export async function fetchFoodItems(): Promise<FoodItem[]> {
  await new Promise((res) => setTimeout(res, 200));
  return mockFoodItems;
}
