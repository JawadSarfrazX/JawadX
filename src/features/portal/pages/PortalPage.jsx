import { Link } from "react-router-dom";
import Card from "../../../components/ui/Card";
import usePortalData from "../hooks/usePortalData";
import { useAuth } from "../../../store/AuthContext";
import { ROUTES } from "../../../constants/routes";

function Stat({ label, value }) {
  return (
    <div className="anim-fade-up rounded-2xl bg-stone-50 p-4 ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 dark:bg-white/[0.04] dark:ring-white/10">
      <p className="text-xs text-stone-500 dark:text-stone-400">{label}</p>
      <p className="mt-1 text-xl font-extrabold text-ink dark:text-white">{value || "—"}</p>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-stone-500 dark:text-stone-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold text-ink dark:text-white">{value || "—"}</dd>
    </div>
  );
}

export default function PortalPage() {
  const { user } = useAuth();
  const { record, courses, loading } = usePortalData(user);
  const isTeacher = user.role === "teacher";
  const firstName = user.name?.split(" ")[0] ?? "";

  if (loading) {
    return <Card><p className="py-10 text-center text-stone-500">Loading...</p></Card>;
  }

  if (!record) {
    return (
      <Card>
        <p className="py-10 text-center text-stone-500">
          Aapka record abhi nahi mila. Admin se rabta karein.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="anim-fade-up overflow-hidden bg-gradient-to-br from-stone-800 to-stone-950 text-white dark:from-stone-800 dark:to-stone-950">
        <p className="text-sm text-white/60">Welcome back</p>
        <h1 className="mt-1 text-3xl font-extrabold">{firstName}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand/20 px-3 py-1 text-xs font-semibold capitalize text-orange-300">
            {user.role}
          </span>
          <span className="text-xs text-white/60">{record.dept}</span>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label={isTeacher ? "Courses teaching" : "Enrolled courses"} value={String(courses.length)} />
        {isTeacher ? (
          <>
            <Stat label="Department" value={record.dept} />
            <Stat label="Status" value="Active" />
          </>
        ) : (
          <>
            <Stat label="Semester" value={String(record.semester)} />
            <Stat label="Status" value={record.status} />
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Profile details */}
        <Card className="anim-fade-up lg:col-span-2">
          <h2 className="mb-4 font-bold">Profile details</h2>
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Full name" value={user.name} />
            <Field label="Email" value={user.email} />
            <Field label="Department" value={record.dept} />
            {isTeacher ? (
              <Field label="Teacher record" value={record.email} />
            ) : (
              <>
                <Field label="Student ID" value={record.student_code} />
                <Field label="Semester" value={String(record.semester)} />
                <Field label="Status" value={record.status} />
                <Field label="Joined" value={record.joined} />
              </>
            )}
          </dl>
        </Card>

        {/* Courses preview */}
        <Card className="anim-fade-up lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">{isTeacher ? "Courses you teach" : "Your courses"}</h2>
            {courses.length > 0 && (
              <Link to={ROUTES.portalCourses} className="text-xs font-semibold text-brand hover:underline">
                View all
              </Link>
            )}
          </div>

          {courses.length === 0 ? (
            <p className="py-8 text-center text-sm text-stone-500 dark:text-stone-400">
              Abhi koi course assign nahi hua.
            </p>
          ) : (
            <div className="space-y-2">
              {courses.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 rounded-2xl bg-stone-50 p-3 ring-1 ring-black/5 transition-all duration-300 hover:translate-x-1 dark:bg-white/[0.04] dark:ring-white/10"
                >
                  <span className="rounded-lg bg-ink px-2 py-1 text-[11px] font-bold text-white">{c.code}</span>
                  <span className="flex-1 truncate text-sm font-semibold text-ink dark:text-white">{c.title}</span>
                  {c.teacher?.name && <span className="text-xs text-stone-500">{c.teacher.name}</span>}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}