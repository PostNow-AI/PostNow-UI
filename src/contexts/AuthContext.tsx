import { LoadingPage } from "@/components/ui/loading";
import { authApi, authUtils, subscribeToAuthChanges } from "@/lib/auth";
import type { AuthContextType } from "@/types/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
// import { useTokenRefresh } from "@/hooks/useTokenRefresh";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const [initialLoading, setInitialLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Enable automatic token refresh for authenticated users
  // const { scheduleRefresh } = useTokenRefresh();

  // Check authentication status on mount and listen for changes
  useEffect(() => {
    const checkAuth = async () => {
      // Check authentication immediately to reduce flickering
      setIsAuthenticated(authUtils.isAuthenticated());
      setInitialLoading(false);
    };

    checkAuth();

    // Subscribe to authentication state changes using custom events
    const unsubscribe = subscribeToAuthChanges(() => {
      const currentAuthState = authUtils.isAuthenticated();
      setIsAuthenticated(currentAuthState);
    });

    return unsubscribe;
  }, []);

  // Query for current user data - only runs if authenticated
  const {
    data: user,
    isLoading: userLoading,
    error,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated && !initialLoading, // Only fetch if authenticated and initial check is done
    retry: (failureCount, error) => {
      // Don't retry if it's an authentication error
      if (
        error.message.includes("authentication") ||
        error.message.includes("token")
      ) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Clear user data from cache if user becomes unauthenticated
  useEffect(() => {
    // If user becomes unauthenticated but we still have cached data, clear it
    if (!isAuthenticated && user) {
      queryClient.removeQueries({ queryKey: ["auth", "user"] });
    }
  }, [isAuthenticated, user, queryClient]);

  const logout = () => {
    authUtils.logout();
    // Clear all cached data
    queryClient.removeQueries({ queryKey: ["auth", "user"] });
    // Note: isAuthenticated will be updated via the event listener
  };

  // Combined loading state: initial check OR user data loading
  const isLoading = initialLoading || (isAuthenticated && userLoading);

  const contextValue: AuthContextType = {
    user: user || null,
    isLoading,
    isAuthenticated,
    error: error as Error | null,
    logout,
    refetchUser,
  };

  // Show loading screen during initial authentication check
  if (initialLoading) {
    return <LoadingPage text="Initializing Sonora..." />;
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
