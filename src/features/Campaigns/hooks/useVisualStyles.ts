/**
 * Hook de lógica para seleção de estilos visuais.
 * Reutiliza useVisualStylePreferences do Onboarding.
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks";
import { useVisualStylePreferences } from "@/features/Auth/Onboarding/hooks/useVisualStylePreferences";
import { useQuery } from "@tanstack/react-query";
import { campaignService } from "../services";

export const useVisualStyles = () => {
  const { user } = useAuth();
  
  // Estilos que usuário escolheu no onboarding
  const profileStyleIds = user?.creator_profile?.visual_style_ids || [];
  
  // Buscar detalhes dos estilos do onboarding (VisualStylePreference)
  const { visualStylePreferences, isLoading: isLoadingOnboarding } = useVisualStylePreferences();
  
  // Buscar estilos de campanhas RANQUEADOS por IA (Thompson Sampling!)
  const { data: campaignStyles, isLoading: isLoadingCampaign } = useQuery({
    queryKey: ["campaign-visual-styles-ranked"],
    queryFn: campaignService.getRankedVisualStyles,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  // Estado de seleção (inicializa com estilos do perfil)
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    if (profileStyleIds.length > 0) {
      // Converter string IDs para numbers se necessário
      const ids = profileStyleIds.map((id) => 
        typeof id === "string" ? parseInt(id) : id
      );
      setSelected(ids);
    }
  }, [profileStyleIds.length]);

  const toggleStyle = (styleId: number) => {
    setSelected((prev) => {
      if (prev.includes(styleId)) {
        return prev.filter((id) => id !== styleId);
      } else {
        // Limitar a 3 estilos
        if (prev.length >= 3) {
          return prev;
        }
        return [...prev, styleId];
      }
    });
  };

  const isSelected = (styleId: number) => selected.includes(styleId);

  const isFromProfile = (styleId: number) => {
    const ids = profileStyleIds.map((id) => 
      typeof id === "string" ? parseInt(id) : id
    );
    return ids.includes(styleId);
  };

  return {
    selected,
    setSelected,
    toggleStyle,
    isSelected,
    isFromProfile,
    profileStyleIds,
    visualStylePreferences, // Estilos do onboarding
    campaignStyles, // Estilos do Campaigns (18)
    isLoading: isLoadingOnboarding || isLoadingCampaign,
  };
};

