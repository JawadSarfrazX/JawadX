import { supabase } from "../../../services/supabase";

export async function getAttendance(enrollmentIds, date) {
  if (!enrollmentIds.length) return {};
  const { data, error } = await supabase
    .from("attendance")
    .select("enrollment_id, status")
    .in("enrollment_id", enrollmentIds)
    .eq("date", date);
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((r) => [r.enrollment_id, r.status]));
}

// statusMap: { enrollmentId: "present" | "late" | "absent" }
export async function saveAttendance(date, statusMap) {
  const rows = Object.entries(statusMap).map(([enrollment_id, status]) => ({
    enrollment_id,
    date,
    status,
  }));
  if (!rows.length) return 0;
  const { error } = await supabase
    .from("attendance")
    .upsert(rows, { onConflict: "enrollment_id,date" });
  if (error) throw error;
  return rows.length;
}