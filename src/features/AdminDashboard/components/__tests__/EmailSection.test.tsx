import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EmailSection } from "../EmailSection";
import type { AllMetricsData, DashboardMetric } from "../../types";

describe("EmailSection", () => {
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
      "emails-sent": createMockMetric(100),
      "emails-opened": createMockMetric(25),
    };

    render(<EmailSection data={data} />);

    expect(screen.getByText("Performance de Email")).toBeInTheDocument();
  });

  it("deve exibir valores de emails enviados e abertos", () => {
    const data: AllMetricsData = {
      "emails-sent": createMockMetric(1000),
      "emails-opened": createMockMetric(250),
    };

    render(<EmailSection data={data} />);

    expect(screen.getByText("1.000")).toBeInTheDocument();
    expect(screen.getByText("250")).toBeInTheDocument();
  });

  it("deve exibir labels corretos", () => {
    const data: AllMetricsData = {
      "emails-sent": createMockMetric(100),
      "emails-opened": createMockMetric(25),
    };

    render(<EmailSection data={data} />);

    expect(screen.getByText("Enviados")).toBeInTheDocument();
    expect(screen.getByText("Abertos")).toBeInTheDocument();
  });

  it("deve calcular taxa de abertura corretamente", () => {
    const data: AllMetricsData = {
      "emails-sent": createMockMetric(100),
      "emails-opened": createMockMetric(25),
    };

    render(<EmailSection data={data} />);

    expect(screen.getByText("25.0%")).toBeInTheDocument();
  });

  it("deve exibir 0% quando não há emails enviados", () => {
    const data: AllMetricsData = {
      "emails-sent": createMockMetric(0),
      "emails-opened": createMockMetric(0),
    };

    render(<EmailSection data={data} />);

    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("deve mostrar performance Excelente para taxa >= 30%", () => {
    const data: AllMetricsData = {
      "emails-sent": createMockMetric(100),
      "emails-opened": createMockMetric(35),
    };

    render(<EmailSection data={data} />);

    expect(screen.getByText("Excelente")).toBeInTheDocument();
  });

  it("deve mostrar performance Bom para taxa >= 20% e < 30%", () => {
    const data: AllMetricsData = {
      "emails-sent": createMockMetric(100),
      "emails-opened": createMockMetric(25),
    };

    render(<EmailSection data={data} />);

    expect(screen.getByText("Bom")).toBeInTheDocument();
  });

  it("deve mostrar performance Médio para taxa >= 10% e < 20%", () => {
    const data: AllMetricsData = {
      "emails-sent": createMockMetric(100),
      "emails-opened": createMockMetric(15),
    };

    render(<EmailSection data={data} />);

    expect(screen.getByText("Médio")).toBeInTheDocument();
  });

  it("deve mostrar performance Baixo para taxa < 10%", () => {
    const data: AllMetricsData = {
      "emails-sent": createMockMetric(100),
      "emails-opened": createMockMetric(5),
    };

    render(<EmailSection data={data} />);

    expect(screen.getByText("Baixo")).toBeInTheDocument();
  });

  it("deve exibir benchmark do mercado", () => {
    const data: AllMetricsData = {
      "emails-sent": createMockMetric(100),
      "emails-opened": createMockMetric(25),
    };

    render(<EmailSection data={data} />);

    expect(screen.getByText("Benchmark: 20-25%")).toBeInTheDocument();
  });

  it("deve exibir label de taxa de abertura", () => {
    const data: AllMetricsData = {
      "emails-sent": createMockMetric(100),
      "emails-opened": createMockMetric(25),
    };

    render(<EmailSection data={data} />);

    expect(screen.getByText("Taxa de Abertura")).toBeInTheDocument();
  });

  it("deve lidar com dados undefined", () => {
    const data: AllMetricsData = {};

    render(<EmailSection data={data} />);

    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBeGreaterThan(0);
  });
});
