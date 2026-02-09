import { api } from "@/lib/api";

export interface SocialAccount {
  id: number;
  provider: string;
  extra_data?: {
    email?: string;
    name?: string;
    picture?: string;
  };
}

export interface SocialAccountsResponse {
  social_accounts: SocialAccount[];
}

export const socialAccountsService = {
  // Get social accounts
  getSocialAccounts: async (): Promise<SocialAccountsResponse> => {
    const response = await api.get<SocialAccountsResponse>("/api/v1/auth/social-accounts/");
    return response.data;
  },

  // Disconnect social account
  disconnectAccount: async (accountId: number): Promise<void> => {
    await api.delete(`/api/v1/auth/social-accounts/${accountId}/disconnect/`);
  },

  // Connect Google account
  connectGoogleAccount: async (): Promise<void> => {
    // This would typically redirect to Google OAuth
    // For now, we'll just throw an error indicating it's not implemented
    throw new Error("Google connection not yet implemented");
  },
};
