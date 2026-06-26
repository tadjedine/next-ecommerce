// ─── API Types ───────────────────────────────────────────────
// These types mirror the JSON shapes returned by the Laravel API.

import { authFetch, getAuthToken } from "./auth";

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

export interface ApiCombinationAttribute {
  id: number;
  value: string;
  color: string | null;
}

export interface ApiCombination {
  id: number;
  price_impact: number;
  final_price: number;
  quantity: number;
  reference: string | null;
  is_default: boolean;
  attributes: Record<string, ApiCombinationAttribute>;
  image_ids: number[];
}

export interface ApiAttributeGroupValue {
  id: number;
  name: string;
  color: string | null;
}

export interface ApiAttributeGroup {
  id: number;
  name: string;
  type: string;
  is_color: boolean;
  values: ApiAttributeGroupValue[];
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
  product_type?: string;
  cover_image: {
    id: number;
    url: string;
    urls: ApiImageUrls;
  } | null;
  images: ApiProductImage[];
  combinations?: ApiCombination[];
  attribute_groups?: ApiAttributeGroup[];
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
  image_url: string | null;
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

export interface ApiAddress {
  id: number;
  alias: string;
  firstname: string;
  lastname: string;
  company: string | null;
  address1: string;
  address2: string | null;
  postcode: string | null;
  city: string;
  id_country: number;
  phone: string | null;
  phone_mobile: string | null;
}

export interface ApiCarrier {
  id: number;
  name: string;
  is_free: boolean;
  delay: string | null;
}

export interface ApiCountry {
  id: number;
  name: string;
  iso_code: string;
  call_prefix: number;
}

export interface ApiCheckoutSummary {
  cart_id: number;
  customer_id: number;
  delivery_address: ApiAddress | null;
  invoice_address: ApiAddress | null;
  carrier: ApiCarrier | null;
  items: ApiCartItem[];
  total_quantity: number;
  subtotal: number;
  discount_summary: any;
  total_discounts: number;
  shipping_cost: number;
  total: number;
  is_ready: boolean;
  validation_errors: any[];
}

export interface ApiOrder {
  id: number;
  reference: string;
  current_state: number;
  payment: string;
  total_paid: number;
  date_add: string;
  total_products?: number;
  total_discounts?: number;
  total_shipping?: number;
  total_paid_real?: number;
  details?: ApiOrderDetail[];
}

export interface ApiOrderDetail {
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ApiFilterValue {
  id: number;
  name: string;
  color?: string | null;
  count: number;
}

export interface ApiFilterGroup {
  id: number;
  name: string;
  type?: string;
  is_color?: boolean;
  values: ApiFilterValue[];
}

export interface ApiFiltersResponse {
  attributes: ApiFilterGroup[];
  features: ApiFilterGroup[];
  price_range: { min: number; max: number };
}

// ─── Client Cache ─────────────────────────────────────────────

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const clientCache = new Map<string, CacheEntry<any>>();

function getCachedData<T>(key: string): T | null {
  const entry = clientCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    clientCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCachedData<T>(key: string, data: T, ttlMs: number): void {
  clientCache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

interface ApiFetchOptions extends RequestInit {
  cacheTtl?: number;
}

// ─── API Client ──────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function apiFetch<T>(endpoint: string, options?: ApiFetchOptions): Promise<T> {
  const cacheKey = `${options?.method || "GET"}:${endpoint}`;
  
  if (!options?.method || options.method === "GET") {
    if (options?.cacheTtl) {
      const cached = getCachedData<T>(cacheKey);
      if (cached !== null) {
        return cached;
      }
    }
  }

  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
    cache: "no-store",
    ...options,
  });

  if (!res.ok) {
    let errorMessage = `API Error: ${res.status} ${res.statusText}`;
    try {
      const errJson = await res.json();
      if (errJson.message) {
        errorMessage = errJson.message;
      }
    } catch (e) {
      // Ignored if response is not JSON
    }
    throw new Error(errorMessage);
  }

  const data = await res.json();

  if (!options?.method || options.method === "GET") {
    if (options?.cacheTtl) {
      setCachedData(cacheKey, data, options.cacheTtl);
    }
  }

  return data;
}

// ─── Categories ──────────────────────────────────────────────

export async function getCategories(params?: { per_page?: number; search?: string }) {
  const query = new URLSearchParams();
  if (params?.per_page) query.set("per_page", String(params.per_page));
  if (params?.search) query.set("search", params.search);

  const qs = query.toString();
  return apiFetch<ApiPaginatedResponse<ApiCategory>>(`/v1/categories${qs ? `?${qs}` : ""}`, { cacheTtl: 300000 });
}

export async function getCategory(id: number) {
  return apiFetch<{ data: ApiCategory }>(`/v1/categories/${id}`, { cacheTtl: 300000 });
}

export async function getCategoryHierarchy(parentId?: number) {
  const qs = parentId ? `?parent_id=${parentId}` : "";
  return apiFetch<ApiCategory[]>(`/v1/categories/hierarchy${qs}`, { cacheTtl: 300000 });
}

// ─── Products ────────────────────────────────────────────────

export async function getProducts(params?: { 
  category?: number; 
  category_slug?: string; 
  search?: string; 
  per_page?: number;
  price_min?: number;
  price_max?: number;
  attributes?: Record<number, number[]>;
  features?: Record<number, number[]>;
  sort?: string;
}) {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", String(params.category));
  if (params?.category_slug) query.set("category_slug", params.category_slug);
  if (params?.search) query.set("search", params.search);
  if (params?.per_page) query.set("per_page", String(params.per_page));
  if (params?.price_min) query.set("price_min", String(params.price_min));
  if (params?.price_max) query.set("price_max", String(params.price_max));
  if (params?.sort) query.set("sort", params.sort);

  if (params?.attributes) {
    Object.entries(params.attributes).forEach(([groupId, valueIds]) => {
      if (valueIds.length > 0) {
        query.set(`attributes[${groupId}]`, valueIds.join(","));
      }
    });
  }

  if (params?.features) {
    Object.entries(params.features).forEach(([featureId, valueIds]) => {
      if (valueIds.length > 0) {
        query.set(`features[${featureId}]`, valueIds.join(","));
      }
    });
  }

  const qs = query.toString();
  return apiFetch<ApiPaginatedResponse<ApiProduct>>(`/v1/products${qs ? `?${qs}` : ""}`, { cacheTtl: 120000 });
}

export async function getFilters(params?: { category_slug?: string }): Promise<ApiFiltersResponse> {
  const query = new URLSearchParams();
  if (params?.category_slug) query.set("category_slug", params.category_slug);
  
  const qs = query.toString();
  const res = await apiFetch<{ data: ApiFiltersResponse }>(`/v1/filters${qs ? `?${qs}` : ""}`, { cacheTtl: 300000 });
  return res.data;
}

export async function getProduct(id: number) {
  return apiFetch<{ data: ApiProduct }>(`/v1/products/${id}`, { cacheTtl: 120000 });
}

export async function getProductImages(productId: number) {
  return apiFetch<{ data: ApiProductImage[] }>(`/v1/products/${productId}/images`, { cacheTtl: 300000 });
}

// ─── Cart (Auth + Guest) ─────────────────────────────────────
// cartFetch picks authFetch (with Bearer token) when logged in,
// or apiFetch (cookie-only) when browsing as a guest.

async function cartFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken();
  if (token) {
    return authFetch<T>(endpoint, options);
  }
  return apiFetch<T>(endpoint, options);
}

export async function getOrCreateCart(): Promise<ApiCart> {
  const json = await cartFetch<{ data: ApiCart }>(`/v1/cart`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  return json.data;
}

export async function addCartItem(productId: number, quantity: number = 1, productAttributeId: number = 0): Promise<ApiCart> {
  const json = await cartFetch<{ data: ApiCart }>(`/v1/cart/items`, {
    method: "POST",
    body: JSON.stringify({ id_product: productId, id_product_attribute: productAttributeId, quantity }),
  });
  return json.data;
}

export async function updateCartItem(productId: number, quantity: number, productAttributeId: number = 0): Promise<ApiCart> {
  const json = await cartFetch<{ data: ApiCart }>(`/v1/cart/items/${productId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity, id_product_attribute: productAttributeId }),
  });
  return json.data;
}

export async function removeCartItem(productId: number, productAttributeId: number = 0): Promise<ApiCart> {
  const json = await cartFetch<{ data: ApiCart }>(`/v1/cart/items/${productId}?id_product_attribute=${productAttributeId}`, {
    method: "DELETE",
  });
  return json.data;
}

// ─── Addresses (Auth Required) ───────────────────────────────

export async function getAddresses(): Promise<ApiAddress[]> {
  const res = await authFetch<{ data: ApiAddress[] }>("/v1/addresses");
  return res.data;
}

export async function createAddress(data: Partial<ApiAddress>): Promise<ApiAddress> {
  const res = await authFetch<{ data: ApiAddress }>("/v1/addresses", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function updateAddress(id: number, data: Partial<ApiAddress>): Promise<ApiAddress> {
  const res = await authFetch<{ data: ApiAddress }>(`/v1/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function deleteAddress(id: number): Promise<void> {
  await authFetch(`/v1/addresses/${id}`, { method: "DELETE" });
}

// ─── Checkout (Auth Required) ────────────────────────────────

export async function getCheckoutSummary(): Promise<ApiCheckoutSummary> {
  const res = await cartFetch<{ data: ApiCheckoutSummary }>("/v1/checkout/summary");
  return res.data;
}

export async function setCheckoutAddresses(deliveryId: number, invoiceId?: number): Promise<any> {
  return authFetch("/v1/checkout/addresses", {
    method: "PUT",
    body: JSON.stringify({ id_address_delivery: deliveryId, id_address_invoice: invoiceId || deliveryId }),
  });
}

export async function setCheckoutCarrier(carrierId: number): Promise<any> {
  return authFetch("/v1/checkout/carrier", {
    method: "PUT",
    body: JSON.stringify({ id_carrier: carrierId }),
  });
}

export async function confirmCheckout(paymentMethod: string): Promise<any> {
  return authFetch("/v1/checkout/confirm", {
    method: "POST",
    body: JSON.stringify({ payment_method: paymentMethod }),
  });
}

// ─── Guest Checkout ──────────────────────────────────────────

export interface GuestCheckoutData {
  email: string;
  firstname: string;
  lastname: string;
  address1: string;
  address2?: string;
  city: string;
  postcode?: string;
  id_country: number;
  phone?: string;
  id_carrier: number;
  payment_method: string;
}

export async function guestCheckout(data: GuestCheckoutData): Promise<any> {
  return apiFetch("/v1/checkout/guest-confirm", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ─── Orders (Auth Required) ──────────────────────────────────

export async function getOrders(): Promise<ApiOrder[]> {
  const res = await authFetch<{ data: ApiOrder[] }>("/v1/orders");
  return res.data;
}

export async function getOrder(id: number): Promise<ApiOrder> {
  const res = await authFetch<{ data: ApiOrder }>(`/v1/orders/${id}`);
  return res.data;
}

// ─── Public Lists ────────────────────────────────────────────

export async function getCarriers(): Promise<ApiCarrier[]> {
  const res = await apiFetch<{ data: ApiCarrier[] }>("/v1/carriers", { cacheTtl: 600000 });
  return res.data;
}

export async function getCountries(): Promise<ApiCountry[]> {
  const res = await apiFetch<{ data: ApiCountry[] }>("/v1/countries", { cacheTtl: 600000 });
  return res.data;
}
