import { cn } from "@/lib/utils";

interface StepSkeletonProps {
  className?: string;
  showProgress?: boolean;
}

/**
 * Skeleton de loading para steps do onboarding
 * Usado como fallback do Suspense para lazy loading
 */
export const StepSkeleton = ({ className, showProgress = true }: StepSkeletonProps) => {
  return (
    <div className={cn("h-[100dvh] flex flex-col bg-background", className)}>
      {/* Header skeleton */}
      <header className="shrink-0 px-4 pt-4 pb-2 space-y-3">
        {/* Progress bar skeleton */}
        {showProgress && (
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-muted-foreground/20 rounded-full animate-pulse" />
          </div>
        )}

        {/* Title skeleton */}
        <div className="space-y-2 pt-2">
          <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
        </div>
      </header>

      {/* Content skeleton */}
      <main className="flex-1 px-4 py-4">
        <div className="space-y-3">
          {/* Option skeletons */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-14 bg-muted rounded-xl animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </main>

      {/* Footer skeleton */}
      <footer className="shrink-0 px-4 py-4 border-t">
        <div className="h-12 bg-muted rounded-lg animate-pulse" />
      </footer>
    </div>
  );
};

/**
 * Skeleton compacto para steps menores
 */
export const StepSkeletonCompact = ({ className }: { className?: string }) => {
  return (
    <div className={cn("space-y-4 p-4", className)}>
      <div className="h-5 w-2/3 bg-muted rounded animate-pulse" />
      <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
      <div className="space-y-2 mt-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-10 bg-muted rounded-lg animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    </div>
  );
};
