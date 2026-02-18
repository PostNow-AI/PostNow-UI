import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { PhaseTransition } from "../PhaseTransition";
import type { OnboardingTempData } from "../../../hooks/useOnboardingStorage";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

const mockOnComplete = vi.fn();

const createMockData = (overrides: Partial<OnboardingTempData> = {}): OnboardingTempData => ({
  business_name: "",
  business_phone: "",
  business_instagram_handle: "",
  business_website: "",
  specialization: "",
  business_description: "",
  business_purpose: "",
  brand_personality: [],
  products_services: "",
  target_audience: "",
  target_interests: [],
  business_location: "",
  main_competitors: "",
  reference_profiles: "",
  voice_tone: "",
  visual_style_ids: [],
  colors: [],
  logo: "",
  suggested_colors: [],
  current_step: 1,
  expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  ...overrides,
});

describe("PhaseTransition", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockOnComplete.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Negócio Phase", () => {
    it("should display business phase title", () => {
      render(
        <PhaseTransition
          phase="negocio"
          data={createMockData({ business_name: "Minha Empresa" })}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText("Negócio")).toBeInTheDocument();
    });

    it("should display business name and niche", () => {
      render(
        <PhaseTransition
          phase="negocio"
          data={createMockData({
            business_name: "Minha Empresa",
            specialization: "saude",
          })}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText(/Minha Empresa/)).toBeInTheDocument();
      expect(screen.getByText(/Saúde & Bem-estar/)).toBeInTheDocument();
    });

    it("should display brand personality when available", () => {
      render(
        <PhaseTransition
          phase="negocio"
          data={createMockData({
            business_name: "Test",
            brand_personality: ["Profissional", "Inovador"],
          })}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText("Profissional, Inovador")).toBeInTheDocument();
    });

    it("should filter out [custom] from personality", () => {
      render(
        <PhaseTransition
          phase="negocio"
          data={createMockData({
            business_name: "Test",
            brand_personality: ["Profissional", "[custom]Custom Value", "Inovador"],
          })}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText("Profissional, Inovador")).toBeInTheDocument();
      expect(screen.queryByText(/custom/i)).not.toBeInTheDocument();
    });

    it("should show progress 1 de 3", () => {
      render(
        <PhaseTransition
          phase="negocio"
          data={createMockData()}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText("1 de 3")).toBeInTheDocument();
    });
  });

  describe("Público Phase", () => {
    it("should display audience phase title", () => {
      render(
        <PhaseTransition
          phase="publico"
          data={createMockData()}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText("Público")).toBeInTheDocument();
    });

    it("should show progress 2 de 3", () => {
      render(
        <PhaseTransition
          phase="publico"
          data={createMockData()}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText("2 de 3")).toBeInTheDocument();
    });

    it("should display interests when available", () => {
      render(
        <PhaseTransition
          phase="publico"
          data={createMockData({
            target_interests: ["Tecnologia", "Finanças", "Marketing"],
          })}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText("Tecnologia, Finanças, Marketing")).toBeInTheDocument();
    });

    it("should truncate interests when more than 4", () => {
      render(
        <PhaseTransition
          phase="publico"
          data={createMockData({
            target_interests: ["A", "B", "C", "D", "E", "F"],
          })}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText("A, B, C, D +2")).toBeInTheDocument();
    });

    it("should display location when available", () => {
      render(
        <PhaseTransition
          phase="publico"
          data={createMockData({
            business_location: "São Paulo, SP",
          })}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText(/São Paulo, SP/)).toBeInTheDocument();
    });
  });

  describe("Marca Phase", () => {
    it("should display brand phase title", () => {
      render(
        <PhaseTransition
          phase="marca"
          data={createMockData()}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText("Marca")).toBeInTheDocument();
    });

    it("should display voice tone label", () => {
      render(
        <PhaseTransition
          phase="marca"
          data={createMockData({ voice_tone: "casual" })}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText(/Casual e Amigável/)).toBeInTheDocument();
    });

    it("should display visual styles count", () => {
      render(
        <PhaseTransition
          phase="marca"
          data={createMockData({
            visual_style_ids: ["1", "2", "3"],
          })}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText("3 estilos visuais")).toBeInTheDocument();
    });

    it("should display single style text correctly", () => {
      render(
        <PhaseTransition
          phase="marca"
          data={createMockData({
            visual_style_ids: ["1"],
          })}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText("1 estilo visual")).toBeInTheDocument();
    });

    it("should indicate logo added when present", () => {
      render(
        <PhaseTransition
          phase="marca"
          data={createMockData({
            logo: "https://example.com/logo.png",
          })}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText("Logo adicionado ✓")).toBeInTheDocument();
    });

    it("should display color swatches", () => {
      const { container } = render(
        <PhaseTransition
          phase="marca"
          data={createMockData({
            colors: ["#FF0000", "#00FF00", "#0000FF"],
          })}
          onComplete={mockOnComplete}
        />
      );

      const colorSwatches = container.querySelectorAll('[style*="background-color"]');
      expect(colorSwatches.length).toBe(3);
    });

    it("should show progress 3 de 3", () => {
      render(
        <PhaseTransition
          phase="marca"
          data={createMockData()}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText("3 de 3")).toBeInTheDocument();
    });
  });

  describe("Auto-advance", () => {
    it("should call onComplete after autoAdvanceMs", () => {
      render(
        <PhaseTransition
          phase="negocio"
          data={createMockData()}
          onComplete={mockOnComplete}
          autoAdvanceMs={3000}
        />
      );

      expect(mockOnComplete).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });

    it("should use custom autoAdvanceMs", () => {
      render(
        <PhaseTransition
          phase="negocio"
          data={createMockData()}
          onComplete={mockOnComplete}
          autoAdvanceMs={1000}
        />
      );

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(mockOnComplete).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe("User interaction", () => {
    it("should call onComplete on click", () => {
      render(
        <PhaseTransition
          phase="negocio"
          data={createMockData()}
          onComplete={mockOnComplete}
        />
      );

      const container = screen.getByRole("button");
      fireEvent.click(container);

      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });

    it("should call onComplete on Enter key", () => {
      render(
        <PhaseTransition
          phase="negocio"
          data={createMockData()}
          onComplete={mockOnComplete}
        />
      );

      const container = screen.getByRole("button");
      fireEvent.keyDown(container, { key: "Enter" });

      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });

    it("should call onComplete on Space key", () => {
      render(
        <PhaseTransition
          phase="negocio"
          data={createMockData()}
          onComplete={mockOnComplete}
        />
      );

      const container = screen.getByRole("button");
      fireEvent.keyDown(container, { key: " " });

      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });

    it("should cancel auto-advance timer when user clicks", () => {
      render(
        <PhaseTransition
          phase="negocio"
          data={createMockData()}
          onComplete={mockOnComplete}
          autoAdvanceMs={3000}
        />
      );

      // User clicks before timer
      const container = screen.getByRole("button");
      fireEvent.click(container);

      expect(mockOnComplete).toHaveBeenCalledTimes(1);

      // Advance timer - should not call again
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("should have correct aria-label", () => {
      render(
        <PhaseTransition
          phase="negocio"
          data={createMockData()}
          onComplete={mockOnComplete}
        />
      );

      const container = screen.getByRole("button");
      expect(container).toHaveAttribute(
        "aria-label",
        "Fase Negócio completa. Toque para continuar."
      );
    });

    it("should be focusable", () => {
      render(
        <PhaseTransition
          phase="negocio"
          data={createMockData()}
          onComplete={mockOnComplete}
        />
      );

      const container = screen.getByRole("button");
      expect(container).toHaveAttribute("tabIndex", "0");
    });
  });
});
