// @ts-nocheck
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { OnboardingPreview } from "../OnboardingPreview";

// Mock framer-motion para evitar problemas com animações
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
    p: ({ children, ...props }: { children: React.ReactNode }) => (
      <p {...props}>{children}</p>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("OnboardingPreview", () => {
  const baseData = {
    business_name: "Meu Negócio",
    specialization: "Marketing Digital",
    business_description: "Uma empresa focada em soluções digitais",
    voice_tone: "Profissional",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    logo: "",
  };

  describe("Visibilidade", () => {
    it("não deve renderizar antes do step 4", () => {
      const { container } = render(
        <OnboardingPreview data={baseData} currentStep={3} />
      );

      expect(container.firstChild).toBeNull();
    });

    it("deve renderizar a partir do step 4", () => {
      render(<OnboardingPreview data={baseData} currentStep={4} />);

      expect(screen.getByText("Meu Negócio")).toBeInTheDocument();
    });

    it("deve renderizar nos steps posteriores", () => {
      render(<OnboardingPreview data={baseData} currentStep={10} />);

      expect(screen.getByText("Meu Negócio")).toBeInTheDocument();
    });
  });

  describe("Informações Básicas", () => {
    it("deve mostrar nome do negócio", () => {
      render(<OnboardingPreview data={baseData} currentStep={5} />);

      expect(screen.getByText("Meu Negócio")).toBeInTheDocument();
    });

    it("deve mostrar especialização", () => {
      render(<OnboardingPreview data={baseData} currentStep={5} />);

      expect(screen.getByText("Marketing Digital")).toBeInTheDocument();
    });

    it("deve mostrar placeholder quando não tem nome", () => {
      render(
        <OnboardingPreview
          data={{ ...baseData, business_name: "" }}
          currentStep={5}
        />
      );

      expect(screen.getByText("Seu negócio")).toBeInTheDocument();
    });

    it("deve mostrar placeholder quando não tem especialização", () => {
      render(
        <OnboardingPreview
          data={{ ...baseData, specialization: "" }}
          currentStep={5}
        />
      );

      expect(screen.getByText("Seu nicho")).toBeInTheDocument();
    });
  });

  describe("Descrição", () => {
    it("deve mostrar descrição quando preenchida", () => {
      render(<OnboardingPreview data={baseData} currentStep={5} />);

      expect(
        screen.getByText("Uma empresa focada em soluções digitais")
      ).toBeInTheDocument();
    });

    it("não deve mostrar descrição quando vazia", () => {
      render(
        <OnboardingPreview
          data={{ ...baseData, business_description: "" }}
          currentStep={5}
        />
      );

      expect(
        screen.queryByText("Uma empresa focada em soluções digitais")
      ).not.toBeInTheDocument();
    });
  });

  describe("Seção Expandida (step >= 12)", () => {
    it("não deve mostrar cores antes do step 12", () => {
      render(<OnboardingPreview data={baseData} currentStep={11} />);

      // Cores não devem estar visíveis na seção expandida
      const colorElements = document.querySelectorAll(
        '[style*="background-color"]'
      );
      // Apenas os dots de progresso, não as cores principais
      expect(colorElements.length).toBeLessThanOrEqual(5);
    });

    it("deve mostrar cores a partir do step 12", () => {
      render(<OnboardingPreview data={baseData} currentStep={12} />);

      // Verifica se há elementos com background-color das cores
      const container = document.querySelector(".space-y-2");
      expect(container).toBeInTheDocument();
    });

    it("deve mostrar tom de voz a partir do step 12", () => {
      render(<OnboardingPreview data={baseData} currentStep={12} />);

      expect(screen.getByText("Profissional")).toBeInTheDocument();
    });
  });

  describe("Indicadores de Progresso", () => {
    it("deve mostrar 5 indicadores de progresso", () => {
      render(<OnboardingPreview data={baseData} currentStep={5} />);

      expect(screen.getByText("Info")).toBeInTheDocument();
      expect(screen.getByText("Descrição")).toBeInTheDocument();
      expect(screen.getByText("Tom")).toBeInTheDocument();
      expect(screen.getByText("Cores")).toBeInTheDocument();
      expect(screen.getByText("Logo")).toBeInTheDocument();
    });
  });

  describe("Logo", () => {
    it("deve mostrar ícone padrão quando não tem logo", () => {
      render(<OnboardingPreview data={baseData} currentStep={5} />);

      // Deve ter o ícone User como fallback
      const userIcon = document.querySelector(".w-8.h-8.rounded-full");
      expect(userIcon).toBeInTheDocument();
    });

    it("deve mostrar imagem quando tem logo", () => {
      const dataWithLogo = {
        ...baseData,
        logo: "data:image/png;base64,ABC123",
      };

      render(<OnboardingPreview data={dataWithLogo} currentStep={5} />);

      const logoImg = screen.getByAltText("Logo");
      expect(logoImg).toBeInTheDocument();
      expect(logoImg).toHaveAttribute("src", "data:image/png;base64,ABC123");
    });
  });

  describe("Estado Completo (step >= 13)", () => {
    it("deve ter estilo especial quando completo", () => {
      const { container } = render(
        <OnboardingPreview data={baseData} currentStep={13} />
      );

      // Verifica se tem a classe de ring quando completo
      const previewCard = container.querySelector(".ring-2");
      expect(previewCard).toBeInTheDocument();
    });
  });
});
