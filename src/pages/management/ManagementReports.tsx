import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

const allReports = [
  { project: "Clean Water Initiative", district: "Dhaka", submittedBy: "Rahul M.", date: "2026-03-01", type: "Weekly", status: "Pending" },
  { project: "Rural Education Program", district: "Chittagong", submittedBy: "Aisha K.", date: "2026-02-28", type: "Monthly", status: "Approved" },
  { project: "Healthcare Outreach", district: "Sylhet", submittedBy: "Karim S.", date: "2026-02-27", type: "Daily", status: "Rejected" },
  { project: "Women Empowerment", district: "Rajshahi", submittedBy: "Nadia F.", date: "2026-03-01", type: "Weekly", status: "Pending" },
  { project: "Agriculture Support", district: "Khulna", submittedBy: "Tanvir H.", date: "2026-02-28", type: "Monthly", status: "Approved" },
  { project: "Clean Water Initiative", district: "Dhaka", submittedBy: "Rahul M.", date: "2026-02-25", type: "Daily", status: "Approved" },
];

const statusBadge = (status: string) => {
  const cls = status === "Pending" ? "badge-pending" : status === "Approved" ? "badge-approved" : "badge-rejected";
  return <span className={`badge-status ${cls}`}>{status}</span>;
};

const ManagementReports = () => {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? allReports : allReports.filter((r) => r.status.toLowerCase() === filter);

  return (
    <DashboardLayout role="management" userName="Management User">
      <PageHeader
        title="Reports Overview"
        breadcrumbs={[{ label: "Management", path: "/management/dashboard" }, { label: "Reports" }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <div className="stat-card-icon stat-card-icon-blue"><Eye className="w-6 h-6" /></div>
          <div>
            <p className="text-2xl font-bold text-foreground">{allReports.length}</p>
            <p className="text-sm text-muted-foreground">Total Reports</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon stat-card-icon-green"><CheckCircle className="w-6 h-6" /></div>
          <div>
            <p className="text-2xl font-bold text-foreground">{allReports.filter(r => r.status === "Approved").length}</p>
            <p className="text-sm text-muted-foreground">Approved</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon stat-card-icon-orange"><XCircle className="w-6 h-6" /></div>
          <div>
            <p className="text-2xl font-bold text-foreground">{allReports.filter(r => r.status === "Pending").length}</p>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-md shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b">
          <h2 className="font-heading font-semibold text-lg">All Reports</h2>
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
                <th>Submitted By</th>
                <th>Date</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i}>
                  <td className="font-medium">{r.project}</td>
                  <td>{r.district}</td>
                  <td>{r.submittedBy}</td>
                  <td>{r.date}</td>
                  <td>{r.type}</td>
                  <td>{statusBadge(r.status)}</td>
                  <td>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm"><Eye className="w-4 h-4 mr-1" /> View</Button>
                      {r.status === "Pending" && (
                        <>
                          <Button variant="ghost" size="sm" className="text-success"><CheckCircle className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" className="text-destructive"><XCircle className="w-4 h-4" /></Button>
                        </>
                      )}
                    </div>
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

export default ManagementReports;
