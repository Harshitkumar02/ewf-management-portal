import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  role?: string;
  userName?: string;
}

const DashboardLayout = ({ children, role = "admin", userName = "Admin User" }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header userName={userName} role={role} />
      <Sidebar role={role} />
      <main className="pt-14 pl-60 transition-all duration-200">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
