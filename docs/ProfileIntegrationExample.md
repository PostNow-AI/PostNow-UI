# Profile Integration Example

## How to add Instagram to Profile Page

### Option 1: Add to Sidebar

```tsx
import { InstagramStatusCard } from "@/components/instagram";

export function Profile() {
  return (
    <Container headerTitle="Perfil do Criador">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <BasicUserInfo user={user} />

          {/* ADD THIS: Instagram Integration Card */}
          <InstagramStatusCard />
        </div>

        <div className="lg:col-span-2">
          <Card>
            <OnboardingReview values={profile} />
          </Card>
        </div>
      </div>
    </Container>
  );
}
```

### Option 2: Dedicated Integrations Section

```tsx
import { InstagramStatusCard } from "@/components/instagram";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export function Profile() {
  return (
    <Container headerTitle="Perfil do Criador">
      <div className="space-y-6">
        {/* Existing profile sections */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6">
            <BasicUserInfo user={user} />
          </div>
          <div className="lg:col-span-2">
            <Card>
              <OnboardingReview values={profile} />
            </Card>
          </div>
        </div>

        {/* NEW: Social Media Integrations Section */}
        <Card>
          <CardHeader>
            <CardTitle>Integrações Sociais</CardTitle>
            <CardDescription>
              Conecte suas redes sociais para acessar métricas e insights
              detalhados
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
```

## Implementation Steps

1. **Import the component:**

   ```tsx
   import { InstagramStatusCard } from "@/components/instagram";
   ```

2. **Add to your JSX** where appropriate (see examples above)

3. **The component is self-contained** and handles:
   - Connection state
   - OAuth flow
   - Sync functionality
   - Error handling

## Adding to Header/Navbar

```tsx
import { InstagramNotificationBell } from "@/components/instagram";

export function Header() {
  return (
    <header>
      <div className="flex items-center gap-2">
        <InstagramNotificationBell />
        {/* Other header items */}
      </div>
    </header>
  );
}
```

## Direct Link to Dashboard

```tsx
import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";

<Link to="/dashboard/instagram" className="nav-link">
  <Instagram className="h-4 w-4" />
  <span>Instagram Analytics</span>
</Link>;
```
