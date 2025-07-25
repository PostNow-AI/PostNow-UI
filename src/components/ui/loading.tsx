import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

function Loading({ className, size = "md", text }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className
      )}
    >
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && (
        <p className={cn("text-muted-foreground", textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );
}

interface LoadingPageProps {
  text?: string;
  className?: string;
}

function LoadingPage({ text, className }: LoadingPageProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100",
        className
      )}
    >
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 text-center">
        <Loading size="lg" text={text} />
      </div>
    </div>
  );
}

export { Loading, LoadingPage };
