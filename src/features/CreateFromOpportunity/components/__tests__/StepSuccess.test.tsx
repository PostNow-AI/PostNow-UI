import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { StepSuccess } from "../StepSuccess";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  CheckCircle2: () => <span data-testid="icon-check-circle">check</span>,
  ExternalLink: () => <span data-testid="icon-external">external</span>,
  Plus: () => <span data-testid="icon-plus">plus</span>,
  Download: () => <span data-testid="icon-download">download</span>,
  Copy: () => <span data-testid="icon-copy">copy</span>,
}));

describe("StepSuccess", () => {
  const defaultProps = {
    onCreateAnother: vi.fn(),
    generatedContent: "Este é o conteúdo do post gerado #marketing #ia",
    generatedImageUrl: "https://example.com/image.png",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Renderização", () => {
    it("deve renderizar ícone de sucesso", () => {
      render(<StepSuccess {...defaultProps} />);

      const icons = screen.getAllByTestId("icon-check-circle");
      expect(icons.length).toBeGreaterThan(0);
    });

    it("deve renderizar mensagem de sucesso", () => {
      render(<StepSuccess {...defaultProps} />);

      const messages = screen.getAllByText("Post gerado com sucesso!");
      expect(messages.length).toBeGreaterThan(0);
    });

    it("deve renderizar conteúdo gerado", () => {
      render(<StepSuccess {...defaultProps} />);

      const content = screen.getByText(/Este é o conteúdo do post gerado/);
      expect(content).toBeInTheDocument();
    });

    it("deve renderizar imagem gerada", () => {
      render(<StepSuccess {...defaultProps} />);

      const image = screen.getByAltText("Post gerado");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", defaultProps.generatedImageUrl);
    });

    it("deve renderizar botão Ver na Biblioteca", () => {
      render(<StepSuccess {...defaultProps} />);

      const buttons = screen.getAllByText("Ver na Biblioteca");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("deve renderizar botão Criar Outro Post", () => {
      render(<StepSuccess {...defaultProps} />);

      const buttons = screen.getAllByText("Criar Outro Post");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe("Navegação", () => {
    it("deve navegar para /ideabank ao clicar em Ver na Biblioteca", () => {
      render(<StepSuccess {...defaultProps} />);

      const button = screen.getAllByRole("button").find(btn => btn.textContent?.includes("Ver na Biblioteca"));
      expect(button).toBeDefined();
      fireEvent.click(button!);

      expect(mockNavigate).toHaveBeenCalledWith("/ideabank");
    });

    it("deve chamar onCreateAnother ao clicar em Criar Outro Post", () => {
      render(<StepSuccess {...defaultProps} />);

      const buttons = screen.getAllByText("Criar Outro Post");
      fireEvent.click(buttons[0]);

      expect(defaultProps.onCreateAnother).toHaveBeenCalledTimes(1);
    });
  });

  describe("Ações de conteúdo", () => {
    it("deve mostrar botão de copiar conteúdo", () => {
      render(<StepSuccess {...defaultProps} />);

      const copyButton = screen.getByText("Copiar");
      expect(copyButton).toBeInTheDocument();
    });

    it("deve mostrar botão de baixar imagem", () => {
      render(<StepSuccess {...defaultProps} />);

      const downloadButton = screen.getByText("Baixar");
      expect(downloadButton).toBeInTheDocument();
    });

    it("não deve renderizar imagem quando generatedImageUrl é null", () => {
      render(<StepSuccess {...defaultProps} generatedImageUrl={null} />);

      const image = screen.queryByAltText("Post gerado");
      expect(image).not.toBeInTheDocument();
    });

    it("não deve renderizar conteúdo quando generatedContent é null", () => {
      render(<StepSuccess {...defaultProps} generatedContent={null} />);

      const copyButton = screen.queryByText("Copiar");
      expect(copyButton).not.toBeInTheDocument();
    });
  });
});
