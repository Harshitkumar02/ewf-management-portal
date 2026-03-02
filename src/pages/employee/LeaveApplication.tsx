import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const history = [
  { from: "2026-02-15", to: "2026-02-16", status: "Approved", approvedBy: "Rahul M." },
  { from: "2026-01-10", to: "2026-01-10", status: "Rejected", approvedBy: "Rahul M." },
  { from: "2025-12-24", to: "2025-12-26", status: "Approved", approvedBy: "Rahul M." },
];

const LeaveApplication = () => {
  return (
    <DashboardLayout role="employee" userName="Aisha Khan">
      <PageHeader title="Leave Application" breadcrumbs={[{ label: "Employee", path: "/employee/dashboard" }, { label: "Leave" }]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-md shadow-sm p-6">
          <h3 className="font-heading font-semibold mb-4">Apply for Leave</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>From Date</Label><Input type="date" /></div>
              <div className="space-y-1.5"><Label>To Date</Label><Input type="date" /></div>
            </div>
            <div className="space-y-1.5"><Label>Reason</Label><Textarea placeholder="Enter reason for leave..." rows={4} /></div>
            <Button className="w-full">Submit Application</Button>
          </div>
        </div>

        <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
          <div className="p-4 border-b"><h3 className="font-heading font-semibold">Leave History</h3></div>
          <table className="data-table">
            <thead><tr><th>From</th><th>To</th><th>Status</th><th>Approved By</th></tr></thead>
            <tbody>
              {history.map((l, i) => (
                <tr key={i}>
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

export default LeaveApplication;
