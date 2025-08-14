import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  ThemeToggle,
} from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

// Icons (using simple SVG icons since we don't have an icon library)

const MenuIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const LightbulbIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

// Navigation items
const navigationItems = [
  {
    name: "Banco de Ideias",
    href: "/ideabank",
    icon: LightbulbIcon,
  },
];

interface SocialAccount {
  id: number;
  provider: string;
  extra_data: {
    email?: string;
    name?: string;
    picture?: string;
  };
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon: React.ComponentType;
  isActive: boolean;
}

const NavLink = ({ href, children, icon: Icon, isActive }: NavLinkProps) => (
  <Link
    to={href}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
      isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
    )}
  >
    <Icon />
    {children}
  </Link>
);

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userPicture, setUserPicture] = useState<string | null>(null);

  // Buscar foto do usuário das contas sociais
  useEffect(() => {
    const fetchUserPicture = async () => {
      try {
        const response = await api.get("/api/v1/auth/social-accounts/");
        const socialAccounts = response.data.social_accounts || [];
        const googleAccount = socialAccounts.find(
          (acc: SocialAccount) => acc.provider === "google"
        );

        if (googleAccount?.extra_data?.picture) {
          setUserPicture(googleAccount.extra_data.picture);
        }
      } catch (error) {
        console.error("Erro ao buscar foto do usuário:", error);
      }
    };

    if (user) {
      fetchUserPicture();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getUserInitials = () => {
    if (!user) return "U";
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  };

  const getUserName = () => {
    if (!user) return "Usuário";
    return (
      `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
      user.email ||
      "Usuário"
    );
  };

  const SidebarContent = () => (
    <>
      {/* Logo/Brand */}
      <div className="flex h-14 items-center justify-between border-b px-4 lg:h-[60px] lg:px-6">
        <Link to="/ideabank" className="flex items-center gap-2 font-semibold">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <span className="text-lg">Sonora</span>
        </Link>
        {/* Desktop Theme Toggle */}
        <div className="hidden md:block">
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4">
        <nav className="grid items-start gap-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              isActive={location.pathname === item.href}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User section */}
      <div className="mt-auto mb-1 border-t pt-4 px-3">
        <Link
          to="/profile"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={userPicture || ""} alt={getUserName()} />
            <AvatarFallback className="text-xs">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {getUserName()}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-3 my-2 text-muted-foreground hover:text-foreground"
        >
          <LogoutIcon />
          Sair
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Desktop Sidebar - Fixed */}
      <div className="hidden w-[220px] lg:w-[280px] border-r bg-muted/40 md:block flex-shrink-0">
        <div className="h-full flex flex-col">
          <SidebarContent />
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden flex-shrink-0">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <MenuIcon />
                <span className="sr-only">Alternar menu de navegação</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Menu de Navegação</SheetTitle>
                <SheetDescription>
                  Navegue pelas páginas do dashboard
                </SheetDescription>
              </SheetHeader>
              <div className="flex h-full flex-col">
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>

          {/* Mobile brand and theme toggle */}
          <div className="flex items-center justify-between flex-1">
            <Link
              to="/ideabank"
              className="flex items-center gap-2 font-semibold"
            >
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  S
                </span>
              </div>
              <span className="text-lg">Sonora</span>
            </Link>
            {/* Mobile Theme Toggle */}
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content - Scrollable */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-none">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
