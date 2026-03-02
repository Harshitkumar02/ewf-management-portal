import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, CheckCircle, XCircle, Download } from "lucide-react";
import { getAll, getCurrentUser, update, type Report } from "@/lib/db";
import { toast } from "@/hooks/use-toast";

const downloadReport = (report: Report) => {
  if (report.fileData && report.fileName) {
    const link = document.createElement("a");
    link.href = report.fileData;
    link.download = report.fileName;
    link.click();
  } else {
    toast({ title: "No file attached to this report", variant: "destructive" });
  }
};

const statusBadge = (status: string) => {
  const cls = status === "Pending" ? "badge-pending" : status === "Approved" ? "badge-approved" : "badge-rejected";
  return <span className={`badge-status ${cls}`}>{status}</span>;
};

const ManagementReports = () => {
  const currentUser = getCurrentUser();
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => { setReports(getAll<Report>("reports")); }, []);

  const handleAction = (id: string, status: "Approved" | "Rejected") => {
    update<Report>("reports", id, { status });
    setReports(getAll<Report>("reports"));
    toast({ title: `Report ${status.toLowerCase()}` });
  };

  const filtered = filter === "all" ? reports : reports.filter((r) => r.status.toLowerCase() === filter);

  return (
    <DashboardLayout role="management" userName={currentUser?.name || "Management"}>
      <PageHeader title="Reports Overview" breadcrumbs={[{ label: "Management", path: "/management/dashboard" }, { label: "Reports" }]} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <div className="stat-card-icon stat-card-icon-blue"><Eye className="w-6 h-6" /></div>
          <div><p className="text-2xl font-bold text-foreground">{reports.length}</p><p className="text-sm text-muted-foreground">Total Reports</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon stat-card-icon-green"><CheckCircle className="w-6 h-6" /></div>
          <div><p className="text-2xl font-bold text-foreground">{reports.filter((r) => r.status === "Approved").length}</p><p className="text-sm text-muted-foreground">Approved</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon stat-card-icon-orange"><XCircle className="w-6 h-6" /></div>
          <div><p className="text-2xl font-bold text-foreground">{reports.filter((r) => r.status === "Pending").length}</p><p className="text-sm text-muted-foreground">Pending Review</p></div>
        </div>
      </div>

      <div className="bg-card border rounded-md shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b">
          <h2 className="font-heading font-semibold text-lg">All Reports</h2>
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
            <thead><tr><th>Project</th><th>District</th><th>Submitted By</th><th>Date</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium">{r.project}</td>
                  <td>{r.district}</td>
                  <td>{r.submittedByName}</td>
                  <td>{r.date}</td>
                  <td>{r.type}</td>
                  <td>{statusBadge(r.status)}</td>
                  <td>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => downloadReport(r)}><Download className="w-4 h-4 mr-1" /> {r.fileData ? "Download" : "View"}</Button>
                      {r.status === "Pending" && (
                        <>
                          <Button variant="ghost" size="sm" className="text-success" onClick={() => handleAction(r.id, "Approved")}><CheckCircle className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleAction(r.id, "Rejected")}><XCircle className="w-4 h-4" /></Button>
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
