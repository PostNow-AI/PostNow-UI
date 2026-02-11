/**
 * Tests for BottomNav component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BottomNav, type DashboardTab } from "../BottomNav";

describe("BottomNav", () => {
  const defaultProps = {
    activeTab: "geral" as DashboardTab,
    onTabChange: vi.fn(),
  };

  it("renders all tab buttons", () => {
    render(<BottomNav {...defaultProps} />);

    expect(screen.getByText("Geral")).toBeInTheDocument();
    expect(screen.getByText("Funil")).toBeInTheDocument();
    expect(screen.getByText("Engaj")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("highlights active tab with aria-pressed", () => {
    render(<BottomNav {...defaultProps} activeTab="funil" />);

    const funnelButton = screen.getByRole("button", { name: "Funil" });
    expect(funnelButton).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onTabChange when tab is clicked", () => {
    const onTabChange = vi.fn();
    render(<BottomNav {...defaultProps} onTabChange={onTabChange} />);

    fireEvent.click(screen.getByText("Funil"));
    expect(onTabChange).toHaveBeenCalledWith("funil");
  });

  it("calls onTabChange with correct tab values", () => {
    const onTabChange = vi.fn();
    render(<BottomNav {...defaultProps} onTabChange={onTabChange} />);

    fireEvent.click(screen.getByText("Geral"));
    expect(onTabChange).toHaveBeenCalledWith("geral");

    fireEvent.click(screen.getByText("Engaj"));
    expect(onTabChange).toHaveBeenCalledWith("engaj");

    fireEvent.click(screen.getByText("Email"));
    expect(onTabChange).toHaveBeenCalledWith("email");
  });

  it("renders navigation landmark", () => {
    render(<BottomNav {...defaultProps} />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
