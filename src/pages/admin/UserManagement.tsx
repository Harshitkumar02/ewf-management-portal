import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Ban, Trash2, KeyRound } from "lucide-react";
import { getAll, insert, update, remove, generateId, getCurrentUser, type User, type District, type Project } from "@/lib/db";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const UserManagement = () => {
  const currentUser = getCurrentUser();
  const [users, setUsers] = useState<User[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "" as User["role"], district: "", project: "", managerId: "" });
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    setUsers(getAll<User>("users"));
    setDistricts(getAll<District>("districts"));
    setProjects(getAll<Project>("projects"));
  }, []);

  const handleSave = () => {
    if (!form.name || !form.email || !form.role) { toast({ title: "Please fill required fields", variant: "destructive" }); return; }
    const managerId = form.role === "employee" ? form.managerId || undefined : undefined;
    if (editId) {
      update<User>("users", editId, { name: form.name, email: form.email, role: form.role, district: form.district || "—", project: form.project || "—", managerId });
    } else {
      insert<User>("users", { id: generateId(), name: form.name, email: form.email, password: form.password || "pass123", role: form.role, district: form.district || "—", project: form.project || "—", status: "Active", managerId });
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

  const handleDelete = (u: User) => {
    remove("users", u.id);
    setUsers(getAll<User>("users"));
    toast({ title: `User "${u.name}" deleted` });
  };

  const handleResetPassword = () => {
    if (!resetPasswordUser || !newPassword.trim()) {
      toast({ title: "Please enter a new password", variant: "destructive" });
      return;
    }
    update<User>("users", resetPasswordUser.id, { password: newPassword.trim() });
    setUsers(getAll<User>("users"));
    setResetPasswordOpen(false);
    setResetPasswordUser(null);
    setNewPassword("");
    toast({ title: `Password reset for "${resetPasswordUser.name}"` });
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
                    {u.role !== "admin" && (
                      <Button variant="ghost" size="sm" onClick={() => { setResetPasswordUser(u); setNewPassword(""); setResetPasswordOpen(true); }}>
                        <KeyRound className="w-4 h-4" />
                      </Button>
                    )}
                    {(u.role === "manager" || u.role === "employee") && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>Are you sure you want to delete "{u.name}"? This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(u)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={resetPasswordOpen} onOpenChange={(v) => { setResetPasswordOpen(v); if (!v) { setResetPasswordUser(null); setNewPassword(""); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reset Password</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">Set a new password for <span className="font-medium text-foreground">{resetPasswordUser?.name}</span></p>
            <div className="space-y-1.5">
              <Label>New Password</Label>
              <Input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <Button className="w-full" onClick={handleResetPassword}>Reset Password</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UserManagement;
