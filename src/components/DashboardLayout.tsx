import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth, useDashboardLayout } from "@/hooks";
import { Activity, ClipboardList, LogOut, Radio, Wallet, Zap } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Separator,
  TallyButton,
  useTheme,
} from "./ui";
import { SiteHeader } from "./ui/site-header";

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const { userPicture, getUserInitials, getUserName, handleLogout } =
    useDashboardLayout();
  const { user } = useAuth();
  const { actualTheme } = useTheme();

  const isCollapsed = state === "collapsed";

  const menuItems = [
    {
      title: "Posts",
      icon: ClipboardList,
      url: "/ideabank",
    },
    {
      title: "Campanhas",
      icon: Zap,
      url: "/campaigns",
    },
    {
      title: "Assinatura",
      icon: Wallet,
      url: "/subscription",
    },
  ];

  const adminMenuItems = [
    {
      title: "Posts Diários",
      icon: Activity,
      url: "/admin/daily-posts",
    },
    {
      title: "Radar Semanal",
      icon: Radio,
      url: "/weekly-context",
    },
  ];

  if (user?.is_superuser) {
    menuItems.push(...adminMenuItems);
  }

  return (
    <>
      <Sidebar variant="inset" collapsible="icon">
        {" "}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              {isCollapsed ? (
                // Collapsed state - show compact logo
                <div className="flex flex-col items-center justify-center gap-2 p-2">
                  <Link to="/ideabank" className="flex items-center">
                    <img src={"/logo-white.svg"} alt="Sonora Logo" />
                  </Link>
                  <Badge>BETA</Badge>
                </div>
              ) : (
                // Expanded state - show full logo with theme toggle
                <div className="flex items-center justify-between">
                  <Link
                    to="/ideabank"
                    className="flex items-center gap-2 font-semibold"
                  >
                    <img
                      src={
                        actualTheme === "dark"
                          ? "/postnow_logo_white.svg"
                          : "/postnow_logo_black.svg"
                      }
                      alt="Sonora Logo"
                      className="h-8 w-[114px]"
                    />
                  </Link>
                  <Badge>BETA</Badge>
                </div>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`transition-all duration-200 ${
                          isActive
                            ? `${
                                actualTheme === "dark"
                                  ? "bg-linear-to-r! from-primary to-primary-strong"
                                  : "bg-primary/30!"
                              } hover:bg-primary/30! font-medium!`
                            : "hover:bg-primary/30 hover:text-sidebar-accent-foreground active:bg-sidebar-accent/50"
                        }`}
                      >
                        <Link to={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Separator />
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
            {!isCollapsed && (
              <TallyButton variant="feedback" size="sm" className="w-full" />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start gap-3  text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && "Sair"}
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1 p-2">
        <SidebarInset className="pt-4 bg-card rounded-2xl drop-shadow-sm">
          <SiteHeader
            title={
              menuItems.find((item) => item.url === location.pathname)?.title ||
              "Perfil"
            }
          />
          <div className="flex-1 bg-card rounded-md mt-6 flex flex-col">
            <div className="min-h-[93vh] w-full flex-1  flex flex-col">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </main>
    </>
  );
}

export function DashboardLayout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
    </SidebarProvider>
  );
}
