import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui";

interface WeeklyContextHeaderProps {
  weekRange: string;
  businessName: string;
  currentOffset: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onNavigate: (offset: number) => void;
}

export const WeeklyContextHeader = ({
  weekRange,
  businessName,
  currentOffset,
  hasPrevious,
  hasNext,
  onNavigate,
}: WeeklyContextHeaderProps) => {
  const handlePrevious = () => {
    if (hasPrevious) {
      onNavigate(currentOffset + 1);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onNavigate(currentOffset - 1);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg p-6 mb-6 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">📡 Radar Semanal de Conteúdo</h1>
      </div>

      <p className="text-purple-100 mb-4">
        Oportunidades selecionadas para <strong>{businessName}</strong>
      </p>

      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          size="sm"
          onClick={handlePrevious}
          disabled={!hasPrevious}
          className="flex items-center gap-1"
          aria-label="Semana anterior"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        <span className="text-white font-medium">
          Semana de {weekRange}
        </span>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleNext}
          disabled={!hasNext}
          className="flex items-center gap-1"
          aria-label="Próxima semana"
        >
          Próxima
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

