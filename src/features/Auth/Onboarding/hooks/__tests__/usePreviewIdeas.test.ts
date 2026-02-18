import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { usePreviewIdeas } from "../usePreviewIdeas";
import type { OnboardingTempData } from "../useOnboardingStorage";

const createMockData = (overrides: Partial<OnboardingTempData> = {}): OnboardingTempData => ({
  current_step: 14,
  business_name: "Meu Negócio",
  business_phone: "",
  business_instagram_handle: "",
  business_website: "",
  specialization: "Marketing Digital",
  business_description: "Descrição do negócio",
  business_purpose: "",
  target_audience: "Mulheres de 25-35 anos",
  brand_personality: ["Profissional", "Inovador"],
  products_services: "",
  target_interests: ["Tecnologia", "Negócios"],
  business_location: "São Paulo",
  main_competitors: "",
  reference_profiles: "",
  voice_tone: "Profissional",
  visual_style_ids: ["1", "2"],
  colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFBE0B"],
  logo: "",
  suggested_colors: [],
  expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  ...overrides,
});

describe("usePreviewIdeas", () => {
  describe("Basic Return", () => {
    it("should return array of ideas", () => {
      const { result } = renderHook(() => usePreviewIdeas(createMockData()));

      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current.length).toBeGreaterThan(0);
    });

    it("should return 3 ideas", () => {
      const { result } = renderHook(() => usePreviewIdeas(createMockData()));

      expect(result.current.length).toBe(3);
    });

    it("each idea should have title and description", () => {
      const { result } = renderHook(() => usePreviewIdeas(createMockData()));

      result.current.forEach((idea) => {
        expect(idea).toHaveProperty("title");
        expect(idea).toHaveProperty("description");
        expect(typeof idea.title).toBe("string");
        expect(typeof idea.description).toBe("string");
      });
    });

    it("title and description should not be empty", () => {
      const { result } = renderHook(() => usePreviewIdeas(createMockData()));

      result.current.forEach((idea) => {
        expect(idea.title.length).toBeGreaterThan(0);
        expect(idea.description.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Templates by Niche", () => {
    it("should return Marketing Digital templates", () => {
      const { result } = renderHook(() =>
        usePreviewIdeas(createMockData({ specialization: "Marketing Digital" }))
      );

      const titles = result.current.map((i) => i.title).join(" ");
      expect(titles).toMatch(/Instagram|alcance|Bastidores/i);
    });

    it("should return Saúde e Bem-estar templates", () => {
      const { result } = renderHook(() =>
        usePreviewIdeas(createMockData({ specialization: "Saúde e Bem-estar" }))
      );

      const titles = result.current.map((i) => i.title).join(" ");
      expect(titles).toMatch(/hábitos|energia|Mito|autocuidado/i);
    });

    it("should return Alimentação templates", () => {
      const { result } = renderHook(() =>
        usePreviewIdeas(createMockData({ specialization: "Alimentação" }))
      );

      const titles = result.current.map((i) => i.title).join(" ");
      expect(titles).toMatch(/Receita|alimentação|preparar/i);
    });

    it("should return Moda e Beleza templates", () => {
      const { result } = renderHook(() =>
        usePreviewIdeas(createMockData({ specialization: "Moda e Beleza" }))
      );

      const titles = result.current.map((i) => i.title).join(" ");
      expect(titles).toMatch(/Tendências|estilo|Novidades/i);
    });

    it("should return Educação templates", () => {
      const { result } = renderHook(() =>
        usePreviewIdeas(createMockData({ specialization: "Educação" }))
      );

      const titles = result.current.map((i) => i.title).join(" ");
      expect(titles).toMatch(/começar|Dica|dúvidas/i);
    });

    it("should return generic templates for unknown niche", () => {
      const { result } = renderHook(() =>
        usePreviewIdeas(createMockData({ specialization: "Nicho Desconhecido" }))
      );

      expect(result.current.length).toBe(3);
      // Should use audience-based templates
      const titles = result.current.map((i) => i.title).join(" ");
      expect(titles).toMatch(/precisa saber|trás de|Inspiração|rir/i);
    });
  });

  describe("Fallback for Unmapped Niches", () => {
    it("should use generic templates with business name", () => {
      const { result } = renderHook(() =>
        usePreviewIdeas(createMockData({
          specialization: "Nicho Custom",
          business_name: "MinhaEmpresa"
        }))
      );

      const titles = result.current.map((i) => i.title).join(" ");
      expect(titles).toMatch(/MinhaEmpresa/i);
    });

    it("should use audience text in generic templates", () => {
      const { result } = renderHook(() =>
        usePreviewIdeas(createMockData({
          specialization: "Outro",
          target_audience: JSON.stringify({
            gender: ["mulheres"],
            ageRange: ["25-34"],
            incomeLevel: ["classe-a"]
          })
        }))
      );

      const titles = result.current.map((i) => i.title).join(" ");
      expect(titles).toMatch(/mulheres|precisa saber/i);
    });
  });

  describe("Brand Personality", () => {
    it("should adapt content for Divertido personality", () => {
      const { result } = renderHook(() =>
        usePreviewIdeas(createMockData({
          specialization: "Outro",
          brand_personality: ["Divertido", "Criativo"]
        }))
      );

      const titles = result.current.map((i) => i.title).join(" ");
      expect(titles).toMatch(/rir/i);
    });

    it("should use Inspiração for other personalities", () => {
      const { result } = renderHook(() =>
        usePreviewIdeas(createMockData({
          specialization: "Outro",
          brand_personality: ["Profissional", "Sério"]
        }))
      );

      const titles = result.current.map((i) => i.title).join(" ");
      expect(titles).toMatch(/Inspiração/i);
    });
  });

  describe("Memoization", () => {
    it("should return same array for same data", () => {
      const data = createMockData();
      const { result, rerender } = renderHook(() => usePreviewIdeas(data));

      const firstResult = result.current;
      rerender();
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
    });

    it("should recalculate when data changes", () => {
      const { result, rerender } = renderHook(
        ({ data }) => usePreviewIdeas(data),
        { initialProps: { data: createMockData({ specialization: "Marketing Digital" }) } }
      );

      const firstTitles = result.current.map((i) => i.title);

      rerender({ data: createMockData({ specialization: "Alimentação" }) });

      const secondTitles = result.current.map((i) => i.title);

      expect(firstTitles).not.toEqual(secondTitles);
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined specialization", () => {
      const { result } = renderHook(() =>
        usePreviewIdeas(createMockData({ specialization: undefined as any }))
      );

      expect(result.current.length).toBe(3);
    });

    it("should handle undefined target_audience", () => {
      const { result } = renderHook(() =>
        usePreviewIdeas(createMockData({ target_audience: undefined as any }))
      );

      expect(result.current.length).toBe(3);
    });

    it("should handle undefined business_name", () => {
      const { result } = renderHook(() =>
        usePreviewIdeas(createMockData({ business_name: undefined as any }))
      );

      expect(result.current.length).toBe(3);
    });

    it("should handle empty brand_personality", () => {
      const { result } = renderHook(() =>
        usePreviewIdeas(createMockData({ brand_personality: [] }))
      );

      expect(result.current.length).toBe(3);
    });
  });
});
