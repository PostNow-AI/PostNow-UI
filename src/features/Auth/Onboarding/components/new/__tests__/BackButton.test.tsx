// Tests for Onboarding components
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BackButton } from "../BackButton";

describe("BackButton", () => {
  describe("Variante text (padrão)", () => {
    it("deve renderizar com texto 'Voltar' por padrão", () => {
      render(<BackButton onClick={vi.fn()} />);

      expect(screen.getByText("Voltar")).toBeInTheDocument();
    });

    it("deve renderizar com label customizado", () => {
      render(<BackButton onClick={vi.fn()} label="Cancelar" />);

      expect(screen.getByText("Cancelar")).toBeInTheDocument();
    });

    it("deve chamar onClick ao clicar", () => {
      const handleClick = vi.fn();
      render(<BackButton onClick={handleClick} />);

      fireEvent.click(screen.getByText("Voltar"));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("deve aplicar className customizada", () => {
      render(<BackButton onClick={vi.fn()} className="mt-4" />);

      const button = screen.getByText("Voltar");
      expect(button).toHaveClass("mt-4");
    });

    it("deve ter estilo de texto centralizado", () => {
      render(<BackButton onClick={vi.fn()} />);

      const button = screen.getByText("Voltar");
      expect(button).toHaveClass("text-center");
      expect(button).toHaveClass("text-sm");
    });
  });

  describe("Variante icon", () => {
    it("deve renderizar apenas o ícone", () => {
      render(<BackButton onClick={vi.fn()} variant="icon" />);

      // Não deve ter texto visível
      expect(screen.queryByText("Voltar")).not.toBeInTheDocument();

      // Deve ter o botão com aria-label
      const button = screen.getByRole("button", { name: "Voltar" });
      expect(button).toBeInTheDocument();
    });

    it("deve ter aria-label com label customizado", () => {
      render(<BackButton onClick={vi.fn()} variant="icon" label="Anterior" />);

      const button = screen.getByRole("button", { name: "Anterior" });
      expect(button).toBeInTheDocument();
    });

    it("deve chamar onClick ao clicar", () => {
      const handleClick = vi.fn();
      render(<BackButton onClick={handleClick} variant="icon" />);

      fireEvent.click(screen.getByRole("button"));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("deve ter estilo de botão redondo", () => {
      render(<BackButton onClick={vi.fn()} variant="icon" />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded-full");
      expect(button).toHaveClass("p-2");
    });
  });

  describe("Variante icon-text", () => {
    it("deve renderizar ícone e texto", () => {
      render(<BackButton onClick={vi.fn()} variant="icon-text" />);

      expect(screen.getByText("Voltar")).toBeInTheDocument();
    });

    it("deve renderizar com label customizado", () => {
      render(<BackButton onClick={vi.fn()} variant="icon-text" label="Anterior" />);

      expect(screen.getByText("Anterior")).toBeInTheDocument();
    });

    it("deve chamar onClick ao clicar", () => {
      const handleClick = vi.fn();
      render(<BackButton onClick={handleClick} variant="icon-text" />);

      fireEvent.click(screen.getByText("Voltar"));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("deve ter layout inline-flex", () => {
      render(<BackButton onClick={vi.fn()} variant="icon-text" />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("inline-flex");
      expect(button).toHaveClass("items-center");
    });
  });

  describe("Acessibilidade", () => {
    it("deve ser um botão com type='button'", () => {
      render(<BackButton onClick={vi.fn()} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });

    it("variante icon deve ter aria-label", () => {
      render(<BackButton onClick={vi.fn()} variant="icon" />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Voltar");
    });
  });
});
