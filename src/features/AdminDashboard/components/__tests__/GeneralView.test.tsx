/**
 * Tests for GeneralView component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GeneralView } from "../GeneralView";
import type { AllMetricsData, DashboardMetric } from "../../types";

describe("GeneralView", () => {
  const createMockMetric = (count: number): DashboardMetric => ({
    count,
    timeline: [
      { date: "2026-01-01", count: count * 0.8 },
      { date: "2026-01-15", count: count * 0.9 },
      { date: "2026-01-30", count },
    ],
    start_date: "2026-01-01",
    end_date: "2026-01-30",
    metric_name: "test",
    period_days: 30,
  });

  const mockData: AllMetricsData = {
    subscriptions: createMockMetric(150),
    onboardings: createMockMetric(500),
    images: createMockMetric(1200),
    "emails-sent": createMockMetric(800),
    "posts-total": createMockMetric(300),
  };

  const defaultProps = {
    data: mockData,
    onMetricClick: vi.fn(),
  };

  it("renders metric labels", () => {
    render(<GeneralView {...defaultProps} />);

    expect(screen.getByText("Assinaturas")).toBeInTheDocument();
    expect(screen.getByText("Onboardings")).toBeInTheDocument();
    expect(screen.getByText("Imagens")).toBeInTheDocument();
    expect(screen.getByText("Emails")).toBeInTheDocument();
    expect(screen.getByText("Posts")).toBeInTheDocument();
  });

  it("renders metric values", () => {
    render(<GeneralView {...defaultProps} />);

    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
  });

  it("calls onMetricClick when card is clicked", () => {
    const onMetricClick = vi.fn();
    render(<GeneralView {...defaultProps} onMetricClick={onMetricClick} />);

    // Click on Assinaturas card
    fireEvent.click(screen.getByText("Assinaturas"));
    expect(onMetricClick).toHaveBeenCalledWith("subscriptions");
  });

  it("handles empty data gracefully", () => {
    render(<GeneralView data={{}} onMetricClick={vi.fn()} />);

    // Should show 0 for missing values
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBeGreaterThan(0);
  });

  it("renders all 5 metric cards", () => {
    render(<GeneralView {...defaultProps} />);

    // Check that all metric labels are rendered
    expect(screen.getByText("Assinaturas")).toBeInTheDocument();
    expect(screen.getByText("Onboardings")).toBeInTheDocument();
    expect(screen.getByText("Imagens")).toBeInTheDocument();
    expect(screen.getByText("Emails")).toBeInTheDocument();
    expect(screen.getByText("Posts")).toBeInTheDocument();
  });
});
