import useDashboard from "../hooks/useDashboard";
import { useAuth } from "../../../store/AuthContext";
import WelcomeBanner from "../components/WelcomeBanner";
import FunnelChart from "../components/FunnelChart";
import DonutChart from "../components/DonutChart";
import TopStudents from "../components/TopStudents";
import InsightCard from "../components/InsightCard";

export default function DashboardPage() {
  const { data } = useDashboard();
  const { user } = useAuth();
  return (
    <div className="space-y-4">
      <h1 className="text-sm font-medium text-stone-500">Dashboard</h1>
      <WelcomeBanner name={user.name.split(" ")[0]} stats={data.stats} />
      <div className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3"><FunnelChart stages={data.funnel} /></div>
        <div className="xl:col-span-2"><DonutChart data={data.fees} /></div>
        <div className="xl:col-span-3"><TopStudents students={data.topStudents} /></div>
        <div className="xl:col-span-2"><InsightCard insight={data.insight} /></div>
      </div>
    </div>
  );
}
