import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
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

  describe("Renderização", () => {
    it("deve renderizar ícone de sucesso", () => {
      render(<StepSuccess {...defaultProps} />);

      expect(screen.getByTestId("icon-check-circle")).toBeInTheDocument();
    });

    it("deve renderizar mensagem de sucesso", () => {
      render(<StepSuccess {...defaultProps} />);

      expect(screen.getByText("Post gerado com sucesso!")).toBeInTheDocument();
    });

    it("deve renderizar descrição", () => {
      render(<StepSuccess {...defaultProps} />);

      expect(
        screen.getByText(/Seu post foi criado e adicionado/)
      ).toBeInTheDocument();
    });

    it("deve renderizar botão Ver na Biblioteca", () => {
      render(<StepSuccess {...defaultProps} />);

      expect(screen.getByText("Ver na Biblioteca")).toBeInTheDocument();
    });

    it("deve renderizar botão Criar Outro Post", () => {
      render(<StepSuccess {...defaultProps} />);

      expect(screen.getByText("Criar Outro Post")).toBeInTheDocument();
    });
  });

  describe("Navegação", () => {
    it("deve navegar para /ideabank ao clicar em Ver na Biblioteca", () => {
      render(<StepSuccess {...defaultProps} />);

      fireEvent.click(screen.getByText("Ver na Biblioteca"));

      expect(mockNavigate).toHaveBeenCalledWith("/ideabank");
    });

    it("deve chamar onCreateAnother ao clicar em Criar Outro Post", () => {
      render(<StepSuccess {...defaultProps} />);

      fireEvent.click(screen.getByText("Criar Outro Post"));

      expect(defaultProps.onCreateAnother).toHaveBeenCalledTimes(1);
    });
  });

  describe("Card informativo", () => {
    it("deve mostrar informação sobre Biblioteca de Posts", () => {
      render(<StepSuccess {...defaultProps} />);

      expect(screen.getByText(/Biblioteca de Posts/)).toBeInTheDocument();
    });
  });
});
