import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EngagementSection } from "../EngagementSection";
import type { AllMetricsData, DashboardMetric } from "../../types";

describe("EngagementSection", () => {
  const createMockMetric = (count: number): DashboardMetric => ({
    count,
    timeline: [],
    start_date: "2026-01-11T00:00:00",
    end_date: "2026-02-10T00:00:00",
    metric_name: "test",
    period_days: 30,
  });

  it("deve renderizar título do card", () => {
    const data: AllMetricsData = {
      "posts-total": createMockMetric(100),
      "posts-email": createMockMetric(60),
      "posts-manual": createMockMetric(40),
    };

    render(<EngagementSection data={data} />);

    expect(screen.getByText("Engajamento de Conteúdo")).toBeInTheDocument();
  });

  it("deve exibir valores das métricas", () => {
    const data: AllMetricsData = {
      "posts-total": createMockMetric(1000),
      "posts-email": createMockMetric(600),
      "posts-manual": createMockMetric(400),
    };

    render(<EngagementSection data={data} />);

    expect(screen.getByText("1.000")).toBeInTheDocument();
    expect(screen.getByText("600")).toBeInTheDocument();
    expect(screen.getByText("400")).toBeInTheDocument();
  });

  it("deve exibir labels corretos", () => {
    const data: AllMetricsData = {
      "posts-total": createMockMetric(100),
      "posts-email": createMockMetric(60),
      "posts-manual": createMockMetric(40),
    };

    render(<EngagementSection data={data} />);

    expect(screen.getByText("Posts Totais")).toBeInTheDocument();
    expect(screen.getByText("Posts Automáticos")).toBeInTheDocument();
    expect(screen.getByText("Posts Manuais")).toBeInTheDocument();
  });

  it("deve calcular porcentagens corretamente", () => {
    const data: AllMetricsData = {
      "posts-total": createMockMetric(100),
      "posts-email": createMockMetric(70),
      "posts-manual": createMockMetric(30),
    };

    render(<EngagementSection data={data} />);

    expect(screen.getByText("Automáticos (70.0%)")).toBeInTheDocument();
    expect(screen.getByText("Manuais (30.0%)")).toBeInTheDocument();
  });

  it("deve exibir 0% quando total é zero", () => {
    const data: AllMetricsData = {
      "posts-total": createMockMetric(0),
      "posts-email": createMockMetric(0),
      "posts-manual": createMockMetric(0),
    };

    render(<EngagementSection data={data} />);

    expect(screen.getByText("Automáticos (0%)")).toBeInTheDocument();
    expect(screen.getByText("Manuais (0%)")).toBeInTheDocument();
  });

  it("deve lidar com dados undefined", () => {
    const data: AllMetricsData = {};

    render(<EngagementSection data={data} />);

    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBe(3);
  });

  it("deve exibir texto de distribuição de posts", () => {
    const data: AllMetricsData = {
      "posts-total": createMockMetric(100),
      "posts-email": createMockMetric(60),
      "posts-manual": createMockMetric(40),
    };

    render(<EngagementSection data={data} />);

    expect(screen.getByText("Distribuição de Posts")).toBeInTheDocument();
  });
});
