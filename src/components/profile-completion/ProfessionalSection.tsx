import { Button, Input, Label } from "@/components/ui";
import { type ProfileCompletionData } from "@/types/profile-completion";
import { type UseFormReturn } from "react-hook-form";

interface ProfessionalSectionProps {
  form: UseFormReturn<ProfileCompletionData>;
  choices?: {
    communication_tones: Array<{ value: string; label: string }>;
  };
  suggestions?: {
    expertise_areas: string[];
  };
  expertiseInput: string;
  setExpertiseInput: (value: string) => void;
  onAddExpertise: () => void;
  onRemoveExpertise: (area: string) => void;
}

export const ProfessionalSection = ({
  form,
  choices,
  suggestions,
  expertiseInput,
  setExpertiseInput,
  onAddExpertise,
  onRemoveExpertise,
}: ProfessionalSectionProps) => {
  const { register, setValue, watch } = form;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="specific_profession">Profissão Específica</Label>
        <Input
          {...register("specific_profession")}
          placeholder="Ex: Advogado tributarista, Coach executivo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="target_audience">Público-alvo</Label>
        <Input
          {...register("target_audience")}
          placeholder="Ex: Pequenas empresas, Pessoas físicas"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="communication_tone">Tom de Comunicação</Label>
        <div className="grid grid-cols-2 gap-2">
          {choices?.communication_tones.map((tone) => (
            <button
              key={tone.value}
              type="button"
              onClick={() => setValue("communication_tone", tone.value)}
              className={`p-3 rounded-lg border text-sm transition-all ${
                watch("communication_tone") === tone.value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {tone.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Áreas de Expertise</Label>
        <div className="flex gap-2">
          <Input
            value={expertiseInput}
            onChange={(e) => setExpertiseInput(e.target.value)}
            placeholder="Adicionar área de especialização"
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), onAddExpertise())
            }
          />
          <Button type="button" onClick={onAddExpertise}>
            Adicionar
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {watch("expertise_areas")?.map((area) => (
            <span
              key={area}
              className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs flex items-center gap-1"
            >
              {area}
              <button
                type="button"
                onClick={() => onRemoveExpertise(area)}
                className="text-primary hover:text-primary/70"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {suggestions?.expertise_areas.slice(0, 8).map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => {
                const current = watch("expertise_areas") || [];
                if (!current.includes(area)) {
                  setValue("expertise_areas", [...current, area]);
                }
              }}
              className="px-2 py-1 text-xs rounded border border-border hover:border-primary transition-colors"
            >
              + {area}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
