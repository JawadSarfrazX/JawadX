export default function StatCard({ icon: Icon, label, value, delta }) {
  const down = delta?.startsWith("-");
  return (
    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-xs text-white/70"><Icon size={15} /> {label}</div>
      <p className="mt-2 text-2xl font-extrabold">{value}</p>
      {delta && <p className={`text-xs ${down ? "text-red-400" : "text-green-400"}`}>{delta} this month</p>}
    </div>
  );
}
