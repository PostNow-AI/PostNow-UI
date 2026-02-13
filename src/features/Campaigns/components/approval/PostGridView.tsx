// @ts-nocheck
/**
 * Grid de aprovação de posts com checkboxes.
 * Feature crítica descoberta nas 25 simulações.
 */

import { useState } from "react";
import { Button, Checkbox, Card, CardContent, Badge, Progress } from "@/components/ui";
import { Eye, Edit2, RefreshCw, Trash2, CheckCircle2 } from "lucide-react";
import type { CampaignPost } from "../../types";

interface PostGridViewProps {
  posts: CampaignPost[];
  onApprove: (postIds: number[]) => void;
  onEdit: (post: CampaignPost) => void;
  onRegenerate: (post: CampaignPost) => void;
  onDelete: (post: CampaignPost) => void;
  onViewDetails: (post: CampaignPost) => void;
}

export const PostGridView = ({
  posts,
  onApprove,
  onEdit,
  onRegenerate,
  onDelete,
  onViewDetails,
}: PostGridViewProps) => {
  const [selectedPosts, setSelectedPosts] = useState<Set<number>>(new Set());

  const approvedCount = posts.filter((p) => p.is_approved).length;
  const progressPercent = (approvedCount / posts.length) * 100;

  const handleSelectPost = (postId: number, checked: boolean) => {
    const newSet = new Set(selectedPosts);
    if (checked) {
      newSet.add(postId);
    } else {
      newSet.delete(postId);
    }
    setSelectedPosts(newSet);
  };

  const handleSelectAll = () => {
    const unapprovedPosts = posts.filter((p) => !p.is_approved);
    const allIds = new Set(unapprovedPosts.map((p) => p.id));
    setSelectedPosts(allIds);
  };

  const handleApproveBulk = () => {
    if (selectedPosts.size > 0) {
      onApprove(Array.from(selectedPosts));
      setSelectedPosts(new Set());
    }
  };

  const getDayOfWeek = (date: string) => {
    const days = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
    return days[new Date(date).getDay()];
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Progresso: {approvedCount}/{posts.length} aprovados
          </span>
          <span className="font-medium">{Math.round(progressPercent)}%</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Bulk Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          onClick={handleSelectAll}
          variant="outline"
          size="sm"
        >
          Selecionar Todos
        </Button>
        
        <Button
          onClick={handleApproveBulk}
          disabled={selectedPosts.size === 0}
          size="sm"
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Aprovar Selecionados ({selectedPosts.size})
        </Button>
        
        <Button
          onClick={() => onApprove(posts.filter((p) => !p.is_approved).map((p) => p.id))}
          variant="default"
          size="sm"
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Aprovar Todos
        </Button>
      </div>

      {/* Grid de Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Card
            key={post.id}
            className={`relative ${post.is_approved ? "border-green-500" : ""}`}
          >
            {post.is_approved && (
              <div className="absolute top-2 right-2">
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Aprovado
                </Badge>
              </div>
            )}
            
            <CardHeader className="pb-3">
              <div className="flex items-start gap-2">
                {!post.is_approved && (
                  <Checkbox
                    checked={selectedPosts.has(post.id)}
                    onCheckedChange={(checked) =>
                      handleSelectPost(post.id, checked as boolean)
                    }
                  />
                )}
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">
                      {getDayOfWeek(post.scheduled_date)} {new Date(post.scheduled_date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {post.scheduled_time}
                    </span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Post {post.sequence_order} • {post.phase_display}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Thumbnail da imagem */}
              {post.post.ideas && post.post.ideas[0]?.image_url && (
                <div className="aspect-square w-full overflow-hidden rounded-md bg-muted">
                  <img
                    src={post.post.ideas[0].image_url}
                    alt={`Post ${post.sequence_order}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Preview do texto */}
              {post.post.ideas && post.post.ideas[0]?.content && (
                <p className="text-sm line-clamp-3">
                  {post.post.ideas[0].content}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary">{post.visual_style}</Badge>
                <Badge variant="outline">{post.post.type}</Badge>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-1 pt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewDetails(post)}
                  title="Ver completo"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(post)}
                  title="Editar"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRegenerate(post)}
                  title="Regenerar"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(post)}
                  title="Remover"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

