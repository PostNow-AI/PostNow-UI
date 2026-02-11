import { useCallback, useEffect, useState } from "react";
import type { OnboardingFormData } from "@/features/Auth/Onboarding/constants/onboardingSchema";

const STORAGE_KEY = "postnow_onboarding_data";
const EXPIRY_HOURS = 24; // 24 hours

export interface OnboardingTempData {
  // Fase 1: Boas-vindas
  // (sem dados, apenas introdução)

  // Fase 2: Seu Negócio
  business_name: string;
  business_phone: string;
  business_instagram_handle: string;
  business_website: string;
  specialization: string;
  business_description: string;
  business_purpose: string;
  brand_personality: string[];
  products_services: string;

  // Fase 3: Seu Público
  target_audience: string;
  target_interests: string[];
  business_location: string;
  main_competitors: string;
  reference_profiles: string;

  // Fase 4: Identidade Visual
  voice_tone: string;
  visual_style_ids: string[];
  colors: string[];
  logo: string;
  suggested_colors: string[];

  // Metadados
  current_step: number;
  completed_at?: string;
  expires_at: string;
}

const getDefaultData = (): OnboardingTempData => ({
  business_name: "",
  business_phone: "",
  business_instagram_handle: "",
  business_website: "",
  specialization: "",
  business_description: "",
  business_purpose: "",
  brand_personality: [],
  products_services: "",
  target_audience: "",
  target_interests: [],
  business_location: "",
  main_competitors: "",
  reference_profiles: "",
  voice_tone: "",
  visual_style_ids: [],
  colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFBE0B"],
  logo: "",
  suggested_colors: [],
  current_step: 1,
  expires_at: new Date(Date.now() + EXPIRY_HOURS * 60 * 60 * 1000).toISOString(),
});

export const useOnboardingStorage = () => {
  const [data, setData] = useState<OnboardingTempData>(getDefaultData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar dados do localStorage na montagem
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: OnboardingTempData = JSON.parse(stored);
        // Verificar se expirou
        if (new Date(parsed.expires_at) > new Date()) {
          // Merge com defaults para garantir que novos campos existam
          setData({ ...getDefaultData(), ...parsed });
        } else {
          // Dados expirados, limpar
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoaded(true);
  }, []);

  // Salvar dados no localStorage sempre que mudarem
  const saveData = useCallback((newData: Partial<OnboardingTempData>) => {
    setData((prev) => {
      const updated = {
        ...prev,
        ...newData,
        expires_at: new Date(Date.now() + EXPIRY_HOURS * 60 * 60 * 1000).toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Atualizar step atual
  const setCurrentStep = useCallback((step: number) => {
    saveData({ current_step: step });
  }, [saveData]);

  // Marcar como completo
  const markAsCompleted = useCallback(() => {
    saveData({ completed_at: new Date().toISOString() });
  }, [saveData]);

  // Limpar dados (após criar conta)
  const clearData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(getDefaultData());
  }, []);

  // Verificar se onboarding foi completado
  const isCompleted = Boolean(data.completed_at);

  // Inicializar com dados do backend (para modo edição)
  const initializeWithData = useCallback((backendData: OnboardingFormData) => {
    const mappedData: OnboardingTempData = {
      ...getDefaultData(),
      business_name: backendData.business_name || "",
      business_phone: backendData.business_phone || "",
      business_instagram_handle: backendData.business_instagram_handle || "",
      business_website: backendData.business_website || "",
      specialization: backendData.specialization || "",
      business_description: backendData.business_description || "",
      business_purpose: backendData.business_purpose || "",
      brand_personality: backendData.brand_personality?.split(", ") || [],
      products_services: backendData.products_services || "",
      target_audience: backendData.target_audience || "",
      target_interests: backendData.target_interests?.split(", ") || [],
      business_location: backendData.business_location || "",
      main_competitors: backendData.main_competitors || "",
      reference_profiles: backendData.reference_profiles || "",
      voice_tone: backendData.voice_tone || "",
      visual_style_ids: backendData.visual_style_ids || [],
      colors: [
        backendData.color_1 || "#FF6B6B",
        backendData.color_2 || "#4ECDC4",
        backendData.color_3 || "#45B7D1",
        backendData.color_4 || "#96CEB4",
        backendData.color_5 || "#FFBE0B",
      ],
      logo: backendData.logo || "",
      suggested_colors: [],
      current_step: 2, // Pular welcome
      expires_at: new Date(Date.now() + EXPIRY_HOURS * 60 * 60 * 1000).toISOString(),
    };
    setData(mappedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedData));
  }, []);

  // Formatar website para URL válida
  const formatWebsiteUrl = useCallback((url: string): string | null => {
    if (!url || !url.trim()) return null;
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  }, []);

  // Obter dados formatados para API (Step 1)
  const getStep1Payload = useCallback(() => {
    return {
      business_name: data.business_name || null,
      business_phone: data.business_phone || null,
      business_website: formatWebsiteUrl(data.business_website),
      business_instagram_handle: data.business_instagram_handle || null,
      specialization: data.specialization || null,
      business_description: data.business_description || null,
      business_purpose: data.business_purpose || null,
      brand_personality: data.brand_personality.length > 0 ? data.brand_personality.join(", ") : null,
      products_services: data.products_services || null,
      business_location: data.business_location || null,
      target_audience: data.target_audience || null,
      target_interests: data.target_interests.length > 0 ? data.target_interests.join(", ") : null,
      main_competitors: data.main_competitors || null,
      reference_profiles: data.reference_profiles || null,
    };
  }, [data, formatWebsiteUrl]);

  // Obter dados formatados para API (Step 2)
  const getStep2Payload = useCallback(() => {
    return {
      voice_tone: data.voice_tone || null,
      logo: data.logo || null,
      color_1: data.colors[0] || "#FF6B6B",
      color_2: data.colors[1] || "#4ECDC4",
      color_3: data.colors[2] || "#45B7D1",
      color_4: data.colors[3] || "#96CEB4",
      color_5: data.colors[4] || "#FFBE0B",
      visual_style_ids: data.visual_style_ids.length > 0 ? data.visual_style_ids : [],
    };
  }, [data]);

  return {
    data,
    isLoaded,
    isCompleted,
    saveData,
    setCurrentStep,
    markAsCompleted,
    clearData,
    getStep1Payload,
    getStep2Payload,
    initializeWithData,
  };
};
