# Profile Integration Example

## How to add Instagram to Profile Page

Add this section to your Profile component to integrate Instagram functionality.

### Option 1: Add to Sidebar

return (
<Container
      headerTitle="Perfil do Criador"
      headerDescription="Gerencie suas informações pessoais e preferências de conteúdo"
    >

<div className="grid gap-6 lg:grid-cols-3">
{/_ Left Column - User Info _/}
<div className="space-y-6">
<BasicUserInfo user={user} />

          {/* ADD THIS: Instagram Integration Card */}
          <InstagramStatusCard />
        </div>

        {/* Right Column - Onboarding Data */}
        <div className="lg:col-span-2">
          <Card>
            <OnboardingReview
              title="Informações de negócio"
              description="Os dados de seu negócio ajudam a personalizar sua experiência na plataforma"
              values={profile}
              onEdit={resetOnboardingForEditMutation.mutate}
              onLoading={resetOnboardingForEditMutation.isPending}
            />
          </Card>
        </div>
      </div>
    </Container>

);
}

// OR create a dedicated "Integrations" section:

export function ProfileWithIntegrationsSection() {
return (
<Container
      headerTitle="Perfil do Criador"
      headerDescription="Gerencie suas informações pessoais e preferências de conteúdo"
    >

<div className="space-y-6">
{/_ Existing profile sections _/}
<div className="grid gap-6 lg:grid-cols-3">
<div className="space-y-6">
<BasicUserInfo user={user} />
</div>
<div className="lg:col-span-2">
<Card>
<OnboardingReview
                title="Informações de negócio"
                description="Os dados de seu negócio ajudam a personalizar sua experiência na plataforma"
                values={profile}
                onEdit={resetOnboardingForEditMutation.mutate}
                onLoading={resetOnboardingForEditMutation.isPending}
              />
</Card>
</div>
</div>

        {/* NEW: Social Media Integrations Section */}
        <Card>
          <CardHeader>
            <CardTitle>Integrações Sociais</CardTitle>
            <CardDescription>
              Conecte suas redes sociais para acessar métricas e insights detalhados
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <InstagramStatusCard />
            {/* Future integrations: TikTok, Twitter, etc. */}
          </CardContent>
        </Card>
      </div>
    </Container>

);
}

/\*\*

- To implement in your Profile component:
-
- 1.  Import the component:
- import { InstagramStatusCard } from '@/components/instagram';
-
- 2.  Add to your JSX where appropriate (see examples above)
-
- 3.  The component is self-contained and handles:
- - Connection state
- - OAuth flow
- - Sync functionality
- - Error handling
    \*/
