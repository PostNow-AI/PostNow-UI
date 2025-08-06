import { type User } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const userProfileSchema = z.object({
  first_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  last_name: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
});

type UserProfileFormData = z.infer<typeof userProfileSchema>;

interface UseUserFormProps {
  user: User | null;
  onSubmit: (data: UserProfileFormData) => void;
}

export const useUserForm = ({ user, onSubmit }: UseUserFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
    },
  });

  const handleSubmit = (data: UserProfileFormData) => {
    onSubmit(data);
    setIsEditing(false);
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
    handleSubmit,
    handleCancel,
    startEditing,
  };
};
