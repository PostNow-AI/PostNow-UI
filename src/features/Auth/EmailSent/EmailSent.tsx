import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

export const EmailSent = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Verifique seu Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <Mail className="h-12 w-12 text-blue-500" />
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Enviamos um link de verificação para seu endereço de email.
              </p>
              <p className="text-sm text-gray-600">
                Por favor, verifique sua caixa de entrada e clique no link de
                verificação para ativar sua conta.
              </p>
            </div>
            <div className="text-center text-xs text-gray-500 space-y-1">
              <p>Não recebeu o email? Verifique sua pasta de spam.</p>
              <p>O link expira em 24 horas.</p>
            </div>
            <Link to="/login" className="w-full">
              <Button variant="outline" className="w-full">
                Voltar ao Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
