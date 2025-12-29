/**
 * Seletor de estrutura narrativa da campanha.
 */

import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { BookOpen, TrendingUp } from "lucide-react";
import type { CampaignType, CampaignStructure } from "../../types";

interface StructureSelectorProps {
  campaignType: CampaignType;
  onSelect: (structure: CampaignStructure) => void;
  onBack: () => void;
}

export const StructureSelector = ({
  campaignType,
  onSelect,
  onBack,
}: StructureSelectorProps) => {
  // Sugestão baseada em tipo (será substituído por Thompson Sampling)
  const suggestedStructure: CampaignStructure = "aida";
  
  const structures = [
    {
      value: "aida" as CampaignStructure,
      name: "AIDA (Clássico)",
      description: "Atenção → Interesse → Desejo → Ação",
      successRate: 87,
      bestFor: "Vendas e Conversão",
      recommended: true,
    },
    {
      value: "funil" as CampaignStructure,
      name: "Funil de Conteúdo",
      description: "Topo → Meio → Fundo do funil",
      successRate: 81,
      bestFor: "Educação e Lead Generation",
      recommended: false,
    },
    {
      value: "pas" as CampaignStructure,
      name: "Problem-Agitate-Solve",
      description: "Problema → Agitação → Solução",
      successRate: 72,
      bestFor: "Vendas Diretas",
      recommended: false,
    },
    {
      value: "simple" as CampaignStructure,
      name: "Sequência Simples",
      description: "Apresentação → Demonstração → Convite",
      successRate: 89,
      bestFor: "Iniciantes",
      recommended: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Escolha a Estrutura da Campanha</h3>
        <p className="text-sm text-muted-foreground">
          A estrutura define como seus posts vão contar a história
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {structures.map((structure) => (
          <Card
            key={structure.value}
            className={`cursor-pointer transition-all hover:shadow-md ${
              structure.recommended ? "border-primary border-2" : ""
            }`}
            onClick={() => onSelect(structure.value)}
          >
            <CardHeader>
              <div className="flex flex-col gap-2">
                <CardTitle className="text-base">{structure.name}</CardTitle>
                {structure.recommended && (
                  <Badge variant="default" className="w-fit">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Recomendado
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{structure.description}</p>
              
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>Ideal para: {structure.bestFor}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Taxa de sucesso:</span>
                <Badge variant="outline">{structure.successRate}%</Badge>
              </div>
              
              <Button className="w-full mt-2" variant={structure.recommended ? "default" : "outline"}>
                Escolher Esta
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          ← Voltar
        </Button>
      </div>
    </div>
  );
};

