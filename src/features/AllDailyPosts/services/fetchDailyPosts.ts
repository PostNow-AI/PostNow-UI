import { api } from "@/lib/api";
import type { DailyPostsResponse } from "../types";

export const fetchDailyPosts = async ({
  date,
}: {
  date: string;
}): Promise<DailyPostsResponse> => {
  const response = await api.get<DailyPostsResponse>(
    `/api/v1/ideabank/admin/fetch-all-daily/?date=${date}`,
  );
  return response.data;
};
