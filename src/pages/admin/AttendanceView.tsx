import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Camera, MapPin, Eye, CalendarDays, CalendarRange, Clock, Settings } from "lucide-react";
import { getAll, getCurrentUser, getMaxCheckInTime, setMaxCheckInTime, getLocalDate, type AttendanceRecord, type District, type User } from "@/lib/db";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval, isValid } from "date-fns";
import * as XLSX from "xlsx";

const statusBadge = (s: string) => {
  const cls = s === "Present" ? "badge-approved" : s === "Late" ? "badge-pending" : "badge-rejected";
  return <span className={`badge-status ${cls}`}>{s}</span>;
};

interface AttendanceViewProps {
  role?: "admin" | "management";
}

const AttendanceView = ({ role = "admin" }: AttendanceViewProps) => {
  const currentUser = getCurrentUser();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [districtFilter, setDistrictFilter] = useState("all");
  const [designationFilter, setDesignationFilter] = useState("all");
  const [viewTab, setViewTab] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(getLocalDate());
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));
  const [maxTime, setMaxTime] = useState(getMaxCheckInTime());
  const [settingsOpen, setSettingsOpen] = useState(false);

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

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchDistrict = districtFilter === "all" || r.district === districtFilter;
      const matchDesignation = designationFilter === "all" || users.find((u) => u.id === r.userId)?.role === designationFilter;
      return matchDistrict && matchDesignation;
    });
  }, [records, districtFilter, designationFilter, users]);

  const dailyRecords = useMemo(() => {
    return filteredRecords.filter((r) => r.date === selectedDate);
  }, [filteredRecords, selectedDate]);

  const monthlyData = useMemo(() => {
    const monthDate = parse(selectedMonth + "-01", "yyyy-MM-dd", new Date());
    if (!isValid(monthDate)) return [];
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const monthRecords = filteredRecords.filter((r) => {
      const d = parse(r.date, "yyyy-MM-dd", new Date());
      return isValid(d) && d >= start && d <= end;
    });

    const userMap = new Map<string, { userName: string; userId: string; present: number; late: number; absent: number; total: number }>();
    
    const relevantUsers = users.filter((u) => {
      if (districtFilter !== "all" && u.district !== districtFilter) return false;
      if (designationFilter !== "all" && u.role !== designationFilter) return false;
      return u.role !== "admin";
    });

    const daysInMonth = eachDayOfInterval({ start, end }).length;

    relevantUsers.forEach((u) => {
      userMap.set(u.id, { userName: u.name, userId: u.id, present: 0, late: 0, absent: 0, total: daysInMonth });
    });

    monthRecords.forEach((r) => {
      const entry = userMap.get(r.userId);
      if (entry) {
        if (r.status === "Present") entry.present++;
        else if (r.status === "Late") entry.late++;
        else if (r.status === "Absent") entry.absent++;
      }
    });

    return Array.from(userMap.values()).map((entry) => ({
      ...entry,
      absent: entry.total - entry.present - entry.late,
      attendanceRate: entry.total > 0 ? Math.round(((entry.present + entry.late) / entry.total) * 100) : 0,
    }));
  }, [filteredRecords, selectedMonth, users, districtFilter, designationFilter]);

  const handleEmployeeMonthlyDetail = (userId: string, userName: string) => {
    const monthDate = parse(selectedMonth + "-01", "yyyy-MM-dd", new Date());
    if (!isValid(monthDate)) return;
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const days = eachDayOfInterval({ start, end });

    const userRecords = records.filter((r) => {
      const d = parse(r.date, "yyyy-MM-dd", new Date());
      return r.userId === userId && isValid(d) && d >= start && d <= end;
    });

    const data = days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const rec = userRecords.find((r) => r.date === dateStr);
      return {
        Date: dateStr,
        Day: format(day, "EEEE"),
        "Check-In": rec?.checkIn || "—",
        "Check-Out": rec?.checkOut || "—",
        Location: rec?.location || "—",
        GPS: rec?.gps || "—",
        Status: rec ? rec.status : "Absent",
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Monthly Detail");
    const fileName = `${userName.replace(/\s+/g, "_")}_Attendance_${selectedMonth}.xlsx`;
    XLSX.writeFile(wb, fileName);
    toast({ title: `Downloaded ${fileName}` });
  };

  const handleExportExcel = () => {
    let data: Record<string, unknown>[];
    let fileName: string;

    if (viewTab === "daily") {
      data = dailyRecords.map((r) => ({
        Employee: r.userName,
        Designation: getUserRole(r.userId),
        District: r.district,
        Project: r.project,
        Date: r.date,
        "Check-In": r.checkIn,
        "Check-Out": r.checkOut,
        Location: r.location,
        GPS: r.gps,
        Status: r.status,
      }));
      fileName = `Attendance_Daily_${selectedDate}.xlsx`;
    } else {
      data = monthlyData.map((row) => ({
        Employee: row.userName,
        Designation: getUserRole(row.userId),
        Present: row.present,
        Late: row.late,
        Absent: row.absent,
        "Total Days": row.total,
        "Attendance %": `${row.attendanceRate}%`,
      }));
      fileName = `Attendance_Monthly_${selectedMonth}.xlsx`;
    }

    if (data.length === 0) {
      toast({ title: "No data to export", variant: "destructive" });
      return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, viewTab === "daily" ? "Daily Report" : "Monthly Report");
    XLSX.writeFile(wb, fileName);
    toast({ title: `Exported ${fileName}` });
  };

  return (
    <DashboardLayout role={role} userName={currentUser?.name || (role === "admin" ? "Admin User" : "Management")}>
      <PageHeader
        title="Attendance Overview"
        breadcrumbs={[{ label: role === "admin" ? "Admin" : "Management", path: role === "admin" ? "/admin/dashboard" : "/management/dashboard" }, { label: "Attendance" }]}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}><Settings className="w-4 h-4 mr-1.5" /> <span className="hidden sm:inline">Check-In </span>Settings</Button>
            <Button variant="outline" size="sm" onClick={handleExportExcel}><Download className="w-4 h-4 mr-1.5" /> Export</Button>
          </div>
        }
      />

      <div className="bg-primary/5 border border-primary/20 rounded-md p-3 mb-4 flex items-start sm:items-center gap-3 text-sm">
        <Camera className="w-5 h-5 text-primary shrink-0 mt-0.5 sm:mt-0" />
        <div>
          <span className="font-medium text-foreground">Selfie & GPS Verified</span>
          <span className="text-muted-foreground ml-1 hidden sm:inline">— Employees check in with a selfie and verified GPS location.</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 mb-4">
        <Select value={districtFilter} onValueChange={setDistrictFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Districts" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            {districts.map((d) => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={designationFilter} onValueChange={setDesignationFilter}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="All Designations" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Designations</SelectItem>
            <SelectItem value="management">Management</SelectItem>
            <SelectItem value="manager">Project Manager</SelectItem>
            <SelectItem value="employee">Employee</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={viewTab} onValueChange={setViewTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily" className="gap-1.5"><CalendarDays className="w-4 h-4" /> Daily Report</TabsTrigger>
          <TabsTrigger value="monthly" className="gap-1.5"><CalendarRange className="w-4 h-4" /> Monthly Report</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <div className="mb-4">
            <Input type="date" className="w-full sm:w-44" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </div>
          <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Employee</th><th>District</th><th>Project</th><th>Date</th><th>Check-in</th><th>Check-out</th><th>Location</th><th>Selfie</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {dailyRecords.length === 0 && (
                  <tr><td colSpan={10} className="text-center text-muted-foreground py-8">No attendance records for this date.</td></tr>
                )}
                {dailyRecords.map((r) => (
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
        </TabsContent>

        <TabsContent value="monthly">
          <div className="mb-4">
            <Input type="month" className="w-full sm:w-44" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
          </div>
          <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Employee</th><th>Designation</th><th>Present</th><th>Late</th><th>Absent</th><th>Total Days</th><th>Attendance %</th></tr>
              </thead>
              <tbody>
                {monthlyData.length === 0 && (
                  <tr><td colSpan={7} className="text-center text-muted-foreground py-8">No data for this month.</td></tr>
                )}
                {monthlyData.map((row) => (
                  <tr key={row.userId}>
                    <td className="font-medium">
                      <button
                        className="text-primary hover:underline cursor-pointer font-medium text-left"
                        onClick={() => handleEmployeeMonthlyDetail(row.userId, row.userName)}
                        title="Download detailed monthly report"
                      >
                        {row.userName}
                      </button>
                    </td>
                    <td className="text-muted-foreground">{getUserRole(row.userId)}</td>
                    <td><span className="text-success font-medium">{row.present}</span></td>
                    <td><span className="text-warning font-medium">{row.late}</span></td>
                    <td><span className="text-destructive font-medium">{row.absent}</span></td>
                    <td>{row.total}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${row.attendanceRate}%` }} />
                        </div>
                        <span className="text-sm font-medium">{row.attendanceRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

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

              <div className="flex justify-between"><span className="text-muted-foreground text-sm">Date</span><span className="font-medium text-sm">{selectedRecord.date}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground text-sm">Status</span>{statusBadge(selectedRecord.status)}</div>

              <div className="grid grid-cols-2 gap-3">
                <div className="border rounded-lg p-3 space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Check-In</p>
                  <p className="text-lg font-bold text-foreground">{selectedRecord.checkIn}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="w-3 h-3 text-success" /> {selectedRecord.location}</div>
                  <p className="font-mono text-[10px] text-muted-foreground">{selectedRecord.gps}</p>
                </div>
                <div className="border rounded-lg p-3 space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Check-Out</p>
                  <p className="text-lg font-bold text-foreground">{selectedRecord.checkOut}</p>
                  {selectedRecord.checkOut !== "—" ? (
                    <>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="w-3 h-3 text-success" /> {selectedRecord.location}</div>
                      <p className="font-mono text-[10px] text-muted-foreground">{selectedRecord.gps}</p>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">Not yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Clock className="w-5 h-5" /> Max Check-In Time</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">Set the maximum allowed check-in time. Anyone checking in after this time will be marked as <span className="font-medium text-warning">Late</span>.</p>
            <div className="space-y-1.5">
              <Label>Max Check-In Time</Label>
              <Input type="time" value={maxTime} onChange={(e) => setMaxTime(e.target.value)} />
            </div>
            <div className="text-xs text-muted-foreground">Current setting: <span className="font-medium text-foreground">{maxTime}</span></div>
            <Button className="w-full" onClick={() => {
              setMaxCheckInTime(maxTime);
              setSettingsOpen(false);
              toast({ title: `Max check-in time set to ${maxTime}` });
            }}>Save Setting</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AttendanceView;
