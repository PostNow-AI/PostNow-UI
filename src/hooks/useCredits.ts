import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { creditsApiService } from "../lib/credits-api";
import {
  type CreditUsageRequest,
  type StripeCheckoutRequest,
} from "../types/credits";

export const useCreditPackages = () => {
  return useQuery({
    queryKey: ["credit-packages"],
    queryFn: creditsApiService.getCreditPackages,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useUserCredits = () => {
  return useQuery({
    queryKey: ["user-credits"],
    queryFn: creditsApiService.getUserCredits,
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
};

export const useUsageSummary = () => {
  return useQuery({
    queryKey: ["usage-summary"],
    queryFn: creditsApiService.getUsageSummary,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: creditsApiService.getTransactions,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useAIModels = () => {
  return useQuery({
    queryKey: ["ai-models"],
    queryFn: creditsApiService.getAIModels,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useStripeCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StripeCheckoutRequest) =>
      creditsApiService.createStripeCheckout(data),
    onSuccess: () => {
      // Invalida queries relacionadas para atualizar dados
      queryClient.invalidateQueries({ queryKey: ["user-credits"] });
      queryClient.invalidateQueries({ queryKey: ["usage-summary"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useCalculateUsage = () => {
  return useMutation({
    mutationFn: (data: CreditUsageRequest) =>
      creditsApiService.calculateUsageCost(data),
  });
};

export const useDeductCredits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreditUsageRequest) =>
      creditsApiService.deductCredits(data),
    onSuccess: () => {
      // Invalida queries relacionadas para atualizar dados
      queryClient.invalidateQueries({ queryKey: ["user-credits"] });
      queryClient.invalidateQueries({ queryKey: ["usage-summary"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
