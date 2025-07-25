import { LoadingPage } from "@/components/ui/loading";
import { authApi } from "@/lib/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const googleCallbackMutation = useMutation({
    mutationFn: authApi.handleGoogleCallback,
    onSuccess: async () => {
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });

      // Show success toast
      toast.success("Successfully signed in with Google!");

      // Small delay to ensure authentication state propagates
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Navigate to home page
      navigate("/home", { replace: true });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Google authentication failed");
      // Redirect to login after showing error
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    },
  });

  useEffect(() => {
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      // Google returned an error (user denied access, etc.)
      toast.error("Google authentication was cancelled or failed");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
      return;
    }

    if (code) {
      // Process the authorization code
      googleCallbackMutation.mutate(code);
    } else {
      // No code parameter found
      toast.error("Invalid callback - no authorization code received");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    }
  }, [searchParams, navigate, googleCallbackMutation]);

  return <LoadingPage text="Completing Google Sign-In..." />;
}
