import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { SidebarProvider, useSidebarState } from "./SidebarContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: ReactNode;
  role?: string;
  userName?: string;
}

const LayoutInner = ({ children, role = "admin", userName = "Admin User" }: DashboardLayoutProps) => {
  const { collapsed } = useSidebarState();
  const isMobile = useIsMobile();

  const marginLeft = isMobile ? 0 : collapsed ? "4rem" : "15rem";

  return (
    <div className="min-h-screen bg-background">
      <Header userName={userName} role={role} />
      <Sidebar role={role} />
      <main
        className="pt-14 transition-all duration-200 min-h-screen"
        style={{ marginLeft }}
      >
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
};

const DashboardLayout = (props: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <LayoutInner {...props} />
    </SidebarProvider>
  );
};

export default DashboardLayout;
