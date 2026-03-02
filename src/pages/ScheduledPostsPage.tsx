/**
 * Scheduled Posts Page
 *
 * Page for managing scheduled Instagram posts.
 */

import { Container } from "@/components/ui/container";
import {
  SchedulePostDialog,
  ScheduledPostsList,
} from "@/features/InstagramScheduling";
import { useState } from "react";

export function ScheduledPostsPage() {
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  return (
    <Container
      headerTitle="Posts Agendados"
      headerDescription="Gerencie seus posts agendados para o Instagram."
    >
      <ScheduledPostsList
        onScheduleNew={() => setIsScheduleDialogOpen(true)}
      />

      <SchedulePostDialog
        open={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
      />
    </Container>
  );
}

export default ScheduledPostsPage;
