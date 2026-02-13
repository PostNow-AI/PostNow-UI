import { useQuery } from "@tanstack/react-query";
import { subscriptionApiService } from "@/lib/subscription-api";

export const usePaymentStatus = () => {
  return useQuery({
    queryKey: ["payment-status"],
    queryFn: subscriptionApiService.checkPaymentStatus,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Poll every 2 minutes
    retry: 1,
  });
};
