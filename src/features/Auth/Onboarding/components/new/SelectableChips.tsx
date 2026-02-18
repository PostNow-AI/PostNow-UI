import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";

// Sanitiza input de usuário para prevenir XSS
const sanitizeInput = (value: string): string => {
  return value
    .replace(/[<>]/g, "") // Remove < e > para prevenir tags HTML
    .replace(/javascript:/gi, "") // Remove tentativas de javascript:
    .replace(/on\w+=/gi, "") // Remove event handlers (onclick=, onerror=, etc)
    .trim()
    .slice(0, 100); // Limita tamanho máximo
};

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

  const handleAddCustom = useCallback(() => {
    const sanitized = sanitizeInput(customValue);
    if (sanitized && !hasReachedMax && !selected.includes(sanitized)) {
      onToggle(sanitized);
      setCustomValue("");
      setShowCustomInput(false);
    }
  }, [customValue, hasReachedMax, selected, onToggle]);

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
    <div className="h-full flex flex-col">
      {/* Contador de seleções */}
      {showCount && maxSelections && (
        <div className="shrink-0 text-sm text-muted-foreground mb-3">
          <span>
            {selected.length} de {maxSelections} selecionados
          </span>
        </div>
      )}

      {/* Grid de chips alinhado à esquerda */}
      <div className="flex flex-wrap gap-2 content-start" role="group" aria-label="Opções disponíveis">
        {options.map((option, index) => {
          const isSelected = selected.includes(option);
          const isDisabled = !isSelected && hasReachedMax;

          return (
            <motion.button
              key={option}
              type="button"
              aria-pressed={isSelected}
              aria-disabled={isDisabled}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              onClick={() => !isDisabled && onToggle(option)}
              disabled={isDisabled}
              className={cn(
                "px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                "border-2",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-primary/5",
                isDisabled && "opacity-50 cursor-not-allowed hover:bg-card hover:border-border"
              )}
            >
              {option}
            </motion.button>
          );
        })}

        {/* Itens customizados adicionados pelo usuário */}
        {customItems.map((item) => (
          <motion.button
            key={item}
            type="button"
            aria-pressed={true}
            aria-label={`${item} (personalizado, clique para remover)`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => onToggle(item)}
            className="px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border-2 bg-primary text-primary-foreground border-primary"
          >
            {item}
          </motion.button>
        ))}

        {/* Botão "Outro" */}
        {allowCustom && !showCustomInput && !hasReachedMax && (
          <motion.button
            type="button"
            aria-label="Adicionar opção personalizada"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setShowCustomInput(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border-2 border-dashed border-primary/50 text-primary hover:border-primary hover:bg-primary/5"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Outro
          </motion.button>
        )}
      </div>

      {/* Spacer to push input to bottom */}
      <div className="flex-1" />

      {/* Mensagem quando atingir o máximo */}
      {hasReachedMax && !showCustomInput && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="shrink-0 text-sm text-amber-600 dark:text-amber-400 text-center"
        >
          Você atingiu o limite de {maxSelections} seleções
        </motion.p>
      )}

      {/* Input para opção customizada - at bottom */}
      {allowCustom && showCustomInput && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="shrink-0 flex gap-2"
        >
          <Input
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={handleCustomKeyDown}
            placeholder={customPlaceholder}
            className="flex-1 h-10 text-sm"
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
            OK
          </button>
          <button
            type="button"
            aria-label="Cancelar"
            onClick={() => {
              setShowCustomInput(false);
              setCustomValue("");
            }}
            className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </div>
  );
};
