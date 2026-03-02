import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getAll, insert, update, remove, generateId, getCurrentUser, type Project, type District } from "@/lib/db";
import { toast } from "@/hooks/use-toast";

const ManageProjects = () => {
  const currentUser = getCurrentUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", district: "", budget: "", expense: "", status: "Active" as Project["status"] });

  useEffect(() => {
    setProjects(getAll<Project>("projects"));
    setDistricts(getAll<District>("districts"));
  }, []);

  const handleSave = () => {
    if (!form.name || !form.district) { toast({ title: "Please fill required fields", variant: "destructive" }); return; }
    if (editId) {
      update<Project>("projects", editId, { ...form });
    } else {
      insert<Project>("projects", { id: generateId(), ...form });
    }
    setProjects(getAll<Project>("projects"));
    setOpen(false);
    setEditId(null);
    setForm({ name: "", district: "", budget: "", expense: "", status: "Active" });
    toast({ title: editId ? "Project updated" : "Project added" });
  };

  const handleEdit = (p: Project) => {
    setEditId(p.id);
    setForm({ name: p.name, district: p.district, budget: p.budget, expense: p.expense, status: p.status });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    remove("projects", id);
    setProjects(getAll<Project>("projects"));
    toast({ title: "Project removed" });
  };

  return (
    <DashboardLayout role="admin" userName={currentUser?.name || "Admin User"}>
      <PageHeader
        title="Manage Projects"
        breadcrumbs={[{ label: "Admin", path: "/admin/dashboard" }, { label: "Projects" }]}
        action={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditId(null); setForm({ name: "", district: "", budget: "", expense: "", status: "Active" }); } }}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-1.5" /> Add Project</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? "Edit" : "Add New"} Project</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5"><Label>Project Name</Label><Input placeholder="Enter project name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="space-y-1.5">
                  <Label>District</Label>
                  <Select value={form.district} onValueChange={(v) => setForm({ ...form, district: v })}>
                    <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                    <SelectContent>{districts.map((d) => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Budget</Label><Input placeholder="₹0" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} /></div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Project["status"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Completed">Completed</SelectItem></SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleSave}>Save Project</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Project Name</th><th>District</th><th>Budget</th><th>Expense</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td className="font-medium">{p.name}</td>
                <td>{p.district}</td>
                <td>{p.budget}</td>
                <td>{p.expense}</td>
                <td><span className={`badge-status ${p.status === "Active" ? "badge-active" : "badge-completed"}`}>{p.status}</span></td>
                <td>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(p)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default ManageProjects;
