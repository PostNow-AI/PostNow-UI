import { useState } from "react";

import { PostCreationDialog } from "@/components/ideabank/PostCreationDialog";
import { PostList } from "@/components/ideabank/PostList";
import { PostViewDialog } from "@/components/ideabank/PostViewDialog";

import { type Post as PostType } from "@/lib/services/postService";

import { Button } from "@/components/ui";
import { Container } from "@/components/ui/container";
import { useUserCredits } from "@/features/Credits/hooks/useCredits";
import { Plus, Sparkles } from "lucide-react";

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
  const balance = Number(userCredits?.balance) || 0;

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
            onClick={() => setIsPostDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Post
          </Button>
        </div>
      }
    >
      <PostList />

      {/* Dialogs */}
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
    </Container>
  );
};
