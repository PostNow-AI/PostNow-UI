import { useQuery } from "@tanstack/react-query";
import { fetchDailyPosts } from "../services/fetchDailyPosts";

export const useDailyPosts = () => {
  return useQuery({
    queryKey: ["dailyPosts"],
    queryFn: fetchDailyPosts,
    staleTime: 5 * 60 * 1000 * 60, // 5 hours
  });
};
