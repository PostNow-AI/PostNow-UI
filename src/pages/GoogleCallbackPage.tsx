import { LoadingPage } from "@/components/ui/loading";
import { useGoogleCallback } from "@/hooks/useGoogleCallback";

export const GoogleCallbackPage = () => {
  // All logic is now handled by the custom hook
  useGoogleCallback();

  return <LoadingPage text="Finalizando login com Google..." />;
};
