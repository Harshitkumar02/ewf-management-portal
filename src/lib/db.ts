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
  fileData?: string;
  fileName?: string;
  fileType?: string;
}

export interface GeoFence {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  projectId?: string;
}

export interface AppSettings {
  id: string;
  maxCheckInTime: string; // HH:mm format e.g. "09:10"
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

const SEED_ATTENDANCE: AttendanceRecord[] = [];

const SEED_TASKS: Task[] = [];

const SEED_LEAVES: LeaveRequest[] = [];

const SEED_REPORTS: Report[] = [];

const SEED_GEOFENCES: GeoFence[] = [
  { id: "g1", name: "Dhaka Office", latitude: 23.8103, longitude: 90.4125, radiusMeters: 500 },
  { id: "g2", name: "Chittagong Field", latitude: 22.3569, longitude: 91.7832, radiusMeters: 1000 },
  { id: "g3", name: "Sylhet Center", latitude: 24.8949, longitude: 91.8687, radiusMeters: 500 },
  { id: "g4", name: "Rajshahi Office", latitude: 24.3745, longitude: 88.6042, radiusMeters: 500 },
  { id: "g5", name: "Khulna Office", latitude: 22.8456, longitude: 89.5403, radiusMeters: 500 },
];

const SEED_SETTINGS: AppSettings[] = [
  { id: "s1", maxCheckInTime: "09:10" },
];

// ---- Core DB Engine ----

type CollectionName = "users" | "districts" | "projects" | "attendance" | "tasks" | "leaves" | "reports" | "geofences" | "settings" | "session";

const SEEDS: Record<string, unknown[]> = {
  users: SEED_USERS,
  districts: SEED_DISTRICTS,
  projects: SEED_PROJECTS,
  attendance: SEED_ATTENDANCE,
  tasks: SEED_TASKS,
  leaves: SEED_LEAVES,
  reports: SEED_REPORTS,
  geofences: SEED_GEOFENCES,
  settings: SEED_SETTINGS,
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

// Force a one-time reset so user starts fresh
const RESET_VERSION_KEY = "ngo_db_reset_v5";
export function initDB(): void {
  if (!localStorage.getItem(RESET_VERSION_KEY)) {
    Object.keys(SEEDS).forEach((c) => {
      localStorage.removeItem(getKey(c as CollectionName));
    });
    localStorage.removeItem(getKey("session"));
    localStorage.setItem(RESET_VERSION_KEY, "true");
  }
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

export function getMaxCheckInTime(): string {
  const settings = getAll<AppSettings>("settings");
  return settings.length > 0 ? settings[0].maxCheckInTime : "09:10";
}

export function setMaxCheckInTime(time: string): void {
  const settings = getAll<AppSettings>("settings");
  if (settings.length > 0) {
    update<AppSettings>("settings", settings[0].id, { maxCheckInTime: time });
  } else {
    insert<AppSettings>("settings", { id: "s1", maxCheckInTime: time });
  }
}

export function isCheckInLate(): boolean {
  const maxTime = getMaxCheckInTime();
  const [maxH, maxM] = maxTime.split(":").map(Number);
  const now = new Date();
  return now.getHours() > maxH || (now.getHours() === maxH && now.getMinutes() > maxM);
}
