import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Verified } from "lucide-react";
import { Link } from "react-router-dom";

export const EmailSent = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center text-center justify-center">
          <Verified className="h-10 w-10 text-lime-600" />
          <CardTitle className="text-2xl font-bold">
            Verifique seu e-mail{" "}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-slate-400">
                Abra o e-mail que te enviamos e clique em “Verificar minha conta
                agora” para finalizar a criação da sua conta.{" "}
              </p>
            </div>
            <div className="text-center text-sm text-white space-y-1">
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
