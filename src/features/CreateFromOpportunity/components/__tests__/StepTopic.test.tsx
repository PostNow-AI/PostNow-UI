import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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

  afterEach(() => {
    cleanup();
  });

  describe("Renderização", () => {
    it("deve renderizar o tópico", () => {
      render(<StepTopic {...defaultProps} />);
      const topics = screen.getAllByText("IA substituindo empregos");
      expect(topics.length).toBeGreaterThan(0);
    });

    it("deve renderizar o badge da categoria", () => {
      render(<StepTopic {...defaultProps} />);
      const badges = screen.getAllByText(/Polêmico/);
      expect(badges.length).toBeGreaterThan(0);
    });

    it("deve renderizar o score", () => {
      render(<StepTopic {...defaultProps} />);
      const scores = screen.getAllByText("95/100");
      expect(scores.length).toBeGreaterThan(0);
    });

    it("deve renderizar o textarea para detalhes", () => {
      render(<StepTopic {...defaultProps} />);
      const textareas = screen.getAllByPlaceholderText(/Foque em dados do mercado brasileiro/);
      expect(textareas.length).toBeGreaterThan(0);
    });

    it("deve renderizar o botão Continuar", () => {
      render(<StepTopic {...defaultProps} />);
      const buttons = screen.getAllByText("Continuar");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe("Interações", () => {
    it("deve chamar onFurtherDetailsChange ao digitar", () => {
      render(<StepTopic {...defaultProps} />);
      const textareas = screen.getAllByPlaceholderText(
        /Foque em dados do mercado brasileiro/
      );
      fireEvent.change(textareas[0], { target: { value: "Detalhes extras" } });
      expect(defaultProps.onFurtherDetailsChange).toHaveBeenCalledWith(
        "Detalhes extras"
      );
    });

    it("deve chamar onNext ao clicar em Continuar", () => {
      render(<StepTopic {...defaultProps} />);
      const buttons = screen.getAllByText("Continuar");
      fireEvent.click(buttons[0]);
      expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    });
  });

  describe("Categorias diferentes", () => {
    it("deve mostrar badge correto para educativo", () => {
      render(<StepTopic {...defaultProps} category="educativo" />);
      const badges = screen.getAllByText(/Educativo/);
      expect(badges.length).toBeGreaterThan(0);
    });

    it("deve mostrar badge correto para newsjacking", () => {
      render(<StepTopic {...defaultProps} category="newsjacking" />);
      const badges = screen.getAllByText(/Newsjacking/);
      expect(badges.length).toBeGreaterThan(0);
    });

    it("deve mostrar badge correto para entretenimento", () => {
      render(<StepTopic {...defaultProps} category="entretenimento" />);
      const badges = screen.getAllByText(/Entretenimento/);
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  describe("Valores pré-preenchidos", () => {
    it("deve mostrar furtherDetails quando fornecido", () => {
      render(
        <StepTopic {...defaultProps} furtherDetails="Detalhes pré-existentes" />
      );
      const textareas = screen.getAllByPlaceholderText(
        /Foque em dados do mercado brasileiro/
      );
      expect(textareas[0]).toHaveValue("Detalhes pré-existentes");
    });

    it("deve mostrar tópico vazio quando não fornecido", () => {
      render(<StepTopic {...defaultProps} topic="" />);
      const titles = screen.getAllByText("Tema da Oportunidade");
      expect(titles.length).toBeGreaterThan(0);
    });
  });
});
