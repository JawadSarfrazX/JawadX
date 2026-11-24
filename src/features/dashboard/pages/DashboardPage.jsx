import useDashboard from "../hooks/useDashboard";
import { useAuth } from "../../../store/AuthContext";
import WelcomeBanner from "../components/WelcomeBanner";
import FunnelChart from "../components/FunnelChart";
import DonutChart from "../components/DonutChart";
import TopStudents from "../components/TopStudents";
import InsightCard from "../components/InsightCard";

const delay = (ms) => ({ animationDelay: `${ms}ms` });

export default function DashboardPage() {
  const { data } = useDashboard();
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <h1 className="anim-fade-up text-sm font-medium text-stone-500">Dashboard</h1>

      <div className="anim-fade-up" style={delay(80)}>
        <WelcomeBanner name={user.name.split(" ")[0]} stats={data.stats} />
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="anim-fade-up xl:col-span-3" style={delay(160)}>
          {data.funnel?.length > 0 && <FunnelChart stages={data.funnel} />}
        </div>

        <div className="anim-fade-up xl:col-span-2" style={delay(240)}>
          <DonutChart data={data.fees} />
        </div>

        <div className="anim-fade-up xl:col-span-3" style={delay(320)}>
          <TopStudents students={data.topStudents ?? []} />
        </div>

        <div className="anim-fade-up xl:col-span-2" style={delay(400)}>
          {data.insight && <InsightCard insight={data.insight} />}
        </div>
      </div>
    </div>
  );
}