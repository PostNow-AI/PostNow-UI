// @ts-nocheck
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
  RadioGroup,
  RadioGroupItem,
  Label,
} from "@/components/ui";
import { CheckCircle, AlertCircle, Zap, Sparkles } from "lucide-react";
import type { BriefingData, CampaignStructure } from "../../types";

interface ReviewStepProps {
  briefing: Partial<BriefingData>;
  structure: CampaignStructure | null;
  styles: string[];
  durationDays: number;
  postCount: number;
  generationQuality: 'fast' | 'premium';
  onQualityChange: (quality: 'fast' | 'premium') => void;
  onConfirm: () => void;
  onBack: () => void;
}

export const ReviewStep = ({
  briefing,
  structure,
  styles,
  durationDays,
  postCount,
  generationQuality,
  onQualityChange,
  onConfirm,
  onBack,
}: ReviewStepProps) => {
  // Calcular custo estimado baseado em qualidade
  const textCost = postCount * 0.02;
  const imageCost = generationQuality === 'premium' 
    ? postCount * 0.27  // Premium: +$0.04 por análise semântica
    : postCount * 0.23; // Fast: custo padrão
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

          {/* NOVO: Configuração de Qualidade de Geração */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Qualidade de Geração de Imagens</h3>
            <RadioGroup value={generationQuality} onValueChange={(value) => onQualityChange(value as 'fast' | 'premium')}>
              <div className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="fast" id="fast" />
                <Label htmlFor="fast" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Geração Rápida</span>
                    <Badge variant="secondary" className="text-xs">Padrão</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Prompt direto com paleta de cores, style modifiers e contexto do negócio.
                    Qualidade excelente, geração mais rápida.
                  </p>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span>⏱️ ~3-4 min</span>
                    <span>💰 R$ {(postCount * 0.23).toFixed(2)}</span>
                    <span>⭐ Qualidade: 90%</span>
                  </div>
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="premium" id="premium" />
                <Label htmlFor="premium" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">Geração Premium</span>
                    <Badge className="text-xs">Máxima Qualidade</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Análise semântica profunda (2 passos IA) + prompt enriquecido.
                    Qualidade máxima, ideal para campanhas importantes.
                  </p>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span>⏱️ ~5-6 min</span>
                    <span>💰 R$ {(postCount * 0.27).toFixed(2)}</span>
                    <span>⭐ Qualidade: 98%</span>
                  </div>
                </Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground flex items-start gap-2">
              <CheckCircle className="h-3 w-3 mt-0.5 text-green-500" />
              Harmonia visual entre posts está sempre ativa (usa contexto coletivo da campanha)
            </p>
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

