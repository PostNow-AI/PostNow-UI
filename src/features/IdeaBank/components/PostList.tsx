import {
  Calendar,
  ClipboardList,
  Edit2,
  Lock,
  Plus,
  Trash2,
  Type,
} from "lucide-react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Loader,
  Skeleton,
} from "@/components/ui";
import { usePostList } from "@/features/IdeaBank/hooks";
import { useUserSubscription } from "@/features/Subscription/hooks/useSubscription";
import { PostViewDialog } from "./PostViewDialog";

export const PostList = () => {
  const { data: userSubscription } = useUserSubscription();
  const {
    posts,
    isLoading,
    error,
    selectedPost,
    isViewDialogOpen,
    handlePostClick,
    handleCloseViewDialog,
    handleDeletePost,
    isDeleting,
  } = usePostList();

  const hasActiveSubscription = userSubscription?.status === "active";

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2 mt-3">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="text-muted-foreground">
            <p>Erro ao carregar posts</p>
            <p className="text-sm mt-2">Tente novamente mais tarde</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="mt-30 flex-col items-center justify-center text-center p-4">
        <ClipboardList className="h-12 w-12 mx-auto text-primary-light mb-4" />
        <p className="text-xl font-bold mb-2">Crie seu primeiro post</p>
        <p className="text-sm text-slate-400 mb-6">
          Crie seu primeiro post para começar a gerar ideias com IA
        </p>
        <Button disabled={!hasActiveSubscription}>
          {!hasActiveSubscription && <Lock className="h-4 w-4" />}
          <Plus className="h-4 w-4" />
          Novo Post
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts?.map((post) => (
        <Card
          key={post.id}
          className={`transition-colors rounded-lg bg-background p-0 hover:bg-muted/50 relative flex flex-col h-full`}
        >
          {/* Post Image or Placeholder */}
          <div className="w-full h-full p-0 max-h-[360px] rounded-t-lg overflow-hidden bg-muted">
            {post?.ideas &&
            post.ideas.length > 0 &&
            post.ideas[0]?.image_url ? (
              <img
                src={post.ideas[0].image_url}
                alt="Post image"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-100">
                <div className="text-center text-muted-foreground">
                  <Type className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Imagem não disponível</p>
                </div>
              </div>
            )}
          </div>
          {/* Post Details */}
          <div className="flex flex-wrap gap-2 absolute top-4 right-4">
            <Badge
              variant="outline"
              className={`flex items-center gap-1 ${
                post.type_display === "Feed"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : post.type_display === "Live"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : post.type_display === "Reel"
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : post.type_display === "Post"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : post.type_display === "Carrossel"
                  ? "bg-orange-50 text-orange-700 border-orange-200"
                  : post.type_display === "Story"
                  ? "bg-pink-50 text-pink-700 border-pink-200"
                  : "bg-gray-50 text-gray-700 border-gray-200"
              }`}
            >
              {post.type_display === "Post" ? "Feed" : post.type_display}
            </Badge>
          </div>
          {post?.ideas && post.ideas.length > 0 && (
            <p className="text-sm px-4 text-muted-foreground line-clamp-8 text-ellipsis">
              {(() => {
                const content = post.ideas[post.ideas.length - 1].content;
                // Strip HTML tags
                const strippedContent = content.replace(/<[^>]*>/g, "").trim();
                return strippedContent.length > 100
                  ? `${strippedContent.substring(0, 200)}...`
                  : strippedContent;
              })()}
            </p>
          )}
          <div className="flex flex-col px-4 pb-4 mt-auto gap-4">
            <div className="text-muted-foreground flex items-center text-xs gap-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => handlePostClick(post)}
              >
                <Edit2 className="h-4 w-4" />
                Editar
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => handleDeletePost(post)}
                disabled={isDeleting}
                title="Excluir post"
              >
                {isDeleting ? (
                  <Loader />
                ) : (
                  <Trash2 className="text-destructive h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      ))}

      <PostViewDialog
        isOpen={isViewDialogOpen}
        onClose={handleCloseViewDialog}
        post={selectedPost}
      />
    </div>
  );
};
