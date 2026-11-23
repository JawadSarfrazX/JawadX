import Card from "../../../components/ui/Card";

export default function DonutChart({ data }) {
  let acc = 0;
  const stops = data.parts.map((p) => { const s = `${p.color} ${acc}% ${acc + p.value}%`; acc += p.value; return s; }).join(", ");
  return (
    <Card className="h-full">
      <h3 className="mb-4 font-bold">Fee Collection</h3>
      <div className="flex flex-wrap items-center justify-center gap-6">
        <div className="relative size-40 rounded-full" style={{ background: `conic-gradient(${stops})` }}>
          <div className="absolute inset-4 grid place-items-center rounded-full bg-white text-center">
            <div><p className="text-lg font-extrabold">{data.total}</p><p className="text-xs text-green-600">{data.growth}</p></div>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          {data.parts.map((p) => (
            <li key={p.label} className="flex items-center gap-2">
              <span className="size-2.5 rounded-full" style={{ background: p.color }} /> {p.label}
              <span className="ml-2 text-stone-400">{p.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
