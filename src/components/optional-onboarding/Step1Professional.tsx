import { Button, Input, Label } from "@/components/ui";
import type { ProfileCompletionData } from "@/types/profile-completion";
import type {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

interface Step1ProfessionalProps {
  register: UseFormRegister<ProfileCompletionData>;
  setValue: UseFormSetValue<ProfileCompletionData>;
  watch: UseFormWatch<ProfileCompletionData>;
  choices: any;
  suggestions: any;
  expertiseInput: string;
  setExpertiseInput: (value: string) => void;
  handleAddExpertise: () => void;
  handleRemoveExpertise: (area: string) => void;
}

export const Step1Professional = ({
  register,
  setValue,
  watch,
  choices,
  suggestions,
  expertiseInput,
  setExpertiseInput,
  handleAddExpertise,
  handleRemoveExpertise,
}: Step1ProfessionalProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">👔 Contexto Profissional</h3>
        <p className="text-sm text-muted-foreground">
          Conte-nos mais sobre sua área de atuação para criarmos conteúdo mais
          direcionado
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="specific_profession">
            Profissão Específica (Opcional)
          </Label>
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
          <Label htmlFor="communication_tone">
            Tom de Comunicação Preferido
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {choices?.communication_tones.map((tone: any) => (
              <button
                key={tone.value}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setValue("communication_tone", tone.value);
                }}
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
              placeholder="Digite uma área de expertise"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddExpertise();
                }
              }}
            />
            <Button type="button" onClick={handleAddExpertise}>
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
                  onClick={() => handleRemoveExpertise(area)}
                  className="text-primary hover:text-primary/70"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          {suggestions?.expertise_areas && (
            <div className="flex flex-wrap gap-1">
              {suggestions.expertise_areas
                .filter(
                  (area: string) =>
                    !(watch("expertise_areas") || []).includes(area)
                )
                .slice(0, 6)
                .map((area: string) => (
                  <button
                    key={area}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const current = watch("expertise_areas") || [];
                      setValue("expertise_areas", [...current, area]);
                    }}
                    className="px-2 py-1 text-xs rounded border border-border hover:border-primary transition-colors"
                  >
                    + {area}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
