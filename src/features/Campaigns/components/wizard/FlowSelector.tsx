// @ts-nocheck
/**
 * Seletor de fluxo: Rápido vs. Completo.
 * Component < 100 linhas (React Rule).
 */

import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { Zap, Target } from "lucide-react";

interface FlowSelectorProps {
  onSelectQuick: () => void;
  onSelectComplete: () => void;
}

export const FlowSelector = ({ onSelectQuick, onSelectComplete }: FlowSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Como prefere criar sua campanha?</h3>
        <p className="text-sm text-muted-foreground">
          Escolha o modo que melhor se adapta ao seu tempo e necessidade
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Modo Rápido */}
        <Card
          className="cursor-pointer transition-all hover:shadow-lg hover:border-primary"
          onClick={onSelectQuick}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Rápido
              <Badge variant="secondary">~2min</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Criação automática com mínima intervenção
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Apenas 2 perguntas essenciais</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Sistema decide estrutura e estilos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Revisão opcional depois</span>
              </li>
            </ul>
            <Button className="w-full mt-4" variant="default">
              <Zap className="h-4 w-4 mr-2" />
              Criar Rápido
            </Button>
          </CardContent>
        </Card>

        {/* Modo Completo */}
        <Card
          className="cursor-pointer transition-all hover:shadow-lg hover:border-primary border-primary/30"
          onClick={onSelectComplete}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Completo
              <Badge variant="outline">~15-30min</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Controle total sobre cada detalhe da campanha
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Você escolhe estrutura narrativa</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Seleciona estilos visuais</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Personalização completa</span>
              </li>
            </ul>
            <Button className="w-full mt-4" variant="outline">
              <Target className="h-4 w-4 mr-2" />
              Personalizar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

