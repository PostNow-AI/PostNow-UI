import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import MDEditor from "@uiw/react-md-editor";
import { Expand, Minimize } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { Button } from "./button";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value?: string) => void;
  placeholder?: string;
  preview?: "live" | "edit" | "preview";
  height?: number;
  className?: string;
  readOnly?: boolean;
  label?: string;
  expandable?: boolean;
  showOnlyPreview?: boolean;
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  preview = "live",
  height = 200,
  className,
  readOnly = false,
  label,
  expandable = false,
  showOnlyPreview = false,
}: RichTextEditorProps) => {
  const { theme } = useTheme();
  const colorMode = theme === "dark" ? "dark" : "light";
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentHeight, setCurrentHeight] = useState(height);

  const handleExpand = () => {
    if (isExpanded) {
      setCurrentHeight(height);
      setIsExpanded(false);
    } else {
      setCurrentHeight(600);
      setIsExpanded(true);
    }
  };

  const handleHeightChange = (value?: CSSProperties["height"]) => {
    if (typeof value === "number") {
      setCurrentHeight(value);
    }
  };

  // Se showOnlyPreview é true, mostrar apenas a visualização
  if (showOnlyPreview) {
    return (
      <div className={cn("w-full space-y-2", className)}>
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <div
          className={cn(
            "rounded-lg border border-input bg-background p-4 overflow-auto",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
            "transition-all duration-200",
            "prose prose-sm max-w-none dark:prose-invert"
          )}
          data-color-mode={colorMode}
        >
          <MDEditor.Markdown
            source={value || ""}
            style={{
              backgroundColor: "transparent",
              color: "inherit",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <div
        className={cn(
          "rounded-lg border border-input bg-background overflow-hidden",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
          "transition-all duration-200",
          readOnly && "opacity-60"
        )}
        data-color-mode={colorMode}
      >
        <MDEditor
          value={value}
          onChange={onChange}
          preview={preview}
          height={currentHeight}
          visibleDragbar={expandable}
          data-color-mode={colorMode}
          hideToolbar={readOnly}
          onHeightChange={expandable ? handleHeightChange : undefined}
          textareaProps={{
            placeholder,
            style: {
              fontSize: 14,
              lineHeight: 1.6,
              fontFamily: "inherit",
              resize: expandable ? "vertical" : "none",
            },
          }}
          style={{
            backgroundColor: "transparent",
          }}
        />
        {expandable && (
          <div className="flex justify-end p-2 border-t bg-muted/20">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExpand}
              className="h-8 px-2"
            >
              {isExpanded ? (
                <>
                  <Minimize className="h-4 w-4 mr-1" />
                  Minimizar
                </>
              ) : (
                <>
                  <Expand className="h-4 w-4 mr-1" />
                  Expandir
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
