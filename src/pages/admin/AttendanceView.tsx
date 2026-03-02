import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";

const records = [
  { name: "Aisha Khan", district: "Chittagong", project: "Rural Education", date: "2026-03-01", checkIn: "09:02 AM", checkOut: "05:30 PM", status: "Present" },
  { name: "Karim Shah", district: "Sylhet", project: "Healthcare", date: "2026-03-01", checkIn: "09:15 AM", checkOut: "05:00 PM", status: "Late" },
  { name: "Rahul Mehta", district: "Dhaka", project: "Clean Water", date: "2026-03-01", checkIn: "—", checkOut: "—", status: "Absent" },
  { name: "Tanvir Hassan", district: "Khulna", project: "Agriculture", date: "2026-03-01", checkIn: "08:55 AM", checkOut: "05:45 PM", status: "Present" },
];

const statusBadge = (s: string) => {
  const cls = s === "Present" ? "badge-approved" : s === "Late" ? "badge-pending" : "badge-rejected";
  return <span className={`badge-status ${cls}`}>{s}</span>;
};

const AttendanceView = () => {
  return (
    <DashboardLayout role="admin" userName="Admin User">
      <PageHeader
        title="Attendance Overview"
        breadcrumbs={[{ label: "Admin", path: "/admin/dashboard" }, { label: "Attendance" }]}
        action={<Button variant="outline"><Download className="w-4 h-4 mr-1.5" /> Export Excel</Button>}
      />

      <div className="flex flex-wrap gap-3 mb-4">
        <Input type="date" className="w-44" defaultValue="2026-03-01" />
        <Select><SelectTrigger className="w-40"><SelectValue placeholder="All Districts" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            <SelectItem value="dhaka">Dhaka</SelectItem>
            <SelectItem value="chittagong">Chittagong</SelectItem>
          </SelectContent>
        </Select>
        <Select><SelectTrigger className="w-40"><SelectValue placeholder="All Projects" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="clean-water">Clean Water</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr><th>Employee</th><th>District</th><th>Project</th><th>Date</th><th>Check-in</th><th>Check-out</th><th>Status</th></tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i}>
                <td className="font-medium">{r.name}</td>
                <td>{r.district}</td>
                <td>{r.project}</td>
                <td>{r.date}</td>
                <td>{r.checkIn}</td>
                <td>{r.checkOut}</td>
                <td>{statusBadge(r.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AttendanceView;
