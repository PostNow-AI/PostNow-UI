// @ts-nocheck
/**
 * Component to show campaign generation progress.
 * Displays progress bar and current phase with loading animation.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";

interface GenerationProgressProps {
  progress: number;
  total: number;
  percentage: number;
  currentAction: string;
  status: string;
}

export const GenerationProgress = ({
  progress,
  total,
  percentage,
  currentAction,
  status,
}: GenerationProgressProps) => {
  return (
    <Card className="mb-6 bg-gradient-to-r from-primary/10 to-background border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
          <Sparkles className="h-4 w-4 animate-pulse" />
          {currentAction || 'Gerando Posts da Campanha'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">{percentage}% Completo</div>
        <Progress value={percentage} className="w-full" />
        <p className="text-xs text-muted-foreground mt-2">
          Post {progress} de {total} {status === 'processing' ? '(gerando...)' : ''}
        </p>
      </CardContent>
    </Card>
  );
};

