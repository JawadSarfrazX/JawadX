import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, KeyRound } from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import { DEPARTMENTS } from "../../../constants/departments";
import { getTeachers, addTeacher, updateTeacher, deleteTeacher } from "../services/teachers.service";
import { resetUserPassword } from "../../admin/services/accounts.service";

const EMPTY = { name: "", dept: "", email: "" };
const selectClass =
  "h-11 w-full rounded-xl bg-stone-100 px-3.5 text-sm outline-none ring-1 ring-transparent focus:ring-brand dark:bg-[#1e2330] dark:text-stone-100";

export default function TeachersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null); // null | "new" | teacher id
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Password reset
  const [resetFor, setResetFor] = useState(null); // teacher row
  const [newPass, setNewPass] = useState("");
  const [resetMsg, setResetMsg] = useState("");

  async function load() {
    setLoading(true);
    try {
      setRows(await getTeachers());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      rows.filter((t) =>
        `${t.name} ${t.dept} ${t.email ?? ""}`.toLowerCase().includes(query.toLowerCase())
      ),
    [rows, query]
  );

  function openNew() {
    setForm(EMPTY);
    setError("");
    setModal("new");
  }

  function openEdit(t) {
    setForm({ name: t.name, dept: t.dept, email: t.email ?? "" });
    setError("");
    setModal(t.id);
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (modal === "new") await addTeacher(form);
      else await updateTeacher(modal, form);
      setModal(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(t) {
    if (!window.confirm(`${t.name} ko delete karna hai?`)) return;
    try {
      await deleteTeacher(t.id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  function openReset(t) {
    setResetFor(t);
    setNewPass("");
    setResetMsg("");
  }

  async function submitReset(e) {
    e.preventDefault();
    setBusy(true);
    setResetMsg("");
    try {
      await resetUserPassword(resetFor.profile_id, newPass);
      setResetMsg("Password change ho gaya. Teacher ko naya password bata dein.");
      setNewPass("");
    } catch (err) {
      setResetMsg(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold">Teachers</h1>
        <label className="ml-auto flex h-10 items-center gap-2 rounded-full bg-stone-100 px-4 dark:bg-white/[0.06]">
          <Search size={15} className="text-stone-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teachers"
            className="bg-transparent text-sm outline-none"
          />
        </label>
        <Button onClick={openNew}>
          <Plus size={16} /> Add teacher
        </Button>
      </div>

      {error && <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      {loading ? (
        <p className="py-10 text-center text-stone-500">Loading teachers...</p>
      ) : filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-stone-500 dark:text-stone-400">
          {rows.length === 0 ? "Abhi koi teacher nahi hai. Add teacher se banayein." : "Koi match nahi mila."}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left text-xs uppercase tracking-wide text-stone-500 dark:border-white/10 dark:text-stone-400">
                <th className="pb-2 font-semibold">Name</th>
                <th className="pb-2 font-semibold">Department</th>
                <th className="pb-2 font-semibold">Email</th>
                <th className="pb-2 font-semibold">Login</th>
                <th className="pb-2 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50 dark:border-white/5 dark:hover:bg-white/[0.04]">
                  <td className="py-3 font-semibold text-ink dark:text-white">{t.name}</td>
                  <td className="py-3 text-stone-600 dark:text-stone-300">{t.dept}</td>
                  <td className="py-3 text-stone-600 dark:text-stone-300">{t.email || "—"}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                        t.profile_id
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-stone-100 text-stone-500 dark:bg-white/10 dark:text-stone-400"
                      }`}
                    >
                      {t.profile_id ? "Linked" : "No account"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openReset(t)}
                        disabled={!t.profile_id}
                        aria-label="Reset password"
                        title={t.profile_id ? "Password reset" : "Login account linked nahi hai"}
                        className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 disabled:opacity-30 dark:hover:bg-white/10"
                      >
                        <KeyRound size={15} />
                      </button>
                      <button onClick={() => openEdit(t)} aria-label="Edit" className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 dark:hover:bg-white/10">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => remove(t)} aria-label="Delete" className="rounded-lg p-2 text-stone-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/15 dark:hover:text-red-400">
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

      {/* Add / Edit */}
      <Modal open={modal !== null} title={modal === "new" ? "Add teacher" : "Edit teacher"} onClose={() => setModal(null)}>
        <form onSubmit={submit} className="space-y-4">
          <Input id="t-name" label="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-stone-600 dark:text-stone-300">Department</span>
            <select required value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} className={selectClass}>
              <option value="" disabled>Select department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
          <Input id="t-email" type="email" label="Email (optional)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Saving..." : "Save teacher"}
          </Button>
        </form>
      </Modal>

      {/* Password reset */}
      <Modal open={resetFor !== null} title={`Password reset: ${resetFor?.name ?? ""}`} onClose={() => setResetFor(null)}>
        <form onSubmit={submitReset} className="space-y-4">
          <Input
            id="new-pass"
            type="password"
            label="Naya password (kam az kam 6 characters)"
            minLength={6}
            required
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
          {resetMsg && <p className="text-sm text-stone-600 dark:text-stone-300">{resetMsg}</p>}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Changing..." : "Password change karein"}
          </Button>
        </form>
      </Modal>
    </Card>
  );
}