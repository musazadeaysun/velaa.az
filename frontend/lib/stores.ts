import { getStores } from "./api/client";
import { StoreDto } from "./api/types";
import { deleteProductsByStoreId } from "./products";

export interface Store extends StoreDto {
  logoUrl?: string;
  description?: string;
  isLocal?: boolean;
}

const demoStores: Store[] = [];

const LOCAL_STORES_KEY = "vela_local_stores";

export function getLocalStores(): Store[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(LOCAL_STORES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveLocalStore(store: Partial<Store>) {
  if (typeof window === "undefined") return;
  const current = getLocalStores();
  const newStore: Store = {
    id: Date.now(), // Generate a fake ID
    name: store.name || "Unknown Store",
    address: store.address || "",
    email: store.email || "",
    phoneNumber: store.phoneNumber || "",
    active: true,
    vendorId: 999,
    vendorName: "Local Vendor",
    isLocal: true,
    logoUrl: store.logoUrl || "https://images.unsplash.com/photo-1541013517358-397d16739665?auto=format&fit=crop&w=300&h=300",
    description: store.description || "A newly created local boutique.",
    ...store,
  };
  localStorage.setItem(LOCAL_STORES_KEY, JSON.stringify([newStore, ...current]));
  return newStore;
}

export function deleteLocalStore(id: number) {
  if (typeof window === "undefined") return;
  const current = getLocalStores();
  const filtered = current.filter((s) => s.id !== id);
  localStorage.setItem(LOCAL_STORES_KEY, JSON.stringify(filtered));
  
  // Cascade delete: Remove all products belonging to this store
  deleteProductsByStoreId(id);
}

export async function fetchStores(): Promise<Store[]> {
  const local = getLocalStores();
  try {
    const page = await getStores({ page: 0, size: 100 });
    return [...local, ...page.content];
  } catch (error) {
    console.warn("API Error fetching stores, falling back to local and demo:", error);
    return [...local, ...demoStores];
  }
}

export async function fetchStoreById(id: number): Promise<Store | null> {
  const local = getLocalStores();
  const found = local.find((s) => s.id === id);
  return found || null;
}
