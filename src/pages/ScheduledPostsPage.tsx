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
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Posts Agendados</h1>
          <p className="text-muted-foreground">
            Gerencie seus posts agendados para o Instagram.
          </p>
        </div>

        {/* Posts List */}
        <ScheduledPostsList
          onScheduleNew={() => setIsScheduleDialogOpen(true)}
        />

        {/* Schedule Dialog */}
        <SchedulePostDialog
          open={isScheduleDialogOpen}
          onOpenChange={setIsScheduleDialogOpen}
        />
      </div>
    </Container>
  );
}

export default ScheduledPostsPage;
