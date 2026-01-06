/**
 * QuickWizard - Wizard simplificado para Jornada Rápida
 * 
 * Fluxo ultra-rápido (2-5min):
 * 1. Nome da campanha + objetivo (1 min)
 * 2. Confirmação de configurações automáticas (30seg)
 * 3. Gerar! (45seg de loading)
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Zap,
} from "lucide-react";
import { useCampaignGeneration } from "../hooks/useCampaignGeneration";
import type { Campaign } from "../types";

interface QuickWizardProps {
  onComplete: (campaign: Campaign) => void;
  onBack: () => void;
}

export const QuickWizard: React.FC<QuickWizardProps> = ({
  onComplete,
  onBack,
}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"input" | "confirm">("input");
  
  // Form state
  const [campaignName, setCampaignName] = useState("");
  const [goal, setGoal] = useState("");
  
  // Geração
  const generateMutation = useCampaignGeneration();

  // Configurações automáticas
  const autoConfig = {
    structure: "aida", // Estrutura mais popular
    duration_days: 14, // 2 semanas padrão
    posts_per_week: 4, // 4 posts/semana
    total_posts: 8, // 14 dias ÷ 7 × 4 = 8 posts
    visual_styles: ["automatic"], // Sistema escolhe
    generation_quality: "fast", // Rápido
    visual_harmony_enabled: false, // Skip para velocidade
  };

  const handleNext = () => {
    if (step === "input" && campaignName && goal) {
      setStep("confirm");
    }
  };

  const handleGenerate = async () => {
    try {
      // Criar campanha
      const campaignData = {
        name: campaignName,
        goal,
        type: "branding", // Default
        structure: autoConfig.structure,
        duration_days: autoConfig.duration_days,
        posts_per_week: autoConfig.posts_per_week,
        start_date: new Date().toISOString().split("T")[0],
        status: "draft",
      };

      // TODO: Criar campanha via API
      // const campaign = await campaignService.createCampaign(campaignData);

      // Por ora, mock
      const mockCampaign: Campaign = {
        id: Date.now(),
        ...campaignData,
        user: 1,
        post_count: autoConfig.total_posts,
        approved_posts: 0,
        selected_visual_styles: [],
        generation_context: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Gerar conteúdo
      await generateMutation.mutateAsync({
        campaignId: mockCampaign.id,
        params: {
          generation_quality: autoConfig.generation_quality as "fast" | "premium",
          visual_harmony_enabled: autoConfig.visual_harmony_enabled,
        },
      });

      onComplete(mockCampaign);
    } catch (error) {
      console.error("Erro ao gerar campanha rápida:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Rocket className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Jornada Rápida</h1>
          <Badge variant="secondary">
            <Zap className="h-3 w-3 mr-1" />
            2-5 min
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Criação ultrarrápida com configurações automáticas inteligentes
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2">
        <div
          className={`h-2 w-20 rounded-full ${
            step === "input" ? "bg-blue-600" : "bg-green-600"
          }`}
        />
        <div
          className={`h-2 w-20 rounded-full ${
            step === "confirm" ? "bg-blue-600" : "bg-gray-200"
          }`}
        />
      </div>

      {/* Step 1: Input */}
      {step === "input" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Sobre sua campanha
            </CardTitle>
            <CardDescription>
              Conte-nos o básico e deixe a IA fazer o resto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="campaign-name">
                Nome da Campanha <span className="text-red-500">*</span>
              </Label>
              <Input
                id="campaign-name"
                placeholder="Ex: Lançamento de Verão 2025"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                autoFocus
              />
            </div>

            {/* Objetivo */}
            <div className="space-y-2">
              <Label htmlFor="goal">
                Objetivo da Campanha <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="goal"
                placeholder="Ex: Aumentar vendas da nova coleção de verão e fortalecer presença digital"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                💡 A IA vai usar isso para criar posts personalizados
              </p>
            </div>

            {/* Info box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-600" />
                Configurações Automáticas
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Estrutura AIDA (mais popular)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  14 dias, 8 posts (4 por semana)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Estilos visuais baseados no seu perfil
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Geração rápida (45 segundos)
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Button
                onClick={handleNext}
                disabled={!campaignName || !goal}
              >
                Continuar
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Confirmação */}
      {step === "confirm" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Revisar e Gerar
            </CardTitle>
            <CardDescription>
              Tudo pronto! Confirme e deixe a IA trabalhar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Resumo */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                  Nome
                </h4>
                <p className="font-medium">{campaignName}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                  Objetivo
                </h4>
                <p className="text-sm">{goal}</p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Configuração Automática</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      Estrutura
                    </p>
                    <p className="font-medium">AIDA</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      Duração
                    </p>
                    <p className="font-medium">14 dias</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Posts</p>
                    <p className="font-medium">8 posts</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      Frequência
                    </p>
                    <p className="font-medium">4x/semana</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tempo estimado */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-green-600" />
                <div>
                  <h4 className="font-semibold">Geração em ~45 segundos</h4>
                  <p className="text-sm text-muted-foreground">
                    Você pode revisar e ajustar tudo depois
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setStep("input")}
                disabled={generateMutation.isPending}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {generateMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Gerar Campanha
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

