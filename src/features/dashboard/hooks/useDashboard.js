import { useEffect, useState } from "react";
import { supabase } from "../../../services/supabase";
import { dashboardData } from "../data";

async function countRows(table) {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

export default function useDashboard() {
  const [data, setData] = useState({ ...dashboardData });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([countRows("students"), countRows("teachers"), countRows("courses")])
      .then(([students, teachers, courses]) => {
        setData((prev) => ({
          ...prev,
          stats: [
            { key: "students", label: "Total Students", value: students.toLocaleString(), delta: "" },
            { key: "teachers", label: "Teachers", value: teachers.toLocaleString(), delta: "" },
            { key: "courses", label: "Active Courses", value: courses.toLocaleString(), delta: "" },
            { key: "fees", label: "Fees Collected", value: "—", delta: "" },
          ],
        }));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
