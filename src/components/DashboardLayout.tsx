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
  TallyButton,
  ThemeToggle,
} from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardLayout } from "@/hooks/useDashboardLayout";
import { cn } from "@/lib/utils";
import {
  ClipboardList,
  Coins,
  LogOut,
  Menu,
  type LucideIcon,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ScrollArea } from "./ui/scroll-area";

// Navigation items
const navigationItems = [
  {
    name: "Posts",
    href: "/ideabank",
    icon: ClipboardList,
  },
  {
    name: "Créditos",
    href: "/credits",
    icon: Coins,
  },
];

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon: LucideIcon;
  isActive: boolean;
}

const NavLink = ({ href, children, icon: Icon, isActive }: NavLinkProps) => (
  <Link
    to={href}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
      isActive
        ? "bg-primary/10 text-accent-foreground"
        : "text-muted-foreground"
    )}
  >
    <Icon className="w-4 h-4" />
    {children}
  </Link>
);

export const DashboardLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const {
    userPicture,
    isMobileMenuOpen,
    getUserInitials,
    getUserName,
    handleLogout,
    toggleMobileMenu,
  } = useDashboardLayout();

  const SidebarContent = () => (
    <>
      {/* Logo/Brand */}
      <div className="flex items-center justify-between">
        <Link to="/ideabank" className="flex items-center gap-2 font-semibold">
          <img src="/Logo-sonoria.svg" alt="Sonora Logo" />
        </Link>
        {/* Desktop Theme Toggle */}
        <div className="hidden md:block">
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 mt-6">
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
      <div className="space-y-6">
        <Link
          to="/profile"
          className="flex items-center gap-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer"
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
        <TallyButton variant="feedback" size="sm" className="w-full" />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-3  text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-card">
      {/* Desktop Sidebar - Fixed */}
      <div className="hidden w-[220px] lg:w-[280px]   pl-4 pr-2 py-6  md:block flex-shrink-0">
        <div className="h-full flex flex-col">
          <SidebarContent />
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 flex flex-col min-w-0 p-2">
        {/* Mobile Header */}
        <header className="flex h-14 items-center gap-4 px-2 py-4 lg:h-[60px] lg:px-6 md:hidden flex-shrink-0">
          <Sheet open={isMobileMenuOpen} onOpenChange={toggleMobileMenu}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu />
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
              <div className="flex h-full flex-col px-4 py-6">
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>

          {/* Mobile brand and theme toggle */}
          <div className="flex items-center justify-between flex-1  px-4 py-6">
            <Link
              to="/ideabank"
              className="flex items-center gap-2 font-semibold"
            >
              <img src="/Logo-sonoria.svg" alt="Sonora Logo" />
            </Link>
            {/* Mobile Theme Toggle */}
            <div className="flex items-center gap-2">
              <TallyButton variant="feedback" size="sm" />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Page Content - Scrollable */}
        <main className="flex-1 bg-background rounded-md drop-shadow-sm ">
          <div className="max-w-none">
            <ScrollArea className="h-[98vh] w-full">
              <Outlet />
            </ScrollArea>
          </div>
        </main>
      </div>
    </div>
  );
};
