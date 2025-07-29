import { LoadingPage } from "@/components/ui/loading";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error) {
      // Backend returned an error
      const errorMessage = errorDescription || "Google authentication failed";
      toast.error(errorMessage);
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
      return;
    }

    if (success === "true") {
      // Authentication was successful - invalidate auth queries and redirect
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
      toast.success("Successfully signed in with Google!");

      // Small delay to ensure authentication state propagates
      setTimeout(() => {
        navigate("/home", { replace: true });
      }, 100);
    } else {
      // Neither success nor error parameter found
      toast.error(
        "Invalid callback - unexpected response from Google authentication"
      );
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    }
  }, [searchParams, navigate, queryClient]);

  return <LoadingPage text="Completing Google Sign-In..." />;
}
