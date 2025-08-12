import { StatsGrid, ToastDemoCard, WelcomeCard } from "@/components/ideabank";
import { LoadingPage } from "@/components/ui";
import { useHomePage } from "@/hooks/useHomePage";

export function HomePage() {
  const {
    isLoading,
    userGreeting,
    statsData,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
  } = useHomePage();

  if (isLoading) {
    return <LoadingPage text="Carregando..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Bem-vindo ao Sonora
        </h1>
        {userGreeting && (
          <p className="text-muted-foreground">{userGreeting}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <WelcomeCard />
        <ToastDemoCard
          onShowSuccess={showSuccessToast}
          onShowError={showErrorToast}
          onShowWarning={showWarningToast}
          onShowInfo={showInfoToast}
        />
      </div>

      <StatsGrid statsData={statsData} />
    </div>
  );
}
