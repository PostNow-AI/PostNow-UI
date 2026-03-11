import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/**
 * Placeholder page for /create route.
 * Will be replaced by the full CreateFromOpportunity wizard (PR #36).
 */
export function CreateFromOpportunityPage() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const topic = searchParams.get("topic") || "";
  const category = searchParams.get("category") || "";
  const score = searchParams.get("score") || "";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-bold text-foreground mb-4">
        Criar Post
      </h1>
      <p className="text-muted-foreground mb-6">
        Autenticado como <span className="font-medium">{user?.email}</span>
      </p>
      {topic && (
        <div className="w-full max-w-md space-y-2 text-sm">
          <div className="p-4 bg-muted rounded-lg">
            <p><span className="font-medium">Tópico:</span> {topic}</p>
            <p><span className="font-medium">Categoria:</span> {category}</p>
            <p><span className="font-medium">Score:</span> {score}</p>
          </div>
          <p className="text-muted-foreground text-center text-xs">
            Wizard completo será integrado via PR #36
          </p>
        </div>
      )}
    </div>
  );
}
