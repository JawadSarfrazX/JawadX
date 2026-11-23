import { formatDate } from "../../../utils/helpers";

const tone = { Active: "bg-green-100 text-green-700", Graduating: "bg-orange-100 text-orange-700", "On leave": "bg-stone-200 text-stone-600" };

export default function StudentTable({ rows }) {
  if (!rows.length) return <p className="py-10 text-center text-stone-500">Koi student nahi mila. Search badal kar dekhein.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs text-stone-500">
          <tr><th className="py-2">Student</th><th>Department</th><th>Semester</th><th>Joined</th><th>Status</th></tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.id} className="border-t border-stone-100">
              <td className="py-3"><p className="font-semibold">{s.name}</p><p className="text-xs text-stone-500">{s.id}</p></td>
              <td>{s.dept}</td><td>{s.semester}</td><td>{formatDate(s.joined)}</td>
              <td><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tone[s.status]}`}>{s.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
