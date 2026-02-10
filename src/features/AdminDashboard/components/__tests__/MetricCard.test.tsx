import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Users } from "lucide-react";
import { MetricCard } from "../MetricCard";

describe("MetricCard", () => {
  const defaultProps = {
    title: "Assinaturas",
    value: 42,
    icon: Users,
    color: "text-green-600",
  };

  it("deve renderizar título e valor corretamente", () => {
    render(<MetricCard {...defaultProps} />);

    expect(screen.getByText("Assinaturas")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("deve formatar valores grandes com separador de milhar", () => {
    render(<MetricCard {...defaultProps} value={1234567} />);

    expect(screen.getByText("1.234.567")).toBeInTheDocument();
  });

  it("deve mostrar trend positivo com seta para cima", () => {
    render(<MetricCard {...defaultProps} trend={15} />);

    const trendElement = screen.getByText(/↑ 15\.0%/);
    expect(trendElement).toBeInTheDocument();
    expect(trendElement).toHaveClass("text-green-600");
  });

  it("deve mostrar trend negativo com seta para baixo", () => {
    render(<MetricCard {...defaultProps} trend={-10} />);

    const trendElement = screen.getByText(/↓ 10\.0%/);
    expect(trendElement).toBeInTheDocument();
    expect(trendElement).toHaveClass("text-red-600");
  });

  it("deve mostrar trend zero como positivo", () => {
    render(<MetricCard {...defaultProps} trend={0} />);

    expect(screen.getByText(/↑ 0\.0%/)).toBeInTheDocument();
  });

  it("não deve mostrar trend quando não fornecido", () => {
    render(<MetricCard {...defaultProps} />);

    expect(screen.queryByText(/vs período anterior/)).not.toBeInTheDocument();
  });

  it("deve chamar onClick ao clicar", async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(<MetricCard {...defaultProps} onClick={mockOnClick} />);

    const card = screen.getByText("Assinaturas").closest("[data-slot='card']");
    await user.click(card!);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("deve aplicar estilo de selecionado quando isSelected=true", () => {
    render(<MetricCard {...defaultProps} isSelected />);

    const card = screen.getByText("Assinaturas").closest("[data-slot='card']");
    expect(card).toHaveClass("ring-2");
    expect(card).toHaveClass("ring-primary");
  });

  it("não deve aplicar estilo de selecionado quando isSelected=false", () => {
    render(<MetricCard {...defaultProps} isSelected={false} />);

    const card = screen.getByText("Assinaturas").closest("[data-slot='card']");
    expect(card).not.toHaveClass("ring-2");
  });

  it("deve mostrar skeleton quando isLoading=true", () => {
    render(<MetricCard {...defaultProps} isLoading />);

    expect(screen.queryByText("Assinaturas")).not.toBeInTheDocument();
    expect(screen.queryByText("42")).not.toBeInTheDocument();

    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("deve renderizar ícone com a cor correta", () => {
    const { container } = render(<MetricCard {...defaultProps} />);

    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("text-green-600");
    // Mobile-first: h-5 w-5 sm:h-8 sm:w-8
    expect(svg).toHaveClass("h-5");
    expect(svg).toHaveClass("w-5");
  });
});
