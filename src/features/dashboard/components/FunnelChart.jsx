import Card from "../../../components/ui/Card";

export default function FunnelChart({ stages = [] }) {
  return (
    <Card className="h-full">
      <h3 className="mb-5 font-bold">Admissions Funnel</h3>
      <div className="space-y-3">
        {stages.map((s, i) => (
          <div key={s.name} className="flex items-center gap-3 text-sm">
            <span className="w-24 shrink-0 text-stone-600 dark:text-stone-300">{s.name}</span>
            <div className="h-9 flex-1 overflow-hidden rounded-lg bg-stone-100 dark:bg-white/[0.06]">
              <div
                className={`anim-bar flex h-full items-center justify-end rounded-lg pr-3 text-xs font-semibold text-white ${s.tone}`}
                style={{ width: `${s.percent}%`, animationDelay: `${i * 120}ms` }}
              >
                {s.percent}%
              </div>
            </div>
            <span className="w-10 text-right font-bold">{s.count}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}