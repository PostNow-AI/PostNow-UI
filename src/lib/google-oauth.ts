import { API_BASE_URL } from "./api";

// Google OAuth configuration
const GOOGLE_OAUTH_CONFIG = {
  scope: "openid email profile",
  responseType: "code",
  accessType: "offline",
  baseUrl: "https://accounts.google.com/o/oauth2/v2/auth",
} as const;

// Utility to build URL with params
const buildUrlWithParams = (
  baseUrl: string,
  params: Record<string, string>
): string => {
  const searchParams = new URLSearchParams(params);
  return `${baseUrl}?${searchParams.toString()}`;
};

// Validate and get Google Client ID
const getValidatedClientId = (): string => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    const errorMessage =
      "Google Client ID não configurado. Por favor, defina VITE_GOOGLE_CLIENT_ID no seu arquivo .env";
    console.error(errorMessage);
    throw new Error("Google Client ID não configurado");
  }

  return clientId;
};

// Build Google OAuth URL
const buildGoogleOAuthUrl = (clientId: string): string => {
  const redirectUri = `${API_BASE_URL}/api/v1/auth/google/callback/`;

  return buildUrlWithParams(GOOGLE_OAUTH_CONFIG.baseUrl, {
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: GOOGLE_OAUTH_CONFIG.scope,
    response_type: GOOGLE_OAUTH_CONFIG.responseType,
    access_type: GOOGLE_OAUTH_CONFIG.accessType,
  });
};

// Main Google OAuth redirect function
export const initiateGoogleOAuth = (): void => {
  try {
    const clientId = getValidatedClientId();
    const authUrl = buildGoogleOAuthUrl(clientId);
    window.location.href = authUrl;
  } catch {
    // Error is already logged in getValidatedClientId
    return;
  }
};
