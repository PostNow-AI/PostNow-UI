import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { type CreatorProfile } from "@/lib/creator-profile-api";

interface StatusConfig {
  text: string;
  className: string;
}

interface CreatorProfileOverviewProps {
  profile: CreatorProfile;
  statusConfig: StatusConfig;
  formatDate: (dateString: string) => string;
}

export const CreatorProfileOverview = ({
  profile,
  statusConfig,
  formatDate,
}: CreatorProfileOverviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil de Criador</CardTitle>
        <CardDescription>Informações de personalização</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Nome profissional</span>
            <span className="font-medium">
              {profile.professional_name || "Não definido"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Profissão</span>
            <span className="font-medium">
              {profile.profession || "Não definido"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Especialização</span>
            <span className="font-medium">
              {profile.specialization || "Não definido"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Contato/Social</span>
            <span className="font-medium">
              {[
                profile.instagram_handle,
                profile.business_instagram_handle,
                profile.whatsapp_number,
                profile.business_website,
              ].filter(Boolean).length || 0}{" "}
              configurados
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Brandbook</span>
            <span className="font-medium">
              {[
                profile.voice_tone,
                profile.color_1,
                profile.color_2,
                profile.color_3,
                profile.color_4,
                profile.color_5,
              ].filter(Boolean).length || 0}{" "}
              elementos
            </span>
          </div>
        </div>

        {/* Profile Status */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Status do onboarding
            </span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${statusConfig.className}`}
            >
              {statusConfig.text}
            </span>
          </div>

          {profile.onboarding_completed_at && (
            <p className="text-xs text-muted-foreground">
              Completado em: {formatDate(profile.onboarding_completed_at)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
