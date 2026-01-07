import { ClipboardList, Lock, Plus } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
} from "@/components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { postTabs } from "@/features/IdeaBank/constants";
import { usePostList } from "@/features/IdeaBank/hooks";
import { useUserSubscription } from "@/features/Subscription/hooks/useSubscription";
import { PostItem } from "./PostItem";
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
    selectedTab,
    setSelectedTab,
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
    <>
      <Tabs
        defaultValue={selectedTab}
        onValueChange={(value) => setSelectedTab(value)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          {postTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center space-x-2"
            >
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={"feed"} className="mt-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                handlePostClick={handlePostClick}
                handleDeletePost={handleDeletePost}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        </TabsContent>{" "}
        <TabsContent value={"story"} className="mt-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                handlePostClick={handlePostClick}
                handleDeletePost={handleDeletePost}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        </TabsContent>{" "}
        <TabsContent value={"reels"} className="mt-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                handlePostClick={handlePostClick}
                handleDeletePost={handleDeletePost}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      <PostViewDialog
        isOpen={isViewDialogOpen}
        onClose={handleCloseViewDialog}
        post={selectedPost}
      />
    </>
  );
};
