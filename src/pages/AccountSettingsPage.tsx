import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { useAuth } from "@/hooks/useAuth";
import { authApi, type SocialAccount } from "@/lib/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function AccountSettingsPage() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  // Fetch social accounts
  const {
    data: socialAccountsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth", "socialAccounts"],
    queryFn: authApi.getSocialAccounts,
    enabled: !!user,
  });

  // Disconnect social account mutation
  const disconnectMutation = useMutation({
    mutationFn: authApi.disconnectSocialAccount,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["auth", "socialAccounts"] });
      toast.success(
        `${data.disconnected_provider} account disconnected successfully`
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to disconnect account");
    },
  });

  const handleDisconnect = (account: SocialAccount) => {
    if (
      confirm(
        `Are you sure you want to disconnect your ${account.provider} account?`
      )
    ) {
      disconnectMutation.mutate(account.id);
    }
  };

  const handleConnectGoogle = () => {
    // Use the existing Google OAuth flow - it will automatically link if user is logged in
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      toast.error("Google Client ID not configured");
      return;
    }

    const redirectUri = encodeURIComponent(
      `${
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
      }/api/v1/auth/google/callback/`
    );
    const scope = encodeURIComponent("openid email profile");
    const responseType = "code";
    const accessType = "offline";

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&access_type=${accessType}`;

    window.location.href = googleAuthUrl;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Account Settings
            </h1>
            <div className="space-x-4">
              <Link
                to="/home"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Back to Home
              </Link>
              <Button onClick={logout} variant="outline">
                Logout
              </Button>
            </div>
          </div>

          {/* User Info Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Profile Information
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p>
                <strong>Name:</strong> {user?.first_name} {user?.last_name}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
            </div>
          </div>

          {/* Connected Accounts Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Connected Accounts
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-600">
                  Failed to load connected accounts
                </p>
              </div>
            )}

            <div className="space-y-4">
              {/* Google Account */}
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>

                  {socialAccountsData?.social_accounts.find(
                    (acc) => acc.provider === "google"
                  ) ? (
                    <div>
                      <p className="font-medium text-gray-900">Google</p>
                      <p className="text-sm text-gray-600">
                        {
                          socialAccountsData.social_accounts.find(
                            (acc) => acc.provider === "google"
                          )?.extra_data.email
                        }
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium text-gray-900">Google</p>
                      <p className="text-sm text-gray-600">Not connected</p>
                    </div>
                  )}
                </div>

                {socialAccountsData?.social_accounts.find(
                  (acc) => acc.provider === "google"
                ) ? (
                  <Button
                    onClick={() => {
                      const googleAccount =
                        socialAccountsData.social_accounts.find(
                          (acc) => acc.provider === "google"
                        );
                      if (googleAccount) handleDisconnect(googleAccount);
                    }}
                    variant="outline"
                    disabled={disconnectMutation.isPending}
                  >
                    {disconnectMutation.isPending
                      ? "Disconnecting..."
                      : "Disconnect"}
                  </Button>
                ) : (
                  <Button onClick={handleConnectGoogle} variant="outline">
                    Connect Google
                  </Button>
                )}
              </div>
            </div>

            {socialAccountsData?.total_count === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No social accounts connected</p>
                <p className="text-sm">
                  Connect your social accounts for easier login
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
