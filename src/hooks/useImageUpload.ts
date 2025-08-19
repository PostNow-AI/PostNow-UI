import { useCallback, useRef, useState } from "react";

export interface ImageUploadOptions {
  maxSize?: number;
  acceptedFormats?: string[];
  onError?: (error: string) => void;
  onChange: (value: string) => void;
}

export const useImageUpload = ({
  maxSize = 1048576, // 1MB default
  acceptedFormats = ["image/jpeg", "image/png", "image/gif"],
  onError,
  onChange,
}: ImageUploadOptions) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate file
  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file size
      if (file.size > maxSize) {
        return `Arquivo muito grande. Tamanho máximo: ${Math.round(
          maxSize / 1024 / 1024
        )}MB`;
      }

      // Check file type
      if (!acceptedFormats.includes(file.type)) {
        return `Formato não suportado. Formatos aceitos: ${acceptedFormats
          .map((format) => format.split("/")[1].toUpperCase())
          .join(", ")}`;
      }

      return null;
    },
    [maxSize, acceptedFormats]
  );

  // Process file
  const processFile = useCallback(
    async (file: File) => {
      setIsLoading(true);

      try {
        const error = validateFile(file);
        if (error) {
          onError?.(error);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onChange(result);
          setIsLoading(false);
        };
        reader.onerror = () => {
          onError?.("Erro ao ler o arquivo");
          setIsLoading(false);
        };
        reader.readAsDataURL(file);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        onError?.("Erro ao processar o arquivo");
        setIsLoading(false);
      }
    },
    [validateFile, onError, onChange]
  );

  // Handle file selection
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  // Handle drop
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);

      const file = event.dataTransfer.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  // Handle drag over
  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(true);
    },
    []
  );

  // Handle drag leave
  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);
    },
    []
  );

  // Trigger file input
  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Clear file input
  const clearFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return {
    isDragOver,
    isLoading,
    fileInputRef,
    validateFile,
    processFile,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    triggerFileInput,
    clearFileInput,
  };
};
