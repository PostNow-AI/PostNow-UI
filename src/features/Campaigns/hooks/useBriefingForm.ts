/**
 * Hook de lógica para BriefingStep.
 * Separa lógica de UI seguindo React Rules (< 200 linhas).
 * Usa IA Contextual Bandits para sugestões inteligentes.
 */

import { useAuth } from "@/hooks";
import { useBriefingSuggestion } from "./useBriefingSuggestion";

export const useBriefingForm = () => {
  const { user } = useAuth();
  const profile = user?.creator_profile;
  
  // Buscar sugestão de IA (Contextual Bandits)
  const { data: aiSuggestion, isLoading: isLoadingAI } = useBriefingSuggestion();

  // Usar sugestão de IA se disponível, senão fallback para template
  const suggestedObjective = aiSuggestion?.suggestion || (
    profile
      ? `Posicionar ${profile.business_name} como autoridade em ${profile.specialization}, educando ${profile.target_audience} sobre [seu tema específico]`
      : ""
  );

  const suggestedMessage = profile?.business_description || "";

  // Detectar se usuário tem materiais (para pre-selecionar switches)
  const hasCasesLikely = profile?.business_description?.toLowerCase().includes("caso") || false;
  const hasMaterialsLikely = false;

  return {
    profile,
    suggestedObjective,
    suggestedMessage,
    hasCasesLikely,
    hasMaterialsLikely,
    isLoadingAI,
    aiDecisionId: aiSuggestion?.decision_id,
  };
};

