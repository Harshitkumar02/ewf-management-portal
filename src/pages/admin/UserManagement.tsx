import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Ban } from "lucide-react";
import { getAll, insert, update, generateId, getCurrentUser, type User, type District, type Project } from "@/lib/db";
import { toast } from "@/hooks/use-toast";

const UserManagement = () => {
  const currentUser = getCurrentUser();
  const [users, setUsers] = useState<User[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "" as User["role"], district: "", project: "" });

  useEffect(() => {
    setUsers(getAll<User>("users"));
    setDistricts(getAll<District>("districts"));
    setProjects(getAll<Project>("projects"));
  }, []);

  const handleSave = () => {
    if (!form.name || !form.email || !form.role) { toast({ title: "Please fill required fields", variant: "destructive" }); return; }
    if (editId) {
      update<User>("users", editId, { name: form.name, email: form.email, role: form.role, district: form.district || "—", project: form.project || "—" });
    } else {
      insert<User>("users", { id: generateId(), name: form.name, email: form.email, password: form.password || "pass123", role: form.role, district: form.district || "—", project: form.project || "—", status: "Active" });
    }
    setUsers(getAll<User>("users"));
    setOpen(false);
    setEditId(null);
    setForm({ name: "", email: "", password: "", role: "" as User["role"], district: "", project: "" });
    toast({ title: editId ? "User updated" : "User added" });
  };

  const handleEdit = (u: User) => {
    setEditId(u.id);
    setForm({ name: u.name, email: u.email, password: "", role: u.role, district: u.district, project: u.project });
    setOpen(true);
  };

  const handleToggleStatus = (u: User) => {
    update<User>("users", u.id, { status: u.status === "Active" ? "Disabled" : "Active" });
    setUsers(getAll<User>("users"));
    toast({ title: `User ${u.status === "Active" ? "disabled" : "enabled"}` });
  };

  return (
    <DashboardLayout role="admin" userName={currentUser?.name || "Admin User"}>
      <PageHeader
        title="User Management"
        breadcrumbs={[{ label: "Admin", path: "/admin/dashboard" }, { label: "Users" }]}
        action={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditId(null); setForm({ name: "", email: "", password: "", role: "" as User["role"], district: "", project: "" }); } }}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-1.5" /> Add User</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? "Edit" : "Add New"} User</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5"><Label>Full Name</Label><Input placeholder="Enter name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Email</Label><Input type="email" placeholder="user@ngo.org" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                {!editId && <div className="space-y-1.5"><Label>Password</Label><Input type="password" placeholder="Set password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>}
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as User["role"] })}>
                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="management">Management</SelectItem>
                      <SelectItem value="manager">Project Manager</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>District</Label>
                  <Select value={form.district} onValueChange={(v) => setForm({ ...form, district: v })}>
                    <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                    <SelectContent>{districts.map((d) => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Project</Label>
                  <Select value={form.project} onValueChange={(v) => setForm({ ...form, project: v })}>
                    <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                    <SelectContent>{projects.map((p) => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleSave}>Save User</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>District</th><th>Project</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="font-medium">{u.name}</td>
                <td>{u.email}</td>
                <td className="capitalize">{u.role}</td>
                <td>{u.district}</td>
                <td>{u.project}</td>
                <td><span className={`badge-status ${u.status === "Active" ? "badge-active" : "badge-rejected"}`}>{u.status}</span></td>
                <td>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(u)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleToggleStatus(u)}><Ban className="w-4 h-4" /></Button>
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

export default UserManagement;
