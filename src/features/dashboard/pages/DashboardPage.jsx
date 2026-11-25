import { useState } from "react";
import useDashboard from "../hooks/useDashboard";
import { useAuth } from "../../../store/AuthContext";
import { DEMO_DATA } from "../demoData";
import WelcomeBanner from "../components/WelcomeBanner";
import FunnelChart from "../components/FunnelChart";
import FeeChart from "../components/FeeChart";
import AttendanceCard from "../components/AttendanceCard";
import CoursesTable from "../components/CoursesTable";
import RecentStudents from "../components/RecentStudents";

const DEMO_KEY = "dashboardDemo";

export default function DashboardPage() {
  const { user } = useAuth();
  const live = useDashboard();
  const [demo, setDemo] = useState(() => localStorage.getItem(DEMO_KEY) === "on");

  const data = demo ? DEMO_DATA : live.data;
  const loading = !demo && live.loading;

  const toggleDemo = () => {
    const next = !demo;
    setDemo(next);
    localStorage.setItem(DEMO_KEY, next ? "on" : "off");
  };

  if (loading) {
    return <div className="py-20 text-center text-stone-500">Loading dashboard...</div>;
  }
  if (!data) {
    return <div className="py-20 text-center text-stone-500">Dashboard data load nahi ho saka.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-sm font-medium text-stone-500">Dashboard</h1>

        <button
          type="button"
          onClick={toggleDemo}
          className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-sm transition-colors hover:bg-stone-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-stone-200"
        >
          <span
            className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
              demo ? "bg-brand" : "bg-stone-300 dark:bg-white/20"
            }`}
          >
            <span
              className={`size-3 rounded-full bg-white shadow transition-transform duration-300 ${
                demo ? "translate-x-3.5" : "translate-x-0.5"
              }`}
            />
          </span>
          {demo ? "Demo data: ON" : "Live data"}
        </button>
      </div>

      {demo && (
        <div className="rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-2 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          Ye sample design preview hai. Database mein kuch save nahi ho raha.
        </div>
      )}

      <WelcomeBanner name={user.name.split(" ")[0]} stats={data.stats} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <FunnelChart stages={data.funnel} />
        </div>
        <FeeChart months={data.fees.months} max={data.fees.max} />
        <AttendanceCard percent={data.attendance} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <CoursesTable courses={data.courses} />
        </div>
        <RecentStudents students={data.recentStudents} />
      </div>
    </div>
  );
}