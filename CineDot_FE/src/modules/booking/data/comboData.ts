import { ComboItem } from '../types';

export const COMBO_ITEMS: ComboItem[] = [
  {
    id: 'combo-1-big',
    name: 'Combo 1 Big',
    description: 'Đừng vào rạp tay không! 1 bắp rang bơ lớn và 1 Pepsi mát lạnh.',
    price: 90000,
    quantity: 0,
    category: 'combo',
    featured: true,
    image: 'https://images.unsplash.com/photo-1578242162856-7c0529d21148?w=500&q=80',
  },
  {
    id: 'couple-combo-special',
    name: 'Couple Combo Special',
    description: 'Combo hẹn hò gồm 1 bắp lớn và 2 nước, phù hợp cho 2 người.',
    price: 134000,
    quantity: 0,
    category: 'combo',
    featured: false,
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=500&q=80',
  },
  {
    id: 'bts-arirang-combo',
    name: 'BTS Arirang Combo',
    description: 'Combo phiên bản đặc biệt gồm bắp, nước và quà tặng giới hạn.',
    price: 325000,
    quantity: 0,
    category: 'combo',
    featured: false,
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&q=80',
  },
  {
    id: 'snack-combo-2',
    name: 'Snack Combo 2',
    description: 'Bắp ngọt, nước bất kỳ và món ăn nhẹ.',
    price: 169000,
    quantity: 0,
    category: 'combo',
    featured: false,
    image: 'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?w=500&q=80',
  },
  {
    id: 'popcorn-single',
    name: 'Popcorn Single',
    description: 'Một phần bắp rang bơ tiêu chuẩn.',
    price: 59000,
    quantity: 0,
    category: 'popcorn',
    featured: false,
    image: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=500&q=80',
  },
];

export const QUICK_COMBO_FEATURED = COMBO_ITEMS.find((item) => item.featured) || COMBO_ITEMS[0];
