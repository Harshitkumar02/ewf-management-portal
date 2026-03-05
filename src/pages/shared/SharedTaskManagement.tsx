import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { getAll, getCurrentUser, insert, generateId, type Task, type User } from "@/lib/db";
import { toast } from "@/hooks/use-toast";

interface SharedTaskManagementProps {
  role: "admin" | "management" | "manager";
}

const roleLabel: Record<string, string> = { admin: "Admin", management: "Management", manager: "Manager" };
const dashboardPath: Record<string, string> = { admin: "/admin/dashboard", management: "/management/dashboard", manager: "/manager/dashboard" };

const SharedTaskManagement = ({ role }: SharedTaskManagementProps) => {
  const currentUser = getCurrentUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignees, setAssignees] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ assignedTo: "", title: "", description: "", dueDate: "" });

  const refresh = () => {
    setTasks(getAll<Task>("tasks").filter((t) => t.assignedBy === currentUser?.id));
  };

  useEffect(() => {
    refresh();
    const users = getAll<User>("users").filter((u) => u.status === "Active");
    // Admin & management assign to project managers and employees; managers assign to employees
    if (role === "admin" || role === "management") {
      setAssignees(users.filter((u) => u.role === "manager" || u.role === "employee"));
    } else {
      setAssignees(users.filter((u) => u.role === "employee"));
    }
  }, []);

  const handleSave = () => {
    if (!form.assignedTo || !form.title || !form.dueDate) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    const assignee = assignees.find((e) => e.id === form.assignedTo);
    insert<Task>("tasks", {
      id: generateId(),
      title: form.title,
      description: form.description,
      assignedTo: form.assignedTo,
      assignedToName: assignee?.name || "",
      assignedBy: currentUser?.id || "",
      dueDate: form.dueDate,
      status: "Pending",
    });
    refresh();
    setOpen(false);
    setForm({ assignedTo: "", title: "", description: "", dueDate: "" });
    toast({ title: "Task assigned successfully" });
  };

  const assigneeLabel = "Select Assignee";

  return (
    <DashboardLayout role={role} userName={currentUser?.name || roleLabel[role]}>
      <PageHeader
        title="Task Management"
        breadcrumbs={[{ label: roleLabel[role], path: dashboardPath[role] }, { label: "Tasks" }]}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-1.5" /> Assign Task</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Assign New Task</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label>{assigneeLabel}</Label>
                  <Select value={form.assignedTo} onValueChange={(v) => setForm({ ...form, assignedTo: v })}>
                    <SelectTrigger><SelectValue placeholder="Choose assignee" /></SelectTrigger>
                    <SelectContent>{assignees.map((e) => <SelectItem key={e.id} value={e.id}>{e.name} — <span className="capitalize">{e.role === "manager" ? "Project Manager" : "Employee"}</span> ({e.district})</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Task Title</Label><Input placeholder="Enter task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Description</Label><Textarea placeholder="Task details..." rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Due Date</Label><Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></div>
                <Button className="w-full" onClick={handleSave}>Assign Task</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Task Title</th><th>Assigned To</th><th>Due Date</th><th>Status</th></tr></thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr><td colSpan={4} className="text-center text-muted-foreground py-6">No tasks assigned yet</td></tr>
            ) : tasks.map((t) => (
              <tr key={t.id}>
                <td className="font-medium">{t.title}</td>
                <td>{t.assignedToName}</td>
                <td>{t.dueDate}</td>
                <td><span className={`badge-status ${t.status === "Completed" ? "badge-completed" : t.status === "In Progress" ? "badge-pending" : "badge-pending"}`}>{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default SharedTaskManagement;
