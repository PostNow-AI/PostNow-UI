import { authApi, authUtils } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

// Token expires in 24 hours, refresh 5 minutes before expiration
const REFRESH_BEFORE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds
const TOKEN_LIFETIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function useTokenRefresh() {
  const queryClient = useQueryClient();
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleTokenRefresh = useCallback(() => {
    // Clear any existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // Only schedule refresh if user is authenticated
    if (!authUtils.isAuthenticated()) {
      return;
    }

    // Schedule refresh 5 minutes before token expires
    const refreshTime = TOKEN_LIFETIME - REFRESH_BEFORE_EXPIRY;

    refreshTimeoutRef.current = setTimeout(async () => {
      try {
        // Only refresh if still authenticated
        if (authUtils.isAuthenticated()) {
          await authApi.refreshToken();

          // Invalidate user queries to potentially refetch with new token
          queryClient.invalidateQueries({ queryKey: ["auth", "user"] });

          // Schedule the next refresh
          scheduleTokenRefresh();
        }
      } catch (error) {
        console.error("Background token refresh failed:", error);
        // If refresh fails, the user will be redirected to login by the axios interceptor
        // when they make their next API request
      }
    }, refreshTime);
  }, [queryClient]);

  useEffect(() => {
    scheduleTokenRefresh();

    // Cleanup timeout on unmount
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [scheduleTokenRefresh]);

  // Return a function to manually trigger refresh scheduling
  // (useful when user logs in or tokens are updated)
  return {
    scheduleRefresh: scheduleTokenRefresh,
  };
}
