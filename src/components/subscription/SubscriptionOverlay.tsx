import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { CreditCard, MessageCircle } from "lucide-react";

interface SubscriptionOverlayProps {
  onClose: () => void;
}

export const SubscriptionOverlay = ({ onClose }: SubscriptionOverlayProps) => {
  const handleWhatsAppContact = () => {
    const message =
      "Olá! Gostaria de assinar o Sonora para acessar todas as funcionalidades.";
    const whatsappUrl = `https://wa.me/5561999930263?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CreditCard className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Acesso Restrito</CardTitle>
          <p className="text-muted-foreground">
            Para acessar todas as funcionalidades do Sonora, é necessário uma
            assinatura ativa.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Benefícios da Assinatura */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">
              O que você ganha com a assinatura:
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Geração Ilimitada de Ideias</h4>
                  <p className="text-sm text-muted-foreground">
                    Use a IA para criar quantas ideias quiser
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Banco de Ideias Completo</h4>
                  <p className="text-sm text-muted-foreground">
                    Salve e gerencie todas suas campanhas
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Melhorias com IA</h4>
                  <p className="text-sm text-muted-foreground">
                    Otimize suas ideias existentes
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Suporte Prioritário</h4>
                  <p className="text-sm text-muted-foreground">
                    Atendimento direto da equipe
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-center space-y-3">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">
                Entre em Contato para Assinar
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Rogério Resende está disponível para tirar suas dúvidas e
                processar sua assinatura.
              </p>
              <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300">
                <MessageCircle className="h-4 w-4" />
                <span className="font-medium">WhatsApp: +55 61 99993-0263</span>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-none"
            >
              Fechar
            </Button>
            <Button
              onClick={handleWhatsAppContact}
              className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Falar no WhatsApp
            </Button>
          </div>

          {/* Nota Adicional */}
          <div className="text-center text-xs text-muted-foreground">
            <p>
              A assinatura é processada diretamente com nossa equipe para
              garantir o melhor atendimento e suporte personalizado.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
