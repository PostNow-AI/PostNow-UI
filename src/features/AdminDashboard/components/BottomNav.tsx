/**
 * BottomNav Component
 * Mobile-first bottom navigation for dashboard screens
 *
 * Features:
 * - 4 fixed tabs: Geral, Funil, Engaj, Email
 * - Fixed at bottom of screen (green zone - easy thumb reach)
 * - Clear visual feedback on active tab
 * - Safe area padding for devices with home indicator
 */

import { LayoutGrid, GitBranch, MessageSquare, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export type DashboardTab = "geral" | "funil" | "engaj" | "email";

interface TabConfig {
  id: DashboardTab;
  label: string;
  icon: typeof LayoutGrid;
}

const tabs: TabConfig[] = [
  { id: "geral", label: "Geral", icon: LayoutGrid },
  { id: "funil", label: "Funil", icon: GitBranch },
  { id: "engaj", label: "Engaj", icon: MessageSquare },
  { id: "email", label: "Email", icon: Mail },
];

export interface BottomNavProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed nav */}
      <div className="h-16" aria-hidden="true" />

      {/* Fixed Bottom Navigation */}
      <nav
        className={cn(
          // Fixed positioning at bottom
          "fixed bottom-0 left-0 right-0 z-50",
          // Background with blur
          "bg-background/95 backdrop-blur-lg",
          "border-t border-border/50",
          // Safe area for devices with home indicator
          "pb-safe"
        )}
        role="navigation"
        aria-label="Navegação do dashboard"
      >
        <div className="flex items-stretch">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                aria-pressed={isActive}
                aria-label={tab.label}
                className={cn(
                  // Fill available space equally
                  "flex-1",
                  // Touch target: 56px minimum height
                  "min-h-[56px]",
                  // Layout
                  "flex flex-col items-center justify-center",
                  "py-2 gap-1",
                  // Transitions
                  "transition-all duration-200",
                  // Active state
                  isActive && "bg-primary/10",
                  // Hover state (non-active)
                  !isActive && "hover:bg-muted/50",
                  // Active indicator
                  "relative"
                )}
              >
                {/* Active indicator line */}
                {isActive && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full"
                    aria-hidden="true"
                  />
                )}

                {/* Icon */}
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />

                {/* Label */}
                <span
                  className={cn(
                    "text-xs font-medium",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
