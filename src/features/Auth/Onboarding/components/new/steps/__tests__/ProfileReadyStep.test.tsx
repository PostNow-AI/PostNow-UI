import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ProfileReadyStep } from "../ProfileReadyStep";
import type { OnboardingTempData } from "@/features/Auth/Onboarding/hooks/useOnboardingStorage";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

// Mock ProgressBarWithPhases
vi.mock("../../ProgressBarWithPhases", () => ({
  ProgressBarWithPhases: () => <div data-testid="progress-bar" />,
}));

// Mock constants
vi.mock("@/features/Auth/Onboarding/constants/onboardingNewSchema", () => ({
  nicheOptions: [
    { id: "marketing", label: "Marketing Digital" },
    { id: "saude", label: "Saúde & Bem-estar" },
  ],
  visualStyleOptions: [
    { id: "style1", label: "Minimalista" },
    { id: "style2", label: "Moderno" },
  ],
  TOTAL_STEPS: 14,
}));

// Mock audienceUtils
vi.mock("@/features/Auth/Onboarding/utils/audienceUtils", () => ({
  audienceToCompactString: (value: string) => value || "Seu público",
}));

describe("ProfileReadyStep", () => {
  const mockData: OnboardingTempData = {
    business_name: "Meu Negócio",
    business_phone: "(11) 99999-9999",
    business_instagram_handle: "meunegocio",
    business_website: "https://meunegocio.com",
    specialization: "marketing",
    business_description: "Uma empresa incrível que oferece os melhores serviços",
    business_purpose: "Ajudar pessoas",
    brand_personality: ["Inovador", "Criativo", "Profissional"],
    products_services: "Consultoria",
    target_audience: "Empreendedores",
    target_interests: ["Marketing", "Vendas", "Tecnologia", "Negócios"],
    business_location: "São Paulo, SP",
    main_competitors: "Concorrente A",
    reference_profiles: "@perfil1",
    voice_tone: "Profissional",
    visual_style_ids: ["style1", "style2"],
    colors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"],
    logo: "",
    suggested_colors: [],
    current_step: 13,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  const defaultProps = {
    data: mockData,
    onNext: vi.fn(),
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Create Mode (default)", () => {
    it("should show 'Ver o que preparamos' button in create mode", () => {
      render(<ProfileReadyStep {...defaultProps} />);
      expect(screen.getByRole("button", { name: /ver o que preparamos/i })).toBeInTheDocument();
    });

    it("should call onNext when button is clicked", async () => {
      const user = userEvent.setup();
      const onNext = vi.fn();

      render(<ProfileReadyStep {...defaultProps} onNext={onNext} />);

      const button = screen.getByRole("button", { name: /ver o que preparamos/i });
      await user.click(button);

      expect(onNext).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edit Mode", () => {
    it("should show 'Salvar alterações' button in edit mode", () => {
      render(<ProfileReadyStep {...defaultProps} isEditMode={true} />);
      expect(screen.getByRole("button", { name: /salvar alterações/i })).toBeInTheDocument();
    });

    it("should call onNext when button is clicked in edit mode", async () => {
      const user = userEvent.setup();
      const onNext = vi.fn();

      render(<ProfileReadyStep {...defaultProps} onNext={onNext} isEditMode={true} />);

      const button = screen.getByRole("button", { name: /salvar alterações/i });
      await user.click(button);

      expect(onNext).toHaveBeenCalledTimes(1);
    });
  });

  describe("Loading State", () => {
    it("should show 'Salvando...' when isLoading is true", () => {
      render(
        <ProfileReadyStep
          {...defaultProps}
          isEditMode={true}
          isLoading={true}
        />
      );

      expect(screen.getByText("Salvando...")).toBeInTheDocument();
    });

    it("should disable button when isLoading is true", () => {
      render(
        <ProfileReadyStep
          {...defaultProps}
          isEditMode={true}
          isLoading={true}
        />
      );

      // Find button containing "Salvando"
      const buttons = screen.getAllByRole("button");
      const loadingButton = buttons.find(btn => btn.textContent?.includes("Salvando"));
      expect(loadingButton).toBeDisabled();
    });

    it("should show loading spinner", () => {
      const { container } = render(
        <ProfileReadyStep
          {...defaultProps}
          isEditMode={true}
          isLoading={true}
        />
      );

      // The loading spinner has animate-spin class
      expect(container.querySelector(".animate-spin")).toBeInTheDocument();
    });
  });

  describe("Profile Summary", () => {
    it("should show business name", () => {
      render(<ProfileReadyStep {...defaultProps} />);
      expect(screen.getByText("Meu Negócio")).toBeInTheDocument();
    });

    it("should show the Negócio label", () => {
      render(<ProfileReadyStep {...defaultProps} />);
      expect(screen.getByText("Negócio")).toBeInTheDocument();
    });

    it("should show niche label", () => {
      render(<ProfileReadyStep {...defaultProps} />);
      expect(screen.getByText("Nicho")).toBeInTheDocument();
    });

    it("should show voice tone", () => {
      render(<ProfileReadyStep {...defaultProps} />);
      expect(screen.getByText("Profissional")).toBeInTheDocument();
    });

    it("should show personality traits (max 3)", () => {
      render(<ProfileReadyStep {...defaultProps} />);
      expect(screen.getByText("Inovador, Criativo, Profissional")).toBeInTheDocument();
    });

    it("should show colors section", () => {
      render(<ProfileReadyStep {...defaultProps} />);
      expect(screen.getByText("Suas cores")).toBeInTheDocument();
    });

    it("should render color swatches", () => {
      const { container } = render(<ProfileReadyStep {...defaultProps} />);
      // Each color should be rendered as a div with backgroundColor
      const colorDivs = container.querySelectorAll('[style*="background-color"]');
      expect(colorDivs.length).toBe(5);
    });
  });

  describe("Back Button", () => {
    it("should show back button with aria-label", () => {
      render(<ProfileReadyStep {...defaultProps} />);
      expect(screen.getByRole("button", { name: /voltar/i })).toBeInTheDocument();
    });

    it("should call onBack when back button is clicked", async () => {
      const user = userEvent.setup();
      const onBack = vi.fn();

      render(<ProfileReadyStep {...defaultProps} onBack={onBack} />);

      const backButton = screen.getByRole("button", { name: /voltar/i });
      await user.click(backButton);

      expect(onBack).toHaveBeenCalledTimes(1);
    });
  });

  describe("Logo Display", () => {
    it("should show logo when provided", () => {
      const dataWithLogo = {
        ...mockData,
        logo: "https://example.com/logo.png",
      };

      render(<ProfileReadyStep {...defaultProps} data={dataWithLogo} />);

      const logo = screen.getByRole("img", { name: /logo/i });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("src", "https://example.com/logo.png");
    });

    it("should not show logo section when logo is empty", () => {
      render(<ProfileReadyStep {...defaultProps} />);
      expect(screen.queryByRole("img", { name: /logo/i })).not.toBeInTheDocument();
    });
  });

  describe("Content Truncation", () => {
    it("should truncate long offer description", () => {
      const dataWithLongDesc = {
        ...mockData,
        business_description: "Esta é uma descrição muito longa que deveria ser truncada para caber no espaço disponível",
      };

      render(<ProfileReadyStep {...defaultProps} data={dataWithLongDesc} />);

      // Should show truncated text with "..."
      expect(screen.getByText(/Esta é uma descrição muito longa que/)).toBeInTheDocument();
    });

    it("should show interests count when more than 3", () => {
      render(<ProfileReadyStep {...defaultProps} />);
      // With 4 interests, should show "Marketing, Vendas, Tecnologia +1"
      expect(screen.getByText(/Marketing, Vendas, Tecnologia \+1/)).toBeInTheDocument();
    });
  });

  describe("Success Message", () => {
    it("should show success title", () => {
      render(<ProfileReadyStep {...defaultProps} />);
      expect(screen.getByText("Seu perfil está pronto!")).toBeInTheDocument();
    });

    it("should show success description", () => {
      render(<ProfileReadyStep {...defaultProps} />);
      expect(screen.getByText(/Confira um resumo do que você configurou/)).toBeInTheDocument();
    });
  });
});
