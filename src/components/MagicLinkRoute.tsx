import { LoadingPage } from "@/components/ui/loading";
import { useAuth } from "@/hooks/useAuth";
import { useMagicLink } from "@/features/Auth/MagicLink";
import { Navigate, useLocation } from "react-router-dom";

interface MagicLinkRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard that supports both cookie-based auth and magic link tokens.
 *
 * Flow:
 * 1. If user already authenticated (cookie) -> render children
 * 2. If URL has ?token=... -> validate magic link -> authenticate -> render children
 * 3. If neither -> redirect to login, preserving full URL (path + search params)
 */
export function MagicLinkRoute({ children }: MagicLinkRouteProps) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { status, error, hasToken } = useMagicLink();
  const location = useLocation();

  // Already authenticated via cookie — render immediately
  if (isAuthenticated && !hasToken) {
    return <>{children}</>;
  }

  // Magic link token being validated
  if (hasToken && status === "validating") {
    return <LoadingPage text="Validando acesso..." />;
  }

  // Magic link validated — wait for auth state to propagate
  if (hasToken && status === "authenticated") {
    if (isAuthLoading) {
      return <LoadingPage text="Carregando..." />;
    }
    if (isAuthenticated) {
      return <>{children}</>;
    }
    // Auth state still propagating, show loading briefly
    return <LoadingPage text="Finalizando autenticação..." />;
  }

  // Magic link failed — show error and redirect
  if (hasToken && (status === "invalid" || status === "expired" || status === "error")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-xl font-bold text-foreground mb-2">
          {status === "expired" ? "Link expirado" : "Link inválido"}
        </h1>
        <p className="text-muted-foreground mb-6">
          {error || "Este link não é mais válido. Faça login para continuar."}
        </p>
        <a
          href="/login"
          className="text-primary underline hover:text-primary/80"
        >
          Ir para login
        </a>
      </div>
    );
  }

  // Still checking auth state (no token, loading cookies)
  if (isAuthLoading) {
    return <LoadingPage />;
  }

  // Not authenticated, no token — redirect to login preserving full URL
  return (
    <Navigate
      to="/onboarding"
      state={{ from: location }}
      replace
    />
  );
}
