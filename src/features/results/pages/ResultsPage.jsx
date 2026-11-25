import { useEffect, useState } from "react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { useAuth } from "../../../store/AuthContext";
import { getMyCourses, getCourseStudents } from "../../../services/academic.service";
import { getResults, saveResults } from "../services/results.service";

const selectClass =
  "h-10 min-w-[220px] rounded-xl bg-stone-100 px-3 text-sm outline-none ring-1 ring-transparent focus:ring-brand dark:bg-[#1e2330] dark:text-stone-100";

export default function ResultsPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [maxMarks, setMaxMarks] = useState("100");
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
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
    setStudents([]);
    setMarks({});
    setLoaded(false);
    setMsg("");
    if (!courseId) return;
    getCourseStudents(courseId)
      .then(setStudents)
      .catch((e) => setMsg(e.message));
  }, [courseId]);

  async function load() {
    if (!title.trim()) return setMsg("Pehle assessment ka naam likhein.");
    setBusy(true);
    setMsg("");
    try {
      const existing = await getResults(students.map((s) => s.enrollmentId), title.trim());
      setMarks(existing);
      setLoaded(true);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    const max = Number(maxMarks);
    if (!title.trim() || !max) return setMsg("Assessment ka naam aur total marks dein.");
    const bad = Object.values(marks).find((v) => v !== "" && (Number(v) < 0 || Number(v) > max));
    if (bad !== undefined) return setMsg(`Marks 0 se ${max} ke darmiyan hon.`);

    setBusy(true);
    setMsg("");
    try {
      const n = await saveResults(title.trim(), max, marks);
      setMsg(n ? `${n} marks save ho gaye.` : "Pehle kuch marks likhein.");
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  }

  const noCourses = !loading && courses.length === 0;

  return (
    <Card>
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div>
          <h1 className="text-xl font-bold">Results</h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
           Select a course and assessment, then enter the marks.
          </p>
        </div>
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          disabled={noCourses}
          className={`${selectClass} ml-auto`}
        >
          {noCourses ? (
            <option value="">No course available</option>
          ) : (
            courses.map((c) => (
              <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
            ))
          )}
        </select>
      </div>

      {loading ? (
        <p className="py-10 text-center text-stone-500">Loading...</p>
      ) : noCourses ? (
        <p className="py-10 text-center text-sm text-stone-500 dark:text-stone-400">
          {user.role === "admin"
            ? "Abhi koi course nahi hai. Pehle Courses page par course banayein."
            : "Aap ke liye koi course assign nahi hua. Admin se rabta karein."}
        </p>
      ) : (
        <>
          <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_140px_auto]">
            <Input
              id="assess"
              label="Assessment"
              placeholder="e.g. Quiz 1, Midterm"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setLoaded(false); }}
            />
            <Input
              id="max"
              label="Total marks"
              type="number"
              min="1"
              value={maxMarks}
              onChange={(e) => setMaxMarks(e.target.value)}
            />
            <div className="flex items-end">
              <Button onClick={load} disabled={busy} className="w-full">Load marks</Button>
            </div>
          </div>

          {students.length === 0 ? (
            <p className="py-10 text-center text-sm text-stone-500 dark:text-stone-400">
              There are no students enrolled in this course.
            </p>
          ) : !loaded ? (
            <p className="py-10 text-center text-sm text-stone-500 dark:text-stone-400">
              Enter the assessment name and click "Load marks".
            </p>
          ) : (
            <>
              <div className="space-y-2">
                {students.map((s) => (
                  <div
                    key={s.enrollmentId}
                    className="flex items-center gap-3 rounded-2xl bg-stone-50 p-3 ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-ink dark:text-white">{s.name}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{s.code}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={marks[s.enrollmentId] ?? ""}
                        onChange={(e) => setMarks((m) => ({ ...m, [s.enrollmentId]: e.target.value }))}
                        placeholder="—"
                        className="h-10 w-24 rounded-xl bg-white px-3 text-center text-sm font-semibold outline-none ring-1 ring-stone-200 focus:ring-brand dark:bg-[#1e2330] dark:text-stone-100 dark:ring-white/10"
                      />
                      <span className="text-xs text-stone-500">/ {maxMarks}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-end gap-3">
                {msg && <p className="text-sm text-stone-600 dark:text-stone-300">{msg}</p>}
                <Button onClick={save} disabled={busy}>{busy ? "Saving..." : "Save marks"}</Button>
              </div>
            </>
          )}
        </>
      )}

      {msg && noCourses && <p className="mt-4 text-sm text-red-600">{msg}</p>}
    </Card>
  );
}