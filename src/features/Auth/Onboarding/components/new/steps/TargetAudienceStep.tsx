import { useState, useEffect, useMemo, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { ProgressBarWithPhases } from "../ProgressBarWithPhases";
import { TOTAL_STEPS } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";
import { PersonSilhouette, SceneBackground } from "../illustrations";
import type { PersonProps } from "../illustrations";

interface TargetAudienceStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

interface AudienceSelection {
  gender: string[];
  ageRange: string[];
  incomeLevel: string[];
}

const genderOptions = [
  { id: "mulheres", label: "Mulheres" },
  { id: "homens", label: "Homens" },
  { id: "todos", label: "Todos" },
];

const ageRangeOptions = [
  { id: "18-24", label: "18-24" },
  { id: "25-34", label: "25-34" },
  { id: "35-44", label: "35-44" },
  { id: "45-54", label: "45-54" },
  { id: "55+", label: "55+" },
  { id: "todas", label: "Todas" },
];

const incomeLevelOptions = [
  { id: "classe-c", label: "C" },
  { id: "classe-b", label: "B" },
  { id: "classe-a", label: "A" },
  { id: "todas", label: "Todas" },
];

// Individual options (excluding "all" option) for each category
const genderIndividualOptions = ["mulheres", "homens"];
const ageRangeIndividualOptions = ["18-24", "25-34", "35-44", "45-54", "55+"];
const incomeLevelIndividualOptions = ["classe-c", "classe-b", "classe-a"];

const parseAudience = (value: string): AudienceSelection => {
  try {
    const parsed = JSON.parse(value);
    if (parsed.gender && parsed.ageRange && parsed.incomeLevel) {
      return parsed;
    }
  } catch {
    // Not JSON, return defaults
  }
  return { gender: [], ageRange: [], incomeLevel: [] };
};

// Gera as pessoas baseado nas seleções
const generatePeople = (selection: AudienceSelection): PersonProps[] => {
  // Se não tem NADA selecionado em nenhum dos dois, não mostra ninguém
  if (selection.gender.length === 0 && selection.ageRange.length === 0) {
    return [];
  }

  const people: Omit<PersonProps, "scale">[] = [];

  // Determina gêneros
  const genders: ("male" | "female")[] = [];
  if (selection.gender.length === 0 || selection.gender.includes("todos")) {
    genders.push("female", "male");
  } else {
    if (selection.gender.includes("mulheres")) genders.push("female");
    if (selection.gender.includes("homens")) genders.push("male");
  }

  // Determina faixas etárias
  const allAges = ["18-24", "25-34", "35-44", "45-54", "55+"];
  const ageRanges: string[] = [];

  if (selection.ageRange.length === 0 || selection.ageRange.includes("todas")) {
    ageRanges.push(...allAges);
  } else {
    for (const age of allAges) {
      if (selection.ageRange.includes(age)) {
        ageRanges.push(age);
      }
    }
  }

  // Gera combinações (máximo 10 pessoas)
  let index = 0;

  for (const ageRange of ageRanges) {
    for (const gender of genders) {
      if (index < 10) {
        people.push({ gender, ageRange, index });
        index++;
      }
    }
  }

  // Calcula escala baseada na quantidade de pessoas
  // Ajustado para bonecos estilo Airbnb/BUCK (80x120 viewBox)
  // 1-2 pessoas: escala 1.0 (80px largura)
  // 3-4 pessoas: escala 0.7 (56px largura)
  // 5-6 pessoas: escala 0.55 (44px largura)
  // 7-8 pessoas: escala 0.45 (36px largura)
  // 9-10 pessoas: escala 0.38 (30px largura)
  const count = people.length;
  let scale = 0.38;
  if (count <= 2) scale = 1.0;
  else if (count <= 4) scale = 0.7;
  else if (count <= 6) scale = 0.55;
  else if (count <= 8) scale = 0.45;

  return people.map(p => ({ ...p, scale }));
};

export const TargetAudienceStep = ({
  value,
  onChange,
  onNext,
  onBack,
}: TargetAudienceStepProps) => {
  const [selection, setSelection] = useState<AudienceSelection>(() => parseAudience(value));

  // Update the combined value when selection changes
  useEffect(() => {
    const hasSelection = selection.gender.length > 0 ||
                         selection.ageRange.length > 0 ||
                         selection.incomeLevel.length > 0;

    if (hasSelection) {
      const jsonValue = JSON.stringify(selection);
      if (jsonValue !== value) {
        onChange(jsonValue);
      }
    }
  }, [selection, onChange, value]);

  const toggleOption = useCallback((category: keyof AudienceSelection, optionId: string) => {
    setSelection(prev => {
      const currentOptions = prev[category];

      let individualOptions: string[];
      let allOption: string;

      if (category === "gender") {
        individualOptions = genderIndividualOptions;
        allOption = "todos";
      } else if (category === "ageRange") {
        individualOptions = ageRangeIndividualOptions;
        allOption = "todas";
      } else {
        individualOptions = incomeLevelIndividualOptions;
        allOption = "todas";
      }

      if (optionId === allOption) {
        if (currentOptions.includes(allOption)) {
          return { ...prev, [category]: [] };
        }
        return { ...prev, [category]: [...individualOptions, allOption] };
      }

      if (currentOptions.includes(optionId)) {
        const newOptions = currentOptions.filter(id => id !== optionId && id !== allOption);
        return { ...prev, [category]: newOptions };
      } else {
        const newOptions = [...currentOptions.filter(id => id !== allOption), optionId];
        const allIndividualSelected = individualOptions.every(opt => newOptions.includes(opt));

        if (allIndividualSelected) {
          return { ...prev, [category]: [...newOptions, allOption] };
        }

        return { ...prev, [category]: newOptions };
      }
    });
  }, []);

  const isValid = selection.gender.length > 0 &&
                  selection.ageRange.length > 0 &&
                  selection.incomeLevel.length > 0;

  // Memoiza pessoas para evitar re-renders desnecessários
  const people = useMemo(() => generatePeople(selection), [selection]);

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="shrink-0 bg-background border-b">
        <div className="flex items-center gap-4 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <ProgressBarWithPhases
              currentStep={6}
              totalSteps={TOTAL_STEPS}
              showPhaseNames={true}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full overflow-hidden">
        {/* Título */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Quem é seu cliente ideal?
          </h1>
        </div>

        {/* Área de ilustração */}
        <div
          className="relative h-48 mb-6 rounded-2xl border border-border overflow-hidden"
          role="img"
          aria-label={`Visualização do público-alvo: ${people.length} pessoas selecionadas`}
        >
          <SceneBackground incomeLevel={selection.incomeLevel} peopleCount={people.length} />

          {/* Pessoas */}
          <div
            className="absolute inset-0 flex items-end justify-center pb-2 px-2"
            style={{
              gap: people.length <= 2 ? 12 : people.length <= 4 ? 8 : people.length <= 6 ? 4 : 2
            }}
          >
            <AnimatePresence mode="popLayout">
              {people.map((person) => (
                <PersonSilhouette
                  key={`${person.gender}-${person.ageRange}`}
                  {...person}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Placeholder text quando vazio */}
          {selection.gender.length === 0 && selection.ageRange.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-muted-foreground text-center px-4">
                Selecione abaixo para visualizar
              </p>
            </div>
          )}
        </div>

        {/* Opções de seleção */}
        <div className="flex-1 space-y-4">
          {/* Gênero */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Gênero
            </p>
            <div className="flex gap-1.5">
              {genderOptions.map(option => {
                const isSelected = selection.gender.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleOption("gender", option.id)}
                    className={cn(
                      "px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                      "border flex-1",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary/50"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Faixa etária */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Faixa etária
            </p>
            <div className="grid grid-cols-3 gap-2">
              {ageRangeOptions.map(option => {
                const isSelected = selection.ageRange.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleOption("ageRange", option.id)}
                    className={cn(
                      "px-3 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                      "border",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary/50"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Classe social */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Classe social
            </p>
            <div className="flex gap-1.5">
              {incomeLevelOptions.map(option => {
                const isSelected = selection.incomeLevel.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleOption("incomeLevel", option.id)}
                    className={cn(
                      "px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                      "border flex-1",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary/50"
                    )}
                  >
                    {option.id === "todas" ? "Todas" : `Classe ${option.label}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 bg-background border-t p-4 pb-safe">
        <div className="max-w-lg mx-auto w-full">
          <Button
            onClick={onNext}
            disabled={!isValid}
            className="w-full h-12 text-base font-medium"
            size="lg"
          >
            Continuar
          </Button>
        </div>
      </footer>
    </div>
  );
};
