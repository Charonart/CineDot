export interface CartItemDTO {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface DeliveryInfo {
  city: string;
  cinemaId: string;
  cinemaName: string;
}

export interface CartStateDTO {
  items: CartItemDTO[];
  totalItems: number;
  totalPrice: number;
  paymentMethod: string | null;
  deliveryInfo: DeliveryInfo | null;
}
