import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil } from "lucide-react";

const tasks = [
  { title: "Survey village water sources", assignedTo: "Aisha Khan", dueDate: "2026-03-05", status: "Pending" },
  { title: "Submit field visit report", assignedTo: "Karim Shah", dueDate: "2026-03-03", status: "Completed" },
  { title: "Coordinate health camp", assignedTo: "Aisha Khan", dueDate: "2026-03-07", status: "Pending" },
];

const TaskManagement = () => {
  const [open, setOpen] = useState(false);

  return (
    <DashboardLayout role="manager" userName="Rahul Mehta">
      <PageHeader
        title="Task Management"
        breadcrumbs={[{ label: "Manager", path: "/manager/dashboard" }, { label: "Tasks" }]}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-1.5" /> Assign Task</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Assign New Task</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label>Select Employee</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Choose employee" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aisha">Aisha Khan</SelectItem>
                      <SelectItem value="karim">Karim Shah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Task Title</Label><Input placeholder="Enter task title" /></div>
                <div className="space-y-1.5"><Label>Description</Label><Textarea placeholder="Task details..." rows={3} /></div>
                <div className="space-y-1.5"><Label>Due Date</Label><Input type="date" /></div>
                <Button className="w-full" onClick={() => setOpen(false)}>Assign Task</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Task Title</th><th>Assigned To</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {tasks.map((t, i) => (
              <tr key={i}>
                <td className="font-medium">{t.title}</td>
                <td>{t.assignedTo}</td>
                <td>{t.dueDate}</td>
                <td><span className={`badge-status ${t.status === "Completed" ? "badge-completed" : "badge-pending"}`}>{t.status}</span></td>
                <td><Button variant="ghost" size="sm"><Pencil className="w-4 h-4" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default TaskManagement;
