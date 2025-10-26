import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  ApiError,
  getAdminPayments,
  getAdminRecipes,
  getAdminStats,
  getAdminUsers,
  loginAccount,
  registerAccount,
} from "@/lib/api";

type AuthUser = {
  email: string;
  password: string;
  hasPaid: boolean;
};

type AdminAuth = {
  username: string;
  password: string;
  header: string;
};

type LoginResult = {
  success: boolean;
  hasPaid: boolean;
  message?: string;
  error?: string;
};

type RegisterResult = {
  success: boolean;
  status: number;
  error?: string;
};

type AdminBootstrap = {
  recipes: Awaited<ReturnType<typeof getAdminRecipes>>;
  stats: Awaited<ReturnType<typeof getAdminStats>>;
  users: Awaited<ReturnType<typeof getAdminUsers>>;
  payments: Awaited<ReturnType<typeof getAdminPayments>>;
};

type AuthContextValue = {
  user: AuthUser | null;
  admin: AdminAuth | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  register: (email: string, password: string) => Promise<RegisterResult>;
  logout: () => void;
  refreshUser: () => Promise<LoginResult | null>;
  adminLogin: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string; data?: AdminBootstrap }>;
  clearAdmin: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const base64Encode = (value: string) => {
  if (typeof window !== "undefined" && typeof window.btoa === "function") {
    return window.btoa(unescape(encodeURIComponent(value)));
  }
  const globalBuffer = (globalThis as { Buffer?: typeof Buffer }).Buffer;
  if (globalBuffer) {
    return globalBuffer.from(value, "utf-8").toString("base64");
  }
  throw new Error("Base64 encoding is not supported in this environment.");
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [admin, setAdmin] = useState<AdminAuth | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    try {
      const response = await loginAccount(email, password);
      setUser({ email, password, hasPaid: response.has_paid });
      return { success: true, hasPaid: response.has_paid, message: response.message };
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Falha ao realizar login.";
      return { success: false, hasPaid: false, error: message };
    }
  }, []);

  const register = useCallback(async (email: string, password: string): Promise<RegisterResult> => {
    try {
      const status = await registerAccount(email, password);
      return {
        success: status === 201,
        status,
        error: status === 409 ? "Conta ja existe. Faca login para continuar." : undefined,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return { success: false, status: error.status, error: error.message };
      }
      const message = error instanceof Error ? error.message : "Falha ao registrar conta.";
      return { success: false, status: 500, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAdmin(null);
  }, []);

  const refreshUser = useCallback(async (): Promise<LoginResult | null> => {
    if (!user) {
      return null;
    }

    try {
      const response = await loginAccount(user.email, user.password);
      setUser({ email: user.email, password: user.password, hasPaid: response.has_paid });
      return { success: true, hasPaid: response.has_paid, message: response.message };
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Falha ao atualizar status do usuario.";
      return { success: false, hasPaid: false, error: message };
    }
  }, [user]);

  const adminLogin = useCallback(
    async (username: string, password: string) => {
      const header = `Basic ${base64Encode(`${username}:${password}`)}`;

      try {
        const [recipes, stats, users, payments] = await Promise.all([
          getAdminRecipes(header),
          getAdminStats(header),
          getAdminUsers(header),
          getAdminPayments(header),
        ]);

        setAdmin({ username, password, header });
        return {
          success: true,
          data: {
            recipes,
            stats,
            users,
            payments,
          },
        };
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Falha ao acessar painel admin.";
        return { success: false, error: message };
      }
    },
    [],
  );

  const clearAdmin = useCallback(() => {
    setAdmin(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      admin,
      login,
      register,
      logout,
      refreshUser,
      adminLogin,
      clearAdmin,
    }),
    [admin, clearAdmin, login, logout, refreshUser, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

