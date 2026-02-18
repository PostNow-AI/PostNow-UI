import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Palette } from "lucide-react";
import { MicroStepLayout } from "../MicroStepLayout";
import { TOTAL_STEPS, visualStyleOptions } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";
import { useState } from "react";

interface VisualStyleStepProps {
  value: string[];
  onChange: (value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

interface VisualStyle {
  id: number | string;
  name: string;
  description?: string;
  preview_image_url?: string | null;
}

// 18 estilos visuais com imagens do S3
const visualStyles: VisualStyle[] = visualStyleOptions.map((style) => ({
  id: style.id,
  name: style.label,
  description: style.description,
  preview_image_url: style.preview_image_url,
}));

export const VisualStyleStep = ({
  value,
  onChange,
  onNext,
  onBack,
}: VisualStyleStepProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const isValid = value.length > 0;

  // 18 estilos visuais com imagens do S3
  const preferences = visualStyles;

  const handleToggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const currentStyle = preferences[currentIndex];
  const styleId = currentStyle?.id.toString();
  const isSelected = value.includes(styleId);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    if (newDirection > 0) {
      // Próximo
      setCurrentIndex((prev) => (prev === preferences.length - 1 ? 0 : prev + 1));
    } else {
      // Anterior
      setCurrentIndex((prev) => (prev === 0 ? preferences.length - 1 : prev - 1));
    }
  };

  const goToIndex = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
    }),
    center: {
      zIndex: 1,
      x: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
    }),
  };

  return (
    <MicroStepLayout
      step={10}
      totalSteps={TOTAL_STEPS}
      title="Escolha seu estilo visual"
      titleRight={
        value.length > 0 ? (
          <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            {value.length}
          </span>
        ) : null
      }
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <div className="h-full flex flex-col">
        {/* Carrossel */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <div
            className="relative w-full h-full overflow-hidden"
            style={{ maxWidth: "calc((100vh - 280px) * 0.75)" }}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 500, damping: 40 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(_, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
                onClick={() => handleToggle(styleId)}
              >
                <div
                  className="w-full overflow-hidden"
                >
                  {/* Imagem */}
                  <div className="aspect-[3/4] relative">
                    {currentStyle?.preview_image_url ? (
                      <img
                        src={currentStyle.preview_image_url}
                        alt={currentStyle.name}
                        className="w-full h-full object-cover pointer-events-none"
                        draggable={false}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                        <Palette className="h-12 w-12 text-muted-foreground/50" />
                      </div>
                    )}

                    {/* Checkbox de seleção */}
                    <div className="absolute top-3 right-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-lg",
                          isSelected
                            ? "bg-primary"
                            : "bg-white/90 backdrop-blur-sm border-2 border-border"
                        )}
                      >
                        {isSelected && (
                          <Check className="h-5 w-5 text-white" />
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Nome e descrição - fora da imagem */}
        <div className="shrink-0 text-center pt-3 pb-1">
          <p className="font-semibold text-lg text-foreground">
            {currentStyle?.name}
          </p>
          {currentStyle?.description && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {currentStyle.description}
            </p>
          )}
        </div>

        {/* Indicadores de posição */}
        <div className="shrink-0 flex justify-center items-center gap-1 pt-3">
          {preferences.map((style, index) => {
            const id = style.id.toString();
            const selected = value.includes(id);
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => goToIndex(index)}
                className={cn(
                  "h-1 rounded-sm transition-all",
                  index === currentIndex
                    ? "bg-primary w-6"
                    : selected
                      ? "bg-primary/50 w-3"
                      : "bg-muted-foreground/30 w-3"
                )}
              />
            );
          })}
        </div>
      </div>
    </MicroStepLayout>
  );
};
