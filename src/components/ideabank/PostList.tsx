import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Eye, Target, Type } from "lucide-react";
import { useState } from "react";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@/components/ui";
import { usePosts } from "@/hooks/usePosts";
import { type Post } from "@/lib/services/postService";
import { PostViewDialog } from "./PostViewDialog";

interface PostListProps {
  onPostSelect?: (post: Post) => void;
}

export const PostList = ({ onPostSelect }: PostListProps) => {
  const { data: posts, isLoading, error } = usePosts();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false);
    setSelectedPost(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
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

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch {
      return "Data inválida";
    }
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card
          key={post.id}
          className={`transition-colors hover:bg-muted/50 ${
            onPostSelect ? "cursor-pointer" : ""
          }`}
          onClick={() => handlePostClick(post)}
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg">{post.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <CalendarDays className="h-4 w-4" />
                  Criado {formatDate(post.created_at)}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                {post.ideas_count} {post.ideas_count === 1 ? "ideia" : "ideias"}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Post Details */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                {post.objective_display}
              </Badge>

              <Badge variant="outline" className="flex items-center gap-1">
                <Type className="h-3 w-3" />
                {post.type_display}
              </Badge>

              {post.has_target_audience && (
                <Badge variant="default" className="bg-primary/10 text-primary">
                  Público-alvo definido
                </Badge>
              )}
            </div>

            {/* Target Audience Summary */}
            {post.has_target_audience && (
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm font-medium mb-2">Público-alvo:</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  {post.target_gender_display && (
                    <div>• Gênero: {post.target_gender_display}</div>
                  )}
                  {post.target_age && <div>• Idade: {post.target_age}</div>}
                  {post.target_location && (
                    <div>• Local: {post.target_location}</div>
                  )}
                  {post.target_salary && (
                    <div>• Renda: {post.target_salary}</div>
                  )}
                  {post.target_interests && (
                    <div>• Interesses: {post.target_interests}</div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
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
