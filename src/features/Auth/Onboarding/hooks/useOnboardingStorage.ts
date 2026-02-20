import { useCallback, useEffect, useRef, useState } from "react";
import { profileApi } from "../../Profile/services";
import { useQuery } from "@tanstack/react-query";
import type { OnboardingFormData } from "@/features/Auth/Onboarding/constants/onboardingSchema";
import {
  saveTempOnboardingData,
  getTempOnboardingData,
  linkTempDataToUser,
  trackOnboardingStep,
} from "../services";

const STORAGE_KEY = "postnow_onboarding_data";
const SESSION_KEY = "postnow_onboarding_session_id";
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

const generateSessionId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `onb_${timestamp}_${random}`;
};

const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

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
  const [sessionId, setSessionId] = useState<string>("");
  const syncInProgressRef = useRef(false);

  // Carregar dados na montagem (localStorage + backend + profile)
  useEffect(() => {
    const loadData = async () => {
      const sid = getOrCreateSessionId();
      setSessionId(sid);

      // Primeiro, tentar carregar do localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      let localData: OnboardingTempData | null = null;

      if (stored) {
        try {
          const parsed: OnboardingTempData = JSON.parse(stored);
          if (new Date(parsed.expires_at) > new Date()) {
            localData = { ...getDefaultData(), ...parsed };
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      // Depois, tentar recuperar do backend
      try {
        const backendData = await getTempOnboardingData(sid);
        if (backendData) {
          // Merge backend data com local data (backend tem prioridade)
          const businessData = backendData.business_data || {};
          const brandingData = backendData.branding_data || {};

          const mergedData: OnboardingTempData = {
            ...(localData || getDefaultData()),
            business_name: (businessData.business_name as string) || localData?.business_name || "",
            business_phone: (businessData.business_phone as string) || localData?.business_phone || "",
            business_instagram_handle: (businessData.business_instagram_handle as string) || localData?.business_instagram_handle || "",
            business_website: (businessData.business_website as string) || localData?.business_website || "",
            specialization: (businessData.specialization as string) || localData?.specialization || "",
            business_description: (businessData.business_description as string) || localData?.business_description || "",
            business_purpose: (businessData.business_purpose as string) || localData?.business_purpose || "",
            brand_personality: (businessData.brand_personality as string)?.split(", ") || localData?.brand_personality || [],
            products_services: (businessData.products_services as string) || localData?.products_services || "",
            target_audience: (businessData.target_audience as string) || localData?.target_audience || "",
            target_interests: (businessData.target_interests as string)?.split(", ") || localData?.target_interests || [],
            business_location: (businessData.business_location as string) || localData?.business_location || "",
            main_competitors: (businessData.main_competitors as string) || localData?.main_competitors || "",
            reference_profiles: (businessData.reference_profiles as string) || localData?.reference_profiles || "",
            voice_tone: (brandingData.voice_tone as string) || localData?.voice_tone || "",
            logo: (brandingData.logo as string) || localData?.logo || "",
            colors: [
              (brandingData.color_1 as string) || localData?.colors?.[0] || "#FF6B6B",
              (brandingData.color_2 as string) || localData?.colors?.[1] || "#4ECDC4",
              (brandingData.color_3 as string) || localData?.colors?.[2] || "#45B7D1",
              (brandingData.color_4 as string) || localData?.colors?.[3] || "#96CEB4",
              (brandingData.color_5 as string) || localData?.colors?.[4] || "#FFBE0B",
            ],
            visual_style_ids: (brandingData.visual_style_ids as string[]) || localData?.visual_style_ids || [],
            expires_at: backendData.expires_at || localData?.expires_at || getDefaultData().expires_at,
          };

          setData(mergedData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
        } else if (localData) {
          // Se não tem dados no backend, preencher com dados do profile
          if (profile) {
            if (!localData.business_name && profile.business_name) {
              localData.business_name = profile.business_name;
            }
            if (!localData.business_phone && profile.business_phone) {
              localData.business_phone = profile.business_phone;
            }
            if (!localData.business_instagram_handle && profile.business_instagram_handle) {
              localData.business_instagram_handle = profile.business_instagram_handle;
            }
            if (!localData.business_website && profile.business_website) {
              localData.business_website = profile.business_website;
            }
            if (!localData.specialization && profile.specialization) {
              localData.specialization = profile.specialization;
            }
            if (!localData.business_description && profile.business_description) {
              localData.business_description = profile.business_description;
            }
            if (!localData.business_purpose && profile.business_purpose) {
              localData.business_purpose = profile.business_purpose;
            }
            if ((!localData.brand_personality || localData.brand_personality.length === 0) && profile.brand_personality) {
              localData.brand_personality = profile.brand_personality.split(", ").map((s: string) => s.trim());
            }
            if (!localData.products_services && profile.products_services) {
              localData.products_services = profile.products_services;
            }
            if (!localData.target_audience && profile.target_audience) {
              localData.target_audience = profile.target_audience;
            }
            if ((!localData.target_interests || localData.target_interests.length === 0) && profile.target_interests) {
              localData.target_interests = profile.target_interests.split(", ").map((s: string) => s.trim());
            }
            if (!localData.business_location && profile.business_location) {
              localData.business_location = profile.business_location;
            }
            if (!localData.main_competitors && profile.main_competitors) {
              localData.main_competitors = profile.main_competitors;
            }
            if (!localData.reference_profiles && profile.reference_profiles) {
              localData.reference_profiles = profile.reference_profiles;
            }
          }
          setData(localData);
        }
      } catch {
        // Se falhar ao buscar do backend, usar dados locais
        if (localData) {
          setData(localData);
        }
      }

      setIsLoaded(true);
    };

    loadData();
  }, [profile]);

  // Sincronizar com backend
  const syncToBackend = useCallback(async (dataToSync: OnboardingTempData) => {
    if (syncInProgressRef.current || !sessionId) return;

    syncInProgressRef.current = true;
    try {
      await saveTempOnboardingData({
        session_id: sessionId,
        // Business data
        business_name: dataToSync.business_name || undefined,
        business_phone: dataToSync.business_phone || undefined,
        business_website: dataToSync.business_website || undefined,
        business_instagram_handle: dataToSync.business_instagram_handle || undefined,
        specialization: dataToSync.specialization || undefined,
        business_description: dataToSync.business_description || undefined,
        business_purpose: dataToSync.business_purpose || undefined,
        brand_personality: dataToSync.brand_personality?.length > 0 ? dataToSync.brand_personality.join(", ") : undefined,
        products_services: dataToSync.products_services || undefined,
        target_audience: dataToSync.target_audience || undefined,
        target_interests: dataToSync.target_interests?.length > 0 ? dataToSync.target_interests.join(", ") : undefined,
        business_location: dataToSync.business_location || undefined,
        main_competitors: dataToSync.main_competitors || undefined,
        reference_profiles: dataToSync.reference_profiles || undefined,
        // Branding data
        voice_tone: dataToSync.voice_tone || undefined,
        logo: dataToSync.logo || undefined,
        color_1: dataToSync.colors?.[0] || undefined,
        color_2: dataToSync.colors?.[1] || undefined,
        color_3: dataToSync.colors?.[2] || undefined,
        color_4: dataToSync.colors?.[3] || undefined,
        color_5: dataToSync.colors?.[4] || undefined,
        visual_style_ids: dataToSync.visual_style_ids?.length > 0 ? dataToSync.visual_style_ids : undefined,
      });
    } catch (error) {
      console.warn("Failed to sync onboarding data to backend:", error);
    } finally {
      syncInProgressRef.current = false;
    }
  }, [sessionId]);

  // Salvar dados no localStorage e sincronizar com backend
  const saveData = useCallback((newData: Partial<OnboardingTempData>) => {
    setData((prev) => {
      const updated = {
        ...prev,
        ...newData,
        expires_at: new Date(Date.now() + EXPIRY_HOURS * 60 * 60 * 1000).toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      // Sync to backend asynchronously
      syncToBackend(updated);
      return updated;
    });
  }, [syncToBackend]);

  // Atualizar step atual
  const setCurrentStep = useCallback((step: number) => {
    saveData({ current_step: step });
    // Track step completion
    if (sessionId) {
      trackOnboardingStep(sessionId, step, true).catch(() => {
        // Ignore tracking errors
      });
    }
  }, [saveData, sessionId]);

  // Marcar como completo
  const markAsCompleted = useCallback(() => {
    saveData({ completed_at: new Date().toISOString() });
  }, [saveData]);

  // Limpar dados (após criar conta)
  const clearData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSION_KEY);
    setData(getDefaultData());
    setSessionId("");
  }, []);

  // Verificar se onboarding foi completado
  const isCompleted = Boolean(data.completed_at);

  // Vincular dados ao usuário após signup
  const linkDataToUser = useCallback(async (): Promise<boolean> => {
    if (!sessionId) return false;
    try {
      const result = await linkTempDataToUser(sessionId);
      return result.profile_updated;
    } catch (error) {
      console.warn("Failed to link onboarding data to user:", error);
      return false;
    }
  }, [sessionId]);

  // Inicializar com dados do backend (para modo edição)
  const initializeWithData = useCallback((backendData: OnboardingFormData | Partial<OnboardingTempData>) => {
    const mappedData: OnboardingTempData = {
      ...getDefaultData(),
      business_name: backendData.business_name || "",
      business_phone: backendData.business_phone || "",
      business_instagram_handle: backendData.business_instagram_handle || "",
      business_website: backendData.business_website || "",
      specialization: backendData.specialization || "",
      business_description: backendData.business_description || "",
      business_purpose: backendData.business_purpose || "",
      brand_personality: Array.isArray(backendData.brand_personality)
        ? backendData.brand_personality
        : backendData.brand_personality?.split(", ") || [],
      products_services: backendData.products_services || "",
      target_audience: backendData.target_audience || "",
      target_interests: Array.isArray(backendData.target_interests)
        ? backendData.target_interests
        : backendData.target_interests?.split(", ") || [],
      business_location: backendData.business_location || "",
      main_competitors: backendData.main_competitors || "",
      reference_profiles: backendData.reference_profiles || "",
      voice_tone: backendData.voice_tone || "",
      visual_style_ids: ('visual_style_ids' in backendData && backendData.visual_style_ids)
        ? backendData.visual_style_ids.map(id => String(id))
        : [],
      colors: ('colors' in backendData && backendData.colors)
        ? backendData.colors
        : [
            ('color_1' in backendData && backendData.color_1) || "#FF6B6B",
            ('color_2' in backendData && backendData.color_2) || "#4ECDC4",
            ('color_3' in backendData && backendData.color_3) || "#45B7D1",
            ('color_4' in backendData && backendData.color_4) || "#96CEB4",
            ('color_5' in backendData && backendData.color_5) || "#FFBE0B",
          ],
      logo: backendData.logo || "",
      suggested_colors: [],
      current_step: 2, // Pular welcome
      expires_at: new Date(Date.now() + EXPIRY_HOURS * 60 * 60 * 1000).toISOString(),
    };
    setData(mappedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedData));
  }, []);

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
    sessionId,
    saveData,
    setCurrentStep,
    markAsCompleted,
    clearData,
    linkDataToUser,
    getStep1Payload,
    getStep2Payload,
    initializeWithData,
  };
};
