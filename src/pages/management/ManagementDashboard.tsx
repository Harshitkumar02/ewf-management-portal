import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { FolderOpen, CalendarCheck, Wallet, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const stats = [
  { label: "Active Projects", value: "12", icon: FolderOpen, color: "stat-card-icon-blue" },
  { label: "Attendance %", value: "87%", icon: CalendarCheck, color: "stat-card-icon-green" },
  { label: "Total Budget", value: "₹1.7Cr", icon: Wallet, color: "stat-card-icon-teal" },
  { label: "Total Expenses", value: "₹1.2Cr", icon: TrendingDown, color: "stat-card-icon-orange" },
];

const barData = [
  { name: "Clean Water", performance: 85 },
  { name: "Education", performance: 72 },
  { name: "Healthcare", performance: 95 },
  { name: "Women Emp.", performance: 60 },
  { name: "Agriculture", performance: 88 },
];

const pieData = [
  { name: "Budget", value: 17000000 },
  { name: "Expense", value: 12000000 },
];
const COLORS = ["hsl(215,60%,28%)", "hsl(185,55%,35%)"];

const districtReports = [
  { district: "Dhaka", submitted: 12, approved: 10, pending: 2 },
  { district: "Chittagong", submitted: 8, approved: 7, pending: 1 },
  { district: "Sylhet", submitted: 6, approved: 4, pending: 2 },
  { district: "Rajshahi", submitted: 10, approved: 9, pending: 1 },
];

const ManagementDashboard = () => {
  return (
    <DashboardLayout role="management" userName="Management User">
      <PageHeader title="Management Dashboard" breadcrumbs={[{ label: "Management" }, { label: "Dashboard" }]} />

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
