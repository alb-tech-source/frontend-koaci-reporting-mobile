import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  firstName?: string; 
  lastName?: string;
  [key: string]: any;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  setAuth: (payload: any) => void; // Gunakan 'any' untuk menangkap respon mentah backend
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
          userId: nestedUser.user_id || payload.user_id || payload.id || '',
          email: nestedUser.email || payload.email || '',
          // Kadang role berbentuk string, kadang berbentuk objek { role_name: "..." }
          role: typeof payload.role === 'object' ? payload.role?.role_name : (payload.role || 'user'),
          permissions: payload.permissions || nestedUser.permission_ids || [],
          // Konversi dari snake_case (backend) ke camelCase (frontend)
          firstName: nestedUser.firstname || payload.firstname || payload.firstName || '',
          lastName: nestedUser.lastname || payload.lastname || payload.lastName || '',
          
          // Gabungkan sisa properti lainnya (tanggal login, is_active, dll)
          ...nestedUser,
          
          // Hapus key 'user' agar tidak terjadi lagi user.user di seluruh aplikasi
          user: undefined 
        };

        set({ user: flattenedUser, isAuthenticated: true });
      },
      
      clearAuth: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'koaci-auth-storage',
    }
  )
);