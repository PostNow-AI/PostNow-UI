# Instagram Integration - Frontend Setup Guide

## Overview

This guide covers the complete frontend setup for the Instagram Graph API integration in PostNow.

## ✅ Installation Complete

All frontend components have been successfully installed:

### Files Created

#### 1. Type Definitions

- `/src/types/instagram.ts` - TypeScript interfaces for all Instagram data
- `/src/types/index.ts` - Updated with Instagram exports

#### 2. Services

- `/src/services/instagramService.ts` - API communication layer

#### 3. Hooks

- `/src/hooks/useInstagramConnection.ts` - Connection state management
- `/src/hooks/useInstagramMetrics.ts` - Metrics data fetching
- `/src/hooks/useInstagramNotifications.ts` - Notifications management
- `/src/hooks/useWindowSize.ts` - Utility hook for confetti animation

#### 4. Components

- `/src/components/instagram/InstagramConnectionWizard.tsx` - 4-step onboarding modal
- `/src/components/instagram/InstagramStatusCard.tsx` - Status widget with sync button
- `/src/components/instagram/InstagramDashboard.tsx` - Full dashboard with charts
- `/src/components/instagram/InstagramNotificationBell.tsx` - Notification popover
- `/src/components/instagram/index.ts` - Component exports

#### 5. Pages

- `/src/pages/InstagramCallback.tsx` - OAuth callback handler
- `/src/pages/InstagramDashboardPage.tsx` - Dashboard page wrapper

#### 6. Routing

- `/src/App.tsx` - Updated with Instagram routes

## 📦 Dependencies Installed

- ✅ `recharts@3.6.0` - Already installed (for charts)
- ✅ `react-confetti` - Installed (for success animation)

## 🔧 Configuration Required

### Backend Environment Variables

Already configured in `/PostNow-REST-API/.env.example`:

```bash
# Instagram Graph API Configuration
INSTAGRAM_APP_ID=your_facebook_app_id
INSTAGRAM_APP_SECRET=your_facebook_app_secret
INSTAGRAM_REDIRECT_URI=http://localhost:3000/auth/instagram/callback
INSTAGRAM_TOKEN_ENCRYPTION_KEY=your_32_byte_fernet_key
```

### Frontend Environment Variables

Already in `/PostNow-UI/.env.example`:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

**Action Required:**

1. Copy `.env.example` to `.env` in both projects
2. Fill in the Instagram credentials from Meta for Developers
3. Generate encryption key: `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"`

## 🌐 Meta for Developers Setup

### 1. Create Facebook App

1. Go to [Meta for Developers](https://developers.facebook.com)
2. Create new app → **Business** type
3. Add product: **Instagram Basic Display** (for personal accounts) or **Instagram Graph API** (for Business accounts)

### 2. Configure OAuth Redirect URIs

Add these URLs in your app settings:

```
Development:
http://localhost:3000/auth/instagram/callback

Production:
https://yourdomain.com/auth/instagram/callback
```

### 3. Required Permissions

Request these permissions during App Review:

- `instagram_basic` - Basic profile info
- `instagram_manage_insights` - Access to insights and metrics
- `pages_read_engagement` - Read engagement data
- `pages_show_list` - List pages

### 4. Get App Credentials

- App ID: Found in App Dashboard → Settings → Basic
- App Secret: Same location (keep this secret!)

## 🚀 Routes Added

The following routes have been added to the application:

### Public Route

- `/auth/instagram/callback` - OAuth callback handler (redirected from Instagram)

### Protected Routes (requires authentication)

- `/dashboard/instagram` - Full Instagram dashboard with metrics

## 📱 Integration Points

### 1. Add to Navigation/Sidebar

Add a link to the Instagram dashboard in your navigation:

```tsx
import { Instagram } from "lucide-react";

<NavLink to="/dashboard/instagram">
  <Instagram className="h-4 w-4" />
  Instagram Analytics
</NavLink>;
```

### 2. Add to Settings Page

Import and use the status card in your settings:

```tsx
import { InstagramStatusCard } from "@/components/instagram";

// In your Settings component:
<section>
  <h2>Integrações Sociais</h2>
  <InstagramStatusCard />
</section>;
```

### 3. Add Notification Bell to Header

Import and add to your header/navbar:

```tsx
import { InstagramNotificationBell } from "@/components/instagram";

// In your Header component:
<div className="flex items-center gap-2">
  <InstagramNotificationBell />
  {/* Other header items */}
</div>;
```

### 4. Add Dashboard Widget (Optional)

You can show Instagram stats on your main dashboard:

```tsx
import { useInstagramConnection, useInstagramMetrics } from "@/hooks";
import { Card } from "@/components/ui/card";

function DashboardWidget() {
  const { isConnected } = useInstagramConnection();
  const { insights } = useInstagramMetrics({ days: 7 });

  if (!isConnected) return null;

  return (
    <Card>
      <h3>Instagram - Últimos 7 dias</h3>
      <p>Seguidores: {insights?.totalFollowers}</p>
      <p>Engajamento: {insights?.avgEngagementRate.toFixed(1)}%</p>
    </Card>
  );
}
```

## 🧪 Testing Flow

### 1. Start Development Servers

```bash
# Terminal 1 - Backend
cd PostNow-REST-API
source venv/bin/activate
python manage.py runserver

# Terminal 2 - Frontend
cd PostNow-UI
npm run dev
```

### 2. Test Connection Flow

1. Navigate to Settings or `/dashboard/instagram`
2. Click "Conectar Instagram"
3. Complete the 4-step wizard
4. Click "Conectar Instagram" button
5. You'll be redirected to Instagram OAuth
6. Authorize the app
7. You'll be redirected back to `/auth/instagram/callback`
8. Success screen with confetti animation
9. Auto-redirect to `/dashboard/instagram`

### 3. Test Sync

1. Go to Instagram dashboard
2. Click "Sincronizar" button
3. Wait for metrics to load
4. Check charts and stats

### 4. Test Notifications

1. Click the bell icon in header
2. View notifications
3. Mark as read

## 🎨 UI Components Used

The integration uses shadcn/ui components already in your project:

- `Dialog` - For the connection wizard
- `Card` - For dashboard cards and stats
- `Button` - For actions
- `Badge` - For status indicators
- `Alert` - For errors and warnings
- `Popover` - For notification dropdown
- `Tabs` - For dashboard sections
- `ScrollArea` - For notification list

## 📊 Features

### Connection Wizard

- ✅ 4-step guided onboarding
- ✅ Benefits explanation
- ✅ Requirements check
- ✅ Authorization flow
- ✅ Success celebration with confetti

### Status Card

- ✅ Connection status indicator
- ✅ Account info with profile picture
- ✅ Token expiration warnings
- ✅ Manual sync button (15-min cooldown)
- ✅ Reconnect option
- ✅ Disconnect functionality

### Dashboard

- ✅ Overview stats (followers, impressions, reach, engagement)
- ✅ Interactive charts with Recharts
- ✅ Multiple tabs (Overview, Engagement, Growth)
- ✅ Date range filters (7, 30, 90 days)
- ✅ Follower growth tracking
- ✅ Engagement rate analysis

### Notifications

- ✅ Real-time notification bell with badge
- ✅ Unread count indicator
- ✅ Notification types: first connection, token expiring, sync errors, daily reports
- ✅ Mark as read functionality
- ✅ Portuguese date formatting

## 🔒 Security

- ✅ OAuth state token CSRF protection
- ✅ Tokens encrypted with Fernet (backend)
- ✅ JWT authentication required for all API calls
- ✅ 15-minute cooldown between manual syncs (rate limiting)
- ✅ Auto-refresh tokens before expiration

## 📚 Next Steps

1. **Setup Meta for Developers App**
   - Follow `docs/INSTAGRAM_INTEGRATION_SETUP.md` in backend

2. **Configure Environment Variables**
   - Add Instagram credentials to `.env` files

3. **Add to Navigation**
   - Integrate components into your existing UI

4. **Test End-to-End**
   - Complete the full OAuth flow
   - Verify metrics are syncing

5. **Deploy to Production**
   - Update redirect URIs for production domain
   - Submit app for Facebook/Instagram review
   - Enable production mode

## 🆘 Troubleshooting

### "Instagram account not connected"

- Ensure OAuth callback completed successfully
- Check browser console for errors
- Verify backend is running and accessible

### "Invalid state token"

- State tokens expire after 10 minutes
- Try the connection flow again
- Check that cookies are enabled

### "Account type must be Business or Creator"

- Convert Instagram account to Business/Creator
- Follow guide in `docs/INSTAGRAM_USER_FAQ.md`

### Metrics not loading

- Check if sync was successful (15-min cooldown)
- Verify Instagram API permissions in Meta for Developers
- Check backend logs for API errors

### Charts not rendering

- Verify `recharts` is installed: `npm list recharts`
- Check browser console for errors
- Ensure metrics data exists (at least 1 day of data)

## 📖 Documentation

For more details, see:

- **Backend Setup:** `docs/INSTAGRAM_INTEGRATION_SETUP.md`
- **User FAQ:** `docs/INSTAGRAM_USER_FAQ.md`
- **Backend README:** `SocialMediaIntegration/README.md`

## ✨ Congratulations!

Your Instagram integration frontend is complete and ready to use! 🎉
