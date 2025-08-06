import { useState } from "react";
import { toast } from "sonner";

interface UseAvatarUploadProps {
  onUpload: (avatarData: string) => void;
  maxSize?: number;
  acceptedFormats?: string[];
}

export const useAvatarUpload = ({
  onUpload,
  maxSize = 1048576, // 1MB
  acceptedFormats = ["image/jpeg", "image/png", "image/gif"],
}: UseAvatarUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `Arquivo muito grande. Tamanho máximo: ${Math.round(
        maxSize / 1024 / 1024
      )}MB`;
    }

    if (!acceptedFormats.includes(file.type)) {
      return `Formato não suportado. Formatos aceitos: ${acceptedFormats
        .map((format) => format.split("/")[1].toUpperCase())
        .join(", ")}`;
    }

    return null;
  };

  const processFile = (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onUpload(result);
      setIsProcessing(false);
    };
    reader.onerror = () => {
      toast.error("Erro ao ler o arquivo");
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  return {
    processFile,
    isProcessing,
  };
};
