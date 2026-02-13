// @ts-nocheck
/**
 * Página dedicada de criação de campanha (não modal).
 * Seguindo padrão de OnboardingForm.tsx - página cheia sem desfoque de fundo.
 * 
 * ATUALIZAÇÃO: Integração com Jornadas Adaptativas
 * - Step 0: Seleção de jornada (quick/guided/advanced)
 * - Quick: Wizard simplificado (QuickWizard)
 * - Guided: Wizard completo atual
 * - Advanced: Wizard com controles extras (futuro)
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Progress, Button } from "@/components/ui";
import { BlurryBackground } from "@/components/ui/blurry-background";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { briefingSchema, type BriefingFormData } from "@/features/Campaigns/constants";
import { useCampaignWizard, useCampaignCreation, useCampaignGeneration } from "@/features/Campaigns/hooks";
import { useJourneyDetection } from "@/features/Campaigns/hooks/useJourneyDetection";
import { BriefingStep } from "@/features/Campaigns/components/wizard/BriefingStep";
import { StructureSelector } from "@/features/Campaigns/components/wizard/StructureSelector";
import { DurationStep } from "@/features/Campaigns/components/wizard/DurationStep";
import { VisualStylePicker } from "@/features/Campaigns/components/wizard/VisualStylePicker";
import { ReviewStep } from "@/features/Campaigns/components/wizard/ReviewStep";
import { WeeklyContextModal } from "@/features/Campaigns/components/WeeklyContextModal";
import { JourneySelector } from "@/features/Campaigns/components/JourneySelector";
import { QuickWizard } from "@/features/Campaigns/components/QuickWizard";

export const CampaignCreationPage = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showJourneySelector, setShowJourneySelector] = useState(true);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  
  const {
    selectedJourney,
    journeyData,
    isLoading: isLoadingJourney,
    selectJourney,
    startJourney,
    completeJourney,
  } = useJourneyDetection();
  
  const {
    currentStep,
    selectedStructure,
    selectedStyles,
    durationDays,
    postCount,
    briefingData,
    percentage,
    weeklyContextOpportunities,
    showWeeklyContextModal,
    setShowWeeklyContextModal,
    generationQuality,
    setGenerationQuality,
    visualHarmonyEnabled,
    setVisualHarmonyEnabled,
    handleBriefingComplete,
    handleWeeklyContextSelect,
    handleStructureSelected,
    handleDurationConfirmed,
    handleStylesSelected,
    resetWizard,
    setCurrentStep,
  } = useCampaignWizard();

  const createCampaignMutation = useCampaignCreation();

  const form = useForm<BriefingFormData>({
    resolver: zodResolver(briefingSchema),
    defaultValues: {
      objective: "",
      main_message: "",
      has_cases: false,
      has_materials: false,
    },
  });

  const handleCancel = () => {
    // Fechar modal Weekly Context se estiver aberto
    if (showWeeklyContextModal) {
      handleWeeklyContextSelect([]);
    }
    resetWizard();
    navigate("/campaigns");
  };

  const handleJourneySelected = (journey: 'quick' | 'guided' | 'advanced') => {
    selectJourney(journey);
    setShowJourneySelector(false);
  };

  const handleBackToJourneySelector = () => {
    setShowJourneySelector(true);
  };

  const handleQuickWizardComplete = async (campaign: any) => {
    setCampaignId(String(campaign.id));
    
    // Completar tracking de jornada
    if (campaign.id) {
      completeJourney(String(campaign.id));
    }
    
    toast.success("Campanha criada com sucesso!");
    navigate(`/campaigns/${campaign.id}`);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Criar campanha no backend
      const campaignData = {
        name: `Campanha ${new Date().toLocaleDateString("pt-BR")}`,
        type: "branding" as const,
        objective: briefingData.objective || "",
        main_message: briefingData.main_message || "",
        structure: selectedStructure!,
        duration_days: durationDays,
        post_count: postCount,
        visual_styles: selectedStyles,
        briefing_data: briefingData,
        generation_context: {
          use_semantic_analysis: generationQuality === 'premium',
          quality_level: generationQuality,
          visual_harmony_enabled: visualHarmonyEnabled,
          journey_type: selectedJourney, // Track qual jornada usou
        },
      };
      
      const campaign = await createCampaignMutation.mutateAsync(campaignData);
      setCampaignId(String(campaign.id));
      
      // Iniciar tracking de jornada
      if (campaign.id) {
        startJourney(String(campaign.id));
      }
      
      toast.success("Campanha criada com sucesso!");
      
      // Completar tracking quando navegar
      if (campaign.id) {
        completeJourney(String(campaign.id));
      }
      
      // Navegar para a página de detalhes da campanha
      navigate(`/campaigns/${campaign.id}`);
      
    } catch (error) {
      console.error("Erro ao criar campanha:", error);
      toast.error("Erro ao criar campanha");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <BlurryBackground variant="2">
      <div className="flex flex-col items-center space-y-6 px-4 min-h-screen py-8">
        {/* Botão Voltar */}
        <div className="w-full max-w-[900px] px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/campaigns")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Dashboard
          </Button>
        </div>

        {/* Journey Selector (Step 0 - Novo) */}
        {showJourneySelector && (
          <JourneySelector
            suggestedJourney={journeyData?.journey}
            journeyData={journeyData}
            onSelect={handleJourneySelected}
            selectedJourney={selectedJourney}
            isLoading={isLoadingJourney}
          />
        )}

        {/* Quick Wizard (Jornada Rápida - Novo) */}
        {!showJourneySelector && selectedJourney === 'quick' && (
          <QuickWizard
            onComplete={handleQuickWizardComplete}
            onBack={handleBackToJourneySelector}
          />
        )}

        {/* Guided Wizard (Jornada Guiada - Wizard Atual) */}
        {!showJourneySelector && selectedJourney === 'guided' && (
          <>
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">
                Criar <span className="text-primary">Nova Campanha</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Siga o passo-a-passo para criar sua campanha de marketing
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 max-w-[900px] w-full px-6">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Passo {currentStep === "briefing" ? "1" : currentStep === "structure" ? "2" : currentStep === "duration" ? "3" : currentStep === "styles" ? "4" : "5"} de 5
                </span>
                <span>{Math.round(percentage)}%</span>
              </div>
              <Progress value={percentage} className="bg-white/20" />
            </div>

            {/* Wizard Content */}
            <Card className="w-full self-center overflow-auto max-w-[900px] mb-20">
              {currentStep === "briefing" && (
                <BriefingStep
                  form={form}
                  onComplete={handleBriefingComplete}
                  onCancel={handleCancel}
                />
              )}

              {currentStep === "structure" && (
                <StructureSelector
                  campaignType="branding"
                  onSelect={handleStructureSelected}
                  onBack={() => setCurrentStep("briefing")}
                />
              )}

              {currentStep === "duration" && selectedStructure && (
                <DurationStep
                  structure={selectedStructure}
                  onConfirm={handleDurationConfirmed}
                  onBack={() => setCurrentStep("structure")}
                />
              )}

              {currentStep === "styles" && (
                <VisualStylePicker
                  onSelect={handleStylesSelected}
                  onBack={() => setCurrentStep("duration")}
                />
              )}

              {currentStep === "review" && (
                <ReviewStep
                  briefing={briefingData}
                  structure={selectedStructure}
                  styles={selectedStyles}
                  durationDays={durationDays}
                  postCount={postCount}
                  generationQuality={generationQuality}
                  onQualityChange={setGenerationQuality}
                  onConfirm={handleGenerate}
                  onBack={() => setCurrentStep("styles")}
                />
              )}

              {/* Loading Overlay */}
              {isGenerating && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
                  <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    <div>
                      <p className="text-lg font-semibold">Criando sua campanha...</p>
                      <p className="text-sm text-muted-foreground">Isso pode levar alguns segundos</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Weekly Context Modal */}
            <WeeklyContextModal
              isOpen={showWeeklyContextModal}
              onClose={() => setShowWeeklyContextModal(false)}
              onSelect={handleWeeklyContextSelect}
              briefingData={briefingData}
            />
          </>
        )}

        {/* Advanced Wizard (Jornada Avançada - Placeholder) */}
        {!showJourneySelector && selectedJourney === 'advanced' && (
          <Card className="max-w-2xl p-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">🔬 Jornada Avançada</h2>
              <p className="text-muted-foreground">
                A Jornada Avançada com controles totais será implementada em breve.
              </p>
              <p className="text-sm">
                Por enquanto, recomendamos usar a Jornada Guiada para criar suas campanhas.
              </p>
              <Button onClick={handleBackToJourneySelector} className="mt-4">
                Voltar para Seleção
              </Button>
            </div>
          </Card>
        )}
      </div>
    </BlurryBackground>
  );
};
