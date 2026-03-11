import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { StepGenerate } from "../StepGenerate";

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Loader2: () => <span data-testid="icon-loader">loading</span>,
  Sparkles: () => <span data-testid="icon-sparkles">sparkles</span>,
}));

describe("StepGenerate", () => {
  afterEach(() => {
    cleanup();
  });
  describe("Estado de geração", () => {
    it("deve mostrar spinner quando gerando", () => {
      render(
        <StepGenerate
          isGenerating={true}
          selectedStyle={{ id: 1, name: "Minimalista", description: "Desc" }}
        />
      );

      expect(screen.getByTestId("icon-loader")).toBeInTheDocument();
    });

    it("deve mostrar mensagem de criação quando gerando", () => {
      render(
        <StepGenerate
          isGenerating={true}
          selectedStyle={{ id: 1, name: "Minimalista", description: "Desc" }}
        />
      );

      expect(screen.getByText("Criando seu post...")).toBeInTheDocument();
    });

    it("deve mostrar sparkles quando não gerando", () => {
      render(
        <StepGenerate
          isGenerating={false}
          selectedStyle={{ id: 1, name: "Minimalista", description: "Desc" }}
        />
      );

      expect(screen.getByTestId("icon-sparkles")).toBeInTheDocument();
    });

    it("deve mostrar mensagem de preparação quando não gerando", () => {
      render(
        <StepGenerate
          isGenerating={false}
          selectedStyle={{ id: 1, name: "Minimalista", description: "Desc" }}
        />
      );

      expect(screen.getByText("Preparando...")).toBeInTheDocument();
    });
  });

  describe("Exibição do estilo selecionado", () => {
    it("deve mostrar nome do estilo selecionado", () => {
      render(
        <StepGenerate
          isGenerating={true}
          selectedStyle={{ id: 1, name: "Bold Vibrante", description: "Desc" }}
        />
      );

      expect(screen.getByText("Bold Vibrante")).toBeInTheDocument();
    });

    it("deve mostrar mensagem com estilo", () => {
      render(
        <StepGenerate
          isGenerating={true}
          selectedStyle={{
            id: 1,
            name: "Elegante Editorial",
            description: "Desc",
          }}
        />
      );

      expect(screen.getByText(/Usando estilo/)).toBeInTheDocument();
    });
  });

  describe("Progress bar", () => {
    it("deve mostrar progress bar quando gerando", () => {
      render(
        <StepGenerate
          isGenerating={true}
          selectedStyle={{ id: 1, name: "Minimalista", description: "Desc" }}
        />
      );

      expect(screen.getByText("Gerando conteúdo...")).toBeInTheDocument();
    });

    it("não deve mostrar progress bar quando não gerando", () => {
      render(
        <StepGenerate
          isGenerating={false}
          selectedStyle={{ id: 1, name: "Minimalista", description: "Desc" }}
        />
      );

      expect(screen.queryByText("Gerando conteúdo...")).not.toBeInTheDocument();
    });
  });
});
