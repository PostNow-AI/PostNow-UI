/**
 * Hook de lógica para seleção de estilos visuais.
 * Busca os estilos do perfil do usuário E todos os estilos disponíveis.
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { campaignService } from "../services";
import { api } from "@/lib/api";

export const useVisualStyles = () => {
  const { user } = useAuth();
  
  // IDs dos estilos que usuário escolheu no onboarding
  const profileStyleIds = user?.creator_profile?.visual_style_ids || [];
  
  // Buscar TODOS os estilos visuais disponíveis (biblioteca de 20)
  const { data: allStyles, isLoading: isLoadingAll } = useQuery({
    queryKey: ["all-visual-styles"],
    queryFn: async () => {
      const response = await api.get("/api/v1/global-options/visual-styles/");
      return response.data.data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
  
  // Estilos do perfil do usuário (filtrar da biblioteca completa)
  const visualStylePreferences = allStyles?.filter((style: any) => 
    profileStyleIds.includes(style.id)
  ) || [];

  // Estado de seleção (inicializa com estilos do perfil)
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    if (profileStyleIds.length > 0 && selected.length === 0) {
      // Converter string IDs para numbers se necessário
      const ids = profileStyleIds.map((id: any) => 
        typeof id === "string" ? parseInt(id) : id
      );
      setSelected(ids);
    }
  }, [profileStyleIds, allStyles]); // Aguardar allStyles carregar

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
    const ids = profileStyleIds.map((id: any) => 
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
    visualStylePreferences, // Estilos do perfil (filtrados)
    campaignStyles: allStyles, // Todos os 20 estilos
    isLoading: isLoadingAll,
    hasProfileStyles: profileStyleIds.length > 0,
  };
};


