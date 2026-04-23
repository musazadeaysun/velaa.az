export interface Product {
  id: number;
  slug?: string;
  name: string;
  name_en?: string;
  name_ru?: string;
  description?: string;
  price: number;
  rentPrice: number;
  sellPrice: number;
  image: string;
  category: string;
  backendCategory?: string;
  category_en?: string;
  category_ru?: string;
  occasion: string;
  size: string;
  stockQuantity?: number;
  storeId?: number;
  storeName?: string;
  createdAt?: string;
  isNew?: boolean;
  isLocal?: boolean;
  phoneNumber?: string;
  city?: string;
  sku?: string;
}
