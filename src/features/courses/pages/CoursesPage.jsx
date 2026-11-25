import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import { getTeachers } from "../../teachers/services/teachers.service";
import { getCourses, addCourse, updateCourse, deleteCourse } from "../services/courses.service";

const EMPTY = { code: "", title: "", teacher_id: "" };
const selectClass =
  "h-11 w-full rounded-xl bg-stone-100 px-3.5 text-sm outline-none ring-1 ring-transparent focus:ring-brand dark:bg-[#1e2330] dark:text-stone-100";

export default function CoursesPage() {
  const location = useLocation();
  const [rows, setRows] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "new" | course id
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [c, t] = await Promise.all([getCourses(), getTeachers()]);
      setRows(c);
      setTeachers(t);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Quick Add se aaye to Add course modal khol dein
  useEffect(() => {
    if (location.state?.openAdd) openNew();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  function openNew() {
    setForm(EMPTY);
    setError("");
    setModal("new");
  }

  function openEdit(c) {
    setForm({ code: c.code, title: c.title, teacher_id: c.teacher_id ?? "" });
    setError("");
    setModal(c.id);
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (modal === "new") await addCourse(form);
      else await updateCourse(modal, form);
      setModal(null);
      await load();
    } catch (err) {
      setError(err.code === "23505" ? "Ye course code pehle se mojood hai." : err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(c) {
    if (!window.confirm(`${c.code} delete karna hai?`)) return;
    try {
      await deleteCourse(c.id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Card>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold">Courses</h1>
        <div className="ml-auto">
          <Button onClick={openNew}>
            <Plus size={16} /> Add course
          </Button>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      {loading ? (
        <p className="py-10 text-center text-stone-500">Loading courses...</p>
      ) : rows.length === 0 ? (
        <p className="py-10 text-center text-sm text-stone-500 dark:text-stone-400">
          Abhi koi course nahi hai. Add course se banayein.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left text-xs uppercase tracking-wide text-stone-500 dark:border-white/10 dark:text-stone-400">
                <th className="pb-2 font-semibold">Code</th>
                <th className="pb-2 font-semibold">Title</th>
                <th className="pb-2 font-semibold">Teacher</th>
                <th className="pb-2 font-semibold">Students</th>
                <th className="pb-2 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50 dark:border-white/5 dark:hover:bg-white/[0.04]">
                  <td className="py-3">
                    <span className="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-bold text-stone-700 dark:bg-white/10 dark:text-stone-200">
                      {c.code}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-ink dark:text-white">{c.title}</td>
                  <td className="py-3 text-stone-600 dark:text-stone-300">{c.teacher?.name ?? "Not assigned"}</td>
                  <td className="py-3 font-semibold">{c.students}</td>
                  <td className="py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(c)} aria-label="Edit" className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 dark:hover:bg-white/10">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => remove(c)} aria-label="Delete" className="rounded-lg p-2 text-stone-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/15 dark:hover:text-red-400">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal !== null} title={modal === "new" ? "Add course" : "Edit course"} onClose={() => setModal(null)}>
        <form onSubmit={submit} className="space-y-4">
          <Input id="c-code" label="Course code" placeholder="CS101" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          <Input id="c-title" label="Course title" placeholder="Intro to AI" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-stone-600 dark:text-stone-300">Teacher</span>
            <select value={form.teacher_id} onChange={(e) => setForm({ ...form, teacher_id: e.target.value })} className={selectClass}>
              <option value="">Not assigned</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.name} ({t.dept})</option>
              ))}
            </select>
          </label>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Saving..." : "Save course"}
          </Button>
        </form>
      </Modal>
    </Card>
  );
}