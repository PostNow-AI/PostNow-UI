import { authApi, authUtils } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export function useRegister() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: async () => {
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });

      // Show success toast
      toast.success("Account created successfully! Welcome to Sonora.");

      // Small delay to ensure authentication state propagates
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Navigate to home page
      navigate("/home");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Registration failed");
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    registerMutation.mutate({
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
    });
  };

  const handleGoogleRegister = async () => {
    try {
      authUtils.loginWithGoogle();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Google registration failed"
      );
    }
  };

  return {
    form,
    isLoading: registerMutation.isPending,
    onSubmit,
    handleGoogleRegister,
    isSuccess: registerMutation.isSuccess,
    isError: registerMutation.isError,
  };
}
