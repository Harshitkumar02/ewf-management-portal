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
  profilePhoto?: string;
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
];

const SEED_DISTRICTS: District[] = [];

const SEED_PROJECTS: Project[] = [];

const SEED_ATTENDANCE: AttendanceRecord[] = [];

const SEED_TASKS: Task[] = [];

const SEED_LEAVES: LeaveRequest[] = [];

const SEED_REPORTS: Report[] = [];

const SEED_GEOFENCES: GeoFence[] = [];

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
const RESET_VERSION_KEY = "ngo_db_reset_v7";
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

/** Returns local date as YYYY-MM-DD */
export function getLocalDate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Returns local time as HH:MM AM/PM */
export function getLocalTime(d: Date = new Date()): string {
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${String(h).padStart(2, "0")}:${m} ${ampm}`;
}
