import { supabase } from "../../../services/supabase";

export async function getTeachers() {
  const { data, error } = await supabase
    .from("teachers")
    .select("id, name, dept, email, profile_id, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addTeacher({ name, dept, email }) {
  const { data, error } = await supabase
    .from("teachers")
    .insert({ name, dept, email: email || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTeacher(id, { name, dept, email }) {
  const { error } = await supabase
    .from("teachers")
    .update({ name, dept, email: email || null })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteTeacher(id) {
  const { error } = await supabase.from("teachers").delete().eq("id", id);
  if (error) throw error;
}