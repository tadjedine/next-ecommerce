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

export interface ApiCartItem {
  product_id: number;
  product_attribute_id: number;
  quantity: number;
  unit_price: number;
  line_subtotal: number;
  name: string | null;
  reference: string | null;
  image: number | null;
}

export interface ApiCart {
  id: number;
  customer_id: number;
  currency_id: number;
  language_id: number;
  shop_id: number;
  items: ApiCartItem[];
  total_quantity: number;
  subtotal: number;
  discount_summary: unknown | null;
  total_after_discount: number;
  is_ordered: boolean;
  updated_at: string | null;
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

export async function getProducts(params?: { category?: number; category_slug?: string; search?: string; per_page?: number }) {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", String(params.category));
  if (params?.category_slug) query.set("category_slug", params.category_slug);
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

// ─── Cart ────────────────────────────────────────────────────

export async function getOrCreateCart(customerId: number): Promise<ApiCart> {
  const res = await fetch(`${API_BASE}/v1/cart`, {
    method: "POST",
    headers: { "Accept": "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ id_customer: customerId }),
  });
  if (!res.ok) throw new Error(`Cart fetch failed: ${res.status}`);
  const json = await res.json();
  return json.data;
}

export async function addCartItem(customerId: number, productId: number, quantity: number = 1): Promise<ApiCart> {
  const res = await fetch(`${API_BASE}/v1/cart/items`, {
    method: "POST",
    headers: { "Accept": "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ id_customer: customerId, id_product: productId, quantity }),
  });
  if (!res.ok) throw new Error(`Add to cart failed: ${res.status}`);
  const json = await res.json();
  return json.data;
}

export async function updateCartItem(customerId: number, productId: number, quantity: number): Promise<ApiCart> {
  const res = await fetch(`${API_BASE}/v1/cart/items/${productId}`, {
    method: "PUT",
    headers: { "Accept": "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ id_customer: customerId, quantity }),
  });
  if (!res.ok) throw new Error(`Update cart failed: ${res.status}`);
  const json = await res.json();
  return json.data;
}

export async function removeCartItem(customerId: number, productId: number): Promise<ApiCart> {
  const res = await fetch(`${API_BASE}/v1/cart/items/${productId}`, {
    method: "DELETE",
    headers: { "Accept": "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ id_customer: customerId, quantity: 0 }),
  });
  if (!res.ok) throw new Error(`Remove from cart failed: ${res.status}`);
  const json = await res.json();
  return json.data;
}

