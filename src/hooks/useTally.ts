import { useCallback } from "react";

// Tipos baseados na documentação do Tally
export interface TallyPopupOptions {
  key?: string;
  layout?: "default" | "modal";
  width?: number;
  alignLeft?: boolean;
  hideTitle?: boolean;
  overlay?: boolean;
  emoji?: {
    text: string;
    animation:
      | "none"
      | "wave"
      | "tada"
      | "heart-beat"
      | "spin"
      | "flash"
      | "bounce"
      | "rubber-band"
      | "head-shake";
  };
  autoClose?: number;
  showOnce?: boolean;
  doNotShowAfterSubmit?: boolean;
  customFormUrl?: string;
  hiddenFields?: {
    [key: string]: any;
  };
  onOpen?: () => void;
  onClose?: () => void;
  onPageView?: (page: number) => void;
  onSubmit?: (payload: any) => void;
}

// Interface para o objeto Tally global
declare global {
  interface Window {
    Tally: {
      openPopup: (formId: string, options?: TallyPopupOptions) => void;
      closePopup: (formId: string) => void;
    };
  }
}

export const useTally = () => {
  const openPopup = useCallback(
    (
      formId: string = import.meta.env.VITE_TALLY_ID || "",
      options?: TallyPopupOptions
    ) => {
      if (typeof window !== "undefined" && window.Tally) {
        window.Tally.openPopup(formId, options);
      } else {
        console.warn("Tally widget não está carregado");
      }
    },
    []
  );

  const closePopup = useCallback(
    (formId: string = import.meta.env.VITE_TALLY_ID || "") => {
      if (typeof window !== "undefined" && window.Tally) {
        window.Tally.closePopup(formId);
      } else {
        console.warn("Tally widget não está carregado");
      }
    },
    []
  );

  const openFeedbackForm = useCallback(
    (options?: TallyPopupOptions) => {
      openPopup(import.meta.env.VITE_TALLY_ID || "", {
        layout: "modal",
        width: 700,
        autoClose: 5000,
        onOpen: () => {
          console.log("Formulário de feedback aberto");
        },
        onClose: () => {
          console.log("Formulário de feedback fechado");
        },
        onSubmit: (payload) => {
          console.log("Feedback enviado:", payload);
          // Aqui você pode implementar lógica adicional
          // como enviar para sua API ou analytics
        },
        ...options,
      });
    },
    [openPopup]
  );

  const openContactForm = useCallback(
    (options?: TallyPopupOptions) => {
      openPopup(import.meta.env.VITE_TALLY_ID || "", {
        layout: "modal",
        width: 800,
        overlay: true,
        onOpen: () => {
          console.log("Formulário de contato aberto");
        },
        onClose: () => {
          console.log("Formulário de contato fechado");
        },
        onSubmit: (payload) => {
          console.log("Contato enviado:", payload);
          // Implementar lógica de contato
        },
        ...options,
      });
    },
    [openPopup]
  );

  return {
    openPopup,
    closePopup,
    openFeedbackForm,
    openContactForm,
  };
};
