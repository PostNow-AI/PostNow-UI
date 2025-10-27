import { useQuery } from "@tanstack/react-query";
import { ideaBankService } from "../services";

export const usePostStats = () => {
  return useQuery({
    queryKey: ["post-stats"],
    queryFn: ideaBankService.getPostStats,
  });
};
