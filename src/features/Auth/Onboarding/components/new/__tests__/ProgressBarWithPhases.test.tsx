// @ts-nocheck
import { render, screen } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProgressBarWithPhases, usePhaseInfo } from "../ProgressBarWithPhases";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
  },
}));

describe("ProgressBarWithPhases", () => {
  const defaultProps = {
    currentStep: 1,
    totalSteps: 14,
  };

  describe("Renderização Básica", () => {
    it("deve renderizar sem erros", () => {
      render(<ProgressBarWithPhases {...defaultProps} />);

      // Deve ter 4 indicadores de fase
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
    });

    it("deve mostrar nomes das fases quando showPhaseNames é true", () => {
      render(<ProgressBarWithPhases {...defaultProps} showPhaseNames={true} />);

      expect(screen.getByText("Negócio")).toBeInTheDocument();
      expect(screen.getByText("Público")).toBeInTheDocument();
      expect(screen.getByText("Marca")).toBeInTheDocument();
      expect(screen.getByText("Finalizar")).toBeInTheDocument();
    });

    it("não deve mostrar nomes das fases por padrão", () => {
      render(<ProgressBarWithPhases {...defaultProps} />);

      expect(screen.queryByText("Negócio")).not.toBeInTheDocument();
    });
  });

  describe("Progresso das Fases", () => {
    it("deve marcar fase 1 como ativa no step 1", () => {
      const { container } = render(
        <ProgressBarWithPhases currentStep={1} totalSteps={14} />
      );

      // Fase 1 deve ter ring indicando ativa
      const phase1 = container.querySelector(".ring-2");
      expect(phase1).toBeInTheDocument();
    });

    it("deve marcar fase 1 como completa no step 5", () => {
      render(<ProgressBarWithPhases currentStep={5} totalSteps={14} />);

      // Fase 1 completa deve mostrar checkmark (não número)
      expect(screen.queryByText("1")).not.toBeInTheDocument();
    });

    it("deve marcar fase 2 como ativa no step 5", () => {
      const { container } = render(
        <ProgressBarWithPhases currentStep={5} totalSteps={14} />
      );

      // Deve ter elemento com ring indicando fase ativa
      const activePhase = container.querySelector(".ring-2");
      expect(activePhase).toBeInTheDocument();
    });

    it("deve marcar fases 1 e 2 como completas no step 9", () => {
      render(<ProgressBarWithPhases currentStep={9} totalSteps={14} />);

      // Fases 1 e 2 completas não mostram números
      expect(screen.queryByText("1")).not.toBeInTheDocument();
      expect(screen.queryByText("2")).not.toBeInTheDocument();
      // Fases 3 e 4 ainda mostram números
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
    });

    it("deve marcar todas as fases exceto última como completas no step 13", () => {
      render(<ProgressBarWithPhases currentStep={13} totalSteps={14} />);

      // Apenas fase 4 mostra número
      expect(screen.queryByText("1")).not.toBeInTheDocument();
      expect(screen.queryByText("2")).not.toBeInTheDocument();
      expect(screen.queryByText("3")).not.toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
    });
  });

  describe("Barra de Progresso", () => {
    it("deve ter largura proporcional ao progresso", () => {
      const { container } = render(
        <ProgressBarWithPhases currentStep={7} totalSteps={14} />
      );

      // 7/14 = 50%
      const progressBar = container.querySelector(".bg-primary");
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe("Classes CSS", () => {
    it("deve aplicar className customizada", () => {
      const { container } = render(
        <ProgressBarWithPhases
          {...defaultProps}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });
  });
});

describe("usePhaseInfo", () => {
  describe("Informações da Fase", () => {
    it("deve retornar fase Negócio para steps 1-4", () => {
      const { result: result1 } = renderHook(() => usePhaseInfo(1));
      expect(result1.current.phaseName).toBe("Negócio");
      expect(result1.current.phaseIndex).toBe(0);

      const { result: result4 } = renderHook(() => usePhaseInfo(4));
      expect(result4.current.phaseName).toBe("Negócio");
    });

    it("deve retornar fase Público para steps 5-8", () => {
      const { result } = renderHook(() => usePhaseInfo(5));
      expect(result.current.phaseName).toBe("Público");
      expect(result.current.phaseIndex).toBe(1);
    });

    it("deve retornar fase Marca para steps 9-12", () => {
      const { result } = renderHook(() => usePhaseInfo(9));
      expect(result.current.phaseName).toBe("Marca");
      expect(result.current.phaseIndex).toBe(2);
    });

    it("deve retornar fase Finalizar para steps 13-14", () => {
      const { result } = renderHook(() => usePhaseInfo(13));
      expect(result.current.phaseName).toBe("Finalizar");
      expect(result.current.phaseIndex).toBe(3);
    });
  });

  describe("Posição na Fase", () => {
    it("deve identificar primeiro step da fase", () => {
      const { result } = renderHook(() => usePhaseInfo(1));
      expect(result.current.isFirstStepOfPhase).toBe(true);
      expect(result.current.isLastStepOfPhase).toBe(false);
    });

    it("deve identificar último step da fase", () => {
      const { result } = renderHook(() => usePhaseInfo(4));
      expect(result.current.isFirstStepOfPhase).toBe(false);
      expect(result.current.isLastStepOfPhase).toBe(true);
    });

    it("deve identificar step do meio da fase", () => {
      const { result } = renderHook(() => usePhaseInfo(2));
      expect(result.current.isFirstStepOfPhase).toBe(false);
      expect(result.current.isLastStepOfPhase).toBe(false);
    });
  });

  describe("Total de Fases", () => {
    it("deve retornar total de 4 fases", () => {
      const { result } = renderHook(() => usePhaseInfo(1));
      expect(result.current.totalPhases).toBe(4);
    });
  });
});
