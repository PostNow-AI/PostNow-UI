import { Label } from "@/components/ui";
import { type ProfileCompletionData } from "@/types/profile-completion";
import { type UseFormReturn } from "react-hook-form";

interface ContentSectionProps {
  form: UseFormReturn<ProfileCompletionData>;
  choices?: {
    content_durations: Array<{ value: string; label: string }>;
    complexity_levels: Array<{ value: string; label: string }>;
    frequencies: Array<{ value: string; label: string }>;
  };
}

export const ContentSection = ({ form, choices }: ContentSectionProps) => {
  const { register, setValue, watch } = form;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Duração Preferida</Label>
        <div className="grid grid-cols-3 gap-2">
          {choices?.content_durations.map((duration) => (
            <button
              key={duration.value}
              type="button"
              onClick={() => setValue("preferred_duration", duration.value)}
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
          {choices?.complexity_levels.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => setValue("complexity_level", level.value)}
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
          Diversidade de Temas: {watch("theme_diversity")}
        </Label>
        <input
          {...register("theme_diversity", { valueAsNumber: true })}
          type="range"
          min="0"
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
          {choices?.frequencies.map((freq) => (
            <button
              key={freq.value}
              type="button"
              onClick={() => setValue("publication_frequency", freq.value)}
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
  );
};
