import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import { getFees, getStudentOptions, addFee, setFeePaid, deleteFee } from "../services/fees.service";

const CATEGORIES = ["Tuition", "Hostel", "Exam", "Other"];
const EMPTY = { student_id: "", category: "Tuition", amount: "", due_date: "" };
const selectClass =
  "h-11 w-full rounded-xl bg-stone-100 px-3.5 text-sm outline-none ring-1 ring-transparent focus:ring-brand dark:bg-[#1e2330] dark:text-stone-100";

export default function FeesPage() {
  const [rows, setRows] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [f, s] = await Promise.all([getFees(), getStudentOptions()]);
      setRows(f);
      setStudents(s);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const paidTotal = rows.filter((r) => r.paid).reduce((s, r) => s + Number(r.amount), 0);
  const pendingTotal = rows.filter((r) => !r.paid).reduce((s, r) => s + Number(r.amount), 0);
  const fmt = (n) => `Rs ${Number(n).toLocaleString()}`;

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await addFee(form);
      setOpen(false);
      setForm(EMPTY);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function togglePaid(r) {
    try {
      await setFeePaid(r.id, !r.paid);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function remove(r) {
    if (!window.confirm("Ye fee record delete karna hai?")) return;
    try {
      await deleteFee(r.id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <p className="text-xs text-stone-500 dark:text-stone-400">Paid</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{fmt(paidTotal)}</p>
        </Card>
        <Card>
          <p className="text-xs text-stone-500 dark:text-stone-400">Pending</p>
          <p className="mt-1 text-2xl font-extrabold text-amber-600 dark:text-amber-400">{fmt(pendingTotal)}</p>
        </Card>
      </div>

      <Card>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold">Fees</h1>
          <div className="ml-auto">
            <Button onClick={() => { setForm(EMPTY); setError(""); setOpen(true); }}>
              <Plus size={16} /> Add fee
            </Button>
          </div>
        </div>

        {error && <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

        {loading ? (
          <p className="py-10 text-center text-stone-500">Loading fees...</p>
        ) : rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-stone-500 dark:text-stone-400">
            Abhi koi fee record nahi hai. Add fee se banayein.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-left text-xs uppercase tracking-wide text-stone-500 dark:border-white/10 dark:text-stone-400">
                  <th className="pb-2 font-semibold">Student</th>
                  <th className="pb-2 font-semibold">Category</th>
                  <th className="pb-2 font-semibold">Amount</th>
                  <th className="pb-2 font-semibold">Due</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50 dark:border-white/5 dark:hover:bg-white/[0.04]">
                    <td className="py-3">
                      <p className="font-semibold text-ink dark:text-white">{r.student?.name ?? "—"}</p>
                      <p className="text-xs text-stone-500">{r.student?.student_code}</p>
                    </td>
                    <td className="py-3 text-stone-600 dark:text-stone-300">{r.category}</td>
                    <td className="py-3 font-semibold">{fmt(r.amount)}</td>
                    <td className="py-3 text-stone-600 dark:text-stone-300">{r.due_date || "—"}</td>
                    <td className="py-3">
                      <button
                        onClick={() => togglePaid(r)}
                        className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                          r.paid
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-400/15 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {r.paid ? "Paid" : "Pending"}
                      </button>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end">
                        <button onClick={() => remove(r)} aria-label="Delete" className="rounded-lg p-2 text-stone-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/15 dark:hover:text-red-400">
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
      </Card>

      <Modal open={open} title="Add fee" onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-stone-600 dark:text-stone-300">Student</span>
            <select required value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })} className={selectClass}>
              <option value="" disabled>Student chunein</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.student_code})</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-stone-600 dark:text-stone-300">Category</span>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={selectClass}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <Input id="fee-amount" type="number" min="0" step="0.01" label="Amount (Rs)" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <Input id="fee-due" type="date" label="Due date (optional)" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={busy}>{busy ? "Saving..." : "Save fee"}</Button>
        </form>
      </Modal>
    </div>
  );
}