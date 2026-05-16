// ─── API Types ───────────────────────────────────────────────
// These types mirror the JSON shapes returned by the Laravel API.

export interface ApiImageUrls {
  original: string;
  home: string;
  medium: string;
  small: string;
  cart: string;
}

export interface ApiProductImage {
  id: number;
  product_id: number;
  position: number;
  cover: boolean;
  url: string;
  urls: ApiImageUrls;
  legend: string | null;
}

export interface ApiProduct {
  id: number;
  name: string;
  description: string | null;
  description_short: string | null;
  slug: string;
  price: number;
  reference: string | null;
  quantity: number;
  active: boolean;
  on_sale: boolean;
  condition: string;
  category_id: number;
  date_add: string;
  cover_image: {
    id: number;
    url: string;
    urls: ApiImageUrls;
  } | null;
  images: ApiProductImage[];
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  parent_id: number;
  active: boolean;
  position: number;
  level_depth: number;
  is_root: boolean;
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
}

// ─── API Client ──────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
    // Revalidate every 60 seconds for ISR-friendly caching
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText} — ${url}`);
  }

  return res.json();
}

// ─── Categories ──────────────────────────────────────────────

export async function getCategories(params?: { per_page?: number; search?: string }) {
  const query = new URLSearchParams();
  if (params?.per_page) query.set("per_page", String(params.per_page));
  if (params?.search) query.set("search", params.search);

  const qs = query.toString();
  return apiFetch<ApiPaginatedResponse<ApiCategory>>(`/v1/categories${qs ? `?${qs}` : ""}`);
}

export async function getCategory(id: number) {
  return apiFetch<{ data: ApiCategory }>(`/v1/categories/${id}`);
}

export async function getCategoryHierarchy(parentId?: number) {
  const qs = parentId ? `?parent_id=${parentId}` : "";
  return apiFetch<ApiCategory[]>(`/v1/categories/hierarchy${qs}`);
}

// ─── Products ────────────────────────────────────────────────

export async function getProducts(params?: { category?: number; search?: string; per_page?: number }) {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", String(params.category));
  if (params?.search) query.set("search", params.search);
  if (params?.per_page) query.set("per_page", String(params.per_page));

  const qs = query.toString();
  return apiFetch<ApiPaginatedResponse<ApiProduct>>(`/v1/products${qs ? `?${qs}` : ""}`);
}

export async function getProduct(id: number) {
  return apiFetch<{ data: ApiProduct }>(`/v1/products/${id}`);
}

export async function getProductImages(productId: number) {
  return apiFetch<{ data: ApiProductImage[] }>(`/v1/products/${productId}/images`);
}
