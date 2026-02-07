import { CartItemInput, Order, Product, User } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type FetchOptions = RequestInit & { isForm?: boolean };

async function clearAuthCookies() {
  try {
    await fetch(`${API_URL}/api/auth/logout/`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // ignore logout errors
  }
}

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const headers: HeadersInit = options.isForm
    ? {}
    : { "Content-Type": "application/json" };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
    credentials: "include",
  });

  if (!response.ok) {
    let detail = "Erro na requisição.";
    try {
      const data = await response.json();
      detail = data.detail || JSON.stringify(data);
    } catch {
      // ignore parse error
    }
    if (
      response.status === 401 &&
      !path.startsWith("/api/auth/login/") &&
      !path.startsWith("/api/auth/register/")
    ) {
      await clearAuthCookies();
    }
    throw new Error(detail);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export function login(username: string, password: string) {
  return request<User>("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function register(username: string, email: string, password: string) {
  return request<User>("/api/auth/register/", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

export function logout() {
  return request<void>("/api/auth/logout/", { method: "POST" });
}

export function refreshToken() {
  return request<{ detail: string }>("/api/auth/refresh/", { method: "POST" });
}

export function me() {
  return request<User>("/api/auth/me/", { method: "GET" });
}

export function listProducts() {
  return request<Product[]>("/api/products/", { method: "GET" });
}

export function getProduct(id: number) {
  return request<Product>(`/api/products/${id}/`, { method: "GET" });
}

export function createProduct(data: FormData) {
  return request<Product>("/api/products/", {
    method: "POST",
    body: data,
    isForm: true,
  });
}

export function updateProduct(id: number, data: FormData) {
  return request<Product>(`/api/products/${id}/`, {
    method: "PATCH",
    body: data,
    isForm: true,
  });
}

export function deleteProduct(id: number) {
  return request<void>(`/api/products/${id}/`, { method: "DELETE" });
}

export function checkout(items: CartItemInput[]) {
  return request<Order>("/api/orders/checkout/", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}

export function listOrders() {
  return request<Order[]>("/api/orders/", { method: "GET" });
}
