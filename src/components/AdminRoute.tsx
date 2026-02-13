import { LoadingPage } from "@/components/ui/loading";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const isAdmin = user?.is_superuser === true;

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingPage />;
  }

  // Redirect to login if not authenticated, preserving the intended destination
  if (!isAuthenticated) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  // Redirect to home if not an admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Render the protected component if authenticated
  return <>{children}</>;
}
