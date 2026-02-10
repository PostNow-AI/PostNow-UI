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

    expect(screen.getByText("Engajamento")).toBeInTheDocument();
  });

  it("deve exibir total de posts no centro do donut", () => {
    const data: AllMetricsData = {
      "posts-total": createMockMetric(100),
      "posts-email": createMockMetric(60),
      "posts-manual": createMockMetric(40),
    };

    render(<EngagementSection data={data} />);

    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("posts")).toBeInTheDocument();
  });

  it("deve exibir valores de posts automáticos e manuais", () => {
    const data: AllMetricsData = {
      "posts-total": createMockMetric(100),
      "posts-email": createMockMetric(60),
      "posts-manual": createMockMetric(40),
    };

    render(<EngagementSection data={data} />);

    expect(screen.getByText("60")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
  });

  it("deve exibir labels corretos", () => {
    const data: AllMetricsData = {
      "posts-total": createMockMetric(100),
      "posts-email": createMockMetric(60),
      "posts-manual": createMockMetric(40),
    };

    render(<EngagementSection data={data} />);

    expect(screen.getByText("Automáticos")).toBeInTheDocument();
    expect(screen.getByText("Manuais")).toBeInTheDocument();
  });

  it("deve calcular porcentagens corretamente", () => {
    const data: AllMetricsData = {
      "posts-total": createMockMetric(100),
      "posts-email": createMockMetric(70),
      "posts-manual": createMockMetric(30),
    };

    render(<EngagementSection data={data} />);

    // Formato: (70.0%) e (30.0%)
    expect(screen.getByText("(70.0%)")).toBeInTheDocument();
    expect(screen.getByText("(30.0%)")).toBeInTheDocument();
  });

  it("deve exibir 0% quando total é zero", () => {
    const data: AllMetricsData = {
      "posts-total": createMockMetric(0),
      "posts-email": createMockMetric(0),
      "posts-manual": createMockMetric(0),
    };

    render(<EngagementSection data={data} />);

    // Deve mostrar (0%) para ambas as categorias
    const zeroPercents = screen.getAllByText("(0%)");
    expect(zeroPercents.length).toBe(2);
  });

  it("deve lidar com dados undefined", () => {
    const data: AllMetricsData = {};

    render(<EngagementSection data={data} />);

    // Deve mostrar 0 em múltiplos lugares (centro do donut e valores)
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBeGreaterThanOrEqual(1);
  });

  it("deve renderizar barra de distribuição", () => {
    const data: AllMetricsData = {
      "posts-total": createMockMetric(100),
      "posts-email": createMockMetric(60),
      "posts-manual": createMockMetric(40),
    };

    const { container } = render(<EngagementSection data={data} />);

    // Deve ter uma barra de progresso com cores rosa e âmbar
    const progressBar = container.querySelector(".bg-pink-500");
    expect(progressBar).toBeInTheDocument();
  });
});
