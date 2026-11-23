import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import useDebounce from "../../../hooks/useDebounce";
import useStudents from "../hooks/useStudents";
import StudentTable from "../components/StudentTable";

export default function StudentsPage() {
  const { students, loading, create } = useStudents();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", dept: "" });
  const q = useDebounce(query);

  const rows = useMemo(
    () => students.filter((s) => `${s.name} ${s.dept} ${s.id}`.toLowerCase().includes(q.toLowerCase())),
    [students, q]
  );

  async function submit(e) {
    e.preventDefault();
    await create(form);
    setForm({ name: "", dept: "" });
    setOpen(false);
  }

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold">Students</h1>
        <label className="ml-auto flex h-10 items-center gap-2 rounded-full bg-stone-100 px-4">
          <Search size={15} className="text-stone-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search students" className="bg-transparent text-sm outline-none" />
        </label>
        <Button onClick={() => setOpen(true)}><Plus size={16} /> Add student</Button>
      </div>
      {loading ? <p className="py-10 text-center text-stone-500">Loading students...</p> : <StudentTable rows={rows} />}

      <Modal open={open} title="Add student" onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="space-y-4">
          <Input id="name" label="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input id="dept" label="Department" required value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} />
          <Button type="submit" variant="brand" className="w-full">Save student</Button>
        </form>
      </Modal>
    </Card>
  );
}
