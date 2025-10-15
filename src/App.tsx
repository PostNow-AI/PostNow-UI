import { clarity } from "react-microsoft-clarity";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { ErrorBoundary, ThemeProvider, Toaster } from "./components/ui";
import { AuthProvider } from "./contexts/AuthContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import CreditCancelPage from "./pages/CreditCancelPage";
import CreditsPage from "./pages/CreditsPage";
import CreditSuccessPage from "./pages/CreditSuccessPage";
import EmailSentPage from "./pages/EmailSentPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import { GoogleCallbackPage } from "./pages/GoogleCallbackPage";
import { IdeaBankPage } from "./pages/IdeaBankPage";
import LoginPage from "./pages/LoginPage";
import PasswordResetConfirmPage from "./pages/PasswordResetConfirmPage";
import PasswordResetRequestPage from "./pages/PasswordResetRequestPage";
import { ProfilePage } from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import SubscriptionCancelPage from "./pages/SubscriptionCancelPage";
import { SubscriptionPage } from "./pages/SubscriptionPage";
import SubscriptionSuccessPage from "./pages/SubscriptionSuccessPage";

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

              {/* Credit system routes */}
              <Route path="/credits/success" element={<CreditSuccessPage />} />
              <Route path="/credits/cancel" element={<CreditCancelPage />} />

              {/* Subscription system routes */}
              <Route
                path="/subscription/success"
                element={<SubscriptionSuccessPage />}
              />
              <Route
                path="/subscription/cancel"
                element={<SubscriptionCancelPage />}
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
