/**
 * StepDetailsDrawer Component
 * Shows detailed information about a specific onboarding step
 * Including statistics, timing, and session list
 */

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowDown,
  ArrowRight,
  Clock,
  Loader2,
  Users,
  CheckCircle2,
  XCircle,
  User,
  Bot,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { dashboardApiService } from "@/lib/dashboard-api";
import type { PeriodDays } from "../types";
import { STEP_NAMES_PT, FUNNEL_PHASES } from "../types";

export interface StepDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stepNumber: number | null;
  days: PeriodDays;
}

const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${minutes}m ${secs}s`;
};

const getPhaseForStep = (stepNumber: number) => {
  return FUNNEL_PHASES.find((phase) => phase.steps.includes(stepNumber));
};

export const StepDetailsDrawer = ({
  open,
  onOpenChange,
  stepNumber,
  days,
}: StepDetailsDrawerProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard", "onboarding-step-details", stepNumber, days],
    queryFn: () =>
      stepNumber ? dashboardApiService.getOnboardingStepDetails(stepNumber, days) : null,
    enabled: open && stepNumber !== null,
    staleTime: 5 * 60 * 1000,
  });

  const phase = stepNumber ? getPhaseForStep(stepNumber) : null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="pb-2 border-b">
          <DrawerTitle className="flex items-center gap-2 text-base">
            {phase && (
              <div className={cn("w-3 h-3 rounded-sm", phase.color)} />
            )}
            {stepNumber && STEP_NAMES_PT[stepNumber]}
            <span className="text-sm font-normal text-muted-foreground">
              (Etapa {stepNumber})
            </span>
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {isError && (
            <div className="text-center py-12 text-muted-foreground">
              Erro ao carregar detalhes da etapa
            </div>
          )}

          {data && (
            <div className="space-y-4">
              {/* Statistics Cards */}
              <div className="grid grid-cols-2 gap-2">
                {/* Total Visits */}
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Users className="h-3.5 w-3.5" />
                    <span className="text-[10px] uppercase tracking-wide">Visitaram</span>
                  </div>
                  <div className="text-xl font-bold">
                    {data.statistics.total_visits.toLocaleString("pt-BR")}
                  </div>
                </div>

                {/* Completed */}
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span className="text-[10px] uppercase tracking-wide">Completaram</span>
                  </div>
                  <div className="text-xl font-bold text-green-500">
                    {data.statistics.completed.toLocaleString("pt-BR")}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      ({data.statistics.completion_rate}%)
                    </span>
                  </div>
                </div>

                {/* Drop-off */}
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <XCircle className="h-3.5 w-3.5" />
                    <span className="text-[10px] uppercase tracking-wide">Desistiram</span>
                  </div>
                  <div className="text-xl font-bold text-red-500">
                    {data.statistics.drop_off_count.toLocaleString("pt-BR")}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      ({data.statistics.drop_off_rate}%)
                    </span>
                  </div>
                </div>

                {/* Average Time */}
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-[10px] uppercase tracking-wide">Tempo Médio</span>
                  </div>
                  <div className="text-xl font-bold">
                    {data.statistics.avg_time_seconds > 0
                      ? formatTime(data.statistics.avg_time_seconds)
                      : "-"}
                  </div>
                </div>
              </div>

              {/* Flow Visualization */}
              <div className="bg-muted/20 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-center">
                    <div className="text-muted-foreground text-[10px] mb-1">Etapa anterior</div>
                    <div className="font-bold">
                      {data.statistics.prev_step_count.toLocaleString("pt-BR")}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="text-center">
                    <div className="text-muted-foreground text-[10px] mb-1">Esta etapa</div>
                    <div className={cn("font-bold", phase?.textColor)}>
                      {data.statistics.total_visits.toLocaleString("pt-BR")}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="text-center">
                    <div className="text-muted-foreground text-[10px] mb-1">Próxima etapa</div>
                    <div className="font-bold">
                      {data.statistics.next_step_count.toLocaleString("pt-BR")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center mt-2 text-[10px] text-muted-foreground">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  Taxa de progressão: {data.statistics.progression_rate}%
                </div>
              </div>

              {/* Sessions List */}
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center justify-between">
                  <span>Sessões Recentes</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {data.sessions_total} total
                  </span>
                </h3>
                <div className="space-y-1 max-h-[300px] overflow-y-auto">
                  {data.sessions.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      Nenhuma sessão encontrada
                    </div>
                  ) : (
                    data.sessions.map((session) => (
                      <div
                        key={session.session_id}
                        className="flex items-center justify-between py-2 px-3 bg-muted/20 rounded text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {session.is_simulation ? (
                            <Bot className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          ) : session.user ? (
                            <User className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                          ) : (
                            <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          )}
                          <div className="truncate">
                            {session.user?.email || session.session_id.slice(0, 16)}
                            {session.is_simulation && (
                              <span className="text-muted-foreground ml-1">(sim)</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {session.time_spent_seconds && (
                            <span className="text-muted-foreground">
                              {formatTime(session.time_spent_seconds)}
                            </span>
                          )}
                          {session.completed ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-red-500" />
                          )}
                          <span className="text-muted-foreground w-14 text-right">
                            {format(new Date(session.visited_at), "dd/MM HH:mm", {
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default StepDetailsDrawer;
