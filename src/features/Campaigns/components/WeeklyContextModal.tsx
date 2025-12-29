/**
 * Modal para selecionar oportunidades do Weekly Context durante criação de campanha.
 * Aparece após o usuário preencher o briefing (Step 1).
 * 
 * Component < 200 linhas, lógica em hook.
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Card,
  CardContent,
  Badge,
  Checkbox,
} from "@/components/ui";
import { TrendingUp, Calendar, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface WeeklyContextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (opportunityIds: number[]) => void;
  briefingData?: {
    objective?: string;
    main_message?: string;
  };
}

export const WeeklyContextModal = ({
  isOpen,
  onClose,
  onSelect,
  briefingData,
}: WeeklyContextModalProps) => {
  const [selected, setSelected] = useState<number[]>([]);

  // Buscar oportunidades do Weekly Context
  const { data: opportunities, isLoading } = useQuery({
    queryKey: ["weekly-context-opportunities"],
    queryFn: async () => {
      const response = await api.get("/api/v1/weekly-context/active/");
      return response.data?.opportunities || [];
    },
    enabled: isOpen,
  });

  const toggleOpportunity = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    onSelect(selected);
    onClose();
  };

  const handleSkip = () => {
    onSelect([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Oportunidades do Weekly Context
          </DialogTitle>
          <DialogDescription>
            Selecione tendências e oportunidades para incluir na sua campanha.
            Isso ajudará a IA a criar posts mais relevantes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-4">
                Buscando oportunidades...
              </p>
            </div>
          ) : !opportunities || opportunities.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Nenhuma oportunidade disponível no momento.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  O Weekly Context será gerado em breve.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {opportunities.map((opp: any) => (
                <Card
                  key={opp.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selected.includes(opp.id) ? "border-primary border-2" : ""
                  }`}
                  onClick={() => toggleOpportunity(opp.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selected.includes(opp.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium">{opp.title || opp.description?.slice(0, 50)}</h4>
                          <Badge variant="secondary" className="ml-2">
                            {opp.category || "Tendência"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {opp.description}
                        </p>
                        {opp.relevance_score && (
                          <div className="flex items-center gap-2 mt-2">
                            <Target className="h-3 w-3 text-primary" />
                            <span className="text-xs text-muted-foreground">
                              Relevância: {Math.round(opp.relevance_score * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleSkip}>
            Pular esta etapa
          </Button>
          <Button onClick={handleContinue}>
            Continuar ({selected.length} selecionadas)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

