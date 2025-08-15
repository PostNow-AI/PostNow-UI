import { cookieUtils } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export function useGoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (error) {
      // Backend returned an error
      const errorMessage =
        errorDescription || "Falha na autenticação com Google";
      toast.error(errorMessage);
      setTimeout(() => {
        navigate("/ideabank", { replace: true });
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

      // Small delay to ensure authentication state propagates
      setTimeout(() => {
        navigate("/ideabank", { replace: true });
      }, 100);
    } else if (success === "true") {
      // Success but missing tokens
      toast.error("Autenticação bem-sucedida, mas tokens não recebidos");
      setTimeout(() => {
        navigate("/ideabank", { replace: true });
      }, 2000);
    } else {
      // Neither success nor error parameter found
      toast.error(
        "Callback inválido - resposta inesperada da autenticação Google"
      );
      setTimeout(() => {
        navigate("/ideabank", { replace: true });
      }, 2000);
    }
  }, [searchParams, navigate, queryClient]);
}
