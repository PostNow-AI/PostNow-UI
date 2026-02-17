import { clarity } from "react-microsoft-clarity";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { AdminRoute } from "./components/AdminRoute";
import {
  DashboardLayout,
  ErrorBoundary,
  ProtectedRoute,
  PublicRoute,
  ThemeProvider,
  Toaster,
} from "@/components";
import {BehaviorDashboard} from "./features/BehaviorDashboard";

import { AuthProvider } from "./contexts/AuthContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { AdminDailyPosts } from "./pages/AdminDailyPosts";
import CreditsPage from "./pages/CreditsPage";
import EmailSentPage from "./pages/EmailSentPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import { GoogleCallbackPage } from "./pages/GoogleCallbackPage";
import { IdeaBankPage } from "./pages/IdeaBankPage";
import LoginPage from "./pages/LoginPage";
import PasswordResetConfirmPage from "./pages/PasswordResetConfirmPage";
import PasswordResetRequestPage from "./pages/PasswordResetRequestPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import { ProfilePage } from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import { SubscriptionPage } from "./pages/SubscriptionPage";
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
              {/* Root redirect - Onboarding 2.0 first */}
              <Route path="/" element={<Navigate to="/onboarding" replace />} />

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
              <Route path="/onboarding" element={<OnboardingPage />} />

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
                <Route path="/dashboard" element={<BehaviorDashboard/>}/>
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
                <Route path="/profile" element={<ProfilePage />} />

                <Route path="/credits" element={<CreditsPage />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
              </Route>
            </Routes>
            <Toaster />
          </AuthProvider>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
