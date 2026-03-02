import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getAll, insert, update, remove, generateId, getCurrentUser, type District } from "@/lib/db";
import { toast } from "@/hooks/use-toast";

const ManageDistricts = () => {
  const currentUser = getCurrentUser();
  const [districts, setDistricts] = useState<District[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", state: "" });

  useEffect(() => { setDistricts(getAll<District>("districts")); }, []);

  const handleSave = () => {
    if (!form.name || !form.state) { toast({ title: "Please fill all fields", variant: "destructive" }); return; }
    if (editId) {
      update<District>("districts", editId, { name: form.name, state: form.state });
    } else {
      insert<District>("districts", { id: generateId(), name: form.name, state: form.state, projects: 0 });
    }
    setDistricts(getAll<District>("districts"));
    setOpen(false);
    setEditId(null);
    setForm({ name: "", state: "" });
    toast({ title: editId ? "District updated" : "District added" });
  };

  const handleEdit = (d: District) => {
    setEditId(d.id);
    setForm({ name: d.name, state: d.state });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    remove("districts", id);
    setDistricts(getAll<District>("districts"));
    toast({ title: "District removed" });
  };

  return (
    <DashboardLayout role="admin" userName={currentUser?.name || "Admin User"}>
      <PageHeader
        title="Manage Districts"
        breadcrumbs={[{ label: "Admin", path: "/admin/dashboard" }, { label: "Districts" }]}
        action={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditId(null); setForm({ name: "", state: "" }); } }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-1.5" /> Add District</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? "Edit" : "Add New"} District</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5"><Label>District Name</Label><Input placeholder="Enter district name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>State / Division</Label><Input placeholder="Enter state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
                <Button className="w-full" onClick={handleSave}>Save District</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>District Name</th><th>State / Division</th><th>Total Projects</th><th>Actions</th></tr></thead>
          <tbody>
            {districts.map((d) => (
              <tr key={d.id}>
                <td className="font-medium">{d.name}</td>
                <td>{d.state}</td>
                <td>{d.projects}</td>
                <td>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(d)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(d.id)}><Trash2 className="w-4 h-4" /></Button>
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
