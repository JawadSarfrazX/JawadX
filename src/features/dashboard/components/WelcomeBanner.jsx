import { useId } from "react";
import { CalendarDays, GraduationCap, Users, BookOpen, Wallet } from "lucide-react";

const ICONS = [GraduationCap, Users, BookOpen, Wallet];

function Sparkline({ points = [] }) {
  const id = useId();
  if (points.length < 2) return null;

  const w = 80;
  const h = 28;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  const coords = points.map((p, i) => [
    (i / (points.length - 1)) * w,
    h - ((p - min) / range) * (h - 4) - 2,
  ]);
  const line = coords.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-20 shrink-0 overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f28c28" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f28c28" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke="#f28c28" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function Delta({ value }) {
  if (!value) return null;
  const up = !value.startsWith("-");
  return (
    <span
      className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
        up ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
      }`}
    >
      {value}
    </span>
  );
}

export default function WelcomeBanner({ name, stats = [] }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="anim-fade-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-800 via-stone-900 to-black p-5 text-white sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold sm:text-2xl">Welcome back, {name}!</h2>
          <p className="mt-1 text-sm text-white/60">Here's your university summary for today.</p>
        </div>
        <span className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium">
          <CalendarDays size={14} /> {today}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = ICONS[i];
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2 text-xs text-white/70">
                  {Icon && <Icon size={15} className="shrink-0" />}
                  <span className="truncate">{s.label}</span>
                </div>
                <Delta value={s.delta} />
              </div>
              <div className="mt-2 flex items-end justify-between gap-2">
                <p className="text-2xl font-extrabold">{s.value}</p>
                <Sparkline points={s.trend} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}