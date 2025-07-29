import { Button } from "@/components/ui/button";
import { LoadingPage } from "@/components/ui/loading";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isLoading) {
    return <LoadingPage text="Loading..." />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Welcome to Sonora
        </h1>
        {user && (
          <p className="text-gray-600 text-center mb-6">
            Hello, {user.first_name} {user.last_name}!
          </p>
        )}
        <p className="text-gray-600 text-center mb-6">
          You are successfully logged in!
        </p>

        <div className="space-y-3">
          <Link to="/account-settings" className="block">
            <Button variant="outline" className="w-full">
              Account Settings
            </Button>
          </Link>
          <Button onClick={handleLogout} className="w-full">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
