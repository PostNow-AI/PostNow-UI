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
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  preview = "live",
  height = 200,
  className,
  readOnly = false,
}: RichTextEditorProps) => {
  return (
    <div className={cn("w-full", className)} data-color-mode="light">
      <MDEditor
        value={value}
        onChange={onChange}
        preview={preview}
        height={height}
        visibleDragbar={false}
        data-color-mode="light"
        hideToolbar={readOnly}
        textareaProps={{
          placeholder,
          style: {
            fontSize: 14,
            lineHeight: 1.6,
          },
        }}
      />
    </div>
  );
};
