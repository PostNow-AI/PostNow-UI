import { api } from "./api";

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
