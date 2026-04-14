import type { Product } from "@/app/(main)/collections/productSlice";
import {
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
  searchProducts,
} from "./api/client";
import type { ProductCategory, ProductDto } from "./api/types";

export const FALLBACK_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&h=1000";

const demoProducts: Product[] = [];

export function mapProductDtoToProduct(product: ProductDto): Product {
  const createdAtDate = new Date(product.createdAt);
  const now = Date.now();
  const createdAtTime = Number.isNaN(createdAtDate.getTime())
    ? now
    : createdAtDate.getTime();

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description ?? "",
    price: product.price,
    rentPrice: product.dailyPrice,
    sellPrice: product.price,
    image: product.imageUrl || FALLBACK_PRODUCT_IMAGE,
    category: product.category,
    backendCategory: product.category,
    occasion: product.category,
    size: product.stockQuantity > 0 ? `Stock: ${product.stockQuantity}` : "Out",
    stockQuantity: product.stockQuantity,
    storeId: product.storeId,
    storeName: product.storeName,
    createdAt: product.createdAt,
    isNew: now - createdAtTime < 1000 * 60 * 60 * 24 * 30,
  };
}

export function mapCategoryParamToBackendCategory(
  category: string | null,
): ProductCategory | null {
  switch (category) {
    case "bridal":
    case "evening":
    case "women":
      return "WOMEN";
    case "mens":
      return "MEN";
    case "kids":
      return "KIDS";
    default:
      return null;
  }
}

const LOCAL_PRODUCTS_KEY = "vela_local_products";

export function getLocalProducts(): Product[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(LOCAL_PRODUCTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveLocalProduct(product: Partial<Product>) {
  if (typeof window === "undefined") return;
  const current = getLocalProducts();
  const newProduct: Product = {
    id: Date.now(),
    slug: `local-${Date.now()}`,
    name: product.name || "Untitled",
    description: product.description || "",
    price: product.price || 0,
    rentPrice: product.rentPrice || 0,
    sellPrice: product.sellPrice || 0,
    image: product.image || FALLBACK_PRODUCT_IMAGE,
    category: product.category || "UNISEX",
    backendCategory: product.backendCategory || "UNISEX",
    occasion: product.occasion || "UNISEX",
    size: product.size || "M",
    stockQuantity: 1,
    storeId: product.storeId || 0,
    storeName: product.storeName || "My Store",
    createdAt: new Date().toISOString(),
    isNew: true,
    isLocal: true,
    ...product,
  };
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify([newProduct, ...current]));
  return newProduct;
}

export function deleteLocalProduct(id: number) {
  if (typeof window === "undefined") return;
  const current = getLocalProducts();
  const filtered = current.filter((p) => p.id !== id);
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(filtered));
}

export function deleteProductsByStoreId(storeId: number) {
  if (typeof window === "undefined") return;
  const current = getLocalProducts();
  const filtered = current.filter((p) => p.storeId !== storeId);
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(filtered));
}

export async function fetchProducts(params?: { page?: number; size?: number }) {
  const local = getLocalProducts();
  try {
    const page = await getAllProducts(params);
    const apiProducts = page.content.map(mapProductDtoToProduct);
    return [...local, ...apiProducts];
  } catch (error) {
    console.warn("API Error, falling back to local and demo products:", error);
    return [...local, ...demoProducts];
  }
}

export function getDemoProducts() {
  return [...getLocalProducts(), ...demoProducts];
}

export async function fetchProductByIdentifier(identifier: string) {
  try {
    const product = await getProductBySlug(identifier);
    return mapProductDtoToProduct(product);
  } catch {
    if (!/^\d+$/.test(identifier)) {
      throw new Error("Product not found");
    }

    const products = await fetchProducts({ page: 0, size: 100 });
    const found = products.find((item) => item.id === Number(identifier));
    if (!found) {
      throw new Error("Product not found");
    }
    return found;
  }
}

export async function fetchProductsByBackendCategory(category: ProductCategory) {
  const products = await getProductsByCategory(category);
  return products.map(mapProductDtoToProduct);
}

export async function fetchProductsBySearch(name: string) {
  const products = await searchProducts(name);
  return products.map(mapProductDtoToProduct);
}

export function getProductHref(product: Product) {
  return `/product/${product.slug || product.id}`;
}
