import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Users, CalendarCheck, FileText, ListTodo, Upload, ClipboardCheck, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getAll, getCurrentUser, type User, type AttendanceRecord, type Report, type Task } from "@/lib/db";

const ManagerDashboard = () => {
  const currentUser = getCurrentUser();
  const [stats, setStats] = useState({ team: 0, attendance: 0, pendingReports: 0, activeTasks: 0 });
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const users = getAll<User>("users");
    const attendance = getAll<AttendanceRecord>("attendance");
    const allReports = getAll<Report>("reports");
    const tasks = getAll<Task>("tasks");

    // Manager sees their district data
    const district = currentUser?.district || "";
    const teamMembers = users.filter((u) => u.district === district && u.role === "employee");
    const todayAttendance = attendance.filter((a) => a.district === district && a.date === "2026-03-01" && a.status !== "Absent");
    const myReports = allReports.filter((r) => r.submittedBy === currentUser?.id);
    const myTasks = tasks.filter((t) => t.assignedBy === currentUser?.id && t.status !== "Completed");

    setStats({
      team: teamMembers.length || 18,
      attendance: todayAttendance.length || 15,
      pendingReports: myReports.filter((r) => r.status === "Pending").length,
      activeTasks: myTasks.length,
    });
    setReports(myReports.slice(0, 5));
  }, []);

  const statCards = [
    { label: "Team Members", value: String(stats.team), icon: Users, color: "stat-card-icon-blue" },
    { label: "Today's Attendance", value: String(stats.attendance), icon: CalendarCheck, color: "stat-card-icon-green" },
    { label: "Pending Reports", value: String(stats.pendingReports), icon: FileText, color: "stat-card-icon-orange" },
    { label: "Active Tasks", value: String(stats.activeTasks), icon: ListTodo, color: "stat-card-icon-teal" },
  ];

  return (
    <DashboardLayout role="manager" userName={currentUser?.name || "Manager"}>
      <PageHeader title="Project Manager Dashboard" breadcrumbs={[{ label: "Manager" }, { label: "Dashboard" }]} />

      <div className="mb-3 text-sm text-muted-foreground">Assigned District: <span className="font-semibold text-foreground">{currentUser?.district || "—"}</span></div>

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
            {reports.map((r) => (
              <tr key={r.id}>
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
