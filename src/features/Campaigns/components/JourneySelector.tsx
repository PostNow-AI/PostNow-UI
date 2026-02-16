// @ts-nocheck
/**
 * JourneySelector - Componente para seleção de jornada adaptativa
 * 
 * Permite usuário escolher entre 3 jornadas:
 * - Rápida (2-5min)
 * - Guiada (15-30min)
 * - Avançada (30min-2h)
 */

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Rocket,
  GraduationCap,
  Settings,
  Clock,
  CheckCircle2,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { JourneyType, JourneyData } from "../hooks/useJourneyDetection";

interface JourneySelectorProps {
  suggestedJourney?: JourneyType;
  journeyData?: JourneyData;
  onSelect: (journey: JourneyType) => void;
  selectedJourney?: JourneyType;
  isLoading?: boolean;
}

const JOURNEY_CONFIG = {
  quick: {
    icon: Rocket,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    title: "🚀 Jornada Rápida",
    time: "2-5 min",
    description: "Criação ultrarrápida com IA",
    features: [
      "Configurações automáticas",
      "Geração instantânea",
      "Revisar depois",
      "Ideal para quem tem pressa",
    ],
  },
  guided: {
    icon: GraduationCap,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    title: "🎓 Jornada Guiada",
    time: "15-30 min",
    description: "Equilíbrio entre qualidade e velocidade",
    features: [
      "Wizard passo a passo",
      "Recomendações personalizadas",
      "Preview antes de gerar",
      "Opção mais popular",
    ],
  },
  advanced: {
    icon: Settings,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    title: "🔬 Jornada Avançada",
    time: "30min - 2h",
    description: "Controle total sobre cada detalhe",
    features: [
      "Todas as configurações",
      "Estruturas personalizadas",
      "Métricas detalhadas",
      "Para especialistas",
    ],
  },
};

export const JourneySelector: React.FC<JourneySelectorProps> = ({
  suggestedJourney,
  journeyData,
  onSelect,
  selectedJourney,
  isLoading,
}) => {
  const [showDetails, setShowDetails] = useState<JourneyType | null>(null);

  const handleSelect = (journey: JourneyType) => {
    onSelect(journey);
  };

  const toggleDetails = (journey: JourneyType) => {
    setShowDetails(showDetails === journey ? null : journey);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Analisando seu perfil...</CardTitle>
          <CardDescription>
            Identificando a melhor jornada para você
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com recomendação */}
      {suggestedJourney && journeyData && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">
                Recomendamos a{" "}
                <span className="font-bold">
                  {JOURNEY_CONFIG[suggestedJourney].title}
                </span>
              </p>
              {journeyData.reasons.map((reason, idx) => (
                <p key={idx} className="text-sm text-muted-foreground">
                  {reason.message}
                </p>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Título */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          Como você quer criar sua campanha?
        </h2>
        <p className="text-muted-foreground">
          Escolha a jornada que melhor se adapta ao seu momento
        </p>
      </div>

      {/* Grid de opções */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.keys(JOURNEY_CONFIG) as JourneyType[]).map((journey) => {
          const config = JOURNEY_CONFIG[journey];
          const Icon = config.icon;
          const isSelected = selectedJourney === journey;
          const isRecommended = suggestedJourney === journey;
          const isExpanded = showDetails === journey;

          return (
            <Card
              key={journey}
              className={`
                relative cursor-pointer transition-all hover:shadow-lg
                ${isSelected ? `${config.borderColor} border-2` : ""}
              `}
              onClick={() => handleSelect(journey)}
            >
              {/* Badge de recomendação */}
              {isRecommended && (
                <Badge
                  className="absolute -top-2 -right-2 z-10"
                  variant="default"
                >
                  Recomendado
                </Badge>
              )}

              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className={`h-8 w-8 ${config.color}`} />
                  {isSelected && (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  )}
                </div>
                <CardTitle className="text-lg mt-2">
                  {config.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {config.time}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {config.description}
                </p>

                {/* Features principais (sempre visíveis) */}
                <ul className="space-y-1.5">
                  {config.features.slice(0, 2).map((feature, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Detalhes expandíveis */}
                {isExpanded && (
                  <ul className="space-y-1.5 pt-2 border-t">
                    {config.features.slice(2).map((feature, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Botão para ver mais */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDetails(journey);
                  }}
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Ver menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Ver mais
                    </>
                  )}
                </Button>

                {/* Botão de seleção */}
                <Button
                  className="w-full mt-2"
                  variant={isSelected ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(journey);
                  }}
                >
                  {isSelected ? "Selecionado" : "Escolher"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Nota sobre trocar depois */}
      <p className="text-center text-sm text-muted-foreground">
        💡 Você pode mudar de jornada a qualquer momento nas configurações
      </p>
    </div>
  );
};

