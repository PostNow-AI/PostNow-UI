import { Sparkles, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { VisualStyle } from "../types";

interface StepStyleProps {
  visualStyles: VisualStyle[];
  isLoading: boolean;
  selectedStyleId: number | null;
  onSelectStyle: (styleId: number) => void;
  onBack: () => void;
  onGenerate: () => void;
}

export const StepStyle = ({
  visualStyles,
  isLoading,
  selectedStyleId,
  onSelectStyle,
  onBack,
  onGenerate,
}: StepStyleProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pb-4">
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Escolha o estilo visual
        </h2>
        <p className="text-sm text-muted-foreground">
          Selecione o estilo que melhor representa sua marca
        </p>
      </div>

      {/* Grid - scrollable */}
      <div className="flex-1 overflow-auto px-4 pb-32">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {visualStyles.map((style) => {
              const isSelected = selectedStyleId === style.id;

              return (
                <Card
                  key={style.id}
                  className={cn(
                    "cursor-pointer transition-all overflow-hidden",
                    "hover:ring-2 hover:ring-primary/50",
                    isSelected && "ring-2 ring-primary"
                  )}
                  onClick={() => onSelectStyle(style.id)}
                >
                  <CardContent className="p-0">
                    {/* Preview Image */}
                    <div className="aspect-square relative bg-muted">
                      {style.preview_image_url ? (
                        <img
                          src={style.preview_image_url}
                          alt={style.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                          <span className="text-4xl">
                            {style.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}

                      {/* Selected Indicator */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-6 h-6 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Style Name */}
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-foreground truncate">
                        {style.name}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="h-12"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button
            onClick={onGenerate}
            disabled={!selectedStyleId}
            className="flex-1 h-12 text-base font-semibold"
            size="lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Gerar Post
          </Button>
        </div>
      </div>
    </div>
  );
};
