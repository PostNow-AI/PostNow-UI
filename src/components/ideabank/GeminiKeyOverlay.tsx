import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/ui";
import { useGeminiKeyOverlay } from "@/hooks/useGeminiKeyOverlay";
import { AlertCircle, ExternalLink, Key, Shield } from "lucide-react";

interface GeminiKeyOverlayProps {
  onClose: () => void;
}

export const GeminiKeyOverlay = ({ onClose }: GeminiKeyOverlayProps) => {
  const {
    apiKey,
    showTutorial,
    saveMutation,
    handleSave,
    handleClose,
    handleShowTutorial,
    handleHideTutorial,
    setApiKey,
  } = useGeminiKeyOverlay(onClose);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Configurar Chave da API do Google Gemini
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Security Notice */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Sua chave é segura
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Sua chave da API é armazenada de forma segura e só é usada
                  para gerar ideias em sua conta.
                </p>
              </div>
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-3">
            <Label htmlFor="gemini-key" className="text-base font-medium">
              Sua chave da API do Google Gemini
            </Label>
            <Input
              id="gemini-key"
              type="password"
              placeholder="AIzaSyC..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              A chave deve começar com "AIzaSyC" e ter aproximadamente 39
              caracteres
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!apiKey.trim() || saveMutation.isPending}
              className="min-w-32"
            >
              {saveMutation.isPending ? "Salvando..." : "Salvar Chave"}
            </Button>
          </div>

          {/* Tutorial Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Como obter sua chave da API
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={showTutorial ? handleHideTutorial : handleShowTutorial}
              >
                {showTutorial ? "Ocultar" : "Mostrar"} Tutorial
              </Button>
            </div>

            {showTutorial && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Step 1 */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          1
                        </Badge>
                        <CardTitle className="text-base">
                          Acesse o Google AI Studio
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Vá para o site oficial do Google AI Studio
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            "https://aistudio.google.com/app/apikey",
                            "_blank"
                          )
                        }
                        className="w-full"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Abrir Google AI Studio
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Step 2 */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          2
                        </Badge>
                        <CardTitle className="text-base">Faça login</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Use sua conta Google para fazer login no Google AI
                        Studio
                      </p>
                    </CardContent>
                  </Card>

                  {/* Step 3 */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          3
                        </Badge>
                        <CardTitle className="text-base">
                          Crie uma chave
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Clique em "Create API key" para gerar uma nova chave da
                        API
                      </p>
                    </CardContent>
                  </Card>

                  {/* Step 4 */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          4
                        </Badge>
                        <CardTitle className="text-base">
                          Copie a chave
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Copie a chave gerada (começa com "AIzaSyC") e cole no
                        campo acima
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Important Notes */}
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <h4 className="font-medium text-amber-900 dark:text-amber-100">
                        Importante
                      </h4>
                      <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                        <li>
                          • Mantenha sua chave da API segura e não a compartilhe
                        </li>
                        <li>
                          • A chave é necessária para cada geração de ideia
                        </li>
                        <li>
                          • Você pode atualizar ou remover a chave a qualquer
                          momento
                        </li>
                        <li>
                          • O uso da API do Gemini está sujeito aos termos do
                          Google
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
