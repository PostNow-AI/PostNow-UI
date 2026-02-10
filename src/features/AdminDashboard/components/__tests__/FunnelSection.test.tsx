import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FunnelSection } from "../FunnelSection";
import type { AllMetricsData, DashboardMetric } from "../../types";

describe("FunnelSection", () => {
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
      subscriptions: createMockMetric(100),
      onboardings: createMockMetric(50),
      images: createMockMetric(25),
    };

    render(<FunnelSection data={data} />);

    expect(screen.getByText("Funil de Conversão")).toBeInTheDocument();
  });

  it("deve exibir valores das métricas formatados", () => {
    const data: AllMetricsData = {
      subscriptions: createMockMetric(1000),
      onboardings: createMockMetric(500),
      images: createMockMetric(250),
    };

    render(<FunnelSection data={data} />);

    expect(screen.getByText("1.000")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByText("250")).toBeInTheDocument();
  });

  it("deve calcular taxa de conversão corretamente", () => {
    const data: AllMetricsData = {
      subscriptions: createMockMetric(100),
      onboardings: createMockMetric(50),
      images: createMockMetric(25),
    };

    render(<FunnelSection data={data} />);

    // Both rates are 50% (50/100 and 25/50)
    const percentages = screen.getAllByText("50.0%");
    expect(percentages.length).toBe(2);
  });

  it("deve exibir 0% quando não há dados de assinaturas", () => {
    const data: AllMetricsData = {
      subscriptions: createMockMetric(0),
      onboardings: createMockMetric(0),
      images: createMockMetric(0),
    };

    render(<FunnelSection data={data} />);

    const zeros = screen.getAllByText("0%");
    expect(zeros.length).toBe(2);
  });

  it("deve lidar com dados undefined graciosamente", () => {
    const data: AllMetricsData = {};

    render(<FunnelSection data={data} />);

    // Deve exibir 0 para valores undefined
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBeGreaterThan(0);
  });

  it("deve exibir labels corretos para cada etapa", () => {
    const data: AllMetricsData = {
      subscriptions: createMockMetric(100),
      onboardings: createMockMetric(50),
      images: createMockMetric(25),
    };

    render(<FunnelSection data={data} />);

    expect(screen.getByText("Assinaturas")).toBeInTheDocument();
    expect(screen.getByText("Onboardings Completos")).toBeInTheDocument();
    expect(screen.getByText("Imagens Geradas")).toBeInTheDocument();
  });

  it("deve exibir textos de taxa de conversão", () => {
    const data: AllMetricsData = {
      subscriptions: createMockMetric(100),
      onboardings: createMockMetric(50),
      images: createMockMetric(25),
    };

    render(<FunnelSection data={data} />);

    expect(screen.getByText("Assinatura → Onboarding")).toBeInTheDocument();
    expect(screen.getByText("Onboarding → Geração")).toBeInTheDocument();
  });
});
