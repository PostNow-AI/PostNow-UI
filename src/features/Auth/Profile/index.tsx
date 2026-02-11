import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LoadingPage,
} from "@/components/ui";
import { Container } from "@/components/ui/container";
import { OnboardingReview } from "@/features/Auth/components/OnboardingReview";
import { useProfilePage } from "@/features/Auth/Profile/hooks/useProfilePage";
import { BasicUserInfo } from "./components/BasicUserInfo";

export const Profile = () => {
  const { user, profile, isLoading, error, openEditOnboarding } =
    useProfilePage();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Erro ao carregar perfil</CardTitle>
            <CardDescription>
              Não foi possível carregar os dados do seu perfil de criador.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Container
      headerTitle="Perfil do Criador"
      headerDescription="Gerencie suas informações pessoais e preferências de conteúdo"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - User Info */}
        <div className="space-y-6">
          <BasicUserInfo user={user} />
        </div>

        {/* Right Column - Onboarding Data */}
        <div className="lg:col-span-2">
          <Card>
            <OnboardingReview
              title="Informações de negócio"
              description="Os dados de seu negócio ajudam a personalizar sua experiência na plataforma"
              values={profile}
              onEdit={openEditOnboarding}
            />
          </Card>
        </div>
      </div>
    </Container>
  );
};
