import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getAll, insert, remove, generateId, getCurrentUser, getLocalDate, type Project, type ProjectExpense } from "@/lib/db";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Wallet, TrendingDown, IndianRupee, PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const EXPENSE_CATEGORIES = ["Marketing", "Photography", "Travel", "Printing", "Equipment", "Salary", "Office", "Events", "Other"];
const COLORS = [
  "hsl(215, 60%, 45%)", "hsl(160, 55%, 40%)", "hsl(35, 85%, 55%)", "hsl(340, 60%, 50%)",
  "hsl(270, 50%, 55%)", "hsl(185, 55%, 40%)", "hsl(15, 70%, 50%)", "hsl(95, 45%, 45%)", "hsl(0, 0%, 55%)"
];

interface BudgetExpenseManagerProps {
  role: "admin" | "management";
}

const formatCurrency = (amount: number) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount.toLocaleString("en-IN")}`;
};

const BudgetExpenseManager = ({ role }: BudgetExpenseManagerProps) => {
  const currentUser = getCurrentUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [expenses, setExpenses] = useState<ProjectExpense[]>([]);
  const [selectedProject, setSelectedProject] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ projectId: "", category: "Marketing", amount: "", description: "" });

  const refresh = () => {
    setProjects(getAll<Project>("projects"));
    setExpenses(getAll<ProjectExpense>("expenses"));
  };

  useEffect(() => { refresh(); }, []);

  const handleAddExpense = () => {
    if (!form.projectId || !form.amount || !form.category) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    const project = projects.find((p) => p.id === form.projectId);
    insert<ProjectExpense>("expenses", {
      id: generateId(),
      projectId: form.projectId,
      projectName: project?.name || "",
      category: form.category,
      amount: parseFloat(form.amount),
      description: form.description,
      date: getLocalDate(),
      addedBy: currentUser?.name || "Unknown",
    });
    refresh();
    setAddOpen(false);
    setForm({ projectId: "", category: "Marketing", amount: "", description: "" });
    toast({ title: "Expense added" });
  };

  const handleDelete = (id: string) => {
    remove("expenses", id);
    refresh();
    toast({ title: "Expense removed" });
  };

  const filteredExpenses = selectedProject === "all" ? expenses : expenses.filter((e) => e.projectId === selectedProject);

  // Stats
  const totalBudget = projects.reduce((sum, p) => sum + (parseFloat(p.budget.replace(/[^0-9.]/g, "")) || 0), 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalBudget - totalExpense;

  // Pie data by category
  const categoryMap = new Map<string, number>();
  filteredExpenses.forEach((e) => {
    categoryMap.set(e.category, (categoryMap.get(e.category) || 0) + e.amount);
  });
  const pieData = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));

  // Per-project summary
  const projectSummary = projects.map((p) => {
    const budget = parseFloat(p.budget.replace(/[^0-9.]/g, "")) || 0;
    const spent = expenses.filter((e) => e.projectId === p.id).reduce((s, e) => s + e.amount, 0);
    return { ...p, budgetNum: budget, spent, remaining: budget - spent };
  });

  return (
    <DashboardLayout role={role} userName={currentUser?.name || (role === "admin" ? "Admin User" : "Management")}>
      <PageHeader
        title="Budget & Expenses"
        breadcrumbs={[{ label: role === "admin" ? "Admin" : "Management", path: role === "admin" ? "/admin/dashboard" : "/management/dashboard" }, { label: "Budget & Expenses" }]}
        action={<Button onClick={() => setAddOpen(true)}><Plus className="w-4 h-4 mr-1.5" /> Add Expense</Button>}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <div className="stat-card-icon stat-card-icon-blue"><Wallet className="w-6 h-6" /></div>
          <div><p className="text-2xl font-bold text-foreground">{formatCurrency(totalBudget)}</p><p className="text-sm text-muted-foreground">Total Budget</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon stat-card-icon-orange"><TrendingDown className="w-6 h-6" /></div>
          <div><p className="text-2xl font-bold text-foreground">{formatCurrency(totalExpense)}</p><p className="text-sm text-muted-foreground">Total Expenses</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon stat-card-icon-green"><IndianRupee className="w-6 h-6" /></div>
          <div><p className={`text-2xl font-bold ${remaining >= 0 ? "text-success" : "text-destructive"}`}>{formatCurrency(Math.abs(remaining))}</p><p className="text-sm text-muted-foreground">{remaining >= 0 ? "Remaining" : "Over Budget"}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart */}
        <div className="bg-card border rounded-md shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold flex items-center gap-2"><PieChartIcon className="w-5 h-5" /> Expense Breakdown</h3>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">No expenses recorded yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${formatCurrency(value)}`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Project Budget Summary */}
        <div className="bg-card border rounded-md shadow-sm overflow-hidden">
          <div className="p-4 border-b"><h3 className="font-heading font-semibold">Project Budget Summary</h3></div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Project</th><th>Budget</th><th>Spent</th><th>Remaining</th></tr></thead>
              <tbody>
                {projectSummary.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-muted-foreground py-6">No projects yet</td></tr>
                ) : projectSummary.map((p) => (
                  <tr key={p.id}>
                    <td className="font-medium">{p.name}</td>
                    <td>{formatCurrency(p.budgetNum)}</td>
                    <td className="text-destructive font-medium">{formatCurrency(p.spent)}</td>
                    <td className={p.remaining >= 0 ? "text-success font-medium" : "text-destructive font-medium"}>{formatCurrency(Math.abs(p.remaining))}{p.remaining < 0 && " (over)"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Expense Log */}
      <div className="bg-card border rounded-md shadow-sm overflow-hidden">
        <div className="p-4 border-b"><h3 className="font-heading font-semibold">Expense Log</h3></div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Project</th><th>Category</th><th>Description</th><th>Amount</th><th>Added By</th><th>Action</th></tr></thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-muted-foreground py-6">No expenses recorded</td></tr>
              ) : filteredExpenses.map((e) => (
                <tr key={e.id}>
                  <td>{e.date}</td>
                  <td className="font-medium">{e.projectName}</td>
                  <td><span className="badge-status badge-approved">{e.category}</span></td>
                  <td className="max-w-[200px] truncate">{e.description || "—"}</td>
                  <td className="font-semibold">{formatCurrency(e.amount)}</td>
                  <td>{e.addedBy}</td>
                  <td><Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(e.id)}><Trash2 className="w-4 h-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Project</Label>
              <Select value={form.projectId} onValueChange={(v) => setForm({ ...form, projectId: v })}>
                <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                <SelectContent>{projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{EXPENSE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Amount (₹)</Label>
              <Input type="number" placeholder="e.g. 20000" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Description (optional)</Label>
              <Input placeholder="e.g. Social media ads" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddExpense}>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default BudgetExpenseManager;
