import { Label } from "@/components/ui";
import type { ProfileCompletionData } from "@/types/profile-completion";
import type {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

interface Step2ContentProps {
  register: UseFormRegister<ProfileCompletionData>;
  setValue: UseFormSetValue<ProfileCompletionData>;
  watch: UseFormWatch<ProfileCompletionData>;
  choices: any;
}

export const Step2Content = ({
  register,
  setValue,
  watch,
  choices,
}: Step2ContentProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          🎨 Preferências de Conteúdo
        </h3>
        <p className="text-sm text-muted-foreground">
          Defina como prefere que seu conteúdo seja estruturado
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Duração Preferida</Label>
          <div className="grid grid-cols-3 gap-2">
            {choices?.content_durations.map((duration: any) => (
              <button
                key={duration.value}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setValue("preferred_duration", duration.value);
                }}
                className={`p-3 rounded-lg border text-sm transition-all ${
                  watch("preferred_duration") === duration.value
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {duration.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Nível de Complexidade</Label>
          <div className="grid grid-cols-3 gap-2">
            {choices?.complexity_levels.map((level: any) => (
              <button
                key={level.value}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setValue("complexity_level", level.value);
                }}
                className={`p-3 rounded-lg border text-sm transition-all ${
                  watch("complexity_level") === level.value
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="theme_diversity">
            Diversidade de Temas (1 = Foco específico, 10 = Máxima variedade)
          </Label>
          <input
            {...register("theme_diversity", {
              valueAsNumber: true,
              min: 1,
              max: 10,
            })}
            type="range"
            min="1"
            max="10"
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Foco específico</span>
            <span>Máxima variedade</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Frequência de Publicação</Label>
          <div className="grid grid-cols-3 gap-2">
            {choices?.frequencies.map((freq: any) => (
              <button
                key={freq.value}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setValue("publication_frequency", freq.value);
                }}
                className={`p-3 rounded-lg border text-sm transition-all ${
                  watch("publication_frequency") === freq.value
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {freq.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
