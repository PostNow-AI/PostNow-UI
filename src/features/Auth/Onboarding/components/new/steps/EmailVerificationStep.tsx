import { Button } from "@/components/ui/button";
import { BetaLogo } from "@/components/ui/beta-logo";
import { motion } from "framer-motion";
import { Mail, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EmailVerificationStepProps {
  email: string;
  onBack: () => void;
  onResendEmail?: () => Promise<void>;
}

export const EmailVerificationStep = ({
  email,
  onBack,
  onResendEmail,
}: EmailVerificationStepProps) => {
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    if (!onResendEmail) return;

    setIsResending(true);
    try {
      await onResendEmail();
      toast.success("Email reenviado com sucesso!");
    } catch {
      toast.error("Erro ao reenviar email. Tente novamente.");
    } finally {
      setIsResending(false);
    }
  };

  const handleOpenEmailApp = () => {
    // Try to open default email app
    window.location.href = "mailto:";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          {/* Logo */}
          <div className="mb-8">
            <BetaLogo />
          </div>

          {/* Email Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-10 h-10 text-primary" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-2">Verifique seu email</h1>

          {/* Description */}
          <p className="text-muted-foreground mb-2">
            Enviamos um link de verificacao para:
          </p>
          <p className="font-medium text-lg mb-6">{email}</p>

          {/* Instructions */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-muted-foreground">
              <strong>Proximos passos:</strong>
            </p>
            <ol className="text-sm text-muted-foreground mt-2 space-y-1 list-decimal list-inside">
              <li>Abra seu email</li>
              <li>Clique no link de verificacao</li>
              <li>Volte e faca login para continuar</li>
            </ol>
          </div>

          {/* Open Email Button */}
          <Button
            onClick={handleOpenEmailApp}
            className="w-full h-12 text-base mb-3"
          >
            Abrir aplicativo de email
          </Button>

          {/* Resend Button */}
          {onResendEmail && (
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={isResending}
              className="w-full h-12 text-base mb-3"
            >
              {isResending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Reenviar email
            </Button>
          )}

          {/* Help text */}
          <p className="text-xs text-muted-foreground mt-4">
            Nao recebeu? Verifique sua pasta de spam ou lixo eletronico.
          </p>

          {/* Back button */}
          <button
            type="button"
            onClick={onBack}
            className="w-full text-center text-sm text-muted-foreground mt-4 hover:text-foreground"
          >
            Voltar e usar outro email
          </button>
        </motion.div>
      </main>
    </div>
  );
};
