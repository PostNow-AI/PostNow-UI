/**
 * Step de revisão final antes de gerar campanha.
 * Adaptado de Onboarding/ReviewStep.tsx (< 150 linhas).
 */

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Separator,
} from "@/components/ui";
import { CheckCircle, AlertCircle } from "lucide-react";
import type { BriefingData, CampaignStructure } from "../../types";

interface ReviewStepProps {
  briefing: Partial<BriefingData>;
  structure: CampaignStructure | null;
  styles: string[];
  durationDays: number;
  postCount: number;
  onConfirm: () => void;
  onBack: () => void;
}

export const ReviewStep = ({
  briefing,
  structure,
  styles,
  durationDays,
  postCount,
  onConfirm,
  onBack,
}: ReviewStepProps) => {
  // Calcular custo estimado
  const textCost = postCount * 0.02;
  const imageCost = postCount * 0.23;
  const totalCost = textCost + imageCost;

  // Calcular datas (aproximado)
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + durationDays);

  const formatDate = (date: Date) => 
    date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Revisão Final
          </CardTitle>
          <Separator />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <span className="text-sm text-muted-foreground">Objetivo:</span>
              <span className="text-sm font-medium text-right max-w-[70%]">
                {briefing.objective || "Não informado"}
              </span>
            </div>

            {briefing.main_message && (
              <div className="flex items-start justify-between">
                <span className="text-sm text-muted-foreground">Mensagem:</span>
                <span className="text-sm text-right max-w-[70%]">
                  {briefing.main_message}
                </span>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estrutura:</span>
              <Badge variant="outline">{structure?.toUpperCase()}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Duração:</span>
              <Badge variant="outline">
                {durationDays} dias ({formatDate(startDate)} a {formatDate(endDate)})
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Posts:</span>
              <Badge variant="outline">{postCount} posts</Badge>
            </div>

            <div className="flex items-start justify-between">
              <span className="text-sm text-muted-foreground">Estilos:</span>
              <div className="flex flex-wrap gap-1 justify-end max-w-[70%]">
                {styles.map((style, index) => (
                  <Badge key={index} variant="secondary">
                    {style}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Estimativa de Custo */}
          <Card className="bg-muted/50">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Investimento estimado:</span>
                <span className="font-medium">R$ {totalCost.toFixed(2)}</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>{postCount} textos × R$ 0,02</span>
                  <span>R$ {textCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{postCount} imagens × R$ 0,23</span>
                  <span>R$ {imageCost.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-500">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <p>
              Ao clicar em "Gerar Campanha", os créditos serão deduzidos e a geração iniciará.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Botões */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack}>
          ← Voltar e Ajustar
        </Button>
        <Button onClick={onConfirm} size="lg">
          ✨ Gerar Campanha
        </Button>
      </div>
    </div>
  );
};

