import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MobileStepIndicator } from "../MobileStepIndicator";

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Check: () => <span data-testid="icon-check">check</span>,
}));

describe("MobileStepIndicator", () => {
  describe("Renderização básica", () => {
    it("deve renderizar o número correto de passos", () => {
      render(<MobileStepIndicator currentStep={1} totalSteps={3} />);

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("deve renderizar 4 passos quando totalSteps é 4", () => {
      render(<MobileStepIndicator currentStep={1} totalSteps={4} />);

      expect(screen.getByText("4")).toBeInTheDocument();
    });
  });

  describe("Estado dos passos", () => {
    it("deve mostrar check para passos completados", () => {
      render(<MobileStepIndicator currentStep={3} totalSteps={3} />);

      // Passos 1 e 2 devem ter check
      const checks = screen.getAllByTestId("icon-check");
      expect(checks).toHaveLength(2);
    });

    it("deve mostrar número para passo atual", () => {
      render(<MobileStepIndicator currentStep={2} totalSteps={3} />);

      // Passo 1 tem check, passo 2 mostra número
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("deve mostrar número para passos futuros", () => {
      render(<MobileStepIndicator currentStep={1} totalSteps={3} />);

      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  describe("Conectores entre passos", () => {
    it("deve ter conectores entre passos", () => {
      const { container } = render(
        <MobileStepIndicator currentStep={1} totalSteps={3} />
      );

      // Deve ter 2 conectores (entre 1-2 e 2-3)
      // Os conectores são divs com width 8 e height 0.5
      const connectors = container.querySelectorAll(".h-0\\.5");
      expect(connectors.length).toBe(2);
    });
  });

  describe("Edge cases", () => {
    it("deve funcionar com apenas 1 passo", () => {
      render(<MobileStepIndicator currentStep={1} totalSteps={1} />);

      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("deve funcionar no último passo", () => {
      render(<MobileStepIndicator currentStep={3} totalSteps={3} />);

      // Todos os passos anteriores devem ter check
      const checks = screen.getAllByTestId("icon-check");
      expect(checks).toHaveLength(2);

      // Passo atual mostra número
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });
});
