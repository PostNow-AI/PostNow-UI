import { Input, Label } from "@/components/ui";
import { type ProfileCompletionData } from "@/types/profile-completion";
import { type UseFormReturn } from "react-hook-form";

interface BusinessSectionProps {
  form: UseFormReturn<ProfileCompletionData>;
  choices?: {
    revenue_stages: Array<{ value: string; label: string }>;
    team_sizes: Array<{ value: string; label: string }>;
  };
}

export const BusinessSection = ({ form, choices }: BusinessSectionProps) => {
  const { register, setValue, watch } = form;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Estágio de Receita</Label>
        <div className="grid grid-cols-3 gap-2">
          {choices?.revenue_stages.map((stage) => (
            <button
              key={stage.value}
              type="button"
              onClick={() => setValue("revenue_stage", stage.value)}
              className={`p-3 rounded-lg border text-sm transition-all ${
                watch("revenue_stage") === stage.value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tamanho da Equipe</Label>
        <div className="grid grid-cols-3 gap-2">
          {choices?.team_sizes.map((size) => (
            <button
              key={size.value}
              type="button"
              onClick={() => setValue("team_size", size.value)}
              className={`p-3 rounded-lg border text-sm transition-all ${
                watch("team_size") === size.value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="revenue_goal">Meta de Receita</Label>
        <Input {...register("revenue_goal")} placeholder="Ex: R$ 50k/mês" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="authority_goal">Meta de Autoridade</Label>
        <Input
          {...register("authority_goal")}
          placeholder="Ex: 1000+ conexões qualificadas"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="leads_goal">Meta de Leads</Label>
        <Input
          {...register("leads_goal")}
          placeholder="Ex: 2-3 leads/mês via conteúdo"
        />
      </div>
    </div>
  );
};
