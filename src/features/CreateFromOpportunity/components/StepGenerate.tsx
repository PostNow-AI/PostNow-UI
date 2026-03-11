import { Loader2, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { VisualStyle } from "../types";

interface StepGenerateProps {
  isGenerating: boolean;
  selectedStyle: VisualStyle | undefined;
}

export const StepGenerate = ({
  isGenerating,
  selectedStyle,
}: StepGenerateProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      {/* Spinner */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
          {isGenerating ? (
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          ) : (
            <Sparkles className="w-12 h-12 text-primary" />
          )}
        </div>
      </div>

      {/* Message */}
      <h2 className="text-xl font-semibold text-foreground mb-2 text-center">
        {isGenerating ? "Criando seu post..." : "Preparando..."}
      </h2>

      {selectedStyle && (
        <p className="text-muted-foreground text-center mb-8">
          Usando estilo <span className="font-medium">{selectedStyle.name}</span>
        </p>
      )}

      {/* Progress Bar */}
      {isGenerating && (
        <div className="w-full max-w-xs space-y-2">
          <Progress value={undefined} className="h-2 animate-pulse" />
          <p className="text-sm text-muted-foreground text-center">
            Gerando conteúdo...
          </p>
        </div>
      )}
    </div>
  );
};
