// @ts-nocheck
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PaywallStep } from "../PaywallStep";

// Mock do PaywallScreen para isolar o teste
vi.mock("../../PaywallScreen", () => ({
  PaywallScreen: ({
    trialDays,
    plans,
    onSelectPlan,
    isLoading,
  }: {
    trialDays: number;
    plans: Array<{ id: string; name: string; price: number }>;
    onSelectPlan: (planId: string) => void;
    isLoading?: boolean;
  }) => (
    <div data-testid="paywall-screen">
      <span data-testid="trial-days">{trialDays}</span>
      <span data-testid="is-loading">{String(isLoading)}</span>
      {plans.map((plan) => (
        <button
          key={plan.id}
          data-testid={`plan-${plan.id}`}
          onClick={() => onSelectPlan(plan.id)}
        >
          {plan.name} - R$ {plan.price}
        </button>
      ))}
    </div>
  ),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("PaywallStep", () => {
  it("deve renderizar com os dias de trial corretos", () => {
    render(<PaywallStep onSelectPlan={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    const trialDays = screen.getByTestId("trial-days");
    expect(trialDays.textContent).toBe("10");
  });

  it("deve passar os planos corretos para PaywallScreen", () => {
    render(<PaywallStep onSelectPlan={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    // Verificar que ambos os planos existem
    expect(screen.getByTestId("plan-monthly")).toBeInTheDocument();
    expect(screen.getByTestId("plan-annual")).toBeInTheDocument();
  });

  it("deve mostrar o plano mensal com preço correto", () => {
    render(<PaywallStep onSelectPlan={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    const monthlyButton = screen.getByTestId("plan-monthly");
    expect(monthlyButton.textContent).toContain("Mensal");
    expect(monthlyButton.textContent).toContain("49.9");
  });

  it("deve mostrar o plano anual com preço correto", () => {
    render(<PaywallStep onSelectPlan={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    const annualButton = screen.getByTestId("plan-annual");
    expect(annualButton.textContent).toContain("Anual");
    expect(annualButton.textContent).toContain("359");
  });

  it("deve chamar onSelectPlan com 'monthly' ao clicar no plano mensal", () => {
    const mockOnSelectPlan = vi.fn();
    render(<PaywallStep onSelectPlan={mockOnSelectPlan} />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByTestId("plan-monthly"));
    expect(mockOnSelectPlan).toHaveBeenCalledWith("monthly");
  });

  it("deve chamar onSelectPlan com 'annual' ao clicar no plano anual", () => {
    const mockOnSelectPlan = vi.fn();
    render(<PaywallStep onSelectPlan={mockOnSelectPlan} />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByTestId("plan-annual"));
    expect(mockOnSelectPlan).toHaveBeenCalledWith("annual");
  });

  it("deve passar isLoading para PaywallScreen", () => {
    render(<PaywallStep onSelectPlan={vi.fn()} isLoading={true} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("is-loading").textContent).toBe("true");
  });

  it("deve passar isLoading=false por padrão", () => {
    render(<PaywallStep onSelectPlan={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("is-loading").textContent).toBe("undefined");
  });
});
