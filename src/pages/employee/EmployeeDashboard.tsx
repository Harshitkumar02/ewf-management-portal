import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, CalendarDays, Upload, Camera, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import AttendanceCheckInModal from "@/components/attendance/AttendanceCheckInModal";

const tasks = [
  { title: "Survey village water sources", dueDate: "2026-03-05", status: "Pending" },
  { title: "Submit field visit report", dueDate: "2026-03-03", status: "Completed" },
  { title: "Coordinate with local health center", dueDate: "2026-03-07", status: "Pending" },
];

const leaves = [
  { from: "2026-02-15", to: "2026-02-16", status: "Approved", approvedBy: "Rahul M." },
  { from: "2026-01-10", to: "2026-01-10", status: "Rejected", approvedBy: "Rahul M." },
];

const recentAttendance = [
  { date: "2026-03-01", checkIn: "09:02 AM", checkOut: "05:30 PM", status: "Present", location: "Dhaka Office" },
  { date: "2026-02-28", checkIn: "09:15 AM", checkOut: "05:00 PM", status: "Late", location: "Dhaka Office" },
  { date: "2026-02-27", checkIn: "08:55 AM", checkOut: "05:45 PM", status: "Present", location: "Dhaka Office" },
];

const EmployeeDashboard = () => {
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);

  return (
    <DashboardLayout role="employee" userName="Aisha Khan">
      <PageHeader title="Employee Dashboard" breadcrumbs={[{ label: "Employee" }, { label: "Dashboard" }]} />

      <p className="text-lg mb-6">Welcome, <span className="font-semibold">Aisha Khan</span></p>

      <div className="flex flex-wrap gap-3 mb-6">
        <Button onClick={() => setCheckInOpen(true)}>
          <Camera className="w-4 h-4 mr-1.5" /> Check-In
        </Button>
        <Button variant="outline" onClick={() => setCheckOutOpen(true)}>
          <Camera className="w-4 h-4 mr-1.5" /> Check-Out
        </Button>
        <Link to="/employee/leave">
          <Button variant="outline"><CalendarDays className="w-4 h-4 mr-1.5" /> Apply Leave</Button>
        </Link>
        <Button variant="outline"><Upload className="w-4 h-4 mr-1.5" /> Upload Work Proof</Button>
      </div>

      {/* Attendance info card */}
      <div className="bg-card border rounded-md shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Camera className="w-4 h-4 text-primary" />
          <h3 className="font-heading font-semibold">Selfie & Location Attendance</h3>
        </div>
        <div className="flex items-start gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" />
            <span>Selfie required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>GPS location verified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span>Geo-fenced check-in</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-success/10 rounded-md p-3 text-center">
            <p className="text-2xl font-bold text-success">18</p>
            <p className="text-xs text-muted-foreground">Present</p>
          </div>
          <div className="bg-destructive/10 rounded-md p-3 text-center">
            <p className="text-2xl font-bold text-destructive">1</p>
            <p className="text-xs text-muted-foreground">Absent</p>
          </div>
          <div className="bg-warning/10 rounded-md p-3 text-center">
            <p className="text-2xl font-bold text-warning">2</p>
            <p className="text-xs text-muted-foreground">Late</p>
          </div>
        </div>
      </div>

      {/* Recent Attendance with location */}
      <div className="bg-card border rounded-md shadow-sm overflow-x-auto mb-6">
        <div className="p-4 border-b"><h3 className="font-heading font-semibold">Recent Attendance</h3></div>
        <table className="data-table">
          <thead><tr><th>Date</th><th>Check-in</th><th>Check-out</th><th>Location</th><th>Status</th></tr></thead>
          <tbody>
            {recentAttendance.map((r, i) => (
              <tr key={i}>
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

      <AttendanceCheckInModal open={checkInOpen} onOpenChange={setCheckInOpen} type="check-in" />
      <AttendanceCheckInModal open={checkOutOpen} onOpenChange={setCheckOutOpen} type="check-out" />
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
