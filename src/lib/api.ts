const FALLBACK_BASE_URL = "http://104.234.236.68:30067";

const resolveBrowserBaseUrl = () => {
  if (typeof window === "undefined") {
    return FALLBACK_BASE_URL;
  }

  const hostname = window.location.hostname;
  if (hostname && hostname !== "localhost" && hostname !== "127.0.0.1") {
    return "/api";
  }

  return FALLBACK_BASE_URL;
};

const getApiBaseUrl = () => {
  const envBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (envBase && envBase.trim().length > 0) {
    return envBase;
  }
  return resolveBrowserBaseUrl();
};

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

const normaliseItems = <T>(payload: { items?: T[] } | T[] | undefined | null): T[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.items)) return payload.items;
  return [];
};

async function apiFetch<TResponse = unknown>(path: string, options: RequestOptions = {}) {
  const { skipJson, headers, ...rest } = options;
  const isFormData = typeof FormData !== "undefined" && rest.body instanceof FormData;

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
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
  const response = await fetch(`${getApiBaseUrl()}/register`, {
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
  image_url?: string | null;
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
  image_url?: string | null;
};

export async function getAdminRecipes(authHeader: string, params?: { category?: string; is_public?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set("category", params.category);
  if (params?.is_public) searchParams.set("is_public", params.is_public);
  const query = searchParams.toString();
  const payload = await apiFetch<RecipeListResponse | Recipe[]>(`/admin/recipes${query ? `?${query}` : ""}`, {
    headers: { Authorization: authHeader },
  });
  return { items: normaliseItems(payload) };
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
  id: number;
  email: string;
  has_paid: boolean;
};

export async function getAdminUsers(authHeader: string) {
  const payload = await apiFetch<{ items: AdminUser[] } | AdminUser[]>("/admin/users", {
    headers: { Authorization: authHeader },
  });
  return { items: normaliseItems(payload) };
}

type AdminUserUpdatePayload = {
  email?: string;
  new_password?: string;
  has_paid?: boolean;
};

export async function updateAdminUser(authHeader: string, id: number, payload: AdminUserUpdatePayload) {
  return apiFetch<AdminUser>(`/admin/users/${id}`, {
    method: "PUT",
    headers: { Authorization: authHeader },
    body: JSON.stringify(payload),
  });
}

type AdminPayment = {
  id: string | number;
  email: string;
  amount_cents?: number;
  amount_total?: number;
  currency?: string;
  created_at?: string;
  paid_at?: string;
  session_id?: string;
};

export async function getAdminPayments(authHeader: string) {
  const payload = await apiFetch<{ items: AdminPayment[] } | AdminPayment[]>("/admin/payments", {
    headers: { Authorization: authHeader },
  });
  return { items: normaliseItems(payload) };
}

export async function uploadAdminImage(authHeader: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch<{ url: string }>("/admin/upload-image", {
    method: "POST",
    headers: { Authorization: authHeader },
    body: formData,
  });
}
