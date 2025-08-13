import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface SubscriptionStatus {
  subscribed: boolean;
  subscription_date: string | null;
  message: string;
}

export const useSubscription = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["subscription-status"],
    queryFn: async (): Promise<SubscriptionStatus> => {
      const response = await api.get("/api/v1/auth/subscription/status/");
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    subscriptionStatus: data,
    isLoading,
    error,
    refetch,
    isSubscribed: data?.subscribed ?? false,
  };
};
