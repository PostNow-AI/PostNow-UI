/**
 * Dialog/Sheet de criação de campanha - Wizard multi-step.
 * Híbrido: Sheet em mobile, Dialog em desktop (seguindo padrão sidebar.tsx).
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Button,
  Form,
  Progress,
} from "@/components/ui";
import { briefingSchema, type BriefingFormData } from "../../constants";
import { BriefingStep } from "./BriefingStep";
import { StructureSelector } from "./StructureSelector";
import { DurationStep } from "./DurationStep";
import { VisualStylePicker } from "./VisualStylePicker";
import { ReviewStep } from "./ReviewStep";
import { useCampaignWizard } from "../../hooks/useCampaignWizard";
import type { WizardStep, CampaignType, CampaignStructure } from "../../types";

interface CampaignCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CampaignCreationDialog = ({
  isOpen,
  onClose,
}: CampaignCreationDialogProps) => {
  // Usar hook de wizard (lógica separada)
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
  
  const form = useForm<BriefingFormData>({
    resolver: zodResolver(briefingSchema),
    defaultValues: {
      objective: "",
      main_message: "",
      has_cases: false,
      has_materials: false,
    },
  });

  const handleClose = () => {
    form.reset();
    resetWizard();
    onClose();
  };

  const handleGenerate = async () => {
    try {
      // Criar campanha no backend
      const campaignData = {
        name: `Campanha ${new Date().toLocaleDateString("pt-BR")}`,
        type: "branding" as const,
        objective: briefingData.objective || "",
        main_message: briefingData.main_message,
        structure: selectedStructure!,
        duration_days: durationDays,
        post_count: postCount,
        visual_styles: selectedStyles,
        briefing_data: briefingData,
      };
      
      console.log("Criando campanha...", campaignData);
      
      // TODO: Descomentar quando backend estiver pronto
      // const campaign = await campaignService.createCampaign(campaignData);
      // const result = await campaignService.generateContent(campaign.id, {...});
      // toast.success(`Campanha gerada! ${result.total_generated} posts criados.`);
      // onClose();
      
      // Por ora, apenas fechar e mostrar mensagem
      alert("Campanha criada! (Geração será implementada na próxima iteração)");
      onClose();
      
    } catch (error) {
      console.error("Erro ao gerar campanha:", error);
      alert("Erro ao criar campanha. Verifique o console.");
    }
  };

  const isMobile = useIsMobile();

  // Conteúdo do wizard (reutilizado em mobile e desktop)
  const wizardContent = (
    <>
      <div className="mb-4">
        <Progress value={percentage} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          Passo {currentStep === "briefing" ? "1" : currentStep === "structure" ? "2" : currentStep === "duration" ? "3" : currentStep === "styles" ? "4" : "5"} de 5
        </p>
      </div>

        {currentStep === "briefing" && (
          <BriefingStep
            form={form}
            onComplete={(data) => handleBriefingComplete(data)}
            onCancel={handleClose}
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
    </>
  );

  // Mobile: Sheet bottom (tela cheia)
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetContent side="bottom" className="h-[95vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Nova Campanha</SheetTitle>
          </SheetHeader>
          {wizardContent}
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Dialog (modal centrado)
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto p-6 md:p-8">
        <DialogHeader>
          <DialogTitle>Nova Campanha</DialogTitle>
        </DialogHeader>
        {wizardContent}
      </DialogContent>
    </Dialog>
  );
};

