import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { MapPin, FolderOpen, Users, FileText, Search, Download, CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getAll, getCurrentUser, update, type District, type Project, type User, type Report } from "@/lib/db";
import { toast } from "@/hooks/use-toast";

const statusBadge = (status: string) => {
  const cls = status === "Pending" ? "badge-pending" : status === "Approved" ? "badge-approved" : "badge-rejected";
  return <span className={`badge-status ${cls}`}>{status}</span>;
};

const handleDownload = (report: Report) => {
  if (!report.fileData) {
    toast({ title: "No file attached", description: "This report has no downloadable file.", variant: "destructive" });
    return;
  }
  const link = document.createElement("a");
  link.href = report.fileData;
  link.download = report.fileName || `${report.name}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const AdminDashboard = () => {
  const currentUser = getCurrentUser();
  const [filter, setFilter] = useState("all");
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({ districts: 0, projects: 0, employees: 0, pendingReports: 0 });

  const refreshData = () => {
    const allReports = getAll<Report>("reports");
    setReports(allReports);
    setStats({
      districts: getAll<District>("districts").length,
      projects: getAll<Project>("projects").length,
      employees: getAll<User>("users").length,
      pendingReports: allReports.filter((r) => r.status === "Pending").length,
    });
  };

  useEffect(() => { refreshData(); }, []);

  const handleAction = (id: string, status: "Approved" | "Rejected") => {
    update<Report>("reports", id, { status });
    refreshData();
    toast({ title: `Report ${status.toLowerCase()}` });
  };

  const statCards = [
    { label: "Total Districts", value: String(stats.districts), icon: MapPin, color: "stat-card-icon-blue" },
    { label: "Total Projects", value: String(stats.projects), icon: FolderOpen, color: "stat-card-icon-teal" },
    { label: "Total Users", value: String(stats.employees), icon: Users, color: "stat-card-icon-green" },
    { label: "Pending Reports", value: String(stats.pendingReports), icon: FileText, color: "stat-card-icon-orange" },
  ];

  const filtered = filter === "all" ? reports : reports.filter((r) => r.status.toLowerCase() === filter);

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

      <div className="bg-card border rounded-md shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b">
          <h2 className="font-heading font-semibold text-lg">Recent Reports</h2>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search reports..." className="pl-9 w-full sm:w-56" />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Report</th><th>Project</th><th>District</th><th>Submitted By</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium">{r.name}</td>
                  <td>{r.project}</td>
                  <td>{r.district}</td>
                  <td>{r.submittedByName}</td>
                  <td>{statusBadge(r.status)}</td>
                  <td><Button variant="ghost" size="sm" onClick={() => handleDownload(r)}><Download className="w-4 h-4 mr-1" /> Download</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
