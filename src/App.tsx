import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const Login = lazy(() => import("./pages/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ManageDistricts = lazy(() => import("./pages/admin/ManageDistricts"));
const ManageProjects = lazy(() => import("./pages/admin/ManageProjects"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const AttendanceView = lazy(() => import("./pages/admin/AttendanceView"));
const CompanyDocuments = lazy(() => import("./pages/admin/CompanyDocuments"));
const BudgetExpenseManager = lazy(() => import("./pages/shared/BudgetExpenseManager"));
const SharedTaskManagement = lazy(() => import("./pages/shared/SharedTaskManagement"));
const ManagementDashboard = lazy(() => import("./pages/management/ManagementDashboard"));
const ManagementReports = lazy(() => import("./pages/management/ManagementReports"));
const ManageLeaves = lazy(() => import("./pages/management/ManageLeaves"));
const ManagerDashboard = lazy(() => import("./pages/manager/ManagerDashboard"));
const ReportUpload = lazy(() => import("./pages/manager/ReportUpload"));
const ManagerLeaveApplication = lazy(() => import("./pages/manager/LeaveApplication"));
const EmployeeDashboard = lazy(() => import("./pages/employee/EmployeeDashboard"));
const EmployeeTasks = lazy(() => import("./pages/employee/EmployeeTasks"));
const LeaveApplication = lazy(() => import("./pages/employee/LeaveApplication"));
const Proposal = lazy(() => import("./pages/Proposal"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
          <Route path="/admin/reports" element={<ManagementReports role="admin" />} />
          <Route path="/admin/documents" element={<CompanyDocuments />} />
          <Route path="/admin/leaves" element={<ManageLeaves role="admin" />} />
          <Route path="/admin/tasks" element={<SharedTaskManagement role="admin" />} />
          <Route path="/admin/budget" element={<BudgetExpenseManager role="admin" />} />
          <Route path="/management/dashboard" element={<ManagementDashboard />} />
          <Route path="/management/reports" element={<ManagementReports />} />
          <Route path="/management/attendance" element={<AttendanceView role="management" />} />
          <Route path="/management/leaves" element={<ManageLeaves />} />
          <Route path="/management/tasks" element={<SharedTaskManagement role="management" />} />
          <Route path="/management/documents" element={<CompanyDocuments role="management" />} />
          <Route path="/management/budget" element={<BudgetExpenseManager role="management" />} />
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/manager/reports" element={<ReportUpload />} />
          <Route path="/manager/tasks" element={<SharedTaskManagement role="manager" />} />
          <Route path="/manager/leave" element={<ManagerLeaveApplication />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/tasks" element={<EmployeeTasks />} />
          <Route path="/employee/leave" element={<LeaveApplication />} />
          <Route path="/proposal" element={<Proposal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
