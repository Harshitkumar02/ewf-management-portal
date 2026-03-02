import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Camera, MapPin, Eye } from "lucide-react";

const records = [
  { name: "Aisha Khan", district: "Chittagong", project: "Rural Education", date: "2026-03-01", checkIn: "09:02 AM", checkOut: "05:30 PM", status: "Present", location: "Chittagong Field", gps: "22.3571, 91.7834", selfie: true },
  { name: "Karim Shah", district: "Sylhet", project: "Healthcare", date: "2026-03-01", checkIn: "09:15 AM", checkOut: "05:00 PM", status: "Late", location: "Sylhet Center", gps: "24.8950, 91.8690", selfie: true },
  { name: "Rahul Mehta", district: "Dhaka", project: "Clean Water", date: "2026-03-01", checkIn: "—", checkOut: "—", status: "Absent", location: "—", gps: "—", selfie: false },
  { name: "Tanvir Hassan", district: "Khulna", project: "Agriculture", date: "2026-03-01", checkIn: "08:55 AM", checkOut: "05:45 PM", status: "Present", location: "Khulna Office", gps: "22.8458, 89.5405", selfie: true },
];

const statusBadge = (s: string) => {
  const cls = s === "Present" ? "badge-approved" : s === "Late" ? "badge-pending" : "badge-rejected";
  return <span className={`badge-status ${cls}`}>{s}</span>;
};

const AttendanceView = () => {
  const [selectedRecord, setSelectedRecord] = useState<typeof records[0] | null>(null);

  return (
    <DashboardLayout role="admin" userName="Admin User">
      <PageHeader
        title="Attendance Overview"
        breadcrumbs={[{ label: "Admin", path: "/admin/dashboard" }, { label: "Attendance" }]}
        action={<Button variant="outline"><Download className="w-4 h-4 mr-1.5" /> Export Excel</Button>}
      />

      {/* Selfie + Location info banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-md p-3 mb-4 flex items-center gap-3 text-sm">
        <Camera className="w-5 h-5 text-primary shrink-0" />
        <div>
          <span className="font-medium text-foreground">Selfie & GPS Verified Attendance</span>
          <span className="text-muted-foreground ml-1">— Employees check in with a selfie and verified GPS location within geo-fenced project zones.</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Input type="date" className="w-44" defaultValue="2026-03-01" />
        <Select><SelectTrigger className="w-40"><SelectValue placeholder="All Districts" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            <SelectItem value="dhaka">Dhaka</SelectItem>
            <SelectItem value="chittagong">Chittagong</SelectItem>
            <SelectItem value="sylhet">Sylhet</SelectItem>
            <SelectItem value="khulna">Khulna</SelectItem>
          </SelectContent>
        </Select>
        <Select><SelectTrigger className="w-40"><SelectValue placeholder="All Projects" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="clean-water">Clean Water</SelectItem>
            <SelectItem value="education">Rural Education</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>District</th>
              <th>Project</th>
              <th>Date</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Location</th>
              <th>Selfie</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
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
                <td>
                  {r.location !== "—" ? (
                    <span className="flex items-center gap-1 text-muted-foreground text-xs">
                      <MapPin className="w-3 h-3 text-success" /> {r.location}
                    </span>
                  ) : "—"}
                </td>
                <td>
                  {r.selfie ? (
                    <span className="flex items-center gap-1 text-xs text-success">
                      <Camera className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td>{statusBadge(r.status)}</td>
                <td>
                  {r.selfie && (
                    <Button variant="ghost" size="sm" onClick={() => setSelectedRecord(r)}>
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Attendance Detail — {selectedRecord?.name}</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              {/* Selfie placeholder */}
              <div className="bg-muted rounded-lg aspect-[4/3] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Camera className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Selfie Photo</p>
                  <p className="text-xs">(Stored in database when backend is connected)</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{selectedRecord.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-in</span>
                  <span className="font-medium">{selectedRecord.checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-out</span>
                  <span className="font-medium">{selectedRecord.checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium flex items-center gap-1"><MapPin className="w-3 h-3 text-success" /> {selectedRecord.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GPS Coordinates</span>
                  <span className="font-mono text-xs">{selectedRecord.gps}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  {statusBadge(selectedRecord.status)}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AttendanceView;
