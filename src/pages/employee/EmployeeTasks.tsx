import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { getAll, getCurrentUser, update, type Task } from "@/lib/db";
import { toast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

const EmployeeTasks = () => {
  const currentUser = getCurrentUser();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    setTasks(getAll<Task>("tasks").filter((t) => t.assignedTo === currentUser.id));
  }, []);

  const markComplete = (id: string) => {
    update<Task>("tasks", id, { status: "Completed" });
    setTasks(getAll<Task>("tasks").filter((t) => t.assignedTo === currentUser?.id));
    toast({ title: "Task marked as completed" });
  };

  return (
    <DashboardLayout role="employee" userName={currentUser?.name || "Employee"}>
      <PageHeader title="My Tasks" breadcrumbs={[{ label: "Employee", path: "/employee/dashboard" }, { label: "Tasks" }]} />

      <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Task</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id}>
                <td className="font-medium">{t.title}</td>
                <td>{t.dueDate}</td>
                <td><span className={`badge-status ${t.status === "Completed" ? "badge-completed" : "badge-pending"}`}>{t.status}</span></td>
                <td>
                  {t.status !== "Completed" && (
                    <Button variant="ghost" size="sm" onClick={() => markComplete(t.id)}>
                      <CheckCircle className="w-4 h-4 mr-1 text-success" /> Complete
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeTasks;
