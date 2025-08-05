import {
  BusinessSection,
  ContentSection,
  ProfessionalSection,
  ResourcesSection,
  SocialSection,
} from "@/components/profile-completion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Loading,
} from "@/components/ui";
import { getSections } from "@/config/profile-sections";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { type CreatorProfile } from "@/lib/creator-profile-api";

interface ProfileCompletionProps {
  profile: CreatorProfile;
}

export const ProfileCompletion = ({ profile }: ProfileCompletionProps) => {
  const {
    form,
    handleSubmit,
    onSubmit,
    expertiseInput,
    setExpertiseInput,
    toolsInput,
    setToolsInput,
    choices,
    suggestions,
    updateMutation,
    handleAddExpertise,
    handleRemoveExpertise,
    handleAddTool,
    handleRemoveTool,
    handleToggleHour,
  } = useProfileCompletion(profile);

  const sections = getSections(profile);

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case "professional":
        return (
          <ProfessionalSection
            form={form}
            choices={choices}
            suggestions={suggestions}
            expertiseInput={expertiseInput}
            setExpertiseInput={setExpertiseInput}
            onAddExpertise={handleAddExpertise}
            onRemoveExpertise={handleRemoveExpertise}
          />
        );
      case "content":
        return <ContentSection form={form} choices={choices} />;
      case "social":
        return <SocialSection form={form} />;
      case "business":
        return <BusinessSection form={form} choices={choices} />;
      case "resources":
        return (
          <ResourcesSection
            form={form}
            suggestions={suggestions}
            toolsInput={toolsInput}
            setToolsInput={setToolsInput}
            onAddTool={handleAddTool}
            onRemoveTool={handleRemoveTool}
            onToggleHour={handleToggleHour}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Completude do Perfil</span>
            <span className="text-2xl font-bold text-primary">
              {profile.completeness_percentage}%
            </span>
          </CardTitle>
          <CardDescription>
            Quanto mais informações, melhores as sugestões personalizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${profile.completeness_percentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {34 - Math.floor((profile.completeness_percentage / 100) * 34)}{" "}
            campos restantes
          </p>
        </CardContent>
      </Card>

      {/* Sections */}
      <Accordion type="single" collapsible className="space-y-4">
        {sections.map((section) => (
          <AccordionItem
            key={section.id}
            value={section.id}
            className="border rounded-lg"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center justify-between w-full mr-4">
                <div className="text-left">
                  <div className="text-lg font-semibold">{section.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {section.description}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium">
                    {Math.round(section.completeness)}%
                  </div>
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${section.completeness}%` }}
                    />
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-6 pb-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {renderSectionContent(section.id)}

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="min-w-[120px]"
                  >
                    {updateMutation.isPending ? (
                      <Loading text="Salvando..." size="sm" />
                    ) : (
                      "Salvar Alterações"
                    )}
                  </Button>
                </div>
              </form>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
