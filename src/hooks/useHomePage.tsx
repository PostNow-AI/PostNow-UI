import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const useHomePage = () => {
  const { user, isLoading } = useAuth();

  // Toast functions
  const showSuccessToast = () => {
    toast.success("Operação realizada com sucesso!", {
      description: "Tudo funcionou conforme esperado.",
    });
  };

  const showErrorToast = () => {
    toast.error("Ocorreu um erro!", {
      description: "Algo deu errado durante a operação.",
    });
  };

  const showWarningToast = () => {
    toast.warning("Atenção necessária!", {
      description: "Verifique suas configurações.",
    });
  };

  const showInfoToast = () => {
    toast.info("Informação importante", {
      description: "Aqui estão algumas informações úteis.",
    });
  };

  // User greeting
  const getUserGreeting = () => {
    if (!user) return null;
    return `Olá, ${user.first_name} ${user.last_name}! Você entrou com sucesso.`;
  };

  // Mock stats data - could be replaced with real API calls
  const getStatsData = () => [
    {
      title: "Total de Sessões",
      value: "24",
      description: "+12% em relação ao mês passado",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: "Tempo Ativo",
      value: "2h 34m",
      description: "+8% em relação à semana passada",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12,6 12,12 16,14" />
        </svg>
      ),
    },
    {
      title: "Notificações",
      value: "128",
      description: "+3 novas hoje",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    },
    {
      title: "Status",
      value: "Online",
      description: "Sistema funcionando",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      valueClassName: "text-green-600",
    },
  ];

  return {
    // Data
    user,
    isLoading,
    userGreeting: getUserGreeting(),
    statsData: getStatsData(),

    // Toast handlers
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
  };
};
