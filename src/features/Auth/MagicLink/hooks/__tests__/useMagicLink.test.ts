import { renderHook, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("useMagicLink", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("Sem token na URL", () => {
    it("deve retornar status idle e hasToken false", async () => {
      const mockSetSearchParams = vi.fn();
      vi.doMock("react-router-dom", () => ({
        useSearchParams: () => [new URLSearchParams(""), mockSetSearchParams],
      }));
      vi.doMock("@/lib/api", () => ({
        cookieUtils: { setTokens: vi.fn() },
      }));
      vi.doMock("@/lib/auth-helpers", () => ({
        dispatchAuthStateChange: vi.fn(),
      }));
      vi.doMock("../../services", () => ({
        magicLinkService: { validate: vi.fn() },
      }));

      const { useMagicLink } = await import("../useMagicLink");
      const { result } = renderHook(() => useMagicLink());

      expect(result.current.status).toBe("idle");
      expect(result.current.hasToken).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe("Com token válido", () => {
    it("deve validar, salvar tokens e limpar URL", async () => {
      const mockSetSearchParams = vi.fn();
      // authRequest in service handles tokens + dispatch automatically
      const mockValidate = vi.fn().mockResolvedValue({
        access: "access-token",
        refresh: "refresh-token",
        user: { id: 1, email: "test@test.com", first_name: "Test", last_name: "User" },
      });

      vi.doMock("react-router-dom", () => ({
        useSearchParams: () => [
          new URLSearchParams("token=valid-token&topic=test"),
          mockSetSearchParams,
        ],
      }));
      vi.doMock("../../services", () => ({
        magicLinkService: { validate: mockValidate },
      }));

      const { useMagicLink } = await import("../useMagicLink");
      const { result } = renderHook(() => useMagicLink());

      expect(result.current.hasToken).toBe(true);

      await waitFor(() => {
        expect(result.current.status).toBe("authenticated");
      });

      expect(mockValidate).toHaveBeenCalledWith({ token: "valid-token" });
      expect(mockSetSearchParams).toHaveBeenCalledWith(
        expect.any(URLSearchParams),
        { replace: true }
      );

      // Token should be removed, but topic preserved
      const cleanParams = mockSetSearchParams.mock.calls[0][0];
      expect(cleanParams.has("token")).toBe(false);
      expect(cleanParams.get("topic")).toBe("test");
    });
  });

  describe("Com token inválido", () => {
    it("deve retornar status error", async () => {
      const mockSetSearchParams = vi.fn();
      const mockValidate = vi.fn().mockRejectedValue(
        new Error("Token inválido ou expirado")
      );

      vi.doMock("react-router-dom", () => ({
        useSearchParams: () => [
          new URLSearchParams("token=bad-token"),
          mockSetSearchParams,
        ],
      }));
      vi.doMock("@/lib/api", () => ({
        cookieUtils: { setTokens: vi.fn() },
      }));
      vi.doMock("@/lib/auth-helpers", () => ({
        dispatchAuthStateChange: vi.fn(),
      }));
      vi.doMock("../../services", () => ({
        magicLinkService: { validate: mockValidate },
      }));

      const { useMagicLink } = await import("../useMagicLink");
      const { result } = renderHook(() => useMagicLink());

      await waitFor(() => {
        expect(result.current.status).toBe("invalid");
      });

      expect(result.current.error).toBe("Token inválido ou expirado");
    });
  });

  describe("Com token expirado", () => {
    it("deve retornar status expired", async () => {
      const mockSetSearchParams = vi.fn();
      const mockValidate = vi.fn().mockRejectedValue(
        new Error("Token expirado. Solicite um novo link.")
      );

      vi.doMock("react-router-dom", () => ({
        useSearchParams: () => [
          new URLSearchParams("token=expired-token"),
          mockSetSearchParams,
        ],
      }));
      vi.doMock("@/lib/api", () => ({
        cookieUtils: { setTokens: vi.fn() },
      }));
      vi.doMock("@/lib/auth-helpers", () => ({
        dispatchAuthStateChange: vi.fn(),
      }));
      vi.doMock("../../services", () => ({
        magicLinkService: { validate: mockValidate },
      }));

      const { useMagicLink } = await import("../useMagicLink");
      const { result } = renderHook(() => useMagicLink());

      await waitFor(() => {
        expect(result.current.status).toBe("expired");
      });

      expect(result.current.error).toBe("Token expirado. Solicite um novo link.");
    });
  });
});
