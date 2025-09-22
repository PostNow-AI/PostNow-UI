import { clarity } from "react-microsoft-clarity";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { OnboardingWrapper } from "./components/OnboardingWrapper";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { ErrorBoundary, ThemeProvider, Toaster } from "./components/ui";
import { AuthProvider } from "./contexts/AuthContext";
import { AccountSettingsPage } from "./pages/AccountSettingsPage";
import CreditCancelPage from "./pages/CreditCancelPage";
import CreditsPage from "./pages/CreditsPage";
import CreditSuccessPage from "./pages/CreditSuccessPage";
import { GoogleCallbackPage } from "./pages/GoogleCallbackPage";
import { IdeaBankPage } from "./pages/IdeaBankPage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { PublicIdeaGenerationPage } from "./pages/PublicIdeaGenerationPage";
import { RegisterPage } from "./pages/RegisterPage";

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
                path="/public/ideas"
                element={<PublicIdeaGenerationPage />}
              />

              {/* Credit system routes */}
              <Route path="/credits/success" element={<CreditSuccessPage />} />
              <Route path="/credits/cancel" element={<CreditCancelPage />} />

              {/* Protected routes with shared layout */}
              <Route
                element={
                  <ProtectedRoute>
                    <OnboardingWrapper>
                      <DashboardLayout />
                    </OnboardingWrapper>
                  </ProtectedRoute>
                }
              >
                <Route path="/ideabank" element={<IdeaBankPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route
                  path="/account-settings"
                  element={<AccountSettingsPage />}
                />
                <Route path="/credits" element={<CreditsPage />} />
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
