import { supabase } from "./supabase";

// Admin ko sab courses, teacher ko sirf apne courses
export async function getMyCourses(user) {
  let query = supabase.from("courses").select("id, code, title, teacher_id").order("code");

  if (user.role === "teacher") {
    const { data: t, error: tErr } = await supabase
      .from("teachers")
      .select("id")
      .eq("profile_id", user.id)
      .maybeSingle();
    if (tErr) throw tErr;
    if (!t) return [];
    query = query.eq("teacher_id", t.id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

// Course ke students, enrollment id ke saath
export async function getCourseStudents(courseId) {
  const { data, error } = await supabase
    .from("enrollments")
    .select("id, student:students(name, student_code)")
    .eq("course_id", courseId);
  if (error) throw error;

  return (data ?? [])
    .map((e) => ({
      enrollmentId: e.id,
      name: e.student?.name ?? "—",
      code: e.student?.student_code ?? "",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}