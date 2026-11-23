import Card from "../../../components/ui/Card";

export default function TopStudents({ students }) {
  return (
    <Card className="h-full">
      <h3 className="mb-4 font-bold">Top Students</h3>
      <div className="space-y-3">
        {students.map((s, i) => (
          <div key={s.id} className="rounded-2xl bg-stone-50 p-3 ring-1 ring-black/5">
            <div className="flex items-center gap-3">
              <img src={s.img} alt={s.name} className="size-14 rounded-xl object-cover" />
              <div className="min-w-0">
                <p className="font-semibold">{s.name}</p>
                <p className="text-xs text-stone-500">ID: {s.id}</p>
                <p className="text-xs text-green-600">{s.dept}</p>
              </div>
              <span className="ml-auto self-start text-xs font-semibold text-stone-400">#{i + 1}</span>
            </div>
            <dl className="mt-3 grid grid-cols-2 text-center text-xs text-stone-500">
              <div><dd className="text-sm font-bold text-brand">{s.cgpa}</dd><dt>CGPA</dt></div>
              <div><dd className="text-sm font-bold text-ink">{s.attendance}</dd><dt>Attendance</dt></div>
            </dl>
          </div>
        ))}
      </div>
    </Card>
  );
}
