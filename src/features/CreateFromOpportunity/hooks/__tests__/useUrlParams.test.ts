import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useUrlParams } from "../useUrlParams";

// Mock react-router-dom
const mockSearchParams = new URLSearchParams();
vi.mock("react-router-dom", () => ({
  useSearchParams: () => [mockSearchParams],
}));

describe("useUrlParams", () => {
  beforeEach(() => {
    // Clear params before each test
    mockSearchParams.delete("topic");
    mockSearchParams.delete("category");
    mockSearchParams.delete("score");
  });

  describe("Extração de parâmetros", () => {
    it("deve extrair topic da URL", () => {
      mockSearchParams.set("topic", "IA substituindo empregos");

      const { result } = renderHook(() => useUrlParams());

      expect(result.current.topic).toBe("IA substituindo empregos");
    });

    it("deve extrair category da URL", () => {
      mockSearchParams.set("category", "polemica");

      const { result } = renderHook(() => useUrlParams());

      expect(result.current.category).toBe("polemica");
    });

    it("deve extrair score da URL", () => {
      mockSearchParams.set("score", "95");

      const { result } = renderHook(() => useUrlParams());

      expect(result.current.score).toBe(95);
    });

    it("deve extrair todos os parâmetros juntos", () => {
      mockSearchParams.set("topic", "Tema teste");
      mockSearchParams.set("category", "educativo");
      mockSearchParams.set("score", "80");

      const { result } = renderHook(() => useUrlParams());

      expect(result.current.topic).toBe("Tema teste");
      expect(result.current.category).toBe("educativo");
      expect(result.current.score).toBe(80);
    });
  });

  describe("Valores padrão", () => {
    it("deve retornar string vazia para topic ausente", () => {
      const { result } = renderHook(() => useUrlParams());

      expect(result.current.topic).toBe("");
    });

    it("deve retornar 'outros' para category ausente", () => {
      const { result } = renderHook(() => useUrlParams());

      expect(result.current.category).toBe("outros");
    });

    it("deve retornar 0 para score ausente", () => {
      const { result } = renderHook(() => useUrlParams());

      expect(result.current.score).toBe(0);
    });
  });

  describe("Tratamento de valores inválidos", () => {
    it("deve retornar 0 para score não numérico", () => {
      mockSearchParams.set("score", "invalid");

      const { result } = renderHook(() => useUrlParams());

      expect(result.current.score).toBe(0);
    });

    it("deve decodificar URL encoded topic", () => {
      mockSearchParams.set("topic", "Tema%20com%20espa%C3%A7os");

      const { result } = renderHook(() => useUrlParams());

      expect(result.current.topic).toBe("Tema com espaços");
    });
  });
});
