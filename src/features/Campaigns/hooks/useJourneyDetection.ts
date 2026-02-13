// @ts-nocheck
/**
 * Hook para detecção e gerenciamento de jornadas adaptativas
 * 
 * Baseado nas 25 simulações:
 * - 40% usuários → RÁPIDA (2-5min)
 * - 50% usuários → GUIADA (15-30min)
 * - 10% usuários → AVANÇADA (30min-2h)
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { campaignsService } from "../services";
import { useState, useEffect } from "react";

export type JourneyType = 'quick' | 'guided' | 'advanced';

export interface JourneyReason {
  type: 'historical' | 'profile';
  message: string;
}

export interface JourneyData {
  journey: JourneyType;
  title: string;
  description: string;
  benefits: string[];
  ideal_for: string;
  reasons: JourneyReason[];
}

interface SuggestJourneyParams {
  explicit_choice?: JourneyType;
  urgency?: boolean;
}

interface TrackJourneyEventParams {
  campaign_id: string;
  event_type: 'started' | 'completed' | 'abandoned' | 'switched';
  journey_type: JourneyType;
  time_spent_seconds?: number;
  satisfaction_rating?: number; // 1-10
}

/**
 * Hook principal para jornadas adaptativas
 */
export const useJourneyDetection = (options?: SuggestJourneyParams) => {
  const queryClient = useQueryClient();
  const [selectedJourney, setSelectedJourney] = useState<JourneyType | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Buscar sugestão de jornada
  const {
    data: suggestion,
    isLoading,
    error,
    refetch
  } = useQuery<JourneyData>({
    queryKey: ['journey-suggestion', options],
    queryFn: async () => {
      const response = await campaignsService.suggestJourney(options);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para tracking de eventos
  const trackEventMutation = useMutation({
    mutationFn: (params: TrackJourneyEventParams) => 
      campaignsService.trackJourneyEvent(params),
    onSuccess: () => {
      // Invalidar sugestões para próxima vez
      queryClient.invalidateQueries({ queryKey: ['journey-suggestion'] });
    },
  });

  // NÃO auto-selecionar - usuário DEVE escolher manualmente no JourneySelector
  // useEffect(() => {
  //   if (suggestion && !selectedJourney && !options?.explicit_choice) {
  //     setSelectedJourney(suggestion.journey);
  //   }
  // }, [suggestion, selectedJourney, options?.explicit_choice]);

  /**
   * Seleciona manualmente uma jornada
   */
  const selectJourney = (journey: JourneyType) => {
    setSelectedJourney(journey);
    setStartTime(new Date());
  };

  /**
   * Inicia tracking de jornada
   */
  const startJourney = (campaignId: string) => {
    setStartTime(new Date());
    
    if (selectedJourney) {
      trackEventMutation.mutate({
        campaign_id: campaignId,
        event_type: 'started',
        journey_type: selectedJourney,
      });
    }
  };

  /**
   * Completa tracking de jornada
   */
  const completeJourney = (
    campaignId: string, 
    satisfactionRating?: number
  ) => {
    if (!selectedJourney || !startTime) return;

    const timeSpentSeconds = Math.floor(
      (new Date().getTime() - startTime.getTime()) / 1000
    );

    trackEventMutation.mutate({
      campaign_id: campaignId,
      event_type: 'completed',
      journey_type: selectedJourney,
      time_spent_seconds: timeSpentSeconds,
      satisfaction_rating: satisfactionRating,
    });

    // Reset
    setStartTime(null);
  };

  /**
   * Abandona jornada
   */
  const abandonJourney = (campaignId: string) => {
    if (!selectedJourney || !startTime) return;

    const timeSpentSeconds = Math.floor(
      (new Date().getTime() - startTime.getTime()) / 1000
    );

    trackEventMutation.mutate({
      campaign_id: campaignId,
      event_type: 'abandoned',
      journey_type: selectedJourney,
      time_spent_seconds: timeSpentSeconds,
    });

    // Reset
    setStartTime(null);
  };

  /**
   * Troca de jornada durante criação
   */
  const switchJourney = (
    campaignId: string, 
    newJourney: JourneyType
  ) => {
    if (!selectedJourney) return;

    trackEventMutation.mutate({
      campaign_id: campaignId,
      event_type: 'switched',
      journey_type: selectedJourney,
    });

    setSelectedJourney(newJourney);
    setStartTime(new Date());
  };

  return {
    // Sugestão do sistema
    suggestedJourney: suggestion?.journey,
    journeyData: suggestion,
    isLoading,
    error,
    refetch,
    
    // Jornada selecionada pelo usuário (só retorna se usuário escolheu)
    selectedJourney: selectedJourney, // Remove fallback - deve ser null até usuário escolher
    
    // Ações
    selectJourney,
    startJourney,
    completeJourney,
    abandonJourney,
    switchJourney,
    
    // Estado
    isTracking: !!startTime,
    startTime,
  };
};

/**
 * Hook simplificado para apenas obter a sugestão
 */
export const useJourneySuggestion = () => {
  const { suggestedJourney, journeyData, isLoading } = useJourneyDetection();
  
  return {
    journey: suggestedJourney || 'guided',
    data: journeyData,
    isLoading,
  };
};

