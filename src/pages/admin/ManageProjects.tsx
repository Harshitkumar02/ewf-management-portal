import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

const projects = [
  { name: "Clean Water Initiative", district: "Dhaka", budget: "₹50,00,000", expense: "₹32,00,000", status: "Active" },
  { name: "Rural Education Program", district: "Chittagong", budget: "₹30,00,000", expense: "₹28,00,000", status: "Active" },
  { name: "Healthcare Outreach", district: "Sylhet", budget: "₹45,00,000", expense: "₹45,00,000", status: "Completed" },
  { name: "Women Empowerment", district: "Rajshahi", budget: "₹20,00,000", expense: "₹12,00,000", status: "Active" },
  { name: "Agriculture Support", district: "Khulna", budget: "₹25,00,000", expense: "₹25,00,000", status: "Completed" },
];

const ManageProjects = () => {
  const [open, setOpen] = useState(false);

  return (
    <DashboardLayout role="admin" userName="Admin User">
      <PageHeader
        title="Manage Projects"
        breadcrumbs={[{ label: "Admin", path: "/admin/dashboard" }, { label: "Projects" }]}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-1.5" /> Add Project</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Project</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5"><Label>Project Name</Label><Input placeholder="Enter project name" /></div>
                <div className="space-y-1.5">
                  <Label>District</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dhaka">Dhaka</SelectItem>
                      <SelectItem value="chittagong">Chittagong</SelectItem>
                      <SelectItem value="sylhet">Sylhet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Start Date</Label><Input type="date" /></div>
                  <div className="space-y-1.5"><Label>End Date</Label><Input type="date" /></div>
                </div>
                <div className="space-y-1.5"><Label>Budget</Label><Input placeholder="₹0" /></div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={() => setOpen(false)}>Save Project</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr><th>Project Name</th><th>District</th><th>Budget</th><th>Expense</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {projects.map((p, i) => (
              <tr key={i}>
                <td className="font-medium">{p.name}</td>
                <td>{p.district}</td>
                <td>{p.budget}</td>
                <td>{p.expense}</td>
                <td><span className={`badge-status ${p.status === "Active" ? "badge-active" : "badge-completed"}`}>{p.status}</span></td>
                <td>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm"><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
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
