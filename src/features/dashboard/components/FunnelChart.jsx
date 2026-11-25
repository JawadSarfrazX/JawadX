import Card from "../../../components/ui/Card";

export default function FunnelChart({ stages = [] }) {
  const empty = stages.every((s) => s.count === 0);

  return (
    <Card className="anim-fade-up h-full">
      <h3 className="mb-5 font-bold">Admissions Funnel</h3>

      {empty ? (
        <p className="py-10 text-center text-sm text-stone-500 dark:text-stone-400">
          Abhi applications ka data available nahi hai.
        </p>
      ) : (
        <div className="space-y-4">
          {stages.map((s, i) => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-sm font-medium text-stone-700 dark:text-stone-200">
                {s.name}
              </span>
              <div className="relative h-10 flex-1 overflow-hidden rounded-xl bg-stone-100 dark:bg-white/[0.06]">
                <div
                  className="anim-bar h-full rounded-xl bg-gradient-to-r from-brand to-amber-400"
                  style={{ width: `${s.percent}%`, animationDelay: `${i * 120}ms` }}
                />
                <span className="absolute inset-y-0 right-3 flex items-center text-sm font-bold text-stone-800 dark:text-white">
                  {s.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}