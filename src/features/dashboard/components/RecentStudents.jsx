import Card from "../../../components/ui/Card";

function initials(name = "") {
  return (
    name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "?"
  );
}

export default function RecentStudents({ students = [] }) {
  return (
    <Card className="anim-fade-up h-full">
      <h3 className="mb-4 font-bold">Recent Students</h3>

      {students.length === 0 ? (
        <p className="py-10 text-center text-sm text-stone-500 dark:text-stone-400">
          Abhi koi student nahi hai.
        </p>
      ) : (
        <ul className="space-y-3">
          {students.map((s) => (
            <li key={s.student_code} className="flex items-center gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-orange-600 text-xs font-bold text-white">
                {initials(s.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink dark:text-white">{s.name}</p>
                <p className="truncate text-xs text-stone-500 dark:text-stone-400">{s.dept}</p>
              </div>
              <span className="text-[11px] text-stone-400">{s.student_code}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}