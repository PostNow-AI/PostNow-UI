import { describe, it, expect } from "vitest";
import {
  parseAudienceJson,
  audienceJsonToString,
  audienceToDisplayString,
  audienceIncomeToString,
  audienceToCompactString,
  type ParsedAudience,
} from "../audienceUtils";

describe("audienceUtils", () => {
  describe("parseAudienceJson", () => {
    it("should parse valid audience JSON", () => {
      const json = JSON.stringify({
        gender: ["mulheres"],
        ageRange: ["25-34"],
        incomeLevel: ["classe-a"],
      });

      const result = parseAudienceJson(json);

      expect(result).not.toBeNull();
      expect(result?.gender).toEqual(["mulheres"]);
      expect(result?.ageRange).toEqual(["25-34"]);
      expect(result?.incomeLevel).toEqual(["classe-a"]);
    });

    it("should return null for invalid JSON", () => {
      expect(parseAudienceJson("not json")).toBeNull();
      expect(parseAudienceJson("")).toBeNull();
      expect(parseAudienceJson("{}")).toBeNull();
    });

    it("should return null for incomplete audience data", () => {
      const incomplete = JSON.stringify({
        gender: ["mulheres"],
        // missing ageRange and incomeLevel
      });

      expect(parseAudienceJson(incomplete)).toBeNull();
    });
  });

  describe("audienceJsonToString", () => {
    it("should format audience with all fields", () => {
      const json = JSON.stringify({
        gender: ["mulheres"],
        ageRange: ["25-34"],
        incomeLevel: ["classe-a"],
      });

      const result = audienceJsonToString(json);

      expect(result).toContain("Mulheres");
      expect(result).toContain("25-34 anos");
      expect(result).toContain("Classe A");
    });

    it("should handle 'todos' gender", () => {
      const json = JSON.stringify({
        gender: ["todos"],
        ageRange: ["25-34"],
        incomeLevel: ["classe-b"],
      });

      const result = audienceJsonToString(json);
      expect(result).toContain("Homens e mulheres");
    });

    it("should handle 'todas' age range", () => {
      const json = JSON.stringify({
        gender: ["mulheres"],
        ageRange: ["todas"],
        incomeLevel: ["classe-a"],
      });

      const result = audienceJsonToString(json);
      expect(result).toContain("de todas as idades");
    });

    it("should handle 'todas' income level", () => {
      const json = JSON.stringify({
        gender: ["homens"],
        ageRange: ["35-44"],
        incomeLevel: ["todas"],
      });

      const result = audienceJsonToString(json);
      expect(result).toContain("de todas as classes sociais");
    });

    it("should handle multiple genders", () => {
      const json = JSON.stringify({
        gender: ["mulheres", "homens"],
        ageRange: ["25-34"],
        incomeLevel: ["classe-a"],
      });

      const result = audienceJsonToString(json);
      expect(result).toContain("Mulheres e Homens");
    });

    it("should handle multiple income levels", () => {
      const json = JSON.stringify({
        gender: ["mulheres"],
        ageRange: ["25-34"],
        incomeLevel: ["classe-a", "classe-b"],
      });

      const result = audienceJsonToString(json);
      expect(result).toContain("Classe A");
      expect(result).toContain("Classe B");
    });

    it("should return original value for invalid JSON", () => {
      expect(audienceJsonToString("plain text")).toBe("plain text");
    });
  });

  describe("audienceToDisplayString", () => {
    it("should return compact display format", () => {
      const json = JSON.stringify({
        gender: ["mulheres"],
        ageRange: ["25-34", "35-44"],
        incomeLevel: ["classe-a"],
      });

      const result = audienceToDisplayString(json);

      expect(result).toContain("Mulheres");
      expect(result).toContain("25-34, 35-44 anos");
    });

    it("should handle 'todos' gender", () => {
      const json = JSON.stringify({
        gender: ["todos"],
        ageRange: ["25-34"],
        incomeLevel: ["classe-a"],
      });

      const result = audienceToDisplayString(json);
      expect(result).toContain("Todos");
    });

    it("should handle 'todas' ages", () => {
      const json = JSON.stringify({
        gender: ["mulheres"],
        ageRange: ["todas"],
        incomeLevel: ["classe-a"],
      });

      const result = audienceToDisplayString(json);
      expect(result).toContain("todas as idades");
    });

    it("should return 'Seu público' for invalid data", () => {
      expect(audienceToDisplayString("")).toBe("Seu público");
    });

    it("should truncate long plain text values", () => {
      const longText = "a".repeat(60);
      const result = audienceToDisplayString(longText);
      expect(result).toHaveLength(53); // 50 chars + "..."
      expect(result).toContain("...");
    });
  });

  describe("audienceIncomeToString", () => {
    it("should return formatted income level", () => {
      const json = JSON.stringify({
        gender: ["mulheres"],
        ageRange: ["25-34"],
        incomeLevel: ["classe-a"],
      });

      expect(audienceIncomeToString(json)).toBe("Classe A");
    });

    it("should handle multiple income levels", () => {
      const json = JSON.stringify({
        gender: ["mulheres"],
        ageRange: ["25-34"],
        incomeLevel: ["classe-a", "classe-b"],
      });

      const result = audienceIncomeToString(json);
      expect(result).toContain("Classe A");
      expect(result).toContain("Classe B");
    });

    it("should return 'Todas as classes' for 'todas'", () => {
      const json = JSON.stringify({
        gender: ["mulheres"],
        ageRange: ["25-34"],
        incomeLevel: ["todas"],
      });

      expect(audienceIncomeToString(json)).toBe("Todas as classes");
    });

    it("should return null for empty income level", () => {
      const json = JSON.stringify({
        gender: ["mulheres"],
        ageRange: ["25-34"],
        incomeLevel: [],
      });

      expect(audienceIncomeToString(json)).toBeNull();
    });

    it("should return null for invalid JSON", () => {
      expect(audienceIncomeToString("invalid")).toBeNull();
    });
  });

  describe("audienceToCompactString", () => {
    it("should return compact format with all fields", () => {
      const json = JSON.stringify({
        gender: ["mulheres"],
        ageRange: ["25-34"],
        incomeLevel: ["classe-a"],
      });

      const result = audienceToCompactString(json);

      expect(result).toContain("Mulheres");
      expect(result).toContain("25-34");
      expect(result).toContain("Classe A");
    });

    it("should use short income format (A/B/C)", () => {
      const json = JSON.stringify({
        gender: ["todos"],
        ageRange: ["25-34"],
        incomeLevel: ["classe-a", "classe-b"],
      });

      const result = audienceToCompactString(json);
      expect(result).toContain("Classe A/B");
    });

    it("should handle 'todos' gender", () => {
      const json = JSON.stringify({
        gender: ["todos"],
        ageRange: ["18-24"],
        incomeLevel: ["classe-c"],
      });

      const result = audienceToCompactString(json);
      expect(result).toContain("Todos");
    });

    it("should handle 'todas' ages", () => {
      const json = JSON.stringify({
        gender: ["homens"],
        ageRange: ["todas"],
        incomeLevel: ["classe-b"],
      });

      const result = audienceToCompactString(json);
      expect(result).toContain("todas as idades");
    });

    it("should handle 'todas' income", () => {
      const json = JSON.stringify({
        gender: ["mulheres"],
        ageRange: ["35-44"],
        incomeLevel: ["todas"],
      });

      const result = audienceToCompactString(json);
      expect(result).toContain("todas as classes");
    });

    it("should return empty string for invalid JSON", () => {
      expect(audienceToCompactString("invalid")).toBe("invalid");
    });

    it("should return empty string for empty value", () => {
      expect(audienceToCompactString("")).toBe("");
    });
  });
});
