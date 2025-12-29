/**
 * Página dedicada de criação de campanha (não modal).
 * Seguindo padrão de OnboardingForm.tsx - página cheia sem desfoque de fundo.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Progress } from "@/components/ui";
import { BlurryBackground } from "@/components/ui/blurry-background";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { briefingSchema, type BriefingFormData } from "@/features/Campaigns/constants";
import { useCampaignWizard, useCampaignCreation, useCampaignGeneration } from "@/features/Campaigns/hooks";
import { BriefingStep } from "@/features/Campaigns/components/wizard/BriefingStep";
import { StructureSelector } from "@/features/Campaigns/components/wizard/StructureSelector";
import { DurationStep } from "@/features/Campaigns/components/wizard/DurationStep";
import { VisualStylePicker } from "@/features/Campaigns/components/wizard/VisualStylePicker";
import { ReviewStep } from "@/features/Campaigns/components/wizard/ReviewStep";

export const CampaignCreationPage = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const {
    currentStep,
    selectedStructure,
    selectedStyles,
    durationDays,
    postCount,
    briefingData,
    percentage,
    handleBriefingComplete,
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
    resetWizard();
    navigate("/campaigns");
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
      };
      
      const campaign = await createCampaignMutation.mutateAsync(campaignData);
      
      toast.success("Campanha criada! Gerando posts...");
      
      // TODO: Chamar generate quando backend estiver pronto
      // const result = await generateMutation.mutateAsync(campaign.id);
      
      // Por enquanto: Navegar de volta
      navigate("/campaigns");
      
    } catch (error) {
      console.error("Erro ao gerar:", error);
      toast.error("Erro ao criar campanha");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <BlurryBackground variant="2">
      <div className="flex flex-col items-center space-y-6 px-4 min-h-screen py-8">
        {/* Header */}
        <div className="text-center space-y-2 mt-8">
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
      </div>
    </BlurryBackground>
  );
};
