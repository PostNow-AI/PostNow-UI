import { Type } from "lucide-react";

import { Card, CardContent, Label } from "@/components/ui";
import { Container } from "@/components/ui/container";
import { DatePicker } from "@/components/ui/DatePicker";
import { useState } from "react";
import { AllPostsList } from "./components/AllPostsList";
import { Loading } from "./components/Loading";
import { useDailyPosts } from "./hooks/useDailyPosts";

export const AllDailyPosts = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const {
    data: dailyPostsData,
    isLoading,
    error,
  } = useDailyPosts(
    date
      ? date.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center p-6">
          <div className="text-muted-foreground">
            <p>Erro ao carregar posts diários</p>
            <p className="text-sm mt-2">Tente novamente mais tarde</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (
    !dailyPostsData ||
    !dailyPostsData.users_with_posts ||
    dailyPostsData.users_with_posts.length === 0
  ) {
    return (
      <div className="mt-30 flex-col items-center justify-center text-center p-4">
        <Type className="h-12 w-12 mx-auto text-primary-light mb-4" />
        <p className="text-xl font-bold mb-2">Nenhum post diário encontrado</p>
        <p className="text-sm text-slate-400 mb-6">Não há posts gerados hoje</p>
      </div>
    );
  }

  const header = () => {
    return (
      <div>
        <p className="text-sm text-muted-foreground">
          Total: {dailyPostsData.users_with_posts.length} posts
        </p>
        <p className="text-sm text-muted-foreground">
          Usuários: {dailyPostsData.user_amount} usuários
        </p>
        <p className="text-sm text-muted-foreground">
          Expectativa de posts automáticos gerados:{" "}
          {dailyPostsData.automatic_expected_posts_amount} posts
        </p>
        <p className="text-sm text-muted-foreground">
          Qtde. real de posts automáticos gerados:{" "}
          {dailyPostsData.actual_automatic_posts_amount} posts
        </p>
      </div>
    );
  };

  return (
    <Container
      headerTitle={"Posts Diários - " + date?.toLocaleDateString("pt-BR")}
      headerDescription={header()}
    >
      <div>
        <div className="w-100 space-y-2">
          <Label>Selecione a data para filtrar os posts</Label>
          <DatePicker date={date} setDate={setDate} />
        </div>
        <AllPostsList dailyPostsData={dailyPostsData} />
      </div>
    </Container>
  );
};
