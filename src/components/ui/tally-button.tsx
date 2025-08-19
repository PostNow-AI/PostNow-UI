import { useTally, type TallyPopupOptions } from "@/hooks/useTally";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "./button";

interface TallyButtonProps {
  variant?: "default" | "feedback" | "contact";
  size?: "sm" | "default" | "lg";
  children?: React.ReactNode;
  className?: string;
  formId?: string;
  options?: TallyPopupOptions;
}

export const TallyButton = ({
  variant = "default",
  size = "default",
  children,
  className,
  formId,
  options,
}: TallyButtonProps) => {
  const { openPopup, openFeedbackForm, openContactForm } = useTally();

  const handleClick = () => {
    switch (variant) {
      case "feedback":
        openFeedbackForm(options);
        break;
      case "contact":
        openContactForm(options);
        break;
      default:
        if (formId) {
          openPopup(formId, options);
        } else {
          openFeedbackForm(options);
        }
        break;
    }
  };

  const getButtonContent = () => {
    if (children) return children;

    switch (variant) {
      case "feedback":
        return (
          <>
            <MessageSquare className="mr-2 h-4 w-4" />
            Enviar Feedback
          </>
        );
      case "contact":
        return (
          <>
            <Send className="mr-2 h-4 w-4" />
            Entrar em Contato
          </>
        );
      default:
        return "Abrir Formulário";
    }
  };

  return (
    <Button
      onClick={handleClick}
      size={size}
      className={className}
      variant="outline"
    >
      {getButtonContent()}
    </Button>
  );
};
