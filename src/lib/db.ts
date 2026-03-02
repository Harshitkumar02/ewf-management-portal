// localStorage-based database for the NGO Management Portal
// All data persists in the browser's localStorage

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "management" | "manager" | "employee";
  district: string;
  project: string;
  status: "Active" | "Disabled";
}

export interface District {
  id: string;
  name: string;
  state: string;
  projects: number;
}

export interface Project {
  id: string;
  name: string;
  district: string;
  budget: string;
  expense: string;
  status: "Active" | "Completed";
  startDate?: string;
  endDate?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  district: string;
  project: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "Present" | "Late" | "Absent";
  location: string;
  gps: string;
  selfie: boolean;
  photo?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  assignedToName: string;
  assignedBy: string;
  dueDate: string;
  status: "Pending" | "Completed" | "In Progress";
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  from: string;
  to: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  approvedBy: string;
}

export interface Report {
  id: string;
  name: string;
  project: string;
  district: string;
  submittedBy: string;
  submittedByName: string;
  date: string;
  type: "Daily" | "Weekly" | "Monthly";
  status: "Pending" | "Approved" | "Rejected";
  description?: string;
}

export interface GeoFence {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  projectId?: string;
}

// ---- Seed Data ----

const SEED_USERS: User[] = [
  { id: "u1", name: "Admin User", email: "admin@ngo.org", password: "admin123", role: "admin", district: "—", project: "—", status: "Active" },
  { id: "u2", name: "Nadia Fatima", email: "nadia@ngo.org", password: "nadia123", role: "management", district: "—", project: "—", status: "Active" },
  { id: "u3", name: "Rahul Mehta", email: "rahul@ngo.org", password: "rahul123", role: "manager", district: "Dhaka", project: "Clean Water Initiative", status: "Active" },
  { id: "u4", name: "Aisha Khan", email: "aisha@ngo.org", password: "aisha123", role: "employee", district: "Chittagong", project: "Rural Education Program", status: "Active" },
  { id: "u5", name: "Karim Shah", email: "karim@ngo.org", password: "karim123", role: "employee", district: "Sylhet", project: "Healthcare Outreach", status: "Active" },
  { id: "u6", name: "Tanvir Hassan", email: "tanvir@ngo.org", password: "tanvir123", role: "manager", district: "Khulna", project: "Agriculture Support", status: "Disabled" },
];

const SEED_DISTRICTS: District[] = [
  { id: "d1", name: "Dhaka", state: "Dhaka Division", projects: 12 },
  { id: "d2", name: "Chittagong", state: "Chittagong Division", projects: 8 },
  { id: "d3", name: "Sylhet", state: "Sylhet Division", projects: 6 },
  { id: "d4", name: "Rajshahi", state: "Rajshahi Division", projects: 10 },
  { id: "d5", name: "Khulna", state: "Khulna Division", projects: 5 },
];

const SEED_PROJECTS: Project[] = [
  { id: "p1", name: "Clean Water Initiative", district: "Dhaka", budget: "₹50,00,000", expense: "₹32,00,000", status: "Active" },
  { id: "p2", name: "Rural Education Program", district: "Chittagong", budget: "₹30,00,000", expense: "₹28,00,000", status: "Active" },
  { id: "p3", name: "Healthcare Outreach", district: "Sylhet", budget: "₹45,00,000", expense: "₹45,00,000", status: "Completed" },
  { id: "p4", name: "Women Empowerment", district: "Rajshahi", budget: "₹20,00,000", expense: "₹12,00,000", status: "Active" },
  { id: "p5", name: "Agriculture Support", district: "Khulna", budget: "₹25,00,000", expense: "₹25,00,000", status: "Completed" },
];

const SEED_ATTENDANCE: AttendanceRecord[] = [
  { id: "a1", userId: "u4", userName: "Aisha Khan", district: "Chittagong", project: "Rural Education Program", date: "2026-03-01", checkIn: "09:02 AM", checkOut: "05:30 PM", status: "Present", location: "Chittagong Field", gps: "22.3571, 91.7834", selfie: true },
  { id: "a2", userId: "u5", userName: "Karim Shah", district: "Sylhet", project: "Healthcare Outreach", date: "2026-03-01", checkIn: "09:15 AM", checkOut: "05:00 PM", status: "Late", location: "Sylhet Center", gps: "24.8950, 91.8690", selfie: true },
  { id: "a3", userId: "u3", userName: "Rahul Mehta", district: "Dhaka", project: "Clean Water Initiative", date: "2026-03-01", checkIn: "—", checkOut: "—", status: "Absent", location: "—", gps: "—", selfie: false },
  { id: "a4", userId: "u6", userName: "Tanvir Hassan", district: "Khulna", project: "Agriculture Support", date: "2026-03-01", checkIn: "08:55 AM", checkOut: "05:45 PM", status: "Present", location: "Khulna Office", gps: "22.8458, 89.5405", selfie: true },
  { id: "a5", userId: "u4", userName: "Aisha Khan", district: "Chittagong", project: "Rural Education Program", date: "2026-02-28", checkIn: "09:15 AM", checkOut: "05:00 PM", status: "Late", location: "Chittagong Field", gps: "22.3571, 91.7834", selfie: true },
  { id: "a6", userId: "u4", userName: "Aisha Khan", district: "Chittagong", project: "Rural Education Program", date: "2026-02-27", checkIn: "08:55 AM", checkOut: "05:45 PM", status: "Present", location: "Chittagong Field", gps: "22.3571, 91.7834", selfie: true },
];

const SEED_TASKS: Task[] = [
  { id: "t1", title: "Survey village water sources", assignedTo: "u4", assignedToName: "Aisha Khan", assignedBy: "u3", dueDate: "2026-03-05", status: "Pending" },
  { id: "t2", title: "Submit field visit report", assignedTo: "u5", assignedToName: "Karim Shah", assignedBy: "u3", dueDate: "2026-03-03", status: "Completed" },
  { id: "t3", title: "Coordinate with local health center", assignedTo: "u4", assignedToName: "Aisha Khan", assignedBy: "u3", dueDate: "2026-03-07", status: "Pending" },
];

const SEED_LEAVES: LeaveRequest[] = [
  { id: "l1", userId: "u4", userName: "Aisha Khan", from: "2026-02-15", to: "2026-02-16", reason: "Family event", status: "Approved", approvedBy: "Rahul M." },
  { id: "l2", userId: "u4", userName: "Aisha Khan", from: "2026-01-10", to: "2026-01-10", reason: "Personal", status: "Rejected", approvedBy: "Rahul M." },
  { id: "l3", userId: "u4", userName: "Aisha Khan", from: "2025-12-24", to: "2025-12-26", reason: "Holiday", status: "Approved", approvedBy: "Rahul M." },
];

const SEED_REPORTS: Report[] = [
  { id: "r1", name: "Weekly Progress - W9", project: "Clean Water Initiative", district: "Dhaka", submittedBy: "u3", submittedByName: "Rahul M.", date: "2026-02-28", type: "Weekly", status: "Approved" },
  { id: "r2", name: "Daily Report - Mar 1", project: "Clean Water Initiative", district: "Dhaka", submittedBy: "u3", submittedByName: "Rahul M.", date: "2026-03-01", type: "Daily", status: "Pending" },
  { id: "r3", name: "Monthly Summary - Feb", project: "Clean Water Initiative", district: "Dhaka", submittedBy: "u3", submittedByName: "Rahul M.", date: "2026-02-28", type: "Monthly", status: "Pending" },
  { id: "r4", name: "Rural Education Report", project: "Rural Education Program", district: "Chittagong", submittedBy: "u4", submittedByName: "Aisha K.", date: "2026-02-28", type: "Monthly", status: "Approved" },
  { id: "r5", name: "Healthcare Weekly", project: "Healthcare Outreach", district: "Sylhet", submittedBy: "u5", submittedByName: "Karim S.", date: "2026-02-27", type: "Daily", status: "Rejected" },
  { id: "r6", name: "Women Empowerment Update", project: "Women Empowerment", district: "Rajshahi", submittedBy: "u2", submittedByName: "Nadia F.", date: "2026-03-01", type: "Weekly", status: "Pending" },
  { id: "r7", name: "Agriculture Monthly", project: "Agriculture Support", district: "Khulna", submittedBy: "u6", submittedByName: "Tanvir H.", date: "2026-02-28", type: "Monthly", status: "Approved" },
];

const SEED_GEOFENCES: GeoFence[] = [
  { id: "g1", name: "Dhaka Office", latitude: 23.8103, longitude: 90.4125, radiusMeters: 500 },
  { id: "g2", name: "Chittagong Field", latitude: 22.3569, longitude: 91.7832, radiusMeters: 1000 },
  { id: "g3", name: "Sylhet Center", latitude: 24.8949, longitude: 91.8687, radiusMeters: 500 },
  { id: "g4", name: "Rajshahi Office", latitude: 24.3745, longitude: 88.6042, radiusMeters: 500 },
  { id: "g5", name: "Khulna Office", latitude: 22.8456, longitude: 89.5403, radiusMeters: 500 },
];

// ---- Core DB Engine ----

type CollectionName = "users" | "districts" | "projects" | "attendance" | "tasks" | "leaves" | "reports" | "geofences" | "session";

const SEEDS: Record<string, unknown[]> = {
  users: SEED_USERS,
  districts: SEED_DISTRICTS,
  projects: SEED_PROJECTS,
  attendance: SEED_ATTENDANCE,
  tasks: SEED_TASKS,
  leaves: SEED_LEAVES,
  reports: SEED_REPORTS,
  geofences: SEED_GEOFENCES,
};

function getKey(collection: CollectionName): string {
  return `ngo_db_${collection}`;
}

function initCollection(collection: CollectionName): void {
  const key = getKey(collection);
  if (!localStorage.getItem(key) && SEEDS[collection]) {
    localStorage.setItem(key, JSON.stringify(SEEDS[collection]));
  }
}

export function initDB(): void {
  Object.keys(SEEDS).forEach((c) => initCollection(c as CollectionName));
}

export function getAll<T>(collection: CollectionName): T[] {
  initCollection(collection);
  const data = localStorage.getItem(getKey(collection));
  return data ? JSON.parse(data) : [];
}

export function getById<T extends { id: string }>(collection: CollectionName, id: string): T | undefined {
  return getAll<T>(collection).find((item) => item.id === id);
}

export function insert<T extends { id: string }>(collection: CollectionName, item: T): T {
  const items = getAll<T>(collection);
  items.push(item);
  localStorage.setItem(getKey(collection), JSON.stringify(items));
  return item;
}

export function update<T extends { id: string }>(collection: CollectionName, id: string, updates: Partial<T>): T | undefined {
  const items = getAll<T>(collection);
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return undefined;
  items[idx] = { ...items[idx], ...updates };
  localStorage.setItem(getKey(collection), JSON.stringify(items));
  return items[idx];
}

export function remove(collection: CollectionName, id: string): boolean {
  const items = getAll<{ id: string }>(collection);
  const filtered = items.filter((i) => i.id !== id);
  if (filtered.length === items.length) return false;
  localStorage.setItem(getKey(collection), JSON.stringify(filtered));
  return true;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

// ---- Session ----

export function login(email: string, password: string): User | null {
  const users = getAll<User>("users");
  const user = users.find((u) => u.email === email && u.password === password && u.status === "Active");
  if (user) {
    localStorage.setItem(getKey("session"), JSON.stringify(user));
  }
  return user || null;
}

export function logout(): void {
  localStorage.removeItem(getKey("session"));
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(getKey("session"));
  return data ? JSON.parse(data) : null;
}

export function resetDB(): void {
  Object.keys(SEEDS).forEach((c) => {
    localStorage.removeItem(getKey(c as CollectionName));
  });
  localStorage.removeItem(getKey("session"));
  initDB();
}
