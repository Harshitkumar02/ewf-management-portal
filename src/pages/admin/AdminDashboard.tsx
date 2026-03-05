import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { MapPin, FolderOpen, Users, FileText } from "lucide-react";
import { getAll, getCurrentUser, type District, type Project, type User, type Report } from "@/lib/db";

const AdminDashboard = () => {
  const currentUser = getCurrentUser();
  const [stats, setStats] = useState({ districts: 0, projects: 0, employees: 0, pendingReports: 0 });

  useEffect(() => {
    const allReports = getAll<Report>("reports");
    setStats({
      districts: getAll<District>("districts").length,
      projects: getAll<Project>("projects").length,
      employees: getAll<User>("users").length,
      pendingReports: allReports.filter((r) => r.status === "Pending").length,
    });
  }, []);

  const statCards = [
    { label: "Total Districts", value: String(stats.districts), icon: MapPin, color: "stat-card-icon-blue" },
    { label: "Total Projects", value: String(stats.projects), icon: FolderOpen, color: "stat-card-icon-teal" },
    { label: "Total Users", value: String(stats.employees), icon: Users, color: "stat-card-icon-green" },
    { label: "Pending Reports", value: String(stats.pendingReports), icon: FileText, color: "stat-card-icon-orange" },
  ];

  return (
    <DashboardLayout role="admin" userName={currentUser?.name || "Admin User"}>
      <PageHeader title="Dashboard" breadcrumbs={[{ label: "Admin" }, { label: "Dashboard" }]} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`stat-card-icon ${s.color}`}><s.icon className="w-6 h-6" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
