import { useEffect, useState } from "react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { supabase } from "../../../services/supabase";
import { useAuth } from "../../../store/AuthContext";

export default function PortalPage() {
  const { user, logout } = useAuth();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const table = user.role === "teacher" ? "teachers" : "students";
    supabase
      .from(table)
      .select("*")
      .eq("profile_id", user.id)
      .maybeSingle()
      .then(({ data }) => setRecord(data))
      .finally(() => setLoading(false));
  }, [user.id, user.role]);

  return (
    <div className="login-shell grid min-h-screen place-items-center bg-gradient-to-br from-orange-50 to-stone-200 p-4">
      <Card className="w-full max-w-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-stone-500">Welcome</p>
            <h1 className="text-2xl font-extrabold">{user.name}</h1>
            <span className="mt-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold capitalize text-orange-700">
              {user.role}
            </span>
          </div>
          <Button variant="ghost" onClick={logout}>Logout</Button>
        </div>

        <div className="mt-6 rounded-2xl bg-stone-50 p-4">
          {loading && <p className="text-sm text-stone-500">Loading...</p>}
          {!loading && !record && (
            <p className="text-sm text-stone-500">Aapka record abhi nahi mila. Admin se rabta karein.</p>
          )}
          {!loading && record && (
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-stone-500">Department</dt><dd className="font-semibold">{record.dept}</dd></div>
              {user.role === "student" && (
                <>
                  <div><dt className="text-stone-500">Student ID</dt><dd className="font-semibold">{record.student_code}</dd></div>
                  <div><dt className="text-stone-500">Semester</dt><dd className="font-semibold">{record.semester}</dd></div>
                  <div><dt className="text-stone-500">Status</dt><dd className="font-semibold">{record.status}</dd></div>
                </>
              )}
            </dl>
          )}
        </div>
      </Card>
    </div>
  );
}