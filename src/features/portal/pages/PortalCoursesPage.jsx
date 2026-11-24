import Card from "../../../components/ui/Card";
import usePortalData from "../hooks/usePortalData";
import { useAuth } from "../../../store/AuthContext";

export default function PortalCoursesPage() {
  const { user } = useAuth();
  const { courses, loading } = usePortalData(user);
  const isTeacher = user.role === "teacher";

  return (
    <Card>
      <h1 className="mb-5 text-xl font-bold">{isTeacher ? "Courses you teach" : "My Courses"}</h1>

      {loading ? (
        <p className="py-10 text-center text-stone-500">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="py-10 text-center text-sm text-stone-500 dark:text-stone-400">
          Abhi koi course assign nahi hua.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((c, i) => (
            <div
              key={c.id}
              className="anim-fade-up rounded-2xl border border-stone-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.04]"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="inline-block rounded-lg bg-brand/15 px-2.5 py-1 text-[11px] font-bold text-orange-700 dark:text-orange-300">
                {c.code}
              </span>
              <h3 className="mt-3 font-bold text-ink dark:text-white">{c.title}</h3>
              <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
                {isTeacher ? "Aap is course ke teacher hain" : `Teacher: ${c.teacher?.name ?? "Not assigned"}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}