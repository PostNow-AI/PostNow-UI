/**
 * Hook for scheduled post statistics.
 */

import { useQuery } from "@tanstack/react-query";
import { instagramSchedulingService } from "../services";

/**
 * Hook to fetch scheduled post statistics.
 */
export function useScheduledPostStats() {
  return useQuery({
    queryKey: ["scheduled-post-stats"],
    queryFn: () => instagramSchedulingService.getStats(),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}
