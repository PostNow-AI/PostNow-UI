import { useQuery } from "@tanstack/react-query";
import { fetchDailyPosts } from "../services/fetchDailyPosts";

export const useDailyPosts = (date: string) => {
  return useQuery({
    queryKey: ["dailyPosts", date],
    queryFn: () => fetchDailyPosts({ date }),
    staleTime: 5 * 60 * 1000 * 60, // 5 hours
  });
};
