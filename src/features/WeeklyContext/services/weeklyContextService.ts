import { api } from "@/lib/api";
import type { WeeklyContextResponse } from "../types";

export const weeklyContextService = {
  getCurrent: async (): Promise<WeeklyContextResponse> => {
    const response = await api.get("/api/v1/client-context/weekly-context/");
    return response.data;
  },

  getHistory: async (offset: number): Promise<WeeklyContextResponse> => {
    const response = await api.get(
      "/api/v1/client-context/weekly-context/history/",
      {
        params: { offset },
      }
    );
    return response.data;
  },
};

