import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { getAll, getCurrentUser, update, type LeaveRequest } from "@/lib/db";
import { toast } from "@/hooks/use-toast";

const ManageLeaves = () => {
  const currentUser = getCurrentUser();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);

  const refresh = () => setLeaves(getAll<LeaveRequest>("leaves"));

  useEffect(() => { refresh(); }, []);

  const handleAction = (id: string, status: "Approved" | "Rejected") => {
    update<LeaveRequest>("leaves", id, { status, approvedBy: currentUser?.name || "Management" });
    refresh();
    toast({ title: `Leave ${status.toLowerCase()}` });
  };

  const pending = leaves.filter((l) => l.status === "Pending");
  const processed = leaves.filter((l) => l.status !== "Pending");

  return (
    <DashboardLayout role="management" userName={currentUser?.name || "Management"}>
      <PageHeader title="Leave Approvals" breadcrumbs={[{ label: "Management", path: "/management/dashboard" }, { label: "Leave Approvals" }]} />

      <div className="space-y-6">
        <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
          <div className="p-4 border-b"><h3 className="font-heading font-semibold">Pending Requests ({pending.length})</h3></div>
          <table className="data-table">
            <thead><tr><th>Employee</th><th>From</th><th>To</th><th>Reason</th><th>Actions</th></tr></thead>
            <tbody>
              {pending.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted-foreground py-6">No pending leave requests</td></tr>
              ) : pending.map((l) => (
                <tr key={l.id}>
                  <td className="font-medium">{l.userName}</td>
                  <td>{l.from}</td>
                  <td>{l.to}</td>
                  <td className="max-w-[200px] truncate">{l.reason}</td>
                  <td>
                    <div className="flex gap-2">
                      <Button size="sm" variant="default" onClick={() => handleAction(l.id, "Approved")}><Check className="w-4 h-4 mr-1" /> Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleAction(l.id, "Rejected")}><X className="w-4 h-4 mr-1" /> Reject</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
          <div className="p-4 border-b"><h3 className="font-heading font-semibold">Processed Requests</h3></div>
          <table className="data-table">
            <thead><tr><th>Employee</th><th>From</th><th>To</th><th>Status</th><th>Approved By</th></tr></thead>
            <tbody>
              {processed.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted-foreground py-6">No processed requests yet</td></tr>
              ) : processed.map((l) => (
                <tr key={l.id}>
                  <td className="font-medium">{l.userName}</td>
                  <td>{l.from}</td>
                  <td>{l.to}</td>
                  <td><span className={`badge-status ${l.status === "Approved" ? "badge-approved" : "badge-rejected"}`}>{l.status}</span></td>
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

export default ManageLeaves;
