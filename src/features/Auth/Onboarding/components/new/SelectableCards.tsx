import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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
    <div
      className={cn(
        "grid gap-3",
        columns === 1 ? "grid-cols-1" : "grid-cols-2",
        size === "sm" && "gap-2"
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
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(option.id)}
            className={cn(
              "relative flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all",
              "hover:border-primary/50 hover:bg-primary/5",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              isSelected
                ? "border-primary bg-primary/10"
                : "border-border bg-card",
              size === "sm" && "p-3",
              size === "lg" && "p-5"
            )}
          >
            {/* Indicador de seleção */}
            {isSelected && (
              <motion.div
                layoutId="card-selection"
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                initial={false}
              >
                <svg
                  className="w-3 h-3 text-primary-foreground"
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

            {/* Ícone */}
            {Icon && (
              <div
                className={cn(
                  "p-2 rounded-lg mb-2",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", size === "sm" && "h-4 w-4")} />
              </div>
            )}

            {/* Label */}
            <span
              className={cn(
                "font-medium",
                size === "sm" && "text-sm",
                size === "lg" && "text-lg"
              )}
            >
              {option.label}
            </span>

            {/* Descrição */}
            {option.description && (
              <span className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {option.description}
              </span>
            )}

            {/* Exemplo */}
            {option.example && isSelected && (
              <motion.span
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-xs italic text-muted-foreground mt-2 pt-2 border-t w-full"
              >
                "{option.example}"
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
