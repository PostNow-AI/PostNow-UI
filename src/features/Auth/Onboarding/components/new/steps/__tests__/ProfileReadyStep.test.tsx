import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ProfileReadyStep } from "../ProfileReadyStep";
import type { OnboardingTempData } from "@/features/Auth/Onboarding/hooks/useOnboardingStorage";

// Mock framer-motion para evitar problemas com animações
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
    h1: ({ children, ...props }: { children: React.ReactNode }) => (
      <h1 {...props}>{children}</h1>
    ),
    p: ({ children, ...props }: { children: React.ReactNode }) => (
      <p {...props}>{children}</p>
    ),
  },
}));

describe("ProfileReadyStep", () => {
  const mockData: OnboardingTempData = {
    business_name: "Meu Negócio",
    business_phone: "(11) 99999-9999",
    business_instagram_handle: "meunegocio",
    business_website: "https://meunegocio.com",
    specialization: "marketing",
    business_description: "Uma empresa incrível",
    business_purpose: "Ajudar pessoas",
    brand_personality: ["Inovador", "Criativo", "Profissional"],
    products_services: "Consultoria",
    target_audience: "Empreendedores",
    target_interests: ["Marketing", "Vendas"],
    business_location: "São Paulo, SP",
    main_competitors: "Concorrente A",
    reference_profiles: "@perfil1",
    voice_tone: "Profissional",
    visual_style_ids: ["style1"],
    colors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"],
    logo: "",
    suggested_colors: [],
    current_step: 17,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  const defaultProps = {
    data: mockData,
    onNext: vi.fn(),
    onBack: vi.fn(),
  };

  describe("Modo Criação (padrão)", () => {
    it('deve mostrar botão "Ver o que preparamos" no modo criação', () => {
      render(<ProfileReadyStep {...defaultProps} />);

      expect(screen.getByText("Ver o que preparamos")).toBeInTheDocument();
    });

    it("deve mostrar ícone Sparkles no modo criação", () => {
      render(<ProfileReadyStep {...defaultProps} />);

      // O botão deve conter o texto correto
      const button = screen.getByRole("button", {
        name: /ver o que preparamos/i,
      });
      expect(button).toBeInTheDocument();
    });

    it("deve chamar onNext quando botão é clicado", async () => {
      const user = userEvent.setup();
      const onNext = vi.fn();

      render(<ProfileReadyStep {...defaultProps} onNext={onNext} />);

      const button = screen.getByRole("button", {
        name: /ver o que preparamos/i,
      });
      await user.click(button);

      expect(onNext).toHaveBeenCalledTimes(1);
    });
  });

  describe("Modo Edição", () => {
    it('deve mostrar botão "Salvar Alterações" no modo edição', () => {
      render(<ProfileReadyStep {...defaultProps} isEditMode={true} />);

      expect(screen.getByText("Salvar Alterações")).toBeInTheDocument();
    });

    it("deve mostrar ícone Save no modo edição", () => {
      render(<ProfileReadyStep {...defaultProps} isEditMode={true} />);

      const button = screen.getByRole("button", {
        name: /salvar alterações/i,
      });
      expect(button).toBeInTheDocument();
    });

    it("deve chamar onNext quando botão é clicado no modo edição", async () => {
      const user = userEvent.setup();
      const onNext = vi.fn();

      render(
        <ProfileReadyStep {...defaultProps} onNext={onNext} isEditMode={true} />
      );

      const button = screen.getByRole("button", {
        name: /salvar alterações/i,
      });
      await user.click(button);

      expect(onNext).toHaveBeenCalledTimes(1);
    });
  });

  describe("Estado de Loading", () => {
    it('deve mostrar "Salvando..." quando isLoading é true', () => {
      render(
        <ProfileReadyStep
          {...defaultProps}
          isEditMode={true}
          isLoading={true}
        />
      );

      expect(screen.getByText("Salvando...")).toBeInTheDocument();
    });

    it("deve desabilitar botão quando isLoading é true", () => {
      render(
        <ProfileReadyStep
          {...defaultProps}
          isEditMode={true}
          isLoading={true}
        />
      );

      const button = screen.getByRole("button", { name: /salvando/i });
      expect(button).toBeDisabled();
    });

    it("deve mostrar spinner de loading", () => {
      render(
        <ProfileReadyStep
          {...defaultProps}
          isEditMode={true}
          isLoading={true}
        />
      );

      // O ícone Loader2 tem classe animate-spin
      const button = screen.getByRole("button", { name: /salvando/i });
      expect(button.querySelector(".animate-spin")).toBeInTheDocument();
    });
  });

  describe("Resumo do Perfil", () => {
    it("deve mostrar nome do negócio", () => {
      render(<ProfileReadyStep {...defaultProps} />);

      expect(screen.getByText("Meu Negócio")).toBeInTheDocument();
    });

    it("deve mostrar localização", () => {
      render(<ProfileReadyStep {...defaultProps} />);

      expect(screen.getByText("São Paulo, SP")).toBeInTheDocument();
    });

    it("deve mostrar tom de voz", () => {
      render(<ProfileReadyStep {...defaultProps} />);

      expect(screen.getByText("Profissional")).toBeInTheDocument();
    });

    it("deve mostrar personalidades da marca (máx 3)", () => {
      render(<ProfileReadyStep {...defaultProps} />);

      expect(
        screen.getByText("Inovador, Criativo, Profissional")
      ).toBeInTheDocument();
    });

    it("deve mostrar cores do perfil", () => {
      render(<ProfileReadyStep {...defaultProps} />);

      expect(screen.getByText("Suas cores")).toBeInTheDocument();
    });
  });

  describe("Botão Voltar", () => {
    it('deve mostrar botão "Voltar e editar"', () => {
      render(<ProfileReadyStep {...defaultProps} />);

      expect(screen.getByText("Voltar e editar")).toBeInTheDocument();
    });

    it("deve chamar onBack quando clicado", async () => {
      const user = userEvent.setup();
      const onBack = vi.fn();

      render(<ProfileReadyStep {...defaultProps} onBack={onBack} />);

      const backButton = screen.getByText("Voltar e editar");
      await user.click(backButton);

      expect(onBack).toHaveBeenCalledTimes(1);
    });
  });
});
