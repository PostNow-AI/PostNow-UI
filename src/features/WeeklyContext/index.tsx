import { useState } from "react";
import { useAuth } from "@/hooks";
import { useWeeklyContext } from "./hooks/useWeeklyContext";
import { useGenerateFromOpportunity } from "./hooks/useGenerateFromOpportunity";
import { WeeklyContextHeader } from "./components/WeeklyContextHeader";
import { OpportunitySection } from "./components/OpportunitySection";
import { EmptyState } from "./components/EmptyState";
import { GeneratingPostDialog } from "./components/GeneratingPostDialog";
import { GeneratingPostSheet } from "./components/GeneratingPostSheet";
import { Container, Button, Skeleton } from "@/components/ui";
import type { OpportunityItem, SectionKey } from "./types";
import { AlertCircle } from "lucide-react";

// Feature flag to control UI version
// "modal" = V1/V2 (simple dialog with customization)
// "sheet" = V3 (advanced sheet with preview and editing)
const GENERATION_UI_VERSION = "sheet" as "modal" | "sheet";

const PRIORITY_ORDER: SectionKey[] = [
  "polemica",
  "educativo",
  "newsjacking",
  "futuro",
  "estudo_caso",
  "entretenimento",
  "outros",
];

export const WeeklyContext = () => {
  const [currentOffset, setCurrentOffset] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<SectionKey>>(
    new Set(["polemica"])
  );
  const [generatingOpportunity, setGeneratingOpportunity] =
    useState<OpportunityItem | null>(null);
  const { user } = useAuth();

  const { data, isLoading, isError, error, refetch } =
    useWeeklyContext(currentOffset);

  const {
    mutate: generatePost,
    isPending: isGeneratingPost,
    data: generatedPost,
    error: generateError,
    reset: resetGeneration,
  } = useGenerateFromOpportunity();

  const businessName =
    (user as any)?.creator_profile?.business_name || "Seu Negócio";

  const handleNavigate = (offset: number) => {
    setCurrentOffset(offset);
    setExpandedSections(new Set(["polemica"])); // Reset to first section expanded
  };

  const handleToggleSection = (sectionKey: SectionKey) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionKey)) {
        newSet.delete(sectionKey);
      } else {
        newSet.add(sectionKey);
      }
      return newSet;
    });
  };

  const handleCreatePost = (item: OpportunityItem) => {
    setGeneratingOpportunity(item);
    resetGeneration(); // Clear previous state
  };

  const handleGenerate = (params: Parameters<typeof generatePost>[0]) => {
    generatePost(params);
  };

  const handleCloseDialog = () => {
    setGeneratingOpportunity(null);
    resetGeneration();
  };

  if (isLoading) {
    return (
      <Container
        headerTitle="Radar Semanal de Conteúdo"
        headerDescription="Carregando oportunidades..."
      >
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container
        headerTitle="Radar Semanal de Conteúdo"
        headerDescription="Erro ao carregar"
      >
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <AlertCircle className="h-24 w-24 text-red-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Erro ao carregar oportunidades
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mb-4">
            {error instanceof Error
              ? error.message
              : "Ocorreu um erro ao buscar os dados."}
          </p>
          <Button onClick={() => refetch()}>Tentar Novamente</Button>
        </div>
      </Container>
    );
  }

  if (!data || !data.success || !data.data) {
    return (
      <Container
        headerTitle="Radar Semanal de Conteúdo"
        headerDescription="Sem dados disponíveis"
      >
        <EmptyState />
      </Container>
    );
  }

  const { data: weeklyData } = data;
  const hasOpportunities =
    weeklyData.ranked_opportunities &&
    Object.keys(weeklyData.ranked_opportunities).length > 0;

  return (
    <Container
      headerTitle="Radar Semanal de Conteúdo"
      headerDescription="Oportunidades personalizadas de conteúdo para viralizar"
    >
      <WeeklyContextHeader
        weekRange={weeklyData.week_range}
        businessName={weeklyData.business_name}
        currentOffset={currentOffset}
        hasPrevious={weeklyData.has_previous}
        hasNext={weeklyData.has_next}
        onNavigate={handleNavigate}
      />

      {!hasOpportunities ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {PRIORITY_ORDER.map((sectionKey) => {
            const section = weeklyData.ranked_opportunities[sectionKey];
            if (!section) return null;

            return (
              <OpportunitySection
                key={sectionKey}
                sectionKey={sectionKey}
                section={section}
                isExpanded={expandedSections.has(sectionKey)}
                onToggle={() => handleToggleSection(sectionKey)}
                onCreatePost={handleCreatePost}
              />
            );
          })}
        </div>
      )}

      {GENERATION_UI_VERSION === "modal" ? (
        <GeneratingPostDialog
          opportunity={generatingOpportunity}
          isGenerating={isGeneratingPost}
          generatedPost={generatedPost || null}
          error={generateError}
          onClose={handleCloseDialog}
          onGenerate={handleGenerate}
        />
      ) : (
        <GeneratingPostSheet
          opportunity={generatingOpportunity}
          isGenerating={isGeneratingPost}
          generatedPost={generatedPost || null}
          error={generateError}
          businessName={businessName}
          onClose={handleCloseDialog}
          onGenerate={handleGenerate}
        />
      )}
    </Container>
  );
};

