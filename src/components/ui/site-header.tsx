import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useMonthlyCredits } from "@/features/Credits/hooks/useCredits";
import { Sparkles } from "lucide-react";
import { Progress } from "./progress";

export function SiteHeader({ title }: { title: string }) {
  const { data: userCredits } = useMonthlyCredits();
  const balance = Number(userCredits?.monthly_status?.monthly_remaining) || 0;
  const allocation =
    Number(userCredits?.subscription_info?.monthly_credits_allocation) || 0;
  const percentage = allocation > 0 ? (balance / allocation) * 100 : 0;

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2  transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex flex-col gap-2 w-full px-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex w-full items-center gap-1 lg:gap-2">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-base font-medium">{title}</h1>
          </div>{" "}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              {percentage.toFixed(2)}%
              <span className="w-[120px] text-muted-foreground text-sm">
                <Progress value={percentage} />
              </span>
            </div>
          </div>
        </div>
        <Separator />
      </div>
    </header>
  );
}
