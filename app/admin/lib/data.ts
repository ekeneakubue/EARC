export type AdminNavItem = {
  label: string;
  href: string;
  icon: "dashboard" | "users" | "services" | "inquiries" | "content" | "training" | "partners" | "reports" | "settings";
  badge?: number;
};

export const adminNav: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Users", href: "/admin/users", icon: "users", badge: 3 },
  { label: "Services", href: "/admin/services", icon: "services" },
  { label: "Inquiries", href: "/admin/inquiries", icon: "inquiries", badge: 12 },
  { label: "Content", href: "/admin/content", icon: "content" },
  { label: "Training", href: "/admin/training", icon: "training" },
  { label: "Partners", href: "/admin/partners", icon: "partners" },
  { label: "Reports", href: "/admin/reports", icon: "reports" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];

export const dashboardStats = [
  {
    label: "Total Users",
    value: "1,284",
    change: "+12.5%",
    trend: "up" as const,
    detail: "vs last month",
  },
  {
    label: "Open Inquiries",
    value: "47",
    change: "+8",
    trend: "up" as const,
    detail: "new this week",
  },
  {
    label: "Training Enrollments",
    value: "326",
    change: "+24.1%",
    trend: "up" as const,
    detail: "active cohorts",
  },
  {
    label: "Active Projects",
    value: "18",
    change: "-2",
    trend: "down" as const,
    detail: "MEL & research",
  },
];

export const monthlyInquiries = [
  { month: "Jan", value: 28 },
  { month: "Feb", value: 35 },
  { month: "Mar", value: 42 },
  { month: "Apr", value: 38 },
  { month: "May", value: 51 },
  { month: "Jun", value: 47 },
];

export const serviceDistribution = [
  { service: "MEL Services", percentage: 32, color: "bg-primary" },
  { service: "Training Programs", percentage: 26, color: "bg-primary-light" },
  { service: "Research & Analytics", percentage: 22, color: "bg-accent" },
  { service: "Policy Advisory", percentage: 12, color: "bg-emerald-500" },
  { service: "Other", percentage: 8, color: "bg-slate-400" },
];

export const recentInquiries = [
  {
    id: "INQ-1047",
    name: "Dr. Amara Okafor",
    organization: "Ministry of Education, Lagos",
    service: "MEL Framework Design",
    status: "New",
    date: "Jun 12, 2026",
  },
  {
    id: "INQ-1046",
    name: "James Mutiso",
    organization: "Green Africa Initiative",
    service: "GIS & Spatial Analysis",
    status: "In Review",
    date: "Jun 11, 2026",
  },
  {
    id: "INQ-1045",
    name: "Sarah Mensah",
    organization: "University of Ghana",
    service: "Research Methodology Training",
    status: "Responded",
    date: "Jun 10, 2026",
  },
  {
    id: "INQ-1044",
    name: "David Kamau",
    organization: "Kenya Dev Agency",
    service: "Impact Evaluation",
    status: "In Review",
    date: "Jun 9, 2026",
  },
  {
    id: "INQ-1043",
    name: "Fatima Bello",
    organization: "Community Health NGO",
    service: "Data Collection & Analytics",
    status: "Closed",
    date: "Jun 8, 2026",
  },
];

export const recentActivity = [
  {
    id: 1,
    action: "New inquiry submitted",
    detail: "Dr. Amara Okafor — MEL Framework Design",
    time: "12 min ago",
    type: "inquiry" as const,
  },
  {
    id: 2,
    action: "Training cohort published",
    detail: "Python for Data Science — Cohort 4",
    time: "1 hr ago",
    type: "training" as const,
  },
  {
    id: 3,
    action: "Content updated",
    detail: "Our Journey — Chapter 2 image replaced",
    time: "3 hrs ago",
    type: "content" as const,
  },
  {
    id: 4,
    action: "User role changed",
    detail: "Kofi Asante promoted to Editor",
    time: "5 hrs ago",
    type: "user" as const,
  },
  {
    id: 5,
    action: "Partner added",
    detail: "East Africa Research Network",
    time: "Yesterday",
    type: "partner" as const,
  },
];

export const adminUsers = [
  {
    id: "USR-001",
    name: "Super Admin",
    email: "admin@earc.org",
    role: "Super Admin",
    status: "Active",
    lastActive: "Just now",
  },
  {
    id: "USR-002",
    name: "Kofi Asante",
    email: "kofi@earc.org",
    role: "Editor",
    status: "Active",
    lastActive: "2 hrs ago",
  },
  {
    id: "USR-003",
    name: "Amina Yusuf",
    email: "amina@earc.org",
    role: "Trainer",
    status: "Active",
    lastActive: "Today",
  },
  {
    id: "USR-004",
    name: "Peter Okonkwo",
    email: "peter@earc.org",
    role: "Analyst",
    status: "Inactive",
    lastActive: "3 days ago",
  },
  {
    id: "USR-005",
    name: "Grace Mwangi",
    email: "grace@earc.org",
    role: "Editor",
    status: "Pending",
    lastActive: "Never",
  },
];

export const trainingPrograms = [
  {
    id: "TRN-01",
    title: "Python for Data Science",
    cohort: "Cohort 4",
    enrolled: 42,
    capacity: 50,
    startDate: "Jul 7, 2026",
    status: "Open",
  },
  {
    id: "TRN-02",
    title: "Monitoring & Evaluation Methods",
    cohort: "Cohort 2",
    enrolled: 35,
    capacity: 40,
    startDate: "Jul 14, 2026",
    status: "Open",
  },
  {
    id: "TRN-03",
    title: "GIS & Spatial Analysis",
    cohort: "Cohort 3",
    enrolled: 28,
    capacity: 30,
    startDate: "Jun 28, 2026",
    status: "Full",
  },
  {
    id: "TRN-04",
    title: "SPSS for Researchers",
    cohort: "Cohort 1",
    enrolled: 22,
    capacity: 35,
    startDate: "Aug 4, 2026",
    status: "Draft",
  },
];

export const contentPages = [
  { id: "PG-01", title: "Homepage Hero", section: "Hero", status: "Published", updated: "Jun 10, 2026" },
  { id: "PG-02", title: "Who We Are", section: "About", status: "Published", updated: "Jun 8, 2026" },
  { id: "PG-03", title: "Our Journey", section: "Story", status: "Published", updated: "Jun 12, 2026" },
  { id: "PG-04", title: "Our Services", section: "Services", status: "Published", updated: "Jun 5, 2026" },
  { id: "PG-05", title: "Contact Section", section: "Contact", status: "Draft", updated: "Jun 1, 2026" },
];

export const partners = [
  { id: "PTR-01", name: "University of Ghana", type: "University", region: "West Africa", status: "Active" },
  { id: "PTR-02", name: "Ministry of Education, Lagos", type: "Government", region: "West Africa", status: "Active" },
  { id: "PTR-03", name: "Green Africa Initiative", type: "NGO", region: "East Africa", status: "Active" },
  { id: "PTR-04", name: "East Africa Research Network", type: "Research", region: "East Africa", status: "Pending" },
];

export const statusStyles: Record<string, string> = {
  New: "bg-blue-100 text-blue-700",
  "In Review": "bg-amber-100 text-amber-700",
  Responded: "bg-emerald-100 text-emerald-700",
  Closed: "bg-slate-100 text-slate-600",
  Active: "bg-emerald-100 text-emerald-700",
  Inactive: "bg-slate-100 text-slate-600",
  Pending: "bg-amber-100 text-amber-700",
  Published: "bg-emerald-100 text-emerald-700",
  Draft: "bg-slate-100 text-slate-600",
  Open: "bg-emerald-100 text-emerald-700",
  Full: "bg-amber-100 text-amber-700",
};
