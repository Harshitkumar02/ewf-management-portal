import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Camera, MapPin, Eye } from "lucide-react";
import { getAll, getCurrentUser, type AttendanceRecord, type District, type User } from "@/lib/db";

const statusBadge = (s: string) => {
  const cls = s === "Present" ? "badge-approved" : s === "Late" ? "badge-pending" : "badge-rejected";
  return <span className={`badge-status ${cls}`}>{s}</span>;
};

const AttendanceView = () => {
  const currentUser = getCurrentUser();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    setRecords(getAll<AttendanceRecord>("attendance"));
    setDistricts(getAll<District>("districts"));
    setUsers(getAll<User>("users"));
  }, []);

  const getUserRole = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return "";
    const roleLabels: Record<string, string> = { management: "Management", manager: "Project Manager", employee: "Employee", admin: "Admin" };
    return roleLabels[user.role] || user.role;
  };

  return (
    <DashboardLayout role="admin" userName={currentUser?.name || "Admin User"}>
      <PageHeader
        title="Attendance Overview"
        breadcrumbs={[{ label: "Admin", path: "/admin/dashboard" }, { label: "Attendance" }]}
        action={<Button variant="outline"><Download className="w-4 h-4 mr-1.5" /> Export Excel</Button>}
      />

      <div className="bg-primary/5 border border-primary/20 rounded-md p-3 mb-4 flex items-center gap-3 text-sm">
        <Camera className="w-5 h-5 text-primary shrink-0" />
        <div>
          <span className="font-medium text-foreground">Selfie & GPS Verified Attendance</span>
          <span className="text-muted-foreground ml-1">— Employees check in with a selfie and verified GPS location within geo-fenced project zones.</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Input type="date" className="w-44" defaultValue="2026-03-01" />
        <Select>
          <SelectTrigger className="w-40"><SelectValue placeholder="All Districts" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            {districts.map((d) => <SelectItem key={d.id} value={d.name.toLowerCase()}>{d.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr><th>Employee</th><th>District</th><th>Project</th><th>Date</th><th>Check-in</th><th>Check-out</th><th>Location</th><th>Selfie</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td className="font-medium">
                  <div>{r.userName}</div>
                  <div className="text-xs text-muted-foreground">{getUserRole(r.userId)}</div>
                </td>
                <td>{r.district}</td>
                <td>{r.project}</td>
                <td>{r.date}</td>
                <td>{r.checkIn}</td>
                <td>{r.checkOut}</td>
                <td>{r.location !== "—" ? <span className="flex items-center gap-1 text-muted-foreground text-xs"><MapPin className="w-3 h-3 text-success" /> {r.location}</span> : "—"}</td>
                <td>{r.selfie ? <span className="flex items-center gap-1 text-xs text-success"><Camera className="w-3 h-3" /> Verified</span> : <span className="text-xs text-muted-foreground">—</span>}</td>
                <td>{statusBadge(r.status)}</td>
                <td>{r.selfie && <Button variant="ghost" size="sm" onClick={() => setSelectedRecord(r)}><Eye className="w-4 h-4 mr-1" /> View</Button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Attendance Detail — {selectedRecord?.userName}</DialogTitle></DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="bg-muted rounded-lg aspect-[4/3] flex items-center justify-center">
                {selectedRecord.photo ? (
                  <img src={selectedRecord.photo} alt="Selfie" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Camera className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Selfie Photo</p>
                  </div>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{selectedRecord.date}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Check-in</span><span className="font-medium">{selectedRecord.checkIn}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Check-out</span><span className="font-medium">{selectedRecord.checkOut}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="font-medium flex items-center gap-1"><MapPin className="w-3 h-3 text-success" /> {selectedRecord.location}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">GPS</span><span className="font-mono text-xs">{selectedRecord.gps}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span>{statusBadge(selectedRecord.status)}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AttendanceView;
