import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { PeriodSelector } from "../PeriodSelector";
import type { PeriodDays } from "../../types";

describe("PeriodSelector", () => {
  const defaultProps = {
    value: 30 as PeriodDays,
    onChange: vi.fn(),
  };

  // Helper para encontrar tab pelo valor
  const getTabByValue = (value: string) => {
    return screen.getByRole("tab", { name: new RegExp(value) });
  };

  it("deve renderizar todas as 5 opções de período", () => {
    render(<PeriodSelector {...defaultProps} />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(5);
  });

  it("deve renderizar labels curtos para mobile", () => {
    render(<PeriodSelector {...defaultProps} />);

    // Short labels são sempre renderizados (visíveis em mobile)
    // "24h" aparece duas vezes (mesmo valor para short e long)
    expect(screen.getAllByText("24h").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("7d")).toBeInTheDocument();
    expect(screen.getByText("30d")).toBeInTheDocument();
    expect(screen.getByText("90d")).toBeInTheDocument();
    expect(screen.getByText("6m")).toBeInTheDocument();
  });

  it("deve renderizar labels longos para desktop", () => {
    render(<PeriodSelector {...defaultProps} />);

    // Long labels também estão no DOM (visíveis em desktop)
    expect(screen.getByText("7 dias")).toBeInTheDocument();
    expect(screen.getByText("30 dias")).toBeInTheDocument();
    expect(screen.getByText("90 dias")).toBeInTheDocument();
    expect(screen.getByText("6 meses")).toBeInTheDocument();
  });

  it("deve marcar o período selecionado como ativo", () => {
    render(<PeriodSelector {...defaultProps} value={7} />);

    const tabs = screen.getAllByRole("tab");
    const activeTab = tabs.find(tab => tab.getAttribute("data-state") === "active");
    expect(activeTab).toBeDefined();
    expect(activeTab).toHaveTextContent("7d");
  });

  it("deve chamar onChange com valor correto ao clicar em período", async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();

    render(<PeriodSelector {...defaultProps} onChange={mockOnChange} />);

    await user.click(screen.getByText("7d"));

    expect(mockOnChange).toHaveBeenCalledWith(7);
  });

  it("deve chamar onChange com 1 ao clicar em 24h", async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();

    render(<PeriodSelector {...defaultProps} onChange={mockOnChange} />);

    // "24h" aparece duas vezes (mesmo valor para short e long), clicar no primeiro
    await user.click(screen.getAllByText("24h")[0]);

    expect(mockOnChange).toHaveBeenCalledWith(1);
  });

  it("deve chamar onChange com 90 ao clicar em 90d", async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();

    render(<PeriodSelector {...defaultProps} onChange={mockOnChange} />);

    await user.click(screen.getByText("90d"));

    expect(mockOnChange).toHaveBeenCalledWith(90);
  });

  it("deve chamar onChange com 180 ao clicar em 6m", async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();

    render(<PeriodSelector {...defaultProps} onChange={mockOnChange} />);

    await user.click(screen.getByText("6m"));

    expect(mockOnChange).toHaveBeenCalledWith(180);
  });

  it("deve desabilitar interação quando disabled=true", () => {
    render(<PeriodSelector {...defaultProps} disabled />);

    const triggers = screen.getAllByRole("tab");
    triggers.forEach((trigger) => {
      expect(trigger).toBeDisabled();
    });
  });

  it("não deve desabilitar quando disabled=false", () => {
    render(<PeriodSelector {...defaultProps} disabled={false} />);

    const triggers = screen.getAllByRole("tab");
    triggers.forEach((trigger) => {
      expect(trigger).not.toBeDisabled();
    });
  });
});
