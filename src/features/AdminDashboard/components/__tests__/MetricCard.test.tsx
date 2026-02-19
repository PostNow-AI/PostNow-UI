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

  it("deve formatar valores grandes de forma compacta", () => {
    render(<MetricCard {...defaultProps} value={1234567} />);

    // Valores >= 1000 são formatados como "Xk" (ex: 1234567 -> 1234.6k)
    expect(screen.getByText("1234.6k")).toBeInTheDocument();
  });

  it("deve formatar valores menores que 1000 normalmente", () => {
    render(<MetricCard {...defaultProps} value={999} />);

    expect(screen.getByText("999")).toBeInTheDocument();
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
    // Layout compacto: h-4 w-4 lg:h-6 lg:w-6
    expect(svg).toHaveClass("h-4");
    expect(svg).toHaveClass("w-4");
  });
});
