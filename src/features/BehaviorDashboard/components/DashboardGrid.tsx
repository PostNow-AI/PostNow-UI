import type { ReactNode } from "react";

interface DashboardGridProps {
  children: ReactNode;
}

export const DashboardGrid = ({ children }: DashboardGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  );
};
