import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS, type CategoryKey } from "../types";

interface StepTopicProps {
  topic: string;
  category: CategoryKey;
  score: number;
  furtherDetails: string;
  onFurtherDetailsChange: (details: string) => void;
  onNext: () => void;
  // Navigation props
  currentIndex?: number;
  totalOpportunities?: number;
  canNavigatePrev?: boolean;
  canNavigateNext?: boolean;
  onPrevOpportunity?: () => void;
  onNextOpportunity?: () => void;
}

export const StepTopic = ({
  topic,
  category,
  score,
  furtherDetails,
  onFurtherDetailsChange,
  onNext,
  currentIndex = -1,
  totalOpportunities = 0,
  canNavigatePrev = false,
  canNavigateNext = false,
  onPrevOpportunity,
  onNextOpportunity,
}: StepTopicProps) => {
  const categoryInfo = CATEGORY_LABELS[category] || CATEGORY_LABELS.outros;
  const showNavigation = totalOpportunities > 1;

  return (
    <div className="flex flex-col h-full">
      {/* Content area - scrollable */}
      <div className="flex-1 overflow-auto px-4 pb-24">
        {/* Topic Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            {/* Category Badge */}
            <Badge
              variant="secondary"
              className="mb-4 text-sm"
            >
              {categoryInfo.emoji} {categoryInfo.label}
            </Badge>

            {/* Topic Title */}
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 leading-tight">
              {topic || "Tema da Oportunidade"}
            </h2>

            {/* Score Badge */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Score:</span>
              <Badge
                variant="default"
                className="bg-primary text-primary-foreground"
              >
                {score}/100
              </Badge>
            </div>

            {/* Opportunity Navigation */}
            {showNavigation && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onPrevOpportunity}
                  disabled={!canNavigatePrev}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentIndex + 1} de {totalOpportunities}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNextOpportunity}
                  disabled={!canNavigateNext}
                  className="gap-1"
                >
                  Próximo
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Details */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Detalhes adicionais (opcional)
          </label>
          <Textarea
            placeholder="Ex: Foque em dados do mercado brasileiro, mencione cases de sucesso, use tom mais informal..."
            value={furtherDetails}
            onChange={(e) => onFurtherDetailsChange(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Adicione instruções específicas para personalizar ainda mais o conteúdo gerado.
          </p>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={onNext}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            Continuar
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
