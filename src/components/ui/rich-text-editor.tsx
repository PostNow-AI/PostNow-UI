import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import MDEditor from "@uiw/react-md-editor";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value?: string) => void;
  placeholder?: string;
  preview?: "live" | "edit" | "preview";
  height?: number;
  className?: string;
  readOnly?: boolean;
  label?: string;
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
}: RichTextEditorProps) => {
  const { theme } = useTheme();
  const colorMode = theme === "dark" ? "dark" : "light";

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
          height={height}
          visibleDragbar={false}
          data-color-mode={colorMode}
          hideToolbar={readOnly}
          textareaProps={{
            placeholder,
            style: {
              fontSize: 14,
              lineHeight: 1.6,
              fontFamily: "inherit",
              resize: "none",
            },
          }}
          style={{
            backgroundColor: "transparent",
          }}
        />
      </div>
    </div>
  );
};
