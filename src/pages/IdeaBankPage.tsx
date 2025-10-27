import { useState } from "react";

import { PostCreationDialog } from "@/components/ideabank/PostCreationDialog";
import { PostList } from "@/components/ideabank/PostList";
import { PostViewDialog } from "@/components/ideabank/PostViewDialog";

import { type Post as PostType } from "@/lib/services/postService";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  Loader,
} from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
  useCreateCheckoutSession,
  useUserSubscription,
} from "@/features/Subscription/hooks/useSubscription";
import { formatToBRL } from "@/utils";
import { CreditCard, Lock, Plus, Wallet } from "lucide-react";

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

  const { data: userSubscription, isLoading: isSubscriptionLoading } =
    useUserSubscription();

  // Check if user has an active subscription
  const hasActiveSubscription = userSubscription?.status === "active";

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
        <PostList setIsPostDialogOpen={setIsPostDialogOpen} />
      ) : (
        <NoSubscriptionDialog />
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

export const NoSubscriptionDialog = () => {
  const createCheckout = useCreateCheckoutSession();

  const handleSubscribe = async () => {
    try {
      await createCheckout.mutateAsync({
        plan_id: 12,
        upgrade: false,
      });
    } catch {
      // Handle error
    }
  };
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary-light" />
            <CardTitle className="text-xl font-semibold">
              Assinatura necessária
            </CardTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-slate-400 text-sm text-left">
            Para criar posts com IA e receber ideias diárias no seu e-mail você
            precisa de uma assinatura ativa.
          </p>

          <div className="bg-slate-700 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-sm text-primary-light flex items-center gap-2">
              O que está incluso?
            </h4>
            <ul className="text-sm text-white space-y-1 text-left">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                30 ideias no seu email, por mês
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                30 gerações manuais de post com IA, por mês
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                Apenas R$ 10 até dia 25 de Dezembro
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />7 dias de
                teste gratúito
              </li>
            </ul>
          </div>

          <Button className="w-full" onClick={() => handleSubscribe()}>
            {!createCheckout.isPending ? (
              <>
                <CreditCard /> Comprar agora por {formatToBRL(10)}
              </>
            ) : (
              <>
                <Loader /> Processando...
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
