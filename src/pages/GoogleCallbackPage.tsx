import { LoadingPage } from "@/components/ui/loading";
import { useGoogleCallback } from "@/features/Auth/GoogleAuth/hooks/useGoogleCallback";

export function GoogleCallbackPage() {
  // All logic is now handled by the custom hook
  useGoogleCallback();

  return <LoadingPage text="Finalizando login com Google..." />;
}
