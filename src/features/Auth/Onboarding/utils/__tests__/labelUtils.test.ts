import { describe, it, expect } from "vitest";
import {
  NICHE_LABELS,
  VOICE_TONE_LABELS,
  getNicheLabel,
  getVoiceToneLabel,
} from "../labelUtils";

describe("labelUtils", () => {
  describe("NICHE_LABELS", () => {
    it("should have all expected niche keys", () => {
      expect(NICHE_LABELS).toHaveProperty("saude");
      expect(NICHE_LABELS).toHaveProperty("beleza");
      expect(NICHE_LABELS).toHaveProperty("educacao");
      expect(NICHE_LABELS).toHaveProperty("moda");
      expect(NICHE_LABELS).toHaveProperty("alimentacao");
      expect(NICHE_LABELS).toHaveProperty("servicos");
      expect(NICHE_LABELS).toHaveProperty("pet");
      expect(NICHE_LABELS).toHaveProperty("outro");
    });

    it("should have properly formatted labels with accents", () => {
      expect(NICHE_LABELS.saude).toBe("Saúde & Bem-estar");
      expect(NICHE_LABELS.beleza).toBe("Beleza & Estética");
      expect(NICHE_LABELS.educacao).toBe("Educação");
      expect(NICHE_LABELS.alimentacao).toBe("Alimentação");
    });
  });

  describe("VOICE_TONE_LABELS", () => {
    it("should have all expected voice tone keys", () => {
      expect(VOICE_TONE_LABELS).toHaveProperty("formal");
      expect(VOICE_TONE_LABELS).toHaveProperty("casual");
      expect(VOICE_TONE_LABELS).toHaveProperty("inspirador");
      expect(VOICE_TONE_LABELS).toHaveProperty("educativo");
      expect(VOICE_TONE_LABELS).toHaveProperty("divertido");
      expect(VOICE_TONE_LABELS).toHaveProperty("autoridade");
    });

    it("should have descriptive labels", () => {
      expect(VOICE_TONE_LABELS.formal).toBe("Formal e Profissional");
      expect(VOICE_TONE_LABELS.casual).toBe("Casual e Amigável");
      expect(VOICE_TONE_LABELS.inspirador).toBe("Inspirador e Motivacional");
    });
  });

  describe("getNicheLabel", () => {
    it("should return correct label for valid niche ID", () => {
      expect(getNicheLabel("saude")).toBe("Saúde & Bem-estar");
      expect(getNicheLabel("beleza")).toBe("Beleza & Estética");
      expect(getNicheLabel("pet")).toBe("Pet");
    });

    it("should be case-insensitive", () => {
      expect(getNicheLabel("SAUDE")).toBe("Saúde & Bem-estar");
      expect(getNicheLabel("Beleza")).toBe("Beleza & Estética");
      expect(getNicheLabel("PET")).toBe("Pet");
    });

    it("should return original ID for unknown niche", () => {
      expect(getNicheLabel("custom-niche")).toBe("custom-niche");
      expect(getNicheLabel("unknown")).toBe("unknown");
    });

    it("should return empty string for empty input", () => {
      expect(getNicheLabel("")).toBe("");
    });

    it("should handle custom user-entered niches", () => {
      expect(getNicheLabel("Consultoria de TI")).toBe("Consultoria de TI");
      expect(getNicheLabel("Marketing Digital")).toBe("Marketing Digital");
    });
  });

  describe("getVoiceToneLabel", () => {
    it("should return correct label for valid voice tone ID", () => {
      expect(getVoiceToneLabel("formal")).toBe("Formal e Profissional");
      expect(getVoiceToneLabel("casual")).toBe("Casual e Amigável");
      expect(getVoiceToneLabel("autoridade")).toBe("Autoridade no Assunto");
    });

    it("should be case-insensitive", () => {
      expect(getVoiceToneLabel("FORMAL")).toBe("Formal e Profissional");
      expect(getVoiceToneLabel("Casual")).toBe("Casual e Amigável");
      expect(getVoiceToneLabel("INSPIRADOR")).toBe("Inspirador e Motivacional");
    });

    it("should return original ID for unknown voice tone", () => {
      expect(getVoiceToneLabel("custom-tone")).toBe("custom-tone");
      expect(getVoiceToneLabel("unknown")).toBe("unknown");
    });

    it("should return empty string for empty input", () => {
      expect(getVoiceToneLabel("")).toBe("");
    });
  });
});
