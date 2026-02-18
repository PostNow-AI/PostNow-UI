import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Sparkles,
  GraduationCap,
  Laptop,
  Shirt,
  Utensils,
  Wallet,
  Scale,
  Home,
  Dog,
  Dumbbell,
  Plus,
  Briefcase,
  Smile,
  Rocket,
  BookOpen,
  PartyPopper,
  Award,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "heart-pulse": Heart,
  sparkles: Sparkles,
  "graduation-cap": GraduationCap,
  laptop: Laptop,
  shirt: Shirt,
  utensils: Utensils,
  wallet: Wallet,
  scale: Scale,
  home: Home,
  dog: Dog,
  dumbbell: Dumbbell,
  plus: Plus,
  briefcase: Briefcase,
  smile: Smile,
  rocket: Rocket,
  "book-open": BookOpen,
  "party-popper": PartyPopper,
  award: Award,
};

interface SelectableCardOption {
  id: string;
  label: string;
  icon?: string;
  description?: string;
  example?: string;
}

interface SelectableCardsProps {
  options: SelectableCardOption[];
  selected: string;
  onSelect: (id: string) => void;
  columns?: 1 | 2;
  size?: "sm" | "md" | "lg";
}

export const SelectableCards = ({
  options,
  selected,
  onSelect,
  columns = 2,
  size = "md",
}: SelectableCardsProps) => {
  return (
    <div className="h-full overflow-y-auto">
      <div
        className={cn(
          "grid gap-2",
          columns === 1 ? "grid-cols-1" : "grid-cols-2"
        )}
      >
        {options.map((option, index) => {
          const Icon = option.icon ? iconMap[option.icon] : null;
          const isSelected = selected === option.id;

          return (
            <motion.button
              key={option.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => onSelect(option.id)}
              className={cn(
                "relative flex flex-col items-start p-2.5 rounded-lg border-2 text-left transition-all",
                "hover:border-primary/50 hover:bg-primary/5",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card",
                size === "sm" && "p-2",
                size === "lg" && "p-3"
              )}
            >
              {/* Indicador de seleção */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <svg
                      className="w-2.5 h-2.5 text-primary-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Ícone */}
              {Icon && (
                <div
                  className={cn(
                    "p-1.5 rounded-md mb-1",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
              )}

              {/* Label */}
              <span
                className={cn(
                  "font-medium text-sm",
                  size === "lg" && "text-base"
                )}
              >
                {option.label}
              </span>

              {/* Descrição - hide on small screens */}
              {option.description && (
                <span className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                  {option.description}
                </span>
              )}

              {/* Exemplo - only show when selected */}
              {option.example && isSelected && (
                <motion.span
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-[10px] italic text-muted-foreground mt-1 pt-1 border-t w-full"
                >
                  "{option.example}"
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
