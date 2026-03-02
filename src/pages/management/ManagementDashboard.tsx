import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { FolderOpen, CalendarCheck, Wallet, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { getAll, getCurrentUser, type Project, type AttendanceRecord, type District, type Report } from "@/lib/db";

const COLORS = ["hsl(215,60%,28%)", "hsl(185,55%,35%)"];

const ManagementDashboard = () => {
  const currentUser = getCurrentUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [districtReports, setDistrictReports] = useState<{ district: string; submitted: number; approved: number; pending: number }[]>([]);
  const [stats, setStats] = useState({ active: 0, attendance: "0%", budget: "₹0", expense: "₹0" });

  useEffect(() => {
    const allProjects = getAll<Project>("projects");
    const allAttendance = getAll<AttendanceRecord>("attendance");
    const allReports = getAll<Report>("reports");
    const allDistricts = getAll<District>("districts");

    setProjects(allProjects);
    const activeCount = allProjects.filter((p) => p.status === "Active").length;
    const totalAtt = allAttendance.length || 1;
    const presentAtt = allAttendance.filter((a) => a.status !== "Absent").length;

    setStats({
      active: activeCount,
      attendance: `${Math.round((presentAtt / totalAtt) * 100)}%`,
      budget: "₹1.7Cr",
      expense: "₹1.2Cr",
    });

    setDistrictReports(allDistricts.map((d) => {
      const dReports = allReports.filter((r) => r.district === d.name);
      return { district: d.name, submitted: dReports.length, approved: dReports.filter((r) => r.status === "Approved").length, pending: dReports.filter((r) => r.status === "Pending").length };
    }));
  }, []);

  const barData = projects.map((p) => ({ name: p.name.split(" ").slice(0, 2).join(" "), performance: Math.floor(Math.random() * 40) + 60 }));
  const pieData = [{ name: "Budget", value: 17000000 }, { name: "Expense", value: 12000000 }];

  const statCards = [
    { label: "Active Projects", value: String(stats.active), icon: FolderOpen, color: "stat-card-icon-blue" },
    { label: "Attendance %", value: stats.attendance, icon: CalendarCheck, color: "stat-card-icon-green" },
    { label: "Total Budget", value: stats.budget, icon: Wallet, color: "stat-card-icon-teal" },
    { label: "Total Expenses", value: stats.expense, icon: TrendingDown, color: "stat-card-icon-orange" },
  ];

  return (
    <DashboardLayout role="management" userName={currentUser?.name || "Management"}>
      <PageHeader title="Management Dashboard" breadcrumbs={[{ label: "Management" }, { label: "Dashboard" }]} />

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-card border rounded-md shadow-sm p-4">
          <h3 className="font-heading font-semibold mb-4">Project-wise Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="performance" fill="hsl(215,60%,28%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border rounded-md shadow-sm p-4">
          <h3 className="font-heading font-semibold mb-4">Budget vs Expense</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
        <div className="p-4 border-b"><h3 className="font-heading font-semibold">District-wise Report Status</h3></div>
        <table className="data-table">
          <thead><tr><th>District</th><th>Submitted</th><th>Approved</th><th>Pending</th></tr></thead>
          <tbody>
            {districtReports.map((d, i) => (
              <tr key={i}>
                <td className="font-medium">{d.district}</td>
                <td>{d.submitted}</td>
                <td>{d.approved}</td>
                <td>{d.pending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default ManagementDashboard;
