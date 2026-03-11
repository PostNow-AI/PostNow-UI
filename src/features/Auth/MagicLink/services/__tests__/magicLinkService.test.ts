import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

vi.mock("@/lib/auth-helpers", () => ({
  authRequest: vi.fn(async (fn: () => Promise<{ data: unknown }>) => {
    const response = await fn();
    return response.data;
  }),
}));

import { magicLinkService } from "../index";
import { api } from "@/lib/api";

describe("magicLinkService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validate", () => {
    it("deve chamar o endpoint correto com o token", async () => {
      const mockResponse = {
        data: {
          access: "access-token",
          refresh: "refresh-token",
          user: { id: 1, email: "test@test.com", first_name: "Test", last_name: "User" },
        },
      };
      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const result = await magicLinkService.validate({ token: "test-token" });

      expect(api.post).toHaveBeenCalledWith(
        "/api/v1/auth/magic-link/validate/",
        { token: "test-token" }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("deve propagar erro quando token é inválido", async () => {
      vi.mocked(api.post).mockRejectedValue(new Error("Token inválido"));

      await expect(
        magicLinkService.validate({ token: "bad-token" })
      ).rejects.toThrow();
    });
  });
});
