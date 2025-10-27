import { useState } from "react";

import { PostCreationDialog } from "@/features/IdeaBank/components/PostCreationDialog";
import { PostList } from "@/features/IdeaBank/components/PostList";

import { Button } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { useUserSubscription } from "@/features/Subscription/hooks/useSubscription";
import { Lock, Plus } from "lucide-react";
import { NoSubscriptionDialog } from "./components/NoSubscriptionDialog";
import { usePostList } from "./hooks";

export const IdeaBank = () => {
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);

  const { data: userSubscription, isLoading: isSubscriptionLoading } =
    useUserSubscription();

  const { isLoading: isPostsLoading } = usePostList();

  const hasActiveSubscription = userSubscription?.status === "active";

  const handlePostCreated = () => {
    // The PostList component will handle showing the view dialog internally
    setIsPostDialogOpen(false);
  };

  const isLoading = isPostsLoading || isSubscriptionLoading;

  return (
    <Container
      headerTitle={"Biblioteca de posts"}
      headerDescription={
        "Gerencie todos os conteúdos de Instagram gerados por IA"
      }
      containerActions={
        <div className="flex items-center gap-4">
          <Button
            onClick={() =>
              hasActiveSubscription ? setIsPostDialogOpen(true) : null
            }
            className="flex items-center gap-2"
            disabled={!hasActiveSubscription || isLoading}
            title={
              isLoading
                ? "Carregando..."
                : !hasActiveSubscription
                ? "Você precisa de uma assinatura ativa para criar novos posts"
                : ""
            }
          >
            {!hasActiveSubscription && !isLoading && (
              <Lock className="h-4 w-4" />
            )}
            <Plus className="h-4 w-4" />
            Novo Post
          </Button>
        </div>
      }
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">Carregando...</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
              <p className="text-muted-foreground text-sm">
                Carregando posts...
              </p>
            </CardContent>
          </Card>
        </div>
      ) : hasActiveSubscription ? (
        <PostList />
      ) : (
        <NoSubscriptionDialog />
      )}

      {hasActiveSubscription && (
        <PostCreationDialog
          isOpen={isPostDialogOpen}
          onClose={() => setIsPostDialogOpen(false)}
          onSuccess={handlePostCreated}
        />
      )}
    </Container>
  );
};
