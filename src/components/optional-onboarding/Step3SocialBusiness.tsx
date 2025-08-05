import { Input, Label } from "@/components/ui";
import type { ProfileCompletionData } from "@/types/profile-completion";
import type {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

interface Step3SocialBusinessProps {
  register: UseFormRegister<ProfileCompletionData>;
  setValue: UseFormSetValue<ProfileCompletionData>;
  watch: UseFormWatch<ProfileCompletionData>;
  choices: any;
}

export const Step3SocialBusiness = ({
  register,
  setValue,
  watch,
  choices,
}: Step3SocialBusinessProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">🌐 Social & Negócios</h3>
        <p className="text-sm text-muted-foreground">
          Conecte suas redes sociais e defina seus objetivos de negócio
        </p>
      </div>

      <div className="space-y-4">
        {/* Social Media */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Redes Sociais</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="instagram_username">Instagram</Label>
              <Input
                {...register("instagram_username")}
                placeholder="@seuusuario"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter_username">Twitter/X</Label>
              <Input
                {...register("twitter_username")}
                placeholder="@seuusuario"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn</Label>
              <Input
                {...register("linkedin_url")}
                placeholder="https://linkedin.com/in/seu-perfil"
                type="url"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktok_username">TikTok</Label>
              <Input
                {...register("tiktok_username")}
                placeholder="@seuusuario"
              />
            </div>
          </div>
        </div>

        {/* Business Goals */}
        <div className="space-y-3">
          <div className="text-sm font-medium">
            Objetivos de Negócio (Opcional)
          </div>

          <div className="space-y-2">
            <Label>Estágio de Receita</Label>
            <div className="grid grid-cols-3 gap-2">
              {choices?.revenue_stages.map((stage: any) => (
                <button
                  key={stage.value}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setValue("revenue_stage", stage.value);
                  }}
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
              {choices?.team_sizes.map((size: any) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setValue("team_size", size.value);
                  }}
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

          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-2">
              <Label htmlFor="revenue_goal">Meta de Receita</Label>
              <Input
                {...register("revenue_goal")}
                placeholder="Ex: R$ 50k/mês"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authority_goal">
                Meta de Autoridade/Reconhecimento
              </Label>
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
        </div>
      </div>
    </div>
  );
};
