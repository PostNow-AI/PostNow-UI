import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type User } from "@/types/auth";

const userProfileSchema = z.object({
  first_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  last_name: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
});

type UserProfileFormData = z.infer<typeof userProfileSchema>;

interface UseUserFormProps {
  user: User | null;
  onSubmit: (data: UserProfileFormData) => Promise<void>;
}

export const useUserForm = ({ user, onSubmit }: UseUserFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
    },
  });

  const handleSubmit = async (data: UserProfileFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  return {
    form,
    isEditing,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
    handleCancel,
    startEditing,
  };
}; 