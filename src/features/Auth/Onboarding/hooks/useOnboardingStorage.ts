import { useCallback, useEffect, useState } from "react";
import { profileApi } from "../../Profile/services";
import { useQuery } from "@tanstack/react-query";

const STORAGE_KEY = "postnow_onboarding_data";
const EXPIRY_HOURS = 24;

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
    const { data: profile } = useQuery({
    queryKey: ["creator-profile"],
    queryFn: profileApi.getProfile,
    retry: false,
  });
  
  const [data, setData] = useState<OnboardingTempData>(getDefaultData);
  const [isLoaded, setIsLoaded] = useState(false);


  // Carregar dados do localStorage na montagem
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: OnboardingTempData = JSON.parse(stored);

        // verificar se os items estão preenchidos, se não estiverem preencher com os dados do profile
        if (!parsed.business_name && profile?.business_name) {
          parsed.business_name = profile.business_name;
        }
        if (!parsed.business_phone && profile?.business_phone) {
          parsed.business_phone = profile.business_phone;
        }
        if (!parsed.business_instagram_handle && profile?.business_instagram_handle) {
          parsed.business_instagram_handle = profile.business_instagram_handle;
        }
        if (!parsed.business_website && profile?.business_website) {
          parsed.business_website = profile.business_website;
        }
        if (!parsed.specialization && profile?.specialization) {
          parsed.specialization = profile.specialization;
        }
        if (!parsed.business_description && profile?.business_description) {
          parsed.business_description = profile.business_description;
        }
        if (!parsed.business_purpose && profile?.business_purpose) {
          parsed.business_purpose = profile.business_purpose;
        }
        if ((!parsed.brand_personality || parsed.brand_personality.length === 0) && profile?.brand_personality) {
          parsed.brand_personality = profile.brand_personality.split(", ").map((s: string) => s.trim());
        }
        if (!parsed.products_services && profile?.products_services) {
          parsed.products_services = profile.products_services;
        }
        if (!parsed.target_audience && profile?.target_audience) {
          parsed.target_audience = profile.target_audience;
        }
        if ((!parsed.target_interests || parsed.target_interests.length === 0) && profile?.target_interests) {
          parsed.target_interests = profile.target_interests.split(", ").map((s: string) => s.trim());
        }
        if (!parsed.business_location && profile?.business_location) {
          parsed.business_location = profile.business_location;
        }
        if (!parsed.main_competitors && profile?.main_competitors) {
          parsed.main_competitors = profile.main_competitors;
        }
        if (!parsed.reference_profiles && profile?.reference_profiles) {
          parsed.reference_profiles = profile.reference_profiles;
        }

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
  }, [profile, data.current_step]);

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

  // Inicializar com dados existentes (modo edição)
  const initializeWithData = useCallback((existingData: Partial<OnboardingTempData>) => {
    setData((prev) => ({
      ...prev,
      ...existingData,
      current_step: 2, // Pular welcome no modo edição
    }));
  }, []);

  // Verificar se onboarding foi completado
  const isCompleted = Boolean(data.completed_at);

  // Obter dados formatados para API (Step 1)
  const getStep1Payload = useCallback(() => {
    return {
      business_name: data.business_name,
      business_phone: data.business_phone,
      business_website: data.business_website,
      business_instagram_handle: data.business_instagram_handle,
      specialization: data.specialization,
      business_description: data.business_description,
      business_purpose: data.business_purpose,
      brand_personality: data.brand_personality.join(", "), // Array → String
      products_services: data.products_services,
      business_location: data.business_location,
      target_audience: data.target_audience,
      target_interests: data.target_interests.join(", "), // Array → String
      main_competitors: data.main_competitors,
      reference_profiles: data.reference_profiles,
    };
  }, [data]);

  // Obter dados formatados para API (Step 2)
  const getStep2Payload = useCallback(() => {
    return {
      voice_tone: data.voice_tone,
      logo: data.logo,
      color_1: data.colors[0] || "#FF6B6B",
      color_2: data.colors[1] || "#4ECDC4",
      color_3: data.colors[2] || "#45B7D1",
      color_4: data.colors[3] || "#96CEB4",
      color_5: data.colors[4] || "#FFBE0B",
      visual_style_ids: data.visual_style_ids,
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
