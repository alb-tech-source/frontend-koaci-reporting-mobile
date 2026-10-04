import { QueryClient } from '@tanstack/react-query';

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
