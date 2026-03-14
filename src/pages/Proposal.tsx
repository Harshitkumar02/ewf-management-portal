import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Proposal = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar - hidden in print */}
      <div className="print:hidden sticky top-0 z-50 bg-background border-b px-6 py-3 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={() => window.print()}>
          <Printer className="w-4 h-4 mr-2" /> Print / Save as PDF
        </Button>
      </div>

      {/* Proposal Content */}
      <div className="max-w-[850px] mx-auto bg-white text-gray-800 shadow-lg my-6 print:my-0 print:shadow-none print:max-w-none">
        
        {/* Cover */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-12 py-16 print:py-12">
          <p className="text-sm tracking-[0.3em] uppercase text-slate-400 mb-2">Project Proposal</p>
          <h1 className="text-4xl font-bold leading-tight mb-3">NGO / Organization<br/>Workforce Management Portal</h1>
          <div className="w-16 h-1 bg-blue-500 rounded mb-6"></div>
          <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
            A comprehensive web-based solution for managing attendance, tasks, leaves, budgets, and reporting — built with modern technology for reliability and scale.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 rounded-lg px-4 py-5">
              <p className="text-3xl font-bold text-blue-400">₹75,000</p>
              <p className="text-sm text-slate-400 mt-1">Project Budget</p>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-5">
              <p className="text-3xl font-bold text-blue-400">6-8</p>
              <p className="text-sm text-slate-400 mt-1">Weeks Timeline</p>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-5">
              <p className="text-3xl font-bold text-blue-400">4</p>
              <p className="text-sm text-slate-400 mt-1">User Roles</p>
            </div>
          </div>
        </div>

        <div className="px-12 py-10 space-y-10 text-[15px] leading-relaxed">

          {/* Executive Summary */}
          <section>
            <SectionTitle>1. Executive Summary</SectionTitle>
            <p>
              We propose to develop a <strong>Workforce Management Portal</strong> tailored for NGO/organizational operations. 
              The portal will streamline employee attendance tracking (with GPS &amp; selfie verification), task management, 
              leave processing, budget/expense tracking, and reporting — all accessible through a modern, responsive web 
              interface with <strong>role-based access control</strong> for Admin, Management, Manager, and Employee users.
            </p>
            <p className="mt-3">
              <strong>Production Technology Stack:</strong> PHP (Backend REST API) + MySQL (Database) + React.js (Frontend UI)
            </p>
          </section>

          {/* Technical Architecture */}
          <section>
            <SectionTitle>2. Technical Architecture</SectionTitle>
            <div className="bg-slate-50 border rounded-lg p-6 font-mono text-sm text-center space-y-2">
              <div className="bg-blue-100 text-blue-800 rounded px-4 py-3 font-semibold">React.js Frontend (Responsive, Mobile-Friendly)</div>
              <div className="text-slate-400">↕ REST API (JSON)</div>
              <div className="bg-green-100 text-green-800 rounded px-4 py-3 font-semibold">PHP Backend (Authentication, Business Logic, File Handling)</div>
              <div className="text-slate-400">↕</div>
              <div className="bg-amber-100 text-amber-800 rounded px-4 py-3 font-semibold">MySQL Database (Users, Attendance, Tasks, Projects, Reports, Expenses)</div>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              <strong>Database Tables:</strong> Users, Districts, Projects, Attendance_Records, Tasks, Leave_Requests, Reports, 
              Expenses, Company_Documents, Geo_Fences, App_Settings, User_Sessions
            </p>
          </section>

          {/* Features */}
          <section>
            <SectionTitle>3. Feature Modules</SectionTitle>

            <FeatureBlock title="3.1 Authentication & User Management">
              <li>Secure login with encrypted passwords (bcrypt) and JWT/session tokens</li>
              <li>4 user roles: Admin, Management, Manager, Employee</li>
              <li>Admin can create, edit, enable/disable, and delete users</li>
              <li>Password reset for all non-admin roles</li>
              <li>Profile photo upload & management</li>
            </FeatureBlock>

            <FeatureBlock title="3.2 Attendance System (GPS + Selfie Verification)">
              <li>GPS-based check-in captures live coordinates</li>
              <li>Mandatory selfie photo during check-in for identity verification</li>
              <li>Automatic late detection based on configurable threshold (default: 9:10 AM)</li>
              <li>Check-out enforcement — disabled until check-in is completed</li>
              <li>Geo-fencing: define allowed check-in zones per project/location</li>
              <li>Monthly attendance reports with filtering by date, user, and district</li>
            </FeatureBlock>

            <FeatureBlock title="3.3 Task Management">
              <li>Hierarchical assignment: Admin/Management → All; Managers → Own team only</li>
              <li>Status tracking: Pending → In Progress → Completed</li>
              <li>Work proof upload: employees submit photo/document evidence of completion</li>
              <li>Due date tracking with overdue visibility</li>
            </FeatureBlock>

            <FeatureBlock title="3.4 Leave Management">
              <li>Employees & Managers submit leave requests with date range and reason</li>
              <li>Admin & Management approve or reject with remarks</li>
              <li>Leave status tracking (Pending / Approved / Rejected)</li>
            </FeatureBlock>

            <FeatureBlock title="3.5 Report Management">
              <li>Managers submit Daily, Weekly, or Monthly reports</li>
              <li>File attachment support (PDF, images, documents)</li>
              <li>Admin & Management review and approve/reject reports</li>
            </FeatureBlock>

            <FeatureBlock title="3.6 Budget & Expense Tracking">
              <li>Set and track budgets per project</li>
              <li>Record expenses with category, amount, and description</li>
              <li>Visual pie chart analytics for category-wise breakdown</li>
              <li>Real-time remaining budget calculation</li>
              <li>Indian currency formatting (₹, Lakhs, Crores)</li>
            </FeatureBlock>

            <FeatureBlock title="3.7 District & Project Management (Admin Only)">
              <li>Add, edit, delete operational districts with state mapping</li>
              <li>Create projects with budget, timeline, status, and district assignment</li>
            </FeatureBlock>

            <FeatureBlock title="3.8 Company Documents">
              <li>Upload and manage organizational documents</li>
              <li>Categorized document storage accessible by Admin & Management</li>
            </FeatureBlock>

            <FeatureBlock title="3.9 System Settings (Admin Only)">
              <li>Configure global maximum check-in time threshold</li>
              <li>System-wide configuration management</li>
            </FeatureBlock>
          </section>

          {/* Role Matrix */}
          <section className="break-before-page">
            <SectionTitle>4. Role-Based Permission Matrix</SectionTitle>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="text-left px-3 py-2.5 rounded-tl-lg">Feature</th>
                    <th className="px-3 py-2.5 text-center">Admin</th>
                    <th className="px-3 py-2.5 text-center">Management</th>
                    <th className="px-3 py-2.5 text-center">Manager</th>
                    <th className="px-3 py-2.5 text-center rounded-tr-lg">Employee</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["User CRUD & Deletion", "✅ Full", "❌", "❌", "❌"],
                    ["Password Reset", "✅", "❌", "❌", "❌"],
                    ["System Settings", "✅", "❌", "❌", "❌"],
                    ["District / Project Mgmt", "✅", "❌", "❌", "❌"],
                    ["View All Attendance", "✅", "✅", "❌", "❌"],
                    ["Own Check-in/out (GPS+Selfie)", "—", "—", "✅", "✅"],
                    ["Task Assignment", "✅ All", "✅ All", "✅ Own Team", "❌"],
                    ["Task Execution & Work Proof", "—", "—", "—", "✅"],
                    ["Leave Application", "—", "—", "✅", "✅"],
                    ["Leave Approval", "✅", "✅", "❌", "❌"],
                    ["Report Upload", "—", "—", "✅", "❌"],
                    ["Report Review", "✅", "✅", "❌", "❌"],
                    ["Budget & Expenses", "✅", "✅", "❌", "❌"],
                    ["Company Documents", "✅", "✅", "❌", "❌"],
                  ].map(([feature, ...roles], i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                      <td className="px-3 py-2 font-medium border-b">{feature}</td>
                      {roles.map((r, j) => (
                        <td key={j} className="px-3 py-2 text-center border-b">{r}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Budget */}
          <section>
            <SectionTitle>5. Project Budget — ₹75,000</SectionTitle>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="text-left px-3 py-2.5 rounded-tl-lg">Phase</th>
                    <th className="text-left px-3 py-2.5">Deliverable</th>
                    <th className="px-3 py-2.5 text-right rounded-tr-lg">Cost (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Phase 1", "UI/UX Design & Frontend Development (React.js)", "20,000"],
                    ["Phase 2", "PHP Backend API & MySQL Database Design", "22,000"],
                    ["Phase 3", "Attendance System (GPS + Selfie + Geo-fencing)", "10,000"],
                    ["Phase 4", "Task, Leave & Report Modules", "8,000"],
                    ["Phase 5", "Budget/Expense Module & Analytics Charts", "5,000"],
                    ["Phase 6", "Testing, Bug Fixes & Deployment", "5,000"],
                    ["Phase 7", "Document Uploads for Backup", "5,000"],
                  ].map(([phase, desc, cost], i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                      <td className="px-3 py-2 font-semibold border-b">{phase}</td>
                      <td className="px-3 py-2 border-b">{desc}</td>
                      <td className="px-3 py-2 text-right font-medium border-b">₹{cost}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-900 text-white font-bold">
                    <td className="px-3 py-3 rounded-bl-lg" colSpan={2}>Total Project Cost</td>
                    <td className="px-3 py-3 text-right rounded-br-lg">₹75,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Timeline */}
          <section>
            <SectionTitle>6. Project Timeline — 6 to 8 Weeks</SectionTitle>
            <div className="space-y-3">
              {[
                { week: "Week 1–2", task: "Database design, Authentication system, Admin panel (User/District/Project CRUD)" },
                { week: "Week 3–4", task: "Attendance module (GPS + Selfie + Geo-fencing), User management refinements" },
                { week: "Week 5", task: "Task management, Leave management, Report submission & review modules" },
                { week: "Week 6", task: "Budget/Expense module, Dashboard analytics, Charts & visualizations" },
                { week: "Week 7", task: "Integration testing, Cross-browser testing, Bug fixes, Performance optimization" },
                { week: "Week 8", task: "Deployment to client server, Documentation, User training session" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap mt-0.5">{item.week}</span>
                  <p>{item.task}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Deliverables */}
          <section>
            <SectionTitle>7. Deliverables</SectionTitle>
            <ul className="space-y-2">
              {[
                "Fully functional web portal (React.js Frontend + PHP Backend + MySQL Database)",
                "Responsive design — works on Desktop, Tablet, and Mobile devices",
                "Complete MySQL database with optimized schema and seed data",
                "Admin panel with full CRUD operations for all modules",
                "GPS + Selfie-based attendance system with geo-fencing",
                "Deployment on client's server (Linux / cPanel / VPS)",
                "Complete source code handover",
                "User manual and technical documentation",
                "30-day post-deployment bug-fix support (free)",
              ].map((item, i) => (
                <li key={i} className="flex gap-2"><span className="text-green-600 font-bold">✓</span> {item}</li>
              ))}
            </ul>
          </section>

          {/* Security */}
          <section>
            <SectionTitle>8. Security Features</SectionTitle>
            <ul className="space-y-2">
              {[
                "Password hashing using bcrypt algorithm",
                "JWT / Session-based authentication with expiry management",
                "Role-based API access control on every endpoint",
                "SQL injection prevention using prepared statements / PDO",
                "File upload validation (type, size, extension checks)",
                "HTTPS enforcement for all data transmission",
                "CORS configuration for API security",
              ].map((item, i) => (
                <li key={i} className="flex gap-2"><span className="text-blue-600">🔒</span> {item}</li>
              ))}
            </ul>
          </section>

          {/* Payment Terms */}
          <section>
            <SectionTitle>9. Payment Terms</SectionTitle>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="text-left px-3 py-2.5 rounded-tl-lg">Milestone</th>
                    <th className="px-3 py-2.5 text-center">Amount</th>
                    <th className="text-left px-3 py-2.5 rounded-tr-lg">When</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Project Kickoff", "₹25,000 (33%)", "On agreement signing"],
                    ["Mid-Project Review", "₹25,000 (33%)", "After Phase 3 completion"],
                    ["Final Delivery", "₹25,000 (34%)", "On deployment & handover"],
                  ].map(([milestone, amount, when], i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                      <td className="px-3 py-2.5 font-medium border-b">{milestone}</td>
                      <td className="px-3 py-2.5 text-center font-semibold border-b">{amount}</td>
                      <td className="px-3 py-2.5 border-b">{when}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Support */}
          <section>
            <SectionTitle>10. Support & Maintenance</SectionTitle>
            <div className="bg-slate-50 border rounded-lg p-5 space-y-3">
              <div className="flex gap-3">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded">INCLUDED</span>
                <p>30-day free bug-fix support after deployment</p>
              </div>
              <div className="flex gap-3">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded">OPTIONAL</span>
                <p>Annual Maintenance Contract (AMC): ₹5,000/month — includes hosting support, minor feature updates, database backups, and priority issue resolution</p>
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="border-t pt-8 mt-10">
            <p className="text-xs text-gray-500 leading-relaxed">
              <strong>Note:</strong> A fully functional frontend prototype has already been developed and is available for demonstration. 
              The production delivery will replace the browser-based storage layer with a secure PHP + MySQL backend, ensuring 
              persistent data storage, multi-user concurrent access, enterprise-grade security, and scalability. 
              Any additional features requested beyond the scope defined in this proposal will be quoted separately.
            </p>
          </section>

          {/* Signature */}
          <section className="mt-12 pt-8 border-t grid grid-cols-2 gap-12">
            <div>
              <p className="text-sm text-gray-500 mb-10">Prepared By (Developer)</p>
              <div className="border-t border-gray-400 pt-2">
                <p className="font-semibold">Signature</p>
                <p className="text-sm text-gray-500">Date: _______________</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-10">Accepted By (Client)</p>
              <div className="border-t border-gray-400 pt-2">
                <p className="font-semibold">Signature</p>
                <p className="text-sm text-gray-500">Date: _______________</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

/* Sub-components */
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-blue-500 inline-block">{children}</h2>
);

const FeatureBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-5">
    <h3 className="font-semibold text-slate-700 mb-2">{title}</h3>
    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">{children}</ul>
  </div>
);

export default Proposal;
