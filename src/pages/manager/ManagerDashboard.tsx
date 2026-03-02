import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Users, CalendarCheck, FileText, ListTodo, Upload, ClipboardCheck, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const stats = [
  { label: "Team Members", value: "18", icon: Users, color: "stat-card-icon-blue" },
  { label: "Today's Attendance", value: "15", icon: CalendarCheck, color: "stat-card-icon-green" },
  { label: "Pending Reports", value: "3", icon: FileText, color: "stat-card-icon-orange" },
  { label: "Active Tasks", value: "7", icon: ListTodo, color: "stat-card-icon-teal" },
];

const reports = [
  { name: "Weekly Progress - W9", date: "2026-02-28", status: "Approved" },
  { name: "Daily Report - Mar 1", date: "2026-03-01", status: "Pending" },
  { name: "Monthly Summary - Feb", date: "2026-02-28", status: "Pending" },
];

const ManagerDashboard = () => {
  return (
    <DashboardLayout role="manager" userName="Rahul Mehta">
      <PageHeader title="Project Manager Dashboard" breadcrumbs={[{ label: "Manager" }, { label: "Dashboard" }]} />

      <div className="mb-3 text-sm text-muted-foreground">Assigned District: <span className="font-semibold text-foreground">Dhaka</span></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`stat-card-icon ${s.color}`}><s.icon className="w-6 h-6" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Link to="/manager/reports"><Button><Upload className="w-4 h-4 mr-1.5" /> Upload Report</Button></Link>
        <Button variant="outline"><ClipboardCheck className="w-4 h-4 mr-1.5" /> Mark Attendance</Button>
        <Link to="/manager/tasks"><Button variant="outline"><ClipboardList className="w-4 h-4 mr-1.5" /> Assign Task</Button></Link>
      </div>

      <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
        <div className="p-4 border-b"><h3 className="font-heading font-semibold">Recent Uploaded Reports</h3></div>
        <table className="data-table">
          <thead><tr><th>Report</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {reports.map((r, i) => (
              <tr key={i}>
                <td className="font-medium">{r.name}</td>
                <td>{r.date}</td>
                <td><span className={`badge-status ${r.status === "Approved" ? "badge-approved" : "badge-pending"}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
