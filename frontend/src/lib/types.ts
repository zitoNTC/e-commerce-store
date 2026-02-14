export type User = {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  tags: Tag[];
  tag_ids?: number[];
  image: string | null;
  image_url: string | null;
};

export type Tag = {
  id: number;
  name: string;
  created_at: string;
};

export type OrderItem = {
  id: number;
  product: string;
  product_id: number;
  quantity: number;
  unit_price: string;
};

export type Order = {
  id: number;
  status: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
};

export type CartItemInput = {
  product_id: number;
  quantity: number;
};
