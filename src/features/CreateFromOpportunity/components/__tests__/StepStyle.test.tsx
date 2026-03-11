import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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

  afterEach(() => {
    cleanup();
  });

  describe("Renderização", () => {
    it("deve renderizar o título", () => {
      render(<StepStyle {...defaultProps} />);

      const titles = screen.getAllByText("Escolha o estilo visual");
      expect(titles.length).toBeGreaterThan(0);
    });

    it("deve renderizar todos os estilos visuais", () => {
      render(<StepStyle {...defaultProps} />);

      const style1 = screen.getAllByText("Minimalista Moderno");
      const style2 = screen.getAllByText("Bold Vibrante");
      const style3 = screen.getAllByText("Elegante Editorial");
      expect(style1.length).toBeGreaterThan(0);
      expect(style2.length).toBeGreaterThan(0);
      expect(style3.length).toBeGreaterThan(0);
    });

    it("deve renderizar o botão Voltar", () => {
      render(<StepStyle {...defaultProps} />);

      const buttons = screen.getAllByText("Voltar");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("deve renderizar o botão Gerar Post", () => {
      render(<StepStyle {...defaultProps} />);

      const buttons = screen.getAllByText("Gerar Post");
      expect(buttons.length).toBeGreaterThan(0);
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

      const styles = screen.getAllByText("Minimalista Moderno");
      expect(styles.length).toBeGreaterThan(0);
    });
  });

  describe("Seleção de estilo", () => {
    it("deve chamar onSelectStyle ao clicar em um estilo", () => {
      render(<StepStyle {...defaultProps} />);

      const styles = screen.getAllByText("Minimalista Moderno");
      fireEvent.click(styles[0]);

      expect(defaultProps.onSelectStyle).toHaveBeenCalledWith(1);
    });

    it("deve mostrar check no estilo selecionado", () => {
      render(<StepStyle {...defaultProps} selectedStyleId={1} />);

      const checks = screen.getAllByTestId("icon-check");
      expect(checks.length).toBeGreaterThan(0);
    });
  });

  describe("Navegação", () => {
    it("deve chamar onBack ao clicar em Voltar", () => {
      render(<StepStyle {...defaultProps} />);

      const buttons = screen.getAllByText("Voltar");
      fireEvent.click(buttons[0]);

      expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onGenerate ao clicar em Gerar Post", () => {
      render(<StepStyle {...defaultProps} selectedStyleId={1} />);

      const buttons = screen.getAllByText("Gerar Post");
      fireEvent.click(buttons[0]);

      expect(defaultProps.onGenerate).toHaveBeenCalledTimes(1);
    });
  });

  describe("Validação", () => {
    it("deve desabilitar botão Gerar sem estilo selecionado", () => {
      render(<StepStyle {...defaultProps} selectedStyleId={null} />);

      const buttons = screen.getAllByText("Gerar Post");
      const button = buttons[0].closest("button");
      expect(button).toBeDisabled();
    });

    it("deve habilitar botão Gerar com estilo selecionado", () => {
      render(<StepStyle {...defaultProps} selectedStyleId={1} />);

      const buttons = screen.getAllByText("Gerar Post");
      const button = buttons[0].closest("button");
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

      const imgs = screen.getAllByAltText("Com Imagem");
      expect(imgs[0]).toHaveAttribute("src", "https://example.com/image.png");
    });

    it("deve mostrar placeholder quando sem imagem", () => {
      render(<StepStyle {...defaultProps} />);

      // Deve mostrar a inicial do nome do estilo
      const initials = screen.getAllByText("M"); // Minimalista
      expect(initials.length).toBeGreaterThan(0);
    });
  });
});
