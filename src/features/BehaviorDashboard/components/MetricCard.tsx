import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";
import { Maximize2 } from "lucide-react";
import { useState } from "react";
import type { MetricResponse } from "../types";
import { TimelineChart } from "./TimelineChart";

interface MetricCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  data: MetricResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  showChart?: boolean;
  chartColor?: string;
}

export const MetricCard = ({
  title,
  description,
  icon: Icon,
  data,
  isLoading,
  error,
  showChart = false,
  chartColor,
}: MetricCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };

    return `${start.toLocaleDateString("pt-BR", options)} - ${end.toLocaleDateString("pt-BR", options)}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-3 w-3/4" />
          {showChart && <Skeleton className="h-[200px] w-full mt-4" />}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mt-2">
            <AlertDescription>
              Erro ao carregar dados: {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Sem dados disponíveis</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="flex gap-2 items-center">
            <Icon className="h-4 w-4 text-muted-foreground" />
            {showChart && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="md:hidden p-1 hover:bg-accent rounded-md transition-colors"
                aria-label="Expandir gráfico"
              >
                <Maximize2 className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.count.toLocaleString("pt-BR")}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {formatDateRange(data.start_date, data.end_date)}
          </p>

          {showChart && data.timeline && data.timeline.length > 0 && (
            <div className="mt-4 hidden md:block">
              <TimelineChart data={data.timeline} color={chartColor} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para mobile */}
      {showChart && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-[95vw] max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {data.timeline && data.timeline.length > 0 && (
                <TimelineChart data={data.timeline} color={chartColor} />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
