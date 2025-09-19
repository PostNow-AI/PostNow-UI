import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  className?: string;
}

export function Loader({ size = 16, className, ...props }: LoaderProps) {
  return (
    <div
      role="status"
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <Loader2
        className="h-[1em] w-[1em] animate-spin"
        style={{ fontSize: size }}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
