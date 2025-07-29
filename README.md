# Sonora UI - React Frontend

A modern React frontend built with TypeScript, Vite, and comprehensive authentication system.

## Features

- ✅ **Complete Authentication System**
  - Email/password login and registration
  - Google OAuth integration
  - JWT token management with cookies
  - Automatic token refresh
- ✅ **Protected Routes & Route Guards**
- ✅ **Global State Management** with React Context
- ✅ **Modern Form Handling** with react-hook-form and zod validation
- ✅ **API Integration** with Axios and TanStack Query
- ✅ **UI Components** with shadcn/ui and Tailwind CSS
- ✅ **Error Boundaries** and comprehensive error handling
- ✅ **Loading States** and user feedback with toasts

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

### Getting Google OAuth Client ID

1. Go to the [Google Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create credentials (OAuth 2.0 Client ID)
5. Add your authorized redirect URIs:
   - `http://localhost:5173/auth/google/callback` (development)
   - Your production domain when deploying

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Forms**: react-hook-form + zod
- **API**: Axios + TanStack Query
- **Routing**: React Router DOM
- **State**: React Context API
