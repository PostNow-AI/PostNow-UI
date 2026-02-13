import { queryClient } from "@/lib/queryClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subscriptionApiService } from "../../../lib/subscription-api";
import { type StripeCheckoutSessionRequest } from "../../../types/subscription";

export const useSubscriptionPlans = (enabled = true) => {
  return useQuery({
    queryKey: ["subscription-plans"],
    queryFn: subscriptionApiService.getSubscriptionPlans,
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled,
  });
};

export const useUserSubscription = (enabled = true) => {
  return useQuery({
    queryKey: ["user-subscription"],
    queryFn: subscriptionApiService.getUserSubscription,
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled,
  });
};

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: (data: StripeCheckoutSessionRequest) =>
      subscriptionApiService.createCheckoutSession(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
      // Redirect to Stripe checkout
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscriptionApiService.cancelSubscription,
    onSuccess: () => {
      // Invalidate user subscription query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    },
  });
};
