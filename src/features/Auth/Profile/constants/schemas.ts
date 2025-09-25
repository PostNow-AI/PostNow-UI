import z from "zod";

export const passwordSchema = z
  .object({
    old_password: z
      .string()
      .min(6, "Senha antiga deve ter pelo menos 6 caracteres"),
    new_password1: z
      .string()
      .min(6, "Nova senha deve ter pelo menos 6 caracteres"),
    new_password2: z
      .string()
      .min(6, "Confirmação de nova senha deve ter pelo menos 6 caracteres"),
  })
  .refine((data) => data.new_password1 === data.new_password2, {
    message: "As senhas não coincidem",
    path: ["new_password2"],
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;
