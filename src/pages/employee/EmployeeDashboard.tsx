import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, CalendarDays, Upload, Camera, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import AttendanceCheckInModal from "@/components/attendance/AttendanceCheckInModal";
import UploadWorkProofModal from "@/components/employee/UploadWorkProofModal";
import { getAll, getCurrentUser, insert, generateId, type AttendanceRecord, type Task, type LeaveRequest } from "@/lib/db";

const EmployeeDashboard = () => {
  const currentUser = getCurrentUser();
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    setAttendance(getAll<AttendanceRecord>("attendance").filter((a) => a.userId === currentUser.id));
    setTasks(getAll<Task>("tasks").filter((t) => t.assignedTo === currentUser.id));
    setLeaves(getAll<LeaveRequest>("leaves").filter((l) => l.userId === currentUser.id));
  }, []);

  const handleCheckIn = (data: { photo: string; latitude: number; longitude: number; timestamp: string; type: string }) => {
    if (!currentUser) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    const isLate = now.getHours() >= 9 && now.getMinutes() > 10;
    insert<AttendanceRecord>("attendance", {
      id: generateId(), userId: currentUser.id, userName: currentUser.name,
      district: currentUser.district, project: currentUser.project,
      date: now.toISOString().split("T")[0], checkIn: timeStr, checkOut: "—",
      status: isLate ? "Late" : "Present", location: "GPS Verified",
      gps: `${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}`,
      selfie: true, photo: data.photo,
    });
    setAttendance(getAll<AttendanceRecord>("attendance").filter((a) => a.userId === currentUser.id));
  };

  const presentCount = attendance.filter((a) => a.status === "Present").length;
  const absentCount = attendance.filter((a) => a.status === "Absent").length;
  const lateCount = attendance.filter((a) => a.status === "Late").length;

  return (
    <DashboardLayout role="employee" userName={currentUser?.name || "Employee"}>
      <PageHeader title="Employee Dashboard" breadcrumbs={[{ label: "Employee" }, { label: "Dashboard" }]} />

      <p className="text-lg mb-6">Welcome, <span className="font-semibold">{currentUser?.name || "Employee"}</span></p>

      <div className="flex flex-wrap gap-3 mb-6">
        <Button onClick={() => setCheckInOpen(true)}><Camera className="w-4 h-4 mr-1.5" /> Check-In</Button>
        <Button variant="outline" onClick={() => setCheckOutOpen(true)}><Camera className="w-4 h-4 mr-1.5" /> Check-Out</Button>
        <Link to="/employee/leave"><Button variant="outline"><CalendarDays className="w-4 h-4 mr-1.5" /> Apply Leave</Button></Link>
        <Button variant="outline" onClick={() => setUploadOpen(true)}><Upload className="w-4 h-4 mr-1.5" /> Upload Work Proof</Button>
      </div>

      <div className="bg-card border rounded-md shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Camera className="w-4 h-4 text-primary" />
          <h3 className="font-heading font-semibold">Selfie & Location Attendance</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-success/10 rounded-md p-3 text-center">
            <p className="text-2xl font-bold text-success">{presentCount}</p>
            <p className="text-xs text-muted-foreground">Present</p>
          </div>
          <div className="bg-destructive/10 rounded-md p-3 text-center">
            <p className="text-2xl font-bold text-destructive">{absentCount}</p>
            <p className="text-xs text-muted-foreground">Absent</p>
          </div>
          <div className="bg-warning/10 rounded-md p-3 text-center">
            <p className="text-2xl font-bold text-warning">{lateCount}</p>
            <p className="text-xs text-muted-foreground">Late</p>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-md shadow-sm overflow-x-auto mb-6">
        <div className="p-4 border-b"><h3 className="font-heading font-semibold">Recent Attendance</h3></div>
        <table className="data-table">
          <thead><tr><th>Date</th><th>Check-in</th><th>Check-out</th><th>Location</th><th>Status</th></tr></thead>
          <tbody>
            {attendance.slice(0, 5).map((r) => (
              <tr key={r.id}>
                <td className="font-medium">{r.date}</td>
                <td>{r.checkIn}</td>
                <td>{r.checkOut}</td>
                <td className="flex items-center gap-1 text-muted-foreground"><MapPin className="w-3 h-3" /> {r.location}</td>
                <td><span className={`badge-status ${r.status === "Present" ? "badge-approved" : r.status === "Late" ? "badge-pending" : "badge-rejected"}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
          <div className="p-4 border-b"><h3 className="font-heading font-semibold">Assigned Tasks</h3></div>
          <table className="data-table">
            <thead><tr><th>Task</th><th>Due Date</th><th>Status</th></tr></thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id}>
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
              {leaves.map((l) => (
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

      <AttendanceCheckInModal open={checkInOpen} onOpenChange={setCheckInOpen} type="check-in" onSubmit={handleCheckIn} />
      <AttendanceCheckInModal open={checkOutOpen} onOpenChange={setCheckOutOpen} type="check-out" />
      <UploadWorkProofModal open={uploadOpen} onOpenChange={setUploadOpen} />
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
