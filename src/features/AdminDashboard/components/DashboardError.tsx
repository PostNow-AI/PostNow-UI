/**
 * DashboardError Component
 * Error state display for the dashboard with retry option
 */

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface DashboardErrorProps {
  /** Callback to retry loading data */
  onRetry: () => void;
  /** Custom error message */
  message?: string;
}

export const DashboardError = ({
  onRetry,
  message = "Erro ao carregar dados do dashboard",
}: DashboardErrorProps) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Algo deu errado</h3>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
            <Button onClick={onRetry} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
