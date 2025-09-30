import { useState } from "react";

import { PostCreationDialog } from "@/components/ideabank/PostCreationDialog";
import { PostList } from "@/components/ideabank/PostList";
import { PostViewDialog } from "@/components/ideabank/PostViewDialog";

import { type Post as PostType } from "@/lib/services/postService";

import { Button } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { useUserCredits } from "@/features/Credits/hooks/useCredits";
import { useUserSubscription } from "@/features/Subscription/hooks/useSubscription";
import { CreditCard, Lock, Plus, Sparkles } from "lucide-react";

interface IdeaData {
  id: number;
  content: string;
  content_preview: string;
  image_url?: string;
  status: string;
  status_display: string;
  ai_provider: string;
  ai_model: string;
  post_name: string;
  post_type: string;
  created_at: string;
  updated_at: string;
}

interface PostData {
  id: number;
  name: string;
  objective: string;
  objective_display: string;
  type: string;
  type_display: string;
  target_gender?: string;
  target_gender_display?: string;
  target_age?: string;
  target_location?: string;
  target_salary?: string;
  target_interests?: string;
  has_target_audience: boolean;
  ideas_count: number;
  created_at: string;
  updated_at: string;
}

export const IdeaBankPage = () => {
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isPostViewDialogOpen, setIsPostViewDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);

  const handlePostCreated = (postData: PostData, ideaData: IdeaData) => {
    // Convert PostData to PostType and add the generated idea
    const postWithIdeas: PostType = {
      ...postData,
      ideas: [
        {
          id: ideaData.id,
          content: ideaData.content,
          content_preview: ideaData.content.substring(0, 200) + "...",
          status: "draft" as const,
          status_display: "Rascunho",
          ai_provider: "gemini",
          ai_model: "gemini-1.5-flash",
          post_name: postData.name,
          post_type: postData.type,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          post_id: postData.id,
        },
      ],
    };

    // Open the PostViewDialog with the created post
    setSelectedPost(postWithIdeas);
    setIsPostViewDialogOpen(true);
  };

  const { data: userCredits } = useUserCredits();
  const { data: userSubscription, isLoading: isSubscriptionLoading } =
    useUserSubscription();
  const balance = Number(userCredits?.balance) || 0;

  // Check if user has an active subscription
  const hasActiveSubscription = userSubscription?.status === "active";

  return (
    <Container
      headerTitle={"Banco de Ideias"}
      headerDescription={"Gerencie suas ideias e posts gerados por IA  "}
      containerActions={
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground text-sm">
              {balance} créditos restantes
            </span>
          </div>
          <Button
            onClick={() =>
              hasActiveSubscription ? setIsPostDialogOpen(true) : null
            }
            className="flex items-center gap-2"
            disabled={!hasActiveSubscription || isSubscriptionLoading}
            title={
              isSubscriptionLoading
                ? "Carregando status da assinatura..."
                : !hasActiveSubscription
                ? "Você precisa de uma assinatura ativa para criar novos posts"
                : ""
            }
          >
            {!hasActiveSubscription && !isSubscriptionLoading && (
              <Lock className="h-4 w-4" />
            )}
            <Plus className="h-4 w-4" />
            Novo Post
          </Button>
        </div>
      }
    >
      {isSubscriptionLoading ? (
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
                Verificando status da sua assinatura...
              </p>
            </CardContent>
          </Card>
        </div>
      ) : hasActiveSubscription ? (
        <PostList />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
          <Card className="w-full max-w-md border-orange-200 bg-orange-50">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-orange-800 text-xl">
                Assinatura Necessária
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-orange-700">
                Para acessar o Banco de Ideias e criar posts com IA, você
                precisa de uma assinatura ativa.
              </p>

              <div className="bg-white rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Com uma assinatura você terá:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1 text-left">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Criação ilimitada de posts
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Geração de ideias com IA avançada
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Acesso a todas as funcionalidades
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Suporte prioritário
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <Button
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  onClick={() => {
                    // Navigate to subscription page - you can implement this based on your routing
                    window.location.href = "/subscription";
                  }}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Ver Planos de Assinatura
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dialogs */}
      {hasActiveSubscription && (
        <>
          <PostCreationDialog
            isOpen={isPostDialogOpen}
            onClose={() => setIsPostDialogOpen(false)}
            onSuccess={handlePostCreated}
          />

          <PostViewDialog
            isOpen={isPostViewDialogOpen}
            onClose={() => {
              setIsPostViewDialogOpen(false);
              setSelectedPost(null);
            }}
            post={selectedPost}
          />
        </>
      )}
    </Container>
  );
};
