import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { StepSuccess } from "../StepSuccess";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  CheckCircle2: () => <span data-testid="icon-check-circle">check</span>,
  ExternalLink: () => <span data-testid="icon-external">external</span>,
  Plus: () => <span data-testid="icon-plus">plus</span>,
}));

describe("StepSuccess", () => {
  const defaultProps = {
    onCreateAnother: vi.fn(),
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

    it("deve renderizar descrição", () => {
      render(<StepSuccess {...defaultProps} />);

      const descs = screen.getAllByText(/Seu post foi criado e adicionado/);
      expect(descs.length).toBeGreaterThan(0);
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

      const buttons = screen.getAllByText("Ver na Biblioteca");
      fireEvent.click(buttons[0]);

      expect(mockNavigate).toHaveBeenCalledWith("/ideabank");
    });

    it("deve chamar onCreateAnother ao clicar em Criar Outro Post", () => {
      render(<StepSuccess {...defaultProps} />);

      const buttons = screen.getAllByText("Criar Outro Post");
      fireEvent.click(buttons[0]);

      expect(defaultProps.onCreateAnother).toHaveBeenCalledTimes(1);
    });
  });

  describe("Card informativo", () => {
    it("deve mostrar informação sobre Biblioteca de Posts", () => {
      render(<StepSuccess {...defaultProps} />);

      const texts = screen.getAllByText(/Biblioteca de Posts/);
      expect(texts.length).toBeGreaterThan(0);
    });
  });
});
