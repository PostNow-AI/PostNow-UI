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

  it("deve renderizar todas as opções de período", () => {
    render(<PeriodSelector {...defaultProps} />);

    expect(screen.getByText("24h")).toBeInTheDocument();
    expect(screen.getByText("7 dias")).toBeInTheDocument();
    expect(screen.getByText("30 dias")).toBeInTheDocument();
    expect(screen.getByText("90 dias")).toBeInTheDocument();
    expect(screen.getByText("180 dias")).toBeInTheDocument();
  });

  it("deve marcar o período selecionado como ativo", () => {
    render(<PeriodSelector {...defaultProps} value={7} />);

    const trigger = screen.getByText("7 dias");
    expect(trigger.getAttribute("data-state")).toBe("active");
  });

  it("deve chamar onChange com valor correto ao clicar em período", async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();

    render(<PeriodSelector {...defaultProps} onChange={mockOnChange} />);

    await user.click(screen.getByText("7 dias"));

    expect(mockOnChange).toHaveBeenCalledWith(7);
  });

  it("deve chamar onChange com 1 ao clicar em 24h", async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();

    render(<PeriodSelector {...defaultProps} onChange={mockOnChange} />);

    await user.click(screen.getByText("24h"));

    expect(mockOnChange).toHaveBeenCalledWith(1);
  });

  it("deve chamar onChange com 90 ao clicar em 90 dias", async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();

    render(<PeriodSelector {...defaultProps} onChange={mockOnChange} />);

    await user.click(screen.getByText("90 dias"));

    expect(mockOnChange).toHaveBeenCalledWith(90);
  });

  it("deve chamar onChange com 180 ao clicar em 180 dias", async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();

    render(<PeriodSelector {...defaultProps} onChange={mockOnChange} />);

    await user.click(screen.getByText("180 dias"));

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
