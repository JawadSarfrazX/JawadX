import { supabase } from "../../../services/supabase";

export async function getCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("id, code, title, teacher_id, teacher:teachers(id, name), enrollments(count)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((c) => ({
    ...c,
    students: c.enrollments?.[0]?.count ?? 0,
  }));
}

export async function addCourse({ code, title, teacher_id }) {
  const { data, error } = await supabase
    .from("courses")
    .insert({ code, title, teacher_id: teacher_id || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCourse(id, { code, title, teacher_id }) {
  const { error } = await supabase
    .from("courses")
    .update({ code, title, teacher_id: teacher_id || null })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteCourse(id) {
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) throw error;
}