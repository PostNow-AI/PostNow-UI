/**
 * MetricChart Component
 * Displays a line chart visualization for timeline data using Recharts
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { TimelinePoint } from "../types";

export interface MetricChartProps {
  /** Timeline data points to visualize */
  data: TimelinePoint[];
  /** Line color (hex or CSS color) */
  color: string;
  /** Chart height in pixels (default: 300) */
  height?: number;
  /** Show grid lines (default: true) */
  showGrid?: boolean;
}

/**
 * Format date for chart display
 * Converts "YYYY-MM-DD" to "DD/Mon"
 */
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
};

/**
 * Format date for tooltip
 * Converts "YYYY-MM-DD" to full localized date
 */
const formatTooltipDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const MetricChart = ({
  data,
  color,
  height = 300,
  showGrid = true,
}: MetricChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-muted-foreground"
        style={{ height }}
      >
        Sem dados para exibir
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        )}
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          className="text-muted-foreground"
        />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          className="text-muted-foreground"
          allowDecimals={false}
        />
        <Tooltip
          labelFormatter={(label) => formatTooltipDate(String(label))}
          formatter={(value) => [Number(value).toLocaleString("pt-BR"), "Total"]}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
