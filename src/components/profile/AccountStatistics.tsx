import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { type CreatorProfile } from "@/lib/creator-profile-api";

interface AccountStatisticsProps {
  profile: CreatorProfile;
  completedFieldsCount: number;
  formatDate: (dateString: string) => string;
}

export const AccountStatistics = ({
  profile,
  completedFieldsCount,
  formatDate,
}: AccountStatisticsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas da Conta</CardTitle>
        <CardDescription>Dados sobre sua atividade</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Perfil criado em</span>
            <span className="font-medium">
              {formatDate(profile.created_at)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Última atualização</span>
            <span className="font-medium">
              {formatDate(profile.updated_at)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
