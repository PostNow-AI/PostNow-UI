import { renderHook, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("useUrlParams", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("Extração de parâmetros", () => {
    it("deve extrair topic da URL", async () => {
      vi.doMock("react-router-dom", () => ({
        useSearchParams: () => [new URLSearchParams("topic=IA substituindo empregos")],
      }));

      const { useUrlParams } = await import("../useUrlParams");
      const { result } = renderHook(() => useUrlParams());

      expect(result.current.topic).toBe("IA substituindo empregos");
    });

    it("deve extrair category da URL", async () => {
      vi.doMock("react-router-dom", () => ({
        useSearchParams: () => [new URLSearchParams("category=polemica")],
      }));

      const { useUrlParams } = await import("../useUrlParams");
      const { result } = renderHook(() => useUrlParams());

      expect(result.current.category).toBe("polemica");
    });

    it("deve extrair score da URL", async () => {
      vi.doMock("react-router-dom", () => ({
        useSearchParams: () => [new URLSearchParams("score=95")],
      }));

      const { useUrlParams } = await import("../useUrlParams");
      const { result } = renderHook(() => useUrlParams());

      expect(result.current.score).toBe(95);
    });

    it("deve extrair todos os parâmetros juntos", async () => {
      vi.doMock("react-router-dom", () => ({
        useSearchParams: () => [new URLSearchParams("topic=Tema teste&category=educativo&score=80")],
      }));

      const { useUrlParams } = await import("../useUrlParams");
      const { result } = renderHook(() => useUrlParams());

      expect(result.current.topic).toBe("Tema teste");
      expect(result.current.category).toBe("educativo");
      expect(result.current.score).toBe(80);
    });
  });

  describe("Valores padrão", () => {
    it("deve retornar string vazia para topic ausente", async () => {
      vi.doMock("react-router-dom", () => ({
        useSearchParams: () => [new URLSearchParams("")],
      }));

      const { useUrlParams } = await import("../useUrlParams");
      const { result } = renderHook(() => useUrlParams());

      expect(result.current.topic).toBe("");
    });

    it("deve retornar 'outros' para category ausente", async () => {
      vi.doMock("react-router-dom", () => ({
        useSearchParams: () => [new URLSearchParams("")],
      }));

      const { useUrlParams } = await import("../useUrlParams");
      const { result } = renderHook(() => useUrlParams());

      expect(result.current.category).toBe("outros");
    });

    it("deve retornar 0 para score ausente", async () => {
      vi.doMock("react-router-dom", () => ({
        useSearchParams: () => [new URLSearchParams("")],
      }));

      const { useUrlParams } = await import("../useUrlParams");
      const { result } = renderHook(() => useUrlParams());

      expect(result.current.score).toBe(0);
    });
  });

  describe("Tratamento de valores inválidos", () => {
    it("deve retornar 0 para score não numérico", async () => {
      vi.doMock("react-router-dom", () => ({
        useSearchParams: () => [new URLSearchParams("score=invalid")],
      }));

      const { useUrlParams } = await import("../useUrlParams");
      const { result } = renderHook(() => useUrlParams());

      expect(result.current.score).toBe(0);
    });

    it("deve decodificar URL encoded topic", async () => {
      vi.doMock("react-router-dom", () => ({
        useSearchParams: () => [new URLSearchParams("topic=Tema%20com%20espa%C3%A7os")],
      }));

      const { useUrlParams } = await import("../useUrlParams");
      const { result } = renderHook(() => useUrlParams());

      expect(result.current.topic).toBe("Tema com espaços");
    });

    it("deve retornar 'outros' para category inválida", async () => {
      vi.doMock("react-router-dom", () => ({
        useSearchParams: () => [new URLSearchParams("category=invalida")],
      }));

      const { useUrlParams } = await import("../useUrlParams");
      const { result } = renderHook(() => useUrlParams());

      expect(result.current.category).toBe("outros");
    });
  });
});
