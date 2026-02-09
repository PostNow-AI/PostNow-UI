// @ts-nocheck
/**
 * Grid de aprovação de posts - Descoberta #1 das simulações (40-60% mais rápido que linear).
 * Permite seleção múltipla, visualização rápida e ações em massa.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";
import type { CampaignPost } from "../types";

interface PostGridViewProps {
  posts: CampaignPost[];
  onSelectPost: (postId: number) => void;
  onEditPost: (post: CampaignPost) => void;
  onPreviewPost: (post: CampaignPost) => void;
  selectedPosts: number[];
}

export const PostGridView = ({
  posts,
  onSelectPost,
  onEditPost,
  onPreviewPost,
  selectedPosts,
}: PostGridViewProps) => {
  const isSelected = (postId: number) => selectedPosts.includes(postId);

  const getStatusColor = (post: CampaignPost) => {
    if (post.is_approved) return "default";
    return "secondary";
  };

  const getStatusText = (post: CampaignPost) => {
    if (post.is_approved) return "Aprovado";
    return "Pendente";
  };

  if (!posts || posts.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">
            Nenhum post gerado ainda. Clique em "Gerar Posts" para começar.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((campaignPost) => (
        <Card
          key={campaignPost.id}
          className={`cursor-pointer transition-all hover:shadow-lg ${
            isSelected(campaignPost.id) ? "ring-2 ring-primary" : ""
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <Checkbox
                  checked={isSelected(campaignPost.id)}
                  onCheckedChange={() => onSelectPost(campaignPost.id)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Selecionar post ${campaignPost.sequence_order}`}
                />
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm flex items-center gap-2">
                    Post #{campaignPost.sequence_order}
                    <Badge variant={getStatusColor(campaignPost)} className="text-xs">
                      {getStatusText(campaignPost)}
                    </Badge>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {campaignPost.phase} • {campaignPost.scheduled_date}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Preview da imagem se houver */}
            {campaignPost.post?.ideas?.[0]?.image_url && (
              <div className="aspect-square w-full rounded-md overflow-hidden bg-muted">
                <img
                  src={campaignPost.post.ideas[0].image_url}
                  alt={`Post ${campaignPost.sequence_order}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Preview do texto */}
            <div className="text-sm text-muted-foreground line-clamp-3">
              {campaignPost.post?.ideas?.[0]?.content?.slice(0, 120) || "Sem conteúdo"}
              {(campaignPost.post?.ideas?.[0]?.content?.length || 0) > 120 && "..."}
            </div>

            {/* Ações rápidas */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreviewPost(campaignPost);
                }}
                aria-label={`Visualizar post ${campaignPost.sequence_order}`}
              >
                <Eye className="h-3 w-3 mr-1" />
                Ver
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditPost(campaignPost);
                }}
                aria-label={`Editar post ${campaignPost.sequence_order}`}
              >
                <Edit className="h-3 w-3 mr-1" />
                Editar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

