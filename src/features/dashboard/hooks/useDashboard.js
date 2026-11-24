import { useEffect, useState } from "react";
import { supabase } from "../../../services/supabase";

const CATEGORIES = ["Tuition", "Hostel", "Exam", "Other"];
const CATEGORY_COLORS = {
  Tuition: "#f28c28",
  Hostel: "#26262b",
  Exam: "#8a8a8f",
  Other: "#d6d3d1",
};
const STAGES = [
  { key: "applied", name: "Applied", tone: "bg-brand" },
  { key: "interviewed", name: "Interviewed", tone: "bg-ink" },
  { key: "admitted", name: "Admitted", tone: "bg-ink" },
  { key: "enrolled", name: "Enrolled", tone: "bg-ink" },
];

async function countRows(table) {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

export default function useDashboard() {
  const [data, setData] = useState({
    stats: [],
    funnel: [],
    fees: { parts: [] },
    topStudents: [],
    insight: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const [students, teachers, courses] = await Promise.all([
          countRows("students"),
          countRows("teachers"),
          countRows("courses"),
        ]);

        const { data: apps, error: appsError } = await supabase
          .from("applications")
          .select("stage");
        if (appsError) throw appsError;

        const { data: fees, error: feesError } = await supabase
          .from("fees")
          .select("category, amount, paid");
        if (feesError) throw feesError;

        // Funnel: har stage tak pahunchne wale applications
        const total = apps.length;
        const funnel = STAGES.map((st, i) => {
          const count = apps.filter((a) => STAGES.findIndex((s) => s.key === a.stage) >= i).length;
          return {
            name: st.name,
            count,
            percent: total ? Math.round((count / total) * 100) : 0,
            tone: st.tone,
          };
        });

        // Fees: sirf paid amount
        const paid = fees.filter((f) => f.paid);
        const totalPaid = paid.reduce((sum, f) => sum + Number(f.amount), 0);
        const parts = CATEGORIES.map((cat) => ({
          label: cat,
          value: paid
            .filter((f) => f.category === cat)
            .reduce((sum, f) => sum + Number(f.amount), 0),
          color: CATEGORY_COLORS[cat],
        })).filter((p) => p.value > 0);

        if (!alive) return;
        setData({
          stats: [
            { key: "students", label: "Total Students", value: students.toLocaleString(), delta: "" },
            { key: "teachers", label: "Teachers", value: teachers.toLocaleString(), delta: "" },
            { key: "courses", label: "Active Courses", value: courses.toLocaleString(), delta: "" },
            {
              key: "fees",
              label: "Fees Collected",
              value: `Rs ${totalPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
              delta: "",
            },
          ],
          funnel,
          fees: { parts },
          topStudents: [],
          insight: null,
        });
      } catch (err) {
        console.error(err);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => { alive = false; };
  }, []);

  return { data, loading };
}