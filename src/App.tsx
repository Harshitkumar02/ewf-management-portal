import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageDistricts from "./pages/admin/ManageDistricts";
import ManageProjects from "./pages/admin/ManageProjects";
import UserManagement from "./pages/admin/UserManagement";
import AttendanceView from "./pages/admin/AttendanceView";
import CompanyDocuments from "./pages/admin/CompanyDocuments";
import ManagementDashboard from "./pages/management/ManagementDashboard";
import ManagementReports from "./pages/management/ManagementReports";
import ManageLeaves from "./pages/management/ManageLeaves";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ReportUpload from "./pages/manager/ReportUpload";
import TaskManagement from "./pages/manager/TaskManagement";
import ManagerLeaveApplication from "./pages/manager/LeaveApplication";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeTasks from "./pages/employee/EmployeeTasks";
import LeaveApplication from "./pages/employee/LeaveApplication";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/districts" element={<ManageDistricts />} />
          <Route path="/admin/projects" element={<ManageProjects />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/attendance" element={<AttendanceView />} />
          <Route path="/admin/documents" element={<CompanyDocuments />} />
          <Route path="/management/dashboard" element={<ManagementDashboard />} />
          <Route path="/management/reports" element={<ManagementReports />} />
          <Route path="/management/attendance" element={<AttendanceView role="management" />} />
          <Route path="/management/leaves" element={<ManageLeaves />} />
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/manager/reports" element={<ReportUpload />} />
          <Route path="/manager/tasks" element={<TaskManagement />} />
          <Route path="/manager/leave" element={<ManagerLeaveApplication />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/tasks" element={<EmployeeTasks />} />
          <Route path="/employee/leave" element={<LeaveApplication />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
