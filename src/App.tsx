import { clarity } from "react-microsoft-clarity";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { AdminRoute } from "./components/AdminRoute";
import { DashboardLayout } from "./components/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { ErrorBoundary, ThemeProvider, Toaster } from "./components/ui";
import { AuthProvider } from "./contexts/AuthContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { AdminDailyPosts } from "./pages/AdminDailyPosts";
import CreditsPage from "./pages/CreditsPage";
import EmailSentPage from "./pages/EmailSentPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import { GoogleCallbackPage } from "./pages/GoogleCallbackPage";
import { IdeaBankPage } from "./pages/IdeaBankPage";
// import { CampaignsPage } from "./pages/CampaignsPage";
// import { CampaignCreationPage } from "./pages/CampaignCreationPage";
// import { CampaignDetailPage } from "./pages/CampaignDetailPage";
import LoginPage from "./pages/LoginPage";
import PasswordResetConfirmPage from "./pages/PasswordResetConfirmPage";
import PasswordResetRequestPage from "./pages/PasswordResetRequestPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import { ProfilePage } from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import { SubscriptionPage } from "./pages/SubscriptionPage";
// import { WeeklyContextPage } from "./pages/WeeklyContextPage";
// import CarouselListPage from "./pages/CarouselListPage";
// import CarouselCreatePage from "./pages/CarouselCreatePage";
// import CarouselManualFormPage from "./pages/CarouselManualFormPage";
// import CarouselViewPage from "./pages/CarouselViewPage";
// import CarouselWizardPage from "./pages/CarouselWizardPage";
// import CarouselGeneratingPage from "./pages/CarouselGeneratingPage";
import OnboardingPage from "./pages/OnboardingPage";

const App = () => {
  if (process.env.NODE_ENV === "production") {
    const clarityId = import.meta.env.VITE_CLARITY_ID;
    if (clarityId && typeof clarityId === "string" && clarityId.trim() !== "") {
      clarity.init(clarityId);
    } else {
      console.warn("VITE_CLARITY_ID não configurado ou inválido");
    }
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="sonora-ui-theme">
      <ErrorBoundary>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Root redirect */}
              <Route path="/" element={<Navigate to="/ideabank" replace />} />

              {/* Public routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/auth/google/callback"
                element={<GoogleCallbackPage />}
              />
              <Route
                path="/verify-email"
                element={
                  <PublicRoute>
                    <EmailVerificationPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/email-sent"
                element={
                  <PublicRoute>
                    <EmailSentPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <PublicRoute>
                    <PasswordResetRequestPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <PublicRoute>
                    <PasswordResetConfirmPage />
                  </PublicRoute>
                }
              />

              {/* Public Onboarding - Mobile-First Flow */}
              <Route
                path="/onboarding"
                element={<OnboardingPage />}
              />

              {/* ADMIN ROUTES */}
              <Route
                element={
                  <AdminRoute>
                    <OnboardingProvider>
                      <DashboardLayout />
                    </OnboardingProvider>
                  </AdminRoute>
                }
              >
                <Route
                  path="/admin/daily-posts"
                  element={<AdminDailyPosts />}
                />
              </Route>

              {/* Subscription system routes */}
              <Route
                path="/subscription/success"
                element={<PaymentSuccessPage />}
              />
              <Route
                path="/subscription/cancel"
                element={<PaymentCancelPage />}
              />

              {/* Protected routes with shared layout */}
              <Route
                element={
                  <ProtectedRoute>
                    <OnboardingProvider>
                      <DashboardLayout />
                    </OnboardingProvider>
                  </ProtectedRoute>
                }
              >
                <Route path="/ideabank" element={<IdeaBankPage />} />
                {/* <Route path="/campaigns" element={<CampaignsPage />} /> */}
                {/* <Route path="/campaigns/:id" element={<CampaignDetailPage />} /> */}
                <Route path="/profile" element={<ProfilePage />} />
                {/* <Route path="/weekly-context" element={<WeeklyContextPage />} /> */}

                <Route path="/credits" element={<CreditsPage />} />
                <Route path="/subscription" element={<SubscriptionPage />} />

                {/* Carousel routes - DISABLED */}
                {/* <Route path="/carousel" element={<CarouselListPage />} /> */}
                {/* <Route path="/carousel/create" element={<CarouselCreatePage />} /> */}
                {/* <Route path="/carousel/create/manual" element={<CarouselManualFormPage />} /> */}
                {/* <Route path="/carousel/wizard" element={<CarouselWizardPage />} /> */}
                {/* <Route path="/carousel/generating/:sessionId" element={<CarouselGeneratingPage />} /> */}
                {/* <Route path="/carousel/:id" element={<CarouselViewPage />} /> */}
              </Route>

              {/* Campaign creation - Full page (not in DashboardLayout) - DISABLED */}
              {/* <Route
                path="/campaigns/new"
                element={
                  <ProtectedRoute>
                    <CampaignCreationPage />
                  </ProtectedRoute>
                }
              /> */}
            </Routes>
            <Toaster />
          </AuthProvider>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
