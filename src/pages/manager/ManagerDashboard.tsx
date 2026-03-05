import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Users, CalendarCheck, FileText, ListTodo, Upload, ClipboardCheck, ClipboardList, Camera, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getAll, getCurrentUser, insert, update, generateId, isCheckInLate, getLocalDate, getLocalTime, type User, type AttendanceRecord, type Report, type Task } from "@/lib/db";
import AttendanceCheckInModal from "@/components/attendance/AttendanceCheckInModal";

const ManagerDashboard = () => {
  const currentUser = getCurrentUser();
  const [stats, setStats] = useState({ team: 0, attendance: 0, pendingReports: 0, activeTasks: 0 });
  const [reports, setReports] = useState<Report[]>([]);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [teamAttendance, setTeamAttendance] = useState<AttendanceRecord[]>([]);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [hasCheckedOut, setHasCheckedOut] = useState(false);

  const refreshData = () => {
    const users = getAll<User>("users");
    const attendance = getAll<AttendanceRecord>("attendance");
    const allReports = getAll<Report>("reports");
    const tasks = getAll<Task>("tasks");

    const district = currentUser?.district || "";
    const myTeam = users.filter((u) => u.managerId === currentUser?.id && u.role === "employee");
    const today = getLocalDate();
    const todayTeamAttendance = attendance.filter((a) => a.date === today && myTeam.some((m) => m.id === a.userId));
    const myReports = allReports.filter((r) => r.submittedBy === currentUser?.id);
    const myTasks = tasks.filter((t) => t.assignedBy === currentUser?.id && t.status !== "Completed");

    setTeamMembers(myTeam);
    setTeamAttendance(todayTeamAttendance);

    const todayRecord = attendance.find((a) => a.userId === currentUser?.id && a.date === today);
    setHasCheckedIn(!!todayRecord);
    setHasCheckedOut(!!todayRecord && todayRecord.checkOut !== "—");

    setStats({
      team: myTeam.length,
      attendance: todayTeamAttendance.length,
      pendingReports: myReports.filter((r) => r.status === "Pending").length,
      activeTasks: myTasks.length,
    });
    setReports(myReports.slice(0, 5));
  };

  useEffect(() => { refreshData(); }, []);

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

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
        <Link to="/manager/reports" className="w-full sm:w-auto"><Button className="w-full"><Upload className="w-4 h-4 mr-1.5" /> Upload Report</Button></Link>
        <Button className="w-full sm:w-auto" variant="outline" onClick={() => setCheckInOpen(true)} disabled={hasCheckedIn}><Camera className="w-4 h-4 mr-1.5" /> {hasCheckedIn ? "Checked In ✓" : "Mark Check-In"}</Button>
        <Button className="w-full sm:w-auto" variant="outline" onClick={() => setCheckOutOpen(true)} disabled={!hasCheckedIn || hasCheckedOut}><LogOut className="w-4 h-4 mr-1.5" /> {hasCheckedOut ? "Checked Out ✓" : "Mark Check-Out"}</Button>
        <Link to="/manager/tasks" className="w-full sm:w-auto"><Button className="w-full" variant="outline"><ClipboardList className="w-4 h-4 mr-1.5" /> Assign Task</Button></Link>
      </div>

      {/* Team Attendance Section */}
      <div className="bg-card border rounded-md shadow-sm overflow-x-auto mb-6">
        <div className="p-4 border-b"><h3 className="font-heading font-semibold">Team Attendance — Today</h3></div>
        <table className="data-table">
          <thead><tr><th>Employee</th><th>District</th><th>Project</th><th>Check-In</th><th>Check-Out</th><th>Status</th></tr></thead>
          <tbody>
            {teamMembers.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-6 text-muted-foreground">No team members assigned to you yet.</td></tr>
            ) : (
              teamMembers.map((member) => {
                const record = teamAttendance.find((a) => a.userId === member.id);
                return (
                  <tr key={member.id}>
                    <td className="font-medium">{member.name}</td>
                    <td>{member.district}</td>
                    <td>{member.project}</td>
                    <td>{record?.checkIn || "—"}</td>
                    <td>{record?.checkOut || "—"}</td>
                    <td>
                      <span className={`badge-status ${record ? (record.status === "Present" ? "badge-approved" : record.status === "Late" ? "badge-pending" : "badge-rejected") : "badge-rejected"}`}>
                        {record ? record.status : "Absent"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
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

      <AttendanceCheckInModal
        open={checkInOpen}
        onOpenChange={setCheckInOpen}
        type="check-in"
        onSubmit={(data) => {
          if (!currentUser) return;
          const now = new Date();
          const timeStr = getLocalTime(now);
          const dateStr = getLocalDate(now);
          insert<AttendanceRecord>("attendance", {
            id: generateId(), userId: currentUser.id, userName: currentUser.name,
            district: currentUser.district, project: currentUser.project,
            date: dateStr, checkIn: timeStr, checkOut: "—",
            status: isCheckInLate() ? "Late" : "Present", location: "GPS Verified",
            gps: `${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}`,
            selfie: true, photo: data.photo,
          });
          refreshData();
        }}
      />

      <AttendanceCheckInModal
        open={checkOutOpen}
        onOpenChange={setCheckOutOpen}
        type="check-out"
        onSubmit={(data) => {
          if (!currentUser) return;
          const today = getLocalDate();
          const attendance = getAll<AttendanceRecord>("attendance");
          const todayRecord = attendance.find((a) => a.userId === currentUser.id && a.date === today);
          if (todayRecord) {
            update<AttendanceRecord>("attendance", todayRecord.id, { checkOut: getLocalTime() });
          }
          refreshData();
        }}
      />
    </DashboardLayout>
  );
};

export default ManagerDashboard;
