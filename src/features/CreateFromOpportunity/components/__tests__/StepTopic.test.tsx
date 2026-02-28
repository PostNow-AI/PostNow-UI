import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { StepTopic } from "../StepTopic";

describe("StepTopic", () => {
  const defaultProps = {
    topic: "IA substituindo empregos",
    category: "polemica" as const,
    score: 95,
    furtherDetails: "",
    onFurtherDetailsChange: vi.fn(),
    onNext: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderização", () => {
    it("deve renderizar o tópico", () => {
      render(<StepTopic {...defaultProps} />);

      expect(screen.getByText("IA substituindo empregos")).toBeInTheDocument();
    });

    it("deve renderizar o badge da categoria", () => {
      render(<StepTopic {...defaultProps} />);

      expect(screen.getByText(/Polêmico/)).toBeInTheDocument();
    });

    it("deve renderizar o score", () => {
      render(<StepTopic {...defaultProps} />);

      expect(screen.getByText("95/100")).toBeInTheDocument();
    });

    it("deve renderizar o textarea para detalhes", () => {
      render(<StepTopic {...defaultProps} />);

      expect(
        screen.getByPlaceholderText(/Foque em dados do mercado brasileiro/)
      ).toBeInTheDocument();
    });

    it("deve renderizar o botão Continuar", () => {
      render(<StepTopic {...defaultProps} />);

      expect(screen.getByText("Continuar")).toBeInTheDocument();
    });
  });

  describe("Interações", () => {
    it("deve chamar onFurtherDetailsChange ao digitar", () => {
      render(<StepTopic {...defaultProps} />);

      const textarea = screen.getByPlaceholderText(
        /Foque em dados do mercado brasileiro/
      );
      fireEvent.change(textarea, { target: { value: "Detalhes extras" } });

      expect(defaultProps.onFurtherDetailsChange).toHaveBeenCalledWith(
        "Detalhes extras"
      );
    });

    it("deve chamar onNext ao clicar em Continuar", () => {
      render(<StepTopic {...defaultProps} />);

      fireEvent.click(screen.getByText("Continuar"));

      expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    });
  });

  describe("Categorias diferentes", () => {
    it("deve mostrar badge correto para educativo", () => {
      render(<StepTopic {...defaultProps} category="educativo" />);

      expect(screen.getByText(/Educativo/)).toBeInTheDocument();
    });

    it("deve mostrar badge correto para newsjacking", () => {
      render(<StepTopic {...defaultProps} category="newsjacking" />);

      expect(screen.getByText(/Newsjacking/)).toBeInTheDocument();
    });

    it("deve mostrar badge correto para entretenimento", () => {
      render(<StepTopic {...defaultProps} category="entretenimento" />);

      expect(screen.getByText(/Entretenimento/)).toBeInTheDocument();
    });
  });

  describe("Valores pré-preenchidos", () => {
    it("deve mostrar furtherDetails quando fornecido", () => {
      render(
        <StepTopic {...defaultProps} furtherDetails="Detalhes pré-existentes" />
      );

      const textarea = screen.getByPlaceholderText(
        /Foque em dados do mercado brasileiro/
      );
      expect(textarea).toHaveValue("Detalhes pré-existentes");
    });

    it("deve mostrar tópico vazio quando não fornecido", () => {
      render(<StepTopic {...defaultProps} topic="" />);

      expect(screen.getByText("Tema da Oportunidade")).toBeInTheDocument();
    });
  });
});
