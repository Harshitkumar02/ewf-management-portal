import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { MapPin, FolderOpen, Users, FileText, Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Total Districts", value: "24", icon: MapPin, color: "stat-card-icon-blue" },
  { label: "Total Projects", value: "86", icon: FolderOpen, color: "stat-card-icon-teal" },
  { label: "Total Employees", value: "342", icon: Users, color: "stat-card-icon-green" },
  { label: "Pending Reports", value: "18", icon: FileText, color: "stat-card-icon-orange" },
];

const reports = [
  { project: "Clean Water Initiative", district: "Dhaka", uploadedBy: "Rahul M.", status: "Pending" },
  { project: "Rural Education Program", district: "Chittagong", uploadedBy: "Aisha K.", status: "Approved" },
  { project: "Healthcare Outreach", district: "Sylhet", uploadedBy: "Karim S.", status: "Rejected" },
  { project: "Women Empowerment", district: "Rajshahi", uploadedBy: "Nadia F.", status: "Pending" },
  { project: "Agriculture Support", district: "Khulna", uploadedBy: "Tanvir H.", status: "Approved" },
];

const statusBadge = (status: string) => {
  const cls = status === "Pending" ? "badge-pending" : status === "Approved" ? "badge-approved" : "badge-rejected";
  return <span className={`badge-status ${cls}`}>{status}</span>;
};

const AdminDashboard = () => {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? reports : reports.filter((r) => r.status.toLowerCase() === filter);

  return (
    <DashboardLayout role="admin" userName="Admin User">
      <PageHeader
        title="Dashboard"
        breadcrumbs={[{ label: "Admin" }, { label: "Dashboard" }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`stat-card-icon ${s.color}`}>
              <s.icon className="w-6 h-6" />
            </div>
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search reports..." className="pl-9 w-56" />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
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
            <thead>
              <tr>
                <th>Project</th>
                <th>District</th>
                <th>Uploaded By</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i}>
                  <td className="font-medium">{r.project}</td>
                  <td>{r.district}</td>
                  <td>{r.uploadedBy}</td>
                  <td>{statusBadge(r.status)}</td>
                  <td>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                  </td>
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
