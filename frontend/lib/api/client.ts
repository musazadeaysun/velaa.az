import axios, { AxiosError } from "axios";
import { getAccessToken } from "./session";
import type {
  ApiPage,
  ApiResponse,
  AuthUserDto,
  CreateProductPayload,
  CreateStorePayload,
  CreateUserPayload,
  FavoriteDto,
  LoginPayload,
  ProductDto,
  RegisterBuyerPayload,
  StoreDto,
  UserDto,
} from "./types";

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

function resolveApiBaseUrl() {
  const configuredBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (configuredBaseUrl) {
    const normalized = normalizeBaseUrl(configuredBaseUrl);
    if (normalized.endsWith("/api/v1")) {
      return normalized;
    }
    if (normalized.endsWith("/api")) {
      return `${normalized}/v1`;
    }
    return `${normalized}/api/v1`;
  }

  return "https://api.vela.az/api/v1";
}

function resolveAuthBaseUrl() {
  const configuredBaseUrl =
    process.env.NEXT_PUBLIC_AUTH_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (configuredBaseUrl) {
    const normalized = normalizeBaseUrl(configuredBaseUrl);
    if (normalized.endsWith("/api/auth")) {
      return normalized;
    }
    if (normalized.endsWith("/api")) {
      return `${normalized}/auth`;
    }
    return `${normalized}/api/auth`;
  }

  return "https://api.vela.az/api/auth";
}

const API_BASE_URL = resolveApiBaseUrl();
const AUTH_BASE_URL = resolveAuthBaseUrl();
const API_TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? "45000");

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: API_TIMEOUT,
});

const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: API_TIMEOUT,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

authApi.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function unwrap<T>(response: { data: ApiResponse<T> }) {
  return response.data.data;
}

async function withRetry<T>(request: () => Promise<T>, retries = 1): Promise<T> {
  try {
    return await request();
  } catch (error) {
    if (
      retries > 0 &&
      axios.isAxiosError(error) &&
      (!error.response || error.code === "ECONNABORTED")
    ) {
      return withRetry(request, retries - 1);
    }

    throw error;
  }
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>;
    if (axiosError.code === "ECONNABORTED") {
      return "Backend çox gec cavab verdi. Bir az sonra yenidən yoxlayın.";
    }
    return axiosError.response?.data?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export async function getAllProducts(params?: { page?: number; size?: number }) {
  const response = await withRetry(() =>
    api.get<ApiResponse<ApiPage<ProductDto>>>("/products/all", {
      params,
    }),
  );
  return unwrap(response);
}

export async function getProductBySlug(slug: string) {
  const response = await withRetry(() =>
    api.get<ApiResponse<ProductDto>>(`/products/${slug}`),
  );
  return unwrap(response);
}

export async function searchProducts(name: string) {
  const response = await withRetry(() =>
    api.get<ApiResponse<ProductDto[]>>("/products/search", {
      params: { name },
    }),
  );
  return unwrap(response);
}

export async function getProductsByCategory(category: string) {
  const response = await withRetry(() =>
    api.get<ApiResponse<ProductDto[]>>(`/products/category/${category}`),
  );
  return unwrap(response);
}

export async function createUser(payload: CreateUserPayload) {
  const response = await api.post<ApiResponse<UserDto>>("/users", payload);
  return unwrap(response);
}

export async function getUserByEmail(email: string) {
  const response = await withRetry(() =>
    api.get<ApiResponse<UserDto>>("/users/by-email", {
      params: { email },
    }),
  );
  return unwrap(response);
}

export async function getUserById(id: number) {
  const response = await withRetry(() =>
    api.get<ApiResponse<UserDto>>(`/users/${id}`),
  );
  return unwrap(response);
}

export async function getUsers(params?: {
  searchTerm?: string;
  page?: number;
  size?: number;
}) {
  const response = await withRetry(() =>
    api.get<ApiResponse<ApiPage<UserDto>>>("/users", {
      params,
    }),
  );
  return unwrap(response);
}

export async function login(payload: LoginPayload) {
  const response = await authApi.post<ApiResponse<AuthUserDto>>("/login", payload);
  return unwrap(response);
}

export async function logout() {
  await authApi.post("/logout");
}

export async function registerBuyer(payload: RegisterBuyerPayload) {
  const response = await authApi.post<
    ApiResponse<{
      userId: number;
      email: string;
      role: "BUYER";
      registrationStatus: string;
    }>
  >("/register-buyer", payload);
  return unwrap(response);
}

export async function createStore(userId: number, payload: CreateStorePayload) {
  const response = await api.post<ApiResponse<StoreDto>>(
    `/stores/apply/${userId}`,
    payload,
  );
  return unwrap(response);
}

export async function getStores(params?: { page?: number; size?: number }) {
  const response = await withRetry(() =>
    api.get<ApiResponse<ApiPage<StoreDto>>>("/stores", { params }),
  );
  return unwrap(response);
}

export async function approveStore(storeId: number) {
  const response = await api.post<ApiResponse<StoreDto>>(`/stores/approve/${storeId}`);
  return unwrap(response);
}

export async function rejectStore(storeId: number) {
  const response = await api.post<ApiResponse<StoreDto>>(`/stores/reject/${storeId}`);
  return unwrap(response);
}

export async function getStoreByUserId(userId: number) {
  const response = await withRetry(() =>
    api.get<ApiResponse<StoreDto>>(`/stores/user/${userId}`),
  );
  return unwrap(response);
}

export async function createProduct(storeId: number, payload: CreateProductPayload) {
  const response = await api.post<ApiResponse<ProductDto>>(
    `/products/${storeId}`,
    payload,
  );
  return unwrap(response);
}

export async function getFavorites(userId: number) {
  const response = await withRetry(() =>
    api.get<ApiResponse<FavoriteDto[]>>(`/favorites/user/${userId}`),
  );
  return unwrap(response);
}

export async function toggleFavorite(userId: number, productId: number) {
  const response = await api.post<ApiResponse<null>>("/favorites/toggle", {
    userId,
    productId,
  });
  return unwrap(response);
}

export async function removeFavorite(userId: number, productId: number) {
  const response = await api.delete<ApiResponse<null>>("/favorites/remove", {
    params: { userId, productId },
  });
  return unwrap(response);
}
