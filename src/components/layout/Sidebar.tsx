import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, MapPin, FolderOpen, Users, CalendarCheck,
  FileText, ClipboardList, CalendarDays, ChevronLeft, ChevronRight,
  Building2, Upload, ListTodo
} from "lucide-react";

interface SidebarProps {
  role: string;
}

const adminMenu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Manage Districts", icon: MapPin, path: "/admin/districts" },
  { label: "Manage Projects", icon: FolderOpen, path: "/admin/projects" },
  { label: "User Management", icon: Users, path: "/admin/users" },
  { label: "Attendance", icon: CalendarCheck, path: "/admin/attendance" },
];

const managementMenu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/management/dashboard" },
  { label: "Reports", icon: FileText, path: "/management/reports" },
];

const managerMenu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/manager/dashboard" },
  { label: "Upload Report", icon: Upload, path: "/manager/reports" },
  { label: "Tasks", icon: ListTodo, path: "/manager/tasks" },
];

const employeeMenu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/employee/dashboard" },
  { label: "Tasks", icon: ClipboardList, path: "/employee/tasks" },
  { label: "Leave", icon: CalendarDays, path: "/employee/leave" },
];

const menuByRole: Record<string, typeof adminMenu> = {
  admin: adminMenu,
  management: managementMenu,
  manager: managerMenu,
  employee: employeeMenu,
};

const Sidebar = ({ role }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const menu = menuByRole[role] || adminMenu;

  return (
    <aside
      className={`fixed left-0 top-14 bottom-0 z-40 bg-sidebar text-sidebar-foreground transition-all duration-200 flex flex-col ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <nav className="flex-1 py-4 overflow-y-auto">
        {menu.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              } ${collapsed ? "justify-center px-2" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center py-3 border-t border-sidebar-border text-sidebar-muted hover:text-sidebar-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
};

export default Sidebar;
