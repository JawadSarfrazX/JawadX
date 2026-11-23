import { LayoutDashboard, GraduationCap, Users, BookOpen, CalendarCheck, Award, Wallet } from "lucide-react";
import { ROUTES } from "./routes";

export const NAV = [
  { section: "Main Menu", items: [{ label: "Dashboard", to: ROUTES.dashboard, icon: LayoutDashboard }] },
  { section: "People", items: [
    { label: "Students", to: ROUTES.students, icon: GraduationCap },
    { label: "Teachers", to: ROUTES.teachers, icon: Users },
  ]},
  { section: "Academics", items: [
    { label: "Courses", to: ROUTES.courses, icon: BookOpen },
    { label: "Attendance", to: ROUTES.attendance, icon: CalendarCheck },
    { label: "Results", to: ROUTES.results, icon: Award },
  ]},
  { section: "Finance", items: [{ label: "Fees", to: ROUTES.fees, icon: Wallet }] },
];
