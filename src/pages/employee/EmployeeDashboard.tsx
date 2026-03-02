import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, CalendarDays, Upload } from "lucide-react";

const tasks = [
  { title: "Survey village water sources", dueDate: "2026-03-05", status: "Pending" },
  { title: "Submit field visit report", dueDate: "2026-03-03", status: "Completed" },
  { title: "Coordinate with local health center", dueDate: "2026-03-07", status: "Pending" },
];

const leaves = [
  { from: "2026-02-15", to: "2026-02-16", status: "Approved", approvedBy: "Rahul M." },
  { from: "2026-01-10", to: "2026-01-10", status: "Rejected", approvedBy: "Rahul M." },
];

const EmployeeDashboard = () => {
  return (
    <DashboardLayout role="employee" userName="Aisha Khan">
      <PageHeader title="Employee Dashboard" breadcrumbs={[{ label: "Employee" }, { label: "Dashboard" }]} />

      <p className="text-lg mb-6">Welcome, <span className="font-semibold">Aisha Khan</span></p>

      <div className="flex flex-wrap gap-3 mb-6">
        <Button><LogIn className="w-4 h-4 mr-1.5" /> Check-In</Button>
        <Button variant="outline"><LogOut className="w-4 h-4 mr-1.5" /> Check-Out</Button>
        <Button variant="outline"><CalendarDays className="w-4 h-4 mr-1.5" /> Apply Leave</Button>
        <Button variant="outline"><Upload className="w-4 h-4 mr-1.5" /> Upload Work Proof</Button>
      </div>

      <div className="bg-card border rounded-md shadow-sm p-4 mb-6">
        <h3 className="font-heading font-semibold mb-2">Attendance Summary (March 2026)</h3>
        <div className="flex gap-6 text-sm">
          <div><span className="text-muted-foreground">Present:</span> <span className="font-semibold">18</span></div>
          <div><span className="text-muted-foreground">Absent:</span> <span className="font-semibold">1</span></div>
          <div><span className="text-muted-foreground">Late:</span> <span className="font-semibold">2</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
          <div className="p-4 border-b"><h3 className="font-heading font-semibold">Assigned Tasks</h3></div>
          <table className="data-table">
            <thead><tr><th>Task</th><th>Due Date</th><th>Status</th></tr></thead>
            <tbody>
              {tasks.map((t, i) => (
                <tr key={i}>
                  <td className="font-medium">{t.title}</td>
                  <td>{t.dueDate}</td>
                  <td><span className={`badge-status ${t.status === "Completed" ? "badge-completed" : "badge-pending"}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
          <div className="p-4 border-b"><h3 className="font-heading font-semibold">Leave Status</h3></div>
          <table className="data-table">
            <thead><tr><th>From</th><th>To</th><th>Status</th><th>Approved By</th></tr></thead>
            <tbody>
              {leaves.map((l, i) => (
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

export default EmployeeDashboard;
