import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getAll, getCurrentUser, insert, generateId, type LeaveRequest } from "@/lib/db";
import { toast } from "@/hooks/use-toast";

const ManagerLeaveApplication = () => {
  const currentUser = getCurrentUser();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [form, setForm] = useState({ from: "", to: "", reason: "" });

  useEffect(() => {
    if (!currentUser) return;
    setLeaves(getAll<LeaveRequest>("leaves").filter((l) => l.userId === currentUser.id));
  }, []);

  const handleSubmit = () => {
    if (!form.from || !form.to || !form.reason || !currentUser) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    insert<LeaveRequest>("leaves", {
      id: generateId(), userId: currentUser.id, userName: currentUser.name,
      from: form.from, to: form.to, reason: form.reason, status: "Pending", approvedBy: "—",
    });
    setLeaves(getAll<LeaveRequest>("leaves").filter((l) => l.userId === currentUser.id));
    setForm({ from: "", to: "", reason: "" });
    toast({ title: "Leave application submitted" });
  };

  return (
    <DashboardLayout role="manager" userName={currentUser?.name || "Manager"}>
      <PageHeader title="Leave Application" breadcrumbs={[{ label: "Manager", path: "/manager/dashboard" }, { label: "Leave" }]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-md shadow-sm p-6">
          <h3 className="font-heading font-semibold mb-4">Apply for Leave</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>From Date</Label><Input type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>To Date</Label><Input type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} /></div>
            </div>
            <div className="space-y-1.5"><Label>Reason</Label><Textarea placeholder="Enter reason for leave..." rows={4} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></div>
            <Button className="w-full" onClick={handleSubmit}>Submit Application</Button>
          </div>
        </div>

        <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
          <div className="p-4 border-b"><h3 className="font-heading font-semibold">Leave History</h3></div>
          <table className="data-table">
            <thead><tr><th>From</th><th>To</th><th>Status</th><th>Approved By</th></tr></thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr><td colSpan={4} className="text-center text-muted-foreground py-6">No leave requests yet</td></tr>
              ) : leaves.map((l) => (
                <tr key={l.id}>
                  <td>{l.from}</td>
                  <td>{l.to}</td>
                  <td><span className={`badge-status ${l.status === "Approved" ? "badge-approved" : l.status === "Rejected" ? "badge-rejected" : "badge-pending"}`}>{l.status}</span></td>
                  <td>{l.approvedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagerLeaveApplication;
