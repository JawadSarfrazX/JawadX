import Card from "../../../components/ui/Card";

const BAR_MAX_PX = 160;

export default function FeeChart({ months = [], max = 0 }) {
  return (
    <Card className="anim-fade-up h-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold">Fee Collection</h3>
        <span className="text-xs text-stone-500 dark:text-stone-400">Last 6 months</span>
      </div>

      {max === 0 ? (
        <p className="py-10 text-center text-sm text-stone-500 dark:text-stone-400">
          Abhi paid fees ka data available nahi hai.
        </p>
      ) : (
        <div className="flex items-end gap-3">
          {months.map((m) => {
            const h = m.total ? Math.max((m.total / max) * BAR_MAX_PX, 6) : 0;
            return (
              <div key={m.key} className="flex flex-1 flex-col items-center gap-2">
                <span className="h-4 text-[10px] font-semibold text-stone-500">
                  {m.total ? Math.round(m.total / 1000) + "k" : ""}
                </span>
                <div className="flex h-[160px] w-full items-end">
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-brand/60 to-amber-300 transition-all duration-700"
                    style={{ height: `${h}px` }}
                  />
                </div>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">{m.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}