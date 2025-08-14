import axios, { AxiosError, type AxiosResponse } from "axios";
import Cookies from "js-cookie";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Configure axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const geminiKeyApi = {
  getStatus: async (
    provider: string = "gemini"
  ): Promise<{ has_key: boolean }> => {
    const res = await api.get(`/api/v1/api-keys/${provider}/status/`);
    return res.data as { has_key: boolean };
  },
  setKey: async (
    apiKey: string,
    provider: string = "gemini"
  ): Promise<{ success: boolean; message: string }> => {
    const res = await api.post("/api/v1/api-keys/set/", {
      api_key: apiKey,
      provider,
    });
    return res.data as { success: boolean; message: string };
  },
  deleteKey: async (
    provider: string = "gemini"
  ): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete(`/api/v1/api-keys/${provider}/delete/`);
    return res.data as { success: boolean; message: string };
  },
};

// Cookie configuration
const COOKIE_OPTIONS = {
  secure: import.meta.env.PROD, // Only use secure cookies in production
  sameSite: "strict" as const,
  expires: 7, // 7 days
};

const ACCESS_TOKEN_COOKIE = "access";
const REFRESH_TOKEN_COOKIE = "refresh";

// Cookie utility functions
export const cookieUtils = {
  setTokens: (accessToken: string, refreshToken: string) => {
    Cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
      ...COOKIE_OPTIONS,
      expires: 1, // Access token expires in 1 day
    });
    Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...COOKIE_OPTIONS,
      expires: 7, // Refresh token expires in 7 days
    });
  },

  getAccessToken: (): string | undefined => {
    return Cookies.get(ACCESS_TOKEN_COOKIE);
  },

  getRefreshToken: (): string | undefined => {
    return Cookies.get(REFRESH_TOKEN_COOKIE);
  },

  removeTokens: () => {
    Cookies.remove(ACCESS_TOKEN_COOKIE);
    Cookies.remove(REFRESH_TOKEN_COOKIE);
  },

  updateAccessToken: (accessToken: string) => {
    Cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
      ...COOKIE_OPTIONS,
      expires: 1, // Access token expires in 1 day
    });
  },
};

// Flag to prevent infinite loops during token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | null) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor - automatically attach access token
api.interceptors.request.use(
  (config) => {
    const token = cookieUtils.getAccessToken();
    if (token && config.headers) {
      // Axios v1+ expects headers to be a plain object, not possibly undefined
      (config.headers as Record<string, string>)[
        "Authorization"
      ] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh on 401 errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !(originalRequest as { _retry?: boolean })._retry
    ) {
      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest?.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      if (originalRequest) {
        (originalRequest as { _retry?: boolean })._retry = true;
      }
      isRefreshing = true;

      const refreshToken = cookieUtils.getRefreshToken();

      if (!refreshToken) {
        // No refresh token, clear cookies and redirect to login
        cookieUtils.removeTokens();
        processQueue(error, null);
        isRefreshing = false;

        // Redirect to login page
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(error);
      }

      try {
        // Attempt to refresh the token
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh/`, {
          refresh_token: refreshToken,
        });

        const { access_token } = response.data;
        cookieUtils.updateAccessToken(access_token);

        // Process queued requests
        processQueue(null, access_token);

        // Retry the original request
        if (originalRequest?.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear cookies and redirect to login
        cookieUtils.removeTokens();
        processQueue(refreshError as Error, null);

        // Redirect to login page
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
