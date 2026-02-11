import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useOnboardingStorage } from "../useOnboardingStorage";
import type { OnboardingFormData } from "../../constants/onboardingSchema";

describe("useOnboardingStorage", () => {
  beforeEach(() => {
    // Limpar localStorage antes de cada teste
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    vi.mocked(localStorage.setItem).mockClear();
    vi.mocked(localStorage.removeItem).mockClear();
  });

  describe("initializeWithData", () => {
    it("deve mapear dados do backend para o formato do storage", () => {
      const backendData: OnboardingFormData = {
        business_name: "Meu Negócio",
        business_phone: "(11) 99999-9999",
        business_instagram_handle: "meunegocio",
        business_website: "https://meunegocio.com",
        specialization: "marketing",
        business_description: "Uma empresa incrível",
        business_purpose: "Ajudar pessoas",
        brand_personality: "Inovador, Criativo, Profissional",
        products_services: "Consultoria",
        target_audience: "Empreendedores",
        target_interests: "Marketing, Vendas, Tecnologia",
        business_location: "São Paulo, SP",
        main_competitors: "Concorrente A, Concorrente B",
        reference_profiles: "@perfil1, @perfil2",
        voice_tone: "Profissional",
        visual_style_ids: ["style1", "style2"],
        color_1: "#FF0000",
        color_2: "#00FF00",
        color_3: "#0000FF",
        color_4: "#FFFF00",
        color_5: "#FF00FF",
        logo: "https://example.com/logo.png",
      };

      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.initializeWithData(backendData);
      });

      // Verificar que os dados foram mapeados corretamente
      expect(result.current.data.business_name).toBe("Meu Negócio");
      expect(result.current.data.business_phone).toBe("(11) 99999-9999");
      expect(result.current.data.business_instagram_handle).toBe("meunegocio");
      expect(result.current.data.business_website).toBe("https://meunegocio.com");
      expect(result.current.data.specialization).toBe("marketing");
      expect(result.current.data.business_description).toBe("Uma empresa incrível");
      expect(result.current.data.business_purpose).toBe("Ajudar pessoas");
      expect(result.current.data.products_services).toBe("Consultoria");
      expect(result.current.data.target_audience).toBe("Empreendedores");
      expect(result.current.data.business_location).toBe("São Paulo, SP");
      expect(result.current.data.main_competitors).toBe("Concorrente A, Concorrente B");
      expect(result.current.data.reference_profiles).toBe("@perfil1, @perfil2");
      expect(result.current.data.voice_tone).toBe("Profissional");
      expect(result.current.data.logo).toBe("https://example.com/logo.png");
    });

    it("deve converter brand_personality de string para array", () => {
      const backendData: OnboardingFormData = {
        brand_personality: "Inovador, Criativo, Profissional",
      } as OnboardingFormData;

      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.initializeWithData(backendData);
      });

      expect(result.current.data.brand_personality).toEqual([
        "Inovador",
        "Criativo",
        "Profissional",
      ]);
    });

    it("deve converter target_interests de string para array", () => {
      const backendData: OnboardingFormData = {
        target_interests: "Marketing, Vendas, Tecnologia",
      } as OnboardingFormData;

      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.initializeWithData(backendData);
      });

      expect(result.current.data.target_interests).toEqual([
        "Marketing",
        "Vendas",
        "Tecnologia",
      ]);
    });

    it("deve mapear cores individuais para array de cores", () => {
      const backendData: OnboardingFormData = {
        color_1: "#FF0000",
        color_2: "#00FF00",
        color_3: "#0000FF",
        color_4: "#FFFF00",
        color_5: "#FF00FF",
      } as OnboardingFormData;

      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.initializeWithData(backendData);
      });

      expect(result.current.data.colors).toEqual([
        "#FF0000",
        "#00FF00",
        "#0000FF",
        "#FFFF00",
        "#FF00FF",
      ]);
    });

    it("deve definir current_step como 2 para pular welcome", () => {
      const backendData: OnboardingFormData = {
        business_name: "Teste",
      } as OnboardingFormData;

      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.initializeWithData(backendData);
      });

      expect(result.current.data.current_step).toBe(2);
    });

    it("deve usar valores padrão quando campos estão vazios", () => {
      const backendData: OnboardingFormData = {} as OnboardingFormData;

      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.initializeWithData(backendData);
      });

      expect(result.current.data.business_name).toBe("");
      expect(result.current.data.brand_personality).toEqual([]);
      expect(result.current.data.colors).toEqual([
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
        "#96CEB4",
        "#FFBE0B",
      ]);
    });

    it("deve salvar no localStorage após inicializar", () => {
      const backendData: OnboardingFormData = {
        business_name: "Teste Storage",
      } as OnboardingFormData;

      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.initializeWithData(backendData);
      });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "postnow_onboarding_data",
        expect.stringContaining("Teste Storage")
      );
    });
  });

  describe("getStep1Payload", () => {
    it("deve formatar dados corretamente para API Step 1", () => {
      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.saveData({
          business_name: "Meu Negócio",
          brand_personality: ["Inovador", "Criativo"],
          target_interests: ["Marketing", "Vendas"],
        });
      });

      const payload = result.current.getStep1Payload();

      expect(payload.business_name).toBe("Meu Negócio");
      expect(payload.brand_personality).toBe("Inovador, Criativo");
      expect(payload.target_interests).toBe("Marketing, Vendas");
    });
  });

  describe("getStep2Payload", () => {
    it("deve formatar dados corretamente para API Step 2", () => {
      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.saveData({
          voice_tone: "Profissional",
          logo: "https://example.com/logo.png",
          colors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"],
          visual_style_ids: ["style1", "style2"],
        });
      });

      const payload = result.current.getStep2Payload();

      expect(payload.voice_tone).toBe("Profissional");
      expect(payload.logo).toBe("https://example.com/logo.png");
      expect(payload.color_1).toBe("#FF0000");
      expect(payload.color_2).toBe("#00FF00");
      expect(payload.color_3).toBe("#0000FF");
      expect(payload.color_4).toBe("#FFFF00");
      expect(payload.color_5).toBe("#FF00FF");
      expect(payload.visual_style_ids).toEqual(["style1", "style2"]);
    });
  });
});
