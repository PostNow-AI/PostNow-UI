/**
 * Instagram OAuth Callback Page
 *
 * Processes the OAuth callback from Meta and redirects to settings.
 */

import { useInstagramConnection } from "@/features/InstagramScheduling";
import { AlertCircle, CheckCircle, Instagram, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type CallbackState = "processing" | "success" | "error";

export function InstagramCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { processCallback, isProcessingCallback } = useInstagramConnection();

  const [state, setState] = useState<CallbackState>("processing");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    // Handle OAuth error from Meta
    if (error) {
      setState("error");
      setErrorMessage(
        errorDescription || "A autorizacao foi negada ou cancelada."
      );
      return;
    }

    // No code provided
    if (!code) {
      setState("error");
      setErrorMessage("Codigo de autorizacao nao encontrado.");
      return;
    }

    // Process the callback
    const handleCallback = async () => {
      try {
        const account = await processCallback(code);
        setUsername(account.instagram_username);
        setState("success");

        // Redirect to settings after 2 seconds
        setTimeout(() => {
          navigate("/settings/instagram", { replace: true });
        }, 2000);
      } catch (err) {
        setState("error");
        const error = err as Error & { response?: { data?: { error?: string } } };
        setErrorMessage(
          error.response?.data?.error ||
            error.message ||
            "Erro ao processar autorizacao."
        );
      }
    };

    handleCallback();
  }, [searchParams, processCallback, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="py-12">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                state === "error"
                  ? "bg-destructive/10"
                  : "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]"
              }`}
            >
              {state === "processing" && (
                <Loader2 className="h-10 w-10 text-white animate-spin" />
              )}
              {state === "success" && (
                <CheckCircle className="h-10 w-10 text-white" />
              )}
              {state === "error" && (
                <AlertCircle className="h-10 w-10 text-destructive" />
              )}
            </div>

            {/* Title */}
            <h1 className="text-xl font-semibold mb-2">
              {state === "processing" && "Processando autorizacao..."}
              {state === "success" && "Conta conectada!"}
              {state === "error" && "Erro na conexao"}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground mb-6">
              {state === "processing" &&
                "Aguarde enquanto conectamos sua conta Instagram."}
              {state === "success" &&
                `A conta @${username} foi conectada com sucesso. Redirecionando...`}
              {state === "error" && errorMessage}
            </p>

            {/* Actions for error state */}
            {state === "error" && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate("/settings/instagram", { replace: true })}
                >
                  Voltar
                </Button>
                <Button
                  onClick={() => navigate("/settings/instagram", { replace: true })}
                  className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white"
                >
                  <Instagram className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
              </div>
            )}

            {/* Loading indicator for processing */}
            {state === "processing" && isProcessingCallback && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Conectando com o Instagram...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InstagramCallbackPage;
