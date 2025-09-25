// User type definition
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  logout: () => void;
  refetchUser: () => void;
}

// Type definitions
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirmPassword: string;
}

// Auth response type definition
export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

// Social account type definition
export interface SocialAccount {
  id: number;
  provider: string;
  uid: string;
  extra_data: {
    email?: string;
    name?: string;
    picture?: string;
  };
  date_joined: string;
}

// Social accounts response type definition
export interface SocialAccountsResponse {
  social_accounts: SocialAccount[];
  total_count: number;
}
