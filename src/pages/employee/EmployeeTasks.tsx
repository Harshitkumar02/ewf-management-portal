import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";

const tasks = [
  { title: "Survey village water sources", dueDate: "2026-03-05", status: "Pending" },
  { title: "Submit field visit report", dueDate: "2026-03-03", status: "Completed" },
  { title: "Coordinate with local health center", dueDate: "2026-03-07", status: "Pending" },
];

const EmployeeTasks = () => {
  return (
    <DashboardLayout role="employee" userName="Aisha Khan">
      <PageHeader title="My Tasks" breadcrumbs={[{ label: "Employee", path: "/employee/dashboard" }, { label: "Tasks" }]} />

      <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Task</th><th>Due Date</th><th>Status</th></tr></thead>
          <tbody>
            {tasks.map((t, i) => (
              <tr key={i}>
                <td className="font-medium">{t.title}</td>
                <td>{t.dueDate}</td>
                <td><span className={`badge-status ${t.status === "Completed" ? "badge-completed" : "badge-pending"}`}>{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeTasks;
