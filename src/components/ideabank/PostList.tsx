import { Calendar, Download, Edit2, Trash2, Type, Users } from "lucide-react";
import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Loader,
  Skeleton,
} from "@/components/ui";
import { usePosts } from "@/hooks/usePosts";
import { type Post, postService } from "@/lib/services/postService";
import { PostViewDialog } from "./PostViewDialog";

export const PostList = () => {
  const { data: posts, isLoading, error, refetch } = usePosts();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false);
    setSelectedPost(null);
  };

  const handleDownloadImage = async (post: Post) => {
    if (!post?.ideas || post.ideas.length === 0 || !post.ideas[0]?.image_url) {
      return;
    }

    try {
      const response = await fetch(post.ideas[0].image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `post-${post.id}-image.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const handleDeletePost = async (post: Post) => {
    if (
      !confirm(
        `Tem certeza que deseja excluir o post "${
          post.name || `Post ${post.id}`
        }"?`
      )
    ) {
      return;
    }

    setDeletingPostId(post.id);
    try {
      await postService.deletePost(post.id);
      await refetch(); // Refresh the posts list
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Erro ao excluir o post. Tente novamente.");
    } finally {
      setDeletingPostId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
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
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="text-muted-foreground">
            <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Nenhum post encontrado</p>
            <p className="text-sm">
              Crie seu primeiro post para começar a gerar ideias com IA
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Card
          key={post.id}
          className={`transition-colors rounded-lg p-0 hover:bg-muted/50 relative flex flex-col h-full`}
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
              {post.type_display}
            </Badge>
          </div>
          {post?.ideas && post.ideas.length > 0 && (
            <p className="text-sm px-4 text-muted-foreground line-clamp-8 text-ellipsis">
              {post.ideas[post.ideas.length - 1].content.length > 100
                ? `${post.ideas[post.ideas.length - 1].content.substring(
                    0,
                    200
                  )}...`
                : post.ideas[post.ideas.length - 1].content}
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
              <Users className="h-4 w-4" />
              {post.has_target_audience ? (
                <div className="flex items-center gap-1 ">
                  <span className="line-clamp-1 text-ellipsis">
                    {post?.target_age + " anos"}, {post?.target_gender}
                    {post?.target_interests
                      ? ", " + post?.target_interests
                      : ""}
                  </span>
                </div>
              ) : (
                ""
              )}
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
                className="w-[52px]"
                disabled={
                  !post?.ideas ||
                  post.ideas.length === 0 ||
                  !post.ideas[0]?.image_url
                }
                onClick={() => handleDownloadImage(post)}
                title={
                  post?.ideas &&
                  post.ideas.length > 0 &&
                  post.ideas[0]?.image_url
                    ? "Download da imagem"
                    : "Nenhuma imagem disponível"
                }
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleDeletePost(post)}
                disabled={deletingPostId === post.id}
                title="Excluir post"
              >
                {deletingPostId === post.id ? (
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
