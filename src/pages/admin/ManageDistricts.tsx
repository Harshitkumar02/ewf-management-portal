import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

const initialDistricts = [
  { name: "Dhaka", state: "Dhaka Division", projects: 12 },
  { name: "Chittagong", state: "Chittagong Division", projects: 8 },
  { name: "Sylhet", state: "Sylhet Division", projects: 6 },
  { name: "Rajshahi", state: "Rajshahi Division", projects: 10 },
  { name: "Khulna", state: "Khulna Division", projects: 5 },
];

const ManageDistricts = () => {
  const [districts] = useState(initialDistricts);
  const [open, setOpen] = useState(false);

  return (
    <DashboardLayout role="admin" userName="Admin User">
      <PageHeader
        title="Manage Districts"
        breadcrumbs={[{ label: "Admin", path: "/admin/dashboard" }, { label: "Districts" }]}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-1.5" /> Add District</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New District</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label>District Name</Label>
                  <Input placeholder="Enter district name" />
                </div>
                <div className="space-y-1.5">
                  <Label>State / Division</Label>
                  <Input placeholder="Enter state" />
                </div>
                <Button className="w-full" onClick={() => setOpen(false)}>Save District</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>District Name</th>
              <th>State / Division</th>
              <th>Total Projects</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {districts.map((d, i) => (
              <tr key={i}>
                <td className="font-medium">{d.name}</td>
                <td>{d.state}</td>
                <td>{d.projects}</td>
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

export default ManageDistricts;
