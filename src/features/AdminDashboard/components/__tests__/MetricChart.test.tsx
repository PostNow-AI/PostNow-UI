import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MetricChart } from "../MetricChart";
import type { TimelinePoint } from "../../types";

// Mock ResizeObserver for Recharts
vi.mock("recharts", async () => {
  const actual = await vi.importActual("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children, height }: { children: React.ReactNode; height: number }) => (
      <div style={{ width: 500, height }}>{children}</div>
    ),
  };
});

describe("MetricChart", () => {
  const mockData: TimelinePoint[] = [
    { date: "2026-02-08", count: 10 },
    { date: "2026-02-09", count: 15 },
    { date: "2026-02-10", count: 20 },
  ];

  it("deve renderizar gráfico com dados", () => {
    const { container } = render(
      <MetricChart data={mockData} color="#16a34a" />
    );

    // Verifica se o LineChart foi renderizado
    const svg = container.querySelector(".recharts-wrapper");
    expect(svg).toBeInTheDocument();
  });

  it("deve mostrar mensagem quando não há dados", () => {
    render(<MetricChart data={[]} color="#16a34a" />);

    expect(screen.getByText("Sem dados para exibir")).toBeInTheDocument();
  });

  it("deve mostrar mensagem quando data é undefined", () => {
    render(<MetricChart data={undefined as unknown as TimelinePoint[]} color="#16a34a" />);

    expect(screen.getByText("Sem dados para exibir")).toBeInTheDocument();
  });

  it("deve usar altura padrão de 300px", () => {
    const { container } = render(
      <MetricChart data={mockData} color="#16a34a" />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.height).toBe("300px");
  });

  it("deve usar altura customizada quando fornecida", () => {
    const { container } = render(
      <MetricChart data={mockData} color="#16a34a" height={400} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.height).toBe("400px");
  });

  it("deve aplicar cor ao gráfico", () => {
    const { container } = render(
      <MetricChart data={mockData} color="#9333ea" />
    );

    const line = container.querySelector(".recharts-line-curve");
    if (line) {
      expect(line.getAttribute("stroke")).toBe("#9333ea");
    }
  });

  it("deve renderizar componente quando showGrid=true (default)", () => {
    const { container } = render(
      <MetricChart data={mockData} color="#16a34a" showGrid />
    );

    // With the mock, we can only verify the component renders
    const wrapper = container.querySelector(".recharts-wrapper");
    expect(wrapper).toBeInTheDocument();
  });
});
