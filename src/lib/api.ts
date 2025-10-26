const DEFAULT_BASE_URL = "http://104.234.236.68:30067";

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? DEFAULT_BASE_URL;

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = RequestInit & {
  skipJson?: boolean;
};

async function apiFetch<TResponse = unknown>(path: string, options: RequestOptions = {}) {
  const { skipJson, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...rest,
  });

  const contentType = response.headers.get("content-type");
  const canParseJson = !skipJson && contentType?.includes("application/json");

  const payload = canParseJson ? await response.json() : undefined;

  if (!response.ok) {
    const message =
      (payload as { message?: string })?.message ??
      `Request to ${path} failed with status ${response.status}`;
    throw new ApiError(message, response.status, payload);
  }

  return payload as TResponse;
}

export async function healthCheck() {
  return apiFetch<{ ok: boolean; time: string }>("/health");
}

export async function registerAccount(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok && response.status !== 409) {
    const payload = await response.json().catch(() => undefined);
    const message =
      (payload as { message?: string })?.message ?? `Register failed with status ${response.status}`;
    throw new ApiError(message, response.status, payload);
  }

  return response.status;
}

type LoginResponse = {
  email: string;
  has_paid: boolean;
  message: string;
};

export async function loginAccount(email: string, password: string) {
  return apiFetch<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

type CheckoutResponse = {
  checkout_url: string;
};

export async function createCheckoutSession() {
  return apiFetch<CheckoutResponse>("/create-checkout-session", {
    method: "POST",
  });
}

export type Recipe = {
  id: number;
  title: string;
  content: string;
  category: string | null;
  is_public: boolean;
};

type RecipeListResponse = {
  items: Recipe[];
};

export async function listPublicRecipes(category?: string) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return apiFetch<RecipeListResponse>(`/recipes/public${query}`);
}

export async function listMyRecipes(email: string, password: string, category?: string) {
  return apiFetch<RecipeListResponse>("/recipes/my", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      ...(category ? { category } : {}),
    }),
  });
}

export type AdminRecipePayload = {
  title: string;
  content: string;
  category: string;
  is_public: boolean;
};

export async function getAdminRecipes(authHeader: string, params?: { category?: string; is_public?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set("category", params.category);
  if (params?.is_public) searchParams.set("is_public", params.is_public);
  const query = searchParams.toString();
  return apiFetch<RecipeListResponse>(`/admin/recipes${query ? `?${query}` : ""}`, {
    headers: { Authorization: authHeader },
  });
}

export async function createAdminRecipe(authHeader: string, payload: AdminRecipePayload) {
  return apiFetch<Recipe>("/admin/recipes", {
    method: "POST",
    headers: { Authorization: authHeader },
    body: JSON.stringify(payload),
  });
}

export async function updateAdminRecipe(authHeader: string, id: number, payload: AdminRecipePayload) {
  return apiFetch<Recipe>(`/admin/recipes/${id}`, {
    method: "PUT",
    headers: { Authorization: authHeader },
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminRecipe(authHeader: string, id: number) {
  await apiFetch(`/admin/recipes/${id}`, {
    method: "DELETE",
    headers: { Authorization: authHeader },
    skipJson: true,
  });
}

type AdminStats = {
  users: { total: number; paid: number };
  recipes: { total: number; public: number; private: number };
  payments: { total_amount_cents: number; currency: string };
};

export async function getAdminStats(authHeader: string) {
  return apiFetch<AdminStats>("/admin/stats", {
    headers: { Authorization: authHeader },
  });
}

type AdminUser = {
  email: string;
  has_paid: boolean;
};

export async function getAdminUsers(authHeader: string) {
  return apiFetch<{ items: AdminUser[] }>("/admin/users", {
    headers: { Authorization: authHeader },
  });
}

type AdminPayment = {
  id: string;
  email: string;
  amount_cents: number;
  currency: string;
  created_at: string;
};

export async function getAdminPayments(authHeader: string) {
  return apiFetch<{ items: AdminPayment[] }>("/admin/payments", {
    headers: { Authorization: authHeader },
  });
}
