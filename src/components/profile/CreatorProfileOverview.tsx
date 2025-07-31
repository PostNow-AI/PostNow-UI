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
        <CardDescription>Informações do seu onboarding</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Plataforma principal</span>
            <span className="font-medium capitalize">
              {profile.main_platform || "Não definido"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Nicho</span>
            <span className="font-medium">
              {profile.niche || "Não definido"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Experiência</span>
            <span className="font-medium capitalize">
              {profile.experience_level || "Não definido"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Objetivo principal</span>
            <span className="font-medium capitalize">
              {profile.primary_goal || "Não definido"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tempo disponível</span>
            <span className="font-medium">
              {profile.time_available
                ? `${profile.time_available} horas/semana`
                : "Não definido"}
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
