// @ts-nocheck
import { api } from "./api";

export interface Profession {
  id: number;
  name: string;
  is_custom: boolean;
  is_predefined: boolean;
}

export interface Specialization {
  id: number;
  name: string;
  profession: number;
  profession_name: string;
  created_by?: number;
  created_by_username?: string;
  usage_count: number;
  is_active: boolean;
  created_at: string;
}

export interface Font {
  id: number;
  name: string;
  created_by?: number;
  created_by_username?: string;
  usage_count: number;
  is_active: boolean;
  created_at: string;
}

export interface FontList {
  predefined: Font[];
  custom: Font[];
}

export interface CreateCustomProfessionData {
  name: string;
}

export interface CreateCustomSpecializationData {
  name: string;
  profession: number;
}

export interface CreateCustomFontData {
  name: string;
}

export const globalOptionsApi = {
  // Buscar todas as profissões
  async getProfessions(): Promise<Profession[]> {
    const response = await api.get("/api/v1/global-options/professions/");
    return response.data.data;
  },

  // Buscar especializações de uma profissão
  async getProfessionSpecializations(professionId: number): Promise<{
    profession: { id: number; name: string; is_custom: boolean };
    specializations: Specialization[];
  }> {
    const response = await api.get(
      `/api/v1/global-options/professions/${professionId}/specializations/`
    );
    return response.data.data;
  },

  // Buscar todas as fontes
  async getFonts(): Promise<FontList> {
    const response = await api.get("/api/v1/global-options/fonts/");
    return response.data.data;
  },

  // Criar profissão customizada
  async createCustomProfession(
    data: CreateCustomProfessionData
  ): Promise<Profession> {
    const response = await api.post(
      "/api/v1/global-options/professions/create/",
      data
    );
    return response.data.data;
  },

  // Criar especialização customizada
  async createCustomSpecialization(
    data: CreateCustomSpecializationData
  ): Promise<Specialization> {
    const response = await api.post(
      "/api/v1/global-options/specializations/create/",
      data
    );
    return response.data.data;
  },

  // Criar especialização customizada para qualquer profissão
  async createCustomSpecializationForProfession(
    data: CreateCustomSpecializationData
  ): Promise<Specialization> {
    const response = await api.post(
      "/api/v1/global-options/specializations/create-for-profession/",
      data
    );
    return response.data.data;
  },

  // Criar fonte customizada
  async createCustomFont(data: CreateCustomFontData): Promise<Font> {
    const response = await api.post(
      "/api/v1/global-options/fonts/create/",
      data
    );
    return response.data.data;
  },
};
