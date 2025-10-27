import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { BetaLogo } from "./beta-logo";
import { BlurryBackground } from "./blurry-background";

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
    <BlurryBackground variant="1">
      <div
        className={cn(
          "px-4 flex min-h-[93vh] flex-col items-center justify-center",
          className
        )}
      >
        <div className="max-w-md w-full bg-card rounded-lg space-y-2 shadow-lg p-8 text-center">
          <BetaLogo />
          <Loading size="lg" text={text} />
        </div>
      </div>
    </BlurryBackground>
  );
}

export { Loading, LoadingPage };
