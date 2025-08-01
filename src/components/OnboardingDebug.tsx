import { Button } from "@/components/ui";
import { useOnboardingFlow } from "@/hooks/useOnboardingFlow";
import { creatorProfileApi } from "@/lib/creator-profile-api";
import { useQuery } from "@tanstack/react-query";

export const OnboardingDebug = () => {
  const { currentStage, resetOptionalOnboarding, status } = useOnboardingFlow();

  // Check API suggestions
  const { data: suggestions } = useQuery({
    queryKey: ["profile-suggestions"],
    queryFn: creatorProfileApi.getSuggestions,
  });

  // Force localStorage clear for testing
  const forceResetAll = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 text-sm max-w-xs">
      <div className="font-bold mb-2">🚧 Debug Onboarding</div>
      <div>
        Stage: <strong>{currentStage}</strong>
      </div>
      <div>
        Onboarding Complete:{" "}
        <strong>{status?.onboarding_completed ? "Yes" : "No"}</strong>
      </div>
      <div>
        Completeness: <strong>{status?.completeness_percentage}%</strong>
      </div>

      {/* API Debug */}
      <div className="mt-2 pt-2 border-t border-white/20">
        <div className="text-xs opacity-75 mb-1">API Suggestions:</div>
        <div className="text-xs">
          Preferred Hours:{" "}
          <strong>{suggestions?.preferred_hours?.length || 0}</strong>
        </div>
        <div className="text-xs">
          Tools: <strong>{suggestions?.tools?.length || 0}</strong>
        </div>
        <div className="text-xs">
          Expertise:{" "}
          <strong>{suggestions?.expertise_areas?.length || 0}</strong>
        </div>
      </div>

      <div className="mt-2 space-y-1">
        <Button
          size="sm"
          variant="outline"
          className="text-white border-white hover:bg-white hover:text-red-500 w-full text-xs"
          onClick={resetOptionalOnboarding}
        >
          Reset Optional
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-white border-white hover:bg-white hover:text-red-500 w-full text-xs"
          onClick={forceResetAll}
        >
          🚨 Reset All
        </Button>
      </div>
      <div className="text-xs mt-2 opacity-75">
        localStorage:{" "}
        {localStorage.getItem("optional_onboarding_completed") || "none"}
      </div>
    </div>
  );
};
