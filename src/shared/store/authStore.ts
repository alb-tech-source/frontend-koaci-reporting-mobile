import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  user_id: string;
  email: string;
  role: {
    role_name: string;
    permissions: string[];
  };
  firstname?: string;
  lastname?: string;
  [key: string]: unknown;
  is_active?: boolean;
  last_login_at?: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  setAuth: (payload: any) => void; // Gunakan 'any' untuk menangkap respon mentah backend
  updateUser: (patch: Partial<UserProfile>) => void; // Patch sebagian data user (mis. nama setelah edit profil)
  clearAuth: () => void;
}

// Membuat global store dengan fitur persist (menyimpan otomatis ke localStorage)
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setAuth: (payload) => {
        if (!payload) return;

        // 🔥 LOGIKA PERATAAAN (FLATTENING) OBJEK BERSARANG
        // Ambil objek user yang ada di dalam payload (jika backend mengirim nested)
        const nestedUser = payload.user || {};

        // Rakit ulang menjadi satu objek datar yang seragam
        const flattenedUser: UserProfile = {
          user_id: nestedUser.user_id || payload.user_id || payload.id || "",
          email: nestedUser.email || payload.email || "",
          // Kadang role berbentuk string, kadang berbentuk objek { role_name: "..." }
          role:
            typeof payload.role === "object"
              ? payload.role?.role_name
              : payload.role || "user",
          permissions: payload.permissions || nestedUser.permission_ids || [],
          // Konsisten dengan interface UserProfile (firstname/lastname)
          firstname:
            nestedUser.firstname ||
            payload.firstname ||
            payload.firstName ||
            "",
          lastname:
            nestedUser.lastname || payload.lastname || payload.lastName || "",

          // Gabungkan sisa properti lainnya (tanggal login, is_active, dll)
          ...nestedUser,

          // Hapus key 'user' agar tidak terjadi lagi user.user di seluruh aplikasi
          user: undefined,
        };

        set({ user: flattenedUser, isAuthenticated: true });
      },

      // Patch sebagian data user tanpa relogin (persist otomatis ke localStorage)
      updateUser: (patch) =>
        set((state) =>
          state.user ? { user: { ...state.user, ...patch } } : state,
        ),

      clearAuth: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "koaci-auth-storage",
      version: 1,
      // Normalisasi sesi lama: versi sebelumnya menyimpan firstName/lastName (camelCase)
      migrate: (persisted) => {
        const state = persisted as { user?: Record<string, unknown> } | undefined;
        const user = state?.user;
        if (user) {
          if (user.firstname === undefined && user.firstName !== undefined) {
            user.firstname = user.firstName;
          }
          if (user.lastname === undefined && user.lastName !== undefined) {
            user.lastname = user.lastName;
          }
          delete user.firstName;
          delete user.lastName;
        }
        return state as AuthState;
      },
    },
  ),
);
