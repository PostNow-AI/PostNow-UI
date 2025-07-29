import { authApi, authUtils } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async () => {
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });

      // Show success toast
      toast.success("Welcome back! You've been successfully logged in.");

      // Small delay to ensure authentication state propagates
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Navigate to intended destination or home page
      const from = location.state?.from?.pathname || "/home";
      navigate(from, { replace: true });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Login failed");
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleGoogleLogin = async () => {
    try {
      authUtils.loginWithGoogle();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Google login failed"
      );
    }
  };

  return {
    form,
    isLoading: loginMutation.isPending,
    onSubmit,
    handleGoogleLogin,
    isSuccess: loginMutation.isSuccess,
    isError: loginMutation.isError,
  };
}
