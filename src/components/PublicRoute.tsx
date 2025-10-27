import { LoadingPage } from "@/components/ui/loading";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { BlurryBackground } from "./ui/blurry-background";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function PublicRoute({
  children,
  redirectTo = "/ideabank",
}: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingPage />;
  }

  // Redirect authenticated users to home (or intended destination from login)
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />;
  }

  // Render the public component if not authenticated
  return <BlurryBackground variant="1">{children}</BlurryBackground>;
}
