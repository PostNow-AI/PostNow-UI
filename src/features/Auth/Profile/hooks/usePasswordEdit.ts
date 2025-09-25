import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { PasswordFormData } from "../constants/schemas";
import { profileApi } from "../services";

export const usePasswordEdit = () => {
  const form = useForm<PasswordFormData>({
    defaultValues: {
      old_password: "",
      new_password1: "",
      new_password2: "",
    },
    mode: "onBlur",
  });

  const passwordChangeMutation = useMutation({
    mutationFn: async (data: {
      old_password: string;
      new_password1: string;
      new_password2: string;
    }) => {
      const response = await profileApi.updatePassword(data);
      return response;
    },
    onSuccess: () => {
      toast.success("Senha alterada com sucesso!");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Erro ao alterar senha");
      } else {
        toast.error("Erro ao alterar senha");
      }
    },
  });

  return {
    form,
    passwordChange: passwordChangeMutation.mutate,
    isChangingPassword: passwordChangeMutation.isPending,
  };
};
