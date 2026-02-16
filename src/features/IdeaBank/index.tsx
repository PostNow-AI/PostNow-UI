import { PostList } from "@/features/IdeaBank/components/PostList";

import { Container } from "@/components/ui/container";

export const IdeaBank = () => {
  // const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);

  // const { data: userSubscription, isLoading: isSubscriptionLoading } =
  //   useUserSubscription();

  // const hasActiveSubscription = userSubscription?.status === "active";

  // const handlePostCreated = () => {
  //   setIsPostDialogOpen(false);
  // };

  return (
    <Container
      headerTitle={"Biblioteca de posts"}
      headerDescription={
        "Gerencie todos os conteúdos de Instagram gerados por IA"
      }
      // containerActions={
      //   <div className="flex items-center gap-4">
      //     <Button
      //       onClick={() =>
      //         hasActiveSubscription ? setIsPostDialogOpen(true) : null
      //       }
      //       className="flex items-center gap-2"
      //       disabled={!hasActiveSubscription || isSubscriptionLoading}
      //       title={
      //         isSubscriptionLoading
      //           ? "Carregando..."
      //           : !hasActiveSubscription
      //             ? "Você precisa de uma assinatura ativa para criar novos posts"
      //             : ""
      //       }
      //     >
      //       {!hasActiveSubscription && !isSubscriptionLoading && (
      //         <Lock className="h-4 w-4" />
      //       )}
      //       <Plus className="h-4 w-4" />
      //       Novo Post
      //     </Button>
      //   </div>
      // }
    >
      <PostList />

      {/* {hasActiveSubscription && (
        <PostCreationDialog
          isOpen={isPostDialogOpen}
          onClose={() => setIsPostDialogOpen(false)}
          onSuccess={handlePostCreated}
        />
      )} */}
    </Container>
  );
};
