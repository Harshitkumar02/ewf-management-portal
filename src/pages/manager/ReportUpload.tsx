import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const previousReports = [
  { name: "Weekly Progress - W9", type: "Weekly", date: "2026-02-28", status: "Approved" },
  { name: "Daily Report - Mar 1", type: "Daily", date: "2026-03-01", status: "Pending" },
  { name: "Monthly Summary - Feb", type: "Monthly", date: "2026-02-28", status: "Pending" },
];

const ReportUpload = () => {
  return (
    <DashboardLayout role="manager" userName="Rahul Mehta">
      <PageHeader title="Upload Report" breadcrumbs={[{ label: "Manager", path: "/manager/dashboard" }, { label: "Reports" }]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-md shadow-sm p-6">
          <h3 className="font-heading font-semibold mb-4">New Report</h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Report Type</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Upload File</Label>
              <Input type="file" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea placeholder="Add report description..." rows={4} />
            </div>
            <Button className="w-full">Submit Report</Button>
          </div>
        </div>

        <div className="bg-card border rounded-md shadow-sm overflow-x-auto">
          <div className="p-4 border-b"><h3 className="font-heading font-semibold">Previous Reports</h3></div>
          <table className="data-table">
            <thead><tr><th>Report</th><th>Type</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {previousReports.map((r, i) => (
                <tr key={i}>
                  <td className="font-medium">{r.name}</td>
                  <td>{r.type}</td>
                  <td>{r.date}</td>
                  <td><span className={`badge-status ${r.status === "Approved" ? "badge-approved" : "badge-pending"}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportUpload;
