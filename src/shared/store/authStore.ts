import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  user_id: string;
  email: string;
  role: string;
  permissions: string[];
  firstname: string;
  lastname: string;
  is_active?: boolean;
  last_login_at?: string;
}

// Bentuk user dari backend (GET /auth/me → data.user) maupun sesi lama di localStorage
export interface RawUser {
  user_id?: string;
  email?: string;
  role?: string | { role_name?: string; permissions?: string[] } | null;
  permissions?: string[];
  firstname?: string | null;
  lastname?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  is_active?: boolean;
  last_login_at?: string | null;
}

// Role kadang berbentuk string, kadang objek { role_name, permissions }
export function normalizeUser(raw: RawUser): UserProfile {
  const roleObject = typeof raw.role === "object" ? raw.role : null;
  const roleName = typeof raw.role === "string" ? raw.role : roleObject?.role_name;

  return {
    user_id: raw.user_id ?? "",
    email: raw.email ?? "",
    role: roleName || "user",
    permissions: raw.permissions ?? roleObject?.permissions ?? [],
    firstname: raw.firstname ?? raw.firstName ?? "",
    lastname: raw.lastname ?? raw.lastName ?? "",
    is_active: raw.is_active,
    last_login_at: raw.last_login_at ?? undefined,
  };
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  setAuth: (user: UserProfile) => void;
  updateUser: (patch: Partial<UserProfile>) => void; // Patch sebagian data user (mis. nama setelah edit profil)
  clearAuth: () => void;
}

// Membuat global store dengan fitur persist (menyimpan otomatis ke localStorage)
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setAuth: (user) => set({ user, isAuthenticated: true }),

      // Patch sebagian data user tanpa relogin (persist otomatis ke localStorage)
      updateUser: (patch) =>
        set((state) =>
          state.user ? { user: { ...state.user, ...patch } } : state,
        ),

      clearAuth: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "koaci-auth-storage",
      version: 2,
      // Normalisasi sesi lama: role berbentuk objek dan nama camelCase (firstName/lastName)
      migrate: (persisted) => {
        const state = persisted as
          | { user?: RawUser | null; isAuthenticated?: boolean }
          | undefined;
        const user = state?.user ? normalizeUser(state.user) : null;
        return {
          user,
          isAuthenticated: Boolean(user && state?.isAuthenticated),
        } as AuthState;
      },
    },
  ),
);
