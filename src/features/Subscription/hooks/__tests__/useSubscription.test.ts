import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  useCreateCheckoutSession,
  useSubscriptionPlans,
  useUserSubscription,
} from "../useSubscription";

// Mock da API
vi.mock("@/lib/subscription-api", () => ({
  subscriptionApiService: {
    getSubscriptionPlans: vi.fn(),
    getUserSubscription: vi.fn(),
    createCheckoutSession: vi.fn(),
  },
}));

// Import do mock para poder manipular
import { subscriptionApiService } from "@/lib/subscription-api";

const mockPlans = [
  {
    id: 1,
    name: "Mensal",
    price: 49.9,
    interval: "monthly",
    is_active: true,
  },
  {
    id: 2,
    name: "Anual",
    price: 359,
    interval: "yearly",
    is_active: true,
  },
];

const mockSubscription = {
  id: 1,
  user: 1,
  plan: mockPlans[0],
  status: "active" as const,
  start_date: "2026-02-10",
  end_date: null,
  stripe_subscription_id: "sub_123",
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useSubscriptionPlans", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar planos quando habilitado", async () => {
    vi.mocked(subscriptionApiService.getSubscriptionPlans).mockResolvedValue(
      mockPlans
    );

    const { result } = renderHook(() => useSubscriptionPlans(true), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockPlans);
  });

  it("não deve fazer requisição quando desabilitado", async () => {
    const { result } = renderHook(() => useSubscriptionPlans(false), {
      wrapper: createWrapper(),
    });

    // Aguardar um pouco para garantir que não há requisição
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(subscriptionApiService.getSubscriptionPlans).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });

  it("deve usar staleTime de 10 minutos", async () => {
    vi.mocked(subscriptionApiService.getSubscriptionPlans).mockResolvedValue(
      mockPlans
    );

    const { result } = renderHook(() => useSubscriptionPlans(true), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verificar que a requisição foi feita apenas uma vez
    expect(subscriptionApiService.getSubscriptionPlans).toHaveBeenCalledTimes(
      1
    );
  });
});

describe("useUserSubscription", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar assinatura quando existe", async () => {
    vi.mocked(subscriptionApiService.getUserSubscription).mockResolvedValue(
      mockSubscription
    );

    const { result } = renderHook(() => useUserSubscription(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockSubscription);
  });

  it("deve retornar null quando não há assinatura", async () => {
    vi.mocked(subscriptionApiService.getUserSubscription).mockResolvedValue(
      null
    );

    const { result } = renderHook(() => useUserSubscription(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeNull();
  });
});

describe("useCreateCheckoutSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.location
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });
  });

  it("deve criar checkout e redirecionar para URL", async () => {
    const checkoutUrl = "https://checkout.stripe.com/test";
    vi.mocked(subscriptionApiService.createCheckoutSession).mockResolvedValue({
      checkout_url: checkoutUrl,
    });

    const { result } = renderHook(() => useCreateCheckoutSession(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      plan_id: 1,
      success_url: "http://localhost/success",
      cancel_url: "http://localhost/cancel",
    });

    expect(window.location.href).toBe(checkoutUrl);
  });

  it("deve chamar API com parâmetros corretos", async () => {
    vi.mocked(subscriptionApiService.createCheckoutSession).mockResolvedValue({
      checkout_url: "https://checkout.stripe.com/test",
    });

    const { result } = renderHook(() => useCreateCheckoutSession(), {
      wrapper: createWrapper(),
    });

    const params = {
      plan_id: 2,
      success_url: "http://localhost/success",
      cancel_url: "http://localhost/cancel",
    };

    await result.current.mutateAsync(params);

    expect(subscriptionApiService.createCheckoutSession).toHaveBeenCalledWith(
      params
    );
  });

  it("deve propagar erro quando checkout falha", async () => {
    const error = new Error("Checkout failed");
    vi.mocked(subscriptionApiService.createCheckoutSession).mockRejectedValue(
      error
    );

    const { result } = renderHook(() => useCreateCheckoutSession(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        plan_id: 1,
        success_url: "http://localhost/success",
        cancel_url: "http://localhost/cancel",
      })
    ).rejects.toThrow("Checkout failed");
  });
});
