import { useEffect, useState } from "react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { useAuth } from "../../../store/AuthContext";
import { getMyCourses, getCourseStudents } from "../../../services/academic.service";
import { getAttendance, saveAttendance } from "../services/attendance.service";

const STATUS = [
  { value: "present", label: "Present", on: "bg-emerald-500 text-white" },
  { value: "late", label: "Late", on: "bg-amber-400 text-white" },
  { value: "absent", label: "Absent", on: "bg-red-500 text-white" },
];

const selectClass =
  "h-10 min-w-[220px] rounded-xl bg-stone-100 px-3 text-sm outline-none ring-1 ring-transparent focus:ring-brand dark:bg-[#1e2330] dark:text-stone-100";

function todayLocal() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export default function AttendancePage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [date, setDate] = useState(todayLocal());
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    getMyCourses(user)
      .then((list) => {
        setCourses(list);
        if (list[0]) setCourseId(list[0].id);
      })
      .catch((e) => setMsg(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!courseId) return;
    let alive = true;
    setLoading(true);
    setMsg("");
    (async () => {
      try {
        const list = await getCourseStudents(courseId);
        const existing = await getAttendance(list.map((s) => s.enrollmentId), date);
        if (!alive) return;
        setStudents(list);
        setMarks(existing);
      } catch (e) {
        if (alive) setMsg(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [courseId, date]);

  const setStatus = (enrollmentId, status) =>
    setMarks((m) => ({ ...m, [enrollmentId]: status }));

  const count = (status) => Object.values(marks).filter((v) => v === status).length;
  const marked = Object.keys(marks).length;

  async function save() {
    setSaving(true);
    setMsg("");
    try {
      const n = await saveAttendance(date, marks);
      setMsg(n ? `${n} record saved.` : "select status first.");
    } catch (e) {
      setMsg(e.message);
    } finally {
      setSaving(false);
    }
  }

  const noCourses = !loading && courses.length === 0;

  return (
    <Card>
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div>
          <h1 className="text-xl font-bold">Attendance</h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Select a course and date, then mark each student's status.
          </p>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            disabled={noCourses}
            className={selectClass}
          >
            {noCourses ? (
              <option value="">No course available</option>
            ) : (
              courses.map((c) => (
                <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
              ))
            )}
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-10 rounded-xl bg-stone-100 px-3 text-sm outline-none ring-1 ring-transparent focus:ring-brand dark:bg-[#1e2330] dark:text-stone-100"
          />
        </div>
      </div>

      {loading ? (
        <p className="py-10 text-center text-stone-500">Loading...</p>
      ) : noCourses ? (
        <p className="py-10 text-center text-sm text-stone-500 dark:text-stone-400">
          {user.role === "admin"
            ? "Abhi koi course nahi hai. Pehle Courses page par course banayein."
            : "Aap ke liye koi course assign nahi hua. Admin se rabta karein."}
        </p>
      ) : students.length === 0 ? (
        <p className="py-10 text-center text-sm text-stone-500 dark:text-stone-400">
          Is course mein abhi koi student enrolled nahi hai.
        </p>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-600 dark:text-emerald-400">Present: {count("present")}</span>
            <span className="rounded-full bg-amber-400/15 px-3 py-1 text-amber-600 dark:text-amber-400">Late: {count("late")}</span>
            <span className="rounded-full bg-red-500/15 px-3 py-1 text-red-600 dark:text-red-400">Absent: {count("absent")}</span>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-stone-600 dark:bg-white/10 dark:text-stone-300">
              Unmarked: {students.length - marked}
            </span>
          </div>

          <div className="space-y-2">
            {students.map((s) => (
              <div
                key={s.enrollmentId}
                className="flex flex-wrap items-center gap-3 rounded-2xl bg-stone-50 p-3 ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink dark:text-white">{s.name}</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">{s.code}</p>
                </div>
                <div className="flex gap-1.5">
                  {STATUS.map((st) => (
                    <button
                      key={st.value}
                      type="button"
                      onClick={() => setStatus(s.enrollmentId, st.value)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        marks[s.enrollmentId] === st.value
                          ? st.on
                          : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100 dark:bg-white/[0.06] dark:text-stone-300 dark:ring-white/10"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-end gap-3">
            {msg && <p className="text-sm text-stone-600 dark:text-stone-300">{msg}</p>}
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save attendance"}
            </Button>
          </div>
        </>
      )}

      {msg && noCourses && <p className="mt-4 text-sm text-red-600">{msg}</p>}
    </Card>
  );
}