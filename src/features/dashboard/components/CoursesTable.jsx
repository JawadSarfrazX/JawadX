import Card from "../../../components/ui/Card";

export default function CoursesTable({ courses = [] }) {
  return (
    <Card className="anim-fade-up h-full">
      <h3 className="mb-4 font-bold">Courses</h3>

      {courses.length === 0 ? (
        <p className="py-10 text-center text-sm text-stone-500 dark:text-stone-400">
          Abhi koi course nahi bana.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left text-xs uppercase tracking-wide text-stone-500 dark:border-white/10 dark:text-stone-400">
                <th className="pb-2 font-semibold">Course</th>
                <th className="pb-2 font-semibold">Instructor</th>
                <th className="pb-2 text-right font-semibold">Students</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-stone-100 transition-colors last:border-0 hover:bg-stone-50 dark:border-white/5 dark:hover:bg-white/[0.04]"
                >
                  <td className="py-3">
                    <span className="font-semibold text-ink dark:text-white">{c.title}</span>
                    <span className="ml-2 rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-bold text-stone-600 dark:bg-white/10 dark:text-stone-300">
                      {c.code}
                    </span>
                  </td>
                  <td className="py-3 text-stone-600 dark:text-stone-300">{c.instructor}</td>
                  <td className="py-3 text-right font-semibold">{c.students}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}