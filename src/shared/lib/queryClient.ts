import { QueryClient } from '@tanstack/react-query';

import { useAuthStore } from '../store/authStore';

// Factory (bukan singleton) agar tiap render server mendapat cache sendiri
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

/**
 * Query key tidak memuat user, jadi cache harus dikosongkan saat akun berganti;
 * kalau tidak, data akun sebelumnya ikut tampil untuk akun berikutnya.
 */
export function bindSessionToQueryCache(queryClient: QueryClient): () => void {
  return useAuthStore.subscribe((state, previous) => {
    const userId = state.user?.user_id;
    if (userId === previous.user?.user_id) return;

    // Ganti akun: query yang sedang tampil diambil ulang. Logout: cukup dibuang.
    if (userId) void queryClient.resetQueries();
    else queryClient.clear();
  });
}
