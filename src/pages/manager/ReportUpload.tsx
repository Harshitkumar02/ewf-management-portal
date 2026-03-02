import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAll, getCurrentUser, insert, generateId, type Report } from "@/lib/db";
import { toast } from "@/hooks/use-toast";

const ReportUpload = () => {
  const currentUser = getCurrentUser();
  const [reports, setReports] = useState<Report[]>([]);
  const [form, setForm] = useState({ type: "" as Report["type"], description: "" });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setReports(getAll<Report>("reports").filter((r) => r.submittedBy === currentUser?.id));
  }, []);

  const handleSubmit = () => {
    if (!form.type || !currentUser) { toast({ title: "Please select report type", variant: "destructive" }); return; }

    const saveReport = (fileData?: string, fileName?: string, fileType?: string) => {
      const now = new Date();
      insert<Report>("reports", {
        id: generateId(), name: `${form.type} Report - ${now.toLocaleDateString()}`,
        project: currentUser.project, district: currentUser.district,
        submittedBy: currentUser.id, submittedByName: currentUser.name,
        date: now.toISOString().split("T")[0], type: form.type,
        status: "Pending", description: form.description,
        fileData, fileName, fileType,
      });
      setReports(getAll<Report>("reports").filter((r) => r.submittedBy === currentUser.id));
      setForm({ type: "" as Report["type"], description: "" });
      setFile(null);
      toast({ title: "Report submitted successfully" });
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = () => saveReport(reader.result as string, file.name, file.type);
      reader.readAsDataURL(file);
    } else {
      saveReport();
    }
  };

  return (
    <DashboardLayout role="manager" userName={currentUser?.name || "Manager"}>
      <PageHeader title="Upload Report" breadcrumbs={[{ label: "Manager", path: "/manager/dashboard" }, { label: "Reports" }]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-md shadow-sm p-6">
          <h3 className="font-heading font-semibold mb-4">New Report</h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Report Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Report["type"] })}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Upload File</Label><Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} /></div>
            <div className="space-y-1.5"><Label>Description</Label><Textarea placeholder="Add report description..." rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <Button className="w-full" onClick={handleSubmit}>Submit Report</Button>
          </div>
        </div>

        <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
          <div className="p-4 border-b"><h3 className="font-heading font-semibold">Previous Reports</h3></div>
          <table className="data-table">
            <thead><tr><th>Report</th><th>Type</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium">{r.name}</td>
                  <td>{r.type}</td>
                  <td>{r.date}</td>
                  <td><span className={`badge-status ${r.status === "Approved" ? "badge-approved" : "badge-pending"}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportUpload;
