import { supabase } from "../../../services/supabase";

export async function getResults(enrollmentIds, title) {
  if (!enrollmentIds.length || !title) return {};
  const { data, error } = await supabase
    .from("results")
    .select("enrollment_id, marks")
    .in("enrollment_id", enrollmentIds)
    .eq("title", title);
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((r) => [r.enrollment_id, String(r.marks)]));
}

// marksMap: { enrollmentId: "45" } (khali values skip hongi)
export async function saveResults(title, maxMarks, marksMap) {
  const rows = Object.entries(marksMap)
    .filter(([, v]) => v !== "" && v != null)
    .map(([enrollment_id, v]) => ({
      enrollment_id,
      title,
      max_marks: Number(maxMarks),
      marks: Number(v),
    }));
  if (!rows.length) return 0;
  const { error } = await supabase
    .from("results")
    .upsert(rows, { onConflict: "enrollment_id,title" });
  if (error) throw error;
  return rows.length;
}