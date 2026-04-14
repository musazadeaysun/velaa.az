export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export type UserRole = "CUSTOMER" | "VENDOR" | "ADMIN" | "BUYER";
export type VendorStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ProductCategory = "WOMEN" | "MEN" | "KIDS" | "UNISEX";
export type ProductStatus = "ACTIVE" | "INACTIVE" | "DELETED";
export type RentalStatus = "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface UserDto {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface StoreDto {
  id: number;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  active: boolean;
  vendorId: number;
  vendorName: string;
}

export interface ProductDto {
  id: number;
  name: string;
  description: string | null;
  price: number;
  dailyPrice: number;
  sku: string | null;
  slug: string;
  imageUrl: string | null;
  category: ProductCategory;
  stockQuantity: number;
  storeId: number;
  storeName: string;
  createdAt: string;
}

export interface FavoriteDto {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string | null;
  createdAt: string;
}

export interface SessionUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  token?: string;
  refreshToken?: string;
  registrationStatus?: string;
  isVerified?: boolean;
}

export interface CreateUserPayload {
  username: string;
  password: string;
  email: string;
  role: UserRole;
}

export interface CreateStorePayload {
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  dailyPrice: number;
  sku?: string;
  category: ProductCategory;
  stockQuantity: number;
  size?: string;
  occasion?: string;
  phoneNumber?: string;
  city?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUserDto {
  id: number;
  username: string;
  email: string;
  token: string;
  refreshToken: string;
  registrationStatus: string;
  isVerified: boolean;
  role: UserRole;
}

export interface RegisterBuyerPayload {
  businessName: string;
  businessSector: string;
  email: string;
  password: string;
  confirmPassword: string;
}
