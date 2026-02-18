// Tests for Onboarding components
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AuthProgressIndicator } from "../AuthProgressIndicator";

// Mock framer-motion para evitar problemas com animações
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, style, ...props }: { children: React.ReactNode; style?: React.CSSProperties }) => (
      <div {...props} style={style}>{children}</div>
    ),
  },
}));

describe("AuthProgressIndicator", () => {
  describe("Renderização", () => {
    it("deve renderizar o texto de etapa", () => {
      render(<AuthProgressIndicator currentStep={15} totalSteps={16} />);

      expect(screen.getByText("Etapa 15 de 16")).toBeInTheDocument();
    });

    it("deve renderizar a barra de progresso", () => {
      const { container } = render(
        <AuthProgressIndicator currentStep={8} totalSteps={16} />
      );

      // Barra de fundo
      const progressBar = container.querySelector(".bg-muted");
      expect(progressBar).toBeInTheDocument();
    });

    it("deve aplicar className customizada", () => {
      const { container } = render(
        <AuthProgressIndicator currentStep={1} totalSteps={10} className="mb-4" />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("mb-4");
    });
  });

  describe("Cálculo de progresso", () => {
    it("deve mostrar 0% no início", () => {
      render(<AuthProgressIndicator currentStep={0} totalSteps={16} />);

      expect(screen.getByText("Etapa 0 de 16")).toBeInTheDocument();
    });

    it("deve mostrar progresso intermediário", () => {
      render(<AuthProgressIndicator currentStep={8} totalSteps={16} />);

      expect(screen.getByText("Etapa 8 de 16")).toBeInTheDocument();
    });

    it("deve mostrar 100% no final", () => {
      render(<AuthProgressIndicator currentStep={16} totalSteps={16} />);

      expect(screen.getByText("Etapa 16 de 16")).toBeInTheDocument();
    });

    it("deve lidar com diferentes totais de steps", () => {
      render(<AuthProgressIndicator currentStep={5} totalSteps={10} />);

      expect(screen.getByText("Etapa 5 de 10")).toBeInTheDocument();
    });
  });

  describe("Estilização", () => {
    it("deve ter max-width de md", () => {
      const { container } = render(
        <AuthProgressIndicator currentStep={1} totalSteps={16} />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("max-w-md");
    });

    it("deve centralizar o conteúdo", () => {
      const { container } = render(
        <AuthProgressIndicator currentStep={1} totalSteps={16} />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("mx-auto");
    });

    it("deve ter texto centralizado e muted", () => {
      render(<AuthProgressIndicator currentStep={1} totalSteps={16} />);

      const text = screen.getByText(/Etapa/);
      expect(text).toHaveClass("text-center");
      expect(text).toHaveClass("text-muted-foreground");
    });

    it("deve ter barra de progresso com altura correta", () => {
      const { container } = render(
        <AuthProgressIndicator currentStep={1} totalSteps={16} />
      );

      const progressBar = container.querySelector(".h-1");
      expect(progressBar).toBeInTheDocument();
    });

    it("deve ter barra de progresso com bordas arredondadas", () => {
      const { container } = render(
        <AuthProgressIndicator currentStep={1} totalSteps={16} />
      );

      const progressBar = container.querySelector(".rounded-full");
      expect(progressBar).toBeInTheDocument();
    });
  });
});
