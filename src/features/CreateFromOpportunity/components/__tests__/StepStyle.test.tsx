import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { StepStyle } from "../StepStyle";
import type { VisualStyle } from "../../types";

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Sparkles: () => <span data-testid="icon-sparkles">sparkles</span>,
  ArrowLeft: () => <span data-testid="icon-arrow-left">arrow</span>,
  Check: () => <span data-testid="icon-check">check</span>,
}));

describe("StepStyle", () => {
  const mockStyles: VisualStyle[] = [
    { id: 1, name: "Minimalista Moderno", description: "Design limpo" },
    { id: 2, name: "Bold Vibrante", description: "Cores fortes" },
    { id: 3, name: "Elegante Editorial", description: "Sofisticado" },
  ];

  const defaultProps = {
    visualStyles: mockStyles,
    isLoading: false,
    selectedStyleId: null,
    onSelectStyle: vi.fn(),
    onBack: vi.fn(),
    onGenerate: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderização", () => {
    it("deve renderizar o título", () => {
      render(<StepStyle {...defaultProps} />);

      expect(screen.getByText("Escolha o estilo visual")).toBeInTheDocument();
    });

    it("deve renderizar todos os estilos visuais", () => {
      render(<StepStyle {...defaultProps} />);

      expect(screen.getByText("Minimalista Moderno")).toBeInTheDocument();
      expect(screen.getByText("Bold Vibrante")).toBeInTheDocument();
      expect(screen.getByText("Elegante Editorial")).toBeInTheDocument();
    });

    it("deve renderizar o botão Voltar", () => {
      render(<StepStyle {...defaultProps} />);

      expect(screen.getByText("Voltar")).toBeInTheDocument();
    });

    it("deve renderizar o botão Gerar Post", () => {
      render(<StepStyle {...defaultProps} />);

      expect(screen.getByText("Gerar Post")).toBeInTheDocument();
    });
  });

  describe("Estado de Loading", () => {
    it("deve mostrar skeletons quando loading", () => {
      render(<StepStyle {...defaultProps} isLoading={true} />);

      // Não deve mostrar os estilos
      expect(screen.queryByText("Minimalista Moderno")).not.toBeInTheDocument();
    });

    it("deve mostrar estilos após loading", () => {
      render(<StepStyle {...defaultProps} isLoading={false} />);

      expect(screen.getByText("Minimalista Moderno")).toBeInTheDocument();
    });
  });

  describe("Seleção de estilo", () => {
    it("deve chamar onSelectStyle ao clicar em um estilo", () => {
      render(<StepStyle {...defaultProps} />);

      fireEvent.click(screen.getByText("Minimalista Moderno"));

      expect(defaultProps.onSelectStyle).toHaveBeenCalledWith(1);
    });

    it("deve mostrar check no estilo selecionado", () => {
      render(<StepStyle {...defaultProps} selectedStyleId={1} />);

      expect(screen.getByTestId("icon-check")).toBeInTheDocument();
    });
  });

  describe("Navegação", () => {
    it("deve chamar onBack ao clicar em Voltar", () => {
      render(<StepStyle {...defaultProps} />);

      fireEvent.click(screen.getByText("Voltar"));

      expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onGenerate ao clicar em Gerar Post", () => {
      render(<StepStyle {...defaultProps} selectedStyleId={1} />);

      fireEvent.click(screen.getByText("Gerar Post"));

      expect(defaultProps.onGenerate).toHaveBeenCalledTimes(1);
    });
  });

  describe("Validação", () => {
    it("deve desabilitar botão Gerar sem estilo selecionado", () => {
      render(<StepStyle {...defaultProps} selectedStyleId={null} />);

      const button = screen.getByText("Gerar Post").closest("button");
      expect(button).toBeDisabled();
    });

    it("deve habilitar botão Gerar com estilo selecionado", () => {
      render(<StepStyle {...defaultProps} selectedStyleId={1} />);

      const button = screen.getByText("Gerar Post").closest("button");
      expect(button).not.toBeDisabled();
    });
  });

  describe("Preview de imagem", () => {
    it("deve mostrar imagem quando preview_image_url existe", () => {
      const stylesWithImages: VisualStyle[] = [
        {
          id: 1,
          name: "Com Imagem",
          description: "Desc",
          preview_image_url: "https://example.com/image.png",
        },
      ];

      render(<StepStyle {...defaultProps} visualStyles={stylesWithImages} />);

      const img = screen.getByAltText("Com Imagem");
      expect(img).toHaveAttribute("src", "https://example.com/image.png");
    });

    it("deve mostrar placeholder quando sem imagem", () => {
      render(<StepStyle {...defaultProps} />);

      // Deve mostrar a inicial do nome do estilo
      expect(screen.getByText("M")).toBeInTheDocument(); // Minimalista
    });
  });
});
