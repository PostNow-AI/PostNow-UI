/**
 * Hook principal para lógica do wizard de campanhas.
 * Gerencia estado, navegação entre steps, e dados acumulados.
 * COM AUTO-SAVE: Estado persiste ao voltar.
 * Seguindo padrão de useOnboarding.ts do Onboarding.
 */

import { useState, useEffect } from "react";
import type { WizardStep, CampaignType, CampaignStructure, BriefingData } from "../types";
import { useCampaignAutoSave } from "./useCampaignAutoSave";

export const useCampaignWizard = () => {
  const [currentStep, setCurrentStep] = useState<WizardStep>("briefing");
  const [campaignType, setCampaignType] = useState<CampaignType | null>(null);
  const [selectedStructure, setSelectedStructure] = useState<CampaignStructure | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [durationDays, setDurationDays] = useState<number>(14);
  const [postCount, setPostCount] = useState<number>(8);
  const [briefingData, setBriefingData] = useState<Partial<BriefingData>>({});
  const [weeklyContextOpportunities, setWeeklyContextOpportunities] = useState<number[]>([]);
  const [showWeeklyContextModal, setShowWeeklyContextModal] = useState(false);
  
  // NOVO: Configurações de qualidade de geração
  const [generationQuality, setGenerationQuality] = useState<'fast' | 'premium'>('fast');
  const [visualHarmonyEnabled, setVisualHarmonyEnabled] = useState(true);

  // Cálculo de progresso (para progress bar)
  const steps: WizardStep[] = ["briefing", "structure", "duration", "styles", "review"];
  const currentStepIndex = steps.indexOf(currentStep);
  const percentage = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleBriefingComplete = (data: BriefingData) => {
    setBriefingData(data);
    // Mostrar Weekly Context antes de ir para structure
    setShowWeeklyContextModal(true);
  };

  const handleWeeklyContextSelect = (opportunityIds: number[]) => {
    setWeeklyContextOpportunities(opportunityIds);
    setShowWeeklyContextModal(false);
    setCurrentStep("structure");
  };

  const handleStructureSelected = (structure: CampaignStructure) => {
    setSelectedStructure(structure);
    setCurrentStep("duration");
  };

  const handleDurationConfirmed = (days: number, posts: number) => {
    setDurationDays(days);
    setPostCount(posts);
    setCurrentStep("styles");
  };

  const handleStylesSelected = (styles: string[]) => {
    setSelectedStyles(styles);
    setCurrentStep("review");
  };

  // Auto-save: Salvar estado a cada mudança
  const draftData = {
    current_phase: currentStep,
    briefing_data: briefingData,
    structure_chosen: selectedStructure,
    styles_chosen: selectedStyles,
    duration_days: durationDays,
    post_count: postCount,
  };

  const { markAsChanged } = useCampaignAutoSave(draftData);

  // Marcar como changed quando qualquer estado muda
  useEffect(() => {
    markAsChanged();
  }, [briefingData, selectedStructure, selectedStyles, durationDays, postCount, currentStep]);

  const resetWizard = () => {
    setCurrentStep("briefing");
    setCampaignType(null);
    setSelectedStructure(null);
    setSelectedStyles([]);
    setDurationDays(14);
    setPostCount(8);
    setBriefingData({});
    setWeeklyContextOpportunities([]);
    setShowWeeklyContextModal(false);
    setGenerationQuality('fast');
    setVisualHarmonyEnabled(true);
  };

  return {
    currentStep,
    setCurrentStep,
    campaignType,
    setCampaignType,
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
    handleNext,
    handleBack,
    handleBriefingComplete,
    handleWeeklyContextSelect,
    handleStructureSelected,
    handleDurationConfirmed,
    handleStylesSelected,
    resetWizard,
  };
};

