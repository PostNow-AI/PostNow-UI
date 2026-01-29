/**
 * InstagramCallback - Handle OAuth callback from Instagram
 */

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInstagramConnection } from "@/hooks/useInstagramConnection";
import { useWindowSize } from "@/hooks/useWindowSize";
import { AlertCircle, CheckCircle2, Instagram, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useSearchParams } from "react-router-dom";

export function InstagramCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { handleCallback, isProcessingCallback, callbackError } =
    useInstagramConnection();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const errorParam = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    // Handle OAuth errors
    if (errorParam) {
      setError(errorDescription || "Autorização cancelada pelo usuário");
      return;
    }

    // Validate required params
    if (!code || !state) {
      setError("Parâmetros de callback inválidos. Tente conectar novamente.");
      return;
    }

    // Process callback
    handleCallback(
      { code, state },
      {
        onSuccess: () => {
          setShowConfetti(true);
          setTimeout(() => {
            navigate("/dashboard/instagram");
          }, 3000);
        },
        onError: (err: any) => {
          setError(
            err.response?.data?.message || "Erro ao conectar. Tente novamente.",
          );
        },
      },
    );
  }, [searchParams, handleCallback, navigate]);

  const displayError = error || callbackError?.message;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Instagram className="h-6 w-6 text-pink-600" />
            <CardTitle>Instagram</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isProcessingCallback && !displayError ? (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-pink-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Conectando sua conta...
              </h3>
              <p className="text-sm text-muted-foreground">
                Estamos processando sua autorização. Aguarde um momento.
              </p>
            </div>
          ) : displayError ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Erro ao Conectar</h3>
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Button
                  onClick={() => navigate("/settings")}
                  className="w-full"
                >
                  Voltar para Configurações
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="w-full"
                >
                  Tentar Novamente
                </Button>
              </div>
            </div>
          ) : showConfetti ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Conta Conectada!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sua conta do Instagram foi conectada com sucesso. Redirecionando
                para o dashboard...
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirecionando em 3 segundos
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
