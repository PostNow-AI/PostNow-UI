import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds before data is considered stale
      staleTime: 5 * 60 * 1000, // 5 minutes

      // Time in milliseconds before inactive queries are garbage collected
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)

      // Number of times to retry failed requests
      retry: (failureCount, error: unknown) => {
        // Don't retry on 4xx errors (client errors)
        if (error && typeof error === "object" && "status" in error) {
          const status = (error as { status: number }).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },

      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus
      refetchOnWindowFocus: false,

      // Refetch on reconnect
      refetchOnReconnect: "always",

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
