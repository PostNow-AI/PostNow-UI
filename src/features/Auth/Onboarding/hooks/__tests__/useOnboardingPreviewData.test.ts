import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useOnboardingPreviewData } from "../useOnboardingPreviewData";

const STORAGE_KEY = "postnow_onboarding_data";

describe("useOnboardingPreviewData", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it("deve retornar objeto vazio quando localStorage está vazio", () => {
    const { result } = renderHook(() => useOnboardingPreviewData());
    expect(result.current).toEqual({});
  });

  it("deve retornar dados do localStorage na inicialização", () => {
    const mockData = {
      business_name: "Meu Negócio",
      specialization: "Marketing",
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));

    const { result } = renderHook(() => useOnboardingPreviewData());
    expect(result.current.business_name).toBe("Meu Negócio");
    expect(result.current.specialization).toBe("Marketing");
  });

  it("deve atualizar quando localStorage muda (polling)", async () => {
    const { result } = renderHook(() => useOnboardingPreviewData());
    expect(result.current.business_name).toBeUndefined();

    // Simular mudança no localStorage
    const newData = { business_name: "Novo Nome" };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));

    // Avançar tempo para o polling detectar a mudança
    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(result.current.business_name).toBe("Novo Nome");
  });

  it("deve lidar com JSON inválido graciosamente", () => {
    localStorage.setItem(STORAGE_KEY, "invalid-json");

    const { result } = renderHook(() => useOnboardingPreviewData());
    expect(result.current).toEqual({});
  });

  it("deve parar de fazer polling quando desmontado", () => {
    const { unmount } = renderHook(() => useOnboardingPreviewData());

    // Desmontar o hook
    unmount();

    // Avançar tempo - não deve causar erros
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Se chegou aqui sem erros, passou
    expect(true).toBe(true);
  });

  it("não deve fazer polling quando enabled é false", () => {
    const mockData = { business_name: "Inicial" };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));

    const { result } = renderHook(() => useOnboardingPreviewData(false));

    // Mudar dados no localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ business_name: "Alterado" }));

    // Avançar tempo - não deve detectar a mudança pois polling está desabilitado
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Deve manter o valor inicial (lido na inicialização)
    expect(result.current.business_name).toBe("Inicial");
  });

  it("deve fazer polling quando enabled é true", () => {
    const mockData = { business_name: "Inicial" };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));

    const { result } = renderHook(() => useOnboardingPreviewData(true));

    // Mudar dados no localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ business_name: "Alterado" }));

    // Avançar tempo - deve detectar a mudança
    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(result.current.business_name).toBe("Alterado");
  });
});
