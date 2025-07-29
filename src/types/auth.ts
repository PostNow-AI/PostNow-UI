import type { AuthResponse } from "@/lib/auth";

export interface AuthContextType {
  user: AuthResponse["user"] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  logout: () => void;
  refetchUser: () => void;
}
