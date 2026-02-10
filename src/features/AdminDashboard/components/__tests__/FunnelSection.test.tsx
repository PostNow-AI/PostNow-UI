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

  it("deve exibir labels das etapas do funil", () => {
    const data: AllMetricsData = {
      subscriptions: createMockMetric(100),
      onboardings: createMockMetric(50),
      images: createMockMetric(25),
    };

    render(<FunnelSection data={data} />);

    expect(screen.getByText("Assinaturas")).toBeInTheDocument();
    expect(screen.getByText("Onboardings")).toBeInTheDocument();
    // Imagens aparece duas vezes (no funil e possivelmente em outro lugar)
    expect(screen.getAllByText("Imagens").length).toBeGreaterThanOrEqual(1);
  });

  it("deve calcular taxa de conversão corretamente", () => {
    const data: AllMetricsData = {
      subscriptions: createMockMetric(100),
      onboardings: createMockMetric(50),
      images: createMockMetric(25),
    };

    render(<FunnelSection data={data} />);

    // Conversão 1: 50/100 = 50%
    // Conversão 2: 25/50 = 50%
    // Total: 25/100 = 25%
    // O componente mostra as taxas sem casas decimais
    const fiftyPercents = screen.getAllByText("50%");
    expect(fiftyPercents.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("25%")).toBeInTheDocument();
  });

  it("deve exibir 0% quando não há dados de assinaturas", () => {
    const data: AllMetricsData = {
      subscriptions: createMockMetric(0),
      onboardings: createMockMetric(0),
      images: createMockMetric(0),
    };

    render(<FunnelSection data={data} />);

    // Quando não há dados, mostra 0%
    const zeros = screen.getAllByText("0%");
    expect(zeros.length).toBeGreaterThan(0);
  });

  it("deve lidar com dados undefined graciosamente", () => {
    const data: AllMetricsData = {};

    render(<FunnelSection data={data} />);

    // Deve exibir 0 para valores undefined
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBeGreaterThan(0);
  });

  it("deve exibir labels de conversão", () => {
    const data: AllMetricsData = {
      subscriptions: createMockMetric(100),
      onboardings: createMockMetric(50),
      images: createMockMetric(25),
    };

    render(<FunnelSection data={data} />);

    // Novo design usa "Conversão 1", "Conversão 2", "Total"
    expect(screen.getByText("Conversão 1")).toBeInTheDocument();
    expect(screen.getByText("Conversão 2")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
  });

  it("deve calcular taxa total corretamente", () => {
    const data: AllMetricsData = {
      subscriptions: createMockMetric(200),
      onboardings: createMockMetric(100),
      images: createMockMetric(50),
    };

    render(<FunnelSection data={data} />);

    // Total: 50/200 = 25%
    expect(screen.getByText("25%")).toBeInTheDocument();
  });
});
