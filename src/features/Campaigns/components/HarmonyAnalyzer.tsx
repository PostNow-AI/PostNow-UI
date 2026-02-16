// @ts-nocheck
/**
 * Analisador de Harmonia Visual - Descoberta: 60% reorganizaram posts após ver score.
 * Calcula score de harmonia e oferece sugestões de melhorias.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

interface HarmonyAnalyzerProps {
  score: number;
  breakdown?: {
    color_distribution: number;
    style_balance: number;
    pattern_diversity: number;
    text_legibility: number;
  };
  suggestions?: Array<{
    type: string;
    severity: "low" | "medium" | "high";
    message: string;
    action?: string;
  }>;
  onApplySuggestion?: (suggestion: any) => void;
}

export const HarmonyAnalyzer = ({
  score = 0,
  breakdown,
  suggestions = [],
  onApplySuggestion,
}: HarmonyAnalyzerProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excelente";
    if (score >= 60) return "Boa";
    if (score >= 40) return "Regular";
    return "Precisa Melhorar";
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Sparkles className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Score Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Harmonia Visual
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-2">
                <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
                  {score}
                </span>
                <span className="text-muted-foreground">/100</span>
                <Badge variant={score >= 60 ? "default" : "secondary"} className="ml-2">
                  {getScoreLabel(score)}
                </Badge>
              </div>
              <Progress value={score} className="h-3" />
            </div>
          </div>

          {/* Breakdown detalhado */}
          {breakdown && (
            <div className="grid grid-cols-2 gap-3 pt-4 border-t">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cores</span>
                  <span className="font-medium">{breakdown.color_distribution}%</span>
                </div>
                <Progress value={breakdown.color_distribution} className="h-1" />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estilos</span>
                  <span className="font-medium">{breakdown.style_balance}%</span>
                </div>
                <Progress value={breakdown.style_balance} className="h-1" />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Diversidade</span>
                  <span className="font-medium">{breakdown.pattern_diversity}%</span>
                </div>
                <Progress value={breakdown.pattern_diversity} className="h-1" />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Legibilidade</span>
                  <span className="font-medium">{breakdown.text_legibility}%</span>
                </div>
                <Progress value={breakdown.text_legibility} className="h-1" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sugestões de IA */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Sugestões de Melhoria
              <Badge variant="outline">{suggestions.length}</Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <Alert key={index}>
                {getSeverityIcon(suggestion.severity)}
                <AlertDescription className="ml-8">
                  <p className="font-medium text-sm mb-1">{suggestion.message}</p>
                  {suggestion.action && onApplySuggestion && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => onApplySuggestion(suggestion)}
                      aria-label={suggestion.action}
                    >
                      {suggestion.action}
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Feedback positivo se score alto */}
      {score >= 80 && (
        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
          <CardContent className="p-4 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-900 dark:text-green-100">
              <p className="font-medium mb-1">Excelente trabalho!</p>
              <p className="text-xs">
                Seu feed está com ótima harmonia visual. Os posts têm boa distribuição de cores,
                estilos balanceados e criam uma estética atraente. Continue assim!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

