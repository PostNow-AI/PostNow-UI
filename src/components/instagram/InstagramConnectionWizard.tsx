/**
 * InstagramConnectionWizard - 4-step wizard to connect Instagram account
 */

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInstagramConnection } from "@/hooks/useInstagramConnection";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Loader2,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface InstagramConnectionWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InstagramConnectionWizard({
  open,
  onOpenChange,
}: InstagramConnectionWizardProps) {
  const [step, setStep] = useState(1);
  const { connect, isConnecting, connectError } = useInstagramConnection();

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleConnect = () => {
    connect();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Instagram className="h-6 w-6 text-pink-600" />
            <DialogTitle>Conectar Instagram</DialogTitle>
          </div>
          <DialogDescription>
            Passo {step} de 4 - Conecte sua conta do Instagram para acessar
            métricas e insights
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-pink-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Benefits */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">
              Por que conectar o Instagram?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Análise de Performance</p>
                  <p className="text-sm text-muted-foreground">
                    Veja métricas detalhadas de alcance, impressões e
                    engajamento
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium">Insights em Tempo Real</p>
                  <p className="text-sm text-muted-foreground">
                    Acompanhe o crescimento de seguidores e identifique
                    tendências
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">100% Seguro</p>
                  <p className="text-sm text-muted-foreground">
                    Seus dados são criptografados e nunca compartilhados
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Requirements */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Requisitos</h3>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Você precisa de uma conta <strong>Business</strong> ou{" "}
                <strong>Creator</strong> do Instagram conectada a uma Página do
                Facebook.
              </AlertDescription>
            </Alert>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm">
                  Conta Business ou Creator no Instagram
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm">Página do Facebook vinculada</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm">
                  Permissões de administrador da página
                </span>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-2">
                Ainda não tem uma conta Business?
              </p>
              <p className="text-sm text-blue-700">
                Você pode converter sua conta pessoal gratuitamente nas
                configurações do Instagram.
                <a
                  href="https://help.instagram.com/502981923235522"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline ml-1"
                >
                  Saiba mais
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Authorization */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Autorizar Acesso</h3>
            <p className="text-sm text-muted-foreground">
              Você será redirecionado para o Instagram para autorizar o acesso
              às suas métricas. O PostNow só terá acesso a dados analíticos, não
              poderá postar ou modificar seu conteúdo.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium">
                O que o PostNow pode acessar:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>✓ Métricas de alcance e impressões</li>
                <li>✓ Contagem de seguidores</li>
                <li>✓ Taxa de engajamento</li>
                <li>✓ Visualizações de perfil</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium">
                O que o PostNow NÃO pode fazer:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>✗ Publicar posts ou stories</li>
                <li>✗ Enviar mensagens diretas</li>
                <li>✗ Modificar seu perfil</li>
                <li>✗ Acessar informações pessoais</li>
              </ul>
            </div>
            {connectError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {connectError.message ||
                    "Erro ao iniciar conexão. Tente novamente."}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Step 4: Success Placeholder */}
        {step === 4 && (
          <div className="space-y-4 text-center py-8">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
            <h3 className="font-semibold text-lg">Conectando...</h3>
            <p className="text-sm text-muted-foreground">
              Você será redirecionado para o Instagram. Após autorizar, retorne
              aqui para ver suas métricas!
            </p>
          </div>
        )}

        <DialogFooter className="flex justify-between sm:justify-between">
          <div className="flex gap-2">
            {step > 1 && step < 4 && (
              <Button variant="outline" onClick={prevStep}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Voltar
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {step < 3 && (
              <Button onClick={nextStep}>
                Próximo
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
            {step === 3 && (
              <Button onClick={handleConnect} disabled={isConnecting}>
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Instagram className="h-4 w-4 mr-2" />
                    Conectar Instagram
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
