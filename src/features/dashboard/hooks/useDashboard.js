import { useEffect, useState } from "react";
import { supabase } from "../../../services/supabase";

const STAGES = [
  { key: "applied", name: "Applied" },
  { key: "interviewed", name: "Interviewed" },
  { key: "admitted", name: "Admitted" },
  { key: "enrolled", name: "Enrolled" },
];

function lastSixMonths() {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const start = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    return {
      key: `${start.getFullYear()}-${start.getMonth()}`,
      label: start.toLocaleString("en", { month: "short" }),
      end,
      total: 0,
    };
  });
}

// Har mahine ke end tak total kitne rows thay (cumulative growth)
async function cumulativeTrend(table) {
  const { data, error } = await supabase.from(table).select("created_at");
  if (error) throw error;
  const months = lastSixMonths();
  const dates = (data ?? []).map((r) => new Date(r.created_at));
  return months.map((m) => dates.filter((d) => d < m.end).length);
}

// Aakhri mahine ka pichle mahine se percent farq
function growth(series) {
  const prev = series.at(-2);
  const cur = series.at(-1);
  if (!prev) return "";
  const pct = Math.round(((cur - prev) / prev) * 100);
  return `${pct >= 0 ? "+" : ""}${pct}%`;
}

async function countRows(table) {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

export default function useDashboard() {
  const [data, setData] = useState(null);
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
        const [studentTrend, teacherTrend, courseTrend] = await Promise.all([
          cumulativeTrend("students"),
          cumulativeTrend("teachers"),
          cumulativeTrend("courses"),
        ]);

        const { data: apps, error: appsErr } = await supabase
          .from("applications")
          .select("stage");
        if (appsErr) throw appsErr;

        const { data: fees, error: feesErr } = await supabase
          .from("fees")
          .select("amount, paid, created_at");
        if (feesErr) throw feesErr;

        const { data: recentStudents, error: rsErr } = await supabase
          .from("students")
          .select("student_code, name, dept, created_at")
          .order("created_at", { ascending: false })
          .limit(5);
        if (rsErr) throw rsErr;

        const { data: courseRows, error: crErr } = await supabase
          .from("courses")
          .select("id, code, title, teacher:teachers(name), enrollments(count)")
          .order("created_at", { ascending: false })
          .limit(6);
        if (crErr) throw crErr;

        // Funnel
        const total = apps.length;
        const funnel = STAGES.map((st, i) => {
          const count = apps.filter(
            (a) => STAGES.findIndex((s) => s.key === a.stage) >= i
          ).length;
          return {
            name: st.name,
            count,
            percent: total ? Math.round((count / total) * 100) : 0,
          };
        });

        // Fees: paid amount aur last 6 mahine ka breakdown
        const paid = fees.filter((f) => f.paid);
        const totalPaid = paid.reduce((s, f) => s + Number(f.amount), 0);
        const months = lastSixMonths();
        paid.forEach((f) => {
          const d = new Date(f.created_at);
          const m = months.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`);
          if (m) m.total += Number(f.amount);
        });
        const feeTrend = months.map((m) => m.total);
        const maxMonth = Math.max(0, ...feeTrend);

        if (!alive) return;
        setData({
          stats: [
            {
              label: "Total Students",
              value: students.toLocaleString(),
              delta: growth(studentTrend),
              trend: studentTrend,
            },
            {
              label: "Teachers",
              value: teachers.toLocaleString(),
              delta: growth(teacherTrend),
              trend: teacherTrend,
            },
            {
              label: "Active Courses",
              value: courses.toLocaleString(),
              delta: growth(courseTrend),
              trend: courseTrend,
            },
            {
              label: "Fees Collected",
              value: `Rs ${totalPaid.toLocaleString()}`,
              delta: growth(feeTrend),
              trend: feeTrend,
            },
          ],
          funnel,
          fees: { months, max: maxMonth },
          courses: (courseRows ?? []).map((c) => ({
            id: c.id,
            code: c.code,
            title: c.title,
            instructor: c.teacher?.name ?? "—",
            students: c.enrollments?.[0]?.count ?? 0,
          })),
          recentStudents: recentStudents ?? [],
          attendance: null,
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