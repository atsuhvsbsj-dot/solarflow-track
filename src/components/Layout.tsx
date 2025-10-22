import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  FileText,
  CheckSquare,
  Zap,
  ClipboardCheck,
  LogOut,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Documents", url: "/documents", icon: FileText },
  { title: "Checklists", url: "/checklists", icon: CheckSquare },
  { title: "Wiring", url: "/wiring", icon: Zap },
  { title: "QC / Inspection", url: "/inspection", icon: ClipboardCheck },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout, user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar>
          <div className="flex items-center gap-2 px-4 py-6 border-b border-sidebar-border">
            <Sun className="h-6 w-6 text-sidebar-primary" />
            <span className="font-bold text-lg text-sidebar-foreground">Solar Track</span>
          </div>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          className={({ isActive }) =>
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "hover:bg-sidebar-accent/50"
                          }
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <div className="mt-auto p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-sidebar-foreground">{user?.username}</p>
                <p className="text-xs text-sidebar-foreground/70 capitalize">{user?.role}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-card flex items-center px-6 gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold text-foreground">
              Solar Project Tracking System
            </h1>
          </header>

          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
