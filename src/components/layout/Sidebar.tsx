import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, MapPin, FolderOpen, Users, CalendarCheck,
  FileText, ClipboardList, CalendarDays, ChevronLeft, ChevronRight,
  Upload, ListTodo, X
} from "lucide-react";
import { useSidebarState } from "./SidebarContext";

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
  { label: "Leave Approvals", icon: CalendarDays, path: "/management/leaves" },
];

const managerMenu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/manager/dashboard" },
  { label: "Upload Report", icon: Upload, path: "/manager/reports" },
  { label: "Tasks", icon: ListTodo, path: "/manager/tasks" },
  { label: "Leave", icon: CalendarDays, path: "/manager/leave" },
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
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebarState();
  const location = useLocation();
  const menu = menuByRole[role] || adminMenu;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-14 bottom-0 z-40 bg-sidebar text-sidebar-foreground transition-all duration-200 flex flex-col
          ${collapsed ? "w-16" : "w-60"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-2 right-2 text-sidebar-muted hover:text-sidebar-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-4 py-4 border-b border-sidebar-border">
          {!collapsed && (
            <p className="text-xs uppercase tracking-wider text-sidebar-muted font-semibold">
              {role === "admin" ? "Administration" : role === "management" ? "Management" : role === "manager" ? "Project Manager" : "Employee"} Menu
            </p>
          )}
        </div>

        <nav className="flex-1 py-2 overflow-y-auto">
          {menu.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-md text-sm transition-colors mb-0.5 ${
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
          className="hidden lg:flex items-center justify-center py-3 border-t border-sidebar-border text-sidebar-muted hover:text-sidebar-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
