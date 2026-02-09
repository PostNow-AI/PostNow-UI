import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Plus, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface SelectableChipsProps {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
  maxSelections?: number;
  showCount?: boolean;
  allowCustom?: boolean;
  customPlaceholder?: string;
}

export const SelectableChips = ({
  options,
  selected,
  onToggle,
  maxSelections,
  showCount = true,
  allowCustom = false,
  customPlaceholder = "Digite uma opção...",
}: SelectableChipsProps) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const hasReachedMax = maxSelections ? selected.length >= maxSelections : false;

  // Encontrar itens customizados (que não estão nas opções originais)
  const customItems = selected.filter((item) => !options.includes(item));

  const handleAddCustom = () => {
    if (customValue.trim() && !hasReachedMax) {
      onToggle(customValue.trim());
      setCustomValue("");
      setShowCustomInput(false);
    }
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustom();
    } else if (e.key === "Escape") {
      setShowCustomInput(false);
      setCustomValue("");
    }
  };

  return (
    <div className="space-y-4">
      {/* Contador de seleções */}
      {showCount && maxSelections && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {selected.length} de {maxSelections} selecionados
          </span>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => selected.forEach((s) => onToggle(s))}
              className="text-primary hover:underline flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Limpar
            </button>
          )}
        </div>
      )}

      {/* Grid de chips */}
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => {
          const isSelected = selected.includes(option);
          const isDisabled = !isSelected && hasReachedMax;

          return (
            <motion.button
              key={option}
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => !isDisabled && onToggle(option)}
              disabled={isDisabled}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all",
                "border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-primary/5",
                isDisabled && "opacity-50 cursor-not-allowed hover:bg-card hover:border-border"
              )}
            >
              {isSelected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Check className="h-3.5 w-3.5" />
                </motion.span>
              )}
              {option}
            </motion.button>
          );
        })}

        {/* Itens customizados adicionados pelo usuário */}
        {customItems.map((item) => (
          <motion.button
            key={item}
            type="button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => onToggle(item)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border-2 bg-primary text-primary-foreground border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Check className="h-3.5 w-3.5" />
            {item}
          </motion.button>
        ))}

        {/* Botão "Outro" */}
        {allowCustom && !showCustomInput && !hasReachedMax && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setShowCustomInput(true)}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all",
              "border-2 border-dashed border-primary/50 text-primary hover:border-primary hover:bg-primary/5",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          >
            <Plus className="h-3.5 w-3.5" />
            Outro
          </motion.button>
        )}
      </div>

      {/* Input para opção customizada */}
      {allowCustom && showCustomInput && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2"
        >
          <Input
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={handleCustomKeyDown}
            placeholder={customPlaceholder}
            className="flex-1"
            autoFocus
          />
          <button
            type="button"
            onClick={handleAddCustom}
            disabled={!customValue.trim()}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              customValue.trim()
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            Adicionar
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCustomInput(false);
              setCustomValue("");
            }}
            className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}

      {/* Mensagem quando atingir o máximo */}
      {hasReachedMax && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-amber-600 dark:text-amber-400"
        >
          Você atingiu o limite de {maxSelections} seleções
        </motion.p>
      )}
    </div>
  );
};
