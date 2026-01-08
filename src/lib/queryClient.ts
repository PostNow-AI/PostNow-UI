import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds before data is considered stale
      staleTime: 5 * 60 * 1000, // 5 minutes

      // Time in milliseconds before inactive queries are garbage collected
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)

      // Number of times to retry failed requests
      retry: 1,

      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus
      refetchOnWindowFocus: false,

      // Refetch on reconnect
      refetchOnReconnect: false,

      // Refetch on mount
      refetchOnMount: true,
    },
    mutations: {
      // Number of times to retry failed mutations
      retry: 1,

      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
});
