import { GraduationCap, Users, BookOpen, Wallet, CalendarDays } from "lucide-react";
import StatCard from "./StatCard";

const icons = { students: GraduationCap, teachers: Users, courses: BookOpen, fees: Wallet };

export default function WelcomeBanner({ name, stats }) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });
  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-stone-700 via-stone-800 to-stone-950 p-6 text-white">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Welcome back, {name}!</h2>
          <p className="text-sm text-white/70">Here's your university summary for today.</p>
        </div>
        <span className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-ink"><CalendarDays size={14} /> {today}</span>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => <StatCard key={s.key} icon={icons[s.key]} {...s} />)}
      </div>
    </section>
  );
}
