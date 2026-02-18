import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { audienceJsonToString } from "../utils/audienceUtils";

const STORAGE_KEY = "postnow_onboarding_data";
const EXPIRY_HOURS = 24;
const MAX_STORAGE_SIZE = 50 * 1024; // 50KB limite máximo
const MAX_STRING_FIELD_LENGTH = 2000; // Limite por campo de texto

// Schema Zod para validação dos dados do localStorage
const OnboardingStorageSchema = z.object({
  business_name: z.string().max(100).default(""),
  business_phone: z.string().max(20).default(""),
  business_instagram_handle: z.string().max(30).default(""),
  business_website: z.string().max(200).default(""),
  specialization: z.string().max(100).default(""),
  business_description: z.string().max(500).default(""),
  business_purpose: z.string().max(500).default(""),
  brand_personality: z.array(z.string().max(50)).max(10).default([]),
  products_services: z.string().max(500).default(""),
  target_audience: z.string().max(1000).default(""),
  target_interests: z.array(z.string().max(50)).max(20).default([]),
  business_location: z.string().max(200).default(""),
  main_competitors: z.string().max(500).default(""),
  reference_profiles: z.string().max(500).default(""),
  voice_tone: z.string().max(50).default(""),
  visual_style_ids: z.array(z.string()).max(10).default([]),
  colors: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)).max(10).default(["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFBE0B"]),
  logo: z.string().max(MAX_STRING_FIELD_LENGTH).default(""),
  suggested_colors: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)).max(10).default([]),
  current_step: z.number().int().min(1).max(20).default(1),
  completed_at: z.string().optional(),
  expires_at: z.string(),
}).passthrough(); // Permite campos extras para compatibilidade

// Valida e sanitiza dados do localStorage
const validateStorageData = (data: unknown): OnboardingTempData | null => {
  try {
    const result = OnboardingStorageSchema.safeParse(data);
    if (result.success) {
      return result.data as OnboardingTempData;
    }
    return null;
  } catch {
    return null;
  }
};

// Limita tamanho de strings para prevenir overflow
const truncateString = (value: string, maxLength: number = MAX_STRING_FIELD_LENGTH): string => {
  return value.length > maxLength ? value.slice(0, maxLength) : value;
};

// Sanitiza dados antes de salvar
const sanitizeData = (data: Partial<OnboardingTempData>): Partial<OnboardingTempData> => {
  const sanitized: Partial<OnboardingTempData> = { ...data };

  // Limitar campos de texto
  if (sanitized.business_name) sanitized.business_name = truncateString(sanitized.business_name, 100);
  if (sanitized.business_description) sanitized.business_description = truncateString(sanitized.business_description, 500);
  if (sanitized.business_purpose) sanitized.business_purpose = truncateString(sanitized.business_purpose, 500);
  if (sanitized.business_location) sanitized.business_location = truncateString(sanitized.business_location, 200);
  if (sanitized.target_audience) sanitized.target_audience = truncateString(sanitized.target_audience, 1000);
  if (sanitized.products_services) sanitized.products_services = truncateString(sanitized.products_services, 500);
  if (sanitized.main_competitors) sanitized.main_competitors = truncateString(sanitized.main_competitors, 500);
  if (sanitized.reference_profiles) sanitized.reference_profiles = truncateString(sanitized.reference_profiles, 500);

  // Limitar arrays
  if (sanitized.brand_personality) sanitized.brand_personality = sanitized.brand_personality.slice(0, 10);
  if (sanitized.target_interests) sanitized.target_interests = sanitized.target_interests.slice(0, 20);
  if (sanitized.visual_style_ids) sanitized.visual_style_ids = sanitized.visual_style_ids.slice(0, 10);
  if (sanitized.colors) sanitized.colors = sanitized.colors.slice(0, 10);

  return sanitized;
};

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
        const parsed = JSON.parse(stored);
        // Validar com Zod
        const validated = validateStorageData(parsed);

        if (!validated) {
          // Dados inválidos, limpar
          localStorage.removeItem(STORAGE_KEY);
          setIsLoaded(true);
          return;
        }

        // Verificar se expirou
        if (new Date(validated.expires_at) > new Date()) {
          // Merge com defaults para garantir que novos campos existam
          setData({ ...getDefaultData(), ...validated });
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
      // Sanitiza dados novos para prevenir overflow
      const sanitizedNewData = sanitizeData(newData);

      const updated = {
        ...prev,
        ...sanitizedNewData,
        expires_at: new Date(Date.now() + EXPIRY_HOURS * 60 * 60 * 1000).toISOString(),
      };

      const serialized = JSON.stringify(updated);

      // Verificar tamanho antes de salvar
      if (serialized.length > MAX_STORAGE_SIZE) {
        // Log removido em produção - dados muito grandes
        // Não salva para evitar overflow
        return prev;
      }

      try {
        localStorage.setItem(STORAGE_KEY, serialized);
      } catch {
        // QuotaExceededError - localStorage cheio
        // Tenta limpar dados expirados de outras chaves
        return prev;
      }

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
      business_phone: data.business_phone || "",
      business_website: data.business_website,
      business_instagram_handle: data.business_instagram_handle,
      specialization: data.specialization,
      business_description: data.business_description,
      business_purpose: data.business_purpose || "",
      brand_personality: data.brand_personality.join(", "), // Array → String
      products_services: data.products_services || "",
      business_location: data.business_location,
      target_audience: audienceJsonToString(data.target_audience), // JSON → String legível
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
