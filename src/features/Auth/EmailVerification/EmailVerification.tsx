import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

import { Navigate } from "react-router-dom";
import { useEmailVerification } from "./hooks/useEmailVerification";

export const EmailVerification = () => {
  const { verificationStatus, handleNavigateToLogin, isValidKey } =
    useEmailVerification();

  if (!isValidKey) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Verificação de Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            {verificationStatus === "loading" && (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-primary-light" />
                <p className="text-sm text-gray-600">
                  Verificando seu email...
                </p>
              </>
            )}

            {verificationStatus === "success" && (
              <>
                <CheckCircle className="h-12 w-12 text-green-500" />
                <p className="text-sm text-center text-slate-400">
                  Email verificado com sucesso!
                </p>
                <Button onClick={handleNavigateToLogin} className="w-full">
                  Continuar para o Login
                </Button>
              </>
            )}

            {verificationStatus === "error" && (
              <>
                <XCircle className="h-12 w-12 text-red-500" />
                <p className="text-sm text-center text-slate-400">
                  Ocorreu um erro durante a verificação
                </p>
                <Button
                  onClick={handleNavigateToLogin}
                  variant="outline"
                  className="w-full"
                >
                  Voltar ao Login
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
