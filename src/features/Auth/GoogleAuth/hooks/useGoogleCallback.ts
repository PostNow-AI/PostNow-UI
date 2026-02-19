import { cookieUtils } from "@/lib/api";
import { linkTempDataToUser } from "@/features/Auth/Onboarding/services";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const ONBOARDING_FLAG_KEY = "postnow_from_onboarding";
const ONBOARDING_SESSION_KEY = "postnow_onboarding_session_id";

export function useGoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleGoogleAuth = async () => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    // Verificar se veio do onboarding
    const fromOnboarding = localStorage.getItem(ONBOARDING_FLAG_KEY) === "true";

    if (error) {
      // Backend returned an error
      const errorMessage =
        errorDescription || "Falha na autenticação com Google";
      toast.error(errorMessage);
      // Se veio do onboarding, voltar para lá
      const redirectPath = fromOnboarding ? "/onboarding" : "/ideabank";
      localStorage.removeItem(ONBOARDING_FLAG_KEY);
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 2000);
      return;
    }

    if (success === "true" && accessToken && refreshToken) {
      // Store tokens in cookies
      cookieUtils.setTokens(accessToken, refreshToken);

      // Clean up URL to remove sensitive tokens
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("access_token");
      cleanUrl.searchParams.delete("refresh_token");
      window.history.replaceState({}, "", cleanUrl.toString());

      // Authentication was successful - invalidate auth queries and redirect
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
      toast.success("Login com Google realizado com sucesso!");

      // Se veio do onboarding, vincular dados temporários ao perfil
      if (fromOnboarding) {
        const sessionId = localStorage.getItem(ONBOARDING_SESSION_KEY);
        if (sessionId) {
          try {
            await linkTempDataToUser(sessionId);
            console.log("[GoogleCallback] Dados de onboarding vinculados ao perfil");
          } catch (error) {
            console.warn("[GoogleCallback] Erro ao vincular dados de onboarding:", error);
          }
          localStorage.removeItem(ONBOARDING_SESSION_KEY);
        }
      }

      // Determinar para onde redirecionar
      // Se veio do onboarding, continuar o fluxo de onboarding (que vai para subscription)
      const redirectPath = fromOnboarding ? "/subscription?from=onboarding" : "/ideabank";
      localStorage.removeItem(ONBOARDING_FLAG_KEY);

      // Small delay to ensure authentication state propagates
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 100);
      window.location.reload();
    } else if (success === "true") {
      // Success but missing tokens
      toast.error("Autenticação bem-sucedida, mas tokens não recebidos");
      const redirectPath = fromOnboarding ? "/onboarding" : "/ideabank";
      localStorage.removeItem(ONBOARDING_FLAG_KEY);
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 2000);
    } else {
      // Neither success nor error parameter found
      toast.error(
        "Callback inválido - resposta inesperada da autenticação Google"
      );
      const redirectPath = fromOnboarding ? "/onboarding" : "/ideabank";
      localStorage.removeItem(ONBOARDING_FLAG_KEY);
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 2000);
    }
  };

  useEffect(() => {
    handleGoogleAuth();
  }, [searchParams, navigate, queryClient]);
}
