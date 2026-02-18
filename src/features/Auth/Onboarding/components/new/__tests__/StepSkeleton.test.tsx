// Tests for Onboarding components
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StepSkeleton, StepSkeletonCompact } from "../StepSkeleton";

describe("StepSkeleton", () => {
  describe("Renderização", () => {
    it("deve renderizar sem erros", () => {
      const { container } = render(<StepSkeleton />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("deve ter estrutura de layout completa", () => {
      const { container } = render(<StepSkeleton />);

      // Header
      expect(container.querySelector("header")).toBeInTheDocument();
      // Main
      expect(container.querySelector("main")).toBeInTheDocument();
      // Footer
      expect(container.querySelector("footer")).toBeInTheDocument();
    });

    it("deve mostrar barra de progresso por padrão", () => {
      const { container } = render(<StepSkeleton />);

      const progressBar = container.querySelector(".h-1");
      expect(progressBar).toBeInTheDocument();
    });

    it("deve ocultar barra de progresso quando showProgress=false", () => {
      const { container } = render(<StepSkeleton showProgress={false} />);

      // Não deve ter a barra de progresso no header
      const header = container.querySelector("header");
      const progressBar = header?.querySelector(".h-1");
      expect(progressBar).not.toBeInTheDocument();
    });

    it("deve aplicar className customizada", () => {
      const { container } = render(<StepSkeleton className="custom-class" />);

      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("Elementos skeleton", () => {
    it("deve ter skeletons do título", () => {
      const { container } = render(<StepSkeleton />);

      const titleSkeletons = container.querySelectorAll("header .animate-pulse");
      expect(titleSkeletons.length).toBeGreaterThan(0);
    });

    it("deve ter 4 opções skeleton", () => {
      const { container } = render(<StepSkeleton />);

      const optionSkeletons = container.querySelectorAll("main .h-14.animate-pulse");
      expect(optionSkeletons.length).toBe(4);
    });

    it("deve ter skeleton do botão no footer", () => {
      const { container } = render(<StepSkeleton />);

      const footerSkeleton = container.querySelector("footer .h-12.animate-pulse");
      expect(footerSkeleton).toBeInTheDocument();
    });

    it("deve ter animação de delay nos skeletons", () => {
      const { container } = render(<StepSkeleton />);

      const optionSkeletons = container.querySelectorAll("main .h-14.animate-pulse");
      // Verificar que os delays são diferentes
      const delays = Array.from(optionSkeletons).map((el) =>
        el.getAttribute("style")
      );
      expect(delays[0]).toContain("100ms");
      expect(delays[1]).toContain("200ms");
    });
  });
});

describe("StepSkeletonCompact", () => {
  describe("Renderização", () => {
    it("deve renderizar sem erros", () => {
      const { container } = render(<StepSkeletonCompact />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("deve ter estrutura compacta", () => {
      const { container } = render(<StepSkeletonCompact />);

      // Não deve ter header/main/footer separados
      expect(container.querySelector("header")).not.toBeInTheDocument();
      expect(container.querySelector("footer")).not.toBeInTheDocument();
    });

    it("deve aplicar className customizada", () => {
      const { container } = render(<StepSkeletonCompact className="custom-class" />);

      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("deve ter 3 skeletons de opção", () => {
      const { container } = render(<StepSkeletonCompact />);

      const optionSkeletons = container.querySelectorAll(".h-10.animate-pulse");
      expect(optionSkeletons.length).toBe(3);
    });
  });
});
