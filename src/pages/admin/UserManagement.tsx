import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Ban } from "lucide-react";

const users = [
  { name: "Rahul Mehta", email: "rahul@ngo.org", role: "Project Manager", district: "Dhaka", project: "Clean Water", status: "Active" },
  { name: "Aisha Khan", email: "aisha@ngo.org", role: "Employee", district: "Chittagong", project: "Rural Education", status: "Active" },
  { name: "Karim Shah", email: "karim@ngo.org", role: "Employee", district: "Sylhet", project: "Healthcare", status: "Active" },
  { name: "Nadia Fatima", email: "nadia@ngo.org", role: "Management", district: "—", project: "—", status: "Active" },
  { name: "Tanvir Hassan", email: "tanvir@ngo.org", role: "Project Manager", district: "Khulna", project: "Agriculture", status: "Disabled" },
];

const UserManagement = () => {
  const [open, setOpen] = useState(false);

  return (
    <DashboardLayout role="admin" userName="Admin User">
      <PageHeader
        title="User Management"
        breadcrumbs={[{ label: "Admin", path: "/admin/dashboard" }, { label: "Users" }]}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-1.5" /> Add User</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New User</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5"><Label>Full Name</Label><Input placeholder="Enter name" /></div>
                <div className="space-y-1.5"><Label>Email</Label><Input type="email" placeholder="user@ngo.org" /></div>
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="management">Management</SelectItem>
                      <SelectItem value="manager">Project Manager</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Assign District</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dhaka">Dhaka</SelectItem>
                      <SelectItem value="chittagong">Chittagong</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Assign Project</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clean-water">Clean Water Initiative</SelectItem>
                      <SelectItem value="education">Rural Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={() => setOpen(false)}>Save User</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>District</th><th>Project</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i}>
                <td className="font-medium">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.district}</td>
                <td>{u.project}</td>
                <td><span className={`badge-status ${u.status === "Active" ? "badge-active" : "badge-rejected"}`}>{u.status}</span></td>
                <td>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm"><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive"><Ban className="w-4 h-4" /></Button>
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
